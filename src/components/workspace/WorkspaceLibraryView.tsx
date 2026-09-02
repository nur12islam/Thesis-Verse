import React, { useState } from "react";
import {
  FileText,
  GraduationCap,
  Sparkles,
  BookOpen,
  Pin,
  Star,
  Search,
  Tag,
  Trash2,
  Copy,
  Edit3,
  ExternalLink,
  Download,
  Filter,
  CheckCircle2,
  Clock,
  MoreVertical,
  Plus
} from "lucide-react";
import {
  SavedPaper,
  SavedIdeaItem,
  SavedProposalItem,
  WorkspaceCollection,
  WorkspaceTag,
  ReadingProgressStatus
} from "../../types/workspace";

interface WorkspaceLibraryViewProps {
  viewType: "papers" | "theses" | "ideas" | "proposals";
  papers: SavedPaper[];
  ideas: SavedIdeaItem[];
  proposals: SavedProposalItem[];
  collections: WorkspaceCollection[];
  tags: WorkspaceTag[];
  selectedCollectionId: string | null;
  selectedTagId: string | null;
  filterPinnedOnly: boolean;
  filterFavoriteOnly: boolean;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onSelectItem: (item: any, type: "paper" | "thesis" | "idea" | "proposal") => void;
  onTogglePin: (id: string, type: "paper" | "thesis" | "idea" | "proposal") => void;
  onToggleFavorite: (id: string, type: "paper" | "thesis" | "idea" | "proposal") => void;
  onChangeProgress: (id: string, type: "paper" | "idea", progress: ReadingProgressStatus) => void;
  onDeleteItem: (id: string, type: "paper" | "thesis" | "idea" | "proposal") => void;
  onBuildProposalFromIdea: (idea: SavedIdeaItem) => void;
  onOpenProposal: (proposal: SavedProposalItem) => void;
  onDuplicateProposal: (proposal: SavedProposalItem) => void;
  onShowToast: (title: string, message?: string, type?: "success" | "error" | "info") => void;
}

export const WorkspaceLibraryView: React.FC<WorkspaceLibraryViewProps> = ({
  viewType,
  papers,
  ideas,
  proposals,
  collections,
  tags,
  selectedCollectionId,
  selectedTagId,
  filterPinnedOnly,
  filterFavoriteOnly,
  searchQuery,
  onSearchChange,
  onSelectItem,
  onTogglePin,
  onToggleFavorite,
  onChangeProgress,
  onDeleteItem,
  onBuildProposalFromIdea,
  onOpenProposal,
  onDuplicateProposal,
  onShowToast
}) => {
  const [sortBy, setSortBy] = useState<"recent" | "title" | "year" | "novelty">("recent");

  // Filtering Logic
  const filterItem = (item: any, titleText: string, tagsList: string[], colList: string[], isPinned: boolean, isFav: boolean) => {
    if (filterPinnedOnly && !isPinned) return false;
    if (filterFavoriteOnly && !isFav) return false;
    if (selectedCollectionId && !colList.includes(selectedCollectionId)) return false;
    if (selectedTagId && !tagsList.includes(selectedTagId)) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = titleText.toLowerCase().includes(q);
      const matchNotes = (item.notes || "").toLowerCase().includes(q);
      if (!matchTitle && !matchNotes) return false;
    }
    return true;
  };

  const filteredPapers = papers.filter((p) =>
    filterItem(p, p.thesis.title, p.tags, p.collectionIds, p.isPinned, p.isFavorite)
  );

  const filteredTheses = papers.filter((p) =>
    p.thesis.documentType === "Thesis" || p.thesis.documentType === "Dissertation"
  ).filter((p) =>
    filterItem(p, p.thesis.title, p.tags, p.collectionIds, p.isPinned, p.isFavorite)
  );

  const filteredIdeas = ideas.filter((i) =>
    filterItem(i, i.idea.title, i.tags, i.collectionIds, i.isPinned, i.isFavorite)
  );

  const filteredProposals = proposals.filter((pr) =>
    filterItem(pr, pr.proposal.title, pr.tags, pr.collectionIds, pr.isPinned, pr.isFavorite)
  );

  const selectedColObj = collections.find((c) => c.id === selectedCollectionId);
  const selectedTagObj = tags.find((t) => t.id === selectedTagId);

  return (
    <div className="space-y-6 pb-12">
      {/* Top Search & Filter Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={`Search ${viewType} by title, author, notes or tags...`}
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
          />
        </div>

        <div className="flex items-center gap-2 text-xs shrink-0">
          <span className="text-slate-400 font-semibold">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="p-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 font-bold focus:outline-none"
          >
            <option value="recent">Most Recent</option>
            <option value="title">Alphabetical (A-Z)</option>
            <option value="year">Year</option>
            <option value="novelty">Novelty Score</option>
          </select>
        </div>
      </div>

      {/* Active Filter Chips */}
      {(selectedColObj || selectedTagObj || filterPinnedOnly || filterFavoriteOnly) && (
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="font-bold text-slate-400">Active Filters:</span>
          {selectedColObj && (
            <span className="px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-bold flex items-center gap-1 border border-indigo-200 dark:border-indigo-800">
              Collection: {selectedColObj.name}
            </span>
          )}
          {selectedTagObj && (
            <span className="px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 font-bold flex items-center gap-1 border border-amber-200 dark:border-amber-800">
              Tag: #{selectedTagObj.name}
            </span>
          )}
          {filterPinnedOnly && (
            <span className="px-2.5 py-1 rounded-lg bg-amber-500 text-white font-bold flex items-center gap-1">
              Pinned Items
            </span>
          )}
          {filterFavoriteOnly && (
            <span className="px-2.5 py-1 rounded-lg bg-pink-500 text-white font-bold flex items-center gap-1">
              Starred Favorites
            </span>
          )}
        </div>
      )}

      {/* VIEW: PAPERS */}
      {viewType === "papers" && (
        <div className="space-y-4">
          {filteredPapers.length === 0 ? (
            <div className="py-16 text-center text-slate-400 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3">
              <FileText className="w-8 h-8 mx-auto text-slate-300" />
              <p className="font-bold text-slate-700 dark:text-slate-200">No Saved Papers Found</p>
              <p className="text-xs">Adjust search filters or save papers from the literature search engine.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredPapers.map((item) => (
                <div
                  key={item.id}
                  className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 dark:hover:border-indigo-500 shadow-sm transition-all space-y-3 group"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950 px-2 py-0.5 rounded">
                      {item.thesis.subject}
                    </span>

                    <div className="flex items-center gap-1">
                      <select
                        value={item.readingProgress}
                        onChange={(e) => onChangeProgress(item.id, "paper", e.target.value as ReadingProgressStatus)}
                        className={`text-[10px] font-bold px-2 py-0.5 rounded border focus:outline-none ${
                          item.readingProgress === "completed"
                            ? "bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-400"
                            : item.readingProgress === "reading"
                            ? "bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-950 dark:text-amber-400"
                            : "bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400"
                        }`}
                      >
                        <option value="unread">Unread</option>
                        <option value="reading">Reading</option>
                        <option value="completed">Completed</option>
                        <option value="archived">Archived</option>
                      </select>

                      <button
                        onClick={() => onTogglePin(item.id, "paper")}
                        className={`p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ${
                          item.isPinned ? "text-amber-500" : "text-slate-300"
                        }`}
                        title={item.isPinned ? "Unpin item" : "Pin to top"}
                      >
                        <Pin className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => onToggleFavorite(item.id, "paper")}
                        className={`p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ${
                          item.isFavorite ? "text-pink-500 fill-pink-500" : "text-slate-300"
                        }`}
                        title="Favorite"
                      >
                        <Star className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <h4
                    onClick={() => onSelectItem(item, "paper")}
                    className="font-extrabold text-sm text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 cursor-pointer transition-colors line-clamp-2"
                  >
                    {item.thesis.title}
                  </h4>

                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {item.thesis.authors.join(", ")} • {item.thesis.university} ({item.thesis.year})
                  </p>

                  {/* Notes Preview */}
                  {item.notes && (
                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 text-xs text-slate-700 dark:text-slate-300 border border-slate-100 dark:border-slate-800 line-clamp-2">
                      <span className="font-bold text-slate-400 mr-1">Note:</span>
                      {item.notes.replace(/#/g, "")}
                    </div>
                  )}

                  {/* Footer Actions */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                    <button
                      onClick={() => onSelectItem(item, "paper")}
                      className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline"
                    >
                      Inspect & Edit Notes
                    </button>

                    <button
                      onClick={() => onDeleteItem(item.id, "paper")}
                      className="p-1 text-slate-400 hover:text-rose-500 transition-colors"
                      title="Delete from Library"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* VIEW: THESES */}
      {viewType === "theses" && (
        <div className="space-y-4">
          {filteredTheses.length === 0 ? (
            <div className="py-16 text-center text-slate-400 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3">
              <GraduationCap className="w-8 h-8 mx-auto text-slate-300" />
              <p className="font-bold text-slate-700 dark:text-slate-200">No Doctoral Theses Found</p>
              <p className="text-xs">Bookmark doctoral dissertations from the thesis search catalog.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredTheses.map((item) => (
                <div
                  key={item.id}
                  className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 shadow-sm transition-all space-y-3"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-bold text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950 px-2 py-0.5 rounded">
                      {item.thesis.degree} Dissertation
                    </span>
                    <button
                      onClick={() => onToggleFavorite(item.id, "paper")}
                      className={item.isFavorite ? "text-pink-500 fill-pink-500" : "text-slate-300"}
                    >
                      <Star className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <h4
                    onClick={() => onSelectItem(item, "paper")}
                    className="font-extrabold text-sm text-slate-900 dark:text-white hover:text-indigo-600 cursor-pointer line-clamp-2"
                  >
                    {item.thesis.title}
                  </h4>

                  <p className="text-xs text-slate-500">
                    {item.thesis.university} ({item.thesis.year}) • {item.thesis.authors.join(", ")}
                  </p>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                    <button
                      onClick={() => onSelectItem(item, "paper")}
                      className="text-indigo-600 font-bold hover:underline"
                    >
                      View Dissertation Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* VIEW: AI IDEAS */}
      {viewType === "ideas" && (
        <div className="space-y-4">
          {filteredIdeas.length === 0 ? (
            <div className="py-16 text-center text-slate-400 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3">
              <Sparkles className="w-8 h-8 mx-auto text-amber-400" />
              <p className="font-bold text-slate-700 dark:text-slate-200">No Saved Rare AI Ideas</p>
              <p className="text-xs">Generate and save high-novelty thesis topics from the Rare Discovery engine.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredIdeas.map((item) => (
                <div
                  key={item.id}
                  className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-amber-500 shadow-sm transition-all space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-amber-600 bg-amber-50 dark:bg-amber-950 px-2.5 py-0.5 rounded-full border border-amber-200">
                      {item.idea.noveltyScore}% Novelty Rating
                    </span>
                    <button
                      onClick={() => onToggleFavorite(item.id, "idea")}
                      className={item.isFavorite ? "text-pink-500 fill-pink-500" : "text-slate-300"}
                    >
                      <Star className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <h4
                    onClick={() => onSelectItem(item, "idea")}
                    className="font-extrabold text-sm text-slate-900 dark:text-white hover:text-amber-600 cursor-pointer line-clamp-2"
                  >
                    {item.idea.title}
                  </h4>

                  <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2">
                    {item.idea.description}
                  </p>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                    <button
                      onClick={() => onBuildProposalFromIdea(item)}
                      className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white font-bold text-[11px] shadow-sm hover:bg-indigo-700 transition-colors"
                    >
                      Build Proposal in Phase 5
                    </button>

                    <button
                      onClick={() => onDeleteItem(item.id, "idea")}
                      className="p-1 text-slate-400 hover:text-rose-500"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* VIEW: PROPOSALS */}
      {viewType === "proposals" && (
        <div className="space-y-4">
          {filteredProposals.length === 0 ? (
            <div className="py-16 text-center text-slate-400 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3">
              <BookOpen className="w-8 h-8 mx-auto text-indigo-400" />
              <p className="font-bold text-slate-700 dark:text-slate-200">No Research Proposals Found</p>
              <p className="text-xs">Create publication-ready proposals in the Phase 5 Proposal Builder.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredProposals.map((item) => (
                <div
                  key={item.id}
                  className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 shadow-sm transition-all space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 dark:bg-indigo-950 px-2 py-0.5 rounded">
                      {item.proposal.degree} Level Proposal
                    </span>
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded">
                      {item.proposal.qualityScore?.overallScore || 90}/100 Quality
                    </span>
                  </div>

                  <h4
                    onClick={() => onOpenProposal(item)}
                    className="font-extrabold text-sm text-slate-900 dark:text-white hover:text-indigo-600 cursor-pointer line-clamp-2"
                  >
                    {item.proposal.title}
                  </h4>

                  <p className="text-xs text-slate-500">
                    Target: {item.proposal.targetUniversity || "Graduate School"} • Updated: {new Date(item.updatedAt).toLocaleDateString()}
                  </p>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                    <button
                      onClick={() => onOpenProposal(item)}
                      className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white font-bold text-[11px] hover:bg-indigo-700"
                    >
                      Open in Proposal Builder
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onDuplicateProposal(item)}
                        className="p-1.5 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-600 dark:text-slate-300 font-semibold text-[11px] flex items-center gap-1"
                        title="Duplicate Proposal"
                      >
                        <Copy className="w-3 h-3" /> Duplicate
                      </button>
                      <button
                        onClick={() => onDeleteItem(item.id, "proposal")}
                        className="p-1 text-slate-400 hover:text-rose-500"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
