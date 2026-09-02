import React from "react";
import { Thesis } from "../types/thesis";
import { POPULAR_TOPICS, CATEGORIES_LIST } from "../data/thesesData";
import { ThesisCard } from "../components/ThesisCard";
import {
  Sparkles,
  Search,
  Dices,
  FileText,
  Flame,
  ArrowRight,
  BarChart3,
  Globe,
  GraduationCap,
  Building2,
  BookOpen,
  Shuffle,
  CheckCircle2,
  Code,
  Cpu,
  Compass,
  Landmark,
  TrendingUp,
  Activity,
  Brain,
  Users,
  Scale,
  Leaf,
  Briefcase,
  Binary
} from "lucide-react";

interface LandingPageProps {
  rareTheses: Thesis[];
  onSearchTopic: (topic: string) => void;
  onSearchCategory: (category: string) => void;
  setActiveTab: (tab: string) => void;
  savedIds: Set<string>;
  comparedIds: Set<string>;
  onToggleSave: (thesis: Thesis) => void;
  onToggleCompare: (thesis: Thesis) => void;
  onSelectDetails: (thesis: Thesis) => void;
  onBuildProposal: (thesis: Thesis) => void;
  onCite: (thesis: Thesis) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  rareTheses,
  onSearchTopic,
  onSearchCategory,
  setActiveTab,
  savedIds,
  comparedIds,
  onToggleSave,
  onToggleCompare,
  onSelectDetails,
  onBuildProposal,
  onCite,
}) => {
  const [heroSearchInput, setHeroSearchInput] = React.useState("");

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (heroSearchInput.trim()) {
      onSearchTopic(heroSearchInput.trim());
      setActiveTab("search");
    }
  };

  const handleSurpriseMe = () => {
    const randomTopics = [
      "Gothic Urban Literature",
      "Post-Colonial Narrative Mechanics",
      "Comparative Allegory in Devotional Poetry",
      "Ecocriticism & Environmental Memory",
      "Digital Humanities & Stylometry",
      "Feminist Epistolary Rhetoric",
      "Oral History & Dialect Linguistics",
      "Epistemology of Silence & Traumatic Memory",
      "Public Policy & Cultural Heritage Preservation"
    ];
    const picked = randomTopics[Math.floor(Math.random() * randomTopics.length)];
    onSearchTopic(picked);
    setActiveTab("search");
  };

  const rareOfTheDay = rareTheses[0];

  // Icon map for categories
  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case "Code": return <Code className="w-5 h-5" />;
      case "Cpu": return <Cpu className="w-5 h-5" />;
      case "BookOpen": return <BookOpen className="w-5 h-5" />;
      case "MessageSquare": return <BookOpen className="w-5 h-5" />;
      case "Compass": return <Compass className="w-5 h-5" />;
      case "Landmark": return <Landmark className="w-5 h-5" />;
      case "TrendingUp": return <TrendingUp className="w-5 h-5" />;
      case "GraduationCap": return <GraduationCap className="w-5 h-5" />;
      case "Activity": return <Activity className="w-5 h-5" />;
      case "Brain": return <Brain className="w-5 h-5" />;
      case "Users": return <Users className="w-5 h-5" />;
      case "Sparkles": return <Sparkles className="w-5 h-5" />;
      case "Scale": return <Scale className="w-5 h-5" />;
      case "Leaf": return <Leaf className="w-5 h-5" />;
      case "Briefcase": return <Briefcase className="w-5 h-5" />;
      case "Binary": return <Binary className="w-5 h-5" />;
      default: return <BookOpen className="w-5 h-5" />;
    }
  };

  return (
    <div className="space-y-16 pb-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-indigo-950 via-slate-900 to-slate-950 text-white p-8 sm:p-12 md:p-16 border border-slate-800 shadow-2xl">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>AI-Powered Academic Research & Thesis Discovery</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            Discover <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-amber-300 to-violet-400">Unresearched Gaps</span> & Hidden Academic Gems
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
            Search thousands of verified dissertations, calculate instant AI novelty scores, discover rare interdisciplinary thesis topics, and convert research gaps into full proposals.
          </p>

          {/* Main Search Bar */}
          <form onSubmit={handleSearchSubmit} className="pt-2 max-w-2xl mx-auto">
            <div className="relative flex items-center bg-slate-900/90 border border-slate-700/80 rounded-2xl p-2 shadow-2xl focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
              <Search className="w-5 h-5 text-slate-400 ml-3 shrink-0" />
              <input
                type="text"
                value={heroSearchInput}
                onChange={(e) => setHeroSearchInput(e.target.value)}
                placeholder="Search thesis title, subject, university, or DOI..."
                className="w-full bg-transparent border-0 px-3 py-2 text-sm text-white placeholder-slate-400 focus:outline-none"
              />
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition-colors shrink-0 flex items-center gap-1.5"
              >
                Search Research
              </button>
            </div>
          </form>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => setActiveTab("search")}
              className="px-4 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition-colors flex items-center gap-2"
            >
              <Search className="w-4 h-4 text-indigo-400" /> Search Existing Research
            </button>

            <button
              onClick={() => setActiveTab("rare")}
              className="px-4 py-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-bold border border-amber-500/30 transition-colors flex items-center gap-2"
            >
              <Dices className="w-4 h-4 text-amber-400" /> 🎲 Discover Rare Thesis
            </button>

            <button
              onClick={handleSurpriseMe}
              className="px-4 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition-colors flex items-center gap-2"
            >
              <Shuffle className="w-4 h-4 text-violet-400" /> Surprise Me
            </button>
          </div>

          {/* Trending Topics */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-400">
            <span className="font-semibold text-slate-300 text-[11px] uppercase tracking-wider">Trending:</span>
            {POPULAR_TOPICS.slice(0, 6).map((topic, idx) => (
              <button
                key={idx}
                onClick={() => {
                  onSearchTopic(topic);
                  setActiveTab("search");
                }}
                className="px-2.5 py-1 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/60 transition-colors text-xs"
              >
                {topic}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Rare Thesis of the Day (Mock Banner) */}
      {rareOfTheDay && (
        <section className="relative rounded-3xl bg-gradient-to-r from-amber-950/40 via-slate-900 to-indigo-950/40 border border-amber-500/30 p-6 sm:p-8 backdrop-blur-md shadow-xl">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="space-y-3 flex-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-400 text-xs font-bold">
                <Flame className="w-4 h-4" /> Rare Thesis of the Day
              </div>

              <h2 className="text-xl sm:text-2xl font-bold text-white leading-snug">
                "{rareOfTheDay.title}"
              </h2>

              <p className="text-slate-300 text-xs sm:text-sm line-clamp-2 leading-relaxed">
                {rareOfTheDay.abstract}
              </p>

              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                <span className="font-semibold text-slate-300">{rareOfTheDay.university}</span>
                <span>•</span>
                <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold">
                  Novelty Score: {rareOfTheDay.noveltyScore}%
                </span>
                <span>•</span>
                <span className="text-indigo-300">{rareOfTheDay.subject}</span>
              </div>
            </div>

            <div className="shrink-0 flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
              <button
                onClick={() => onSelectDetails(rareOfTheDay)}
                className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition-colors flex items-center justify-center gap-2 shadow-md"
              >
                Inspect Abstract & Gap
              </button>
              <button
                onClick={() => onBuildProposal(rareOfTheDay)}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-colors flex items-center justify-center gap-2 shadow-md"
              >
                <FileText className="w-4 h-4" /> Build Proposal
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Featured Research Categories (All 16 Categories) */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              Featured Research Categories
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Explore open access dissertations across 16 academic disciplines
            </p>
          </div>

          <button
            onClick={() => setActiveTab("search")}
            className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
          >
            All Categories <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {CATEGORIES_LIST.map((cat, idx) => (
            <div
              key={idx}
              onClick={() => {
                onSearchCategory(cat.name);
                setActiveTab("search");
              }}
              className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500/50 hover:shadow-md transition-all cursor-pointer group flex items-center gap-3"
            >
              <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform">
                {getCategoryIcon(cat.icon)}
              </div>
              <div className="overflow-hidden">
                <h3 className="font-bold text-xs text-slate-900 dark:text-white truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {cat.name}
                </h3>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">
                  {cat.count.toLocaleString()} theses
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Statistics Section */}
      <section className="p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white border border-slate-800 shadow-xl space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold">Global Academic Metrics</h2>
          <p className="text-xs text-slate-400">Indexed & verified across top research university repositories</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="space-y-1">
            <p className="text-3xl sm:text-4xl font-black text-indigo-400">48,200+</p>
            <p className="text-xs text-slate-300 font-semibold">Dissertations Indexed</p>
          </div>
          <div className="space-y-1">
            <p className="text-3xl sm:text-4xl font-black text-amber-400">1,250+</p>
            <p className="text-xs text-slate-300 font-semibold">Partner Universities</p>
          </div>
          <div className="space-y-1">
            <p className="text-3xl sm:text-4xl font-black text-emerald-400">92.4%</p>
            <p className="text-xs text-slate-300 font-semibold">Avg Novelty Precision</p>
          </div>
          <div className="space-y-1">
            <p className="text-3xl sm:text-4xl font-black text-violet-400">100%</p>
            <p className="text-xs text-slate-300 font-semibold">Open Access Metadata</p>
          </div>
        </div>
      </section>

      {/* Core Platform Capabilities Grid */}
      <section className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Comprehensive Academic Research Ecosystem
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-lg mx-auto">
            Built specifically for graduate students, researchers, and university faculties.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div
            onClick={() => setActiveTab("search")}
            className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500/50 transition-all cursor-pointer group shadow-sm"
          >
            <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white mb-2 flex items-center justify-between">
              Academic Search Engine
              <ArrowRight className="w-4 h-4 text-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity" />
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Full-text search across thousands of verified thesis records with DOI filters, university rankings, and novelty thresholds.
            </p>
          </div>

          <div
            onClick={() => setActiveTab("proposal")}
            className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500/50 transition-all cursor-pointer group shadow-sm"
          >
            <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white mb-2 flex items-center justify-between">
              AI Proposal Builder
              <ArrowRight className="w-4 h-4 text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Convert any research topic or gap into a structured 5-chapter research proposal with problem statements, questions, and APA references.
            </p>
          </div>

          <div
            onClick={() => setActiveTab("compare")}
            className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500/50 transition-all cursor-pointer group shadow-sm"
          >
            <div className="w-12 h-12 rounded-xl bg-violet-50 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <BarChart3 className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white mb-2 flex items-center justify-between">
              Paper Comparison Matrix
              <ArrowRight className="w-4 h-4 text-violet-500 opacity-0 group-hover:opacity-100 transition-opacity" />
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Side-by-side comparative analysis of methodologies, sample sizes, empirical findings, and literature research gaps.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Rare Hidden Gems Showcase */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-amber-500 uppercase tracking-wider flex items-center gap-1">
              <Flame className="w-3.5 h-3.5" /> High Novelty Gems
            </span>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              Featured Rare & Unresearched Topics
            </h2>
          </div>
          <button
            onClick={() => setActiveTab("rare")}
            className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
          >
            Discover More <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rareTheses.map((thesis) => (
            <ThesisCard
              key={thesis.id}
              thesis={thesis}
              isSaved={savedIds.has(thesis.id)}
              isCompared={comparedIds.has(thesis.id)}
              onToggleSave={onToggleSave}
              onToggleCompare={onToggleCompare}
              onSelectDetails={onSelectDetails}
              onBuildProposal={onBuildProposal}
              onCite={onCite}
            />
          ))}
        </div>
      </section>
    </div>
  );
};
