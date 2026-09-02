import React, { useState } from "react";
import { Thesis } from "../types/thesis";
import { AdvancedDashboardWidget } from "../components/aiTools/AdvancedDashboardWidget";
import { LiteratureReviewTool } from "../components/aiTools/LiteratureReviewTool";
import { ResearchAdvisorTool } from "../components/aiTools/ResearchAdvisorTool";
import { CitationManagerTool } from "../components/aiTools/CitationManagerTool";
import { TimelineAndTrendsTool } from "../components/aiTools/TimelineAndTrendsTool";
import { DocumentAndWritingTool } from "../components/aiTools/DocumentAndWritingTool";
import { DuplicateDetectionTool } from "../components/aiTools/DuplicateDetectionTool";
import { CollaborationAndExportTool } from "../components/aiTools/CollaborationAndExportTool";
import { ResearchRabbitPage } from "./ResearchRabbitPage";
import { AiChatPage } from "./AiChatPage";
import { ComparePage } from "./ComparePage";
import {
  LayoutDashboard,
  MessageSquare,
  BookOpen,
  BarChart3,
  Compass,
  Quote,
  TrendingUp,
  PenTool,
  ShieldAlert,
  Users,
  Sparkles
} from "lucide-react";

interface AiResearchToolsPageProps {
  savedTheses: Thesis[];
  comparedTheses: Thesis[];
  onRemoveCompare: (thesis: Thesis) => void;
  onClearCompare: () => void;
  onSelectDetails: (thesis: Thesis) => void;
  onShowToast: (title: string, message?: string, type?: "success" | "error" | "info") => void;
  initialTab?: string;
}

export const AiResearchToolsPage: React.FC<AiResearchToolsPageProps> = ({
  savedTheses,
  comparedTheses,
  onRemoveCompare,
  onClearCompare,
  onSelectDetails,
  onShowToast,
  initialTab = "dashboard"
}) => {
  const [activeTab, setActiveTab] = useState<string>(initialTab);

  const TABS = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "rabbit", label: "Literature Graph (Rabbit)", icon: Compass },
    { id: "chat", label: "Research Chat", icon: MessageSquare },
    { id: "lit-review", label: "Literature Review", icon: BookOpen },
    { id: "compare", label: "Paper Comparison", icon: BarChart3 },
    { id: "advisor", label: "Research Advisor", icon: Compass },
    { id: "citation", label: "Citation & Network", icon: Quote },
    { id: "timeline", label: "Timeline & Trends", icon: TrendingUp },
    { id: "writing", label: "Doc & Writing", icon: PenTool },
    { id: "duplicate", label: "Originality Check", icon: ShieldAlert },
    { id: "export", label: "Team & Export", icon: Users },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Top Banner Navigation Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4 text-amber-400" /> Phase 7 Complete Suite
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Advanced AI Research Tools
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            End-to-end doctoral research ecosystem grounded in verified literature metadata.
          </p>
        </div>

        {/* Tab Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none max-w-full">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shrink-0 transition-all ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-md"
                    : "bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Tab Component Render */}
      <div className="animate-in fade-in duration-200">
        {activeTab === "dashboard" && (
          <AdvancedDashboardWidget
            onNavigateToTool={(toolKey) => setActiveTab(toolKey)}
            onShowToast={onShowToast}
          />
        )}

        {activeTab === "rabbit" && (
          <ResearchRabbitPage
            savedIds={new Set(savedTheses.map((t) => t.id))}
            onToggleSave={() => {}}
            onBuildProposal={() => {}}
            onShowToast={onShowToast}
          />
        )}

        {activeTab === "chat" && (
          <AiChatPage savedTheses={savedTheses} onShowToast={onShowToast} />
        )}

        {activeTab === "lit-review" && (
          <LiteratureReviewTool savedTheses={savedTheses} onShowToast={onShowToast} />
        )}

        {activeTab === "compare" && (
          <ComparePage
            comparedTheses={comparedTheses}
            onRemoveCompare={onRemoveCompare}
            onClearCompare={onClearCompare}
            onSelectDetails={onSelectDetails}
            onShowToast={onShowToast}
          />
        )}

        {activeTab === "advisor" && (
          <ResearchAdvisorTool onShowToast={onShowToast} />
        )}

        {activeTab === "citation" && (
          <CitationManagerTool savedTheses={savedTheses} onShowToast={onShowToast} />
        )}

        {activeTab === "timeline" && (
          <TimelineAndTrendsTool onShowToast={onShowToast} />
        )}

        {activeTab === "writing" && (
          <DocumentAndWritingTool onShowToast={onShowToast} />
        )}

        {activeTab === "duplicate" && (
          <DuplicateDetectionTool onShowToast={onShowToast} />
        )}

        {activeTab === "export" && (
          <CollaborationAndExportTool onShowToast={onShowToast} />
        )}
      </div>
    </div>
  );
};
