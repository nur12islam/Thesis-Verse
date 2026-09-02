import React, { useState } from "react";
import { fetchResearchAdvisorRecommendations } from "../../services/api";
import {
  Compass,
  Sparkles,
  Loader2,
  CheckCircle2,
  Users,
  Target,
  AlertTriangle,
  Lightbulb,
  Tag,
  GraduationCap,
  Layers,
  ArrowUpRight
} from "lucide-react";

interface ResearchAdvisorToolProps {
  onShowToast: (title: string, message?: string, type?: "success" | "error" | "info") => void;
}

export const ResearchAdvisorTool: React.FC<ResearchAdvisorToolProps> = ({ onShowToast }) => {
  const [title, setTitle] = useState("Quantum Neural Operators for Non-Linear Differential Equations");
  const [subject, setSubject] = useState("Quantum Computing");
  const [objectives, setObjectives] = useState([
    "Develop a neural operator framework for non-linear equations",
    "Evaluate computation speed against standard FEM solvers",
    "Test error convergence rates on 3 synthetic physics datasets"
  ]);
  const [newObjInput, setNewObjInput] = useState("");
  const [loading, setLoading] = useState(false);

  const [advice, setAdvice] = useState<{
    suggestedTitles: string[];
    improvedObjectives: string[];
    alternativeMethodologies: string[];
    additionalKeywords: string[];
    potentialSupervisors: { name: string; institution: string; matchReason: string }[];
    relatedDisciplines: string[];
    riskFactors: string[];
    futureExtensions: string[];
  } | null>(null);

  const handleAddObjective = () => {
    if (newObjInput.trim()) {
      setObjectives([...objectives, newObjInput.trim()]);
      setNewObjInput("");
    }
  };

  const handleRemoveObjective = (idx: number) => {
    setObjectives(objectives.filter((_, i) => i !== idx));
  };

  const handleConsultAdvisor = async () => {
    if (!title.trim()) {
      onShowToast("Title Required", "Please enter a working research title.", "info");
      return;
    }

    setLoading(true);
    try {
      const res = await fetchResearchAdvisorRecommendations({
        currentTitle: title,
        currentObjectives: objectives,
        subject,
      });
      setAdvice(res);
      onShowToast("Advisory Consult Complete", "Generated strategic committee recommendations.", "success");
    } catch (err: any) {
      onShowToast("Advisor Error", err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-violet-900 via-indigo-950 to-slate-900 text-white shadow-md border border-violet-500/20">
        <div className="flex items-center gap-2 text-violet-300 text-xs font-bold uppercase tracking-wider mb-2">
          <Compass className="w-4 h-4 text-amber-300" /> Doctoral Strategic Committee
        </div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-white">
          AI Research Advisor & Supervisor Matcher
        </h2>
        <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
          Receive high-level dissertation committee feedback: title refinements, S.M.A.R.T. objectives, methodology alternatives, risk factors, and potential advisor matches.
        </p>
      </div>

      {/* Input Box */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Current Working Research Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Quantum Neural Operators for Non-Linear Differential Equations..."
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Primary Academic Field
            </label>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-violet-500"
            >
              <option value="Quantum Computing">Quantum Computing</option>
              <option value="Computer Science">Computer Science</option>
              <option value="Artificial Intelligence">Artificial Intelligence</option>
              <option value="Bio-Engineering & Genomics">Bio-Engineering & Genomics</option>
              <option value="Cybersecurity & Cryptography">Cybersecurity & Cryptography</option>
              <option value="Psychology">Psychology</option>
              <option value="English Literature">English Literature</option>
            </select>
          </div>
        </div>

        {/* Current Objectives List */}
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
            Draft Research Objectives ({objectives.length})
          </label>
          <div className="space-y-2 mb-2">
            {objectives.map((obj, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs"
              >
                <span className="font-medium text-slate-800 dark:text-slate-200">
                  {i + 1}. {obj}
                </span>
                <button
                  onClick={() => handleRemoveObjective(i)}
                  className="text-slate-400 hover:text-rose-500 text-[11px] font-bold px-2 py-0.5 rounded"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={newObjInput}
              onChange={(e) => setNewObjInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddObjective()}
              placeholder="Add another research objective..."
              className="flex-1 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
            <button
              onClick={handleAddObjective}
              className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 text-xs font-bold"
            >
              Add Objective
            </button>
          </div>
        </div>

        <button
          onClick={handleConsultAdvisor}
          disabled={loading}
          className="px-6 py-3 rounded-xl bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Consulting Committee AI...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-amber-300" /> Generate Advisory Recommendations
            </>
          )}
        </button>
      </div>

      {/* Advisory Output Display */}
      {advice && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Section 1: Suggested Titles */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-amber-500" /> Refined High-Impact Titles
            </h3>
            <div className="grid grid-cols-1 gap-2.5">
              {advice.suggestedTitles.map((t, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    setTitle(t);
                    onShowToast("Title Updated", "Set working title to suggested title.", "info");
                  }}
                  className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-violet-500/50 cursor-pointer transition-colors flex items-center justify-between text-xs group"
                >
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{t}</span>
                  <span className="text-[10px] font-bold text-violet-600 dark:text-violet-400 group-hover:underline shrink-0">
                    Use This Title
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Section 2: Improved Objectives & Methodologies */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <Target className="w-4 h-4 text-emerald-500" /> S.M.A.R.T. Improved Objectives
              </h3>
              <ul className="space-y-2 text-xs">
                {advice.improvedObjectives.map((obj, idx) => (
                  <li key={idx} className="flex items-start gap-2 p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-900 dark:text-emerald-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{obj}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-indigo-500" /> Alternative & Complementary Methodologies
              </h3>
              <ul className="space-y-2 text-xs">
                {advice.alternativeMethodologies.map((m, idx) => (
                  <li key={idx} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200">
                    <strong className="font-bold text-indigo-600 dark:text-indigo-400 block mb-0.5">Methodology #{idx + 1}</strong>
                    {m}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Section 3: Potential Supervisors & Related Disciplines */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-violet-500" /> Matched Faculty Supervisors
              </h3>
              <div className="space-y-2.5">
                {advice.potentialSupervisors.map((sup, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs space-y-1">
                    <div className="flex items-center justify-between font-bold text-slate-900 dark:text-white">
                      <span>{sup.name}</span>
                      <span className="text-[10px] text-violet-600 dark:text-violet-400 bg-violet-500/10 px-2 py-0.5 rounded-full">{sup.institution}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">{sup.matchReason}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <Tag className="w-4 h-4 text-cyan-500" /> Keywords & Related Disciplines
              </h3>
              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1.5">Recommended Indexing Keywords</span>
                  <div className="flex flex-wrap gap-1.5">
                    {advice.additionalKeywords.map((kw, idx) => (
                      <span key={idx} className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium text-[11px]">
                        #{kw}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1.5">Adjacent Interdisciplinary Disciplines</span>
                  <div className="flex flex-wrap gap-1.5">
                    {advice.relatedDisciplines.map((d, idx) => (
                      <span key={idx} className="px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-semibold text-[11px]">
                        🌐 {d}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 4: Risk Factors & Extensions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-rose-500/5 dark:bg-rose-950/20 border border-rose-500/20 shadow-sm space-y-3">
              <h3 className="font-extrabold text-sm text-rose-900 dark:text-rose-300 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-500" /> Research Risk Factors & Bottlenecks
              </h3>
              <ul className="space-y-2 text-xs text-rose-800 dark:text-rose-200">
                {advice.riskFactors.map((r, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-6 rounded-2xl bg-indigo-500/5 dark:bg-indigo-950/20 border border-indigo-500/20 shadow-sm space-y-3">
              <h3 className="font-extrabold text-sm text-indigo-900 dark:text-indigo-300 flex items-center gap-2">
                <ArrowUpRight className="w-4 h-4 text-indigo-500" /> Post-Doctoral Extensions & Impact
              </h3>
              <ul className="space-y-2 text-xs text-indigo-800 dark:text-indigo-200">
                {advice.futureExtensions.map((ext, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                    <span>{ext}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
