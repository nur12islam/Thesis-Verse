import React, { useState } from "react";
import { RareThesisRecommendationCard, Thesis } from "../types/thesis";
import {
  Sparkles,
  Flame,
  Bookmark,
  BookmarkCheck,
  Share2,
  FileText,
  Clock,
  Compass,
  Zap,
  BookOpen,
  ChevronDown,
  ChevronUp,
  Check,
  ExternalLink,
  Info,
  GraduationCap,
  Copy,
  Layers,
  Cpu,
  Loader2,
  Tag
} from "lucide-react";

interface ThesisRecommendationCardProps {
  card: RareThesisRecommendationCard;
  isSaved: boolean;
  onToggleSave: (card: RareThesisRecommendationCard) => void;
  onGenerateSimilar: (card: RareThesisRecommendationCard) => void;
  onBuildProposal: (thesis: Thesis) => void;
  onShowToast: (title: string, message?: string, type?: "success" | "error" | "info") => void;
  isGeneratingSimilar?: boolean;
}

export const ThesisRecommendationCardComponent: React.FC<ThesisRecommendationCardProps> = ({
  card,
  isSaved,
  onToggleSave,
  onGenerateSimilar,
  onBuildProposal,
  onShowToast,
  isGeneratingSimilar,
}) => {
  const [showEvidence, setShowEvidence] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [userNotes, setUserNotes] = useState(card.userNotes || "");
  const [showNotesInput, setShowNotesInput] = useState(false);

  // Convert recommendation card into standard Thesis object for Proposal Builder & Details Modal
  const convertToThesis = (): Thesis => {
    return {
      id: card.id,
      title: card.title,
      authors: ["AI Research Synthesis (ThesisVerse)"],
      university: "Interdisciplinary Research Institute",
      publisher: "ThesisVerse Rare Discovery Engine",
      year: 2026,
      abstract: card.description,
      keywords: card.relatedTopics || [card.subject],
      subject: card.subject,
      degree: card.suggestedDegree,
      doi: `10.1016/tv.rare.${card.id.slice(-6)}`,
      sourceUrl: "#",
      language: "English",
      documentType: "Dissertation",
      citationsCount: 0,
      noveltyScore: card.noveltyScore,
      difficultyScore: card.difficulty === "Beginner Friendly" ? 30 : card.difficulty === "Moderate" ? 55 : card.difficulty === "High Challenge" ? 80 : 95,
      confidenceScore: card.confidenceScore,
      researchGap: card.researchProblem,
      futureDirections: card.relatedTopics,
      methodology: `Empirical and theoretical investigation into ${card.title}.`,
      keyFindings: card.supportingEvidence?.verifiedEvidencePoints || ["Unexplored literature gap"],
      bibtex: `@phdthesis{tv_${card.id},\n  title = {${card.title}},\n  year = {2026},\n  school = {ThesisVerse Rare Discovery Engine}\n}`,
      isRare: true,
      crossDisciplinaryTags: card.secondarySubject ? [card.secondarySubject] : [],
    };
  };

  const handleCopyShareLink = () => {
    const shareUrl = `${window.location.origin}/#rare-${card.id}`;
    navigator.clipboard.writeText(`Check out this rare thesis topic on ThesisVerse: "${card.title}" - ${shareUrl}`);
    onShowToast("Link Copied!", "Direct share link copied to clipboard.", "success");
    setShowShareModal(false);
  };

  // Color styling based on novelty score
  const getNoveltyColorClass = (score: number) => {
    if (score >= 90) return "from-rose-500 to-amber-500 text-rose-500";
    if (score >= 80) return "from-amber-500 to-emerald-500 text-amber-500";
    return "from-indigo-500 to-purple-500 text-indigo-500";
  };

  return (
    <div className="relative rounded-3xl bg-white dark:bg-slate-900 border-2 border-indigo-100 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-600 transition-all duration-300 p-6 sm:p-7 shadow-sm hover:shadow-xl flex flex-col justify-between space-y-6 group">
      
      {/* Top Header Row: Badges & Novelty Meter */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
          {/* Recommendation Badges */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-gradient-to-r from-amber-500 to-rose-500 text-slate-950 flex items-center gap-1 shadow-sm">
              <Sparkles className="w-3 h-3 text-slate-950" /> 🔴 {card.noveltyScore}% Novelty
            </span>
            <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200/80 dark:border-indigo-800">
              {card.subject}
            </span>
            {card.secondarySubject && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 border border-purple-200/80 dark:border-purple-800 flex items-center gap-1">
                <Zap className="w-2.5 h-2.5" /> + {card.secondarySubject}
              </span>
            )}
            <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
              🎓 {card.suggestedDegree}
            </span>
          </div>

          {/* Metrics Pill */}
          <div className="flex items-center gap-3 text-xs">
            <div className="text-right">
              <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                <Check className="w-3.5 h-3.5" /> {card.confidenceScore}% Confidence
              </div>
              <span className="text-[10px] text-slate-400 block">Verified Evidence</span>
            </div>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-xl font-black text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors leading-snug">
          {card.title}
        </h3>

        {/* 2-3 Line Description */}
        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
          {card.description}
        </p>

        {/* Research Problem Statement Box */}
        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 space-y-1 text-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 flex items-center gap-1">
            <Compass className="w-3 h-3" /> Core Research Problem / Gap:
          </span>
          <p className="text-slate-700 dark:text-slate-300 italic font-medium leading-relaxed">
            "{card.researchProblem}"
          </p>
        </div>

        {/* Metadata Grid: Difficulty, Est Time, Research Potential */}
        <div className="grid grid-cols-3 gap-2 text-[11px] pt-1">
          <div className="p-2 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/50">
            <span className="text-slate-400 block text-[9px] uppercase font-bold">Difficulty</span>
            <span className="font-extrabold text-indigo-700 dark:text-indigo-300">{card.difficulty}</span>
          </div>

          <div className="p-2 rounded-xl bg-purple-50/50 dark:bg-purple-950/40 border border-purple-100 dark:border-purple-900/50">
            <span className="text-slate-400 block text-[9px] uppercase font-bold">Est. Duration</span>
            <span className="font-extrabold text-purple-700 dark:text-purple-300 flex items-center gap-1">
              <Clock className="w-2.5 h-2.5" /> {card.estimatedResearchTime}
            </span>
          </div>

          <div className="p-2 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/50">
            <span className="text-slate-400 block text-[9px] uppercase font-bold">Potential</span>
            <span className="font-extrabold text-emerald-700 dark:text-emerald-300">{card.researchPotential}</span>
          </div>
        </div>

        {/* Related Topic Tags */}
        {card.relatedTopics && card.relatedTopics.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Tag className="w-3 h-3 text-indigo-500" /> Topics:
            </span>
            {card.relatedTopics.map((topic, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[11px] font-medium"
              >
                #{topic}
              </span>
            ))}
          </div>
        )}

        {/* Supporting Evidence Drawer (Toggle) */}
        <div className="border-t border-slate-100 dark:border-slate-800 pt-3">
          <button
            onClick={() => setShowEvidence(!showEvidence)}
            className="w-full py-2 px-3 rounded-xl bg-slate-100 dark:bg-slate-800/80 hover:bg-indigo-50 dark:hover:bg-indigo-950 text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 text-xs font-bold transition-all flex items-center justify-between"
          >
            <span className="flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
              📚 View Supporting Evidence & Verified Citations
            </span>
            {showEvidence ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {showEvidence && (
            <div className="mt-3 p-4 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-200/60 dark:border-indigo-800/60 space-y-3 text-xs animate-in fade-in duration-200">
              <div>
                <span className="font-bold text-indigo-800 dark:text-indigo-300 uppercase tracking-wider text-[10px] block mb-1">
                  💡 Why This Topic is Valuable:
                </span>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                  {card.supportingEvidence?.whyThisIdea}
                </p>
              </div>

              {card.supportingEvidence?.searchStats && (
                <div className="flex flex-wrap items-center gap-3 p-2.5 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-indigo-100 dark:border-indigo-900 text-[11px]">
                  <div>
                    <span className="text-slate-400 block text-[9px] uppercase">Retrieved Papers</span>
                    <span className="font-bold text-slate-900 dark:text-white">
                      {card.supportingEvidence.searchStats.totalRetrievedPapers}
                    </span>
                  </div>
                  <div className="h-6 w-px bg-slate-200 dark:bg-slate-800" />
                  <div>
                    <span className="text-slate-400 block text-[9px] uppercase">Publication Trend</span>
                    <span className="font-bold text-indigo-600 dark:text-indigo-400">
                      {card.supportingEvidence.searchStats.publicationTrend}
                    </span>
                  </div>
                  <div className="h-6 w-px bg-slate-200 dark:bg-slate-800" />
                  <div>
                    <span className="text-slate-400 block text-[9px] uppercase">Saturation</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">
                      {card.supportingEvidence.searchStats.saturationLevel}
                    </span>
                  </div>
                </div>
              )}

              {/* Verified Literature Grounds */}
              {card.supportingResearch && card.supportingResearch.length > 0 && (
                <div className="space-y-1.5">
                  <span className="font-bold text-slate-800 dark:text-slate-200 text-[11px] block">
                    Grounded Peer-Reviewed Literature References:
                  </span>
                  <div className="space-y-2">
                    {card.supportingResearch.map((ref, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1"
                      >
                        <p className="font-bold text-slate-900 dark:text-white text-xs">
                          {ref.title}
                        </p>
                        <p className="text-[10px] text-slate-500">
                          {ref.authors.join(", ")} ({ref.year}) • {ref.university} • DOI: {ref.doi}
                        </p>
                        <p className="text-[11px] text-indigo-600 dark:text-indigo-400 italic">
                          "{ref.relevanceReason}"
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Interactive Action Footer Toolbar */}
      <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {/* Save / Bookmark Button */}
          <button
            onClick={() => onToggleSave(card)}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm ${
              isSaved
                ? "bg-amber-500 text-slate-950 border border-amber-500"
                : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-amber-50 dark:hover:bg-amber-950 hover:text-amber-600"
            }`}
          >
            {isSaved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
            {isSaved ? "Saved Idea" : "❤️ Save Idea"}
          </button>

          {/* Generate Similar Button */}
          <button
            onClick={() => onGenerateSimilar(card)}
            disabled={isGeneratingSimilar}
            className="px-3 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 hover:bg-indigo-100 dark:hover:bg-indigo-900 text-indigo-600 dark:text-indigo-400 border border-indigo-200/80 dark:border-indigo-800 text-xs font-bold transition-all flex items-center gap-1.5 disabled:opacity-50"
          >
            {isGeneratingSimilar ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            )}
            🔄 Generate Similar
          </button>

          {/* Share Button */}
          <button
            onClick={() => setShowShareModal(true)}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            title="Share Idea"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>

        {/* Build Proposal Primary CTA */}
        <button
          onClick={() => onBuildProposal(convertToThesis())}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-extrabold shadow-md shadow-indigo-600/20 transition-all flex items-center gap-1.5 group"
        >
          <FileText className="w-3.5 h-3.5" />
          📝 Build Proposal
        </button>
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-md w-full border border-slate-200 dark:border-slate-800 space-y-4 shadow-2xl">
            <h4 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <Share2 className="w-5 h-5 text-indigo-500" /> Share Thesis Discovery
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Share "{card.title}" with research collaborators or advisors.
            </p>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-mono break-all text-slate-700 dark:text-slate-300">
              {card.title} - Novelty Score: {card.noveltyScore}% (ThesisVerse Engine)
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowShareModal(false)}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={handleCopyShareLink}
                className="px-4 py-1.5 rounded-xl bg-indigo-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm"
              >
                <Copy className="w-3.5 h-3.5" /> Copy Share Link
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
