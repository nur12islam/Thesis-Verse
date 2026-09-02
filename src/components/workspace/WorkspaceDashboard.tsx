import React from "react";
import {
  FileText,
  GraduationCap,
  Sparkles,
  BookOpen,
  Folder,
  CheckCircle2,
  Clock,
  Search,
  ArrowRight,
  Bookmark,
  Award,
  TrendingUp,
  Star,
  Plus
} from "lucide-react";
import {
  SavedPaper,
  SavedIdeaItem,
  SavedProposalItem,
  WorkspaceCollection,
  WorkspaceStats
} from "../../types/workspace";

interface WorkspaceDashboardProps {
  stats: WorkspaceStats;
  papers: SavedPaper[];
  ideas: SavedIdeaItem[];
  proposals: SavedProposalItem[];
  collections: WorkspaceCollection[];
  recentSearches: string[];
  onSelectView: (view: string) => void;
  onSelectItem: (item: any, type: "paper" | "thesis" | "idea" | "proposal") => void;
  onExecuteSearch: (query: string) => void;
  userName?: string;
  onOpenCreateCollection: () => void;
  onOpenImportExport: () => void;
}

export const WorkspaceDashboard: React.FC<WorkspaceDashboardProps> = ({
  stats,
  papers,
  ideas,
  proposals,
  collections,
  recentSearches,
  onSelectView,
  onSelectItem,
  onExecuteSearch,
  userName = "Academic Researcher",
  onOpenCreateCollection,
  onOpenImportExport
}) => {
  const lastActivePaper = papers[0];
  const lastActiveProposal = proposals[0];

  return (
    <div className="space-y-8 pb-10">
      {/* Welcome Banner & Continue Research */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-900 text-white shadow-xl relative overflow-hidden space-y-6">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 font-semibold text-xs mb-3">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" /> AI-Powered Personal Research Hub
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome Back, {userName}
            </h1>
            <p className="text-xs text-indigo-200 mt-1 max-w-2xl">
              You have <span className="font-bold text-white">{stats.savedPapersCount} papers</span>,{" "}
              <span className="font-bold text-white">{stats.savedIdeasCount} AI ideas</span>, and{" "}
              <span className="font-bold text-white">{stats.activeProposalsCount} active proposals</span> in your workspace.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onOpenImportExport}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition-all"
            >
              Import Library
            </button>
            <button
              onClick={() => onSelectView("papers")}
              className="px-4 py-2.5 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white font-extrabold text-xs shadow-lg shadow-indigo-500/30 transition-all flex items-center gap-1.5"
            >
              View Full Library <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Continue Research Hero Strip */}
        {(lastActivePaper || lastActiveProposal) && (
          <div className="pt-4 border-t border-white/10 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs relative z-10">
            {lastActivePaper && (
              <div
                onClick={() => onSelectItem(lastActivePaper, "paper")}
                className="p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all cursor-pointer group space-y-1.5"
              >
                <div className="flex items-center justify-between text-[10px] text-indigo-300 font-bold uppercase tracking-wider">
                  <span>Continue Reading Paper</span>
                  <span className="text-amber-300 capitalize">{lastActivePaper.readingProgress}</span>
                </div>
                <h4 className="font-bold text-sm text-white group-hover:text-indigo-200 transition-colors line-clamp-1">
                  {lastActivePaper.thesis.title}
                </h4>
                <p className="text-[11px] text-slate-300 line-clamp-1">
                  {lastActivePaper.thesis.university} ({lastActivePaper.thesis.year}) • {lastActivePaper.thesis.authors.join(", ")}
                </p>
              </div>
            )}

            {lastActiveProposal && (
              <div
                onClick={() => onSelectItem(lastActiveProposal, "proposal")}
                className="p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all cursor-pointer group space-y-1.5"
              >
                <div className="flex items-center justify-between text-[10px] text-emerald-300 font-bold uppercase tracking-wider">
                  <span>Active Proposal Draft</span>
                  <span className="text-emerald-300 font-bold">{lastActiveProposal.proposal.qualityScore?.overallScore || 90}/100 Score</span>
                </div>
                <h4 className="font-bold text-sm text-white group-hover:text-indigo-200 transition-colors line-clamp-1">
                  {lastActiveProposal.proposal.title}
                </h4>
                <p className="text-[11px] text-slate-300 line-clamp-1">
                  {lastActiveProposal.proposal.degree} Level • {lastActiveProposal.status}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* KPI Research Statistics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Saved Papers</span>
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white">{stats.savedPapersCount}</p>
          <p className="text-[10px] text-slate-500">{stats.savedThesesCount} doctoral theses saved</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Saved AI Ideas</span>
            <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white">{stats.savedIdeasCount}</p>
          <p className="text-[10px] text-slate-500">Rare thesis opportunities</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Active Proposals</span>
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white">{stats.activeProposalsCount}</p>
          <p className="text-[10px] text-slate-500">Phase 5 research drafts</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Reading Completed</span>
            <div className="p-2 rounded-xl bg-sky-50 dark:bg-sky-950 text-sky-600 dark:text-sky-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white">{stats.completedReadingCount}</p>
          <p className="text-[10px] text-slate-500">~{stats.estimatedHoursSpent} hours research logged</p>
        </div>
      </div>

      {/* Recent Searches Chips */}
      {recentSearches.length > 0 && (
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Search className="w-3.5 h-3.5 text-indigo-500" /> Recent Library Searches
            </span>
            <span className="text-[10px] text-slate-400">Click to run search</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {recentSearches.map((query, i) => (
              <button
                key={i}
                onClick={() => onExecuteSearch(query)}
                className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-950 dark:hover:text-indigo-400 text-slate-700 dark:text-slate-300 font-semibold text-xs border border-slate-200/60 dark:border-slate-700/60 transition-colors flex items-center gap-1"
              >
                <Search className="w-3 h-3 text-slate-400" />
                <span>{query}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 2-Column Grid: Saved Papers Preview & Collections */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Recent Saved Papers */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-slate-900 dark:text-white text-base flex items-center gap-2">
              <FileText className="w-4 h-4 text-indigo-600" /> Saved Literature Preview
            </h3>
            <button
              onClick={() => onSelectView("papers")}
              className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
            >
              View All ({papers.length}) <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {papers.slice(0, 3).map((item) => (
              <div
                key={item.id}
                onClick={() => onSelectItem(item, "paper")}
                className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 dark:hover:border-indigo-500 shadow-sm transition-all cursor-pointer space-y-2 group"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950 px-2 py-0.5 rounded">
                    {item.thesis.subject}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                    item.readingProgress === "completed"
                      ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400"
                      : item.readingProgress === "reading"
                      ? "bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400"
                      : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                  }`}>
                    {item.readingProgress}
                  </span>
                </div>

                <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-1">
                  {item.thesis.title}
                </h4>

                <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
                  {item.thesis.authors.join(", ")} • {item.thesis.university} ({item.thesis.year})
                </p>

                {item.notes && (
                  <p className="text-[11px] text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-950 p-2 rounded-xl italic border border-slate-100 dark:border-slate-800 line-clamp-1">
                    "{item.notes.replace(/#/g, "")}"
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Collections & AI Recommendations */}
        <div className="lg:col-span-4 space-y-6">
          {/* Collections List */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-xs text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                <Folder className="w-4 h-4 text-indigo-500" /> Research Collections
              </h3>
              <button
                onClick={onOpenCreateCollection}
                className="p-1 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950 rounded"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2">
              {collections.map((col) => (
                <div
                  key={col.id}
                  className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: col.color }} />
                    <span className="font-bold text-slate-800 dark:text-slate-200 truncate">{col.name}</span>
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 shrink-0">{col.itemIds?.length || 0} Items</span>
                </div>
              ))}
            </div>
          </div>

          {/* AI Recommendations Card */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-50 to-amber-50 dark:from-indigo-950/40 dark:to-slate-900 border border-indigo-200/60 dark:border-indigo-900/40 shadow-sm space-y-3 text-xs">
            <div className="flex items-center gap-2 font-extrabold text-indigo-900 dark:text-indigo-200">
              <Sparkles className="w-4 h-4 text-amber-500" /> AI Research Recommendation
            </div>
            <p className="text-[11px] text-slate-700 dark:text-slate-300 leading-relaxed">
              Based on your saved papers in <span className="font-bold text-indigo-600">Quantum Computing</span>, we recommend exploring <strong>barren plateau loss landscapes</strong> for neural operators.
            </p>
            <button
              onClick={() => onExecuteSearch("Barren plateaus in quantum neural operators")}
              className="w-full py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[11px] shadow-sm transition-colors"
            >
              Search Recommended Topic
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
