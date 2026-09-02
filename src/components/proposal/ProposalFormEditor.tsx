import React, { useState } from "react";
import { FullProposal, ProposalChapter } from "../../types/thesis";
import { refineProposalSection } from "../../services/api";
import {
  Sparkles,
  Plus,
  Trash2,
  RefreshCw,
  HelpCircle,
  FileText,
  Layers,
  ChevronDown,
  ChevronUp,
  Loader2,
  ListPlus,
  Target,
  BookOpen
} from "lucide-react";

interface ProposalFormEditorProps {
  proposal: FullProposal;
  onChangeProposal: (updated: FullProposal) => void;
  activeSection: string;
  onShowToast: (title: string, message?: string, type?: "success" | "error" | "info") => void;
}

export const ProposalFormEditor: React.FC<ProposalFormEditorProps> = ({
  proposal,
  onChangeProposal,
  activeSection,
  onShowToast
}) => {
  const [refiningSection, setRefiningSection] = useState<string | null>(null);

  const handleTextChange = (path: string[], value: any) => {
    const updated = { ...proposal };
    let curr: any = updated;
    for (let i = 0; i < path.length - 1; i++) {
      curr = curr[path[i]];
    }
    curr[path[path.length - 1]] = value;
    updated.updatedAt = new Date().toISOString();
    onChangeProposal(updated);
  };

  const handleRefineSection = async (sectionName: string, textToRefine: string, fieldPath: string[]) => {
    if (!textToRefine.trim()) {
      onShowToast("Empty Section", "Please write or generate text before refining.", "error");
      return;
    }

    setRefiningSection(sectionName);
    try {
      const res = await refineProposalSection(sectionName, textToRefine, "Enhance academic clarity, depth, and tone", proposal.title);
      handleTextChange(fieldPath, res.refinedText);
      onShowToast("Section Refined", res.explanation || "Enhanced prose and academic tone.", "success");
    } catch (err: any) {
      onShowToast("Refinement Failed", err.message, "error");
    } finally {
      setRefiningSection(null);
    }
  };

  // List helpers
  const handleAddListItem = (arrayPath: string[], defaultVal = "New item") => {
    const updated = { ...proposal };
    let curr: any = updated;
    for (let i = 0; i < arrayPath.length - 1; i++) {
      curr = curr[arrayPath[i]];
    }
    curr[arrayPath[arrayPath.length - 1]].push(defaultVal);
    onChangeProposal(updated);
  };

  const handleRemoveListItem = (arrayPath: string[], index: number) => {
    const updated = { ...proposal };
    let curr: any = updated;
    for (let i = 0; i < arrayPath.length - 1; i++) {
      curr = curr[arrayPath[i]];
    }
    curr[arrayPath[arrayPath.length - 1]].splice(index, 1);
    onChangeProposal(updated);
  };

  const handleUpdateListItem = (arrayPath: string[], index: number, val: string) => {
    const updated = { ...proposal };
    let curr: any = updated;
    for (let i = 0; i < arrayPath.length - 1; i++) {
      curr = curr[arrayPath[i]];
    }
    curr[arrayPath[arrayPath.length - 1]][index] = val;
    onChangeProposal(updated);
  };

  // Chapter helpers
  const handleAddChapter = () => {
    const nextChapterNum = (proposal.chapterOutline?.length || 0) + 1;
    const newChap: ProposalChapter = {
      chapter: nextChapterNum,
      title: `Chapter ${nextChapterNum}: Title`,
      description: "Description of chapter scope and deliverables."
    };
    onChangeProposal({
      ...proposal,
      chapterOutline: [...(proposal.chapterOutline || []), newChap]
    });
  };

  const handleRemoveChapter = (index: number) => {
    const next = [...(proposal.chapterOutline || [])];
    next.splice(index, 1);
    // re-number
    const renumbered = next.map((c, i) => ({ ...c, chapter: i + 1 }));
    onChangeProposal({ ...proposal, chapterOutline: renumbered });
  };

  return (
    <div className="space-y-8 pb-10">
      {/* Title & Metadata Block */}
      <section id="title-meta" className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Academic Proposal Title
          </label>
          <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950 px-2.5 py-1 rounded-full border border-indigo-200 dark:border-indigo-800">
            {proposal.degree} Level
          </span>
        </div>

        <textarea
          rows={2}
          value={proposal.title}
          onChange={(e) => handleTextChange(["title"], e.target.value)}
          placeholder="e.g., Evaluating Closed-Loop Synaptic Plasticity in Neural Implants..."
          className="w-full text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
        />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-2">
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Target Degree</label>
            <input
              type="text"
              value={proposal.degree}
              onChange={(e) => handleTextChange(["degree"], e.target.value)}
              className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 font-semibold"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Subject Discipline</label>
            <input
              type="text"
              value={proposal.subject}
              onChange={(e) => handleTextChange(["subject"], e.target.value)}
              className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 font-semibold"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Target Institution</label>
            <input
              type="text"
              value={proposal.targetUniversity || ""}
              onChange={(e) => handleTextChange(["targetUniversity"], e.target.value)}
              placeholder="University Department"
              className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 font-semibold"
            />
          </div>
        </div>
      </section>

      {/* 1. Background & Rationale */}
      <section id="background" className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <h3 className="font-extrabold text-slate-900 dark:text-white text-base flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 text-xs font-bold flex items-center justify-center">1</span>
            Background & Scientific Rationale
          </h3>
          <button
            onClick={() => handleRefineSection("Background", proposal.background.context, ["background", "context"])}
            disabled={refiningSection === "Background"}
            className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
          >
            {refiningSection === "Background" ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5 text-amber-500" />}
            AI Refine Section
          </button>
        </div>

        <div className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">1.1 Research Context & Landscape</label>
            <textarea
              rows={3}
              value={proposal.background.context}
              onChange={(e) => handleTextChange(["background", "context"], e.target.value)}
              className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">1.2 Scientific & Societal Importance</label>
            <textarea
              rows={2}
              value={proposal.background.importance}
              onChange={(e) => handleTextChange(["background", "importance"], e.target.value)}
              className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">1.3 State of Prior Literature</label>
            <textarea
              rows={2}
              value={proposal.background.existingWork}
              onChange={(e) => handleTextChange(["background", "existingWork"], e.target.value)}
              className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
            />
          </div>
        </div>
      </section>

      {/* 2. Problem Statement & Literature Gap */}
      <section id="problem" className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <h3 className="font-extrabold text-slate-900 dark:text-white text-base flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 text-xs font-bold flex items-center justify-center">2</span>
            Problem Statement & Targeted Literature Gap
          </h3>
          <button
            onClick={() => handleRefineSection("Problem Statement", proposal.problemStatement.whatProblemExists, ["problemStatement", "whatProblemExists"])}
            disabled={refiningSection === "Problem Statement"}
            className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
          >
            {refiningSection === "Problem Statement" ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5 text-amber-500" />}
            AI Refine Section
          </button>
        </div>

        <div className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">2.1 What Core Scientific Problem Exists?</label>
            <textarea
              rows={3}
              value={proposal.problemStatement.whatProblemExists}
              onChange={(e) => handleTextChange(["problemStatement", "whatProblemExists"], e.target.value)}
              className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">2.2 Why Does This Problem Matter?</label>
            <textarea
              rows={2}
              value={proposal.problemStatement.whyItMatters}
              onChange={(e) => handleTextChange(["problemStatement", "whyItMatters"], e.target.value)}
              className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">2.3 Exact Literature Gap Targeted</label>
            <textarea
              rows={2}
              value={proposal.problemStatement.whatIsMissing}
              onChange={(e) => handleTextChange(["problemStatement", "whatIsMissing"], e.target.value)}
              className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
            />
          </div>
        </div>
      </section>

      {/* 3. Research Objectives & Key Outcomes */}
      <section id="objectives" className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <h3 className="font-extrabold text-slate-900 dark:text-white text-base flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 text-xs font-bold flex items-center justify-center">3</span>
            Research Objectives & Expected Outcomes
          </h3>
        </div>

        <div className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Primary Objective</label>
            <input
              type="text"
              value={proposal.objectives.primaryObjective}
              onChange={(e) => handleTextChange(["objectives", "primaryObjective"], e.target.value)}
              className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 font-semibold focus:outline-none"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="font-bold text-slate-700 dark:text-slate-300">Secondary Specific Objectives</label>
              <button
                onClick={() => handleAddListItem(["objectives", "secondaryObjectives"], "Secondary research objective")}
                className="text-[11px] font-semibold text-indigo-600 hover:underline flex items-center gap-1"
              >
                + Add Objective
              </button>
            </div>
            <div className="space-y-2">
              {proposal.objectives.secondaryObjectives.map((obj, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={obj}
                    onChange={(e) => handleUpdateListItem(["objectives", "secondaryObjectives"], i, e.target.value)}
                    className="flex-1 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none"
                  />
                  <button
                    onClick={() => handleRemoveListItem(["objectives", "secondaryObjectives"], i)}
                    className="p-1.5 text-slate-400 hover:text-rose-500"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 4. Research Questions & Hypotheses */}
      <section id="questions" className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <h3 className="font-extrabold text-slate-900 dark:text-white text-base flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 text-xs font-bold flex items-center justify-center">4</span>
            Research Questions & Testable Hypotheses
          </h3>
        </div>

        <div className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Overarching Main Research Question</label>
            <input
              type="text"
              value={proposal.questions.mainQuestion}
              onChange={(e) => handleTextChange(["questions", "mainQuestion"], e.target.value)}
              className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 font-semibold focus:outline-none"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="font-bold text-slate-700 dark:text-slate-300">Sub-Questions</label>
              <button
                onClick={() => handleAddListItem(["questions", "subQuestions"], "Specific sub-question?")}
                className="text-[11px] font-semibold text-indigo-600 hover:underline flex items-center gap-1"
              >
                + Add Sub-Question
              </button>
            </div>
            <div className="space-y-2">
              {proposal.questions.subQuestions.map((q, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={q}
                    onChange={(e) => handleUpdateListItem(["questions", "subQuestions"], i, e.target.value)}
                    className="flex-1 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none"
                  />
                  <button
                    onClick={() => handleRemoveListItem(["questions", "subQuestions"], i)}
                    className="p-1.5 text-slate-400 hover:text-rose-500"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Testable Research Hypothesis</label>
            <textarea
              rows={2}
              value={proposal.questions.hypothesis || ""}
              onChange={(e) => handleTextChange(["questions", "hypothesis"], e.target.value)}
              className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none"
            />
          </div>
        </div>
      </section>

      {/* 6. Research Methodology */}
      <section id="methodology" className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <h3 className="font-extrabold text-slate-900 dark:text-white text-base flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 text-xs font-bold flex items-center justify-center">6</span>
            Research Methodology & Design
          </h3>
          <button
            onClick={() => handleRefineSection("Methodology", proposal.methodology.description, ["methodology", "description"])}
            disabled={refiningSection === "Methodology"}
            className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
          >
            {refiningSection === "Methodology" ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5 text-amber-500" />}
            AI Refine Section
          </button>
        </div>

        <div className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Method Paradigm</label>
            <select
              value={proposal.methodology.methodType}
              onChange={(e) => handleTextChange(["methodology", "methodType"], e.target.value)}
              className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 font-bold"
            >
              <option value="Quantitative">Empirical / Quantitative</option>
              <option value="Qualitative">Qualitative / Case Study</option>
              <option value="Mixed Methods">Mixed Methods</option>
              <option value="Experimental">Experimental / Benchmarking</option>
              <option value="Comparative Analysis">Comparative Analysis</option>
              <option value="Theoretical / Mathematical">Theoretical / Mathematical</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Detailed Research Design & Procedures</label>
            <textarea
              rows={4}
              value={proposal.methodology.description}
              onChange={(e) => handleTextChange(["methodology", "description"], e.target.value)}
              className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Methodological Justification</label>
            <textarea
              rows={2}
              value={proposal.methodology.justification}
              onChange={(e) => handleTextChange(["methodology", "justification"], e.target.value)}
              className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none"
            />
          </div>
        </div>
      </section>

      {/* 7. Chapter Outline */}
      <section id="chapters" className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <h3 className="font-extrabold text-slate-900 dark:text-white text-base flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 text-xs font-bold flex items-center justify-center">7</span>
            Dissertation Chapter Outline
          </h3>
          <button
            onClick={handleAddChapter}
            className="text-xs font-semibold text-indigo-600 hover:underline flex items-center gap-1"
          >
            + Add Chapter
          </button>
        </div>

        <div className="space-y-3">
          {(proposal.chapterOutline || []).map((chap, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400">
                  Chapter {chap.chapter}
                </span>
                <button
                  onClick={() => handleRemoveChapter(idx)}
                  className="p-1 text-slate-400 hover:text-rose-500 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <input
                type="text"
                value={chap.title}
                onChange={(e) => {
                  const updatedChapters = [...proposal.chapterOutline];
                  updatedChapters[idx].title = e.target.value;
                  onChangeProposal({ ...proposal, chapterOutline: updatedChapters });
                }}
                className="w-full font-bold p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 text-slate-900 dark:text-slate-100"
              />

              <textarea
                rows={2}
                value={chap.description}
                onChange={(e) => {
                  const updatedChapters = [...proposal.chapterOutline];
                  updatedChapters[idx].description = e.target.value;
                  onChangeProposal({ ...proposal, chapterOutline: updatedChapters });
                }}
                className="w-full p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 text-slate-700 dark:text-slate-300"
              />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
