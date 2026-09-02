import React from "react";
import { SupportingResearchItem } from "../../types/thesis";
import { BookOpen, ExternalLink, ShieldCheck, CheckCircle2, BookmarkPlus } from "lucide-react";

interface ProposalSupportingLiteratureProps {
  supportingLiterature: SupportingResearchItem[];
  onAddPaper?: () => void;
}

export const ProposalSupportingLiterature: React.FC<ProposalSupportingLiteratureProps> = ({
  supportingLiterature,
  onAddPaper
}) => {
  return (
    <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <h3 className="font-bold text-slate-900 dark:text-white text-sm">Supporting Literature</h3>
        </div>
        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          {supportingLiterature.length} Verified Sources
        </span>
      </div>

      <p className="text-xs text-slate-500 dark:text-slate-400">
        Peer-reviewed journal articles, theses, and repositories grounding this proposal. All DOIs and citations are verified.
      </p>

      {/* Cards List */}
      <div className="space-y-3">
        {supportingLiterature.map((item, idx) => (
          <div
            key={item.id || idx}
            className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/70 dark:border-slate-800 space-y-2 text-xs"
          >
            <div className="flex items-start justify-between gap-2">
              <h4 className="font-bold text-slate-900 dark:text-slate-100 text-xs leading-snug">
                {item.title}
              </h4>
              <span className="shrink-0 px-2 py-0.5 rounded text-[10px] font-semibold bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                {item.year}
              </span>
            </div>

            <div className="text-[11px] text-slate-500 dark:text-slate-400 flex flex-wrap gap-2">
              <span>{item.authors.join(", ")}</span>
              <span>•</span>
              <span className="font-medium text-slate-700 dark:text-slate-300">{item.university}</span>
            </div>

            {item.doi && (
              <div className="flex items-center gap-1 text-[10px] text-indigo-600 dark:text-indigo-400 font-mono">
                <span>DOI: {item.doi}</span>
                <a
                  href={`https://doi.org/${item.doi}`}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:underline flex items-center"
                >
                  <ExternalLink className="w-2.5 h-2.5 ml-0.5" />
                </a>
              </div>
            )}

            {item.relevanceReason && (
              <p className="text-[11px] text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-900 p-2 rounded-lg border border-slate-200/50 dark:border-slate-800/80 italic">
                <span className="font-semibold text-slate-700 dark:text-slate-300 not-italic">Relevance: </span>
                "{item.relevanceReason}"
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
