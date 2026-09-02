import React, { useState, useEffect } from "react";
import { Thesis, DegreeLevel, AcademicSubject, FullProposal, ProposalResult } from "../types/thesis";
import { generateProposal } from "../services/api";
import { ProposalSectionNavigator } from "../components/proposal/ProposalSectionNavigator";
import { ProposalFormEditor } from "../components/proposal/ProposalFormEditor";
import { ProposalQualityChecker } from "../components/proposal/ProposalQualityChecker";
import { ProposalFeasibilityCard } from "../components/proposal/ProposalFeasibilityCard";
import { AiResearchCoach } from "../components/proposal/AiResearchCoach";
import { ProposalSupportingLiterature } from "../components/proposal/ProposalSupportingLiterature";
import { ProposalTimelineEditor } from "../components/proposal/ProposalTimelineEditor";
import { ProposalExportModal } from "../components/proposal/ProposalExportModal";
import {
  FileText,
  Sparkles,
  Loader2,
  Calendar,
  BookOpen,
  Award,
  Bot,
  Download,
  Save,
  CheckCircle2,
  Layers,
  GraduationCap
} from "lucide-react";

interface ProposalBuilderPageProps {
  initialThesis?: Thesis | null;
  onShowToast: (title: string, message?: string, type?: "success" | "error" | "info") => void;
}

export const ProposalBuilderPage: React.FC<ProposalBuilderPageProps> = ({
  initialThesis,
  onShowToast
}) => {
  const [topic, setTopic] = useState("");
  const [degree, setDegree] = useState<DegreeLevel>("Ph.D.");
  const [subject, setSubject] = useState<AcademicSubject>("Artificial Intelligence");
  const [methodologyType, setMethodologyType] = useState<string>("Empirical / Quantitative");
  const [specialFocus, setSpecialFocus] = useState("");

  const [loading, setLoading] = useState(false);
  const [proposal, setProposal] = useState<FullProposal | null>(null);

  const [activeSection, setActiveSection] = useState("title-meta");
  const [centerTab, setCenterTab] = useState<"editor" | "timeline" | "literature">("editor");
  const [rightTab, setRightTab] = useState<"coach" | "quality" | "feasibility">("coach");
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // Sync initial thesis if passed from Rare Discovery or Search
  useEffect(() => {
    if (initialThesis) {
      setTopic(initialThesis.title);
      if (initialThesis.degree) setDegree(initialThesis.degree);
      if (initialThesis.subject) setSubject(initialThesis.subject);
      if (initialThesis.researchGap) setSpecialFocus(`Focus on addressing: ${initialThesis.researchGap}`);
    }
  }, [initialThesis]);

  const handleGenerateProposal = async () => {
    if (!topic.trim()) {
      onShowToast("Missing Topic", "Please enter a research topic or title.", "error");
      return;
    }

    setLoading(true);
    try {
      const res = await generateProposal({
        topic,
        degree,
        subject,
        methodologyType,
        specialFocus
      });

      if (res.fullProposal) {
        setProposal(res.fullProposal);
      } else if (res.proposal) {
        // Adapt legacy proposal to full proposal
        const adapted: FullProposal = {
          id: `prop-${Date.now()}`,
          title: res.proposal.title,
          originalTopic: topic,
          degree,
          subject,
          templateType: degree === "Master's" ? "Master's" : "Ph.D.",
          background: {
            context: res.proposal.executiveSummary,
            importance: "Grounded in contemporary scientific demands.",
            existingWork: "Synthesized from literature review.",
            motivation: "Addressing critical operational gaps."
          },
          problemStatement: {
            whatProblemExists: res.proposal.problemStatement,
            whyItMatters: "Directly impacts empirical reliability.",
            whatIsMissing: res.proposal.researchGap
          },
          objectives: {
            primaryObjective: res.proposal.objectives[0] || "Validate theoretical framework",
            secondaryObjectives: res.proposal.objectives.slice(1),
            expectedOutcomes: ["Empirical benchmark dataset", "Publication-ready manuscript"]
          },
          questions: {
            mainQuestion: res.proposal.researchQuestions[0] || "How does the proposed framework perform?",
            subQuestions: res.proposal.researchQuestions.slice(1),
            hypothesis: "Statistically significant improvement over baseline models."
          },
          scope: {
            includedTopics: [topic, subject],
            excludedTopics: ["Out of scope extremes"],
            limitations: ["Data sampling window constraints"],
            assumptions: ["Stationary operational conditions"]
          },
          methodology: {
            methodType: methodologyType,
            description: res.proposal.methodologicalFramework,
            justification: "Selected for empirical rigor and hypothesis testing."
          },
          chapterOutline: res.proposal.chapterOutline,
          expectedContribution: {
            academicContribution: res.proposal.expectedSignificance,
            practicalContribution: "Practical deployment benchmarks.",
            futureOpportunities: "Enables autonomous extensions."
          },
          keywords: {
            primary: [topic, subject],
            secondary: ["Empirical Methods"],
            researchTags: ["PhD Proposal"]
          },
          supportingLiterature: [],
          qualityScore: {
            overallScore: 88,
            breakdown: {
              titleQuality: 90,
              novelty: 85,
              clarity: 88,
              researchScope: 86,
              methodologyFit: 89,
              objectivesClarity: 87,
              writingQuality: 88
            },
            improvementSuggestions: ["Consider specifying sample sizes in methodology."]
          },
          feasibilityAnalysis: {
            difficulty: "Moderate",
            estimatedTimeMonths: 18,
            dataAvailability: "High",
            researchComplexity: "Medium",
            recommendedDegree: degree
          },
          timeline: [
            { id: "t1", phase: "Literature & Gap Definition", durationWeeks: 4, tasks: ["Search literature"], completed: true },
            { id: "t2", phase: "Proposal Approval", durationWeeks: 4, tasks: ["Finalize methodology"], completed: false },
            { id: "t3", phase: "Experiments & Data", durationWeeks: 8, tasks: ["Collect telemetry"], completed: false }
          ],
          versionHistory: [
            {
              versionId: "v1.0",
              timestamp: new Date().toISOString(),
              title: "Initial Draft",
              summaryOfChanges: "Automated synthesis",
              snapshotData: null
            }
          ],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        setProposal(adapted);
      }

      onShowToast("Proposal Generated", "Complete research proposal generated successfully!", "success");
    } catch (err: any) {
      onShowToast("Generation Failed", err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveVersionSnapshot = () => {
    if (!proposal) return;
    const nextVer = (proposal.versionHistory?.length || 0) + 1;
    const newHistory = [
      ...(proposal.versionHistory || []),
      {
        versionId: `v${nextVer}.0`,
        timestamp: new Date().toISOString(),
        title: `Version ${nextVer}.0 Snapshot`,
        summaryOfChanges: "User saved checkpoint",
        snapshotData: JSON.parse(JSON.stringify(proposal))
      }
    ];
    setProposal({ ...proposal, versionHistory: newHistory });
    onShowToast("Version Saved", `Saved Snapshot Version ${nextVer}.0`, "success");
  };

  const handleUpdateTemplate = (template: "Bachelor's" | "Master's" | "MPhil" | "Ph.D.") => {
    if (!proposal) return;
    setProposal({ ...proposal, templateType: template, degree: template as any });
    onShowToast("Template Updated", `Adjusted proposal depth for ${template} level.`, "info");
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <FileText className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
          AI Research Assistant & Proposal Builder
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Transform research ideas into publication-grade graduate dissertation proposals with problem statements, methodology, timelines, and verified literature citations.
        </p>
      </div>

      {/* Generator Control Card */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
            Research Topic or Thesis Focus <span className="text-rose-500">*</span>
          </label>
          <textarea
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            rows={2}
            placeholder="e.g., Closed-loop synaptic plasticity regeneration via optogenetic neural implants in cognitive AI..."
            className="w-full p-3.5 text-sm rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 font-medium"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="block font-bold text-slate-500 uppercase mb-1">Target Degree</label>
            <select
              value={degree}
              onChange={(e) => setDegree(e.target.value as any)}
              className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 font-semibold"
            >
              <option value="Ph.D.">Ph.D. Dissertation Proposal</option>
              <option value="Master's">Master's Thesis Proposal</option>
              <option value="MPhil">MPhil Research Proposal</option>
              <option value="Bachelor's">Undergraduate Honors Thesis</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-500 uppercase mb-1">Subject Area</label>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value as any)}
              className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 font-semibold"
            >
              <option value="Artificial Intelligence">Artificial Intelligence</option>
              <option value="Quantum Computing">Quantum Computing</option>
              <option value="Bio-Engineering & Genomics">Bio-Engineering & Genomics</option>
              <option value="Climate & Sustainability">Climate & Sustainability</option>
              <option value="Applied Economics & Finance">Applied Economics & Finance</option>
              <option value="Neuroscience & Cognitive AI">Neuroscience & Cognitive AI</option>
              <option value="Cybersecurity & Cryptography">Cybersecurity & Cryptography</option>
              <option value="Computer Science">Computer Science</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-500 uppercase mb-1">Methodology Preference</label>
            <select
              value={methodologyType}
              onChange={(e) => setMethodologyType(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 font-semibold"
            >
              <option value="Empirical / Quantitative">Empirical / Quantitative</option>
              <option value="Qualitative / Case Study">Qualitative / Case Study</option>
              <option value="Mixed Methods">Mixed Methods</option>
              <option value="Experimental / Benchmarking">Experimental / Benchmarking</option>
              <option value="Theoretical / Mathematical">Theoretical / Mathematical</option>
            </select>
          </div>
        </div>

        <button
          onClick={handleGenerateProposal}
          disabled={loading}
          className="w-full py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20 transition-all disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Synthesizing Proposal & Literature...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5 text-amber-300" />
              Generate Formal Research Proposal
            </>
          )}
        </button>
      </div>

      {/* Main 3-Panel Workspace */}
      {proposal && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Panel: Navigator */}
          <div className="lg:col-span-3 sticky top-6">
            <ProposalSectionNavigator
              proposal={proposal}
              activeSection={activeSection}
              onSelectSection={(secId) => {
                setActiveSection(secId);
                setCenterTab("editor");
                document.getElementById(secId)?.scrollIntoView({ behavior: "smooth" });
              }}
              onUpdateTemplate={handleUpdateTemplate}
              onOpenExport={() => setIsExportModalOpen(true)}
              onSaveVersionSnapshot={handleSaveVersionSnapshot}
            />
          </div>

          {/* Center Panel: Workspace Editor */}
          <div className="lg:col-span-6 space-y-6">
            {/* Center View Tabs */}
            <div className="flex bg-slate-100 dark:bg-slate-900 p-1 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs font-bold">
              <button
                onClick={() => setCenterTab("editor")}
                className={`flex-1 py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                  centerTab === "editor"
                    ? "bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm"
                    : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                }`}
              >
                <FileText className="w-3.5 h-3.5" /> Proposal Editor
              </button>

              <button
                onClick={() => setCenterTab("timeline")}
                className={`flex-1 py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                  centerTab === "timeline"
                    ? "bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm"
                    : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                }`}
              >
                <Calendar className="w-3.5 h-3.5" /> Research Roadmap ({proposal.timeline?.length || 0})
              </button>

              <button
                onClick={() => setCenterTab("literature")}
                className={`flex-1 py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                  centerTab === "literature"
                    ? "bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm"
                    : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" /> Literature ({proposal.supportingLiterature?.length || 0})
              </button>
            </div>

            {centerTab === "editor" && (
              <ProposalFormEditor
                proposal={proposal}
                onChangeProposal={(updated) => setProposal(updated)}
                activeSection={activeSection}
                onShowToast={onShowToast}
              />
            )}

            {centerTab === "timeline" && (
              <ProposalTimelineEditor
                timeline={proposal.timeline || []}
                onChangeTimeline={(updatedTl) => setProposal({ ...proposal, timeline: updatedTl })}
              />
            )}

            {centerTab === "literature" && (
              <ProposalSupportingLiterature
                supportingLiterature={proposal.supportingLiterature || []}
              />
            )}
          </div>

          {/* Right Panel: Coach & Audits */}
          <div className="lg:col-span-3 space-y-6 sticky top-6">
            {/* Right Sub-Tabs */}
            <div className="flex bg-slate-100 dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800 text-[11px] font-bold">
              <button
                onClick={() => setRightTab("coach")}
                className={`flex-1 py-1.5 rounded-lg transition-all flex items-center justify-center gap-1 ${
                  rightTab === "coach"
                    ? "bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm"
                    : "text-slate-500"
                }`}
              >
                <Bot className="w-3 h-3" /> Coach
              </button>

              <button
                onClick={() => setRightTab("quality")}
                className={`flex-1 py-1.5 rounded-lg transition-all flex items-center justify-center gap-1 ${
                  rightTab === "quality"
                    ? "bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm"
                    : "text-slate-500"
                }`}
              >
                <Award className="w-3 h-3" /> Quality
              </button>

              <button
                onClick={() => setRightTab("feasibility")}
                className={`flex-1 py-1.5 rounded-lg transition-all flex items-center justify-center gap-1 ${
                  rightTab === "feasibility"
                    ? "bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm"
                    : "text-slate-500"
                }`}
              >
                <Layers className="w-3 h-3" /> Feasibility
              </button>
            </div>

            {rightTab === "coach" && (
              <AiResearchCoach proposal={proposal} onShowToast={onShowToast} />
            )}

            {rightTab === "quality" && proposal.qualityScore && (
              <ProposalQualityChecker qualityScore={proposal.qualityScore} />
            )}

            {rightTab === "feasibility" && proposal.feasibilityAnalysis && (
              <ProposalFeasibilityCard feasibility={proposal.feasibilityAnalysis} />
            )}
          </div>
        </div>
      )}

      {/* Export Modal */}
      {proposal && (
        <ProposalExportModal
          proposal={proposal}
          isOpen={isExportModalOpen}
          onClose={() => setIsExportModalOpen(false)}
          onShowToast={onShowToast}
        />
      )}
    </div>
  );
};
