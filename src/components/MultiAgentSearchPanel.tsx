import React, { useState } from "react";
import { MultiAgentSearchResponse, AgentSearchResult } from "../types/thesis";
import {
  Bot,
  Sparkles,
  Zap,
  Brain,
  Code,
  BookOpen,
  Cpu,
  Layers,
  ChevronDown,
  ChevronUp,
  Loader2,
  CheckCircle2,
  Target,
  Search,
  Filter,
  BarChart3,
  Award
} from "lucide-react";

interface MultiAgentSearchPanelProps {
  multiAgentData: MultiAgentSearchResponse | null;
  loading: boolean;
  query: string;
  onRunMultiAgentSearch: () => void;
  selectedAgentFilter: string; // 'all' or agentId
  onSelectAgentFilter: (agentId: string) => void;
}

export const MultiAgentSearchPanel: React.FC<MultiAgentSearchPanelProps> = ({
  multiAgentData,
  loading,
  query,
  onRunMultiAgentSearch,
  selectedAgentFilter,
  onSelectAgentFilter,
}) => {
  const [activeTabAgentId, setActiveTabAgentId] = useState<string>("agent-llama");
  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  // Agent Icon & Theme Map
  const getAgentTheme = (agentId: string) => {
    switch (agentId) {
      case "agent-llama":
        return {
          icon: BookOpen,
          badgeBg: "bg-indigo-500/10 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border-indigo-300 dark:border-indigo-800",
          cardBorder: "border-indigo-500/40 hover:border-indigo-500",
          accentColor: "text-indigo-600 dark:text-indigo-400",
          bgGradient: "from-indigo-500/10 via-slate-900/5 to-purple-500/10",
          buttonBg: "bg-indigo-600 hover:bg-indigo-700 text-white"
        };
      case "agent-deepseek":
        return {
          icon: Brain,
          badgeBg: "bg-purple-500/10 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 border-purple-300 dark:border-purple-800",
          cardBorder: "border-purple-500/40 hover:border-purple-500",
          accentColor: "text-purple-600 dark:text-purple-400",
          bgGradient: "from-purple-500/10 via-slate-900/5 to-indigo-500/10",
          buttonBg: "bg-purple-600 hover:bg-purple-700 text-white"
        };
      case "agent-qwen":
        return {
          icon: Code,
          badgeBg: "bg-cyan-500/10 dark:bg-cyan-950/80 text-cyan-700 dark:text-cyan-300 border-cyan-300 dark:border-cyan-800",
          cardBorder: "border-cyan-500/40 hover:border-cyan-500",
          accentColor: "text-cyan-600 dark:text-cyan-400",
          bgGradient: "from-cyan-500/10 via-slate-900/5 to-blue-500/10",
          buttonBg: "bg-cyan-600 hover:bg-cyan-700 text-white"
        };
      case "agent-mistral":
        return {
          icon: Layers,
          badgeBg: "bg-emerald-500/10 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800",
          cardBorder: "border-emerald-500/40 hover:border-emerald-500",
          accentColor: "text-emerald-600 dark:text-emerald-400",
          bgGradient: "from-emerald-500/10 via-slate-900/5 to-teal-500/10",
          buttonBg: "bg-emerald-600 hover:bg-emerald-700 text-white"
        };
      default:
        return {
          icon: Zap,
          badgeBg: "bg-amber-500/10 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-800",
          cardBorder: "border-amber-500/40 hover:border-amber-500",
          accentColor: "text-amber-600 dark:text-amber-400",
          bgGradient: "from-amber-500/10 via-slate-900/5 to-orange-500/10",
          buttonBg: "bg-amber-600 hover:bg-amber-700 text-white"
        };
    }
  };

  const selectedTabAgent = multiAgentData?.agents.find((a) => a.agentId === activeTabAgentId) || multiAgentData?.agents[0];

  return (
    <div className="rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950 border border-indigo-500/30 text-white p-5 sm:p-6 shadow-xl space-y-5 relative overflow-hidden">
      {/* Background Decorative Glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20"></div>

      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 shadow-lg shadow-indigo-500/30 text-white ring-2 ring-indigo-400/20">
            <Bot className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-lg font-black tracking-tight text-white flex items-center gap-2">
                Multi-Agent AI Search Engine
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-widest bg-gradient-to-r from-amber-500 to-indigo-500 text-slate-950 flex items-center gap-1 shadow-sm">
                <Sparkles className="w-3 h-3 text-slate-950" /> 5 Models Active
              </span>
            </div>
            <p className="text-xs text-slate-300 font-medium mt-0.5">
              Simultaneous research analysis across <span className="text-indigo-300 font-bold">Llama 3.3 70B</span>, <span className="text-purple-300 font-bold">DeepSeek R1</span>, <span className="text-cyan-300 font-bold">Qwen 2.5</span>, <span className="text-emerald-300 font-bold">Mistral 24B</span> & <span className="text-amber-300 font-bold">Gemini Flash</span>.
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          <button
            onClick={onRunMultiAgentSearch}
            disabled={loading}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600 hover:from-indigo-600 hover:to-purple-700 text-white text-xs font-black shadow-lg shadow-indigo-500/25 transition-all flex items-center gap-2 border border-indigo-400/30 active:scale-95 disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span>Running 5 Agents...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Launch Multi-Agent Search</span>
              </>
            )}
          </button>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-300 text-xs font-semibold transition-colors flex items-center gap-1"
            title={isExpanded ? "Collapse Multi-Agent Hub" : "Expand Multi-Agent Hub"}
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="space-y-5 relative z-10 pt-2 border-t border-slate-800/80">
          {/* Active 5-Agent Model Status Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
            {[
              { id: "agent-llama", name: "Literature Synthesis", model: "Llama 3.3 70B", role: "Macro Literature Mapping", color: "border-indigo-500/50 bg-indigo-950/30 text-indigo-300" },
              { id: "agent-deepseek", name: "Methodology Gaps", model: "DeepSeek R1", role: "Logical Deduction & Gaps", color: "border-purple-500/50 bg-purple-950/30 text-purple-300" },
              { id: "agent-qwen", name: "Technical Depth", model: "Qwen 2.5 32B", role: "Algorithms & Quantitative", color: "border-cyan-500/50 bg-cyan-950/30 text-cyan-300" },
              { id: "agent-mistral", name: "Theoretical Frameworks", model: "Mistral 24B", role: "Paradigms & Hermeneutics", color: "border-emerald-500/50 bg-emerald-950/30 text-emerald-300" },
              { id: "agent-gemini", name: "Discovery & Relevance", model: "Gemini 2.0 Flash", role: "Fast Semantic Discovery", color: "border-amber-500/50 bg-amber-950/30 text-amber-300" }
            ].map((agentConfig) => {
              const liveAgentData = multiAgentData?.agents.find((a) => a.agentId === agentConfig.id);
              const isFilterSelected = selectedAgentFilter === agentConfig.id;

              return (
                <div
                  key={agentConfig.id}
                  onClick={() => {
                    setActiveTabAgentId(agentConfig.id);
                    onSelectAgentFilter(isFilterSelected ? "all" : agentConfig.id);
                  }}
                  className={`p-3 rounded-xl border transition-all cursor-pointer relative group flex flex-col justify-between ${
                    isFilterSelected
                      ? "ring-2 ring-indigo-400 bg-slate-800/90 shadow-md scale-[1.02]"
                      : "bg-slate-900/80 hover:bg-slate-800/80 border-slate-800"
                  } ${agentConfig.color}`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                        {agentConfig.model}
                      </span>
                      {loading ? (
                        <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
                      ) : (
                        <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                      )}
                    </div>
                    <p className="text-xs font-bold text-white leading-tight mb-0.5">
                      {agentConfig.name}
                    </p>
                    <p className="text-[10px] text-slate-400 line-clamp-1">
                      {agentConfig.role}
                    </p>
                  </div>

                  <div className="mt-2 pt-1.5 border-t border-slate-800/60 flex items-center justify-between text-[10px]">
                    <span className="text-indigo-400 font-semibold">
                      {liveAgentData ? `${liveAgentData.confidenceScore}% Confidence` : "Active"}
                    </span>
                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                      isFilterSelected ? "bg-indigo-500 text-white" : "bg-slate-800 text-slate-300 group-hover:bg-indigo-900/60"
                    }`}>
                      {isFilterSelected ? "Filtered" : "Filter Cards"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Consensus Banner & Multi-Agent Filter Bar */}
          {multiAgentData && (
            <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center justify-center shrink-0">
                  <Award className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-white text-sm">
                      {multiAgentData.consensusScore}% Consensus Agreement
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-700 text-slate-300 font-semibold">
                      Query: "{multiAgentData.query}"
                    </span>
                  </div>
                  <p className="text-slate-300 text-xs mt-0.5">
                    {multiAgentData.consensusSummary}
                  </p>
                </div>
              </div>

              {/* Reset Filter Button */}
              {selectedAgentFilter !== "all" && (
                <button
                  onClick={() => onSelectAgentFilter("all")}
                  className="px-3 py-1.5 rounded-lg bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/30 border border-indigo-500/40 text-xs font-semibold whitespace-nowrap self-start sm:self-auto flex items-center gap-1.5"
                >
                  <Filter className="w-3.5 h-3.5" /> Showing Filtered Results (Clear Filter)
                </button>
              )}
            </div>
          )}

          {/* Agent Perspective Inspector Tabs */}
          {multiAgentData && selectedTabAgent && (
            <div className="p-4 sm:p-5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-4">
              {/* Tabs header */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800 no-scrollbar">
                {multiAgentData.agents.map((ag) => {
                  const isActive = ag.agentId === activeTabAgentId;
                  const theme = getAgentTheme(ag.agentId);
                  const IconComp = theme.icon;

                  return (
                    <button
                      key={ag.agentId}
                      onClick={() => setActiveTabAgentId(ag.agentId)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                        isActive
                          ? "bg-slate-800 text-white border border-indigo-500/50 shadow-sm ring-1 ring-indigo-500/30"
                          : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                      }`}
                    >
                      <IconComp className={`w-3.5 h-3.5 ${isActive ? theme.accentColor : "text-slate-500"}`} />
                      <span>{ag.agentName}</span>
                      <span className="text-[10px] opacity-60">({ag.modelName})</span>
                    </button>
                  );
                })}
              </div>

              {/* Active Tab Report */}
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      🤖 {selectedTabAgent.modelName}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">
                      Execution time: {selectedTabAgent.executionTimeMs || 320}ms
                    </span>
                  </div>
                  <span className="text-xs font-bold text-amber-400 flex items-center gap-1">
                    <Target className="w-3.5 h-3.5" />
                    {selectedTabAgent.confidenceScore}% Model Confidence
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-800/50 border border-slate-700/50">
                  <p className="text-xs font-semibold text-slate-200 leading-relaxed">
                    "{selectedTabAgent.perspectiveSummary}"
                  </p>
                </div>

                {/* Key Insights & Suggested Gap */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/40 space-y-1.5">
                    <span className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Key Agent Observations
                    </span>
                    <ul className="space-y-1">
                      {selectedTabAgent.keyInsights.map((insight, idx) => (
                        <li key={idx} className="text-xs text-slate-300 flex items-start gap-1.5">
                          <span className="text-indigo-400 mt-0.5">•</span>
                          <span>{insight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-3 rounded-xl bg-purple-950/20 border border-purple-800/40 space-y-1.5">
                    <span className="text-[11px] font-bold text-purple-300 uppercase tracking-wider flex items-center gap-1">
                      <Brain className="w-3.5 h-3.5 text-purple-400" /> Unresolved Research Gap Identified
                    </span>
                    <p className="text-xs text-purple-200 font-medium leading-relaxed">
                      {selectedTabAgent.suggestedGap}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
