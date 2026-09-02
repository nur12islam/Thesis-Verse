import React, { useState } from "react";
import { Thesis, SimplifiedAbstract, PaperEndorsement } from "../types/thesis";
import { simplifyAbstract, translateText } from "../services/api";
import {
  Sparkles,
  Bookmark,
  BookmarkCheck,
  FileText,
  Quote,
  Flame,
  CheckSquare,
  Square,
  ExternalLink,
  GraduationCap,
  Languages,
  Bot,
  Loader2,
  Check,
  RotateCcw
} from "lucide-react";

interface ThesisCardProps {
  thesis: Thesis;
  isSaved: boolean;
  isCompared: boolean;
  agentEndorsements?: PaperEndorsement[];
  onToggleSave: (thesis: Thesis) => void;
  onToggleCompare: (thesis: Thesis) => void;
  onSelectDetails: (thesis: Thesis) => void;
  onBuildProposal: (thesis: Thesis) => void;
  onCite: (thesis: Thesis) => void;
}

export const ThesisCard: React.FC<ThesisCardProps> = ({
  thesis,
  isSaved,
  isCompared,
  agentEndorsements = [],
  onToggleSave,
  onToggleCompare,
  onSelectDetails,
  onBuildProposal,
  onCite,
}) => {
  const [isSimplified, setIsSimplified] = useState(false);
  const [simplifiedData, setSimplifiedData] = useState<SimplifiedAbstract | null>(null);
  const [isSimplifying, setIsSimplifying] = useState(false);

  const [selectedLang, setSelectedLang] = useState<string>("Original");
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
      console.error("Failed to simplify abstract:", err);
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
      console.error("Failed to translate:", err);
    } finally {
      setIsTranslating(false);
    }
  };

  const displayTitle = translatedTitle || thesis.title;
  const displayAbstract = translatedAbstract || (isSimplified && simplifiedData ? simplifiedData.simplifiedAbstract : thesis.abstract);

  return (
    <div
      className={`group relative rounded-2xl border transition-all duration-300 p-5 sm:p-6 backdrop-blur-md flex flex-col justify-between ${
        thesis.isRare
          ? "bg-gradient-to-br from-amber-950/10 via-slate-900/90 to-indigo-950/20 border-amber-500/30 shadow-lg shadow-amber-500/5 hover:border-amber-500/60"
          : "bg-white/80 dark:bg-slate-900/80 border-slate-200/80 dark:border-slate-800 hover:border-indigo-500/50 dark:hover:border-indigo-500/50 shadow-sm hover:shadow-md"
      }`}
    >
      <div>
        {/* Header badges */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="flex flex-wrap items-center gap-2">
            {thesis.isRare && (
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30 flex items-center gap-1">
                <Flame className="w-3 h-3 text-amber-500" /> Hidden Gem
              </span>
            )}
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/60">
              {thesis.subject}
            </span>
            <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center gap-1">
              <GraduationCap className="w-3 h-3 text-slate-500" /> {thesis.degree}
            </span>
          </div>

          {/* AI Agent Endorsements Badges */}
          {agentEndorsements.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 w-full pt-1">
              {agentEndorsements.map((end, idx) => (
                <span
                  key={idx}
                  title={end.note}
                  className="px-2 py-0.5 rounded-md text-[10px] font-extrabold flex items-center gap-1 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-slate-800/20 text-indigo-700 dark:text-indigo-300 border border-indigo-300/60 dark:border-indigo-700/60 shadow-2xs"
                >
                  <Bot className="w-3 h-3 text-indigo-500" />
                  <span className="text-slate-900 dark:text-white font-black">{end.modelName}:</span>
                  <span className="truncate max-w-[150px]">{end.agentName}</span>
                </span>
              ))}
            </div>
          )}

          {/* Compare & Save quick toggles */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => onToggleCompare(thesis)}
              title={isCompared ? "Remove from comparison" : "Add to paper comparison"}
              className={`p-1.5 rounded-lg text-xs font-medium flex items-center gap-1 transition-colors ${
                isCompared
                  ? "bg-indigo-600 text-white"
                  : "text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              {isCompared ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4" />}
            </button>
            <button
              onClick={() => onToggleSave(thesis)}
              title={isSaved ? "Remove from library" : "Save to library"}
              className={`p-1.5 rounded-lg transition-colors ${
                isSaved
                  ? "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950"
                  : "text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              {isSaved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Title */}
        <h3
          onClick={() => onSelectDetails(thesis)}
          className="text-lg font-bold text-slate-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer transition-colors leading-snug mb-2"
        >
          {displayTitle}
        </h3>

        {/* University & Authors */}
        <p className="text-xs text-slate-600 dark:text-slate-400 font-medium mb-3 flex items-center gap-2">
          <span>{thesis.authors.join(", ")}</span>
          <span>•</span>
          <span className="text-indigo-600 dark:text-indigo-400 font-semibold">{thesis.university}</span>
          <span>•</span>
          <span>{thesis.year}</span>
        </p>

        {/* AI Action Toolbar for Card */}
        <div className="flex items-center justify-between gap-2 mb-2 pt-1 pb-1 border-t border-b border-slate-100 dark:border-slate-800/60 text-[11px]">
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
              <Loader2 className="w-3 h-3 animate-spin" />
            ) : (
              <Sparkles className="w-3 h-3 text-amber-500" />
            )}
            {isSimplified ? "Original Abstract" : "✨ Explain Simply"}
          </button>

          {/* Translation Selector */}
          <div className="flex items-center gap-1 text-slate-500">
            {isTranslating ? (
              <Loader2 className="w-3 h-3 animate-spin text-indigo-500" />
            ) : (
              <Languages className="w-3 h-3 text-indigo-500" />
            )}
            <select
              value={selectedLang}
              onChange={(e) => handleLanguageChange(e.target.value)}
              className="bg-transparent text-[11px] font-semibold text-slate-700 dark:text-slate-300 focus:outline-none cursor-pointer"
            >
              {LANGUAGES.map((lang) => (
                <option key={lang} value={lang} className="dark:bg-slate-900">
                  {lang === "Original" ? "🌍 Translate" : lang}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Abstract Preview */}
        <div className="mb-4 space-y-2">
          {isSimplified && (
            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950 px-2 py-0.5 rounded-full border border-amber-200 dark:border-amber-800">
              <Bot className="w-3 h-3" /> 🤖 AI Simplified Abstract
            </span>
          )}
          <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed">
            {displayAbstract}
          </p>

          {/* Key takeaways if simplified */}
          {isSimplified && simplifiedData?.keyTakeaways && (
            <ul className="pt-1 text-[11px] space-y-1 text-slate-700 dark:text-slate-300">
              {simplifiedData.keyTakeaways.slice(0, 2).map((takeaway, i) => (
                <li key={i} className="flex items-start gap-1">
                  <Check className="w-3 h-3 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{takeaway}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Research Gap Preview */}
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/60 dark:border-slate-800/80 mb-4 text-xs">
          <span className="font-bold text-amber-600 dark:text-amber-400 block mb-0.5 text-[11px] uppercase tracking-wider">
            Research Gap
          </span>
          <p className="text-slate-600 dark:text-slate-400 line-clamp-2 italic">
            "{thesis.researchGap}"
          </p>
        </div>

        {/* Metrics Row: Novelty, Difficulty, Citations */}
        <div className="grid grid-cols-3 gap-2 py-2 border-t border-slate-100 dark:border-slate-800/60 mb-4 text-center">
          <div className="p-2 rounded-lg bg-indigo-50/50 dark:bg-indigo-950/30">
            <span className="text-[10px] text-slate-500 uppercase font-semibold block">Novelty</span>
            <span className="font-extrabold text-sm text-indigo-600 dark:text-indigo-400">
              {thesis.noveltyScore}%
            </span>
          </div>
          <div className="p-2 rounded-lg bg-amber-50/50 dark:bg-amber-950/30">
            <span className="text-[10px] text-slate-500 uppercase font-semibold block">Difficulty</span>
            <span className="font-extrabold text-sm text-amber-600 dark:text-amber-400">
              {thesis.difficultyScore}%
            </span>
          </div>
          <div className="p-2 rounded-lg bg-slate-100/50 dark:bg-slate-800/40">
            <span className="text-[10px] text-slate-500 uppercase font-semibold block">Citations</span>
            <span className="font-extrabold text-sm text-slate-800 dark:text-slate-200">
              {thesis.citationsCount}
            </span>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100 dark:border-slate-800/80">
        <button
          onClick={() => onSelectDetails(thesis)}
          className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
        >
          View Analysis <ExternalLink className="w-3 h-3" />
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onCite(thesis)}
            className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center gap-1"
          >
            <Quote className="w-3 h-3" /> Cite
          </button>
          <button
            onClick={() => onBuildProposal(thesis)}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition-colors flex items-center gap-1"
          >
            <FileText className="w-3.5 h-3.5" /> Proposal
          </button>
        </div>
      </div>
    </div>
  );
};

