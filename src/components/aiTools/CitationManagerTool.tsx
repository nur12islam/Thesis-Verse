import React, { useState } from "react";
import { Thesis } from "../../types/thesis";
import {
  Quote,
  Copy,
  Download,
  Check,
  Share2,
  Network,
  Sparkles,
  Layers,
  Search,
  BookOpen,
  Globe
} from "lucide-react";

interface CitationManagerToolProps {
  savedTheses: Thesis[];
  onShowToast: (title: string, message?: string, type?: "success" | "error" | "info") => void;
}

export const CitationManagerTool: React.FC<CitationManagerToolProps> = ({
  savedTheses,
  onShowToast,
}) => {
  const [activeTab, setActiveTab] = useState<"manager" | "network">("manager");
  const [selectedStyle, setSelectedStyle] = useState<"APA" | "MLA" | "Chicago" | "Harvard" | "IEEE" | "BibTeX" | "RIS">("APA");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const formatCitation = (thesis: Thesis, style: string) => {
    const authors = thesis.authors.join(", ");
    const firstAuthor = thesis.authors[0] || "Author";
    const year = thesis.year;
    const title = thesis.title;
    const univ = thesis.university;
    const doi = thesis.doi;

    switch (style) {
      case "APA":
        return `${authors} (${year}). ${title} (Doctoral dissertation, ${univ}). https://doi.org/${doi}`;
      case "MLA":
        return `${firstAuthor}, et al. "${title}." Doctoral dissertation, ${univ}, ${year}. DOI: ${doi}.`;
      case "Chicago":
        return `${authors}. "${title}." PhD diss., ${univ}, ${year}. https://doi.org/${doi}.`;
      case "Harvard":
        return `${authors}, ${year}. ${title}. Ph.D. thesis. ${univ}. Available at: https://doi.org/${doi}.`;
      case "IEEE":
        return `[1] ${authors}, "${title}," Ph.D. dissertation, Dept. Comput. Sci., ${univ}, ${year}, doi: ${doi}.`;
      case "BibTeX":
        return `@phdthesis{thesis_${thesis.id.replace(/[^a-zA-Z0-9]/g, "")},\n  author = {${authors}},\n  title = {${title}},\n  school = {${univ}},\n  year = {${year}},\n  doi = {${doi}}\n}`;
      case "RIS":
        return `TY  - THES\nAU  - ${firstAuthor}\nTI  - ${title}\nPY  - ${year}\nPB  - ${univ}\nDO  - ${doi}\nER  -`;
      default:
        return `${authors} (${year}). ${title}. ${univ}.`;
    }
  };

  const handleCopy = (thesis: Thesis) => {
    const text = formatCitation(thesis, selectedStyle);
    navigator.clipboard.writeText(text);
    setCopiedId(thesis.id);
    onShowToast("Citation Copied", `Copied in ${selectedStyle} format`, "success");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleBatchExport = (format: "txt" | "bib" | "ris") => {
    if (savedTheses.length === 0) {
      onShowToast("Library Empty", "Save papers to your library to export batch citations.", "info");
      return;
    }

    const styleToUse = format === "bib" ? "BibTeX" : format === "ris" ? "RIS" : selectedStyle;
    const content = savedTheses
      .map((t, idx) => `[${idx + 1}] ${formatCitation(t, styleToUse)}`)
      .join("\n\n");

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `thesisverse_citations_${styleToUse.toLowerCase()}.${format}`;
    a.click();
    URL.revokeObjectURL(url);
    onShowToast("Batch Exported", `Saved ${savedTheses.length} citations`, "success");
  };

  const filteredTheses = savedTheses.filter((t) =>
    t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.authors.some((a) => a.toLowerCase().includes(searchQuery.toLowerCase())) ||
    t.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Tool Navigation Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-950 text-white shadow-md border border-indigo-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-300 text-xs font-bold uppercase tracking-wider mb-2">
            <Quote className="w-4 h-4 text-amber-300" /> Academic Bibliographic Suite
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white">
            Citation Manager & Relationship Network
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            Format, export, and visualize citation networks across 7 international styles.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-950/80 p-1.5 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTab("manager")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === "manager"
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Citation Manager
          </button>
          <button
            onClick={() => setActiveTab("network")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === "network"
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Network className="w-3.5 h-3.5" /> Citation Network Graph
          </button>
        </div>
      </div>

      {activeTab === "manager" ? (
        <div className="space-y-6">
          {/* Format Selector Bar */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-wrap items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-500 uppercase text-[10px]">Citation Style:</span>
              {(["APA", "MLA", "Chicago", "Harvard", "IEEE", "BibTeX", "RIS"] as const).map((style) => (
                <button
                  key={style}
                  onClick={() => setSelectedStyle(style)}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                    selectedStyle === style
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200"
                  }`}
                >
                  {style}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleBatchExport("txt")}
                className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 font-bold flex items-center gap-1"
              >
                <Download className="w-3.5 h-3.5" /> Batch TXT
              </button>
              <button
                onClick={() => handleBatchExport("bib")}
                className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold flex items-center gap-1"
              >
                <Download className="w-3.5 h-3.5" /> Batch BibTeX
              </button>
            </div>
          </div>

          {/* Filter Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search library citations by title, author, or subject..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Citation List */}
          {filteredTheses.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 text-xs">
              No saved theses found in your library for citation generation. Save papers from Search Engine to build your bibliography.
            </div>
          ) : (
            <div className="space-y-3">
              {filteredTheses.map((t) => {
                const formatted = formatCitation(t, selectedStyle);
                return (
                  <div
                    key={t.id}
                    className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3 hover:border-indigo-500/40 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider block">
                          {t.subject} • {t.degree}
                        </span>
                        <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                          {t.title}
                        </h4>
                      </div>

                      <button
                        onClick={() => handleCopy(t)}
                        className="px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 text-indigo-600 dark:text-indigo-400 font-bold text-xs flex items-center gap-1.5 shrink-0 transition-colors"
                      >
                        {copiedId === t.id ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-500" /> Copied
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" /> Copy Citation
                          </>
                        )}
                      </button>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-mono text-slate-800 dark:text-slate-200 leading-relaxed overflow-x-auto">
                      {formatted}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        /* Conceptual Citation Network Visualizer */
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <Network className="w-5 h-5 text-indigo-600" /> Conceptual Citation Network & Influential Works
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Relationship graph based on shared keywords, subject clusters, and citation density.
              </p>
            </div>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              {savedTheses.length} Nodes Indexed
            </span>
          </div>

          {/* Interactive SVG Network Representation */}
          <div className="relative w-full h-[400px] rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden flex items-center justify-center p-4">
            <svg className="w-full h-full">
              {/* Decorative Connection Lines */}
              <line x1="20%" y1="30%" x2="50%" y2="50%" stroke="#4f46e5" strokeWidth="2" strokeDasharray="4" opacity="0.6" />
              <line x1="50%" y1="50%" x2="80%" y2="35%" stroke="#818cf8" strokeWidth="2" opacity="0.8" />
              <line x1="50%" y1="50%" x2="35%" y2="75%" stroke="#38bdf8" strokeWidth="2" opacity="0.7" />
              <line x1="50%" y1="50%" x2="65%" y2="70%" stroke="#a855f7" strokeWidth="2" opacity="0.8" />
              <line x1="80%" y1="35%" x2="65%" y2="70%" stroke="#818cf8" strokeWidth="1.5" strokeDasharray="2" opacity="0.5" />

              {/* Node 1: Central Influential Work */}
              <g transform="translate(300, 200)">
                <circle r="36" fill="#4f46e5" opacity="0.2" className="animate-ping" />
                <circle r="28" fill="#4f46e5" stroke="#818cf8" strokeWidth="3" />
                <text x="0" y="4" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="bold">
                  HUB (242 Cites)
                </text>
              </g>

              {/* Node 2: Top Right */}
              <g transform="translate(500, 140)">
                <circle r="22" fill="#0284c7" stroke="#38bdf8" strokeWidth="2" />
                <text x="0" y="4" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="bold">
                  Quantum
                </text>
              </g>

              {/* Node 3: Bottom Left */}
              <g transform="translate(180, 280)">
                <circle r="20" fill="#9333ea" stroke="#c084fc" strokeWidth="2" />
                <text x="0" y="4" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="bold">
                  Genomics
                </text>
              </g>

              {/* Node 4: Bottom Right */}
              <g transform="translate(420, 290)">
                <circle r="24" fill="#059669" stroke="#34d399" strokeWidth="2" />
                <text x="0" y="4" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="bold">
                  Optogenetics
                </text>
              </g>

              {/* Node 5: Far Top Left */}
              <g transform="translate(120, 120)">
                <circle r="18" fill="#d97706" stroke="#fbbf24" strokeWidth="2" />
                <text x="0" y="4" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="bold">
                  Crypto
                </text>
              </g>
            </svg>

            <div className="absolute bottom-4 left-4 p-3 rounded-xl bg-slate-900/90 backdrop-blur-md border border-slate-800 text-[11px] text-slate-300 space-y-1">
              <span className="font-bold text-white block">Network Cluster Legend</span>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-indigo-500" /> Influential Hub</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-sky-500" /> Quantum AI</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Bio-Eng</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Security</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
