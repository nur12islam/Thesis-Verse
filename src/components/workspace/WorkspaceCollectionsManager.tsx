import React, { useState } from "react";
import { X, Folder, Plus, Trash2, Check } from "lucide-react";
import { WorkspaceCollection } from "../../types/workspace";

interface WorkspaceCollectionsManagerProps {
  isOpen: boolean;
  onClose: () => void;
  collections: WorkspaceCollection[];
  onCreateCollection: (col: Omit<WorkspaceCollection, "id" | "createdAt" | "itemIds">) => void;
  onDeleteCollection: (id: string) => void;
}

const PRESET_COLORS = [
  "#4f46e5", // Indigo
  "#0284c7", // Sky
  "#059669", // Emerald
  "#d97706", // Amber
  "#e11d48", // Rose
  "#9333ea", // Purple
  "#0891b2", // Cyan
  "#475569", // Slate
];

export const WorkspaceCollectionsManager: React.FC<WorkspaceCollectionsManagerProps> = ({
  isOpen,
  onClose,
  collections,
  onCreateCollection,
  onDeleteCollection
}) => {
  if (!isOpen) return null;

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState(PRESET_COLORS[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onCreateCollection({
      name: name.trim(),
      description: description.trim(),
      color,
      icon: "Folder",
    });
    setName("");
    setDescription("");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
              <Folder className="w-4 h-4" />
            </div>
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">Create New Collection</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="space-y-1">
            <label className="font-bold text-slate-700 dark:text-slate-300 block">Collection Name</label>
            <input
              type="text"
              required
              placeholder="e.g., Quantum ML Dissertation References"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-700 dark:text-slate-300 block">Description (Optional)</label>
            <textarea
              placeholder="Short description or goal of this folder collection..."
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-slate-700 dark:text-slate-300 block">Accent Color</label>
            <div className="flex items-center gap-2">
              {PRESET_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`w-6 h-6 rounded-full transition-all flex items-center justify-center ${
                    color === c ? "ring-2 ring-offset-2 ring-indigo-600 scale-110" : "opacity-80 hover:opacity-100"
                  }`}
                  style={{ backgroundColor: c }}
                >
                  {color === c && <Check className="w-3 h-3 text-white" />}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold shadow-sm"
            >
              Save Collection
            </button>
          </div>
        </form>

        {/* Existing Collections List to Delete */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2 text-xs">
          <span className="font-bold text-slate-400 block">Existing Collections</span>
          <div className="space-y-1 max-h-36 overflow-y-auto">
            {collections.map((col) => (
              <div
                key={col.id}
                className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 flex items-center justify-between"
              >
                <div className="flex items-center gap-2 truncate">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: col.color }} />
                  <span className="font-bold text-slate-800 dark:text-slate-200 truncate">{col.name}</span>
                </div>
                <button
                  onClick={() => onDeleteCollection(col.id)}
                  className="p-1 text-slate-400 hover:text-rose-500"
                  title="Delete Collection"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
