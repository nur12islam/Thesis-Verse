import React from "react";
import {
  LayoutDashboard,
  FileText,
  GraduationCap,
  Sparkles,
  BookOpen,
  FolderPlus,
  Pin,
  Star,
  Tag,
  Clock,
  Cloud,
  Folder,
  Plus,
  BarChart3,
  Download,
  Upload
} from "lucide-react";
import { WorkspaceCollection, WorkspaceTag } from "../../types/workspace";

interface WorkspaceSidebarProps {
  activeView: string;
  onSelectView: (view: string) => void;
  selectedCollectionId: string | null;
  onSelectCollection: (colId: string | null) => void;
  selectedTagId: string | null;
  onSelectTag: (tagId: string | null) => void;
  filterPinnedOnly: boolean;
  onTogglePinnedOnly: () => void;
  filterFavoriteOnly: boolean;
  onToggleFavoriteOnly: () => void;
  collections: WorkspaceCollection[];
  tags: WorkspaceTag[];
  counts: {
    papers: number;
    theses: number;
    ideas: number;
    proposals: number;
    collections: number;
    pinned: number;
    favorites: number;
  };
  onOpenCreateCollection: () => void;
  onOpenImportExport: () => void;
  onOpenSyncDrawer: () => void;
  syncStatusText: string;
}

export const WorkspaceSidebar: React.FC<WorkspaceSidebarProps> = ({
  activeView,
  onSelectView,
  selectedCollectionId,
  onSelectCollection,
  selectedTagId,
  onSelectTag,
  filterPinnedOnly,
  onTogglePinnedOnly,
  filterFavoriteOnly,
  onToggleFavoriteOnly,
  collections,
  tags,
  counts,
  onOpenCreateCollection,
  onOpenImportExport,
  onOpenSyncDrawer,
  syncStatusText
}) => {
  return (
    <aside className="w-full lg:w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 shadow-sm space-y-6 shrink-0">
      {/* Workspace Header & Cloud Sync Status */}
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white font-extrabold text-xs flex items-center justify-center shadow-md shadow-indigo-600/20">
            WS
          </div>
          <div>
            <h3 className="font-extrabold text-xs text-slate-900 dark:text-white">Research Workspace</h3>
            <p className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              {syncStatusText}
            </p>
          </div>
        </div>

        <button
          onClick={onOpenSyncDrawer}
          title="Cloud Sync & Backup"
          className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-indigo-600 transition-colors"
        >
          <Cloud className="w-4 h-4" />
        </button>
      </div>

      {/* Primary Navigation Views */}
      <div className="space-y-1 text-xs">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block px-2 mb-1">
          Navigation
        </span>

        <button
          onClick={() => {
            onSelectView("dashboard");
            onSelectCollection(null);
            onSelectTag(null);
          }}
          className={`w-full text-left px-3 py-2 rounded-xl font-bold transition-all flex items-center justify-between ${
            activeView === "dashboard" && !selectedCollectionId && !selectedTagId && !filterPinnedOnly && !filterFavoriteOnly
              ? "bg-indigo-600 text-white shadow-sm"
              : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          <div className="flex items-center gap-2">
            <LayoutDashboard className="w-4 h-4" />
            <span>Dashboard</span>
          </div>
        </button>

        <button
          onClick={() => {
            onSelectView("papers");
            onSelectCollection(null);
            onSelectTag(null);
          }}
          className={`w-full text-left px-3 py-2 rounded-xl font-medium transition-all flex items-center justify-between ${
            activeView === "papers" && !selectedCollectionId && !selectedTagId
              ? "bg-indigo-600 text-white font-bold shadow-sm"
              : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-indigo-500" />
            <span>Saved Papers</span>
          </div>
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
            activeView === "papers" ? "bg-white/20 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
          }`}>
            {counts.papers}
          </span>
        </button>

        <button
          onClick={() => {
            onSelectView("theses");
            onSelectCollection(null);
            onSelectTag(null);
          }}
          className={`w-full text-left px-3 py-2 rounded-xl font-medium transition-all flex items-center justify-between ${
            activeView === "theses" && !selectedCollectionId && !selectedTagId
              ? "bg-indigo-600 text-white font-bold shadow-sm"
              : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          <div className="flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-sky-500" />
            <span>Saved Theses</span>
          </div>
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
            activeView === "theses" ? "bg-white/20 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
          }`}>
            {counts.theses}
          </span>
        </button>

        <button
          onClick={() => {
            onSelectView("ideas");
            onSelectCollection(null);
            onSelectTag(null);
          }}
          className={`w-full text-left px-3 py-2 rounded-xl font-medium transition-all flex items-center justify-between ${
            activeView === "ideas" && !selectedCollectionId && !selectedTagId
              ? "bg-indigo-600 text-white font-bold shadow-sm"
              : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Saved AI Ideas</span>
          </div>
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
            activeView === "ideas" ? "bg-white/20 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
          }`}>
            {counts.ideas}
          </span>
        </button>

        <button
          onClick={() => {
            onSelectView("proposals");
            onSelectCollection(null);
            onSelectTag(null);
          }}
          className={`w-full text-left px-3 py-2 rounded-xl font-medium transition-all flex items-center justify-between ${
            activeView === "proposals" && !selectedCollectionId && !selectedTagId
              ? "bg-indigo-600 text-white font-bold shadow-sm"
              : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-emerald-500" />
            <span>Saved Proposals</span>
          </div>
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
            activeView === "proposals" ? "bg-white/20 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
          }`}>
            {counts.proposals}
          </span>
        </button>
      </div>

      {/* Quick Quick Filters (Pinned & Favorites) */}
      <div className="space-y-1 text-xs pt-3 border-t border-slate-100 dark:border-slate-800">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block px-2 mb-1">
          Quick Filters
        </span>

        <button
          onClick={onTogglePinnedOnly}
          className={`w-full text-left px-3 py-2 rounded-xl font-medium transition-all flex items-center justify-between ${
            filterPinnedOnly
              ? "bg-amber-500 text-white font-bold shadow-sm"
              : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          <div className="flex items-center gap-2">
            <Pin className="w-3.5 h-3.5 text-amber-500" />
            <span>Pinned Items</span>
          </div>
          <span className="text-[10px] font-bold">{counts.pinned}</span>
        </button>

        <button
          onClick={onToggleFavoriteOnly}
          className={`w-full text-left px-3 py-2 rounded-xl font-medium transition-all flex items-center justify-between ${
            filterFavoriteOnly
              ? "bg-rose-500 text-white font-bold shadow-sm"
              : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          <div className="flex items-center gap-2">
            <Star className="w-3.5 h-3.5 text-pink-500 fill-pink-500" />
            <span>Starred Favorites</span>
          </div>
          <span className="text-[10px] font-bold">{counts.favorites}</span>
        </button>
      </div>

      {/* Collections Section */}
      <div className="space-y-1 text-xs pt-3 border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-center justify-between px-2 mb-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Collections ({collections.length})
          </span>
          <button
            onClick={onOpenCreateCollection}
            className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-indigo-600 dark:text-indigo-400"
            title="Add Collection"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        {collections.map((col) => {
          const isSelected = selectedCollectionId === col.id;
          return (
            <button
              key={col.id}
              onClick={() => {
                onSelectCollection(isSelected ? null : col.id);
                onSelectTag(null);
              }}
              className={`w-full text-left px-3 py-2 rounded-xl font-medium transition-all flex items-center justify-between ${
                isSelected
                  ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 font-bold shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              <div className="flex items-center gap-2 truncate">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: col.color }}
                />
                <span className="truncate">{col.name}</span>
              </div>
              <span className="text-[10px] opacity-70 shrink-0 ml-1">{col.itemIds?.length || 0}</span>
            </button>
          );
        })}
      </div>

      {/* Custom Tags Section */}
      <div className="space-y-2 pt-3 border-t border-slate-100 dark:border-slate-800">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block px-2">
          Research Tags
        </span>

        <div className="flex flex-wrap gap-1.5 px-1">
          {tags.map((tag) => {
            const isSelected = selectedTagId === tag.id;
            return (
              <button
                key={tag.id}
                onClick={() => {
                  onSelectTag(isSelected ? null : tag.id);
                  onSelectCollection(null);
                }}
                className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all border ${
                  isSelected
                    ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200/60 dark:border-slate-800 hover:border-indigo-400"
                }`}
              >
                #{tag.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Import / Export & Workspace Actions */}
      <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
        <button
          onClick={onOpenImportExport}
          className="w-full py-2.5 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center justify-center gap-2 transition-colors"
        >
          <Upload className="w-3.5 h-3.5 text-indigo-500" /> Import & Export Library
        </button>
      </div>
    </aside>
  );
};
