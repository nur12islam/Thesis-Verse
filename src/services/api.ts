import { Thesis, SearchFilters, SearchSuggestions, SearchAnalytics, ProposalRequest, ProposalResult, FullProposal, AiSearchInsights, SimplifiedAbstract, TranslationResult, RareThesisRecommendationCard, ResearchGapDashboardData, MultiAgentSearchResponse, RabbitSynthesisReport } from "../types/thesis";

export async function fetchRareDiscoveryCards(params: {
  domains?: string[];
  university?: string;
  focus?: string;
  degreeLevel?: string;
  difficulty?: string;
  count?: number;
  previousTitles?: string[];
  isRandom?: boolean;
}): Promise<{ cards: RareThesisRecommendationCard[]; modelUsed?: string }> {
  const res = await fetch("/api/ai/openrouter/rare-discovery", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });
  if (!res.ok) {
    throw new Error("Failed to discover rare thesis topics");
  }
  return res.json();
}

export async function fetchSimilarThesisCards(params: {
  thesisTitle: string;
  subject: string;
  researchProblem?: string;
  previousTitles?: string[];
}): Promise<{ cards: RareThesisRecommendationCard[]; modelUsed?: string }> {
  const res = await fetch("/api/ai/openrouter/generate-similar", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });
  if (!res.ok) {
    throw new Error("Failed to generate similar thesis recommendations");
  }
  return res.json();
}

export async function fetchResearchGaps(params: {
  subjects?: string[];
}): Promise<ResearchGapDashboardData> {
  const res = await fetch("/api/ai/openrouter/research-gaps", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });
  if (!res.ok) {
    throw new Error("Failed to perform research gap analysis");
  }
  return res.json();
}



export async function fetchTheses(filters: Partial<SearchFilters>): Promise<{
  total: number;
  page?: number;
  totalPages?: number;
  limit?: number;
  data: Thesis[];
}> {
  const queryParams = new URLSearchParams();

  if (filters.query) queryParams.set("q", filters.query);
  if (filters.documentType && filters.documentType !== "All") queryParams.set("type", filters.documentType);
  if (filters.subject && filters.subject !== "All") queryParams.set("subject", filters.subject);
  if (filters.degree && filters.degree !== "All") queryParams.set("degree", filters.degree);
  if (filters.university && filters.university !== "All") queryParams.set("university", filters.university);
  if (filters.publisher && filters.publisher !== "All") queryParams.set("publisher", filters.publisher);
  if (filters.country && filters.country !== "All") queryParams.set("country", filters.country);
  if (filters.language && filters.language !== "All") queryParams.set("language", filters.language);
  if (filters.author) queryParams.set("author", filters.author);
  if (filters.minYear) queryParams.set("minYear", filters.minYear.toString());
  if (filters.maxYear) queryParams.set("maxYear", filters.maxYear.toString());
  if (filters.minNoveltyScore) queryParams.set("minNoveltyScore", filters.minNoveltyScore.toString());
  if (filters.isOpenAccessOnly) queryParams.set("openAccess", "true");
  if (filters.hasPdfOnly) queryParams.set("hasPdf", "true");
  if (filters.sortBy) queryParams.set("sortBy", filters.sortBy);
  if (filters.page) queryParams.set("page", filters.page.toString());
  if (filters.limit) queryParams.set("limit", filters.limit.toString());

  const res = await fetch(`/api/search?${queryParams.toString()}`);
  if (!res.ok) {
    throw new Error("Failed to search theses");
  }
  return res.json();
}

export async function fetchResearchById(id: string): Promise<{ data: Thesis & { viewsCount?: number; savesCount?: number } }> {
  const res = await fetch(`/api/research/${id}`);
  if (!res.ok) {
    throw new Error("Failed to fetch research record");
  }
  return res.json();
}

export async function fetchSuggestions(query: string): Promise<SearchSuggestions> {
  const res = await fetch(`/api/suggestions?q=${encodeURIComponent(query)}`);
  if (!res.ok) {
    throw new Error("Failed to fetch search suggestions");
  }
  return res.json();
}

export async function fetchRelatedResearch(id: string): Promise<{ data: (Thesis & { similarityScore?: number; sharedKeywords?: string[] })[] }> {
  const res = await fetch(`/api/related?id=${encodeURIComponent(id)}`);
  if (!res.ok) {
    throw new Error("Failed to fetch related research");
  }
  return res.json();
}

export async function fetchSubjects(): Promise<{ data: { name: string; count: number; icon: string; color: string }[] }> {
  const res = await fetch("/api/subjects");
  if (!res.ok) {
    throw new Error("Failed to fetch subjects");
  }
  return res.json();
}

export async function fetchUniversities(): Promise<{ data: { name: string; country: string; count: number }[] }> {
  const res = await fetch("/api/universities");
  if (!res.ok) {
    throw new Error("Failed to fetch universities");
  }
  return res.json();
}

export async function fetchAuthors(): Promise<{ data: { name: string; count: number; subjects: string[] }[] }> {
  const res = await fetch("/api/authors");
  if (!res.ok) {
    throw new Error("Failed to fetch authors");
  }
  return res.json();
}

export async function fetchSavedResearch(): Promise<{ total: number; data: Thesis[] }> {
  const res = await fetch("/api/saved");
  if (!res.ok) {
    throw new Error("Failed to fetch saved research");
  }
  return res.json();
}

export async function saveResearch(id: string): Promise<{ success: boolean; savedIds: string[] }> {
  const res = await fetch("/api/save", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ researchId: id }),
  });
  if (!res.ok) {
    throw new Error("Failed to save research");
  }
  return res.json();
}

export async function unsaveResearch(id: string): Promise<{ success: boolean; savedIds: string[] }> {
  const res = await fetch(`/api/save/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    throw new Error("Failed to unsave research");
  }
  return res.json();
}

export async function fetchSearchAnalytics(): Promise<SearchAnalytics> {
  const res = await fetch("/api/analytics");
  if (!res.ok) {
    throw new Error("Failed to fetch search analytics");
  }
  return res.json();
}

export async function trackAnalyticsEvent(event: "search" | "view" | "save", payload: { query?: string; paperId?: string; subject?: string }) {
  await fetch("/api/analytics/track", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ event, ...payload }),
  });
}

export async function analyzeTopic(topic: string, subject?: string) {
  const res = await fetch("/api/ai/analyze-topic", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ topic, subject }),
  });
  if (!res.ok) {
    throw new Error("Failed to analyze topic");
  }
  return res.json();
}

export async function discoverRareThesis(options?: { domains?: string[]; focus?: string; degreeLevel?: string }): Promise<{ thesis: Thesis }> {
  const res = await fetch("/api/ai/rare-thesis", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(options || {}),
  });
  if (!res.ok) {
    throw new Error("Failed to discover rare thesis");
  }
  return res.json();
}

export async function generateProposal(request: ProposalRequest): Promise<{ proposal: ProposalResult; fullProposal?: FullProposal }> {
  const res = await fetch("/api/ai/generate-proposal", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  });
  if (!res.ok) {
    throw new Error("Failed to generate research proposal");
  }
  return res.json();
}

export async function sendCoachChatMessage(
  proposalContext: Partial<FullProposal>,
  userMessage: string,
  conversationHistory: { sender: string; text: string }[]
): Promise<{ text: string }> {
  const res = await fetch("/api/ai/proposal/coach-chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ proposalContext, userMessage, conversationHistory }),
  });
  if (!res.ok) {
    throw new Error("Failed to consult AI Research Coach");
  }
  return res.json();
}

export async function refineProposalSection(
  sectionName: string,
  currentText: string,
  instruction?: string,
  proposalTitle?: string
): Promise<{ refinedText: string; explanation: string }> {
  const res = await fetch("/api/ai/proposal/refine-section", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sectionName, currentText, instruction, proposalTitle }),
  });
  if (!res.ok) {
    throw new Error("Failed to refine section");
  }
  return res.json();
}

export async function comparePapers(papers: Thesis[]) {
  const res = await fetch("/api/ai/compare-papers", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ papers }),
  });
  if (!res.ok) {
    throw new Error("Failed to compare papers");
  }
  return res.json();
}

export async function sendAiChatMessage(
  messages: { sender: string; text: string }[],
  contextPaper?: Thesis,
  modelPreference?: "fast" | "reasoning"
): Promise<{ reply: string; modelUsed?: string }> {
  const res = await fetch("/api/ai/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages, contextPaper, modelPreference }),
  });
  if (!res.ok) {
    throw new Error("Failed to communicate with AI Chat");
  }
  return res.json();
}

export async function fetchAiSearchInsights(
  query: string,
  papers: Thesis[],
  isStudentMode?: boolean,
  modelPreference?: "fast" | "reasoning"
): Promise<AiSearchInsights> {
  const res = await fetch("/api/ai/openrouter/insights", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, papers, isStudentMode, modelPreference }),
  });
  if (!res.ok) {
    throw new Error("Failed to fetch AI search insights");
  }
  return res.json();
}

export async function simplifyAbstract(
  abstract: string,
  title?: string,
  isStudentMode?: boolean,
  modelPreference?: "fast" | "reasoning"
): Promise<SimplifiedAbstract> {
  const res = await fetch("/api/ai/openrouter/simplify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ abstract, title, isStudentMode, modelPreference }),
  });
  if (!res.ok) {
    throw new Error("Failed to simplify abstract");
  }
  return res.json();
}

export async function translateText(
  text: string,
  targetLanguage: string,
  textType?: "title" | "abstract" | "summary"
): Promise<TranslationResult> {
  const res = await fetch("/api/ai/openrouter/translate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, targetLanguage, textType }),
  });
  if (!res.ok) {
    throw new Error("Failed to translate text");
  }
  return res.json();
}

export async function generateLiteratureReview(params: {
  topic: string;
  papers?: Thesis[];
  userNotes?: string;
  modelPreference?: "fast" | "reasoning";
}): Promise<{
  review: {
    introduction: string;
    currentResearch: string;
    researchTrends: string;
    agreements: string;
    disagreements: string;
    researchGaps: string;
    futureDirections: string;
    references: string[];
  };
  modelUsed?: string;
}> {
  const res = await fetch("/api/ai/literature-review", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });
  if (!res.ok) {
    throw new Error("Failed to generate literature review");
  }
  return res.json();
}

export async function processAcademicWriting(params: {
  text: string;
  action: "grammar" | "tone" | "rewrite" | "shorten" | "expand";
  modelPreference?: "fast" | "reasoning";
}): Promise<{
  originalText: string;
  improvedText: string;
  changesSummary: string;
  wordCountDelta: number;
  modelUsed?: string;
}> {
  const res = await fetch("/api/ai/writing-assistant", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });
  if (!res.ok) {
    throw new Error("Failed to process text with Academic Writing Assistant");
  }
  return res.json();
}

export async function analyzeUploadedDocument(params: {
  filename: string;
  content: string;
  action: "summarize" | "explain" | "keywords" | "improvements" | "missing_sections" | "questions";
}): Promise<{
  result: string;
  keywords?: string[];
  questions?: string[];
  missingSections?: string[];
  modelUsed?: string;
}> {
  const res = await fetch("/api/ai/document-assistant", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });
  if (!res.ok) {
    throw new Error("Failed to analyze uploaded document");
  }
  return res.json();
}

export async function checkOriginalityAndDuplicates(params: {
  proposalText: string;
  targetTitle?: string;
}): Promise<{
  originalityScore: number;
  overlapPercentage: number;
  flaggedSections: {
    text: string;
    similarity: number;
    sourceMatch: string;
    recommendation: string;
  }[];
  recommendations: string[];
  modelUsed?: string;
}> {
  const res = await fetch("/api/ai/duplicate-check", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });
  if (!res.ok) {
    throw new Error("Failed to perform originality check");
  }
  return res.json();
}

export async function fetchResearchAdvisorRecommendations(params: {
  currentTitle?: string;
  currentObjectives?: string[];
  subject?: string;
}): Promise<{
  suggestedTitles: string[];
  improvedObjectives: string[];
  alternativeMethodologies: string[];
  additionalKeywords: string[];
  potentialSupervisors: { name: string; institution: string; matchReason: string }[];
  relatedDisciplines: string[];
  riskFactors: string[];
  futureExtensions: string[];
  modelUsed?: string;
}> {
  const res = await fetch("/api/ai/research-advisor", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });
  if (!res.ok) {
    throw new Error("Failed to fetch research advisor recommendations");
  }
  return res.json();
}

export async function fetchMultiAgentSearch(
  query: string,
  papers: Thesis[] = []
): Promise<MultiAgentSearchResponse> {
  const res = await fetch("/api/ai/multi-agent-search", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, papers }),
  });
  if (!res.ok) {
    throw new Error("Failed to execute multi-agent AI search");
  }
  return res.json();
}

export async function fetchRabbitSynthesis(params: {
  seedTitles: string[];
  relatedTitles: string[];
  subject?: string;
}): Promise<RabbitSynthesisReport & { modelUsed?: string }> {
  const res = await fetch("/api/ai/rabbit/synthesis", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });
  if (!res.ok) {
    throw new Error("Failed to fetch literature universe synthesis");
  }
  return res.json();
}


