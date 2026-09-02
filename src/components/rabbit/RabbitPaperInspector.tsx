import React, { useState } from "react";
import { Thesis } from "../../types/thesis";
import {
  X,
  Sparkles,
  Bookmark,
  BookmarkCheck,
  Compass,
  Plus,
  Quote,
  Check,
  ExternalLink,
  BookOpen,
  FileText,
  Flame,
  Layers,
  ArrowRight,
  GraduationCap
} from "lucide-react";

interface RabbitPaperInspectorProps {
  thesis: Thesis | null;
  onClose: () => void;
  isSeed: boolean;
  onToggleSeed: (thesis: Thesis) => void;
  onPivotExplore: (thesis: Thesis) => void;
  isSaved: boolean;
  onToggleSave: (thesis: Thesis) => void;
  onBuildProposal: (thesis: Thesis) => void;
  onShowToast: (title: string, message?: string, type?: "success" | "error" | "info") => void;
}

export const RabbitPaperInspector: React.FC<RabbitPaperInspectorProps> = ({
  thesis,
  onClose,
  isSeed,
  onToggleSeed,
  onPivotExplore,
  isSaved,
  onToggleSave,
  onBuildProposal,
  onShowToast,
}) => {
  const [copiedFormat, setCopiedFormat] = useState<string | null>(null);

  if (!thesis) return null;

  const handleCopyCitation = (format: "APA" | "BibTeX") => {
    let text = "";
    if (format === "APA") {
      text = `${thesis.authors.join(", ")} (${thesis.year}). ${thesis.title}. ${thesis.university}. https://doi.org/${thesis.doi}`;
    } else {
      text = thesis.bibtex || `@phdthesis{thesis_${thesis.id},\n  title={${thesis.title}},\n  author={${thesis.authors.join(" and ")}},\n  year={${thesis.year}},\n  school={${thesis.university}}\n}`;
    }
    navigator.clipboard.writeText(text);
    setCopiedFormat(format);
    onShowToast("Citation Copied", `Copied in ${format} format`, "success");
    setTimeout(() => setCopiedFormat(null), 2000);
  };

  return (
    <div className="w-full h-full flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-lg animate-in fade-in slide-in-from-right-4 duration-200">
      {/* Header */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/60 flex items-start justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span
              className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-wider ${
                isSeed
                  ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30"
                  : "bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800"
              }`}
            >
              {isSeed ? "★ Active Seed Paper" : `${thesis.degree} • ${thesis.year}`}
            </span>
            <span className="text-[10px] font-bold text-slate-500">
              {thesis.citationsCount} Citations
            </span>
          </div>

          <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white leading-snug">
            {thesis.title}
          </h3>

          <p className="text-xs text-slate-500 dark:text-slate-400">
            {thesis.authors.join(", ")} • <span className="font-medium text-slate-700 dark:text-slate-300">{thesis.university}</span>
          </p>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Action Command Bar */}
      <div className="p-3 bg-indigo-50/40 dark:bg-indigo-950/20 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center gap-2 text-xs">
        <button
          onClick={() => {
            onToggleSeed(thesis);
            onShowToast(isSeed ? "Seed Removed" : "Added as Seed", `"${thesis.title.slice(0, 30)}..."`, "success");
          }}
          className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all shadow-sm ${
            isSeed
              ? "bg-emerald-600 text-white hover:bg-emerald-700"
              : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/30"
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          {isSeed ? "Active Seed (Remove)" : "+ Make Seed Paper"}
        </button>

        <button
          onClick={() => {
            onPivotExplore(thesis);
            onShowToast("Pivoting Discovery Graph", `Focusing literature around "${thesis.title.slice(0, 30)}..."`, "info");
          }}
          className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold flex items-center gap-1.5 transition-all shadow-sm"
        >
          <Compass className="w-3.5 h-3.5" /> Explore its Graph
        </button>

        <button
          onClick={() => onToggleSave(thesis)}
          className={`px-3 py-1.5 rounded-xl font-semibold flex items-center gap-1.5 transition-colors ${
            isSaved
              ? "bg-amber-100 dark:bg-amber-950/80 text-amber-600 font-bold"
              : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100"
          }`}
        >
          {isSaved ? <BookmarkCheck className="w-3.5 h-3.5 text-amber-500" /> : <Bookmark className="w-3.5 h-3.5" />}
          {isSaved ? "Saved" : "Save"}
        </button>

        <button
          onClick={() => handleCopyCitation("APA")}
          className="px-2.5 py-1.5 rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 font-semibold flex items-center gap-1"
        >
          {copiedFormat === "APA" ? <Check className="w-3 h-3 text-emerald-500" /> : <Quote className="w-3 h-3" />}
          APA
        </button>

        <button
          onClick={() => handleCopyCitation("BibTeX")}
          className="px-2.5 py-1.5 rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 font-semibold flex items-center gap-1"
        >
          {copiedFormat === "BibTeX" ? <Check className="w-3 h-3 text-emerald-500" /> : <Quote className="w-3 h-3" />}
          BibTeX
        </button>

        <button
          onClick={() => onBuildProposal(thesis)}
          className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 hover:bg-slate-200 font-bold flex items-center gap-1 ml-auto"
        >
          <FileText className="w-3.5 h-3.5" /> Proposal
        </button>
      </div>

      {/* Body Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs scrollbar-thin">
        {/* Metric Badges */}
        <div className="grid grid-cols-3 gap-2">
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Novelty</span>
            <span className="font-extrabold text-base text-indigo-600 dark:text-indigo-400">
              {thesis.noveltyScore}%
            </span>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Citations</span>
            <span className="font-extrabold text-base text-slate-900 dark:text-white">
              {thesis.citationsCount}
            </span>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Subject</span>
            <span className="font-bold text-xs text-slate-700 dark:text-slate-300 truncate block">
              {thesis.subject}
            </span>
          </div>
        </div>

        {/* Abstract */}
        <div className="space-y-1.5">
          <h4 className="font-extrabold text-xs text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-indigo-500" /> Abstract & Overview
          </h4>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-serif text-[12px] bg-slate-50 dark:bg-slate-950 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800/80">
            {thesis.abstract}
          </p>
        </div>

        {/* Methodology */}
        {thesis.methodology && (
          <div className="space-y-1.5">
            <h4 className="font-extrabold text-xs text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-sky-500" /> Research Methodology
            </h4>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
              {thesis.methodology}
            </p>
          </div>
        )}

        {/* Research Gap & Unexplored Frontiers */}
        {thesis.researchGap && (
          <div className="p-3.5 rounded-xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 space-y-1">
            <h4 className="font-extrabold text-xs text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-amber-500" /> Addressed Research Gap
            </h4>
            <p className="text-amber-900 dark:text-amber-200 leading-relaxed text-[11px]">
              {thesis.researchGap}
            </p>
          </div>
        )}

        {/* Future Directions */}
        {thesis.futureDirections && thesis.futureDirections.length > 0 && (
          <div className="space-y-1.5">
            <h4 className="font-extrabold text-xs text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
              <ArrowRight className="w-3.5 h-3.5 text-emerald-500" /> Future Research Trajectories
            </h4>
            <ul className="space-y-1 text-slate-700 dark:text-slate-300 text-[11px]">
              {thesis.futureDirections.map((dir, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                  <span>{dir}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* DOI & Open Access Link */}
        <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
          <span>DOI: {thesis.doi}</span>
          <a
            href={thesis.sourceUrl || `https://doi.org/${thesis.doi}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline flex items-center gap-1"
          >
            Source DOI <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
};
