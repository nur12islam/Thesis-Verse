import React, { useState } from "react";
import { Thesis } from "../types/thesis";
import { comparePapers } from "../services/api";
import {
  BarChart3,
  X,
  Sparkles,
  Loader2,
  CheckCircle2,
  AlertCircle,
  GraduationCap,
  ExternalLink
} from "lucide-react";

interface ComparePageProps {
  comparedTheses: Thesis[];
  onRemoveCompare: (thesis: Thesis) => void;
  onClearCompare: () => void;
  onSelectDetails: (thesis: Thesis) => void;
  onShowToast: (title: string, message?: string, type?: "success" | "error" | "info") => void;
}

export const ComparePage: React.FC<ComparePageProps> = ({
  comparedTheses,
  onRemoveCompare,
  onClearCompare,
  onSelectDetails,
  onShowToast,
}) => {
  const [loadingAi, setLoadingAi] = useState(false);
  const [aiSynthesis, setAiSynthesis] = useState<{
    comparisonSummary?: string;
    synthesisGaps?: string;
    recommendations?: string;
  } | null>(null);

  const handleSynthesizeWithAi = async () => {
    if (comparedTheses.length < 2) {
      onShowToast("Insufficient Papers", "Select at least 2 papers to perform AI comparison.", "info");
      return;
    }

    setLoadingAi(true);
    try {
      const res = await comparePapers(comparedTheses);
      setAiSynthesis(res);
      onShowToast("Synthesis Complete", "AI has generated comparative insights.", "success");
    } catch (err: any) {
      onShowToast("Synthesis Failed", err.message, "error");
    } finally {
      setLoadingAi(false);
    }
  };

  if (comparedTheses.length === 0) {
    return (
      <div className="py-20 text-center space-y-4 max-w-md mx-auto">
        <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto">
          <BarChart3 className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          No Papers Selected for Comparison
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
          Select checkbox <span className="font-semibold text-slate-700 dark:text-slate-300">[ Compare ]</span> on any thesis card in the Search Engine or Library to compare methodologies, findings, and research gaps side-by-side.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <BarChart3 className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
            Paper Comparison Matrix
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Comparing <span className="font-bold text-indigo-600 dark:text-indigo-400">{comparedTheses.length}</span> dissertations side-by-side.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleSynthesizeWithAi}
            disabled={loadingAi || comparedTheses.length < 2}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs shadow-sm transition-colors flex items-center gap-1.5"
          >
            {loadingAi ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4 text-amber-300" />}
            Synthesize Synthesis with AI
          </button>

          <button
            onClick={onClearCompare}
            className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-colors"
          >
            Clear All
          </button>
        </div>
      </div>

      {/* AI Synthesis Summary Box */}
      {aiSynthesis && (
        <div className="p-6 rounded-2xl bg-gradient-to-r from-indigo-950/80 via-slate-900 to-slate-950 text-white border border-indigo-500/30 shadow-xl space-y-4 animate-in fade-in duration-300">
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-amber-300" /> AI Comparative Synthesis Overview
          </div>
          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
            {aiSynthesis.comparisonSummary}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 text-xs">
            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
              <span className="font-bold text-amber-400 block mb-1 uppercase text-[10px]">Overarching Literature Gap</span>
              <p className="text-slate-300">{aiSynthesis.synthesisGaps}</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
              <span className="font-bold text-emerald-400 block mb-1 uppercase text-[10px]">Methodological Recommendations</span>
              <p className="text-slate-300">{aiSynthesis.recommendations}</p>
            </div>
          </div>
        </div>
      )}

      {/* Comparison Table */}
      <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
        <table className="w-full text-left text-xs border-collapse min-w-[800px]">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
              <th className="p-4 font-bold text-slate-500 uppercase text-[10px] w-40 shrink-0">Field / Metric</th>
              {comparedTheses.map((thesis) => (
                <th key={thesis.id} className="p-4 font-bold text-slate-900 dark:text-white min-w-[260px] relative">
                  <button
                    onClick={() => onRemoveCompare(thesis)}
                    className="absolute top-2 right-2 p-1 rounded-md text-slate-400 hover:text-rose-500 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <div className="pr-6">
                    <span className="text-[10px] font-semibold text-indigo-600 dark:text-indigo-400 block mb-0.5">
                      {thesis.subject}
                    </span>
                    <h4
                      onClick={() => onSelectDetails(thesis)}
                      className="font-bold text-sm text-slate-900 dark:text-white hover:underline cursor-pointer line-clamp-2"
                    >
                      {thesis.title}
                    </h4>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
            {/* University & Degree */}
            <tr>
              <td className="p-4 font-bold text-slate-500 uppercase text-[10px]">Institution & Degree</td>
              {comparedTheses.map((t) => (
                <td key={t.id} className="p-4 text-slate-700 dark:text-slate-300">
                  <span className="font-semibold block text-slate-900 dark:text-white">{t.university}</span>
                  <span className="text-[11px] text-slate-500">{t.degree} • {t.year}</span>
                </td>
              ))}
            </tr>

            {/* Novelty & Difficulty */}
            <tr>
              <td className="p-4 font-bold text-slate-500 uppercase text-[10px]">Scores & Metrics</td>
              {comparedTheses.map((t) => (
                <td key={t.id} className="p-4">
                  <div className="flex items-center gap-3">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Novelty</span>
                      <span className="font-bold text-indigo-600 dark:text-indigo-400">{t.noveltyScore}%</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Difficulty</span>
                      <span className="font-bold text-amber-600 dark:text-amber-400">{t.difficultyScore}%</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Citations</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">{t.citationsCount}</span>
                    </div>
                  </div>
                </td>
              ))}
            </tr>

            {/* Methodology */}
            <tr>
              <td className="p-4 font-bold text-slate-500 uppercase text-[10px]">Methodology</td>
              {comparedTheses.map((t) => (
                <td key={t.id} className="p-4 text-slate-700 dark:text-slate-300 leading-relaxed">
                  {t.methodology}
                </td>
              ))}
            </tr>

            {/* Sample Size / Testbed */}
            <tr>
              <td className="p-4 font-bold text-slate-500 uppercase text-[10px]">Sample / Testbed</td>
              {comparedTheses.map((t) => (
                <td key={t.id} className="p-4 text-slate-600 dark:text-slate-400 italic">
                  {t.sampleSize || "Not specified"}
                </td>
              ))}
            </tr>

            {/* Key Findings */}
            <tr>
              <td className="p-4 font-bold text-slate-500 uppercase text-[10px]">Key Findings</td>
              {comparedTheses.map((t) => (
                <td key={t.id} className="p-4">
                  <ul className="space-y-1 text-slate-700 dark:text-slate-300">
                    {t.keyFindings.map((f, idx) => (
                      <li key={idx} className="flex items-start gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </td>
              ))}
            </tr>

            {/* Research Gap */}
            <tr>
              <td className="p-4 font-bold text-slate-500 uppercase text-[10px]">Target Research Gap</td>
              {comparedTheses.map((t) => (
                <td key={t.id} className="p-4 text-amber-600 dark:text-amber-400 italic">
                  "{t.researchGap}"
                </td>
              ))}
            </tr>

            {/* Limitations */}
            <tr>
              <td className="p-4 font-bold text-slate-500 uppercase text-[10px]">Limitations</td>
              {comparedTheses.map((t) => (
                <td key={t.id} className="p-4 text-slate-500 dark:text-slate-400">
                  {t.limitations || "None reported"}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
