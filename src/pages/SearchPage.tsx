import React, { useState, useEffect, useRef } from "react";
import { Thesis, SearchFilters, SearchSuggestions, SearchAnalytics, AiSearchInsights, MultiAgentSearchResponse } from "../types/thesis";
import { fetchTheses, fetchSuggestions, fetchSearchAnalytics, fetchAiSearchInsights, fetchMultiAgentSearch } from "../services/api";
import { ThesisCard } from "../components/ThesisCard";
import { AiInsightsSection } from "../components/AiInsightsSection";
import { MultiAgentSearchPanel } from "../components/MultiAgentSearchPanel";

import {
  Search,
  SlidersHorizontal,
  RotateCcw,
  Sparkles,
  LayoutGrid,
  List,
  Loader2,
  GraduationCap,
  Filter,
  CheckCircle2,
  Globe,
  Clock,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  BarChart3,
  X,
  FileText,
  Bookmark,
  Building,
  User,
  Hash
} from "lucide-react";

interface SearchPageProps {
  initialQuery?: string;
  savedIds: Set<string>;
  comparedIds: Set<string>;
  onToggleSave: (thesis: Thesis) => void;
  onToggleCompare: (thesis: Thesis) => void;
  onSelectDetails: (thesis: Thesis) => void;
  onBuildProposal: (thesis: Thesis) => void;
  onCite: (thesis: Thesis) => void;
  onShowToast: (title: string, message?: string, type?: "success" | "error" | "info") => void;
}

export const SearchPage: React.FC<SearchPageProps> = ({
  initialQuery = "",
  savedIds,
  comparedIds,
  onToggleSave,
  onToggleCompare,
  onSelectDetails,
  onBuildProposal,
  onCite,
  onShowToast,
}) => {
  const [filters, setFilters] = useState<SearchFilters>({
    query: initialQuery,
    subject: "All",
    degree: "All",
    university: "",
    country: "All",
    language: "All",
    documentType: "All",
    publisher: "All",
    author: "",
    isOpenAccessOnly: false,
    hasPdfOnly: false,
    minYear: 2020,
    maxYear: 2026,
    minNoveltyScore: 0,
    sortBy: "relevance",
    page: 1,
    limit: 9,
  });

  const [results, setResults] = useState<Thesis[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [filtersVisible, setFiltersVisible] = useState(true);

  // Auto Suggestions state
  const [suggestions, setSuggestions] = useState<SearchSuggestions | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Analytics Modal state
  const [analyticsData, setAnalyticsData] = useState<SearchAnalytics | null>(null);
  const [showAnalyticsModal, setShowAnalyticsModal] = useState(false);
  const [loadingAnalytics, setLoadingAnalytics] = useState(false);

  // Sync initial query
  useEffect(() => {
    if (initialQuery !== undefined) {
      setFilters((prev) => ({ ...prev, query: initialQuery, page: 1 }));
    }
  }, [initialQuery]);

  // Click outside suggestions dropdown listener
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch suggestions when query changes (debounced)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (filters.query.trim().length > 0) {
        setLoadingSuggestions(true);
        fetchSuggestions(filters.query.trim())
          .then((res) => {
            setSuggestions(res);
            setShowSuggestions(true);
          })
          .catch((err) => console.error("Suggestions error:", err))
          .finally(() => setLoadingSuggestions(false));
      } else {
        setSuggestions(null);
        setShowSuggestions(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [filters.query]);

  // AI Search Insights State
  const [aiInsights, setAiInsights] = useState<AiSearchInsights | null>(null);
  const [loadingInsights, setLoadingInsights] = useState(false);
  const [isStudentMode, setIsStudentMode] = useState(false);
  const [aiModelPreference, setAiModelPreference] = useState<"fast" | "reasoning">("fast");

  // Multi-Agent Search State
  const [multiAgentData, setMultiAgentData] = useState<MultiAgentSearchResponse | null>(null);
  const [loadingMultiAgent, setLoadingMultiAgent] = useState(false);
  const [selectedAgentFilter, setSelectedAgentFilter] = useState<string>("all");

  const handleRunMultiAgentSearch = async (paperList?: Thesis[]) => {
    const targetList = paperList || results;
    setLoadingMultiAgent(true);
    try {
      const data = await fetchMultiAgentSearch(filters.query, targetList);
      setMultiAgentData(data);
      onShowToast(
        "Multi-Agent AI Analysis Complete",
        `5 AI models (Llama 3.3, DeepSeek R1, Qwen 2.5, Mistral, Gemini) reached ${data.consensusScore}% consensus on search results.`,
        "success"
      );
    } catch (err: any) {
      console.error("Multi-agent search failed:", err);
      onShowToast("Multi-Agent Search Warning", "Using multi-model fallback analytical mapping.", "info");
    } finally {
      setLoadingMultiAgent(false);
    }
  };

  // Fetch AI Search Insights
  const loadAiInsights = async (currentQuery: string, paperResults: Thesis[], studentMode: boolean, modelPref: "fast" | "reasoning") => {
    if (paperResults.length === 0) {
      setAiInsights(null);
      return;
    }

    setLoadingInsights(true);
    try {
      const data = await fetchAiSearchInsights(currentQuery, paperResults, studentMode, modelPref);
      setAiInsights(data);
    } catch (err) {
      console.error("Failed to load AI Insights", err);
    } finally {
      setLoadingInsights(false);
    }
  };

  // Execute search
  const performSearch = async (overridePage?: number) => {
    setLoading(true);
    setShowSuggestions(false);
    const targetPage = overridePage ?? filters.page ?? 1;

    try {
      const res = await fetchTheses({
        ...filters,
        page: targetPage,
      });
      setResults(res.data);
      setTotalCount(res.total);
      setTotalPages(res.totalPages || Math.ceil(res.total / (filters.limit || 9)) || 1);

      // Load AI Insights for search results
      loadAiInsights(filters.query, res.data, isStudentMode, aiModelPreference);
      // Automatically trigger multi-agent analysis for search results
      handleRunMultiAgentSearch(res.data);
    } catch (err: any) {
      onShowToast("Search Failed", err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStudentMode = (enabled: boolean) => {
    setIsStudentMode(enabled);
    if (results.length > 0) {
      loadAiInsights(filters.query, results, enabled, aiModelPreference);
    }
  };

  const handleChangeAiModel = (model: "fast" | "reasoning") => {
    setAiModelPreference(model);
    if (results.length > 0) {
      loadAiInsights(filters.query, results, isStudentMode, model);
    }
  };

  const handleSelectTopicChip = (topic: string) => {
    setFilters({ ...filters, query: topic, page: 1 });
    // performSearch will be called via state trigger or manually
  };


  useEffect(() => {
    performSearch();
  }, [
    filters.subject,
    filters.degree,
    filters.university,
    filters.country,
    filters.documentType,
    filters.publisher,
    filters.isOpenAccessOnly,
    filters.hasPdfOnly,
    filters.sortBy,
    filters.minNoveltyScore,
    filters.page
  ]);

  const handleResetFilters = () => {
    setFilters({
      query: "",
      subject: "All",
      degree: "All",
      university: "",
      country: "All",
      language: "All",
      documentType: "All",
      publisher: "All",
      author: "",
      isOpenAccessOnly: false,
      hasPdfOnly: false,
      minYear: 2020,
      maxYear: 2026,
      minNoveltyScore: 0,
      sortBy: "relevance",
      page: 1,
      limit: 9,
    });
  };

  const handleOpenAnalytics = async () => {
    setShowAnalyticsModal(true);
    setLoadingAnalytics(true);
    try {
      const data = await fetchSearchAnalytics();
      setAnalyticsData(data);
    } catch (err: any) {
      onShowToast("Analytics Error", err.message, "error");
    } finally {
      setLoadingAnalytics(false);
    }
  };

  const SUBJECTS: string[] = [
    "All",
    "English Literature",
    "Linguistics",
    "History",
    "Philosophy",
    "Political Science",
    "Education",
    "Sociology",
    "Law",
    "Computer Science",
    "Artificial Intelligence",
    "Economics",
    "Medical Science",
    "Psychology",
    "Environmental Science",
    "Business",
    "Mathematics",
    "Quantum Computing",
    "Bio-Engineering & Genomics",
    "Climate & Sustainability",
    "Cybersecurity & Cryptography",
    "Astrophysics & Space Systems",
  ];

  const DEGREES: string[] = ["All", "Bachelor's", "Master's", "Ph.D.", "Postdoctoral"];
  const COUNTRIES: string[] = ["All", "United States", "United Kingdom", "Switzerland", "Germany", "France", "Singapore", "India", "Japan", "China", "Canada", "Australia"];
  const DOC_TYPES: string[] = ["All", "Thesis", "Dissertation", "Journal Article", "Conference Paper", "Review Article", "Research Paper", "Technical Report"];
  const UNIVERSITIES: string[] = [
    "All Universities",
    "Massachusetts Institute of Technology",
    "Stanford University",
    "University of Oxford",
    "University of Cambridge",
    "ETH Zürich",
    "Harvard University",
    "University of California, Berkeley",
    "Imperial College London",
    "University of Tokyo",
    "National University of Singapore",
    "Tsinghua University",
    "University of Edinburgh",
    "California Institute of Technology",
    "Princeton University",
    "Carnegie Mellon University",
    "Columbia University",
    "University of Toronto",
    "Heidelberg University",
    "TU Delft",
    "University of Melbourne",
    "Johns Hopkins University",
    "Yale University",
    "Cornell University",
    "University of Chicago"
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Search className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
            Academic Research Search Engine
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Explore verified open-access dissertations, research gaps, DOIs, and citation metrics across world institutions.
          </p>
        </div>

        <button
          onClick={handleOpenAnalytics}
          className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center gap-2 transition-colors self-start sm:self-auto border border-slate-200 dark:border-slate-700"
        >
          <BarChart3 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          Search Analytics & Metrics
        </button>
      </div>

      {/* Main Search Bar Card */}
      <div className="p-4 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 relative">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1" ref={suggestionsRef}>
            <input
              type="text"
              value={filters.query}
              onChange={(e) => setFilters({ ...filters, query: e.target.value, page: 1 })}
              onFocus={() => filters.query.trim().length > 0 && setShowSuggestions(true)}
              onKeyDown={(e) => e.key === "Enter" && performSearch(1)}
              placeholder="Search title, keywords, authors, DOIs, or university..."
              className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />

            {/* Real-Time Auto-Suggestions Dropdown */}
            {showSuggestions && suggestions && (
              <div className="absolute top-full left-0 right-0 mt-2 z-30 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl overflow-hidden text-xs max-h-[380px] overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800 animate-in fade-in duration-150">
                {/* Titles */}
                {suggestions.titles.length > 0 && (
                  <div className="p-2">
                    <span className="font-bold uppercase text-[10px] text-slate-400 px-2 block mb-1">
                      Matching Papers / Dissertations
                    </span>
                    {suggestions.titles.map((t) => (
                      <button
                        key={t.id}
                        onClick={() => {
                          setFilters({ ...filters, query: t.title, page: 1 });
                          performSearch(1);
                        }}
                        className="w-full text-left px-2 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 flex items-center justify-between gap-2"
                      >
                        <span className="font-medium line-clamp-1">{t.title}</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 shrink-0">
                          {t.type}
                        </span>
                      </button>
                    ))}
                  </div>
                )}

                {/* Keywords */}
                {suggestions.keywords.length > 0 && (
                  <div className="p-2">
                    <span className="font-bold uppercase text-[10px] text-slate-400 px-2 block mb-1 flex items-center gap-1">
                      <Hash className="w-3 h-3 text-indigo-500" /> Matching Keywords
                    </span>
                    <div className="flex flex-wrap gap-1.5 px-2">
                      {suggestions.keywords.map((kw, i) => (
                        <button
                          key={i}
                          onClick={() => {
                            setFilters({ ...filters, query: kw, page: 1 });
                            performSearch(1);
                          }}
                          className="px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950 text-slate-700 dark:text-slate-300 hover:text-indigo-600 transition-colors"
                        >
                          #{kw}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Authors & Universities */}
                {(suggestions.authors.length > 0 || suggestions.universities.length > 0) && (
                  <div className="p-2 grid grid-cols-2 gap-2">
                    {suggestions.authors.length > 0 && (
                      <div>
                        <span className="font-bold uppercase text-[10px] text-slate-400 px-2 block mb-1 flex items-center gap-1">
                          <User className="w-3 h-3 text-indigo-500" /> Authors
                        </span>
                        {suggestions.authors.map((a, i) => (
                          <button
                            key={i}
                            onClick={() => {
                              setFilters({ ...filters, query: a, page: 1 });
                              performSearch(1);
                            }}
                            className="w-full text-left px-2 py-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 truncate"
                          >
                            {a}
                          </button>
                        ))}
                      </div>
                    )}

                    {suggestions.universities.length > 0 && (
                      <div>
                        <span className="font-bold uppercase text-[10px] text-slate-400 px-2 block mb-1 flex items-center gap-1">
                          <Building className="w-3 h-3 text-indigo-500" /> Institutions
                        </span>
                        {suggestions.universities.map((u, i) => (
                          <button
                            key={i}
                            onClick={() => {
                              setFilters({ ...filters, query: u, page: 1 });
                              performSearch(1);
                            }}
                            className="w-full text-left px-2 py-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 truncate"
                          >
                            {u}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Popular Searches */}
                {suggestions.popular.length > 0 && (
                  <div className="p-2 bg-slate-50/50 dark:bg-slate-950/50">
                    <span className="font-bold uppercase text-[10px] text-slate-400 px-2 block mb-1 flex items-center gap-1">
                      <TrendingUp className="w-3 h-3 text-amber-500" /> Popular Research Topics
                    </span>
                    <div className="flex flex-wrap gap-1 px-2">
                      {suggestions.popular.map((pop, i) => (
                        <button
                          key={i}
                          onClick={() => {
                            setFilters({ ...filters, query: pop, page: 1 });
                            performSearch(1);
                          }}
                          className="px-2 py-0.5 rounded text-[11px] bg-amber-500/10 text-amber-700 dark:text-amber-400 hover:bg-amber-500/20"
                        >
                          {pop}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <button
            onClick={() => performSearch(1)}
            className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm transition-colors flex items-center justify-center gap-1.5"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            Search Papers
          </button>

          <button
            onClick={() => setFiltersVisible(!filtersVisible)}
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold border transition-colors flex items-center justify-center gap-1.5 ${
              filtersVisible
                ? "bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800"
                : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700"
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" /> Filter Options
          </button>
        </div>

        {/* Collapsible Filter Panel */}
        {filtersVisible && (
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            {/* University Dropdown */}
            <div>
              <label className="block font-bold text-slate-500 uppercase mb-1 text-[10px]">University Repository</label>
              <select
                value={filters.university || ""}
                onChange={(e) => setFilters({ ...filters, university: e.target.value === "All Universities" ? "" : e.target.value, page: 1 })}
                className="w-full p-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200"
              >
                {UNIVERSITIES.map((u) => (
                  <option key={u} value={u === "All Universities" ? "" : u}>
                    {u}
                  </option>
                ))}
              </select>
            </div>

            {/* Subject Dropdown */}
            <div>
              <label className="block font-bold text-slate-500 uppercase mb-1 text-[10px]">Academic Subject</label>
              <select
                value={filters.subject}
                onChange={(e) => setFilters({ ...filters, subject: e.target.value, page: 1 })}
                className="w-full p-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200"
              >
                {SUBJECTS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            {/* Degree Dropdown */}
            <div>
              <label className="block font-bold text-slate-500 uppercase mb-1 text-[10px]">Degree Level</label>
              <select
                value={filters.degree}
                onChange={(e) => setFilters({ ...filters, degree: e.target.value, page: 1 })}
                className="w-full p-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200"
              >
                {DEGREES.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            {/* Country Dropdown */}
            <div>
              <label className="block font-bold text-slate-500 uppercase mb-1 text-[10px]">Country / Jurisdiction</label>
              <select
                value={filters.country || "All"}
                onChange={(e) => setFilters({ ...filters, country: e.target.value, page: 1 })}
                className="w-full p-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200"
              >
                {COUNTRIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Document Type Dropdown */}
            <div>
              <label className="block font-bold text-slate-500 uppercase mb-1 text-[10px]">Document Type</label>
              <select
                value={filters.documentType || "All"}
                onChange={(e) => setFilters({ ...filters, documentType: e.target.value, page: 1 })}
                className="w-full p-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200"
              >
                {DOC_TYPES.map((dt) => (
                  <option key={dt} value={dt}>
                    {dt}
                  </option>
                ))}
              </select>
            </div>

            {/* Min Novelty Slider */}
            <div>
              <div className="flex justify-between font-bold text-slate-500 uppercase mb-1 text-[10px]">
                <span>Min Novelty Score</span>
                <span className="text-indigo-600 dark:text-indigo-400">{filters.minNoveltyScore}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="95"
                step="5"
                value={filters.minNoveltyScore}
                onChange={(e) => setFilters({ ...filters, minNoveltyScore: Number(e.target.value), page: 1 })}
                className="w-full accent-indigo-600 cursor-pointer"
              />
            </div>

            {/* Sort Order */}
            <div>
              <label className="block font-bold text-slate-500 uppercase mb-1 text-[10px]">Sort Results By</label>
              <select
                value={filters.sortBy}
                onChange={(e) => setFilters({ ...filters, sortBy: e.target.value as any, page: 1 })}
                className="w-full p-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 font-semibold"
              >
                <option value="relevance">Relevance</option>
                <option value="novelty">Highest Novelty Score</option>
                <option value="citations">Most Cited Papers</option>
                <option value="year">Newest Publication Year</option>
                <option value="oldest">Oldest Publication Year</option>
                <option value="alphabetical">Alphabetical (Title)</option>
                <option value="difficulty">Highest Difficulty</option>
              </select>
            </div>

            {/* Open Access & PDF Checkboxes */}
            <div className="space-y-2 pt-2">
              <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-700 dark:text-slate-300 text-xs">
                <input
                  type="checkbox"
                  checked={filters.isOpenAccessOnly || false}
                  onChange={(e) => setFilters({ ...filters, isOpenAccessOnly: e.target.checked, page: 1 })}
                  className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
                />
                Open Access Papers Only
              </label>

              <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-700 dark:text-slate-300 text-xs">
                <input
                  type="checkbox"
                  checked={filters.hasPdfOnly || false}
                  onChange={(e) => setFilters({ ...filters, hasPdfOnly: e.target.checked, page: 1 })}
                  className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
                />
                Full PDF Available Only
              </label>
            </div>

            {/* Reset Button */}
            <div className="flex items-center justify-end pt-4">
              <button
                onClick={handleResetFilters}
                className="text-xs text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 flex items-center gap-1 font-semibold"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Reset All Filters
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Multi-Agent AI Search Hub */}
      <MultiAgentSearchPanel
        multiAgentData={multiAgentData}
        loading={loadingMultiAgent}
        query={filters.query}
        onRunMultiAgentSearch={() => handleRunMultiAgentSearch()}
        selectedAgentFilter={selectedAgentFilter}
        onSelectAgentFilter={setSelectedAgentFilter}
      />

      {/* OpenRouter AI Insights Section */}
      {(aiInsights || loadingInsights) && (
        <AiInsightsSection
          insights={aiInsights}
          loading={loadingInsights}
          isStudentMode={isStudentMode}
          onToggleStudentMode={handleToggleStudentMode}
          selectedModel={aiModelPreference}
          onChangeModel={handleChangeAiModel}
          onSelectTopicChip={handleSelectTopicChip}
          query={filters.query}
        />
      )}

      {/* Results Toolbar */}
      <div className="flex items-center justify-between text-xs text-slate-500">

        <p className="font-semibold text-slate-700 dark:text-slate-300">
          Showing <span className="text-indigo-600 dark:text-indigo-400 font-bold">
            {selectedAgentFilter !== "all" && multiAgentData?.agents.find((a) => a.agentId === selectedAgentFilter)
              ? results.filter((p) => multiAgentData.agents.find((a) => a.agentId === selectedAgentFilter)?.recommendedPaperIds.includes(p.id)).length || results.length
              : results.length}
          </span> of {totalCount} research records
          {selectedAgentFilter !== "all" && (
            <span className="ml-2 px-2 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold text-[10px]">
              Filtered by {multiAgentData?.agents.find((a) => a.agentId === selectedAgentFilter)?.modelName}
            </span>
          )}
        </p>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode("grid")}
            className={`p-1.5 rounded-lg border transition-colors ${
              viewMode === "grid"
                ? "bg-indigo-600 text-white border-indigo-600"
                : "bg-slate-100 dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700"
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`p-1.5 rounded-lg border transition-colors ${
              viewMode === "list"
                ? "bg-indigo-600 text-white border-indigo-600"
                : "bg-slate-100 dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700"
            }`}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Results List */}
      {loading ? (
        <div className="py-16 text-center text-slate-400 flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
          <p className="text-xs font-semibold">Filtering academic database & calculating multi-agent relevance scores...</p>
        </div>
      ) : results.length === 0 ? (
        <div className="py-16 text-center text-slate-400 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
          <Search className="w-8 h-8 mx-auto text-slate-300" />
          <p className="font-bold text-slate-700 dark:text-slate-200">No matching research records found</p>
          <p className="text-xs">Try broadening your search term or resetting specific filter criteria.</p>
          <button
            onClick={handleResetFilters}
            className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs inline-block"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              : "space-y-4"
          }
        >
          {(() => {
            const agentObj = multiAgentData?.agents.find((a) => a.agentId === selectedAgentFilter);
            const filteredList = selectedAgentFilter !== "all" && agentObj
              ? results.filter((p) => agentObj.recommendedPaperIds.includes(p.id))
              : results;

            const finalRenderList = filteredList.length > 0 ? filteredList : results;

            return finalRenderList.map((thesis) => (
              <ThesisCard
                key={thesis.id}
                thesis={thesis}
                isSaved={savedIds.has(thesis.id)}
                isCompared={comparedIds.has(thesis.id)}
                agentEndorsements={multiAgentData?.paperEndorsements?.[thesis.id] || []}
                onToggleSave={onToggleSave}
                onToggleCompare={onToggleCompare}
                onSelectDetails={onSelectDetails}
                onBuildProposal={onBuildProposal}
                onCite={onCite}
              />
            ));
          })()}
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-6">
          <button
            disabled={filters.page === 1}
            onClick={() => setFilters({ ...filters, page: (filters.page || 1) - 1 })}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 disabled:opacity-40 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-200 dark:hover:bg-slate-700"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setFilters({ ...filters, page: p })}
              className={`w-8 h-8 rounded-xl font-bold text-xs transition-colors ${
                filters.page === p
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
            >
              {p}
            </button>
          ))}

          <button
            disabled={filters.page === totalPages}
            onClick={() => setFilters({ ...filters, page: (filters.page || 1) + 1 })}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 disabled:opacity-40 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-200 dark:hover:bg-slate-700"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Search Analytics Modal */}
      {showAnalyticsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <h3 className="font-extrabold text-slate-900 dark:text-white text-lg">
                  Search Engine Analytics & Insights
                </h3>
              </div>
              <button
                onClick={() => setShowAnalyticsModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {loadingAnalytics ? (
              <div className="py-12 text-center text-slate-400 flex items-center justify-center gap-2 text-xs">
                <Loader2 className="w-4 h-4 animate-spin text-indigo-600" /> Loading search telemetry...
              </div>
            ) : analyticsData ? (
              <div className="space-y-6 text-xs">
                {/* Metrics Summary Header */}
                <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/40 border border-indigo-200/60 dark:border-indigo-800/40">
                  <div>
                    <span className="text-slate-500 dark:text-slate-400 block mb-1">Total Executed Searches</span>
                    <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400">{analyticsData.totalSearches}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 dark:text-slate-400 block mb-1">Indexed Research Papers</span>
                    <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{totalCount || 18}</span>
                  </div>
                </div>

                {/* Popular Topics */}
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-xs uppercase mb-2">
                    Top Popular Search Queries
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {analyticsData.popularTopics.map((pt, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold flex items-center gap-1.5"
                      >
                        <span>{pt.topic}</span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-indigo-600 text-white font-bold">
                          {pt.count}
                        </span>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Frequently Viewed */}
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-xs uppercase mb-2">
                    Most Viewed Dissertations
                  </h4>
                  <div className="space-y-1.5">
                    {analyticsData.frequentlyViewed.map((fv) => (
                      <div
                        key={fv.id}
                        className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between"
                      >
                        <span className="font-semibold text-slate-800 dark:text-slate-200 truncate pr-4">{fv.title}</span>
                        <span className="font-bold text-indigo-600 dark:text-indigo-400 shrink-0">{fv.views} views</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
};
