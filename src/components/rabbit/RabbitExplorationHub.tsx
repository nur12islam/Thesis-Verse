import React, { useState } from "react";
import { Thesis, RabbitAuthorItem, RabbitSynthesisReport, RabbitGraphNode } from "../../types/thesis";
import {
  Sparkles,
  BookOpen,
  ArrowUpRight,
  Clock,
  Users,
  Compass,
  Search,
  SlidersHorizontal,
  Bookmark,
  BookmarkCheck,
  Quote,
  Check,
  Plus,
  Zap,
  Layers,
  Flame,
  ChevronRight,
  Loader2
} from "lucide-react";

interface RabbitExplorationHubProps {
  activeTab: "similar" | "earlier" | "later" | "authors" | "synthesis";
  onChangeTab: (tab: "similar" | "earlier" | "later" | "authors" | "synthesis") => void;
  similarTheses: (Thesis & { similarityScore: number; sharedKeywords: string[] })[];
  earlierTheses: (Thesis & { referenceStrength: number })[];
  laterTheses: (Thesis & { citationInfluence: number })[];
  authors: RabbitAuthorItem[];
  synthesisReport: RabbitSynthesisReport | null;
  loadingSynthesis: boolean;
  onRefreshSynthesis: () => void;
  onSelectThesis: (thesis: Thesis) => void;
  onAddSeed: (thesis: Thesis) => void;
  onPivotExplore: (thesis: Thesis) => void;
  savedIds: Set<string>;
  onToggleSave: (thesis: Thesis) => void;
  onShowToast: (title: string, message?: string, type?: "success" | "error" | "info") => void;
  selectedNodeId: string | null;
}

export const RabbitExplorationHub: React.FC<RabbitExplorationHubProps> = ({
  activeTab,
  onChangeTab,
  similarTheses,
  earlierTheses,
  laterTheses,
  authors,
  synthesisReport,
  loadingSynthesis,
  onRefreshSynthesis,
  onSelectThesis,
  onAddSeed,
  onPivotExplore,
  savedIds,
  onToggleSave,
  onShowToast,
  selectedNodeId,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"similarity" | "citations" | "year" | "novelty">("similarity");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const TABS = [
    { id: "similar", label: "Similar Work", count: similarTheses.length, icon: Sparkles, color: "text-sky-500" },
    { id: "earlier", label: "Earlier Work", count: earlierTheses.length, icon: Clock, color: "text-amber-500" },
    { id: "later", label: "Later Work", count: laterTheses.length, icon: ArrowUpRight, color: "text-purple-500" },
    { id: "authors", label: "These Authors", count: authors.length, icon: Users, color: "text-indigo-500" },
    { id: "synthesis", label: "AI Synthesis", count: null, icon: Zap, color: "text-emerald-500" },
  ] as const;

  const handleCopyCitation = (thesis: Thesis) => {
    const text = `${thesis.authors.join(", ")} (${thesis.year}). ${thesis.title}. ${thesis.university}. https://doi.org/${thesis.doi}`;
    navigator.clipboard.writeText(text);
    setCopiedId(thesis.id);
    onShowToast("Citation Copied", "APA format copied to clipboard", "success");
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Filter & Sort list
  const getProcessedList = () => {
    let list: any[] = [];
    if (activeTab === "similar") list = [...similarTheses];
    else if (activeTab === "earlier") list = [...earlierTheses];
    else if (activeTab === "later") list = [...laterTheses];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.authors.some((a: string) => a.toLowerCase().includes(q)) ||
          t.subject.toLowerCase().includes(q)
      );
    }

    list.sort((a, b) => {
      if (sortBy === "citations") return b.citationsCount - a.citationsCount;
      if (sortBy === "year") return b.year - a.year;
      if (sortBy === "novelty") return b.noveltyScore - a.noveltyScore;
      return (b.similarityScore || b.referenceStrength || b.citationInfluence || 0) -
        (a.similarityScore || a.referenceStrength || a.citationInfluence || 0);
    });

    return list;
  };

  const processedList = getProcessedList();

  return (
    <div className="w-full h-full flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
      {/* Category Tabs Header ("Spotify for Papers") */}
      <div className="p-2 border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/50 flex items-center gap-1 overflow-x-auto scrollbar-none">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onChangeTab(tab.id as any)}
              className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shrink-0 transition-all ${
                isActive
                  ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm border border-slate-200 dark:border-slate-700"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800/60"
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${tab.color}`} />
              <span>{tab.label}</span>
              {tab.count !== null && (
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                    isActive
                      ? "bg-indigo-600 text-white"
                      : "bg-slate-200 dark:bg-slate-800 text-slate-500"
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Filter and Search Bar */}
      {activeTab !== "synthesis" && activeTab !== "authors" && (
        <div className="p-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2 text-xs">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder={`Search ${activeTab} papers...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs focus:ring-1 focus:ring-indigo-500"
          >
            <option value="similarity">Best Match</option>
            <option value="citations">Most Cited</option>
            <option value="year">Newest Year</option>
            <option value="novelty">Highest Novelty</option>
          </select>
        </div>
      )}

      {/* Main Tab Content */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3 scrollbar-thin">
        {/* TAB 1, 2, 3: Papers Lists */}
        {activeTab !== "synthesis" && activeTab !== "authors" && (
          <>
            {processedList.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">
                No matching papers found in this category.
              </div>
            ) : (
              processedList.map((thesis) => {
                const isSelected = selectedNodeId === thesis.id;
                const isSaved = savedIds.has(thesis.id);

                return (
                  <div
                    key={thesis.id}
                    onClick={() => onSelectThesis(thesis)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer space-y-2 group ${
                      isSelected
                        ? "bg-indigo-50/60 dark:bg-indigo-950/40 border-indigo-500 ring-1 ring-indigo-500/50 shadow-md"
                        : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-indigo-400 hover:shadow-sm"
                    }`}
                  >
                    {/* Header Badges */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {activeTab === "similar" && thesis.similarityScore && (
                          <span className="px-2 py-0.5 rounded-md bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 font-extrabold text-[10px] border border-sky-200 dark:border-sky-800">
                            {thesis.similarityScore}% Match
                          </span>
                        )}
                        {activeTab === "earlier" && (
                          <span className="px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 font-extrabold text-[10px] border border-amber-200 dark:border-amber-800">
                            Foundational Reference • {thesis.year}
                          </span>
                        )}
                        {activeTab === "later" && (
                          <span className="px-2 py-0.5 rounded-md bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 font-extrabold text-[10px] border border-purple-200 dark:border-purple-800">
                            Subsequent Citation • {thesis.year}
                          </span>
                        )}
                        <span className="text-[10px] text-slate-500 font-medium">
                          {thesis.citationsCount} Citations
                        </span>
                      </div>

                      {/* Action Icon Buttons */}
                      <div className="flex items-center gap-1 opacity-90 group-hover:opacity-100">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onAddSeed(thesis);
                            onShowToast("Added as Seed", `Added "${thesis.title.slice(0, 30)}..."`, "success");
                          }}
                          className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 text-emerald-600 dark:text-emerald-400 transition-colors"
                          title="Add to Collection as Seed"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onPivotExplore(thesis);
                            onShowToast("Pivoting Literature Graph", `Exploring network from "${thesis.title.slice(0, 30)}..."`, "info");
                          }}
                          className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 text-indigo-600 dark:text-indigo-400 transition-colors"
                          title="Follow Rabbit Hole (Explore this network)"
                        >
                          <Compass className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCopyCitation(thesis);
                          }}
                          className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-600 dark:text-slate-300 transition-colors"
                          title="Copy Citation"
                        >
                          {copiedId === thesis.id ? (
                            <Check className="w-3.5 h-3.5 text-emerald-500" />
                          ) : (
                            <Quote className="w-3.5 h-3.5" />
                          )}
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleSave(thesis);
                          }}
                          className={`p-1.5 rounded-lg transition-colors ${
                            isSaved
                              ? "bg-amber-100 dark:bg-amber-950/80 text-amber-600"
                              : "bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-600 dark:text-slate-300"
                          }`}
                          title={isSaved ? "Saved in Library" : "Save to Library"}
                        >
                          {isSaved ? (
                            <BookmarkCheck className="w-3.5 h-3.5" />
                          ) : (
                            <Bookmark className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Paper Title */}
                    <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white line-clamp-2 leading-snug">
                      {thesis.title}
                    </h4>

                    {/* Authors & University */}
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                      {thesis.authors.join(", ")} • {thesis.university}
                    </p>

                    {/* Abstract snippet */}
                    <p className="text-[11px] text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed font-serif">
                      {thesis.abstract}
                    </p>

                    {/* Tags */}
                    {thesis.keywords && thesis.keywords.length > 0 && (
                      <div className="flex items-center gap-1 flex-wrap pt-1">
                        {thesis.keywords.slice(0, 3).map((kw: string) => (
                          <span
                            key={kw}
                            className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[9px] font-semibold"
                          >
                            {kw}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </>
        )}

        {/* TAB 4: Authors Network Directory */}
        {activeTab === "authors" && (
          <div className="space-y-3">
            {authors.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">
                No authors indexed for this collection.
              </div>
            ) : (
              authors.map((author) => (
                <div
                  key={author.name}
                  className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2.5 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 to-violet-500 text-white font-bold text-xs flex items-center justify-center">
                        {author.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                          {author.name}
                        </h4>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                          {author.affiliation}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-bold text-[10px] border border-indigo-200 dark:border-indigo-800">
                        h-index ≈ {author.hIndexEstimate}
                      </span>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        {author.totalCitations} total citations
                      </p>
                    </div>
                  </div>

                  {/* Sample Papers */}
                  <div className="space-y-1 pt-1 border-t border-slate-100 dark:border-slate-800/80">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Publications in Graph ({author.paperCount}):
                    </span>
                    {author.samplePapers.map((sp) => (
                      <p key={sp.id} className="text-[11px] text-slate-700 dark:text-slate-300 font-medium truncate flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />
                        {sp.title} ({sp.year})
                      </p>
                    ))}
                  </div>

                  {/* Co-Authors */}
                  {author.coAuthors.length > 0 && (
                    <div className="flex items-center gap-1 flex-wrap pt-1">
                      <span className="text-[10px] text-slate-400">Co-authors:</span>
                      {author.coAuthors.slice(0, 3).map((co) => (
                        <span key={co} className="text-[10px] font-semibold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                          {co}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {/* TAB 5: AI Literature Synthesis & Gap Engine */}
        {activeTab === "synthesis" && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 text-white border border-indigo-500/20 shadow-md space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-indigo-300 text-xs font-bold uppercase tracking-wider">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  Gemini Cross-Literature Intelligence
                </div>

                <button
                  onClick={onRefreshSynthesis}
                  disabled={loadingSynthesis}
                  className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-[11px] flex items-center gap-1 transition-all"
                >
                  {loadingSynthesis ? (
                    <>
                      <Loader2 className="w-3 h-3 animate-spin" /> Synthesizing...
                    </>
                  ) : (
                    <>
                      <Zap className="w-3 h-3" /> Re-Synthesize
                    </>
                  )}
                </button>
              </div>

              {synthesisReport ? (
                <div className="space-y-3 text-xs">
                  <div>
                    <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider block mb-1">
                      Thematic Synthesis
                    </span>
                    <p className="text-slate-200 leading-relaxed font-sans">
                      {synthesisReport.thematicSummary}
                    </p>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block mb-1">
                      Methodological Progression
                    </span>
                    <p className="text-slate-300 leading-relaxed">
                      {synthesisReport.methodologicalTrajectory}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-slate-400">
                  Click Re-Synthesize to generate deep thematic and gap intelligence across your active seed papers.
                </p>
              )}
            </div>

            {/* Identified Gaps & Recommended Hypotheses */}
            {synthesisReport && (
              <div className="grid grid-cols-1 gap-3">
                {/* Gaps */}
                <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                  <h5 className="font-extrabold text-xs text-slate-900 dark:text-white flex items-center gap-1.5 text-amber-600 dark:text-amber-400">
                    <Flame className="w-4 h-4" /> Unexplored Research Gaps
                  </h5>
                  <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                    {synthesisReport.identifiedGaps.map((gap, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="w-4 h-4 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                          {i + 1}
                        </span>
                        <span className="leading-snug">{gap}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Hypotheses */}
                <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                  <h5 className="font-extrabold text-xs text-slate-900 dark:text-white flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                    <Sparkles className="w-4 h-4" /> Recommended Testable Hypotheses
                  </h5>
                  <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                    {synthesisReport.recommendedHypotheses.map((hyp, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                          ★
                        </span>
                        <span className="leading-snug font-medium">{hyp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
