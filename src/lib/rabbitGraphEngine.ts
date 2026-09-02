import { Thesis, RabbitGraphNode, RabbitGraphLink, RabbitAuthorItem, RabbitCollection, RabbitSynthesisReport } from "../types/thesis";
import { INITIAL_THESES } from "../data/thesesData";

export const DEFAULT_RABBIT_COLLECTIONS: RabbitCollection[] = [
  {
    id: "col-ai-quantum",
    name: "AI & Quantum Information Systems",
    description: "Foundational and contemporary research bridging quantum neural architectures, cryptography, and neuro-symbolic algorithms.",
    color: "#6366f1",
    seedIds: ["th-104", "th-105"],
    createdAt: "2025-01-10",
    updatedAt: "2025-02-14",
  },
  {
    id: "col-manuscript-lit",
    name: "Manuscript Hermeneutics & Early Modern Literature",
    description: "Archival, liturgical, and post-colonial computational studies of 17th-19th century vernacular manuscripts.",
    color: "#ec4899",
    seedIds: ["th-101", "th-102"],
    createdAt: "2025-01-15",
    updatedAt: "2025-02-18",
  },
  {
    id: "col-bio-genomics",
    name: "Optogenetics & Neural Computing",
    description: "Computational neuroscience, cellular sequencing, and optical neural stimulation dissertations.",
    color: "#10b981",
    seedIds: ["th-106", "th-104"],
    createdAt: "2025-02-01",
    updatedAt: "2025-02-20",
  }
];

export interface ComputedLiteratureUniverse {
  seedTheses: Thesis[];
  similarTheses: (Thesis & { similarityScore: number; sharedKeywords: string[] })[];
  earlierTheses: (Thesis & { referenceStrength: number })[];
  laterTheses: (Thesis & { citationInfluence: number })[];
  authors: RabbitAuthorItem[];
  nodes: RabbitGraphNode[];
  links: RabbitGraphLink[];
}

/**
 * Computes the complete ResearchRabbit relationship graph around an array of seed theses
 */
export function computeRabbitGraph(
  seedTheses: Thesis[],
  allPool: Thesis[] = INITIAL_THESES
): ComputedLiteratureUniverse {
  if (seedTheses.length === 0 && allPool.length > 0) {
    seedTheses = [allPool[0]];
  }

  const seedIds = new Set(seedTheses.map((s) => s.id));
  const seedKeywords = new Set<string>();
  const seedSubjects = new Set<string>();
  const seedAuthors = new Set<string>();
  let minSeedYear = 2026;
  let maxSeedYear = 1900;

  seedTheses.forEach((s) => {
    s.keywords.forEach((k) => seedKeywords.add(k.toLowerCase()));
    seedSubjects.add(s.subject.toLowerCase());
    s.authors.forEach((a) => seedAuthors.add(a.toLowerCase()));
    if (s.year < minSeedYear) minSeedYear = s.year;
    if (s.year > maxSeedYear) maxSeedYear = s.year;
  });

  const scoredNonSeeds: {
    thesis: Thesis;
    score: number;
    sharedKeywords: string[];
    sharedAuthors: string[];
    isEarlier: boolean;
    isLater: boolean;
  }[] = [];

  allPool.forEach((p) => {
    if (seedIds.has(p.id)) return;

    let score = 0;
    const sharedKw: string[] = [];
    p.keywords.forEach((k) => {
      if (seedKeywords.has(k.toLowerCase())) {
        score += 15;
        sharedKw.push(k);
      }
    });

    if (seedSubjects.has(p.subject.toLowerCase())) {
      score += 25;
    }

    const sharedAuth: string[] = [];
    p.authors.forEach((a) => {
      if (seedAuthors.has(a.toLowerCase())) {
        score += 30;
        sharedAuth.push(a);
      }
    });

    // Cross-disciplinary tags bonus
    p.crossDisciplinaryTags?.forEach((tag) => {
      seedTheses.forEach((st) => {
        if (st.crossDisciplinaryTags?.some((t) => t.toLowerCase() === tag.toLowerCase())) {
          score += 12;
        }
      });
    });

    // Proximity in citations & novelty
    score += Math.min(20, Math.floor(p.citationsCount / 10));

    const avgSeedYear = (minSeedYear + maxSeedYear) / 2;
    const isEarlier = p.year < avgSeedYear;
    const isLater = p.year >= avgSeedYear;

    scoredNonSeeds.push({
      thesis: p,
      score,
      sharedKeywords: sharedKw,
      sharedAuthors: sharedAuth,
      isEarlier,
      isLater,
    });
  });

  // Sort by score
  scoredNonSeeds.sort((a, b) => b.score - a.score);

  // 1. Similar Work (Top overall matches)
  const similarTheses = scoredNonSeeds
    .slice(0, 8)
    .map((item) => ({
      ...item.thesis,
      similarityScore: Math.min(99, Math.max(55, Math.round(50 + item.score * 0.6))),
      sharedKeywords: item.sharedKeywords.length > 0 ? item.sharedKeywords : item.thesis.keywords.slice(0, 3)
    }));

  // 2. Earlier Work (References / Predecessors)
  const earlierTheses = scoredNonSeeds
    .filter((item) => item.isEarlier || item.thesis.year <= minSeedYear)
    .slice(0, 6)
    .map((item) => ({
      ...item.thesis,
      referenceStrength: Math.min(98, Math.max(60, Math.round(55 + item.score * 0.5)))
    }));

  // 3. Later Work (Citations / Evolutions)
  const laterTheses = scoredNonSeeds
    .filter((item) => item.isLater || item.thesis.year >= maxSeedYear)
    .slice(0, 6)
    .map((item) => ({
      ...item.thesis,
      citationInfluence: Math.min(98, Math.max(65, Math.round(60 + item.score * 0.55)))
    }));

  // 4. Authors Extraction
  const authorMap = new Map<string, RabbitAuthorItem>();
  const allActiveTheses = [...seedTheses, ...similarTheses, ...earlierTheses, ...laterTheses];

  allActiveTheses.forEach((t) => {
    t.authors.forEach((authorName) => {
      const existing = authorMap.get(authorName);
      if (existing) {
        existing.paperCount += 1;
        existing.totalCitations += t.citationsCount;
        existing.samplePapers.push({ id: t.id, title: t.title, year: t.year });
        t.authors.forEach((co) => {
          if (co !== authorName && !existing.coAuthors.includes(co)) {
            existing.coAuthors.push(co);
          }
        });
      } else {
        const otherAuthors = t.authors.filter((a) => a !== authorName);
        authorMap.set(authorName, {
          name: authorName,
          affiliation: t.university,
          paperCount: 1,
          totalCitations: t.citationsCount,
          hIndexEstimate: Math.max(4, Math.floor(t.citationsCount / 25)),
          samplePapers: [{ id: t.id, title: t.title, year: t.year }],
          coAuthors: otherAuthors,
        });
      }
    });
  });

  const authors = Array.from(authorMap.values()).sort((a, b) => b.totalCitations - a.totalCitations).slice(0, 10);

  // 5. Generate Nodes and Links
  const nodeMap = new Map<string, RabbitGraphNode>();
  const links: RabbitGraphLink[] = [];

  // Add Seed Nodes
  seedTheses.forEach((s, idx) => {
    nodeMap.set(s.id, {
      id: s.id,
      title: s.title,
      authors: s.authors,
      university: s.university,
      year: s.year,
      citationsCount: s.citationsCount,
      subject: s.subject,
      degree: s.degree,
      doi: s.doi,
      nodeType: "seed",
      isSeed: true,
      noveltyScore: s.noveltyScore,
      abstract: s.abstract,
      radius: 28,
      cluster: s.subject
    });
  });

  // Add Similar Nodes
  similarTheses.forEach((p) => {
    if (!nodeMap.has(p.id)) {
      nodeMap.set(p.id, {
        id: p.id,
        title: p.title,
        authors: p.authors,
        university: p.university,
        year: p.year,
        citationsCount: p.citationsCount,
        subject: p.subject,
        degree: p.degree,
        doi: p.doi,
        nodeType: "similar",
        similarityScore: p.similarityScore,
        noveltyScore: p.noveltyScore,
        abstract: p.abstract,
        radius: 18 + Math.min(12, Math.floor(p.citationsCount / 20)),
        cluster: p.subject
      });

      // Link to most relevant seed
      const targetSeed = seedTheses[0];
      if (targetSeed) {
        links.push({
          id: `link-sim-${p.id}-${targetSeed.id}`,
          source: targetSeed.id,
          target: p.id,
          type: "similarity",
          strength: 0.8,
          label: `${p.similarityScore}% Similar`
        });
      }
    }
  });

  // Add Earlier Nodes
  earlierTheses.forEach((p) => {
    if (!nodeMap.has(p.id)) {
      nodeMap.set(p.id, {
        id: p.id,
        title: p.title,
        authors: p.authors,
        university: p.university,
        year: p.year,
        citationsCount: p.citationsCount,
        subject: p.subject,
        degree: p.degree,
        doi: p.doi,
        nodeType: "earlier",
        noveltyScore: p.noveltyScore,
        abstract: p.abstract,
        radius: 16 + Math.min(10, Math.floor(p.citationsCount / 25)),
        cluster: "Foundational"
      });

      // Earlier works are cited by seeds
      const targetSeed = seedTheses[0];
      if (targetSeed) {
        links.push({
          id: `link-earlier-${p.id}-${targetSeed.id}`,
          source: p.id,
          target: targetSeed.id,
          type: "reference",
          strength: 0.9,
          label: "Cited By Seed"
        });
      }
    }
  });

  // Add Later Nodes
  laterTheses.forEach((p) => {
    if (!nodeMap.has(p.id)) {
      nodeMap.set(p.id, {
        id: p.id,
        title: p.title,
        authors: p.authors,
        university: p.university,
        year: p.year,
        citationsCount: p.citationsCount,
        subject: p.subject,
        degree: p.degree,
        doi: p.doi,
        nodeType: "later",
        noveltyScore: p.noveltyScore,
        abstract: p.abstract,
        radius: 17 + Math.min(10, Math.floor(p.citationsCount / 22)),
        cluster: "Subsequent"
      });

      // Later works cite seed
      const targetSeed = seedTheses[0];
      if (targetSeed) {
        links.push({
          id: `link-later-${targetSeed.id}-${p.id}`,
          source: targetSeed.id,
          target: p.id,
          type: "citation",
          strength: 0.85,
          label: "Cites Seed"
        });
      }
    }
  });

  const nodes = Array.from(nodeMap.values());

  return {
    seedTheses,
    similarTheses,
    earlierTheses,
    laterTheses,
    authors,
    nodes,
    links,
  };
}

/**
 * Generates initial physics simulation coordinates for the literature graph canvas
 */
export function layoutGraphNodes(
  nodes: RabbitGraphNode[],
  width: number = 800,
  height: number = 550,
  mode: "network" | "timeline" = "network"
): RabbitGraphNode[] {
  if (nodes.length === 0) return [];

  const centerX = width / 2;
  const centerY = height / 2;

  if (mode === "timeline") {
    // Distribute horizontally by year
    const years = nodes.map((n) => n.year);
    const minYear = Math.min(...years, 2018);
    const maxYear = Math.max(...years, 2026);
    const yearSpan = Math.max(1, maxYear - minYear);

    const yearGroups: { [yr: number]: RabbitGraphNode[] } = {};
    nodes.forEach((n) => {
      yearGroups[n.year] = yearGroups[n.year] || [];
      yearGroups[n.year].push(n);
    });

    return nodes.map((node) => {
      const yearFraction = (node.year - minYear) / yearSpan;
      const x = 80 + yearFraction * (width - 160);
      const group = yearGroups[node.year];
      const indexInGroup = group.indexOf(node);
      const groupCount = group.length;
      
      const verticalSpread = Math.min(360, groupCount * 70);
      const startY = centerY - verticalSpread / 2 + 35;
      const y = groupCount === 1 ? centerY : startY + (indexInGroup / (groupCount - 1)) * verticalSpread;

      return {
        ...node,
        x,
        y,
      };
    });
  }

  // Force simulation initial layout: Seeds at center, types in orbital radii
  return nodes.map((node, i) => {
    if (node.isSeed) {
      // Place seeds near origin
      const angle = (i / Math.max(1, nodes.filter((n) => n.isSeed).length)) * Math.PI * 2;
      const r = node.isSeed && nodes.filter((n) => n.isSeed).length > 1 ? 50 : 0;
      return {
        ...node,
        x: centerX + Math.cos(angle) * r,
        y: centerY + Math.sin(angle) * r,
      };
    }

    let baseRadius = 160;
    let angleOffset = 0;

    if (node.nodeType === "earlier") {
      baseRadius = 220;
      angleOffset = Math.PI * 0.8; // Left/upper hemisphere
    } else if (node.nodeType === "later") {
      baseRadius = 210;
      angleOffset = 0; // Right/lower hemisphere
    } else if (node.nodeType === "similar") {
      baseRadius = 150;
      angleOffset = Math.PI * 0.4;
    }

    const angle = angleOffset + ((i % 8) / 8) * Math.PI * 1.6 - Math.PI * 0.8;
    const jitter = (i % 3 - 1) * 20;

    return {
      ...node,
      x: centerX + Math.cos(angle) * (baseRadius + jitter),
      y: centerY + Math.sin(angle) * (baseRadius + jitter),
    };
  });
}
