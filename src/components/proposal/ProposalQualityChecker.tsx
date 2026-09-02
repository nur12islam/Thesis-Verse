import React from "react";
import { ProposalQualityScore } from "../../types/thesis";
import { Award, AlertTriangle, CheckCircle2, TrendingUp, Sparkles, ChevronRight } from "lucide-react";

interface ProposalQualityCheckerProps {
  qualityScore: ProposalQualityScore;
  onApplySuggestion?: (suggestion: string) => void;
}

export const ProposalQualityChecker: React.FC<ProposalQualityCheckerProps> = ({
  qualityScore,
  onApplySuggestion
}) => {
  const { overallScore, breakdown, improvementSuggestions } = qualityScore;

  const getScoreColor = (score: number) => {
    if (score >= 85) return "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-800";
    if (score >= 70) return "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 border-amber-200 dark:border-amber-800";
    return "text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/50 border-rose-200 dark:border-rose-800";
  };

  const metrics = [
    { label: "Title Precision", score: breakdown.titleQuality },
    { label: "Topic Novelty", score: breakdown.novelty },
    { label: "Problem Clarity", score: breakdown.clarity },
    { label: "Scope Definition", score: breakdown.researchScope },
    { label: "Methodology Fit", score: breakdown.methodologyFit },
    { label: "Objectives Clarity", score: breakdown.objectivesClarity },
    { label: "Academic Prose", score: breakdown.writingQuality }
  ];

  return (
    <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-2">
          <Award className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <h3 className="font-bold text-slate-900 dark:text-white text-sm">Proposal Quality Audit</h3>
        </div>
        <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${getScoreColor(overallScore)}`}>
          {overallScore}% Match
        </span>
      </div>

      {/* Main Score Meter */}
      <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-200/60 dark:border-slate-800/80">
        <div className="relative flex items-center justify-center w-16 h-16 shrink-0 rounded-full bg-indigo-600 text-white font-extrabold text-xl shadow-md">
          {overallScore}
          <span className="text-[10px] absolute -bottom-1 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 px-1.5 py-0.2 rounded border border-slate-200 dark:border-slate-800 font-semibold">
            /100
          </span>
        </div>
        <div>
          <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-indigo-500" />
            {overallScore >= 85 ? "Publication-Grade Proposal" : overallScore >= 70 ? "Good Foundation — Needs Minor Refinement" : "Draft Stage — Requires Structural Work"}
          </h4>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            Evaluated against top graduate dissertation guidelines and methodology standards.
          </p>
        </div>
      </div>

      {/* Metric Breakdown Bars */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Evaluation Metrics</h4>
        <div className="space-y-2">
          {metrics.map((m, idx) => (
            <div key={idx} className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-600 dark:text-slate-400 font-medium">{m.label}</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{m.score}%</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    m.score >= 85 ? "bg-indigo-600 dark:bg-indigo-500" : m.score >= 70 ? "bg-amber-500" : "bg-rose-500"
                  }`}
                  style={{ width: `${m.score}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Improvement Suggestions */}
      {improvementSuggestions && improvementSuggestions.length > 0 && (
        <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            Actionable Enhancements
          </h4>
          <ul className="space-y-2">
            {improvementSuggestions.map((sug, i) => (
              <li
                key={i}
                className="text-xs text-slate-700 dark:text-slate-300 bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 p-2.5 rounded-xl flex items-start gap-2"
              >
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <span className="flex-1 leading-relaxed">{sug}</span>
                {onApplySuggestion && (
                  <button
                    onClick={() => onApplySuggestion(sug)}
                    className="shrink-0 text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-0.5"
                  >
                    Fix <ChevronRight className="w-3 h-3" />
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
