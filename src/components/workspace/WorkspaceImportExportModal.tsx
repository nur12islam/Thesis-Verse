import React, { useState } from "react";
import { X, Upload, Download, FileCode, Check, AlertCircle } from "lucide-react";
import {
  SavedPaper,
  SavedIdeaItem,
  SavedProposalItem,
  WorkspaceCollection
} from "../../types/workspace";
import {
  exportWorkspaceCSV,
  exportWorkspaceJSON,
  exportWorkspaceMarkdown,
  parseImportData
} from "../../services/workspaceService";

interface WorkspaceImportExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  papers: SavedPaper[];
  ideas: SavedIdeaItem[];
  proposals: SavedProposalItem[];
  collections: WorkspaceCollection[];
  onImportSuccess: (importedPapers: SavedPaper[]) => void;
  onShowToast: (title: string, message?: string, type?: "success" | "error" | "info") => void;
}

export const WorkspaceImportExportModal: React.FC<WorkspaceImportExportModalProps> = ({
  isOpen,
  onClose,
  papers,
  ideas,
  proposals,
  collections,
  onImportSuccess,
  onShowToast
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<"import" | "export">("export");
  const [importFormat, setImportFormat] = useState<"bibtex" | "ris" | "csv" | "json">("json");
  const [importText, setImportText] = useState("");
  const [importError, setImportError] = useState<string | null>(null);

  const handleRunImport = () => {
    setImportError(null);
    if (!importText.trim()) {
      setImportError("Please paste or upload data before importing.");
      return;
    }

    try {
      const result = parseImportData(importText, importFormat);
      if (result.length === 0) {
        setImportError("No valid research papers could be extracted from the input text.");
        return;
      }
      onImportSuccess(result);
      onShowToast("Library Import Successful", `Imported ${result.length} research papers.`, "success");
      setImportText("");
      onClose();
    } catch (e: any) {
      setImportError(e.message || "Failed to parse import dataset.");
    }
  };

  const handleDownloadExport = (format: "json" | "markdown" | "csv") => {
    let content = "";
    let filename = "";
    let mimeType = "text/plain";

    if (format === "json") {
      content = exportWorkspaceJSON({ papers, ideas, proposals, collections });
      filename = `thesisverse-workspace-export-${Date.now()}.json`;
      mimeType = "application/json";
    } else if (format === "markdown") {
      content = exportWorkspaceMarkdown(papers, ideas, proposals);
      filename = `thesisverse-research-summary-${Date.now()}.md`;
      mimeType = "text/markdown";
    } else if (format === "csv") {
      content = exportWorkspaceCSV(papers);
      filename = `thesisverse-saved-papers-${Date.now()}.csv`;
      mimeType = "text/csv";
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    onShowToast("Workspace Exported", `Downloaded ${filename}`, "success");
  };

  return (
    <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
              <Upload className="w-4 h-4" />
            </div>
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">Workspace Import & Export</h3>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Sub Navigation */}
        <div className="flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1 text-xs font-bold">
          <button
            onClick={() => setActiveTab("export")}
            className={`flex-1 py-2 rounded-lg transition-all ${
              activeTab === "export" ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm" : "text-slate-500"
            }`}
          >
            Export Workspace
          </button>
          <button
            onClick={() => setActiveTab("import")}
            className={`flex-1 py-2 rounded-lg transition-all ${
              activeTab === "import" ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm" : "text-slate-500"
            }`}
          >
            Import Literature Data
          </button>
        </div>

        {/* EXPORT TAB */}
        {activeTab === "export" && (
          <div className="space-y-4 text-xs">
            <p className="text-slate-600 dark:text-slate-300">
              Download your saved literature, notes, rare AI ideas, proposals, and custom collection structure.
            </p>

            <div className="space-y-2">
              <button
                onClick={() => handleDownloadExport("json")}
                className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 text-left transition-all flex items-center justify-between group"
              >
                <div className="space-y-0.5">
                  <span className="font-extrabold text-slate-900 dark:text-white group-hover:text-indigo-600 block">
                    Full JSON Workspace Backup
                  </span>
                  <span className="text-[11px] text-slate-500">Includes all papers, notes, ideas, proposals & collection metadata.</span>
                </div>
                <Download className="w-4 h-4 text-indigo-600" />
              </button>

              <button
                onClick={() => handleDownloadExport("markdown")}
                className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 text-left transition-all flex items-center justify-between group"
              >
                <div className="space-y-0.5">
                  <span className="font-extrabold text-slate-900 dark:text-white group-hover:text-indigo-600 block">
                    Markdown Summary (.md)
                  </span>
                  <span className="text-[11px] text-slate-500">Formatted Markdown report ready for Obsidian or Notion.</span>
                </div>
                <Download className="w-4 h-4 text-indigo-600" />
              </button>

              <button
                onClick={() => handleDownloadExport("csv")}
                className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 text-left transition-all flex items-center justify-between group"
              >
                <div className="space-y-0.5">
                  <span className="font-extrabold text-slate-900 dark:text-white group-hover:text-indigo-600 block">
                    CSV Literature Table (.csv)
                  </span>
                  <span className="text-[11px] text-slate-500">Tabular paper metadata export for Excel or Google Sheets.</span>
                </div>
                <Download className="w-4 h-4 text-indigo-600" />
              </button>
            </div>
          </div>
        )}

        {/* IMPORT TAB */}
        {activeTab === "import" && (
          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between">
              <label className="font-bold text-slate-700 dark:text-slate-300">Format</label>
              <select
                value={importFormat}
                onChange={(e) => setImportFormat(e.target.value as any)}
                className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 font-bold text-xs"
              >
                <option value="json">JSON Backup</option>
                <option value="bibtex">BibTeX (.bib)</option>
                <option value="csv">CSV Table</option>
              </select>
            </div>

            <textarea
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
              placeholder={`Paste your raw ${importFormat.toUpperCase()} content here...`}
              rows={8}
              className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-mono text-[11px] focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
            />

            {importError && (
              <div className="p-3 rounded-xl bg-rose-50 text-rose-600 border border-rose-200 font-medium flex items-center gap-2 text-xs">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{importError}</span>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2">
              <button onClick={onClose} className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold">
                Cancel
              </button>
              <button onClick={handleRunImport} className="px-5 py-2 rounded-xl bg-indigo-600 text-white font-extrabold shadow-sm hover:bg-indigo-700">
                Execute Import
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
