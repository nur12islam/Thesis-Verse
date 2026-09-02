import React from "react";
import { Sparkles, Dices, BookOpen, GraduationCap, ShieldCheck, Cpu, Code2 } from "lucide-react";

export const AboutPage: React.FC = () => {
  return (
    <div className="space-y-12 pb-16 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 text-xs font-bold border border-indigo-200 dark:border-indigo-800">
          <Sparkles className="w-3.5 h-3.5" /> About ThesisVerse Platform
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
          Empowering Academic Discovery with AI
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-xl mx-auto leading-relaxed">
          ThesisVerse is an AI-driven academic discovery platform designed to help graduate candidates, professors, and independent scholars uncover rare research gaps, evaluate novelty, and build research proposals.
        </p>
      </div>

      {/* Novelty Score Algorithm Breakdown */}
      <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Cpu className="w-5 h-5 text-indigo-600" />
          The Novelty Score Algorithm (0-100%)
        </h2>
        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
          The ThesisVerse Novelty Score is calculated dynamically by synthesizing four vector dimensions across global academic repositories:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
            <span className="font-bold text-indigo-600 dark:text-indigo-400 uppercase text-[10px]">
              1. Semantic Literature Uniqueness (40%)
            </span>
            <p className="text-slate-600 dark:text-slate-300">
              Measures the high-dimensional cosine distance between proposed abstract hypotheses and existing peer-reviewed publications.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
            <span className="font-bold text-amber-600 dark:text-amber-400 uppercase text-[10px]">
              2. Interdisciplinary Bridge Distance (30%)
            </span>
            <p className="text-slate-600 dark:text-slate-300">
              Rewards ideas that form novel connections between previously separate fields (e.g., Quantum Computing + Geophysics).
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
            <span className="font-bold text-emerald-600 dark:text-emerald-400 uppercase text-[10px]">
              3. Unaddressed Literature Research Gap (20%)
            </span>
            <p className="text-slate-600 dark:text-slate-300">
              Evaluates whether explicit limitation and future work sections from prior dissertations are resolved.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
            <span className="font-bold text-violet-600 dark:text-violet-400 uppercase text-[10px]">
              4. Empirical Feasibility Vector (10%)
            </span>
            <p className="text-slate-600 dark:text-slate-300">
              Assesses whether current technological, computational, or biological testbeds permit empirical testing.
            </p>
          </div>
        </div>
      </div>

      {/* Feature Principles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
          <GraduationCap className="w-6 h-6 text-indigo-600" />
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">Open Access Metadata</h3>
          <p className="text-slate-500">
            Supports DOI resolving, BibTeX citation generation, and standard metadata formats compatible with Zotero and Mendeley.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
          <ShieldCheck className="w-6 h-6 text-emerald-600" />
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">Server-Side Gemini Safety</h3>
          <p className="text-slate-500">
            All AI synthesis is performed securely server-side using Gemini 3.6 Flash models without exposing credentials to the client.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
          <Dices className="w-6 h-6 text-amber-500" />
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">Rare Thesis Generator</h3>
          <p className="text-slate-500">
            Unlocks new dissertation horizons through stochastic interdisciplinary prompts and AI novelty analysis.
          </p>
        </div>
      </div>
    </div>
  );
};
