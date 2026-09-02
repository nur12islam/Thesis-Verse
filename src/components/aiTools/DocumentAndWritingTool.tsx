import React, { useState } from "react";
import { analyzeUploadedDocument, processAcademicWriting } from "../../services/api";
import {
  FileText,
  Upload,
  Sparkles,
  Loader2,
  CheckCircle2,
  PenTool,
  HelpCircle,
  AlertCircle,
  Copy,
  Check,
  Zap,
  RotateCcw
} from "lucide-react";

interface DocumentAndWritingToolProps {
  onShowToast: (title: string, message?: string, type?: "success" | "error" | "info") => void;
}

export const DocumentAndWritingTool: React.FC<DocumentAndWritingToolProps> = ({ onShowToast }) => {
  const [mode, setMode] = useState<"doc" | "writing">("doc");

  // Document Assistant State
  const [filename, setFilename] = useState("Research_Draft_Chapter1.docx");
  const [docContent, setDocContent] = useState(
    "This dissertation investigates the application of quantum neural operators to solve non-linear differential equations in continuous function space. Initial findings show a 350x reduction in computational complexity compared to traditional finite element solvers, though dataset scaling remains a challenge."
  );
  const [docAction, setDocAction] = useState<
    "summarize" | "explain" | "keywords" | "improvements" | "missing_sections" | "questions"
  >("summarize");
  const [loadingDoc, setLoadingDoc] = useState(false);
  const [docAnalysis, setDocAnalysis] = useState<{
    result: string;
    keywords?: string[];
    questions?: string[];
    missingSections?: string[];
  } | null>(null);

  // Writing Assistant State
  const [draftText, setDraftText] = useState(
    "Basically, our research shows that quantum neural operators work really well and solve differential equations super fast, but we need more tests on bigger datasets."
  );
  const [writingAction, setWritingAction] = useState<
    "grammar" | "tone" | "rewrite" | "shorten" | "expand"
  >("tone");
  const [loadingWriting, setLoadingWriting] = useState(false);
  const [writingResult, setWritingResult] = useState<{
    originalText: string;
    improvedText: string;
    changesSummary: string;
    wordCountDelta: number;
  } | null>(null);

  const [copiedWriting, setCopiedWriting] = useState(false);

  // Simulated File Upload Handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFilename(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        setDocContent(text || "Sample document text extracted.");
        onShowToast("File Uploaded", `Loaded ${file.name}`, "success");
      };
      reader.readAsText(file);
    }
  };

  const handleAnalyzeDocument = async () => {
    if (!docContent.trim()) {
      onShowToast("Content Empty", "Please upload or paste document text.", "info");
      return;
    }

    setLoadingDoc(true);
    try {
      const res = await analyzeUploadedDocument({
        filename,
        content: docContent,
        action: docAction,
      });
      setDocAnalysis(res);
      onShowToast("Document Analysis Complete", "", "success");
    } catch (err: any) {
      onShowToast("Analysis Error", err.message, "error");
    } finally {
      setLoadingDoc(false);
    }
  };

  const handleProcessWriting = async () => {
    if (!draftText.trim()) {
      onShowToast("Text Required", "Please enter text for academic writing processing.", "info");
      return;
    }

    setLoadingWriting(true);
    try {
      const res = await processAcademicWriting({
        text: draftText,
        action: writingAction,
      });
      setWritingResult(res);
      onShowToast("Writing Transformation Complete", "Refined prose style.", "success");
    } catch (err: any) {
      onShowToast("Writing Assistant Error", err.message, "error");
    } finally {
      setLoadingWriting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Selector */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white shadow-md border border-indigo-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-300 text-xs font-bold uppercase tracking-wider mb-2">
            <FileText className="w-4 h-4 text-amber-300" /> AI Document & Writing Suite
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white">
            Document Assistant & Academic Writing Polisher
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            Analyze uploaded research drafts or elevate raw prose into high-impact academic journal style.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
          <button
            onClick={() => setMode("doc")}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              mode === "doc" ? "bg-indigo-600 text-white shadow-sm" : "text-slate-400 hover:text-white"
            }`}
          >
            <Upload className="w-3.5 h-3.5" /> Document Assistant
          </button>
          <button
            onClick={() => setMode("writing")}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              mode === "writing" ? "bg-indigo-600 text-white shadow-sm" : "text-slate-400 hover:text-white"
            }`}
          >
            <PenTool className="w-3.5 h-3.5" /> Academic Writing Assistant
          </button>
        </div>
      </div>

      {mode === "doc" ? (
        /* MODE 1: DOCUMENT ASSISTANT */
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            {/* Upload Zone */}
            <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-6 text-center hover:border-indigo-500 transition-colors cursor-pointer bg-slate-50 dark:bg-slate-950">
              <input
                type="file"
                accept=".pdf,.docx,.txt,.md"
                onChange={handleFileUpload}
                className="hidden"
                id="doc-upload-input"
              />
              <label htmlFor="doc-upload-input" className="cursor-pointer space-y-2 block">
                <Upload className="w-8 h-8 text-indigo-500 mx-auto" />
                <span className="font-bold text-xs text-slate-800 dark:text-slate-200 block">
                  Click to Upload Research File (.PDF, .DOCX, .TXT, .MD)
                </span>
                <span className="text-[11px] text-slate-400 block">
                  Current Document: <strong className="text-indigo-600 dark:text-indigo-400">{filename}</strong>
                </span>
              </label>
            </div>

            {/* Document Body Text Area */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Document Text Content
              </label>
              <textarea
                rows={5}
                value={docContent}
                onChange={(e) => setDocContent(e.target.value)}
                className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Action Buttons */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                Select Analysis Action
              </label>
              <div className="flex flex-wrap gap-2 text-xs">
                {[
                  { id: "summarize", label: "Summarize Core Thesis" },
                  { id: "explain", label: "Explain Chapter / Methods" },
                  { id: "keywords", label: "Extract Key Terms" },
                  { id: "improvements", label: "Suggest Improvements" },
                  { id: "missing_sections", label: "Identify Missing Sections" },
                  { id: "questions", label: "Generate Defense Questions" },
                ].map((act) => (
                  <button
                    key={act.id}
                    onClick={() => setDocAction(act.id as any)}
                    className={`px-3 py-2 rounded-xl font-bold transition-all ${
                      docAction === act.id
                        ? "bg-indigo-600 text-white shadow-sm"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200"
                    }`}
                  >
                    {act.label}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleAnalyzeDocument}
              disabled={loadingDoc}
              className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
            >
              {loadingDoc ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Analyzing Document with Gemini...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" /> Execute Document Analysis
                </>
              )}
            </button>
          </div>

          {/* Analysis Results Display */}
          {docAnalysis && (
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 animate-in fade-in duration-300">
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> AI Document Insights Output
              </h3>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-wrap">
                {docAnalysis.result}
              </div>

              {/* Extracted Questions or Missing Sections */}
              {docAnalysis.questions && docAnalysis.questions.length > 0 && (
                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs space-y-2">
                  <span className="font-bold text-amber-800 dark:text-amber-300 block uppercase text-[10px]">
                    ❓ Potential Defense Questions
                  </span>
                  <ul className="space-y-1 text-slate-800 dark:text-slate-200">
                    {docAnalysis.questions.map((q, i) => (
                      <li key={i}>• {q}</li>
                    ))}
                  </ul>
                </div>
              )}

              {docAnalysis.missingSections && docAnalysis.missingSections.length > 0 && (
                <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-xs space-y-2">
                  <span className="font-bold text-indigo-800 dark:text-indigo-300 block uppercase text-[10px]">
                    🔍 Recommended Missing Sections
                  </span>
                  <ul className="space-y-1 text-slate-800 dark:text-slate-200">
                    {docAnalysis.missingSections.map((ms, i) => (
                      <li key={i}>• {ms}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        /* MODE 2: ACADEMIC WRITING ASSISTANT */
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Raw Research Draft / Paragraph Text
              </label>
              <textarea
                rows={4}
                value={draftText}
                onChange={(e) => setDraftText(e.target.value)}
                placeholder="Paste paragraph to polish..."
                className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                Writing Transformation Style
              </label>
              <div className="flex flex-wrap gap-2 text-xs">
                {[
                  { id: "tone", label: "Elevate Academic Tone 🎓" },
                  { id: "grammar", label: "Fix Grammar & Syntax ✏️" },
                  { id: "rewrite", label: "Rewrite Paragraph Flow 🔄" },
                  { id: "shorten", label: "Concisely Shorten ✂️" },
                  { id: "expand", label: "Expand & Elaborate 📈" },
                ].map((act) => (
                  <button
                    key={act.id}
                    onClick={() => setWritingAction(act.id as any)}
                    className={`px-3 py-2 rounded-xl font-bold transition-all ${
                      writingAction === act.id
                        ? "bg-indigo-600 text-white shadow-sm"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200"
                    }`}
                  >
                    {act.label}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleProcessWriting}
              disabled={loadingWriting}
              className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
            >
              {loadingWriting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Polishing Prose with Gemini...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 text-amber-300" /> Transform Paragraph
                </>
              )}
            </button>
          </div>

          {/* Transformation Result */}
          {writingResult && (
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 animate-in fade-in duration-300">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                  Polished Academic Version
                </span>

                <button
                  onClick={() => {
                    navigator.clipboard.writeText(writingResult.improvedText);
                    setCopiedWriting(true);
                    onShowToast("Copied Improved Text", "", "success");
                    setTimeout(() => setCopiedWriting(false), 2000);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950 hover:bg-indigo-100 text-indigo-600 dark:text-indigo-400 font-bold text-xs flex items-center gap-1.5"
                >
                  {copiedWriting ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedWriting ? "Copied" : "Copy Result"}
                </button>
              </div>

              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs sm:text-sm text-slate-900 dark:text-white leading-relaxed font-serif">
                {writingResult.improvedText}
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400">
                <strong className="font-bold text-slate-800 dark:text-slate-200 block mb-0.5">Edit Notes:</strong>
                {writingResult.changesSummary}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
