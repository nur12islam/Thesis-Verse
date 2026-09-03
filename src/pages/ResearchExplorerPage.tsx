import React, { useEffect, useMemo, useState } from "react";
import { Search, Sparkles, BookOpen, ExternalLink, ShieldCheck, AlertCircle, Loader2, ArrowRight, Database, Brain, CheckCircle2 } from "lucide-react";
import { fetchMultiAgentSearch } from "../services/api";
import { Thesis } from "../types/thesis";

interface ResearchExplorerPageProps {
  initialQuery?: string;
  onShowToast?: (title: string, message?: string, type?: "success" | "error" | "info") => void;
}

type Source = {
  id: string;
  title: string;
  authors: string[];
  year: number | null;
  abstract: string;
  venue: string;
  url: string;
  doi?: string;
  citations: number;
  source: "ThesisVerse" | "OpenAlex" | "Crossref";
  type: string;
  relevance?: number;
};

type TopicAnalysis = {
  topic?: string;
  summary?: string;
  researchQuestion?: string;
  researchGaps?: string[];
  suggestedTopics?: string[];
  keywords?: string[];
  [key: string]: unknown;
};

const cleanText = (value: unknown) => typeof value === "string" ? value.replace(/\s+/g, " ").trim() : "";

function invertAbstract(index: Record<string, number> | undefined) {
  if (!index) return "";
  const words: string[] = [];
  Object.entries(index).forEach(([word, positions]) => {
    const list = Array.isArray(positions) ? positions : [positions];
    list.forEach((position) => { words[position] = word; });
  });
  return words.filter(Boolean).join(" ");
}

export const ResearchExplorerPage: React.FC<ResearchExplorerPageProps> = ({ initialQuery = "", onShowToast }) => {
  const [query, setQuery] = useState(initialQuery);
  const [sources, setSources] = useState<Source[]>([]);
  const [analysis, setAnalysis] = useState<TopicAnalysis | null>(null);
  const [consensus, setConsensus] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [activeTab, setActiveTab] = useState<"all" | "theses" | "research" | "gaps">("all");

  const search = async (rawQuery = query) => {
    const q = rawQuery.trim();
    if (!q) return;
    setQuery(q);
    setSearched(true);
    setLoading(true);
    setAnalysis(null);
    setConsensus(null);

    try {
      const localPromise = fetch(`/api/search?q=${encodeURIComponent(q)}&minYear=1900&maxYear=2026&limit=20`)
        .then((r) => r.ok ? r.json() : { data: [], total: 0 })
        .catch(() => ({ data: [], total: 0 }));

      const openAlexPromise = fetch(`https://api.openalex.org/works?search=${encodeURIComponent(q)}&per-page=12&sort=relevance_score`)
        .then((r) => r.ok ? r.json() : { results: [] })
        .catch(() => ({ results: [] }));

      const crossrefPromise = fetch(`https://api.crossref.org/works?query.bibliographic=${encodeURIComponent(q)}&rows=12&select=DOI,title,author,published,container-title,URL,type,is-referenced-by-count`)
        .then((r) => r.ok ? r.json() : { message: { items: [] } })
        .catch(() => ({ message: { items: [] } }));

      const [local, openAlex, crossref] = await Promise.all([localPromise, openAlexPromise, crossrefPromise]);

      const localSources: Source[] = (local.data || []).map((p: any) => ({
        id: `tv-${p.id}`,
        title: cleanText(p.title),
        authors: p.authors || [],
        year: p.year || null,
        abstract: cleanText(p.abstract),
        venue: cleanText(p.university || p.publisher) || "ThesisVerse",
        url: p.sourceUrl || p.pdfUrl || "#",
        doi: p.doi,
        citations: Number(p.citationsCount || 0),
        source: "ThesisVerse",
        type: p.documentType || "Research",
      }));

      const oaSources: Source[] = (openAlex.results || []).map((w: any) => ({
        id: `oa-${w.id}`,
        title: cleanText(w.display_name),
        authors: (w.authorships || []).slice(0, 5).map((a: any) => cleanText(a.author?.display_name)).filter(Boolean),
        year: w.publication_year || null,
        abstract: invertAbstract(w.abstract_inverted_index),
        venue: cleanText(w.primary_location?.source?.display_name || w.host_venue?.display_name) || "OpenAlex",
        url: w.primary_location?.landing_page_url || w.doi || w.id,
        doi: w.doi,
        citations: Number(w.cited_by_count || 0),
        source: "OpenAlex",
        type: cleanText(w.type) || "Research work",
        relevance: Number(w.relevance_score || 0),
      }));

      const crSources: Source[] = (crossref.message?.items || []).map((w: any, i: number) => ({
        id: `cr-${w.DOI || i}`,
        title: cleanText(Array.isArray(w.title) ? w.title[0] : w.title),
        authors: (w.author || []).slice(0, 5).map((a: any) => cleanText([a.given, a.family].filter(Boolean).join(" "))).filter(Boolean),
        year: w.published?.["date-parts"]?.[0]?.[0] || w.published?.["date-parts"]?.[0]?.[0] || null,
        abstract: cleanText(w.abstract?.replace(/<[^>]+>/g, " ")),
        venue: cleanText(Array.isArray(w["container-title"]) ? w["container-title"][0] : w["container-title"]) || "Crossref",
        url: w.URL || (w.DOI ? `https://doi.org/${w.DOI}` : "#"),
        doi: w.DOI,
        citations: Number(w["is-referenced-by-count"] || 0),
        source: "Crossref",
        type: cleanText(w.type) || "Research work",
      }));

      const merged = [...localSources, ...oaSources, ...crSources];
      const seen = new Set<string>();
      const deduped = merged.filter((s) => {
        const key = (s.doi || s.title).toLowerCase().replace(/[^a-z0-9]+/g, "");
        if (!key || seen.has(key)) return false;
        seen.add(key);
        return true;
      });

      setSources(deduped);
      setLoading(false);

      setAnalysisLoading(true);
      const thesisLike: Thesis[] = deduped.slice(0, 12).map((s, i) => ({
        id: s.id,
        title: s.title,
        authors: s.authors,
        university: s.venue,
        publisher: s.source,
        year: s.year || 0,
        abstract: s.abstract,
        keywords: q.split(/\s+/),
        subject: "English Literature" as any,
        degree: "Master's",
        doi: s.doi || "",
        sourceUrl: s.url,
        language: "English",
        citationsCount: s.citations,
        noveltyScore: Math.min(100, 40 + i * 3),
        difficultyScore: 50,
        confidenceScore: 80,
        researchGap: "",
        futureDirections: [],
        methodology: "",
        keyFindings: [],
        bibtex: "",
      }));

      const [topicResult, agentResult] = await Promise.allSettled([
        fetch(`/api/ai/analyze-topic`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ topic: q }) }).then((r) => r.ok ? r.json() : null),
        fetchMultiAgentSearch(q, thesisLike),
      ]);

      if (topicResult.status === "fulfilled") setAnalysis(topicResult.value);
      if (agentResult.status === "fulfilled") setConsensus(agentResult.value);
      setAnalysisLoading(false);
    } catch (error: any) {
      setLoading(false);
      setAnalysisLoading(false);
      onShowToast?.("Research search failed", error?.message || "Please try again.", "error");
    }
  };

  useEffect(() => {
    if (initialQuery.trim()) search(initialQuery);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialQuery]);

  const thesisCount = useMemo(() => sources.filter((s) => s.type.toLowerCase().includes("thesis") || s.type.toLowerCase().includes("dissertation")).length, [sources]);
  const displayedSources = activeTab === "theses"
    ? sources.filter((s) => /thesis|dissertation/i.test(s.type))
    : activeTab === "research"
      ? sources.filter((s) => !/thesis|dissertation/i.test(s.type))
      : sources;

  return (
    <div className="min-h-[calc(100vh-120px)] pb-16 space-y-6">
      <section className="max-w-4xl mx-auto pt-6 sm:pt-10 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-300 border border-indigo-500/20 text-[11px] font-bold uppercase tracking-wider mb-4">
          <Sparkles className="w-3.5 h-3.5" /> AI Research Explorer
        </div>
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
          Start with an idea.<br /><span className="text-indigo-600 dark:text-indigo-400">We map the research.</span>
        </h1>
        <p className="mt-3 text-sm sm:text-base text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
          Type anything — even two words. ThesisVerse searches your research index plus OpenAlex and Crossref, then uses AI to identify what is known, what is missing, and where a strong topic may exist.
        </p>

        <form onSubmit={(e) => { e.preventDefault(); search(); }} className="mt-7 p-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Try: Baul song" className="w-full h-12 pl-12 pr-4 rounded-xl bg-transparent outline-none text-sm sm:text-base text-slate-900 dark:text-white placeholder-slate-400" />
          </div>
          <button disabled={loading || !query.trim()} className="px-5 sm:px-7 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm disabled:opacity-50 flex items-center gap-2">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            Search
          </button>
        </form>
      </section>

      {!searched && (
        <section className="max-w-4xl mx-auto grid sm:grid-cols-3 gap-3 pt-2">
          {["Baul song", "AI in education", "Women in Bengali theatre"].map((example) => (
            <button key={example} onClick={() => search(example)} className="text-left p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-400 transition-colors group">
              <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Try a topic</span>
              <p className="mt-1 font-bold text-slate-800 dark:text-slate-200 group-hover:text-indigo-500">{example}</p>
            </button>
          ))}
        </section>
      )}

      {searched && (
        <main className="max-w-6xl mx-auto space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div>
              <p className="text-xs text-slate-500">Research map for</p>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white">{query}</h2>
            </div>
            <div className="flex gap-2 text-[11px] font-bold">
              <span className="px-2.5 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">{sources.length} sources</span>
              <span className="px-2.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-300">{thesisCount} theses</span>
            </div>
          </div>

          {analysisLoading && (
            <div className="rounded-2xl bg-slate-900 text-white p-5 flex items-center gap-4">
              <div className="p-3 rounded-xl bg-indigo-500/20"><Brain className="w-6 h-6 text-indigo-300 animate-pulse" /></div>
              <div><p className="font-bold">AI is comparing the evidence…</p><p className="text-xs text-slate-400 mt-1">Checking topic meaning, relevance, gaps and agreement across the available research.</p></div>
            </div>
          )}

          {analysis && (
            <section className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 sm:p-6">
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-600"><Sparkles className="w-5 h-5" /></div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap"><h3 className="font-black text-lg text-slate-900 dark:text-white">What the research says</h3><span className="text-[10px] px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-600 font-bold">AI synthesis</span></div>
                  <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{cleanText(analysis.summary || analysis.researchQuestion || "The available literature has been mapped. Review the sources and research gaps below.")}</p>
                </div>
              </div>
              {Array.isArray(analysis.researchGaps) && analysis.researchGaps.length > 0 && (
                <div className="mt-5 pt-5 border-t border-slate-100 dark:border-slate-800">
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-3">Promising gaps</h4>
                  <div className="grid sm:grid-cols-2 gap-2">{analysis.researchGaps.slice(0, 6).map((gap, i) => <div key={i} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 text-sm text-slate-700 dark:text-slate-300 flex gap-2"><span className="text-indigo-500 font-black">{i + 1}</span>{cleanText(gap)}</div>)}</div>
                </div>
              )}
            </section>
          )}

          {consensus && (
            <section className="rounded-2xl bg-slate-950 text-white border border-indigo-500/20 p-5 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3"><ShieldCheck className="w-6 h-6 text-emerald-400" /><div><h3 className="font-black">Cross-check layer</h3><p className="text-xs text-slate-400">Independent AI perspectives are compared before the synthesis is shown.</p></div></div>
                <div className="text-left sm:text-right"><div className="text-2xl font-black text-emerald-400">{Number(consensus.consensusScore || 0)}%</div><div className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">agreement</div></div>
              </div>
              {consensus.consensusSummary && <p className="mt-4 text-sm text-slate-300 leading-6">{cleanText(consensus.consensusSummary)}</p>}
              {Array.isArray(consensus.agents) && <div className="mt-4 grid grid-cols-2 sm:grid-cols-5 gap-2">{consensus.agents.map((agent: any) => <div key={agent.agentId} className="rounded-xl bg-white/5 border border-white/10 p-3"><p className="text-[10px] text-slate-500 uppercase font-bold">{cleanText(agent.model || agent.agentId)}</p><p className="text-sm font-bold mt-1">{Number(agent.confidenceScore || 0)}%</p></div>)}</div>}
            </section>
          )}

          <section className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div><h3 className="font-black text-lg text-slate-900 dark:text-white">Existing research</h3><p className="text-xs text-slate-500 mt-1">Direct records from ThesisVerse, OpenAlex and Crossref.</p></div>
              <div className="flex gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-950">{([['all','All'],['theses','Theses'],['research','Articles']] as const).map(([id,label]) => <button key={id} onClick={() => setActiveTab(id)} className={`px-3 py-1.5 rounded-lg text-xs font-bold ${activeTab === id ? 'bg-white dark:bg-slate-800 shadow text-indigo-600' : 'text-slate-500'}`}>{label}</button>)}</div>
            </div>

            {loading ? <div className="p-10 text-center"><Loader2 className="w-7 h-7 animate-spin mx-auto text-indigo-500" /></div> : displayedSources.length === 0 ? (
              <div className="p-8 text-center"><AlertCircle className="w-8 h-8 mx-auto text-amber-500" /><h4 className="font-bold mt-3 text-slate-900 dark:text-white">No direct records found</h4><p className="text-sm text-slate-500 mt-1">The AI gap-analysis layer can still investigate the topic from its available knowledge.</p></div>
            ) : <div className="divide-y divide-slate-100 dark:divide-slate-800">{displayedSources.slice(0, 20).map((source) => <article key={source.id} className="p-4 sm:p-5 hover:bg-slate-50/70 dark:hover:bg-slate-950/50 transition-colors"><div className="flex flex-col lg:flex-row lg:items-start gap-4"><div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-600 shrink-0"><BookOpen className="w-5 h-5" /></div><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2 mb-1"><span className={`text-[10px] px-2 py-1 rounded-full font-bold ${source.source === 'ThesisVerse' ? 'bg-indigo-500/10 text-indigo-600' : source.source === 'OpenAlex' ? 'bg-cyan-500/10 text-cyan-600' : 'bg-amber-500/10 text-amber-600'}`}>{source.source}</span><span className="text-[10px] text-slate-400">{source.type}</span>{source.year && <span className="text-[10px] text-slate-400">{source.year}</span>}</div><h4 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white leading-6">{source.title}</h4><p className="text-xs text-slate-500 mt-1">{source.authors.length ? source.authors.join(', ') : 'Author information unavailable'}{source.venue ? ` · ${source.venue}` : ''}</p>{source.abstract && <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-5 mt-3 line-clamp-3">{source.abstract}</p>}<div className="mt-3 flex flex-wrap items-center gap-3 text-[10px] font-bold text-slate-400"><span className="flex items-center gap-1"><Database className="w-3.5 h-3.5" /> {source.citations} citations</span>{source.doi && <span>DOI available</span>}</div></div><a href={source.url} target="_blank" rel="noreferrer" className="shrink-0 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:border-indigo-400 hover:text-indigo-500 flex items-center gap-1.5"><ExternalLink className="w-3.5 h-3.5" /> Open source</a></div></article>)}</div>}
          </section>

          {!analysisLoading && !analysis && sources.length > 0 && <div className="rounded-2xl border border-amber-200 dark:border-amber-900/50 bg-amber-50 dark:bg-amber-950/20 p-4 text-sm text-amber-800 dark:text-amber-300 flex gap-3"><AlertCircle className="w-5 h-5 shrink-0" /><p>AI synthesis was unavailable for this run. The source results above are still usable; no unsupported AI claims are being presented as verified facts.</p></div>}

          <button onClick={() => { setActiveTab("gaps"); document.getElementById("gap-panel")?.scrollIntoView({ behavior: "smooth" }); }} className="w-full p-4 rounded-2xl border border-dashed border-indigo-300 dark:border-indigo-700 text-indigo-600 dark:text-indigo-300 font-bold text-sm hover:bg-indigo-50 dark:hover:bg-indigo-950/30 flex items-center justify-center gap-2">Turn this research map into a research topic <ArrowRight className="w-4 h-4" /></button>

          <div id="gap-panel" className="rounded-2xl bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/50 p-5">
            <h3 className="font-black text-indigo-900 dark:text-indigo-200">Researcher note</h3>
            <p className="text-sm text-indigo-800/80 dark:text-indigo-300/80 mt-2 leading-6">A high-confidence research direction should be based on the cited literature, not on agreement between AI models alone. ThesisVerse therefore keeps source records visible and treats AI output as analysis to be checked against those records.</p>
            <div className="mt-3 flex items-center gap-2 text-xs font-bold text-indigo-700 dark:text-indigo-300"><CheckCircle2 className="w-4 h-4" /> Sources remain the evidence layer</div>
          </div>
        </main>
      )}
    </div>
  );
};
