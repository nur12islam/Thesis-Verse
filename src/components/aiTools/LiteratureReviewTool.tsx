import React, { useState } from "react";
import { Thesis } from "../../types/thesis";
import { generateLiteratureReview } from "../../services/api";
import {
  BookOpen,
  Sparkles,
  Loader2,
  Download,
  Copy,
  Check,
  FileText,
  AlertCircle,
  HelpCircle,
  Share2
} from "lucide-react";

interface LiteratureReviewToolProps {
  savedTheses: Thesis[];
  onShowToast: (title: string, message?: string, type?: "success" | "error" | "info") => void;
}

export const LiteratureReviewTool: React.FC<LiteratureReviewToolProps> = ({
  savedTheses,
  onShowToast,
}) => {
  const [topic, setTopic] = useState("Quantum Neural Operators and Non-Linear Wave Dynamics");
  const [userNotes, setUserNotes] = useState("Focus on 2024-2026 empirical validations and computational bottlenecks.");
  const [selectedPaperIds, setSelectedPaperIds] = useState<string[]>(
    savedTheses.map((t) => t.id)
  );
  const [loading, setLoading] = useState(false);
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const [review, setReview] = useState<{
    introduction: string;
    currentResearch: string;
    researchTrends: string;
    agreements: string;
    disagreements: string;
    researchGaps: string;
    futureDirections: string;
    references: string[];
  } | null>(null);

  const togglePaperSelection = (id: string) => {
    if (selectedPaperIds.includes(id)) {
      setSelectedPaperIds(selectedPaperIds.filter((p) => p !== id));
    } else {
      setSelectedPaperIds([...selectedPaperIds, id]);
    }
  };

  const handleGenerate = async () => {
    if (!topic.trim()) {
      onShowToast("Topic Required", "Please enter a literature review research topic.", "info");
      return;
    }

    setLoading(true);
    try {
      const selectedPapers = savedTheses.filter((t) => selectedPaperIds.includes(t.id));
      const res = await generateLiteratureReview({
        topic,
        papers: selectedPapers,
        userNotes,
        modelPreference: "reasoning",
      });
      setReview(res.review);
      onShowToast("Literature Review Generated", "Structured academic synthesis complete.", "success");
    } catch (err: any) {
      onShowToast("Generation Error", err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleCopySection = (title: string, text: string) => {
    navigator.clipboard.writeText(`${title.toUpperCase()}\n\n${text}`);
    setCopiedSection(title);
    onShowToast("Copied to Clipboard", `Copied section "${title}"`, "success");
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const handleExportFull = (format: "markdown" | "html" | "txt") => {
    if (!review) return;

    let content = "";
    if (format === "markdown") {
      content = `# LITERATURE REVIEW: ${topic.toUpperCase()}

> **AI Transparency Notice:** This literature synthesis was generated using verified academic metadata grounded in peer-reviewed dissertations.

## 1. INTRODUCTION
${review.introduction}

## 2. CURRENT STATE OF RESEARCH
${review.currentResearch}

## 3. EMERGING RESEARCH TRENDS
${review.researchTrends}

## 4. AREAS OF ACADEMIC CONSENSUS
${review.agreements}

## 5. CONTROVERSIES & DISAGREEMENTS
${review.disagreements}

## 6. IDENTIFIED LITERATURE GAPS
${review.researchGaps}

## 7. FUTURE RESEARCH DIRECTIONS
${review.futureDirections}

## 8. GROUNDED REFERENCES
${review.references.map((r) => `- ${r}`).join("\n")}
`;
    } else {
      content = `LITERATURE REVIEW: ${topic.toUpperCase()}\n\n1. INTRODUCTION\n${review.introduction}\n\n2. CURRENT RESEARCH\n${review.currentResearch}\n\n3. TRENDS\n${review.researchTrends}\n\n4. AGREEMENTS\n${review.agreements}\n\n5. DISAGREEMENTS\n${review.disagreements}\n\n6. GAPS\n${review.researchGaps}\n\n7. FUTURE DIRECTIONS\n${review.futureDirections}\n\n8. REFERENCES\n${review.references.join("\n")}`;
    }

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `literature_review_${topic.toLowerCase().replace(/[^a-z0-0]/g, "_")}.${format === "markdown" ? "md" : "txt"}`;
    a.click();
    URL.revokeObjectURL(url);
    onShowToast("File Downloaded", `Exported as .${format === "markdown" ? "md" : "txt"}`, "success");
  };

  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-900 text-white shadow-md border border-indigo-500/20">
        <div className="flex items-center gap-2 text-indigo-300 text-xs font-bold uppercase tracking-wider mb-2">
          <BookOpen className="w-4 h-4 text-amber-300" /> Grounded AI Synthesis
        </div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-white">
          Structured Literature Review Generator
        </h2>
        <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
          Synthesize multi-paper evidence into a formal 8-part academic literature review. Grounded in your saved library dissertations with explicit AI-generated flags.
        </p>
      </div>

      {/* Generator Input Form */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
            Research Subject / Literature Topic
          </label>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g. Quantum Neural Operators, Optogenetic Neural Interfaces..."
            className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
            Additional Directives or Specific Focus Notes (Optional)
          </label>
          <textarea
            rows={2}
            value={userNotes}
            onChange={(e) => setUserNotes(e.target.value)}
            placeholder="e.g. Highlight empirical sample sizes and computational bottlenecks in 2025 papers..."
            className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Paper Selector Checkboxes */}
        {savedTheses.length > 0 && (
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
              Include Saved Library Dissertations as Grounding Context ({selectedPaperIds.length}/{savedTheses.length})
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-40 overflow-y-auto p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs">
              {savedTheses.map((t) => (
                <label
                  key={t.id}
                  className="flex items-center gap-2 cursor-pointer p-1.5 rounded-lg hover:bg-slate-200/50 dark:hover:bg-slate-900 transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={selectedPaperIds.includes(t.id)}
                    onChange={() => togglePaperSelection(t.id)}
                    className="rounded text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                    {t.title} ({t.year})
                  </span>
                </label>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={handleGenerate}
          disabled={loading}
          className="w-full sm:w-auto px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Synthesizing Literature Review with Gemini...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-amber-300" /> Generate Literature Review
            </>
          )}
        </button>
      </div>

      {/* Review Output Sections */}
      {review && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Header Bar */}
          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 font-medium">
              <AlertCircle className="w-4 h-4 shrink-0 text-amber-500" />
              <span>
                <strong className="font-bold">AI Transparency Flag:</strong> All sections below are AI-synthesized summaries grounded in verified academic metadata.
              </span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => handleExportFull("markdown")}
                className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1 shadow-sm"
              >
                <Download className="w-3.5 h-3.5" /> Export Markdown (.md)
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {[
              { title: "Introduction & Scope", key: "introduction", text: review.introduction, color: "border-indigo-500" },
              { title: "Current State of Research", key: "currentResearch", text: review.currentResearch, color: "border-blue-500" },
              { title: "Research Trends & Paradigms", key: "researchTrends", text: review.researchTrends, color: "border-violet-500" },
              { title: "Academic Consensus & Agreements", key: "agreements", text: review.agreements, color: "border-emerald-500" },
              { title: "Controversies & Disagreements", key: "disagreements", text: review.disagreements, color: "border-rose-500" },
              { title: "Unaddressed Research Gaps", key: "researchGaps", text: review.researchGaps, color: "border-amber-500" },
              { title: "Future Doctoral Directions", key: "futureDirections", text: review.futureDirections, color: "border-cyan-500" },
            ].map((section) => (
              <div
                key={section.key}
                className={`p-6 rounded-2xl bg-white dark:bg-slate-900 border-l-4 ${section.color} border-slate-200 dark:border-slate-800 shadow-sm space-y-3 relative group`}
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-indigo-500" />
                    {section.title}
                  </h3>
                  <button
                    onClick={() => handleCopySection(section.title, section.text)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1 text-[11px]"
                  >
                    {copiedSection === section.title ? (
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                    {copiedSection === section.title ? "Copied" : "Copy"}
                  </button>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                  {section.text}
                </p>
                <div className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-100 dark:bg-slate-800/80 px-2.5 py-1 rounded-full">
                  🤖 AI Synthesis Badge
                </div>
              </div>
            ))}

            {/* References Section */}
            <div className="p-6 rounded-2xl bg-slate-900 text-white border border-slate-800 shadow-md space-y-3">
              <h3 className="font-extrabold text-sm sm:text-base text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-indigo-400" /> Grounded References & Citations
              </h3>
              <p className="text-[11px] text-slate-400">
                Verified citations corresponding to the underlying research database records:
              </p>
              <ul className="space-y-2 text-xs font-mono text-slate-300">
                {review.references.map((ref, idx) => (
                  <li key={idx} className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 leading-relaxed">
                    [{idx + 1}] {ref}
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
