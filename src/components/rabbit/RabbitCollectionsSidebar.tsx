import React, { useState } from "react";
import { RabbitCollection, Thesis } from "../../types/thesis";
import {
  Folder,
  FolderPlus,
  Plus,
  Trash2,
  Sparkles,
  BookOpen,
  CheckCircle2,
  X,
  Search,
  Layers,
  ChevronRight,
  Download,
  Share2
} from "lucide-react";

interface RabbitCollectionsSidebarProps {
  collections: RabbitCollection[];
  activeCollectionId: string;
  onSelectCollection: (id: string) => void;
  onCreateCollection: (name: string, description: string, color: string) => void;
  onDeleteCollection: (id: string) => void;
  seedTheses: Thesis[];
  allTheses: Thesis[];
  onAddSeed: (thesis: Thesis) => void;
  onRemoveSeed: (thesisId: string) => void;
  onShowToast: (title: string, message?: string, type?: "success" | "error" | "info") => void;
  onSelectDetails: (thesis: Thesis) => void;
}

export const RabbitCollectionsSidebar: React.FC<RabbitCollectionsSidebarProps> = ({
  collections,
  activeCollectionId,
  onSelectCollection,
  onCreateCollection,
  onDeleteCollection,
  seedTheses,
  allTheses,
  onAddSeed,
  onRemoveSeed,
  onShowToast,
  onSelectDetails,
}) => {
  const [isCreating, setIsCreating] = useState(false);
  const [newColName, setNewColName] = useState("");
  const [newColDesc, setNewColDesc] = useState("");
  const [newColColor, setNewColColor] = useState("#6366f1");

  const [isAddingSeed, setIsAddingSeed] = useState(false);
  const [searchSeedQuery, setSearchSeedQuery] = useState("");

  const activeCollection = collections.find((c) => c.id === activeCollectionId) || collections[0];

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newColName.trim()) return;
    onCreateCollection(newColName.trim(), newColDesc.trim(), newColColor);
    setNewColName("");
    setNewColDesc("");
    setIsCreating(false);
    onShowToast("Collection Created", `Created "${newColName.trim()}"`, "success");
  };

  const seedIds = new Set(seedTheses.map((s) => s.id));
  const availableToAdd = allTheses.filter((t) => {
    if (seedIds.has(t.id)) return false;
    if (!searchSeedQuery.trim()) return true;
    const q = searchSeedQuery.toLowerCase();
    return (
      t.title.toLowerCase().includes(q) ||
      t.authors.some((a) => a.toLowerCase().includes(q)) ||
      t.subject.toLowerCase().includes(q) ||
      t.keywords.some((k) => k.toLowerCase().includes(q))
    );
  }).slice(0, 8);

  const COLOR_OPTIONS = ["#6366f1", "#ec4899", "#10b981", "#f59e0b", "#0ea5e9", "#8b5cf6"];

  return (
    <div className="w-full h-full flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
      {/* Top Header */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2 bg-slate-50/70 dark:bg-slate-950/50">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <Folder className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-extrabold text-xs text-slate-900 dark:text-white uppercase tracking-wider">
              Research Collections
            </h3>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">
              {collections.length} Collections
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsCreating(true)}
          className="p-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition-colors"
          title="New Collection"
        >
          <FolderPlus className="w-4 h-4" />
        </button>
      </div>

      {/* New Collection Modal / Form */}
      {isCreating && (
        <form onSubmit={handleCreateSubmit} className="p-3 bg-indigo-50/50 dark:bg-indigo-950/40 border-b border-indigo-200 dark:border-indigo-800/60 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-bold text-indigo-700 dark:text-indigo-300 text-[11px]">Create New Collection</span>
            <button type="button" onClick={() => setIsCreating(false)} className="text-slate-400 hover:text-slate-600">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <input
            type="text"
            placeholder="Collection Name..."
            value={newColName}
            onChange={(e) => setNewColName(e.target.value)}
            className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs focus:ring-1 focus:ring-indigo-500"
            autoFocus
          />
          <input
            type="text"
            placeholder="Optional purpose / scope..."
            value={newColDesc}
            onChange={(e) => setNewColDesc(e.target.value)}
            className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs focus:ring-1 focus:ring-indigo-500"
          />
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-1">
              {COLOR_OPTIONS.map((c) => (
                <button
                  type="button"
                  key={c}
                  onClick={() => setNewColColor(c)}
                  className={`w-4 h-4 rounded-full transition-transform ${newColColor === c ? "scale-125 ring-2 ring-indigo-500" : "opacity-70"}`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
            <button
              type="submit"
              disabled={!newColName.trim()}
              className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-md font-bold text-[11px]"
            >
              Save
            </button>
          </div>
        </form>
      )}

      {/* Collections List */}
      <div className="p-2 space-y-1 overflow-y-auto max-h-[160px] border-b border-slate-200 dark:border-slate-800 scrollbar-thin">
        {collections.map((col) => {
          const isActive = col.id === activeCollectionId;
          return (
            <div
              key={col.id}
              onClick={() => onSelectCollection(col.id)}
              className={`group px-2.5 py-2 rounded-xl text-xs flex items-center justify-between cursor-pointer transition-all ${
                isActive
                  ? "bg-indigo-600 text-white shadow-sm font-semibold"
                  : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              <div className="flex items-center gap-2 truncate">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: col.color || "#6366f1" }}
                />
                <span className="truncate">{col.name}</span>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <span
                  className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                    isActive ? "bg-white/20 text-white" : "bg-slate-200 dark:bg-slate-800 text-slate-500"
                  }`}
                >
                  {col.seedIds?.length || 0}
                </span>

                {collections.length > 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteCollection(col.id);
                    }}
                    className={`opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-500/20 text-red-400 transition-opacity ${
                      isActive ? "text-white hover:text-red-200" : ""
                    }`}
                    title="Delete Collection"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Seed Papers Section */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="p-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-950/30">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
              Seed Papers ({seedTheses.length})
            </span>
          </div>

          <button
            onClick={() => setIsAddingSeed(!isAddingSeed)}
            className="px-2 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold flex items-center gap-1 transition-colors shadow-sm"
          >
            <Plus className="w-3 h-3" /> Add Seed
          </button>
        </div>

        {/* Add Seed Paper Quick Search Dropdown */}
        {isAddingSeed && (
          <div className="p-3 bg-emerald-50/40 dark:bg-emerald-950/20 border-b border-emerald-200 dark:border-emerald-900/40 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-emerald-700 dark:text-emerald-300 text-[11px]">
                Search & Add Seed Paper
              </span>
              <button onClick={() => setIsAddingSeed(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                placeholder="Search by topic, author, keyword..."
                value={searchSeedQuery}
                onChange={(e) => setSearchSeedQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs focus:ring-1 focus:ring-emerald-500"
                autoFocus
              />
            </div>

            <div className="max-h-40 overflow-y-auto space-y-1 scrollbar-thin">
              {availableToAdd.length === 0 ? (
                <p className="text-[11px] text-slate-500 text-center py-2">No matching papers found</p>
              ) : (
                availableToAdd.map((t) => (
                  <div
                    key={t.id}
                    className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500 flex items-start justify-between gap-2 group transition-colors"
                  >
                    <div className="truncate">
                      <h5 className="font-bold text-slate-900 dark:text-white truncate text-[11px]">
                        {t.title}
                      </h5>
                      <p className="text-[10px] text-slate-500 truncate">
                        {t.authors[0]} ({t.year}) • {t.subject}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        onAddSeed(t);
                        onShowToast("Seed Paper Added", `Added "${t.title.slice(0, 30)}..."`, "success");
                      }}
                      className="px-2 py-0.5 rounded bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold shrink-0"
                    >
                      + Add
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* List of active seed papers */}
        <div className="flex-1 p-2 space-y-2 overflow-y-auto scrollbar-thin">
          {seedTheses.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-400 space-y-2">
              <BookOpen className="w-8 h-8 text-slate-300 dark:text-slate-700 mx-auto" />
              <p className="font-semibold text-slate-600 dark:text-slate-400">No seed papers in collection</p>
              <p className="text-[10px]">Add 1 or more seed papers to generate your literature network!</p>
            </div>
          ) : (
            seedTheses.map((s) => (
              <div
                key={s.id}
                onClick={() => onSelectDetails(s)}
                className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700/80 hover:border-indigo-500 cursor-pointer space-y-1.5 transition-all group"
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                    ★ Seed • {s.year}
                  </span>
                  {seedTheses.length > 1 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemoveSeed(s.id);
                        onShowToast("Seed Removed", `Removed from active graph`, "info");
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-red-500 rounded transition-opacity"
                      title="Remove Seed"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <h4 className="font-bold text-xs text-slate-900 dark:text-white line-clamp-2 leading-snug">
                  {s.title}
                </h4>

                <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400">
                  <span className="truncate max-w-[140px]">{s.authors[0]}</span>
                  <span className="font-semibold">{s.citationsCount} cites</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
