import { Thesis, RareThesisRecommendationCard, FullProposal, AcademicSubject, DegreeLevel } from "./thesis";

export type ReadingProgressStatus = "unread" | "reading" | "completed" | "archived";
export type WorkspaceItemType = "paper" | "thesis" | "idea" | "proposal";

export interface WorkspaceTag {
  id: string;
  name: string;
  color: string; // Tailwind color or hex (e.g. 'bg-indigo-500', 'bg-emerald-500')
}

export interface WorkspaceCollection {
  id: string;
  name: string;
  description: string;
  color: string;
  icon: string;
  createdAt: string;
  itemIds: string[]; // List of item IDs (papers, theses, ideas, proposals)
}

export interface WorkspaceNote {
  id: string;
  itemId: string;
  itemType: WorkspaceItemType;
  title: string;
  content: string;
  updatedAt: string;
  isAutoSaved?: boolean;
}

export interface WorkspaceActivityItem {
  id: string;
  action: "search" | "view_paper" | "generate_idea" | "edit_proposal" | "export_library" | "save_note" | "import_data";
  title: string;
  timestamp: string;
  details?: string;
}

export interface WorkspaceNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  category: "proposal" | "search" | "ai" | "reminder";
}

export interface SavedPaper {
  id: string;
  thesis: Thesis;
  readingProgress: ReadingProgressStatus;
  isPinned: boolean;
  isFavorite: boolean;
  tags: string[];
  collectionIds: string[];
  notes: string;
  savedAt: string;
  lastViewedAt: string;
}

export interface SavedThesisItem {
  id: string;
  thesis: Thesis;
  university: string;
  degree: DegreeLevel;
  year: number;
  readingProgress: ReadingProgressStatus;
  isPinned: boolean;
  isFavorite: boolean;
  tags: string[];
  collectionIds: string[];
  notes: string;
  savedAt: string;
}

export interface SavedIdeaItem {
  id: string;
  idea: RareThesisRecommendationCard;
  readingProgress: ReadingProgressStatus;
  isPinned: boolean;
  isFavorite: boolean;
  tags: string[];
  collectionIds: string[];
  notes: string;
  generatedDate: string;
}

export interface SavedProposalItem {
  id: string;
  proposal: FullProposal;
  isPinned: boolean;
  isFavorite: boolean;
  tags: string[];
  collectionIds: string[];
  notes: string;
  status: "Draft" | "Under Review" | "Finalized" | "Archived";
  updatedAt: string;
}

export interface WorkspaceStats {
  savedPapersCount: number;
  savedThesesCount: number;
  savedIdeasCount: number;
  activeProposalsCount: number;
  collectionsCount: number;
  completedReadingCount: number;
  totalSearchesCount: number;
  estimatedHoursSpent: number;
  topSubjects: { subject: string; count: number }[];
  readingProgressBreakdown: {
    unread: number;
    reading: number;
    completed: number;
    archived: number;
  };
}

export interface ImportPayload {
  format: "bibtex" | "ris" | "csv" | "json" | "markdown";
  rawText: string;
}
