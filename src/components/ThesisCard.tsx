import React, { useState } from "react";
import { Thesis, SimplifiedAbstract, PaperEndorsement } from "../types/thesis";
import { simplifyAbstract, translateText } from "../services/api";
import {
  Bookmark,
  BookmarkCheck,
  Bot,
  Check,
  CheckSquare,
  ExternalLink,
  FileText,
  Flame,
  GraduationCap,
  Languages,
  Loader2,
  Quote,
  Sparkles,
  Square,
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

const LANGUAGES = [
  "Original",
  "Spanish",
  "French",
  "German",
  "Chinese",
  "Japanese",
  "Arabic",
  "Hindi",
  "Portuguese",
];

const clampScore = (value: number) => Math.max(0, Math.min(100, value));

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
  const [selectedLang, setSelectedLang] = useState("Original");
  const [translatedTitle, setTranslatedTitle] = useState<string | null>(null);
  const [translatedAbstract, setTranslatedAbstract] = useState<string | null>(null);
  const [isTranslating, setIsTranslating] = useState(false);

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
      const [titleRes, abstractRes] = await Promise.all([
        translateText(thesis.title, lang, "title"),
        translateText(thesis.abstract, lang, "abstract"),
      ]);
      setTranslatedTitle(titleRes.translatedText);
      setTranslatedAbstract(abstractRes.translatedText);
    } catch (err) {
      console.error("Failed to translate:", err);
    } finally {
      setIsTranslating(false);
    }
  };

  const displayTitle = translatedTitle || thesis.title;
  const displayAbstract =
    translatedAbstract ||
    (isSimplified && simplifiedData ? simplifiedData.simplifiedAbstract : thesis.abstract);
  const novelty = clampScore(thesis.noveltyScore);
  const confidence = clampScore(thesis.confidenceScore);

  return (
    <article
      className={`group flex h-full flex-col overflow-hidden rounded-2xl border bg-[var(--tv-surface)] transition-all duration-200 ${
        isCompared
          ? "border-[var(--tv-accent)] shadow-[0_0_0_2px_var(--tv-accent-soft)]"
          : "border-[var(--tv-border)] hover:-translate-y-0.5 hover:border-[var(--tv-border-strong)] hover:shadow-lg"
      }`}
    >
      <div className="flex-1 p-5 sm:p-6">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div className="flex min-w-0 flex-wrap items-center gap-2">
            {thesis.isRare && (
              <span className="inline-flex items-center gap-1 rounded-full border border-[var(--tv-accent)] bg-[var(--tv-accent-soft)] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--tv-accent-dark)] dark:text-[var(--tv-accent)]">
                <Flame className="h-3 w-3" /> Underexplored
              </span>
            )}
            <span className="rounded-full bg-[var(--tv-surface-soft)] px-2.5 py-1 text-[11px] font-semibold text-[var(--tv-text)]">
              {thesis.subject}
            </span>
            {thesis.documentType && (
              <span className="rounded-full border border-[var(--tv-border)] px-2.5 py-1 text-[10px] font-medium text-[var(--tv-muted)]">
                {thesis.documentType}
              </span>
            )}
          </div>

          <div className="flex shrink-0 items-center gap-1">
            <button
              type="button"
              onClick={() => onToggleCompare(thesis)}
              title={isCompared ? "Remove from comparison" : "Compare this paper"}
              aria-label={isCompared ? "Remove from comparison" : "Compare this paper"}
              className={`rounded-lg border p-2 transition-colors ${
                isCompared
                  ? "border-[var(--tv-accent)] bg-[var(--tv-accent)] text-[var(--tv-on-accent)]"
                  : "border-transparent text-[var(--tv-muted)] hover:border-[var(--tv-border)] hover:bg-[var(--tv-surface-soft)] hover:text-[var(--tv-text)]"
              }`}
            >
              {isCompared ? <CheckSquare className="h-4 w-4" /> : <Square className="h-4 w-4" />}
            </button>
            <button
              type="button"
              onClick={() => onToggleSave(thesis)}
              title={isSaved ? "Remove from library" : "Save to library"}
              aria-label={isSaved ? "Remove from library" : "Save to library"}
              className={`rounded-lg border p-2 transition-colors ${
                isSaved
                  ? "border-[var(--tv-accent)] bg-[var(--tv-accent-soft)] text-[var(--tv-accent-dark)] dark:text-[var(--tv-accent)]"
                  : "border-transparent text-[var(--tv-muted)] hover:border-[var(--tv-border)] hover:bg-[var(--tv-surface-soft)] hover:text-[var(--tv-text)]"
              }`}
            >
              {isSaved ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onSelectDetails(thesis)}
          className="mb-2 block w-full text-left font-serif text-xl font-semibold leading-tight text-[var(--tv-heading)] transition-colors hover:text-[var(--tv-accent-dark)] dark:hover:text-[var(--tv-accent)]"
        >
          {displayTitle}
        </button>

        <div className="mb-4 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-[var(--tv-muted)]">
          <span className="font-medium text-[var(--tv-text)]">{thesis.authors.join(", ")}</span>
          <span aria-hidden="true">·</span>
          <span>{thesis.university}</span>
          <span aria-hidden="true">·</span>
          <span>{thesis.year}</span>
          <span aria-hidden="true">·</span>
          <span className="inline-flex items-center gap-1">
            <GraduationCap className="h-3.5 w-3.5" /> {thesis.degree}
          </span>
        </div>

        {agentEndorsements.length > 0 && (
          <div className="mb-4 rounded-xl border border-[var(--tv-border)] bg-[var(--tv-surface-soft)] p-3">
            <div className="mb-2 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--tv-muted)]">
              <Bot className="h-3.5 w-3.5" /> Multi-agent signal
            </div>
            <div className="flex flex-wrap gap-1.5">
              {agentEndorsements.slice(0, 3).map((end, idx) => (
                <span
                  key={`${end.modelName}-${end.agentName}-${idx}`}
                  title={end.note}
                  className="rounded-md border border-[var(--tv-border)] bg-[var(--tv-surface)] px-2 py-1 text-[10px] font-semibold text-[var(--tv-text)]"
                >
                  {end.modelName}: {end.agentName}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="mb-4 flex items-center justify-between gap-3 border-y border-[var(--tv-border)] py-2.5">
          <button
            type="button"
            onClick={handleToggleSimplify}
            disabled={isSimplifying}
            className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-[11px] font-semibold text-[var(--tv-accent-dark)] transition-colors hover:bg-[var(--tv-accent-soft)] dark:text-[var(--tv-accent)]"
          >
            {isSimplifying ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
            {isSimplified ? "Show original" : "Explain simply"}
          </button>

          <label className="flex items-center gap-1.5 text-[11px] text-[var(--tv-muted)]">
            {isTranslating ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Languages className="h-3.5 w-3.5" />}
            <select
              value={selectedLang}
              onChange={(e) => handleLanguageChange(e.target.value)}
              disabled={isTranslating}
              aria-label="Translate paper"
              className="max-w-[115px] cursor-pointer bg-transparent font-semibold text-[var(--tv-text)] outline-none"
            >
              {LANGUAGES.map((lang) => (
                <option key={lang} value={lang} className="bg-[var(--tv-surface)]">
                  {lang === "Original" ? "Translate" : lang}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="mb-5">
          {isSimplified && (
            <span className="mb-2 inline-flex items-center gap-1 rounded-full bg-[var(--tv-accent-soft)] px-2 py-1 text-[10px] font-semibold text-[var(--tv-accent-dark)] dark:text-[var(--tv-accent)]">
              <Bot className="h-3 w-3" /> AI-assisted summary
            </span>
          )}
          <p className="line-clamp-4 text-sm leading-6 text-[var(--tv-muted)]">{displayAbstract}</p>
          {isSimplified && simplifiedData?.keyTakeaways?.length ? (
            <ul className="mt-3 space-y-1.5 border-t border-[var(--tv-border)] pt-3 text-xs text-[var(--tv-text)]">
              {simplifiedData.keyTakeaways.slice(0, 2).map((takeaway, i) => (
                <li key={i} className="flex items-start gap-2">
                  <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--tv-accent-dark)] dark:text-[var(--tv-accent)]" />
                  <span>{takeaway}</span>
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        <div className="mb-5 rounded-xl border border-[var(--tv-border)] bg-[var(--tv-surface-soft)] p-4">
          <div className="mb-1 flex items-center justify-between gap-2">
            <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--tv-accent-dark)] dark:text-[var(--tv-accent)]">
              Research gap
            </span>
            <span className="text-[10px] text-[var(--tv-muted)]">Evidence to review</span>
          </div>
          <p className="line-clamp-3 text-sm leading-5 text-[var(--tv-text)]">{thesis.researchGap}</p>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <Metric label="Novelty" value={`${novelty}%`} tone="accent" />
          <Metric label="Difficulty" value={`${clampScore(thesis.difficultyScore)}%`} tone="neutral" />
          <Metric label="Citations" value={thesis.citationsCount.toLocaleString()} tone="neutral" />
        </div>

        {confidence > 0 && (
          <div className="mt-3 flex items-center justify-between text-[10px] text-[var(--tv-muted)]">
            <span>Discovery confidence</span>
            <span className="font-semibold text-[var(--tv-text)]">{confidence}%</span>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2 border-t border-[var(--tv-border)] p-4 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          onClick={() => onSelectDetails(thesis)}
          className="inline-flex items-center justify-center gap-1.5 rounded-lg px-2 py-2 text-xs font-semibold text-[var(--tv-text)] transition-colors hover:bg-[var(--tv-surface-soft)]"
        >
          View analysis <ExternalLink className="h-3.5 w-3.5" />
        </button>

        <div className="grid grid-cols-2 gap-2 sm:flex">
          <button
            type="button"
            onClick={() => onCite(thesis)}
            className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-[var(--tv-border)] bg-[var(--tv-surface)] px-3 py-2 text-xs font-semibold text-[var(--tv-text)] transition-colors hover:bg-[var(--tv-surface-soft)]"
          >
            <Quote className="h-3.5 w-3.5" /> Cite
          </button>
          <button
            type="button"
            onClick={() => onBuildProposal(thesis)}
            className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-[var(--tv-accent)] px-3.5 py-2 text-xs font-bold text-[var(--tv-on-accent)] transition-colors hover:bg-[var(--tv-accent-dark)]"
          >
            <FileText className="h-3.5 w-3.5" /> Build research
          </button>
        </div>
      </div>
    </article>
  );
};

function Metric({ label, value, tone }: { label: string; value: string; tone: "accent" | "neutral" }) {
  return (
    <div className="rounded-xl border border-[var(--tv-border)] bg-[var(--tv-surface)] px-2 py-2.5 text-center">
      <span className="block text-[9px] font-bold uppercase tracking-[0.12em] text-[var(--tv-muted)]">{label}</span>
      <span
        className={`mt-0.5 block text-sm font-bold ${
          tone === "accent" ? "text-[var(--tv-accent-dark)] dark:text-[var(--tv-accent)]" : "text-[var(--tv-text)]"
        }`}
      >
        {value}
      </span>
    </div>
  );
}
