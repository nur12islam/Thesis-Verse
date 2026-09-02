import React, { useState } from "react";
import { checkOriginalityAndDuplicates } from "../../services/api";
import {
  ShieldAlert,
  Sparkles,
  Loader2,
  AlertTriangle,
  CheckCircle2,
  Lightbulb,
  FileCheck,
  Zap,
  Percent
} from "lucide-react";

interface DuplicateDetectionToolProps {
  onShowToast: (title: string, message?: string, type?: "success" | "error" | "info") => void;
}

export const DuplicateDetectionTool: React.FC<DuplicateDetectionToolProps> = ({ onShowToast }) => {
  const [targetTitle, setTargetTitle] = useState("Quantum Neural Operators for Non-Linear Differential Equations");
  const [proposalText, setProposalText] = useState(
    "This research proposal addresses non-linear partial differential equations using continuous neural operators. We propose a hybrid architecture combining Fourier layer integrations with sparse attention matrices to accelerate convergence over traditional finite element models."
  );
  const [loading, setLoading] = useState(false);

  const [analysis, setAnalysis] = useState<{
    originalityScore: number;
    overlapPercentage: number;
    flaggedSections: {
      text: string;
      similarity: number;
      sourceMatch: string;
      recommendation: string;
    }[];
    recommendations: string[];
  } | null>(null);

  const handleCheckOriginality = async () => {
    if (!proposalText.trim()) {
      onShowToast("Proposal Text Required", "Please enter proposal draft text for originality analysis.", "info");
      return;
    }

    setLoading(true);
    try {
      const res = await checkOriginalityAndDuplicates({
        proposalText,
        targetTitle,
      });
      setAnalysis(res);
      onShowToast("Originality Analysis Complete", `Originality score: ${res.originalityScore}%`, "success");
    } catch (err: any) {
      onShowToast("Check Failed", err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-950 via-slate-900 to-indigo-950 text-white shadow-md border border-emerald-500/20">
        <div className="flex items-center gap-2 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-2">
          <ShieldAlert className="w-4 h-4 text-amber-300" /> Academic Originality & Idea Overlap Assistant
        </div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-white">
          Originality & Idea Overlap Checker
        </h2>
        <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
          Evaluate your proposal draft against database dissertations and literature paradigms. Identify common research tropes and receive concrete recommendations to elevate novelty.
        </p>
        <p className="text-[10px] text-amber-300/80 mt-2 font-semibold italic">
          * Note: This is an educational originality aid to help differentiate research ideas, not a formal plagiarism detection tool.
        </p>
      </div>

      {/* Input Box */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
            Proposal Working Title
          </label>
          <input
            type="text"
            value={targetTitle}
            onChange={(e) => setTargetTitle(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
            Proposal Summary / Abstract / Methodology Draft
          </label>
          <textarea
            rows={5}
            value={proposalText}
            onChange={(e) => setProposalText(e.target.value)}
            className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <button
          onClick={handleCheckOriginality}
          disabled={loading}
          className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Cross-Referencing Database Ideas...
            </>
          ) : (
            <>
              <FileCheck className="w-4 h-4 text-amber-300" /> Analyze Proposal Originality
            </>
          )}
        </button>
      </div>

      {/* Analysis Output */}
      {analysis && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Score Widgets */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-900 dark:text-emerald-200 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 block">
                  Originality Rating
                </span>
                <span className="text-3xl font-extrabold">{analysis.originalityScore}%</span>
                <span className="text-[11px] block text-emerald-700 dark:text-emerald-300 mt-0.5">High Novelty & Unique Angle</span>
              </div>
              <CheckCircle2 className="w-10 h-10 text-emerald-500" />
            </div>

            <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-200 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 block">
                  Literature Overlap Ratio
                </span>
                <span className="text-3xl font-extrabold">{analysis.overlapPercentage}%</span>
                <span className="text-[11px] block text-amber-700 dark:text-amber-300 mt-0.5">Standard Paradigmatic Elements</span>
              </div>
              <Percent className="w-10 h-10 text-amber-500" />
            </div>
          </div>

          {/* Flagged Sections */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" /> Common Literature Tropes Identified ({analysis.flaggedSections.length})
            </h3>

            <div className="space-y-3 text-xs">
              {analysis.flaggedSections.map((sec, i) => (
                <div key={i} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
                  <div className="flex items-center justify-between font-bold text-slate-900 dark:text-white">
                    <span>Similarity match: {sec.similarity}%</span>
                    <span className="text-[10px] text-amber-500 font-semibold">{sec.sourceMatch}</span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 italic">"{sec.text}"</p>
                  <div className="p-2.5 rounded-lg bg-indigo-500/10 text-indigo-900 dark:text-indigo-200 text-[11px]">
                    <strong className="font-bold">Recommendation to Differentiate:</strong> {sec.recommendation}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Enhancement Advice */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-amber-500" /> Strategic Enhancements to Maximize Originality
            </h3>
            <ul className="space-y-2 text-xs">
              {analysis.recommendations.map((rec, i) => (
                <li key={i} className="flex items-start gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 font-medium">
                  <Zap className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};
