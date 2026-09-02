import {
  SavedPaper,
  SavedThesisItem,
  SavedIdeaItem,
  SavedProposalItem,
  WorkspaceCollection,
  WorkspaceTag,
  WorkspaceActivityItem,
  WorkspaceNotification,
  WorkspaceStats,
  ReadingProgressStatus
} from "../types/workspace";
import { INITIAL_THESES } from "../data/thesesData";
import { FullProposal, RareThesisRecommendationCard } from "../types/thesis";

const STORAGE_KEYS = {
  PAPERS: "thesisverse_workspace_papers",
  THESES: "thesisverse_workspace_theses",
  IDEAS: "thesisverse_workspace_ideas",
  PROPOSALS: "thesisverse_workspace_proposals",
  COLLECTIONS: "thesisverse_workspace_collections",
  TAGS: "thesisverse_workspace_tags",
  ACTIVITIES: "thesisverse_workspace_activities",
  NOTIFICATIONS: "thesisverse_workspace_notifications",
  SYNC_STATUS: "thesisverse_workspace_sync",
};

export const DEFAULT_TAGS: WorkspaceTag[] = [
  { id: "tag-important", name: "Important", color: "bg-rose-500 text-white" },
  { id: "tag-read-later", name: "Read Later", color: "bg-amber-500 text-white" },
  { id: "tag-needs-review", name: "Needs Review", color: "bg-orange-500 text-white" },
  { id: "tag-methodology", name: "Methodology", color: "bg-indigo-500 text-white" },
  { id: "tag-statistics", name: "Statistics", color: "bg-emerald-500 text-white" },
  { id: "tag-literature", name: "Literature Review", color: "bg-sky-500 text-white" },
  { id: "tag-ai", name: "AI & ML", color: "bg-purple-500 text-white" },
  { id: "tag-favorite", name: "Favorite", color: "bg-pink-500 text-white" },
];

export const DEFAULT_COLLECTIONS: WorkspaceCollection[] = [
  {
    id: "col-foundation",
    name: "Dissertation Foundation",
    description: "Core literature and baseline empirical studies for doctoral dissertation.",
    color: "#4f46e5", // indigo
    icon: "BookOpen",
    createdAt: "2026-08-01",
    itemIds: ["thesis-101", "thesis-102"],
  },
  {
    id: "col-quantum-ai",
    name: "Quantum Computing & Neural AI",
    description: "Interdisciplinary papers bridging quantum state matrices and neural network operators.",
    color: "#0284c7", // sky
    icon: "Atom",
    createdAt: "2026-08-02",
    itemIds: ["thesis-101", "thesis-103"],
  },
  {
    id: "col-bioeng",
    name: "Optogenetic Bio-Engineering",
    description: "Targeted studies on synthetic optogenetics and neural tissue interfaces.",
    color: "#059669", // emerald
    icon: "Dna",
    createdAt: "2026-08-03",
    itemIds: ["thesis-102"],
  },
  {
    id: "col-proposals",
    name: "Thesis Proposal Drafts",
    description: "Saved Phase 5 research proposals and supervisory submission drafts.",
    color: "#d97706", // amber
    icon: "FileText",
    createdAt: "2026-08-04",
    itemIds: ["prop-101"],
  },
];

export const DEFAULT_SEED_PAPERS: SavedPaper[] = [
  {
    id: "sp-101",
    thesis: INITIAL_THESES[0],
    readingProgress: "reading",
    isPinned: true,
    isFavorite: true,
    tags: ["tag-important", "tag-methodology", "tag-ai"],
    collectionIds: ["col-foundation", "col-quantum-ai"],
    notes: "# Quantum Neural Operators Review\n\n- Key finding: Barren plateau mitigation via entropic parameter initializing.\n- Follow up: Test empirical performance on 128-qubit simulator.",
    savedAt: "2026-08-05T10:00:00Z",
    lastViewedAt: "2026-08-07T08:30:00Z",
  },
  {
    id: "sp-102",
    thesis: INITIAL_THESES[1],
    readingProgress: "completed",
    isPinned: false,
    isFavorite: true,
    tags: ["tag-literature", "tag-statistics"],
    collectionIds: ["col-foundation", "col-bioeng"],
    notes: "Solid experimental sample size (n=1,420). Replicable in optogenetic tissue culture.",
    savedAt: "2026-08-04T14:20:00Z",
    lastViewedAt: "2026-08-06T11:15:00Z",
  },
  {
    id: "sp-103",
    thesis: INITIAL_THESES[2],
    readingProgress: "unread",
    isPinned: false,
    isFavorite: false,
    tags: ["tag-read-later"],
    collectionIds: ["col-quantum-ai"],
    notes: "",
    savedAt: "2026-08-06T09:10:00Z",
    lastViewedAt: "2026-08-06T09:10:00Z",
  },
];

export const DEFAULT_SEED_IDEAS: SavedIdeaItem[] = [
  {
    id: "si-101",
    idea: {
      id: "rare-idea-1",
      title: "Closed-Loop Synaptic Plasticity Control via Quantum Entangled Optogenetics",
      description: "An unprecedented interdisciplinary synthesis connecting quantum sensor precision with real-time neural plasticity modulation.",
      researchProblem: "Current neural implants suffer from unpredictable feedback latency and signal degradation over multi-week deployments.",
      suggestedDegree: "Ph.D.",
      subject: "Neuroscience & Cognitive AI",
      secondarySubject: "Quantum Computing",
      difficulty: "Frontier / High Challenge" as any,
      estimatedResearchTime: "36 Months",
      noveltyScore: 96,
      confidenceScore: 89,
      researchPotential: "Breakthrough Potential",
      relatedTopics: ["Optogenetics", "Quantum Sensing", "Synaptic Plasticity"],
      badges: ["96% Novelty", "Interdisciplinary Bridge", "High Impact"],
      supportingEvidence: {
        whyThisIdea: "Zero existing literature combines quantum entropic sensors with closed-loop optogenetics.",
        searchStats: {
          totalRetrievedPapers: 4200,
          publicationTrend: "+34% YoY",
          saturationLevel: "Extremely Low Gaps",
        },
        verifiedEvidencePoints: [
          "MIT Synthetic Neurobiology Lab (2025) demonstrated initial optical pulse triggering.",
          "Oxford Quantum Information Group (2026) verified 0.4ms entropic state resolution."
        ],
      },
      supportingResearch: [],
      createdAt: "2026-08-05",
    },
    readingProgress: "reading",
    isPinned: true,
    isFavorite: true,
    tags: ["tag-important", "tag-ai"],
    collectionIds: ["col-quantum-ai"],
    notes: "Top candidate topic for dissertation grant application. Schedule meeting with supervisor.",
    generatedDate: "2026-08-05T12:00:00Z",
  },
];

export const DEFAULT_SEED_PROPOSALS: SavedProposalItem[] = [
  {
    id: "prop-101",
    proposal: {
      id: "prop-101",
      title: "Evaluating Closed-Loop Synaptic Plasticity Regeneration in Neural Implants",
      originalTopic: "Closed-loop synaptic plasticity in neural implants",
      degree: "Ph.D.",
      subject: "Neuroscience & Cognitive AI",
      targetUniversity: "Massachusetts Institute of Technology",
      templateType: "Ph.D.",
      background: {
        context: "Neural implants have advanced significantly over the past decade, yet maintaining long-term bi-directional synaptic communication remains challenging due to signal degradation.",
        importance: "Critical for next-generation brain-computer interfaces and neuro-restorative therapies.",
        existingWork: "Existing literature focuses primarily on passive recording electrodes rather than active real-time synaptic modulation.",
        motivation: "A closed-loop adaptive system can extend implant longevity and restore cognitive motor functions."
      },
      problemStatement: {
        whatProblemExists: "Lack of adaptive closed-loop feedback in neural stimulation protocols causes micro-tissue inflammation and loss of synaptic sensitivity over time.",
        whyItMatters: "Limits therapeutic efficacy in long-term neuro-degenerative treatments.",
        whatIsMissing: "Real-time entropic feedback loops that adjust stimulation frequency based on tissue impedance."
      },
      objectives: {
        primaryObjective: "Develop and benchmark a closed-loop optogenetic feedback architecture for neural implants.",
        secondaryObjectives: [
          "Validate entropic impedance sensing in vitro.",
          "Evaluate tissue inflammation rates over 60-day trial window."
        ],
        expectedOutcomes: ["Empirical benchmark dataset", "Patentable adaptive firmware algorithm"]
      },
      questions: {
        mainQuestion: "How does real-time entropic modulation impact long-term synaptic sensitivity in neural implants?",
        subQuestions: [
          "What is the optimal feedback frequency to minimize tissue heating?",
          "Can closed-loop stimulation reduce signal-to-noise decay by >40%?"
        ],
        hypothesis: "Closed-loop entropic modulation significantly reduces tissue impedance decay over baseline stimulation."
      },
      scope: {
        includedTopics: ["Optogenetics", "Closed-loop control", "Neural interfaces"],
        excludedTopics: ["Non-invasive scalp EEG"],
        limitations: ["In vitro tissue culture environment"],
        assumptions: ["Biocompatible polymer substrate stability"]
      },
      methodology: {
        methodType: "Experimental / Benchmarking",
        description: "In vitro multi-electrode array recordings paired with automated optogenetic laser triggering driven by an FPGA controller.",
        justification: "Allows precise sub-millisecond control and high signal fidelity."
      },
      chapterOutline: [
        { chapter: 1, title: "Introduction & Theoretical Framework", description: "Overview of neural interfaces and literature gap." },
        { chapter: 2, title: "Literature Review on Closed-Loop Bio-electronics", description: "Comprehensive audit of prior stimulation paradigms." },
        { chapter: 3, title: "Experimental System Architecture & FPGA Design", description: "Hardware setup and sensor calibration protocols." },
        { chapter: 4, title: "Empirical Results & Comparative Analysis", description: "60-day telemetry data evaluation and statistical verification." },
        { chapter: 5, title: "Discussion, Future Directions & Conclusion", description: "Implications for clinical translational medicine." }
      ],
      expectedContribution: {
        academicContribution: "Establishes a new benchmark for closed-loop neural tissue interfacing.",
        practicalContribution: "Provides open-source firmware for neuro-engineering labs.",
        futureOpportunities: "Enables human clinical trial protocols."
      },
      keywords: {
        primary: ["Optogenetics", "Neural Implants", "Closed-Loop Control"],
        secondary: ["Bio-electronics", "Synaptic Plasticity"],
        researchTags: ["Ph.D. Dissertation Proposal"]
      },
      supportingLiterature: [],
      qualityScore: {
        overallScore: 92,
        breakdown: {
          titleQuality: 94,
          novelty: 90,
          clarity: 92,
          researchScope: 91,
          methodologyFit: 93,
          objectivesClarity: 92,
          writingQuality: 90
        },
        improvementSuggestions: ["Expand on in vivo translational steps in Chapter 5."]
      },
      feasibilityAnalysis: {
        difficulty: "High Challenge" as any,
        estimatedTimeMonths: 24,
        dataAvailability: "High",
        researchComplexity: "High",
        recommendedDegree: "Ph.D."
      },
      timeline: [
        { id: "t1", phase: "System Architecture & FPGA Setup", durationWeeks: 8, tasks: ["Calibrate sensors"], completed: true },
        { id: "t2", phase: "In Vitro Benchmarking Trials", durationWeeks: 12, tasks: ["Run 60-day culture trials"], completed: false },
        { id: "t3", phase: "Data Synthesis & Dissertation Writing", durationWeeks: 8, tasks: ["Write draft chapters"], completed: false }
      ],
      versionHistory: [
        { versionId: "v1.0", timestamp: "2026-08-04T10:00:00Z", title: "Initial Proposal Draft", summaryOfChanges: "Automated synthesis", snapshotData: null }
      ],
      createdAt: "2026-08-04T10:00:00Z",
      updatedAt: "2026-08-06T16:45:00Z"
    },
    isPinned: true,
    isFavorite: true,
    tags: ["tag-important", "tag-methodology"],
    collectionIds: ["col-proposals"],
    notes: "Submitted draft to thesis committee. Awaiting preliminary review comments.",
    status: "Under Review",
    updatedAt: "2026-08-06T16:45:00Z"
  }
];

export const DEFAULT_SEED_ACTIVITIES: WorkspaceActivityItem[] = [
  {
    id: "act-1",
    action: "edit_proposal",
    title: "Updated Chapter 3 outline in 'Synaptic Plasticity Proposal'",
    timestamp: "10 minutes ago",
    details: "Added FPGA hardware latency benchmarks"
  },
  {
    id: "act-2",
    action: "view_paper",
    title: "Reviewed paper: 'Mitigating Barren Plateaus in Quantum Neural Operators'",
    timestamp: "2 hours ago",
    details: "Added note regarding entropic initialization"
  },
  {
    id: "act-3",
    action: "save_note",
    title: "Updated research notes on Rare Idea #1",
    timestamp: "Yesterday, 4:30 PM"
  },
  {
    id: "act-4",
    action: "search",
    title: "Executed library search: 'Optogenetic neural implants'",
    timestamp: "Aug 5, 2026"
  }
];

export const DEFAULT_SEED_NOTIFICATIONS: WorkspaceNotification[] = [
  {
    id: "notif-1",
    title: "Proposal Quality Score Updated",
    message: "Your dissertation proposal 'Evaluating Synaptic Plasticity' achieved a 92/100 readiness score.",
    timestamp: "1 hour ago",
    isRead: false,
    category: "proposal"
  },
  {
    id: "notif-2",
    title: "New AI Research Recommendation",
    message: "3 new papers published in 'Optogenetic Interfaces' match your saved thesis ideas.",
    timestamp: "Yesterday",
    isRead: false,
    category: "ai"
  },
  {
    id: "notif-3",
    title: "Research Schedule Reminder",
    message: "Phase 2 'In Vitro Benchmarking' scheduled to begin in 5 days.",
    timestamp: "2 days ago",
    isRead: true,
    category: "reminder"
  }
];

// Helper functions for storage
export function loadWorkspacePapers(): SavedPaper[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PAPERS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveWorkspacePapers(papers: SavedPaper[]) {
  try {
    localStorage.setItem(STORAGE_KEYS.PAPERS, JSON.stringify(papers));
  } catch (e) {
    console.warn("Storage save error", e);
  }
}

export function loadWorkspaceIdeas(): SavedIdeaItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.IDEAS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveWorkspaceIdeas(ideas: SavedIdeaItem[]) {
  try {
    localStorage.setItem(STORAGE_KEYS.IDEAS, JSON.stringify(ideas));
  } catch (e) {
    console.warn("Storage save error", e);
  }
}

export function loadWorkspaceProposals(): SavedProposalItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PROPOSALS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveWorkspaceProposals(proposals: SavedProposalItem[]) {
  try {
    localStorage.setItem(STORAGE_KEYS.PROPOSALS, JSON.stringify(proposals));
  } catch (e) {
    console.warn("Storage save error", e);
  }
}

export function loadWorkspaceCollections(): WorkspaceCollection[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.COLLECTIONS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveWorkspaceCollections(collections: WorkspaceCollection[]) {
  try {
    localStorage.setItem(STORAGE_KEYS.COLLECTIONS, JSON.stringify(collections));
  } catch (e) {
    console.warn("Storage save error", e);
  }
}

export function loadWorkspaceTags(): WorkspaceTag[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.TAGS);
    return raw ? JSON.parse(raw) : DEFAULT_TAGS;
  } catch {
    return DEFAULT_TAGS;
  }
}

export function saveWorkspaceTags(tags: WorkspaceTag[]) {
  try {
    localStorage.setItem(STORAGE_KEYS.TAGS, JSON.stringify(tags));
  } catch (e) {
    console.warn("Storage save error", e);
  }
}

export function loadWorkspaceActivities(): WorkspaceActivityItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ACTIVITIES);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveWorkspaceActivities(activities: WorkspaceActivityItem[]) {
  try {
    localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(activities));
  } catch (e) {
    console.warn("Storage save error", e);
  }
}

export function loadWorkspaceNotifications(): WorkspaceNotification[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveWorkspaceNotifications(notifs: WorkspaceNotification[]) {
  try {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifs));
  } catch (e) {
    console.warn("Storage save error", e);
  }
}

// Stats generator calculation
export function calculateWorkspaceStats(
  papers: SavedPaper[],
  ideas: SavedIdeaItem[],
  proposals: SavedProposalItem[],
  collections: WorkspaceCollection[]
): WorkspaceStats {
  const completedCount = papers.filter((p) => p.readingProgress === "completed").length +
    ideas.filter((i) => i.readingProgress === "completed").length;

  const progressBreakdown = {
    unread: papers.filter((p) => p.readingProgress === "unread").length + ideas.filter((i) => i.readingProgress === "unread").length,
    reading: papers.filter((p) => p.readingProgress === "reading").length + ideas.filter((i) => i.readingProgress === "reading").length,
    completed: completedCount,
    archived: papers.filter((p) => p.readingProgress === "archived").length + ideas.filter((i) => i.readingProgress === "archived").length,
  };

  // Top subjects
  const subjectMap: Record<string, number> = {};
  papers.forEach((p) => {
    if (p.thesis.subject) subjectMap[p.thesis.subject] = (subjectMap[p.thesis.subject] || 0) + 1;
  });
  ideas.forEach((i) => {
    if (i.idea.subject) subjectMap[i.idea.subject] = (subjectMap[i.idea.subject] || 0) + 1;
  });

  const topSubjects = Object.entries(subjectMap)
    .map(([subject, count]) => ({ subject, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  return {
    savedPapersCount: papers.length,
    savedThesesCount: papers.filter((p) => p.thesis.documentType === "Thesis" || p.thesis.documentType === "Dissertation").length,
    savedIdeasCount: ideas.length,
    activeProposalsCount: proposals.length,
    collectionsCount: collections.length,
    completedReadingCount: completedCount,
    totalSearchesCount: 28,
    estimatedHoursSpent: Math.round(papers.length * 1.5 + ideas.length * 0.8 + proposals.length * 3.5),
    topSubjects,
    readingProgressBreakdown: progressBreakdown,
  };
}

// Parsers & Exporters for BibTeX, RIS, CSV, JSON, Markdown
export function exportWorkspaceJSON(data: any): string {
  return JSON.stringify(data, null, 2);
}

export function exportWorkspaceMarkdown(papers: SavedPaper[], ideas: SavedIdeaItem[], proposals: SavedProposalItem[]): string {
  let md = `# ThesisVerse Personal Research Workspace Export\n*Generated on: ${new Date().toLocaleDateString()}*\n\n`;

  md += `## 1. Saved Research Papers (${papers.length})\n`;
  papers.forEach((p, idx) => {
    md += `### ${idx + 1}. ${p.thesis.title}\n`;
    md += `- **Authors:** ${p.thesis.authors.join(", ")}\n`;
    md += `- **University / Journal:** ${p.thesis.university} (${p.thesis.year})\n`;
    md += `- **DOI:** ${p.thesis.doi}\n`;
    md += `- **Reading Progress:** ${p.readingProgress.toUpperCase()}\n`;
    md += `- **Tags:** ${p.tags.join(", ") || "None"}\n`;
    md += `- **Personal Notes:** ${p.notes || "No notes attached."}\n\n`;
  });

  md += `\n## 2. Saved AI Thesis Ideas (${ideas.length})\n`;
  ideas.forEach((i, idx) => {
    md += `### ${idx + 1}. ${i.idea.title}\n`;
    md += `- **Subject:** ${i.idea.subject} (${i.idea.suggestedDegree})\n`;
    md += `- **Novelty Score:** ${i.idea.noveltyScore}%\n`;
    md += `- **Description:** ${i.idea.description}\n`;
    md += `- **Notes:** ${i.notes || "None"}\n\n`;
  });

  md += `\n## 3. Active Research Proposals (${proposals.length})\n`;
  proposals.forEach((pr, idx) => {
    md += `### ${idx + 1}. ${pr.proposal.title}\n`;
    md += `- **Degree Level:** ${pr.proposal.degree}\n`;
    md += `- **Status:** ${pr.status}\n`;
    md += `- **Quality Readiness Score:** ${pr.proposal.qualityScore?.overallScore || "N/A"}/100\n\n`;
  });

  return md;
}

export function exportWorkspaceCSV(papers: SavedPaper[]): string {
  const headers = ["Title", "Authors", "Year", "University", "DOI", "ReadingProgress", "SavedAt", "Notes"];
  const rows = papers.map((p) => [
    `"${p.thesis.title.replace(/"/g, '""')}"`,
    `"${p.thesis.authors.join("; ").replace(/"/g, '""')}"`,
    p.thesis.year,
    `"${p.thesis.university.replace(/"/g, '""')}"`,
    `"${p.thesis.doi}"`,
    p.readingProgress,
    p.savedAt,
    `"${(p.notes || "").replace(/"/g, '""')}"`
  ]);

  return [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
}

export function parseImportData(rawText: string, format: string): SavedPaper[] {
  const importedPapers: SavedPaper[] = [];

  if (format === "json") {
    try {
      const parsed = JSON.parse(rawText);
      const items = Array.isArray(parsed) ? parsed : parsed.papers || [parsed];
      items.forEach((item: any, idx: number) => {
        if (item.title || item.thesis?.title) {
          const tTitle = item.title || item.thesis?.title || "Imported Document";
          importedPapers.push({
            id: `imp-${Date.now()}-${idx}`,
            thesis: {
              id: `th-imp-${Date.now()}-${idx}`,
              title: tTitle,
              authors: Array.isArray(item.authors) ? item.authors : [item.authors || "Unknown Author"],
              university: item.university || item.publisher || "Imported Repository",
              publisher: item.publisher || "Academic Press",
              year: item.year || new Date().getFullYear(),
              abstract: item.abstract || "Imported paper metadata entry.",
              keywords: item.keywords || ["Imported"],
              subject: item.subject || "Computer Science",
              degree: item.degree || "Ph.D.",
              doi: item.doi || `10.1000/imp-${Date.now()}`,
              sourceUrl: item.sourceUrl || "https://doi.org",
              language: "English",
              citationsCount: item.citationsCount || 10,
              noveltyScore: 85,
              difficultyScore: 50,
              confidenceScore: 90,
              researchGap: "Imported from external dataset.",
              futureDirections: ["Extend dataset validation"],
              methodology: "Empirical Analysis",
              keyFindings: ["Imported reference"],
              bibtex: item.bibtex || `@article{imp${idx}, title={${tTitle}}, year={${new Date().getFullYear()}}}`
            },
            readingProgress: "unread",
            isPinned: false,
            isFavorite: false,
            tags: ["tag-read-later"],
            collectionIds: [],
            notes: "Imported via JSON upload.",
            savedAt: new Date().toISOString(),
            lastViewedAt: new Date().toISOString()
          });
        }
      });
    } catch (e) {
      throw new Error("Invalid JSON format. Please ensure valid JSON structure.");
    }
  } else if (format === "bibtex") {
    // Simple BibTeX Regex entry parser
    const entries = rawText.split("@");
    entries.forEach((entry, idx) => {
      if (!entry.trim()) return;
      const titleMatch = entry.match(/title\s*=\s*[{"]([^}"]+)[}"]/i);
      const authorMatch = entry.match(/author\s*=\s*[{"]([^}"]+)[}"]/i);
      const yearMatch = entry.match(/year\s*=\s*[{"]?(\d{4})[}"]?/i);
      const doiMatch = entry.match(/doi\s*=\s*[{"]([^}"]+)[}"]/i);

      if (titleMatch) {
        importedPapers.push({
          id: `bib-${Date.now()}-${idx}`,
          thesis: {
            id: `th-bib-${Date.now()}-${idx}`,
            title: titleMatch[1],
            authors: authorMatch ? authorMatch[1].split(" and ") : ["BibTeX Author"],
            university: "BibTeX Importer",
            publisher: "Academic Press",
            year: yearMatch ? parseInt(yearMatch[1]) : 2025,
            abstract: "Imported via BibTeX metadata string.",
            keywords: ["BibTeX"],
            subject: "Computer Science",
            degree: "Ph.D.",
            doi: doiMatch ? doiMatch[1] : `10.1016/bib.${Date.now()}`,
            sourceUrl: "https://doi.org",
            language: "English",
            citationsCount: 12,
            noveltyScore: 82,
            difficultyScore: 55,
            confidenceScore: 88,
            researchGap: "Imported via BibTeX file.",
            futureDirections: ["Validate citations"],
            methodology: "Literature Review",
            keyFindings: ["BibTeX Record"],
            bibtex: `@article{${entry}`
          },
          readingProgress: "unread",
          isPinned: false,
          isFavorite: false,
          tags: ["tag-literature"],
          collectionIds: [],
          notes: "Imported via BibTeX file.",
          savedAt: new Date().toISOString(),
          lastViewedAt: new Date().toISOString()
        });
      }
    });
  } else if (format === "csv") {
    const lines = rawText.split("\n");
    lines.forEach((line, idx) => {
      if (idx === 0 || !line.trim()) return; // skip header
      const parts = line.split(",");
      if (parts.length >= 2) {
        const title = parts[0].replace(/"/g, "").trim();
        const author = parts[1] ? parts[1].replace(/"/g, "").trim() : "CSV Author";
        if (title) {
          importedPapers.push({
            id: `csv-${Date.now()}-${idx}`,
            thesis: {
              id: `th-csv-${Date.now()}-${idx}`,
              title,
              authors: [author],
              university: parts[3] ? parts[3].replace(/"/g, "").trim() : "CSV Repository",
              publisher: "CSV Journal",
              year: parts[2] ? parseInt(parts[2]) || 2025 : 2025,
              abstract: "Imported via CSV file.",
              keywords: ["CSV Import"],
              subject: "Artificial Intelligence",
              degree: "Master's",
              doi: parts[4] ? parts[4].replace(/"/g, "").trim() : `10.1109/csv.${Date.now()}`,
              sourceUrl: "https://doi.org",
              language: "English",
              citationsCount: 5,
              noveltyScore: 80,
              difficultyScore: 40,
              confidenceScore: 85,
              researchGap: "CSV import entry.",
              futureDirections: [],
              methodology: "Empirical Analysis",
              keyFindings: ["CSV Record"],
              bibtex: `@misc{csv${idx}, title={${title}}, year={2025}}`
            },
            readingProgress: "unread",
            isPinned: false,
            isFavorite: false,
            tags: ["tag-read-later"],
            collectionIds: [],
            notes: "Imported via CSV file.",
            savedAt: new Date().toISOString(),
            lastViewedAt: new Date().toISOString()
          });
        }
      }
    });
  }

  return importedPapers;
}
