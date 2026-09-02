export type DegreeLevel = "Bachelor's" | "Master's" | "Ph.D." | "Postdoctoral" | "Honor Thesis";

export type AcademicSubject = 
  | "Computer Science"
  | "Artificial Intelligence"
  | "English Literature"
  | "Linguistics"
  | "History"
  | "Political Science"
  | "Economics"
  | "Education"
  | "Medical Science"
  | "Psychology"
  | "Sociology"
  | "Philosophy"
  | "Law"
  | "Environmental Science"
  | "Business"
  | "Mathematics"
  | "Quantum Computing"
  | "Bio-Engineering & Genomics"
  | "Climate & Sustainability"
  | "Applied Economics & Finance"
  | "Neuroscience & Cognitive AI"
  | "Cybersecurity & Cryptography"
  | "Robotics & Autonomous Systems"
  | "Materials Science"
  | "Astrophysics & Space Systems";

export type DocumentType = 
  | "Thesis" 
  | "Dissertation" 
  | "Journal Article" 
  | "Conference Paper" 
  | "Review Article" 
  | "Research Paper" 
  | "Technical Report";

export interface Thesis {
  id: string;
  title: string;
  authors: string[];
  university: string;
  publisher: string;
  year: number;
  abstract: string;
  keywords: string[];
  subject: AcademicSubject;
  degree: DegreeLevel;
  doi: string;
  sourceUrl: string;
  pdfUrl?: string;
  language: string;
  country?: string;
  license?: string;
  isOpenAccess?: boolean;
  documentType?: DocumentType;
  citationsCount: number;
  noveltyScore: number; // 0-100%
  difficultyScore: number; // 0-100%
  confidenceScore: number; // 0-100%
  researchGap: string;
  futureDirections: string[];
  methodology: string;
  keyFindings: string[];
  sampleSize?: string;
  limitations?: string;
  bibtex: string;
  isRare?: boolean;
  crossDisciplinaryTags?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface SearchFilters {
  query: string;
  subject: string;
  degree: string;
  university: string;
  country?: string;
  language?: string;
  documentType?: string;
  publisher?: string;
  author?: string;
  isOpenAccessOnly?: boolean;
  hasPdfOnly?: boolean;
  minYear: number;
  maxYear: number;
  minNoveltyScore: number;
  sortBy: "relevance" | "novelty" | "citations" | "year" | "oldest" | "alphabetical" | "difficulty";
  page?: number;
  limit?: number;
}

export interface SearchSuggestions {
  recent: string[];
  popular: string[];
  topics: string[];
  titles: { id: string; title: string; type: string }[];
  keywords: string[];
  authors: string[];
  universities: string[];
}

export interface SearchAnalytics {
  totalSearches: number;
  popularTopics: { topic: string; count: number }[];
  trendingSubjects: { subject: string; count: number }[];
  frequentlyViewed: { id: string; title: string; views: number }[];
  mostSaved: { id: string; title: string; saves: number }[];
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: string;
  universityAffiliation?: string;
  researchBranch?: string;
  bio?: string;
  orcid?: string;
  savedCount: number;
  theme: "dark" | "light";
  citationFormatPreference: "APA" | "MLA" | "Chicago" | "BibTeX";
}

export interface SearchHistoryItem {
  id: string;
  query: string;
  subject: string;
  timestamp: string;
  resultsCount: number;
}

export interface ProposalRequest {
  topic: string;
  degree: DegreeLevel;
  targetUniversity?: string;
  subject: AcademicSubject;
  methodologyType: string;
  specialFocus?: string;
  templateType?: "Bachelor's" | "Master's" | "MPhil" | "Ph.D.";
}

export interface ProposalBackground {
  context: string;
  importance: string;
  existingWork: string;
  motivation: string;
}

export interface ProposalProblemStatement {
  whatProblemExists: string;
  whyItMatters: string;
  whatIsMissing: string;
}

export interface ProposalObjectives {
  primaryObjective: string;
  secondaryObjectives: string[];
  expectedOutcomes: string[];
}

export interface ProposalQuestions {
  mainQuestion: string;
  subQuestions: string[];
  hypothesis?: string;
}

export interface ProposalScope {
  includedTopics: string[];
  excludedTopics: string[];
  limitations: string[];
  assumptions: string[];
}

export interface ProposalMethodology {
  methodType: "Qualitative" | "Quantitative" | "Mixed Methods" | "Survey" | "Case Study" | "Experimental" | "Comparative Analysis" | "Literature Review" | string;
  description: string;
  justification: string;
  dataSources?: string[];
  analyticalTools?: string[];
}

export interface ProposalChapter {
  chapter: number;
  title: string;
  description: string;
}

export interface ProposalContribution {
  academicContribution: string;
  practicalContribution: string;
  futureOpportunities: string;
}

export interface ProposalKeywords {
  primary: string[];
  secondary: string[];
  researchTags: string[];
}

export interface ProposalQualityScore {
  overallScore: number;
  breakdown: {
    titleQuality: number;
    novelty: number;
    clarity: number;
    researchScope: number;
    methodologyFit: number;
    objectivesClarity: number;
    writingQuality: number;
  };
  improvementSuggestions: string[];
}

export interface ProposalFeasibility {
  difficulty: "Beginner Friendly" | "Moderate" | "High Challenge" | "Very High / Frontier";
  estimatedTimeMonths: number;
  dataAvailability: "High" | "Moderate" | "Sparse / Hard to Obtain";
  researchComplexity: "Low" | "Medium" | "High" | "Extreme";
  recommendedDegree: DegreeLevel;
}

export interface ProposalTimelinePhase {
  id: string;
  phase: string;
  durationWeeks: number;
  tasks: string[];
  completed: boolean;
}

export interface ProposalVersion {
  versionId: string;
  timestamp: string;
  title: string;
  summaryOfChanges: string;
  snapshotData: any;
}

export interface FullProposal {
  id: string;
  title: string;
  originalTopic: string;
  degree: DegreeLevel;
  subject: AcademicSubject;
  targetUniversity?: string;
  templateType: "Bachelor's" | "Master's" | "MPhil" | "Ph.D.";
  
  // 10 Core Proposal Sections
  background: ProposalBackground;
  problemStatement: ProposalProblemStatement;
  objectives: ProposalObjectives;
  questions: ProposalQuestions;
  scope: ProposalScope;
  methodology: ProposalMethodology;
  chapterOutline: ProposalChapter[];
  expectedContribution: ProposalContribution;
  keywords: ProposalKeywords;
  supportingLiterature: SupportingResearchItem[];

  // Analysis & Tracking
  qualityScore: ProposalQualityScore;
  feasibilityAnalysis: ProposalFeasibility;
  timeline: ProposalTimelinePhase[];

  // Workspace & History
  folderName?: string;
  isArchived?: boolean;
  versionHistory: ProposalVersion[];
  createdAt: string;
  updatedAt: string;
}

export interface ProposalResult {
  title: string;
  executiveSummary: string;
  problemStatement: string;
  researchGap: string;
  researchQuestions: string[];
  objectives: string[];
  methodologicalFramework: string;
  chapterOutline: { chapter: number; title: string; description: string }[];
  expectedSignificance: string;
  suggestedReferences: string[];
  fullProposal?: FullProposal;
}

export interface PaperComparison {
  thesisId: string;
  title: string;
  methodology: string;
  sampleSize: string;
  keyFindings: string[];
  limitations: string;
  researchGap: string;
  noveltyScore: number;
  citationsCount: number;
}

export interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: string;
  suggestedQuestions?: string[];
}

export interface SavedCollection {
  id: string;
  name: string;
  description: string;
  paperIds: string[];
  createdAt: string;
}

export interface AiSearchInsights {
  searchSummary: string;
  majorThemes: string[];
  frequentlyStudiedAreas: string[];
  emergingAreas: string[];
  commonResearchMethods: string[];
  suggestedRelatedTopics: string[];
  topicRefinements: string[];
  beginnerExplanation?: {
    overview: string;
    importance: string;
    keyTerminology: { term: string; definition: string }[];
    startingPoints: string[];
  };
  keywords: {
    primary: string[];
    secondary: string[];
    relatedConcepts: string[];
    researchDomains: string[];
  };
  modelUsed?: string;
}

export interface AgentSearchResult {
  agentId: string;
  agentName: string;
  modelName: string;
  badgeColor: string;
  status: "idle" | "running" | "completed" | "failed";
  executionTimeMs?: number;
  perspectiveSummary: string;
  recommendedPaperIds: string[];
  keyInsights: string[];
  suggestedGap: string;
  confidenceScore: number;
}

export interface PaperEndorsement {
  agentName: string;
  modelName: string;
  note: string;
  badgeColor: string;
}

export interface MultiAgentSearchResponse {
  query: string;
  consensusScore: number;
  consensusSummary: string;
  totalAgentsActive: number;
  agents: AgentSearchResult[];
  paperEndorsements: Record<string, PaperEndorsement[]>;
}

export interface SimplifiedAbstract {
  originalAbstract: string;
  simplifiedAbstract: string;
  keyTakeaways: string[];
  plainLanguageGlossary: { term: string; definition: string }[];
}

export interface TranslationResult {
  originalText: string;
  translatedText: string;
  targetLanguage: string;
}

export interface SupportingResearchItem {
  id: string;
  title: string;
  authors: string[];
  university: string;
  year: number;
  doi: string;
  relevanceReason: string;
}

export interface RareThesisRecommendationCard {
  id: string;
  title: string;
  description: string;
  researchProblem: string;
  suggestedDegree: DegreeLevel;
  subject: AcademicSubject;
  secondarySubject?: AcademicSubject;
  difficulty: "Beginner Friendly" | "Moderate" | "High Challenge" | "Very High / Frontier";
  estimatedResearchTime: string;
  noveltyScore: number;
  confidenceScore: number;
  researchPotential: "High Impact" | "Breakthrough Potential" | "Interdisciplinary Bridge" | "Emerging Paradigm";
  relatedTopics: string[];
  badges: string[];
  supportingEvidence: {
    whyThisIdea: string;
    searchStats: {
      totalRetrievedPapers: number;
      publicationTrend: string;
      saturationLevel: string;
    };
    verifiedEvidencePoints: string[];
  };
  supportingResearch: SupportingResearchItem[];
  userNotes?: string;
  collectionId?: string;
  createdAt: string;
}

export interface ResearchGapDashboardData {
  frequentlyStudiedAreas: { topic: string; paperCount: number; saturation: "High" | "Extremely High" }[];
  moderatelyStudiedAreas: { topic: string; paperCount: number; saturation: "Moderate" }[];
  ignoredAreas: { topic: string; reason: string; opportunityRating: string }[];
  interdisciplinaryOpportunities: {
    domainA: string;
    domainB: string;
    proposedBridge: string;
    noveltyScore: number;
  }[];
}

export interface RareDiscoveryAnalytics {
  mostGeneratedSubjects: { subject: string; count: number }[];
  mostSavedTopics: { topic: string; count: number }[];
  averageNoveltyScore: number;
  interdisciplinaryRatio: number;
}

// ResearchRabbit-style Literature Mapping Types
export type RabbitNodeType = "seed" | "similar" | "earlier" | "later" | "author";

export interface RabbitGraphNode {
  id: string;
  title: string;
  authors: string[];
  university: string;
  year: number;
  citationsCount: number;
  subject: string;
  degree?: string;
  doi?: string;
  nodeType: RabbitNodeType;
  similarityScore?: number;
  noveltyScore?: number;
  abstract?: string;
  isSeed?: boolean;
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
  radius?: number;
  cluster?: string;
}

export interface RabbitGraphLink {
  id: string;
  source: string;
  target: string;
  type: "citation" | "reference" | "similarity" | "coauthor";
  strength: number;
  label?: string;
}

export interface RabbitCollection {
  id: string;
  name: string;
  description: string;
  color: string;
  seedIds: string[];
  createdAt: string;
  updatedAt: string;
}

export interface RabbitAuthorItem {
  name: string;
  affiliation: string;
  paperCount: number;
  totalCitations: number;
  hIndexEstimate: number;
  samplePapers: { id: string; title: string; year: number }[];
  coAuthors: string[];
}

export interface RabbitSynthesisReport {
  thematicSummary: string;
  methodologicalTrajectory: string;
  identifiedGaps: string[];
  recommendedHypotheses: string[];
  keyPioneers: string[];
  citationEcosystem: {
    earliestAnchorYear: number;
    peakActivityYear: number;
    interdisciplinaryOverlapPct: number;
  };
}

export interface RabbitBreadcrumb {
  id: string;
  label: string;
  type: "collection" | "paper" | "category" | "author";
  targetId?: string;
  activeCategory?: "similar" | "earlier" | "later" | "authors" | "synthesis";
}


