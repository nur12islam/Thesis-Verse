import React, { useState, useEffect } from "react";
import { ResearchGapDashboardData } from "../types/thesis";
import { fetchResearchGaps } from "../services/api";
import {
  Compass,
  AlertCircle,
  TrendingUp,
  Sparkles,
  Zap,
  Flame,
  CheckCircle2,
  HelpCircle,
  ArrowRight,
  Layers,
  Cpu,
  Loader2,
  RefreshCw,
  Plus
} from "lucide-react";

interface ResearchGapDashboardProps {
  onSelectTopic: (topicA: string, topicB?: string) => void;
  onShowToast: (title: string, message?: string, type?: "success" | "error" | "info") => void;
}

export const ResearchGapDashboard: React.FC<ResearchGapDashboardProps> = ({
  onSelectTopic,
  onShowToast,
}) => {
  const [data, setData] = useState<ResearchGapDashboardData | null>(null);
  const [loading, setLoading] = useState(false);

  // Custom Interdisciplinary Pair Builder State
  const [customDomainA, setCustomDomainA] = useState("Psychology");
  const [customDomainB, setCustomDomainB] = useState("Artificial Intelligence");

  const ALL_SUBJECTS = [
    "Computer Science",
    "Artificial Intelligence",
    "Bio-Engineering & Genomics",
    "Quantum Computing",
    "English Literature",
    "History",
    "Psychology",
    "Economics",
    "Climate & Sustainability",
    "Cybersecurity & Cryptography",
    "Neuroscience & Cognitive AI",
    "Law",
    "Sociology",
    "Materials Science"
  ];

  const loadGapData = async () => {
    setLoading(true);
    try {
      const result = await fetchResearchGaps({ subjects: ["Computer Science", "Artificial Intelligence", "Quantum Computing", "Bio-Engineering & Genomics", "Psychology"] });
      setData(result);
    } catch (err: any) {
      console.warn("Failed to load gap data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGapData();
  }, []);

  const handleSynthesizeCustomBridge = () => {
    if (customDomainA === customDomainB) {
      onShowToast("Select Different Subjects", "Choose two distinct academic domains for interdisciplinary discovery.", "info");
      return;
    }
    onSelectTopic(customDomainA, customDomainB);
    onShowToast("Interdisciplinary Vector Selected", `Synthesizing ${customDomainA} + ${customDomainB}`, "success");
  };

  return (
    <div className="space-y-8 rounded-3xl bg-slate-900 border-2 border-indigo-500/30 p-6 sm:p-8 text-white shadow-2xl">
      {/* Dashboard Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 text-xs font-bold mb-2">
            <Compass className="w-3.5 h-3.5" /> Visual Intelligence
          </div>
          <h2 className="text-2xl font-black tracking-tight flex items-center gap-2">
            Research Gap & Saturation Dashboard
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Statistical heatmap analyzing saturated vs. unexplored literature domains across peer-reviewed repositories.
          </p>
        </div>

        <button
          onClick={loadGapData}
          disabled={loading}
          className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 transition-colors flex items-center gap-1.5"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} /> Refresh Analysis
        </button>
      </div>

      {loading && !data ? (
        <div className="p-12 text-center space-y-3">
          <Loader2 className="w-8 h-8 text-indigo-500 animate-spin mx-auto" />
          <p className="text-xs text-slate-400 font-medium">Scanning global repository metadata for research gaps...</p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* 3-Column Saturation Breakdown: Saturated vs Moderate vs Ignored */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Saturated Areas */}
            <div className="p-5 rounded-2xl bg-rose-950/20 border border-rose-500/30 space-y-4">
              <div className="flex items-center justify-between border-b border-rose-900/50 pb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4" /> Highly Saturated
                </span>
                <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400 text-[10px] font-bold">
                  High Competition
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Over-researched topics with 10,000+ published papers. Low novelty margin.</p>
              
              <div className="space-y-2.5">
                {data?.frequentlyStudiedAreas?.map((item, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                    <p className="font-bold text-xs text-slate-200">{item.topic}</p>
                    <div className="flex items-center justify-between text-[10px] text-slate-400">
                      <span>Est. Papers: {item.paperCount.toLocaleString()}</span>
                      <span className="text-rose-400 font-bold">{item.saturation}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Moderately Studied Areas */}
            <div className="p-5 rounded-2xl bg-amber-950/20 border border-amber-500/30 space-y-4">
              <div className="flex items-center justify-between border-b border-amber-900/50 pb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4" /> Moderately Studied
                </span>
                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-[10px] font-bold">
                  Balanced Field
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Active research topics with established frameworks but remaining sub-gaps.</p>

              <div className="space-y-2.5">
                {data?.moderatelyStudiedAreas?.map((item, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                    <p className="font-bold text-xs text-slate-200">{item.topic}</p>
                    <div className="flex items-center justify-between text-[10px] text-slate-400">
                      <span>Est. Papers: {item.paperCount.toLocaleString()}</span>
                      <span className="text-amber-400 font-bold">{item.saturation}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Ignored / Unexplored Areas */}
            <div className="p-5 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 space-y-4">
              <div className="flex items-center justify-between border-b border-emerald-900/50 pb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" /> Ignored / Unexplored Gaps
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                  Highest Opportunity
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Unaddressed literature gaps with sparse prior publication and high novelty.</p>

              <div className="space-y-2.5">
                {data?.ignoredAreas?.map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => onSelectTopic(item.topic)}
                    className="p-3 rounded-xl bg-slate-950/80 border border-emerald-900/40 hover:border-emerald-500 transition-all cursor-pointer group space-y-1"
                  >
                    <div className="flex items-start justify-between gap-1">
                      <p className="font-bold text-xs text-emerald-300 group-hover:text-emerald-200">{item.topic}</p>
                      <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400">
                        {item.opportunityRating}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400 italic leading-normal">{item.reason}</p>
                    <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1 pt-1">
                      Synthesize Topic <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Interactive Interdisciplinary Subject Engine */}
          <div className="p-6 rounded-2xl bg-slate-950 border border-indigo-500/30 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-4">
              <div>
                <h3 className="font-extrabold text-base text-amber-300 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-400" /> Interdisciplinary Subject Collision Engine
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Combine two unrelated academic fields to synthesize rare, high-novelty dissertation research vectors.
                </p>
              </div>
            </div>

            {/* Custom Domain Picker Row */}
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Academic Domain A</label>
                <select
                  value={customDomainA}
                  onChange={(e) => setCustomDomainA(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-bold text-indigo-300"
                >
                  {ALL_SUBJECTS.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div className="text-center font-black text-amber-400 text-lg sm:pt-4">
                +
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Academic Domain B</label>
                <select
                  value={customDomainB}
                  onChange={(e) => setCustomDomainB(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-bold text-purple-300"
                >
                  {ALL_SUBJECTS.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>

            <button
              onClick={handleSynthesizeCustomBridge}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-amber-600 hover:from-indigo-500 hover:to-amber-500 text-white font-extrabold text-xs shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" /> Synthesize Interdisciplinary Bridge ({customDomainA} + {customDomainB})
            </button>

            {/* Sample Pre-Calculated Interdisciplinary Opportunities */}
            {data?.interdisciplinaryOpportunities && data.interdisciplinaryOpportunities.length > 0 && (
              <div className="space-y-3 pt-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                  Curated Interdisciplinary Frontier Vector Ideas:
                </span>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {data.interdisciplinaryOpportunities.map((opp, idx) => (
                    <div
                      key={idx}
                      onClick={() => onSelectTopic(opp.domainA, opp.domainB)}
                      className="p-4 rounded-xl bg-slate-900 border border-indigo-900/50 hover:border-amber-500 transition-all cursor-pointer group space-y-2 flex flex-col justify-between"
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-1 text-[10px] font-bold text-amber-400">
                          <span>{opp.domainA}</span>
                          <span>+</span>
                          <span>{opp.domainB}</span>
                        </div>
                        <p className="font-bold text-xs text-slate-100 group-hover:text-amber-200">
                          {opp.proposedBridge}
                        </p>
                      </div>

                      <div className="flex items-center justify-between text-[10px] border-t border-slate-800 pt-2 text-slate-400">
                        <span className="font-bold text-rose-400">{opp.noveltyScore}% Novelty</span>
                        <span className="text-indigo-400 font-bold group-hover:translate-x-1 transition-transform flex items-center gap-0.5">
                          Discover <ArrowRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
