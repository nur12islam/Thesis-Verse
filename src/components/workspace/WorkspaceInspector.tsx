import React, { useState, useEffect } from "react";
import {
  X,
  FileText,
  Sparkles,
  BookOpen,
  Tag,
  Folder,
  Save,
  Check,
  ExternalLink,
  BookMarked,
  Clock,
  ArrowRight,
  Share2,
  ListFilter
} from "lucide-react";
import {
  SavedPaper,
  SavedIdeaItem,
  SavedProposalItem,
  WorkspaceCollection,
  WorkspaceTag
} from "../../types/workspace";

interface WorkspaceInspectorProps {
  selectedItem: { item: any; type: "paper" | "thesis" | "idea" | "proposal" } | null;
  onClose: () => void;
  collections: WorkspaceCollection[];
  tags: WorkspaceTag[];
  onSaveNotes: (id: string, type: string, notesContent: string) => void;
  onToggleTagOnItem: (itemId: string, itemType: string, tagId: string) => void;
  onToggleCollectionOnItem: (itemId: string, itemType: string, collectionId: string) => void;
  onBuildProposal: (item: any) => void;
  onShowToast: (title: string, message?: string, type?: "success" | "error" | "info") => void;
}

export const WorkspaceInspector: React.FC<WorkspaceInspectorProps> = ({
  selectedItem,
  onClose,
  collections,
  tags,
  onSaveNotes,
  onToggleTagOnItem,
  onToggleCollectionOnItem,
  onBuildProposal,
  onShowToast
}) => {
  if (!selectedItem) return null;

  const { item, type } = selectedItem;

  const [notesText, setNotesText] = useState<string>(item.notes || "");
  const [isSavingNotes, setIsSavingNotes] = useState<boolean>(false);
  const [lastSavedTime, setLastSavedTime] = useState<string>("Saved just now");
  const [activeTab, setActiveTab] = useState<"notes" | "details" | "collections" | "ai">("notes");

  useEffect(() => {
    setNotesText(item.notes || "");
  }, [item]);

  const handleNotesChange = (val: string) => {
    setNotesText(val);
    setIsSavingNotes(true);
    // Debounced Auto Save
    const timer = setTimeout(() => {
      onSaveNotes(item.id, type, val);
      setIsSavingNotes(false);
      setLastSavedTime(`Saved at ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`);
    }, 800);
    return () => clearTimeout(timer);
  };

  const getTitle = () => {
    if (type === "paper" || type === "thesis") return item.thesis?.title;
    if (type === "idea") return item.idea?.title;
    if (type === "proposal") return item.proposal?.title;
    return "Selected Item";
  };

  return (
    <div className="fixed inset-y-0 right-0 w-full max-w-md bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl z-50 flex flex-col font-sans transition-all">
      {/* Inspector Header */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950">
        <div className="flex items-center gap-2">
          {type === "paper" && <FileText className="w-4 h-4 text-indigo-500" />}
          {type === "idea" && <Sparkles className="w-4 h-4 text-amber-500" />}
          {type === "proposal" && <BookOpen className="w-4 h-4 text-emerald-500" />}
          <span className="font-extrabold text-xs text-slate-800 dark:text-slate-200 uppercase tracking-wider">
            {type} Inspector & Notes
          </span>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Inspector Sub-Tabs */}
      <div className="flex items-center justify-around border-b border-slate-200 dark:border-slate-800 text-xs font-bold bg-white dark:bg-slate-900 px-2 pt-2">
        <button
          onClick={() => setActiveTab("notes")}
          className={`pb-2.5 px-3 border-b-2 transition-all ${
            activeTab === "notes"
              ? "border-indigo-600 text-indigo-600 dark:text-indigo-400"
              : "border-transparent text-slate-400 hover:text-slate-600"
          }`}
        >
          Rich Notes
        </button>
        <button
          onClick={() => setActiveTab("details")}
          className={`pb-2.5 px-3 border-b-2 transition-all ${
            activeTab === "details"
              ? "border-indigo-600 text-indigo-600 dark:text-indigo-400"
              : "border-transparent text-slate-400 hover:text-slate-600"
          }`}
        >
          Metadata
        </button>
        <button
          onClick={() => setActiveTab("collections")}
          className={`pb-2.5 px-3 border-b-2 transition-all ${
            activeTab === "collections"
              ? "border-indigo-600 text-indigo-600 dark:text-indigo-400"
              : "border-transparent text-slate-400 hover:text-slate-600"
          }`}
        >
          Folders & Tags
        </button>
        <button
          onClick={() => setActiveTab("ai")}
          className={`pb-2.5 px-3 border-b-2 transition-all ${
            activeTab === "ai"
              ? "border-indigo-600 text-indigo-600 dark:text-indigo-400"
              : "border-transparent text-slate-400 hover:text-slate-600"
          }`}
        >
          AI Next Steps
        </button>
      </div>

      {/* Main Inspector Scroll Area */}
      <div className="flex-1 overflow-y-auto p-5 space-y-6 text-xs">
        {/* Item Title Box */}
        <div className="p-4 rounded-2xl bg-indigo-50/60 dark:bg-slate-950 border border-indigo-100 dark:border-slate-800 space-y-2">
          <h3 className="font-extrabold text-sm text-slate-900 dark:text-white leading-snug">
            {getTitle()}
          </h3>
          {(type === "paper" || type === "thesis") && item.thesis && (
            <p className="text-[11px] text-slate-600 dark:text-slate-400">
              {item.thesis.authors?.join(", ")} • {item.thesis.university} ({item.thesis.year})
            </p>
          )}
        </div>

        {/* TAB 1: RICH NOTES EDITOR */}
        {activeTab === "notes" && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-extrabold text-slate-700 dark:text-slate-300">Personal Notes (Markdown)</span>
              <span className="text-[10px] text-slate-400 flex items-center gap-1 font-mono">
                {isSavingNotes ? (
                  <span className="text-amber-500 font-bold">Auto-Saving...</span>
                ) : (
                  <span className="text-emerald-500 font-bold flex items-center gap-1">
                    <Check className="w-3 h-3" /> {lastSavedTime}
                  </span>
                )}
              </span>
            </div>

            <textarea
              value={notesText}
              onChange={(e) => handleNotesChange(e.target.value)}
              placeholder="Write your research notes, annotations, key findings, or methodology thoughts here..."
              rows={14}
              className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/30 leading-relaxed"
            />

            <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800/60 text-[11px] text-slate-500 leading-normal">
              <strong>Tip:</strong> Notes automatically save as you type and persist in your browser or exported JSON workspace.
            </div>
          </div>
        )}

        {/* TAB 2: METADATA */}
        {activeTab === "details" && (
          <div className="space-y-4">
            {(type === "paper" || type === "thesis") && item.thesis && (
              <div className="space-y-3 text-xs">
                <div>
                  <span className="font-bold text-slate-400 block mb-1">Abstract</span>
                  <p className="text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-200/60 dark:border-slate-800 leading-relaxed">
                    {item.thesis.abstract}
                  </p>
                </div>

                <div>
                  <span className="font-bold text-slate-400 block mb-1">Identified Research Gap</span>
                  <p className="text-amber-700 dark:text-amber-300 bg-amber-50/50 dark:bg-amber-950/30 p-3 rounded-xl border border-amber-200/60 leading-relaxed">
                    {item.thesis.researchGap}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-center">
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">DOI Number</span>
                    <span className="font-mono text-slate-700 dark:text-slate-300 font-bold">{item.thesis.doi}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Citations</span>
                    <span className="font-bold text-indigo-600">{item.thesis.citationsCount}</span>
                  </div>
                </div>
              </div>
            )}

            {type === "idea" && item.idea && (
              <div className="space-y-3 text-xs">
                <div>
                  <span className="font-bold text-slate-400 block mb-1">Research Problem</span>
                  <p className="text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-200/60 dark:border-slate-800">
                    {item.idea.researchProblem}
                  </p>
                </div>
                <div>
                  <span className="font-bold text-slate-400 block mb-1">Supporting Evidence</span>
                  <p className="text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-200/60 dark:border-slate-800">
                    {item.idea.supportingEvidence?.whyThisIdea}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: FOLDERS & TAGS */}
        {activeTab === "collections" && (
          <div className="space-y-5">
            {/* Folder / Collections Checkbox List */}
            <div className="space-y-2">
              <span className="font-extrabold text-slate-800 dark:text-slate-200 block">Assign to Collections</span>
              <div className="space-y-1.5">
                {collections.map((col) => {
                  const isAssigned = (item.collectionIds || []).includes(col.id);
                  return (
                    <button
                      key={col.id}
                      onClick={() => onToggleCollectionOnItem(item.id, type, col.id)}
                      className={`w-full p-2.5 rounded-xl text-xs font-semibold flex items-center justify-between border transition-all ${
                        isAssigned
                          ? "bg-indigo-50 dark:bg-indigo-950 text-indigo-900 dark:text-indigo-200 border-indigo-300"
                          : "bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 border-slate-200/60 dark:border-slate-800"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: col.color }} />
                        <span>{col.name}</span>
                      </div>
                      {isAssigned && <Check className="w-3.5 h-3.5 text-indigo-600" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Tags Toggle */}
            <div className="space-y-2 pt-3 border-t border-slate-200 dark:border-slate-800">
              <span className="font-extrabold text-slate-800 dark:text-slate-200 block">Attach Tags</span>
              <div className="flex flex-wrap gap-1.5">
                {tags.map((tag) => {
                  const isTagged = (item.tags || []).includes(tag.id);
                  return (
                    <button
                      key={tag.id}
                      onClick={() => onToggleTagOnItem(item.id, type, tag.id)}
                      className={`px-3 py-1 rounded-xl text-[11px] font-bold border transition-all ${
                        isTagged
                          ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700"
                      }`}
                    >
                      #{tag.name}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: AI NEXT STEPS */}
        {activeTab === "ai" && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950 dark:to-slate-950 border border-indigo-200/60 dark:border-indigo-900/40 space-y-3">
              <div className="flex items-center gap-2 font-extrabold text-indigo-900 dark:text-indigo-200">
                <Sparkles className="w-4 h-4 text-amber-500" /> AI Proposal Generator
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                Transform this research paper into a structured Phase 5 research proposal complete with objectives, methodology, and chapter outlines.
              </p>

              <button
                onClick={() => onBuildProposal(item)}
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs shadow-md shadow-indigo-600/20 transition-all flex items-center justify-center gap-1.5"
              >
                Build Proposal in Phase 5 <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
