import React, { useState, useEffect } from "react";
import { RareThesisRecommendationCard, Thesis, RareDiscoveryAnalytics as RareDiscoveryAnalyticsType } from "../types/thesis";
import { fetchRareDiscoveryCards, fetchSimilarThesisCards } from "../services/api";
import { ThesisRecommendationCardComponent } from "../components/ThesisRecommendationCard";
import { ResearchGapDashboard } from "../components/ResearchGapDashboard";
import { RareDiscoveryAnalyticsComponent } from "../components/RareDiscoveryAnalytics";
import {
  Dices,
  Flame,
  Sparkles,
  Zap,
  Bookmark,
  BookmarkCheck,
  FileText,
  Share2,
  CheckCircle2,
  Loader2,
  GraduationCap,
  Layers,
  ArrowRight,
  TrendingUp,
  Cpu,
  Compass,
  BarChart3,
  BookOpen,
  Filter,
  Plus,
  Trash2,
  Download
} from "lucide-react";

interface RareDiscoveryPageProps {
  savedIds: Set<string>;
  onToggleSave: (thesis: Thesis) => void;
  onBuildProposal: (thesis: Thesis) => void;
  onShowToast: (title: string, message?: string, type?: "success" | "error" | "info") => void;
}

export const RareDiscoveryPage: React.FC<RareDiscoveryPageProps> = ({
  savedIds,
  onToggleSave,
  onBuildProposal,
  onShowToast,
}) => {
  // Navigation sub-tabs within Rare Discovery page
  const [activeSubTab, setActiveSubTab] = useState<"cards" | "dashboard" | "saved" | "analytics">("cards");

  // Control panel filter state
  const [selectedDomains, setSelectedDomains] = useState<string[]>(["Quantum Computing", "Bio-Engineering & Genomics"]);
  const [focusKeyword, setFocusKeyword] = useState("");
  const [degreeLevel, setDegreeLevel] = useState<string>("Ph.D.");
  const [difficultyPreference, setDifficultyPreference] = useState<string>("All");
  const [loading, setLoading] = useState(false);
  const [generatingSimilarId, setGeneratingSimilarId] = useState<string | null>(null);

  // History of generated titles in current session for duplicate suppression
  const [generatedTitleHistory, setGeneratedTitleHistory] = useState<string[]>([]);

  // Generated recommendation cards list
  const [cards, setCards] = useState<RareThesisRecommendationCard[]>([
    {
      id: "rare-default-1",
      title: "Quantum Neural Operators for Non-Linear Protein Folding Kinetics in Genomic Disease Mapping",
      description: "Synthesizes quantum Fourier neural operators with genomic sequencing data to model high-dimensional protein folding states under extreme physical constraints.",
      researchProblem: "Traditional classical molecular dynamics algorithms scale quadratically, making real-time multi-protein folding prediction computationally intractable for complex genomic therapies.",
      suggestedDegree: "Ph.D.",
      subject: "Quantum Computing",
      secondarySubject: "Bio-Engineering & Genomics",
      difficulty: "Very High / Frontier",
      estimatedResearchTime: "18 - 24 Months",
      noveltyScore: 97,
      confidenceScore: 94,
      researchPotential: "Breakthrough Potential",
      relatedTopics: ["Quantum Neural Operators", "Genomic Folding", "Fourier Neural Maps"],
      badges: ["🔴 Highly Novel", "🟣 Rare Topic", "⚡ Interdisciplinary", "🎓 PhD"],
      supportingEvidence: {
        whyThisIdea: "Only 14 relevant dissertations published globally bridging quantum neural operators with genomic disease maps. Highly latent research field with exponential impact potential.",
        searchStats: {
          totalRetrievedPapers: 14,
          publicationTrend: "+38% growth post-2023",
          saturationLevel: "Low Saturation (High Opportunity)"
        },
        verifiedEvidencePoints: [
          "Fewer than 5 doctoral studies published on acoustic or operator quantum maps for biological structures.",
          "High alignment with NIH and NSF computational genomics funding priorities."
        ]
      },
      supportingResearch: [
        {
          id: "p-101",
          title: "Quantum Neural Operators for Non-Linear Differential Equations",
          authors: ["Dr. Aris Thorne", "Prof. Elena Rostova"],
          university: "Massachusetts Institute of Technology",
          year: 2024,
          doi: "10.1038/s41586-024-0711-2",
          relevanceReason: "Establishes foundational mathematical proof for non-linear operator maps."
        }
      ],
      createdAt: new Date().toISOString()
    },
    {
      id: "rare-default-2",
      title: "Zero-Knowledge Cryptographic Attestation of Autonomous Algorithmic Trade Execution in Financial Markets",
      description: "Applies Halo2 recursive zk-SNARK proof systems to verify high-frequency algorithmic trade compliance without revealing proprietary trading strategy weights.",
      researchProblem: "Financial regulators cannot audit high-frequency AI trading algorithms in real-time without compromising proprietary intellectual property.",
      suggestedDegree: "Ph.D.",
      subject: "Cybersecurity & Cryptography",
      secondarySubject: "Applied Economics & Finance",
      difficulty: "High Challenge",
      estimatedResearchTime: "14 - 18 Months",
      noveltyScore: 94,
      confidenceScore: 92,
      researchPotential: "Interdisciplinary Bridge",
      relatedTopics: ["Zero-Knowledge Proofs", "Halo2 zk-SNARKs", "Algorithmic Auditability"],
      badges: ["🔴 Highly Novel", "⚡ Interdisciplinary", "🎓 PhD"],
      supportingEvidence: {
        whyThisIdea: "Virtually zero published dissertations combining recursive zk-SNARKs with financial market compliance. High demand from SEC and ESMA regulatory bodies.",
        searchStats: {
          totalRetrievedPapers: 9,
          publicationTrend: "Emerging (+45% growth)",
          saturationLevel: "Very Low Saturation"
        },
        verifiedEvidencePoints: [
          "Only 9 papers found in database regarding zero-knowledge financial trading compliance.",
          "Fills a major regulatory gap in algorithmic market safety."
        ]
      },
      supportingResearch: [
        {
          id: "p-103",
          title: "Succinct Non-Interactive Zero-Knowledge Arguments in Decentralized Finance",
          authors: ["Dr. Kenji Sato"],
          university: "ETH Zürich",
          year: 2025,
          doi: "10.1109/SP46215.2025.00042",
          relevanceReason: "Provides Halo2 recursion latency benchmarks."
        }
      ],
      createdAt: new Date().toISOString()
    }
  ]);

  // Saved Rare Ideas in local storage
  const [savedRareCards, setSavedRareCards] = useState<RareThesisRecommendationCard[]>(() => {
    try {
      const stored = localStorage.getItem("thesisverse_saved_rare_cards");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Sync saved rare cards to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("thesisverse_saved_rare_cards", JSON.stringify(savedRareCards));
    } catch (e) {
      console.warn("Error storing rare cards", e);
    }
  }, [savedRareCards]);

  const DOMAIN_OPTIONS = [
    "Quantum Computing",
    "Artificial Intelligence",
    "Bio-Engineering & Genomics",
    "Climate & Sustainability",
    "Cybersecurity & Cryptography",
    "Robotics & Autonomous Systems",
    "Materials Science",
    "Applied Economics & Finance",
    "English Literature",
    "History",
    "Psychology",
    "Neuroscience & Cognitive AI",
    "Medical & Health Sciences",
    "Law & Digital Governance",
    "Astrophysics & Space Systems"
  ];

  const UNIVERSITY_REPOSITORIES = [
    "All Global Universities (Web & Repositories)",
    "MIT (DSpace Repository)",
    "Stanford University (SDR)",
    "Oxford University (ORA Archive)",
    "Cambridge University (Apollo)",
    "ETH Zurich (Research Collection)",
    "Harvard University (DASH)",
    "UC Berkeley (eScholarship)",
    "Imperial College London Repository",
    "University of Tokyo (UTokyo)",
    "National University of Singapore (ScholarBank@NUS)",
    "Tsinghua University Dissertation Archive",
    "University of Edinburgh (PURE)",
    "CaltechAUTHORS Library",
    "Princeton University (DataSpace)",
    "Carnegie Mellon University (KiltHub)",
    "Columbia University (Academic Commons)",
    "University of Toronto (TSpace)",
    "Heidelberg University Library",
    "TU Delft Research Repository",
    "University of Melbourne (Minerva)",
    "Johns Hopkins Institutional Repository",
    "Yale University (EliScholar)",
    "Cornell University (eCommons)",
    "University of Chicago (Knowledge@UChicago)"
  ];

  const [selectedUniversity, setSelectedUniversity] = useState<string>("All Global Universities (Web & Repositories)");

  const handleToggleDomain = (domain: string) => {
    if (selectedDomains.includes(domain)) {
      if (selectedDomains.length > 1) {
        setSelectedDomains(selectedDomains.filter((d) => d !== domain));
      }
    } else {
      setSelectedDomains([...selectedDomains, domain]);
    }
  };

  // Step 1: Execute Rare Discovery Search
  const handleDiscoverRareTheses = async (overrideDomains?: string[], isRandomMode = false) => {
    setLoading(true);
    const activeDomains = overrideDomains || selectedDomains;
    try {
      const res = await fetchRareDiscoveryCards({
        domains: activeDomains,
        university: selectedUniversity,
        focus: focusKeyword,
        degreeLevel,
        difficulty: difficultyPreference,
        count: 6,
        previousTitles: generatedTitleHistory,
        isRandom: isRandomMode,
      });

      if (res.cards && res.cards.length > 0) {
        setCards(res.cards);
        // Track generated titles to prevent duplication
        const newTitles = res.cards.map(c => c.title);
        setGeneratedTitleHistory(prev => [...prev, ...newTitles]);
        
        onShowToast(
          isRandomMode ? "🎲 Surprise Me Generated!" : "Rare Thesis Topics Discovered!",
          `Synthesized ${res.cards.length} high-novelty topics across ${activeDomains.join(" + ")}`,
          "success"
        );
        setActiveSubTab("cards");
      }
    } catch (err: any) {
      onShowToast("Discovery Error", err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Generate Similar Thesis Recommendations
  const handleGenerateSimilar = async (targetCard: RareThesisRecommendationCard) => {
    setGeneratingSimilarId(targetCard.id);
    try {
      const res = await fetchSimilarThesisCards({
        thesisTitle: targetCard.title,
        subject: targetCard.subject,
        researchProblem: targetCard.researchProblem,
        previousTitles: generatedTitleHistory,
      });

      if (res.cards && res.cards.length > 0) {
        setCards(prev => [...res.cards, ...prev]);
        const newTitles = res.cards.map(c => c.title);
        setGeneratedTitleHistory(prev => [...prev, ...newTitles]);
        onShowToast("5 Similar Rare Topics Generated!", `Derived from "${targetCard.title.slice(0, 30)}..."`, "success");
      }
    } catch (err: any) {
      onShowToast("Generation Error", err.message, "error");
    } finally {
      setGeneratingSimilarId(null);
    }
  };

  // Save or Bookmark Rare Recommendation Card
  const handleToggleSaveCard = (card: RareThesisRecommendationCard) => {
    const isAlreadySaved = savedRareCards.some(c => c.id === card.id);
    if (isAlreadySaved) {
      setSavedRareCards(savedRareCards.filter(c => c.id !== card.id));
      onShowToast("Removed from Saved Rare Ideas", "", "info");
    } else {
      setSavedRareCards([...savedRareCards, card]);
      onShowToast("Saved to Rare Ideas Collection", `"${card.title.slice(0, 30)}..."`, "success");
    }

    // Also toggle in standard library
    const thesisObj: Thesis = {
      id: card.id,
      title: card.title,
      authors: ["ThesisVerse Engine"],
      university: "Interdisciplinary Research Institute",
      publisher: "ThesisVerse Discovery Engine",
      year: 2026,
      abstract: card.description,
      keywords: card.relatedTopics,
      subject: card.subject,
      degree: card.suggestedDegree,
      doi: `10.1016/tv.rare.${card.id.slice(-6)}`,
      sourceUrl: "#",
      language: "English",
      citationsCount: 0,
      noveltyScore: card.noveltyScore,
      difficultyScore: 85,
      confidenceScore: card.confidenceScore,
      researchGap: card.researchProblem,
      futureDirections: card.relatedTopics,
      methodology: "Empirical investigation",
      keyFindings: card.supportingEvidence?.verifiedEvidencePoints || [],
      bibtex: `@phdthesis{tv_${card.id},\n  title = {${card.title}}\n}`,
      isRare: true
    };
    onToggleSave(thesisObj);
  };

  // Handle topic selected from Research Gap Dashboard
  const handleSelectGapTopic = (domainA: string, domainB?: string) => {
    const newDomains = domainB ? [domainA, domainB] : [domainA, "Artificial Intelligence"];
    setSelectedDomains(newDomains);
    handleDiscoverRareTheses(newDomains, false);
  };

  // Mock analytics data
  const discoveryAnalytics: RareDiscoveryAnalyticsType = {
    mostGeneratedSubjects: [
      { subject: "Quantum Computing", count: 18 },
      { subject: "Bio-Engineering & Genomics", count: 14 },
      { subject: "Cybersecurity & Cryptography", count: 12 },
      { subject: "Neuroscience & Cognitive AI", count: 9 },
      { subject: "Climate & Sustainability", count: 8 },
    ],
    mostSavedTopics: [
      { topic: "Quantum Neural Operators in Genomics", count: 12 },
      { topic: "Zero-Knowledge Financial Compliance", count: 9 },
      { topic: "Acoustic Quantum Computing", count: 7 },
    ],
    averageNoveltyScore: 94.6,
    interdisciplinaryRatio: 88,
  };

  return (
    <div className="space-y-10 pb-16">
      {/* Header Banner */}
      <div className="relative rounded-3xl bg-gradient-to-r from-amber-950 via-slate-900 to-indigo-950 text-white p-8 sm:p-12 border border-amber-500/30 overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-400 text-xs font-bold">
            <Flame className="w-4 h-4 text-amber-400" /> Flagship Signature Feature ⭐
          </div>

          <h1 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
            Rare Thesis Discovery Engine
          </h1>

          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            Eliminate dissertation topic uncertainty. Combine verified digital university repositories worldwide with multi-step AI semantic analysis to discover unresearched, high-impact dissertation topics with 90%+ novelty scores.
          </p>
        </div>
      </div>

      {/* Control Panel: Select Domains, Filters, Roll & Surprise Me */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <div>
          <label className="block text-xs font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
            Step 1: Select Cross-Disciplinary Domains (Choose 2 or more)
          </label>
          <div className="flex flex-wrap gap-2">
            {DOMAIN_OPTIONS.map((domain) => {
              const isSelected = selectedDomains.includes(domain);
              return (
                <button
                  key={domain}
                  onClick={() => handleToggleDomain(domain)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    isSelected
                      ? "bg-amber-500 text-slate-950 shadow-md font-extrabold"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                  }`}
                >
                  {isSelected && "✓ "}
                  {domain}
                </button>
              );
            })}
          </div>
        </div>

        {/* Filters Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div>
            <label className="block font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">
              Step 2: University Repository Scope
            </label>
            <select
              value={selectedUniversity}
              onChange={(e) => setSelectedUniversity(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 font-semibold"
            >
              {UNIVERSITY_REPOSITORIES.map((u) => (
                <option key={u} value={u}>
                  {u}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">
              Step 3: Focus Keyword / Frontier Technique
            </label>
            <input
              type="text"
              value={focusKeyword}
              onChange={(e) => setFocusKeyword(e.target.value)}
              placeholder="e.g., Acoustic computing, Halo2 zk-SNARKs"
              className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">
              Step 4: Target Degree Level
            </label>
            <select
              value={degreeLevel}
              onChange={(e) => setDegreeLevel(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 font-semibold"
            >
              <option value="Ph.D.">Ph.D. Dissertation</option>
              <option value="Master's">Master's Thesis</option>
              <option value="Postdoctoral">Postdoctoral Research</option>
              <option value="Honor Thesis">Undergraduate Honors Thesis</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">
              Step 5: Difficulty Filter
            </label>
            <select
              value={difficultyPreference}
              onChange={(e) => setDifficultyPreference(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 font-semibold"
            >
              <option value="All">All Difficulty Levels</option>
              <option value="Beginner Friendly">🟢 Beginner Friendly</option>
              <option value="Moderate">🟡 Moderate Challenge</option>
              <option value="High Challenge">🔴 High Challenge</option>
              <option value="Frontier / High Challenge">🟣 Frontier / High Challenge</option>
            </select>
          </div>
        </div>

        {/* CTA Buttons: Discover Rare Thesis + Surprise Me */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={() => handleDiscoverRareTheses(selectedDomains, false)}
            disabled={loading}
            className="flex-1 py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-600 to-indigo-600 hover:from-amber-400 hover:to-indigo-500 text-white font-black text-sm shadow-xl shadow-amber-500/20 transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" /> Synthesizing Verified Repository Vectors...
              </>
            ) : (
              <>
                <Dices className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
                🎲 Discover Rare Thesis Topics ({selectedDomains.length} Domains)
              </>
            )}
          </button>

          {/* Surprise Me / Random Generator */}
          <button
            onClick={() => handleDiscoverRareTheses(undefined, true)}
            disabled={loading}
            className="w-full sm:w-auto py-4 px-6 rounded-2xl bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-amber-400 font-extrabold text-sm border border-amber-500/30 transition-all flex items-center justify-center gap-2 shadow-md disabled:opacity-50"
            title="One-click random rare research idea"
          >
            <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
            🎲 Surprise Me!
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3 flex-wrap gap-2">
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <button
            onClick={() => setActiveSubTab("cards")}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 ${
              activeSubTab === "cards"
                ? "bg-indigo-600 text-white shadow-md"
                : "bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
            }`}
          >
            <Sparkles className="w-4 h-4" /> Recommendation Cards ({cards.length})
          </button>

          <button
            onClick={() => setActiveSubTab("dashboard")}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 ${
              activeSubTab === "dashboard"
                ? "bg-indigo-600 text-white shadow-md"
                : "bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
            }`}
          >
            <Compass className="w-4 h-4" /> Research Gap Dashboard
          </button>

          <button
            onClick={() => setActiveSubTab("saved")}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 ${
              activeSubTab === "saved"
                ? "bg-indigo-600 text-white shadow-md"
                : "bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
            }`}
          >
            <BookmarkCheck className="w-4 h-4" /> Saved Ideas ({savedRareCards.length})
          </button>

          <button
            onClick={() => setActiveSubTab("analytics")}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 ${
              activeSubTab === "analytics"
                ? "bg-indigo-600 text-white shadow-md"
                : "bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
            }`}
          >
            <BarChart3 className="w-4 h-4" /> Discovery Analytics
          </button>
        </div>

        <span className="text-[11px] font-semibold text-slate-500">
          Duplicate Hash Shield: <span className="text-emerald-500 font-bold">{generatedTitleHistory.length} tracked</span>
        </span>
      </div>

      {/* SUB-TAB 1: Recommendation Cards Feed */}
      {activeSubTab === "cards" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <p>
              Displaying <span className="font-bold text-slate-900 dark:text-white">{cards.length}</span> Synthesized Rare Thesis Cards
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {cards.map((card) => {
              const isSaved = savedRareCards.some((c) => c.id === card.id);
              return (
                <ThesisRecommendationCardComponent
                  key={card.id}
                  card={card}
                  isSaved={isSaved}
                  onToggleSave={handleToggleSaveCard}
                  onGenerateSimilar={handleGenerateSimilar}
                  onBuildProposal={onBuildProposal}
                  onShowToast={onShowToast}
                  isGeneratingSimilar={generatingSimilarId === card.id}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* SUB-TAB 2: Research Gap Dashboard */}
      {activeSubTab === "dashboard" && (
        <ResearchGapDashboard
          onSelectTopic={handleSelectGapTopic}
          onShowToast={onShowToast}
        />
      )}

      {/* SUB-TAB 3: Saved Rare Ideas Collection */}
      {activeSubTab === "saved" && (
        <div className="space-y-6">
          {savedRareCards.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
              <Bookmark className="w-10 h-10 text-slate-400 mx-auto" />
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">No Saved Rare Thesis Ideas Yet</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Click "❤️ Save Idea" on any thesis recommendation card to save it into your personal research library.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {savedRareCards.map((card) => (
                <ThesisRecommendationCardComponent
                  key={card.id}
                  card={card}
                  isSaved={true}
                  onToggleSave={handleToggleSaveCard}
                  onGenerateSimilar={handleGenerateSimilar}
                  onBuildProposal={onBuildProposal}
                  onShowToast={onShowToast}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* SUB-TAB 4: Discovery Analytics */}
      {activeSubTab === "analytics" && (
        <RareDiscoveryAnalyticsComponent
          analytics={discoveryAnalytics}
          totalSavedIdeasCount={savedRareCards.length}
        />
      )}
    </div>
  );
};
