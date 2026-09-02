import React, { useState } from "react";
import {
  LayoutDashboard,
  Sparkles,
  TrendingUp,
  Clock,
  CheckCircle2,
  Bookmark,
  Compass,
  ListTodo,
  BookOpen,
  Zap,
  ArrowRight
} from "lucide-react";

interface AdvancedDashboardWidgetProps {
  onNavigateToTool: (toolKey: string) => void;
  onShowToast: (title: string, message?: string, type?: "success" | "error" | "info") => void;
}

export const AdvancedDashboardWidget: React.FC<AdvancedDashboardWidgetProps> = ({
  onNavigateToTool,
  onShowToast
}) => {
  const [tasks, setTasks] = useState([
    { id: "1", text: "Synthesize Chapter 2 Literature Review using Gemini", done: true },
    { id: "2", text: "Run Originality & Duplicate Check on Proposal Draft", done: false },
    { id: "3", text: "Generate APA & BibTeX citations for saved dissertations", done: false },
    { id: "4", text: "Consult AI Research Advisor for S.M.A.R.T. objectives", done: false }
  ]);

  const toggleTask = (id: string) => {
    setTasks(
      tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    );
  };

  return (
    <div className="space-y-6">
      {/* Hero Welcome Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-900 text-white shadow-xl border border-indigo-500/20 relative overflow-hidden">
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" /> AI Ecosystem Dashboard
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Welcome to Your Personal Research Workspace
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            Monitor research progress, synthesize literature reviews, run originality checks, manage citations, and collaborate with your doctoral committee.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => onNavigateToTool("lit-review")}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2"
            >
              <BookOpen className="w-4 h-4" /> Generate Literature Review
            </button>
            <button
              onClick={() => onNavigateToTool("advisor")}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 transition-all flex items-center gap-2"
            >
              <Compass className="w-4 h-4 text-amber-300" /> Consult Research Advisor
            </button>
          </div>
        </div>
      </div>

      {/* Grid Overview Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Widget 1: Proposal Progress */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Proposal Progress</span>
            <span className="text-xs font-extrabold text-indigo-600 dark:text-indigo-400">75% Complete</span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
            <div className="bg-indigo-600 h-full rounded-full transition-all duration-500" style={{ width: "75%" }} />
          </div>
          <p className="text-[11px] text-slate-500">3 of 4 proposal chapters verified & formatted.</p>
        </div>

        {/* Widget 2: Reading Statistics */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Library Reading Stats</span>
            <Zap className="w-4 h-4 text-amber-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900 dark:text-white">18 Dissertations</span>
            <span className="text-xs text-emerald-500 font-bold">+4 this week</span>
          </div>
          <p className="text-[11px] text-slate-500">Grounded in 2025/2026 peer-reviewed repositories.</p>
        </div>

        {/* Widget 3: AI Insights */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">AI Trend Alert</span>
            <TrendingUp className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-xs text-slate-800 dark:text-slate-200 font-semibold leading-relaxed">
            Spike detected: +148% increase in <strong>Quantum Neural Operator</strong> papers in 2026.
          </p>
          <button
            onClick={() => onNavigateToTool("timeline")}
            className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1 hover:underline"
          >
            View Trend Analysis <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Tasks Checklist & Recent Activity */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Research Tasks Checklist */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
            <ListTodo className="w-4 h-4 text-indigo-600" /> Upcoming Research Milestone Tasks
          </h3>
          <div className="space-y-2">
            {tasks.map((t) => (
              <div
                key={t.id}
                onClick={() => toggleTask(t.id)}
                className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                  t.done
                    ? "bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-400 line-through"
                    : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:border-indigo-500/40"
                }`}
              >
                <input
                  type="checkbox"
                  checked={t.done}
                  onChange={() => toggleTask(t.id)}
                  className="rounded text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-xs font-semibold">{t.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity Log */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
            <Clock className="w-4 h-4 text-indigo-600" /> Recent Activity Log
          </h3>
          <div className="space-y-3 text-xs">
            {[
              { action: "Generated Literature Review on Quantum Neural Operators", time: "10 mins ago" },
              { action: "Added 3 dissertations to My Library", time: "1 hour ago" },
              { action: "Consulted AI Research Advisor for S.M.A.R.T. objectives", time: "Yesterday" },
              { action: "Exported APA & BibTeX citations bundle", time: "2 days ago" }
            ].map((log, i) => (
              <div key={i} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <span className="font-medium text-slate-800 dark:text-slate-200">{log.action}</span>
                <span className="text-[10px] text-slate-400">{log.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
