import React, { useState, useEffect } from "react";
import { Thesis, SimplifiedAbstract } from "../types/thesis";
import {
  X,
  GraduationCap,
  Sparkles,
  Bookmark,
  BookmarkCheck,
  FileText,
  Copy,
  ExternalLink,
  Flame,
  CheckCircle2,
  BookOpen,
  Send,
  Loader2,
  Download,
  Share2,
  Lock,
  Unlock,
  Layers,
  ArrowRight,
  Languages,
  Bot,
  Zap,
  Brain,
  Check,
  HelpCircle,
  MessageSquare,
  Compass
} from "lucide-react";
import { sendAiChatMessage, fetchRelatedResearch, simplifyAbstract, translateText } from "../services/api";

interface ThesisDetailModalProps {
  thesis: Thesis | null;
  onClose: () => void;
  isSaved: boolean;
  onToggleSave: (thesis: Thesis) => void;
  onBuildProposal: (thesis: Thesis) => void;
  onExploreRabbit?: (thesis: Thesis) => void;
  onShowToast: (title: string, message?: string, type?: "success" | "error" | "info") => void;
  onSelectRelatedThesis?: (thesis: Thesis) => void;
}

export const ThesisDetailModal: React.FC<ThesisDetailModalProps> = ({
  thesis,
  onClose,
  isSaved,
  onToggleSave,
  onBuildProposal,
  onExploreRabbit,
  onShowToast,
  onSelectRelatedThesis,
}) => {
  if (!thesis) return null;

  const [activeTab, setActiveTab] = useState<"overview" | "gap" | "related" | "citations" | "qa">("overview");
  const [citationFormat, setCitationFormat] = useState<"APA" | "MLA" | "Chicago" | "IEEE" | "BibTeX">("APA");

  // Related Research State
  const [relatedPapers, setRelatedPapers] = useState<(Thesis & { similarityScore?: number; sharedKeywords?: string[] })[]>([]);
  const [loadingRelated, setLoadingRelated] = useState(false);

  // AI QA state
  const [userQuery, setUserQuery] = useState("");
  const [chatHistory, setChatHistory] = useState<{ sender: "user" | "ai"; text: string; modelUsed?: string }[]>([]);
  const [loadingAi, setLoadingAi] = useState(false);
  const [aiModel, setAiModel] = useState<"fast" | "reasoning">("reasoning");

  // Simplify & Translate State
  const [isSimplified, setIsSimplified] = useState(false);
  const [simplifiedData, setSimplifiedData] = useState<SimplifiedAbstract | null>(null);
  const [isSimplifying, setIsSimplifying] = useState(false);

  const [selectedLang, setSelectedLang] = useState("Original");
  const [translatedTitle, setTranslatedTitle] = useState<string | null>(null);
  const [translatedAbstract, setTranslatedAbstract] = useState<string | null>(null);
  const [isTranslating, setIsTranslating] = useState(false);

  const LANGUAGES = ["Original", "Spanish", "French", "German", "Chinese", "Japanese", "Arabic", "Hindi", "Portuguese"];

  const handleToggleSimplify = async () => {
    if (isSimplified) {
      setIsSimplified(false);
      return;
    }

    if (simplifiedData) {
      setIsSimplified(true);
      return;
    }

    setIsSimplifying(true);
    try {
      const res = await simplifyAbstract(thesis.abstract, thesis.title, true, "fast");
      setSimplifiedData(res);
      setIsSimplified(true);
    } catch (err) {
      onShowToast("Simplification failed", "Could not simplify abstract at this moment.", "error");
    } finally {
      setIsSimplifying(false);
    }
  };

  const handleLanguageChange = async (lang: string) => {
    setSelectedLang(lang);
    if (lang === "Original") {
      setTranslatedTitle(null);
      setTranslatedAbstract(null);
      return;
    }

    setIsTranslating(true);
    try {
      const titleRes = await translateText(thesis.title, lang, "title");
      const abstractRes = await translateText(thesis.abstract, lang, "abstract");
      setTranslatedTitle(titleRes.translatedText);
      setTranslatedAbstract(abstractRes.translatedText);
    } catch (err) {
      onShowToast("Translation failed", "Failed to translate text.", "error");
    } finally {
      setIsTranslating(false);
    }
  };

  useEffect(() => {
    if (thesis?.id && activeTab === "related") {
      setLoadingRelated(true);
      fetchRelatedResearch(thesis.id)
        .then((res) => {
          setRelatedPapers(res.data || []);
        })
        .catch((err) => {
          console.error("Failed to load related research", err);
        })
        .finally(() => {
          setLoadingRelated(false);
        });
    }
  }, [thesis?.id, activeTab]);

  // Citation generator logic
  const getFormattedCitation = () => {
    const authors = thesis.authors.join(", ");
    const year = thesis.year;
    const title = thesis.title;
    const uni = thesis.university;
    const doi = thesis.doi;
    const docType = thesis.documentType || "Doctoral dissertation";

    switch (citationFormat) {
      case "APA":
        return `${authors} (${year}). ${title} (${docType}, ${uni}). https://doi.org/${doi}`;
      case "MLA":
        return `${authors}. "${title}." ${docType}, ${uni}, ${year}. DOI: ${doi}.`;
      case "Chicago":
        return `${authors}. "${title}." ${docType}, ${uni}, ${year}. https://doi.org/${doi}.`;
      case "IEEE":
        return `${authors}, "${title}," ${docType}, ${uni}, ${year}. doi: ${doi}.`;
      case "BibTeX":
        return thesis.bibtex || `@phdthesis{thesis_${thesis.id},\n  author = {${authors}},\n  title = {${title}},\n  school = {${uni}},\n  year = {${year}},\n  doi = {${doi}}\n}`;
    }
  };

  const handleCopyCitation = () => {
    navigator.clipboard.writeText(getFormattedCitation());
    onShowToast("Citation Copied", `Formatted as ${citationFormat}`, "success");
  };

  // Quick preset questions
  const PRESET_QUESTIONS = [
    "What is this paper about?",
    "Explain the methodology in plain terms",
    "What is the main research conclusion?",
    "Define difficult jargon terms",
    "What should I read next after this?"
  ];

  const handleSendQuery = async (customQuery?: string) => {
    const qToSend = customQuery || userQuery;
    if (!qToSend.trim()) return;

    const newHistory = [...chatHistory, { sender: "user" as const, text: qToSend }];
    setChatHistory(newHistory);
    setUserQuery("");
    setLoadingAi(true);

    try {
      const res = await sendAiChatMessage(newHistory, thesis, aiModel);
      setChatHistory([
        ...newHistory,
        { sender: "ai" as const, text: res.reply, modelUsed: res.modelUsed }
      ]);
    } catch (err: any) {
      onShowToast("AI Query Failed", err.message, "error");
    } finally {
      setLoadingAi(false);
    }
  };



  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-start justify-between bg-slate-50/50 dark:bg-slate-950/50">
          <div className="pr-8">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              {thesis.isRare && (
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30 flex items-center gap-1">
                  <Flame className="w-3 h-3 text-amber-500" /> Rare Discovery
                </span>
              )}
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
                {thesis.subject}
              </span>
              <span className="px-2 py-0.5 rounded-md text-xs font-medium bg-slate-200/60 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                {thesis.degree}
              </span>
              <span className="px-2 py-0.5 rounded-md text-xs font-medium bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800/40">
                {thesis.documentType || "Thesis"}
              </span>
              {thesis.isOpenAccess ? (
                <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50 flex items-center gap-1">
                  <Unlock className="w-3 h-3" /> Open Access
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 flex items-center gap-1">
                  <Lock className="w-3 h-3" /> Restricted
                </span>
              )}
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white leading-snug">
              {thesis.title}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-slate-700 dark:text-slate-200">{thesis.authors.join(", ")}</span>
              <span>•</span>
              <span className="text-indigo-600 dark:text-indigo-400 font-bold">{thesis.university}</span>
              <span>•</span>
              <span>{thesis.year}</span>
              <span>•</span>
              <span>DOI: {thesis.doi}</span>
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="flex items-center gap-2 px-5 pt-3 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-semibold overflow-x-auto">
          <button
            onClick={() => setActiveTab("overview")}
            className={`pb-3 px-3 border-b-2 transition-colors ${
              activeTab === "overview"
                ? "border-indigo-600 text-indigo-600 dark:text-indigo-400 font-bold"
                : "border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-200"
            }`}
          >
            Overview & Metadata
          </button>
          <button
            onClick={() => setActiveTab("gap")}
            className={`pb-3 px-3 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === "gap"
                ? "border-amber-500 text-amber-600 dark:text-amber-400 font-bold"
                : "border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-200"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Research Gap & Metrics
          </button>
          <button
            onClick={() => setActiveTab("related")}
            className={`pb-3 px-3 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === "related"
                ? "border-violet-600 text-violet-600 dark:text-violet-400 font-bold"
                : "border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-200"
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-violet-500" /> Related Research
          </button>
          <button
            onClick={() => setActiveTab("citations")}
            className={`pb-3 px-3 border-b-2 transition-colors ${
              activeTab === "citations"
                ? "border-indigo-600 text-indigo-600 dark:text-indigo-400 font-bold"
                : "border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-200"
            }`}
          >
            Citation Generator
          </button>
          <button
            onClick={() => setActiveTab("qa")}
            className={`pb-3 px-3 border-b-2 transition-colors ${
              activeTab === "qa"
                ? "border-indigo-600 text-indigo-600 dark:text-indigo-400 font-bold"
                : "border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-200"
            }`}
          >
            Ask AI Assistant
          </button>
        </div>

        {/* Modal Body Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6 text-sm">
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Abstract Header with AI Tools */}
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <h3 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                    Abstract
                    {isSimplified && (
                      <span className="normal-case px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30 flex items-center gap-1">
                        <Bot className="w-3 h-3" /> 🤖 AI Simplified
                      </span>
                    )}
                  </h3>

                  <div className="flex items-center gap-2 text-xs">
                    {/* Simplify Button */}
                    <button
                      onClick={handleToggleSimplify}
                      disabled={isSimplifying}
                      className={`px-2.5 py-1 rounded-lg font-semibold flex items-center gap-1 transition-all ${
                        isSimplified
                          ? "bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30"
                          : "bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900"
                      }`}
                    >
                      {isSimplifying ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      )}
                      {isSimplified ? "Original Abstract" : "✨ Explain Simply"}
                    </button>

                    {/* Translate Selector */}
                    <div className="flex items-center gap-1 text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-lg">
                      {isTranslating ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-500" />
                      ) : (
                        <Languages className="w-3.5 h-3.5 text-indigo-500" />
                      )}
                      <select
                        value={selectedLang}
                        onChange={(e) => handleLanguageChange(e.target.value)}
                        className="bg-transparent text-xs font-semibold text-slate-700 dark:text-slate-300 focus:outline-none cursor-pointer"
                      >
                        {LANGUAGES.map((lang) => (
                          <option key={lang} value={lang} className="dark:bg-slate-900">
                            {lang === "Original" ? "🌍 Translate" : lang}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <p className="text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-950/60 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800">
                  {translatedAbstract || (isSimplified && simplifiedData ? simplifiedData.simplifiedAbstract : thesis.abstract)}
                </p>

                {/* Key takeaways if simplified */}
                {isSimplified && simplifiedData?.keyTakeaways && (
                  <div className="mt-3 p-3 rounded-xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-800/50 space-y-1.5 text-xs">
                    <span className="font-bold text-amber-700 dark:text-amber-400 block">Key Takeaways:</span>
                    <ul className="space-y-1">
                      {simplifiedData.keyTakeaways.map((takeaway, i) => (
                        <li key={i} className="flex items-start gap-1.5 text-slate-700 dark:text-slate-300">
                          <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                          <span>{takeaway}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>


              {/* Keywords & Tags */}
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white mb-2 text-xs uppercase tracking-wider text-slate-500">
                  Keywords & Interdisciplinary Focus
                </h3>
                <div className="flex flex-wrap gap-2">
                  {thesis.keywords.map((k, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg text-xs bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium"
                    >
                      #{k}
                    </span>
                  ))}
                  {thesis.crossDisciplinaryTags?.map((tag, idx) => (
                    <span
                      key={`tag-${idx}`}
                      className="px-2.5 py-1 rounded-lg text-xs bg-violet-50 dark:bg-violet-950/60 text-violet-700 dark:text-violet-300 border border-violet-200 dark:border-violet-800/50 font-semibold"
                    >
                      ⚡ {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Publication Details & License */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-xs">
                <div>
                  <span className="text-slate-400 font-medium block">Publisher / Repository</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{thesis.publisher || "Institutional Repository"}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-medium block">Country / Region</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{thesis.country || "United States"}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-medium block">Citations</span>
                  <span className="font-semibold text-indigo-600 dark:text-indigo-400">{thesis.citationsCount} Citations</span>
                </div>
                <div>
                  <span className="text-slate-400 font-medium block">License</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{thesis.license || "CC-BY 4.0"}</span>
                </div>
              </div>

              {/* Methodology & Key Findings */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
                  <h4 className="font-bold text-xs uppercase text-indigo-600 dark:text-indigo-400 mb-2">
                    Methodological Approach
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300">{thesis.methodology}</p>
                  {thesis.sampleSize && (
                    <p className="text-[11px] text-slate-400 mt-2">
                      <span className="font-semibold text-slate-500">Sample/Testbed:</span> {thesis.sampleSize}
                    </p>
                  )}
                </div>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
                  <h4 className="font-bold text-xs uppercase text-emerald-600 dark:text-emerald-400 mb-2">
                    Key Empirical Findings
                  </h4>
                  <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                    {thesis.keyFindings.map((f, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeTab === "gap" && (
            <div className="space-y-6">
              {/* Novelty & Metric Meters */}
              <div className="grid grid-cols-3 gap-4 p-4 rounded-2xl bg-gradient-to-r from-indigo-900/10 via-amber-900/10 to-emerald-900/10 border border-slate-200 dark:border-slate-800 text-center">
                <div>
                  <span className="text-xs uppercase font-bold text-slate-500 block mb-1">Novelty Rating</span>
                  <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400">{thesis.noveltyScore}%</div>
                  <span className="text-[10px] text-slate-400">Frontier Uniqueness</span>
                </div>
                <div>
                  <span className="text-xs uppercase font-bold text-slate-500 block mb-1">Difficulty Score</span>
                  <div className="text-2xl font-black text-amber-600 dark:text-amber-400">{thesis.difficultyScore}%</div>
                  <span className="text-[10px] text-slate-400">Implementation Complexity</span>
                </div>
                <div>
                  <span className="text-xs uppercase font-bold text-slate-500 block mb-1">Confidence Score</span>
                  <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{thesis.confidenceScore}%</div>
                  <span className="text-[10px] text-slate-400">Methodological Rigor</span>
                </div>
              </div>

              {/* Research Gap Analysis */}
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-slate-800 dark:text-slate-200">
                <h4 className="font-bold text-amber-600 dark:text-amber-400 text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" /> Unaddressed Literature Research Gap
                </h4>
                <p className="text-xs leading-relaxed italic">{thesis.researchGap}</p>
              </div>

              {/* Future Directions */}
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider mb-2">
                  Recommended Future Thesis Extensions
                </h4>
                <div className="space-y-2">
                  {thesis.futureDirections.map((dir, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2"
                    >
                      <span className="font-bold text-indigo-600 dark:text-indigo-400 shrink-0">#{idx + 1}</span>
                      <span>{dir}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "related" && (
            <div className="space-y-4">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Discovered via metadata-driven similarity algorithms matching shared keywords, subject classifications, and author overlaps.
              </p>

              {loadingRelated ? (
                <div className="flex items-center justify-center py-12 text-slate-500 text-xs gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-indigo-600" /> Finding related academic literature...
                </div>
              ) : relatedPapers.length === 0 ? (
                <div className="text-center py-12 text-slate-400 text-xs">
                  No closely related research records found for this title.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {relatedPapers.map((rel) => (
                    <div
                      key={rel.id}
                      className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 hover:border-violet-500/50 transition-all flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-1.5">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-violet-100 dark:bg-violet-950/80 text-violet-700 dark:text-violet-300">
                            {rel.subject}
                          </span>
                          <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                            {rel.similarityScore ? `Match Score: +${rel.similarityScore}` : "Related"}
                          </span>
                        </div>
                        <h4 className="font-bold text-xs text-slate-900 dark:text-white line-clamp-2 mb-1">
                          {rel.title}
                        </h4>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2">
                          {rel.abstract}
                        </p>
                      </div>

                      <div className="mt-3 pt-2 border-t border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between">
                        <span className="text-[10px] text-slate-400">{rel.year} • {rel.authors[0]}</span>
                        <button
                          onClick={() => {
                            if (onSelectRelatedThesis) {
                              onSelectRelatedThesis(rel);
                            }
                          }}
                          className="text-[11px] font-bold text-violet-600 dark:text-violet-400 hover:underline flex items-center gap-1"
                        >
                          View <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "citations" && (
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">
                  Select Citation Standard Format
                </label>
                <div className="flex flex-wrap gap-2">
                  {(["APA", "MLA", "Chicago", "IEEE", "BibTeX"] as const).map((fmt) => (
                    <button
                      key={fmt}
                      onClick={() => setCitationFormat(fmt)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        citationFormat === fmt
                          ? "bg-indigo-600 text-white shadow-sm"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                      }`}
                    >
                      {fmt}
                    </button>
                  ))}
                </div>
              </div>

              <div className="relative p-4 rounded-xl bg-slate-900 text-slate-100 font-mono text-xs border border-slate-800">
                <pre className="whitespace-pre-wrap break-all pr-10">{getFormattedCitation()}</pre>
                <button
                  onClick={handleCopyCitation}
                  className="absolute top-3 right-3 p-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-colors"
                  title="Copy Citation"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {activeTab === "qa" && (
            <div className="space-y-4">
              {/* Header with Model Selector */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <Bot className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    AI Academic Assistant
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                    🤖 AI-Generated
                  </span>
                </div>

                <div className="flex items-center gap-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-1 rounded-lg text-xs">
                  <button
                    onClick={() => setAiModel("fast")}
                    className={`px-2 py-0.5 rounded font-semibold text-[11px] transition-colors flex items-center gap-1 ${
                      aiModel === "fast"
                        ? "bg-indigo-600 text-white shadow-sm"
                        : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    <Zap className="w-3 h-3" /> ⚡ Fast
                  </button>
                  <button
                    onClick={() => setAiModel("reasoning")}
                    className={`px-2 py-0.5 rounded font-semibold text-[11px] transition-colors flex items-center gap-1 ${
                      aiModel === "reasoning"
                        ? "bg-purple-600 text-white shadow-sm"
                        : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    <Brain className="w-3 h-3" /> 🧠 DeepSeek R1
                  </button>
                </div>
              </div>

              {/* Preset Question Chips */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  Quick Research Prompts:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {PRESET_QUESTIONS.map((pq, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendQuery(pq)}
                      className="px-2.5 py-1 rounded-lg bg-indigo-50/70 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900 text-indigo-700 dark:text-indigo-300 text-xs font-medium border border-indigo-200/60 dark:border-indigo-800/60 transition-colors flex items-center gap-1"
                    >
                      <MessageSquare className="w-3 h-3 text-indigo-500" />
                      {pq}
                    </button>
                  ))}
                </div>
              </div>

              {/* Chat Container */}
              <div className="min-h-[220px] max-h-[320px] overflow-y-auto p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3">
                {chatHistory.length === 0 ? (
                  <div className="text-center text-slate-400 text-xs py-10 space-y-2">
                    <Bot className="w-8 h-8 mx-auto text-indigo-400 opacity-60" />
                    <p>Ask AI anything about this paper's methodology, data, limitations, or conclusion.</p>
                    <p className="text-[11px] text-slate-500 italic">All answers are strictly verified against the research metadata.</p>
                  </div>
                ) : (
                  chatHistory.map((m, idx) => (
                    <div
                      key={idx}
                      className={`p-3 rounded-xl text-xs ${
                        m.sender === "user"
                          ? "bg-indigo-600 text-white ml-8 shadow-sm"
                          : "bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 mr-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1"
                      }`}
                    >
                      <div className="flex items-center justify-between text-[10px] opacity-80 font-bold mb-1">
                        <span>{m.sender === "user" ? "You" : "ThesisVerse AI Assistant"}</span>
                        {m.sender === "ai" && (
                          <span className="text-indigo-500 flex items-center gap-1">
                            <Sparkles className="w-3 h-3" /> 🤖 AI-Generated
                          </span>
                        )}
                      </div>
                      <p className="whitespace-pre-wrap leading-relaxed">{m.text}</p>
                    </div>
                  ))
                )}
                {loadingAi && (
                  <div className="flex items-center gap-2 text-xs text-indigo-500 p-2 bg-indigo-50/50 dark:bg-indigo-950/40 rounded-lg">
                    <Loader2 className="w-4 h-4 animate-spin" /> Analyzing research paper with {aiModel === "reasoning" ? "DeepSeek R1 Reasoning Model" : "Fast AI Model"}...
                  </div>
                )}
              </div>

              {/* Input Area */}
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={userQuery}
                  onChange={(e) => setUserQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendQuery()}
                  placeholder="Ask a question about this thesis (e.g., What are the main limitations?)..."
                  className="flex-1 px-4 py-2.5 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  onClick={() => handleSendQuery()}
                  disabled={loadingAi || !userQuery.trim()}
                  className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-bold transition-colors flex items-center gap-1.5 shadow-sm"
                >
                  <Send className="w-3.5 h-3.5" /> Ask AI
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={() => onToggleSave(thesis)}
            className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              isSaved
                ? "bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800"
                : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
            }`}
          >
            {isSaved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
            {isSaved ? "Saved to Library" : "Save to Library"}
          </button>

          <div className="flex items-center gap-2">
            {onExploreRabbit && (
              <button
                onClick={() => {
                  onExploreRabbit(thesis);
                  onClose();
                }}
                className="px-3 py-2 rounded-xl text-xs font-bold bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100 transition-colors flex items-center gap-1.5 shadow-sm"
                title="Open in ResearchRabbit Literature Graph"
              >
                <Compass className="w-3.5 h-3.5" /> Literature Graph
              </button>
            )}

            {thesis.pdfUrl && (
              <a
                href={thesis.pdfUrl}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white transition-colors flex items-center gap-1.5 shadow-sm"
              >
                <Download className="w-3.5 h-3.5" /> Open Full PDF
              </a>
            )}

            <a
              href={thesis.sourceUrl}
              target="_blank"
              rel="noreferrer"
              className="px-3 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center gap-1"
            >
              DOI Link <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <button
              onClick={() => {
                onBuildProposal(thesis);
                onClose();
              }}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md transition-colors flex items-center gap-1.5"
            >
              <FileText className="w-4 h-4" /> Build Proposal From This
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
