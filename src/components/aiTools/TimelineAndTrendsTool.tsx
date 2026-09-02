import React, { useState } from "react";
import {
  TrendingUp,
  Calendar,
  Sparkles,
  BarChart3,
  Flame,
  ArrowDownRight,
  HelpCircle,
  Lightbulb,
  CheckCircle2,
  Clock
} from "lucide-react";

interface TimelineAndTrendsToolProps {
  onShowToast: (title: string, message?: string, type?: "success" | "error" | "info") => void;
}

export const TimelineAndTrendsTool: React.FC<TimelineAndTrendsToolProps> = ({ onShowToast }) => {
  const [selectedSubject, setSelectedSubject] = useState("Quantum Computing & Neural AI");

  const TIMELINE_EVENTS = [
    {
      year: "2010",
      milestone: "Foundational Variational Quantum Eigensolvers (VQE)",
      description: "First mathematical proofs demonstrating hybrid quantum-classical optimization for molecular energy states.",
      keyPapersCount: 14,
      impact: "High Fundamental Impact"
    },
    {
      year: "2013",
      milestone: "Deep Convolutional Neural Operators Introduced",
      description: "Neural networks adapted to continuous infinite-dimensional function space mapping.",
      keyPapersCount: 38,
      impact: "Paradigm Shift"
    },
    {
      year: "2016",
      milestone: "Fourier Neural Operators (FNO) Breakthrough",
      description: "Fast Fourier transforms used in kernel integration for 1000x faster fluid dynamics solving.",
      keyPapersCount: 82,
      impact: "High Citation Growth"
    },
    {
      year: "2020",
      milestone: "Zero-Knowledge Proofs in Quantum Circuits",
      description: "Verifiable quantum state computation without revealing private superposition vectors.",
      keyPapersCount: 140,
      impact: "Interdisciplinary Convergence"
    },
    {
      year: "2025-2026",
      milestone: "Quantum Neural Operators for Non-Linear Wave Dynamics",
      description: "Current frontier in doctoral dissertations: real-time plasma turbulence and optogenetic neural simulation.",
      keyPapersCount: 310,
      impact: "Active Doctoral Frontier 🔥"
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-cyan-950 via-slate-900 to-indigo-950 text-white shadow-md border border-cyan-500/20">
        <div className="flex items-center gap-2 text-cyan-300 text-xs font-bold uppercase tracking-wider mb-2">
          <TrendingUp className="w-4 h-4 text-amber-300" /> Academic Field Evolution
        </div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-white">
          Research Timeline & Longitudinal Trend Analysis
        </h2>
        <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
          Track how scientific disciplines have evolved over time, identify emerging keywords, monitor declining topics, and discover open research areas.
        </p>
      </div>

      {/* 1. Research Timeline Section */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-indigo-600" /> Chronological Field Evolution Timeline
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Evolution of key paradigms in <strong className="text-slate-700 dark:text-slate-300">{selectedSubject}</strong>
            </p>
          </div>

          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200"
          >
            <option value="Quantum Computing & Neural AI">Quantum Computing & Neural AI</option>
            <option value="Bio-Engineering & Optogenetics">Bio-Engineering & Optogenetics</option>
            <option value="Zero-Knowledge Cryptography">Zero-Knowledge Cryptography</option>
            <option value="Gothic Literature & AI Stylometry">Gothic Literature & AI Stylometry</option>
          </select>
        </div>

        {/* Timeline Horizontal / Vertical Cards */}
        <div className="relative border-l-2 border-indigo-500/30 pl-6 ml-4 space-y-6">
          {TIMELINE_EVENTS.map((event, idx) => (
            <div key={idx} className="relative group">
              <div className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-indigo-600 border-4 border-white dark:border-slate-900 shadow-sm" />

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-indigo-500/40 transition-all space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="px-3 py-1 rounded-full bg-indigo-600 text-white font-extrabold text-xs">
                    {event.year}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-500 bg-amber-500/10 px-2.5 py-0.5 rounded-full">
                    {event.impact}
                  </span>
                </div>

                <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                  {event.milestone}
                </h4>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {event.description}
                </p>

                <div className="text-[11px] font-semibold text-slate-400">
                  📚 Approx {event.keyPapersCount} doctoral dissertations indexed during this era
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Visual Trend Analysis Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Emerging Keywords */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center gap-2 font-extrabold text-sm text-slate-900 dark:text-white">
            <Flame className="w-5 h-5 text-amber-500" /> Emerging Keywords (+2026 Spike)
          </div>
          <div className="space-y-2.5 text-xs">
            {[
              { tag: "Quantum Neural Operators", growth: "+148%", papers: "310 papers" },
              { tag: "Optogenetic Neural Stimulation", growth: "+112%", papers: "240 papers" },
              { tag: "Zero-Knowledge STARKs", growth: "+89%", papers: "180 papers" },
              { tag: "Epigenetic Memory in Organoids", growth: "+76%", papers: "125 papers" },
            ].map((k, idx) => (
              <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <span className="font-bold text-slate-800 dark:text-slate-200">#{k.tag}</span>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-slate-400">{k.papers}</span>
                  <span className="font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full text-[10px]">
                    {k.growth}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Declining / Saturated Topics */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center gap-2 font-extrabold text-sm text-slate-900 dark:text-white">
            <ArrowDownRight className="w-5 h-5 text-rose-500" /> Saturated & Declining Research Areas
          </div>
          <div className="space-y-2.5 text-xs">
            {[
              { tag: "Standard ResNet Image Classification", status: "Extremely Saturated (-42%)" },
              { tag: "Basic Sentiment Analysis on Twitter", status: "High Saturation (-35%)" },
              { tag: "Simple RNN Time-Series Forecasting", status: "Superseded by Transformers (-50%)" },
            ].map((k, idx) => (
              <div key={idx} className="p-2.5 rounded-xl bg-rose-500/5 border border-rose-500/20 space-y-1">
                <span className="font-bold text-slate-800 dark:text-slate-200 block">{k.tag}</span>
                <span className="text-[10px] font-semibold text-rose-600 dark:text-rose-400">{k.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Open Research Areas Banner */}
      <div className="p-6 rounded-2xl bg-indigo-950 text-white border border-indigo-800 shadow-md space-y-3">
        <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
          <Lightbulb className="w-4 h-4 text-amber-300" /> Open Unexplored Research Frontiers
        </h3>
        <p className="text-xs text-slate-300 leading-relaxed">
          Database gap analysis reveals that cross-domain topics combining <strong>Quantum Neural Operators</strong> with <strong>Biological Organoids</strong> remain virtually unexplored (&lt;15 total global publications prior to 2026).
        </p>
      </div>
    </div>
  );
};
