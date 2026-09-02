import React from "react";
import { AiSearchInsights } from "../types/thesis";
import {
  Bot,
  Sparkles,
  GraduationCap,
  Tag,
  Compass,
  Zap,
  Brain,
  Search,
  BookOpen,
  ArrowRight,
  TrendingUp,
  Layers,
  HelpCircle,
  Cpu
} from "lucide-react";

interface AiInsightsSectionProps {
  insights: AiSearchInsights | null;
  loading: boolean;
  isStudentMode: boolean;
  onToggleStudentMode: (enabled: boolean) => void;
  selectedModel: "fast" | "reasoning";
  onChangeModel: (model: "fast" | "reasoning") => void;
  onSelectTopicChip: (topic: string) => void;
  query: string;
}

export const AiInsightsSection: React.FC<AiInsightsSectionProps> = ({
  insights,
  loading,
  isStudentMode,
  onToggleStudentMode,
  selectedModel,
  onChangeModel,
  onSelectTopicChip,
  query,
}) => {
  if (loading) {
    return (
      <div className="p-6 rounded-2xl bg-gradient-to-r from-indigo-50/80 via-purple-50/50 to-slate-50 dark:from-indigo-950/40 dark:via-purple-950/20 dark:to-slate-900 border border-indigo-200/60 dark:border-indigo-800/50 shadow-sm animate-pulse space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-indigo-200 dark:bg-indigo-800"></div>
            <div className="h-4 w-48 bg-indigo-200 dark:bg-indigo-800 rounded"></div>
          </div>
          <div className="h-4 w-24 bg-slate-200 dark:bg-slate-700 rounded"></div>
        </div>
        <div className="h-16 bg-slate-200/70 dark:bg-slate-800/70 rounded-xl w-full"></div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-12 bg-slate-200/50 dark:bg-slate-800/50 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  if (!insights) return null;

  return (
    <div className="rounded-2xl bg-gradient-to-br from-indigo-900/5 via-purple-900/5 to-slate-900/5 dark:from-indigo-950/60 dark:via-slate-900/90 dark:to-purple-950/40 border border-indigo-200/80 dark:border-indigo-800/70 p-5 sm:p-6 shadow-sm space-y-6">
      {/* Top Banner & Control Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-indigo-100 dark:border-slate-800/80">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-600/20">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
                AI Research Insights
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 dark:bg-indigo-900/80 text-indigo-700 dark:text-indigo-300 border border-indigo-300/60 dark:border-indigo-700/60 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-indigo-500" /> 🤖 AI-Generated
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Analysis based strictly on retrieved verified paper metadata for "{query || 'All topics'}".
            </p>
          </div>
        </div>

        {/* Controls: Model Switcher & Student Mode */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Model Selector */}
          <div className="flex items-center gap-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-1 rounded-xl text-xs">
            <button
              onClick={() => onChangeModel("fast")}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-colors flex items-center gap-1 ${
                selectedModel === "fast"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <Zap className="w-3 h-3" /> ⚡ Fast Model
            </button>
            <button
              onClick={() => onChangeModel("reasoning")}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-colors flex items-center gap-1 ${
                selectedModel === "reasoning"
                  ? "bg-purple-600 text-white shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <Brain className="w-3 h-3" /> 🧠 Reasoning
            </button>
          </div>

          {/* Student Mode Toggle */}
          <button
            onClick={() => onToggleStudentMode(!isStudentMode)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 ${
              isStudentMode
                ? "bg-amber-500 text-white border-amber-500 shadow-sm"
                : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-amber-400"
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            {isStudentMode ? "🎓 Student Mode Active" : "🎓 Student Mode"}
          </button>
        </div>
      </div>

      {/* AI Search Summary Card */}
      <div className="p-4 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
          <span className="flex items-center gap-1 text-indigo-600 dark:text-indigo-400 uppercase tracking-wider text-[10px] font-bold">
            <BookOpen className="w-3.5 h-3.5" /> Search Summary
          </span>
          {insights.modelUsed && (
            <span className="text-[10px] text-slate-400 flex items-center gap-1">
              <Cpu className="w-3 h-3" /> {insights.modelUsed}
            </span>
          )}
        </div>
        <p className="text-sm font-medium text-slate-800 dark:text-slate-200 leading-relaxed">
          {insights.searchSummary}
        </p>
      </div>

      {/* Topic Refinements Section (If broad search) */}
      {insights.topicRefinements && insights.topicRefinements.length > 0 && (
        <div className="space-y-2">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <Compass className="w-4 h-4 text-indigo-500" />
            Refine & Narrow Your Research Focus:
          </span>
          <div className="flex flex-wrap gap-2">
            {insights.topicRefinements.map((refinement, i) => (
              <button
                key={i}
                onClick={() => onSelectTopicChip(refinement)}
                className="px-3 py-1.5 rounded-xl bg-indigo-50/80 dark:bg-indigo-950/70 hover:bg-indigo-100 dark:hover:bg-indigo-900/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200/70 dark:border-indigo-800/70 text-xs font-semibold transition-colors flex items-center gap-1.5 group"
              >
                <Search className="w-3 h-3 text-indigo-500 group-hover:scale-110 transition-transform" />
                {refinement}
                <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Key Research Themes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        {/* Dominant Themes */}
        <div className="p-3.5 rounded-xl bg-white/70 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 space-y-2">
          <span className="font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1 uppercase tracking-wider text-[10px]">
            <Layers className="w-3.5 h-3.5" /> Dominant Research Themes
          </span>
          <ul className="space-y-1.5">
            {insights.majorThemes?.map((theme, i) => (
              <li key={i} className="text-slate-700 dark:text-slate-300 font-medium flex items-start gap-1.5">
                <span className="text-indigo-500 font-bold">•</span>
                <span>{theme}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Emerging Research Areas */}
        <div className="p-3.5 rounded-xl bg-white/70 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 space-y-2">
          <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 uppercase tracking-wider text-[10px]">
            <TrendingUp className="w-3.5 h-3.5" /> Emerging Areas
          </span>
          <ul className="space-y-1.5">
            {insights.emergingAreas?.map((area, i) => (
              <li key={i} className="text-slate-700 dark:text-slate-300 font-medium flex items-start gap-1.5">
                <span className="text-emerald-500 font-bold">•</span>
                <span>{area}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Common Methods */}
        <div className="p-3.5 rounded-xl bg-white/70 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 space-y-2">
          <span className="font-bold text-purple-600 dark:text-purple-400 flex items-center gap-1 uppercase tracking-wider text-[10px]">
            <Compass className="w-3.5 h-3.5" /> Common Research Methods
          </span>
          <ul className="space-y-1.5">
            {insights.commonResearchMethods?.map((method, i) => (
              <li key={i} className="text-slate-700 dark:text-slate-300 font-medium flex items-start gap-1.5">
                <span className="text-purple-500 font-bold">•</span>
                <span>{method}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Clickable Related Topics & Extracted Keywords */}
      <div className="pt-2 border-t border-indigo-100 dark:border-slate-800/80 space-y-3">
        {insights.suggestedRelatedTopics && insights.suggestedRelatedTopics.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-slate-500 flex items-center gap-1 uppercase tracking-wider text-[10px]">
              <Tag className="w-3 h-3 text-indigo-500" /> Suggested Related Topics:
            </span>
            {insights.suggestedRelatedTopics.map((topic, i) => (
              <button
                key={i}
                onClick={() => onSelectTopicChip(topic)}
                className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950 text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 border border-slate-200/80 dark:border-slate-700 text-xs font-semibold transition-colors"
              >
                {topic}
              </button>
            ))}
          </div>
        )}

        {/* Primary & Secondary Keyword Tags */}
        {insights.keywords && (
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-slate-500 font-bold uppercase tracking-wider text-[10px]">
              Primary Keywords:
            </span>
            {insights.keywords.primary?.map((kw, i) => (
              <button
                key={i}
                onClick={() => onSelectTopicChip(kw)}
                className="px-2 py-0.5 rounded bg-indigo-100/70 dark:bg-indigo-900/50 text-indigo-800 dark:text-indigo-200 font-bold text-[11px] hover:underline"
              >
                #{kw}
              </button>
            ))}
            {insights.keywords.secondary?.map((kw, i) => (
              <button
                key={i}
                onClick={() => onSelectTopicChip(kw)}
                className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium text-[11px] hover:underline"
              >
                #{kw}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Beginner Mode Section (🎓 Explain Like I'm a Student) */}
      {isStudentMode && insights.beginnerExplanation && (
        <div className="p-4 rounded-xl bg-amber-500/10 dark:bg-amber-950/40 border border-amber-500/30 space-y-3">
          <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-extrabold text-xs uppercase tracking-wider">
            <GraduationCap className="w-4 h-4" /> 🎓 Beginner Student Guide
          </div>
          <p className="text-xs text-slate-800 dark:text-slate-200 font-medium leading-relaxed">
            {insights.beginnerExplanation.overview}
          </p>
          <div className="text-xs space-y-1">
            <span className="font-bold text-slate-900 dark:text-white">Why it matters:</span>
            <p className="text-slate-700 dark:text-slate-300">{insights.beginnerExplanation.importance}</p>
          </div>

          {insights.beginnerExplanation.keyTerminology && (
            <div className="space-y-1.5 pt-1">
              <span className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1">
                <HelpCircle className="w-3.5 h-3.5 text-amber-500" /> Key Terminology:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {insights.beginnerExplanation.keyTerminology.map((termObj, i) => (
                  <div key={i} className="p-2 rounded-lg bg-white/80 dark:bg-slate-900/80 border border-amber-200/50 dark:border-amber-800/40">
                    <span className="font-bold text-indigo-600 dark:text-indigo-400 block">{termObj.term}</span>
                    <span className="text-slate-600 dark:text-slate-400 text-[11px]">{termObj.definition}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
