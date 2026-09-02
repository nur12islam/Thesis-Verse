import React, { useState } from "react";
import { FullProposal } from "../../types/thesis";
import { Download, FileText, Printer, Copy, Check, X, FileCode, BookOpen, Sparkles } from "lucide-react";

interface ProposalExportModalProps {
  proposal: FullProposal;
  isOpen: boolean;
  onClose: () => void;
  onShowToast: (title: string, message?: string, type?: "success" | "error" | "info") => void;
}

export const ProposalExportModal: React.FC<ProposalExportModalProps> = ({
  proposal,
  isOpen,
  onClose,
  onShowToast
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const generateMarkdown = () => {
    return `# ${proposal.title}

**Target Degree:** ${proposal.degree}  
**Subject Area:** ${proposal.subject}  
**Target Institution:** ${proposal.targetUniversity || "Graduate Research Institute"}  
**Template Standard:** ${proposal.templateType}  
**Date Generated:** ${new Date(proposal.createdAt).toLocaleDateString()}  

---

## 1. Background & Scientific Rationale
### 1.1 Context
${proposal.background.context}

### 1.2 Scientific & Societal Importance
${proposal.background.importance}

### 1.3 State of Prior Literature
${proposal.background.existingWork}

### 1.4 Research Motivation
${proposal.background.motivation}

---

## 2. Problem Statement & Literature Gap
### 2.1 The Core Problem
${proposal.problemStatement.whatProblemExists}

### 2.2 Why This Problem Matters
${proposal.problemStatement.whyItMatters}

### 2.3 Literature Gap Targeted
${proposal.problemStatement.whatIsMissing}

---

## 3. Research Objectives & Outcomes
**Primary Objective:**  
${proposal.objectives.primaryObjective}

**Secondary Objectives:**  
${proposal.objectives.secondaryObjectives.map((o) => `- ${o}`).join("\n")}

**Expected Key Outcomes:**  
${proposal.objectives.expectedOutcomes.map((e) => `- ${e}`).join("\n")}

---

## 4. Research Questions & Hypotheses
**Main Research Question:**  
${proposal.questions.mainQuestion}

**Sub-Questions:**  
${proposal.questions.subQuestions.map((q) => `- ${q}`).join("\n")}

**Testable Hypothesis:**  
${proposal.questions.hypothesis || "N/A"}

---

## 5. Scope Boundaries
**Included Topics:** ${proposal.scope.includedTopics.join(", ")}  
**Excluded Topics:** ${proposal.scope.excludedTopics.join(", ")}  
**Methodological Limitations:** ${proposal.scope.limitations.join("; ")}  
**Underlying Assumptions:** ${proposal.scope.assumptions.join("; ")}  

---

## 6. Research Methodology & Design
**Method Type:** ${proposal.methodology.methodType}  
**Design Description:**  
${proposal.methodology.description}

**Methodological Justification:**  
${proposal.methodology.justification}

**Primary Data Sources:** ${(proposal.methodology.dataSources || []).join(", ")}  
**Analytical Tools:** ${(proposal.methodology.analyticalTools || []).join(", ")}  

---

## 7. Dissertation Chapter Outline
${proposal.chapterOutline.map((c) => `### Chapter ${c.chapter}: ${c.title}\n${c.description}`).join("\n\n")}

---

## 8. Expected Contributions
**Academic Contribution:**  
${proposal.expectedContribution.academicContribution}

**Practical Contribution:**  
${proposal.expectedContribution.practicalContribution}

**Future Avenues:**  
${proposal.expectedContribution.futureOpportunities}

---

## 9. Keywords
**Primary Keywords:** ${proposal.keywords.primary.join(", ")}  
**Secondary Keywords:** ${proposal.keywords.secondary.join(", ")}  

---

## 10. Verified Literature References
${proposal.supportingLiterature.map((s) => `- ${s.authors.join(", ")} (${s.year}). *${s.title}*. ${s.university}. DOI: ${s.doi || "N/A"}`).join("\n")}

---
*Generated via ThesisVerse AI Research Proposal Engine*
`;
  };

  const handleCopyMarkdown = () => {
    const md = generateMarkdown();
    navigator.clipboard.writeText(md);
    setCopied(true);
    onShowToast("Copied to Clipboard", "Formatted in clean Markdown", "success");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadMarkdown = () => {
    const md = generateMarkdown();
    const blob = new Blob([md], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${proposal.title.replace(/[^a-z0-9]/gi, "_").toLowerCase()}_proposal.md`;
    link.click();
    URL.revokeObjectURL(url);
    onShowToast("Markdown Downloaded", "File saved to your downloads folder.", "success");
  };

  const handleDownloadWordDoc = () => {
    const htmlContent = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <title>${proposal.title}</title>
        <style>
          body { font-family: 'Calibri', 'Arial', sans-serif; line-height: 1.6; padding: 40px; color: #111; }
          h1 { color: #1e3a8a; font-size: 24pt; border-bottom: 2px solid #1e3a8a; padding-bottom: 10px; }
          h2 { color: #1e40af; font-size: 16pt; margin-top: 20px; }
          h3 { color: #3b82f6; font-size: 13pt; }
          p { font-size: 11pt; margin-bottom: 10px; }
          ul { margin-bottom: 15px; }
          .metadata { background-color: #f1f5f9; padding: 15px; border-radius: 5px; margin-bottom: 25px; }
        </style>
      </head>
      <body>
        <h1>${proposal.title}</h1>
        <div class="metadata">
          <p><strong>Degree Level:</strong> ${proposal.degree}</p>
          <p><strong>Subject Area:</strong> ${proposal.subject}</p>
          <p><strong>Target Institution:</strong> ${proposal.targetUniversity || "Graduate Department"}</p>
          <p><strong>Template Standard:</strong> ${proposal.templateType}</p>
        </div>

        <h2>1. Background & Scientific Rationale</h2>
        <p>${proposal.background.context}</p>
        <p>${proposal.background.importance}</p>
        <p>${proposal.background.existingWork}</p>

        <h2>2. Problem Statement & Literature Gap</h2>
        <p><strong>Problem:</strong> ${proposal.problemStatement.whatProblemExists}</p>
        <p><strong>Why it Matters:</strong> ${proposal.problemStatement.whyItMatters}</p>
        <p><strong>Literature Gap:</strong> ${proposal.problemStatement.whatIsMissing}</p>

        <h2>3. Objectives & Outcomes</h2>
        <p><strong>Primary Objective:</strong> ${proposal.objectives.primaryObjective}</p>
        <ul>
          ${proposal.objectives.secondaryObjectives.map((o) => `<li>${o}</li>`).join("")}
        </ul>

        <h2>4. Research Questions</h2>
        <p><strong>Main Question:</strong> ${proposal.questions.mainQuestion}</p>
        <ul>
          ${proposal.questions.subQuestions.map((q) => `<li>${q}</li>`).join("")}
        </ul>

        <h2>5. Methodology</h2>
        <p><strong>Type:</strong> ${proposal.methodology.methodType}</p>
        <p>${proposal.methodology.description}</p>
        <p><strong>Justification:</strong> ${proposal.methodology.justification}</p>

        <h2>6. Chapter Outline</h2>
        ${proposal.chapterOutline.map((c) => `<h3>Chapter ${c.chapter}: ${c.title}</h3><p>${c.description}</p>`).join("")}

        <h2>7. References</h2>
        <ul>
          ${proposal.supportingLiterature.map((s) => `<li>${s.authors.join(", ")} (${s.year}). ${s.title}. ${s.university}. DOI: ${s.doi || "N/A"}</li>`).join("")}
        </ul>
      </body>
      </html>
    `;

    const blob = new Blob(["\ufeff", htmlContent], { type: "application/msword" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${proposal.title.replace(/[^a-z0-9]/gi, "_").toLowerCase()}_proposal.doc`;
    a.click();
    URL.revokeObjectURL(url);
    onShowToast("Word Document Exported", "Saved in native DOC format.", "success");
  };

  const handlePrintPDF = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-xl w-full p-6 shadow-2xl space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                Export Research Proposal
              </h3>
              <p className="text-xs text-slate-500">Choose your preferred academic format</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* PDF Print Option */}
          <button
            onClick={handlePrintPDF}
            className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-indigo-500 dark:hover:border-indigo-500 bg-slate-50 dark:bg-slate-950 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/40 text-left transition-all space-y-2 group"
          >
            <div className="flex items-center justify-between">
              <Printer className="w-5 h-5 text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform" />
              <span className="text-[10px] font-bold text-slate-400 uppercase">PDF</span>
            </div>
            <h4 className="font-bold text-xs text-slate-900 dark:text-white">PDF / Print Preview</h4>
            <p className="text-[11px] text-slate-500">
              Opens standard browser print dialog for PDF saving with academic styling.
            </p>
          </button>

          {/* Microsoft Word Option */}
          <button
            onClick={handleDownloadWordDoc}
            className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 bg-slate-50 dark:bg-slate-950 hover:bg-blue-50/50 dark:hover:bg-blue-950/40 text-left transition-all space-y-2 group"
          >
            <div className="flex items-center justify-between">
              <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform" />
              <span className="text-[10px] font-bold text-slate-400 uppercase">DOCX</span>
            </div>
            <h4 className="font-bold text-xs text-slate-900 dark:text-white">Microsoft Word (.doc)</h4>
            <p className="text-[11px] text-slate-500">
              Formatted document compatible with Microsoft Word and Google Docs.
            </p>
          </button>

          {/* Markdown Download */}
          <button
            onClick={handleDownloadMarkdown}
            className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-emerald-500 dark:hover:border-emerald-500 bg-slate-50 dark:bg-slate-950 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/40 text-left transition-all space-y-2 group"
          >
            <div className="flex items-center justify-between">
              <FileCode className="w-5 h-5 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform" />
              <span className="text-[10px] font-bold text-slate-400 uppercase">MD</span>
            </div>
            <h4 className="font-bold text-xs text-slate-900 dark:text-white">Markdown File (.md)</h4>
            <p className="text-[11px] text-slate-500">
              Raw Markdown suitable for Obsidian, Notion, or LaTeX converters.
            </p>
          </button>

          {/* Copy Markdown */}
          <button
            onClick={handleCopyMarkdown}
            className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-amber-500 dark:hover:border-amber-500 bg-slate-50 dark:bg-slate-950 hover:bg-amber-50/50 dark:hover:bg-amber-950/40 text-left transition-all space-y-2 group"
          >
            <div className="flex items-center justify-between">
              {copied ? (
                <Check className="w-5 h-5 text-emerald-600" />
              ) : (
                <Copy className="w-5 h-5 text-amber-600 dark:text-amber-400 group-hover:scale-110 transition-transform" />
              )}
              <span className="text-[10px] font-bold text-slate-400 uppercase">Clipboard</span>
            </div>
            <h4 className="font-bold text-xs text-slate-900 dark:text-white">Copy Markdown</h4>
            <p className="text-[11px] text-slate-500">
              {copied ? "Copied to clipboard!" : "Copy complete text formatted in clean Markdown."}
            </p>
          </button>
        </div>

        <div className="pt-2 text-center">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-bold text-xs transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
