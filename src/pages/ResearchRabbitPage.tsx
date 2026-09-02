import React, { useState, useEffect, useMemo } from "react";
import { Thesis, RabbitCollection, RabbitBreadcrumb, RabbitGraphNode, RabbitSynthesisReport } from "../types/thesis";
import { INITIAL_THESES } from "../data/thesesData";
import { DEFAULT_RABBIT_COLLECTIONS, computeRabbitGraph } from "../lib/rabbitGraphEngine";
import { fetchRabbitSynthesis } from "../services/api";
import { RabbitVisualGraph } from "../components/rabbit/RabbitVisualGraph";
import { RabbitCollectionsSidebar } from "../components/rabbit/RabbitCollectionsSidebar";
import { RabbitExplorationHub } from "../components/rabbit/RabbitExplorationHub";
import { RabbitPaperInspector } from "../components/rabbit/RabbitPaperInspector";
import {
  Sparkles,
  Compass,
  Download,
  Folder,
  Layers,
  Share2,
  Maximize2,
  SplitSquareVertical,
  ChevronRight,
  RotateCcw,
  BookOpen,
  Zap,
  Info,
  Network
} from "lucide-react";

interface ResearchRabbitPageProps {
  initialSeedThesis?: Thesis | null;
  savedIds: Set<string>;
  onToggleSave: (thesis: Thesis) => void;
  onBuildProposal: (thesis: Thesis) => void;
  onShowToast: (title: string, message?: string, type?: "success" | "error" | "info") => void;
}

export const ResearchRabbitPage: React.FC<ResearchRabbitPageProps> = ({
  initialSeedThesis,
  savedIds,
  onToggleSave,
  onBuildProposal,
  onShowToast,
}) => {
  // Collections state
  const [collections, setCollections] = useState<RabbitCollection[]>(() => {
    try {
      const stored = localStorage.getItem("thesisverse_rabbit_collections");
      return stored ? JSON.parse(stored) : DEFAULT_RABBIT_COLLECTIONS;
    } catch {
      return DEFAULT_RABBIT_COLLECTIONS;
    }
  });

  const [activeCollectionId, setActiveCollectionId] = useState<string>(() => {
    return collections[0]?.id || "col-ai-quantum";
  });

  // Breadcrumbs navigation trail
  const [breadcrumbs, setBreadcrumbs] = useState<RabbitBreadcrumb[]>([
    { id: "bc-root", label: "ResearchRabbit Universe", type: "collection", targetId: activeCollectionId }
  ]);

  // Active Exploration Tab
  const [activeTab, setActiveTab] = useState<"similar" | "earlier" | "later" | "authors" | "synthesis">("similar");

  // Selected Node / Paper Inspector
  const [selectedThesis, setSelectedThesis] = useState<Thesis | null>(null);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  // View Layout mode: "split" (Graph + Hub + Inspector) vs "graph-focus" vs "list-focus"
  const [layoutMode, setLayoutMode] = useState<"split" | "graph-focus" | "list-focus">("split");

  // AI Synthesis state
  const [synthesisReport, setSynthesisReport] = useState<RabbitSynthesisReport | null>(null);
  const [loadingSynthesis, setLoadingSynthesis] = useState(false);

  // Sync collections to local storage
  useEffect(() => {
    try {
      localStorage.setItem("thesisverse_rabbit_collections", JSON.stringify(collections));
    } catch (e) {
      console.warn("Error saving collections to localStorage", e);
    }
  }, [collections]);

  const activeCollection = useMemo(() => {
    return collections.find((c) => c.id === activeCollectionId) || collections[0];
  }, [collections, activeCollectionId]);

  // If initialSeedThesis was passed from another page, add to collection or select it
  useEffect(() => {
    if (initialSeedThesis) {
      setCollections((prev) =>
        prev.map((col) => {
          if (col.id === activeCollectionId) {
            if (!col.seedIds.includes(initialSeedThesis.id)) {
              return { ...col, seedIds: [initialSeedThesis.id, ...col.seedIds] };
            }
          }
          return col;
        })
      );
      setSelectedThesis(initialSeedThesis);
      setSelectedNodeId(initialSeedThesis.id);
      onShowToast("Loaded Seed in Literature Graph", `Exploring network for "${initialSeedThesis.title.slice(0, 30)}..."`, "info");
    }
  }, [initialSeedThesis]);

  // Get active seed theses objects
  const seedTheses = useMemo(() => {
    if (!activeCollection) return [INITIAL_THESES[0]];
    const seeds = INITIAL_THESES.filter((t) => activeCollection.seedIds?.includes(t.id));
    return seeds.length > 0 ? seeds : [INITIAL_THESES[0]];
  }, [activeCollection]);

  // Compute the full ResearchRabbit graph universe
  const literatureUniverse = useMemo(() => {
    return computeRabbitGraph(seedTheses, INITIAL_THESES);
  }, [seedTheses]);

  // Set default selected thesis if none
  useEffect(() => {
    if (!selectedThesis && seedTheses.length > 0) {
      setSelectedThesis(seedTheses[0]);
      setSelectedNodeId(seedTheses[0].id);
    }
  }, [seedTheses, selectedThesis]);

  // Trigger AI synthesis when seeds change or user requests
  const handleGenerateSynthesis = async () => {
    setLoadingSynthesis(true);
    try {
      const seedTitles = seedTheses.map((s) => s.title);
      const relatedTitles = [
        ...literatureUniverse.similarTheses.slice(0, 3).map((t) => t.title),
        ...literatureUniverse.earlierTheses.slice(0, 2).map((t) => t.title),
        ...literatureUniverse.laterTheses.slice(0, 2).map((t) => t.title),
      ];

      const res = await fetchRabbitSynthesis({
        seedTitles,
        relatedTitles,
        subject: seedTheses[0]?.subject || "Interdisciplinary",
      });
      setSynthesisReport(res);
      onShowToast("Literature Synthesis Updated", "Generated multi-thesis gap intelligence", "success");
    } catch (err) {
      console.warn("Failed to fetch synthesis report:", err);
      // Fallback
      setSynthesisReport({
        thematicSummary: `The active research collection bridges ${seedTheses[0]?.subject} foundations with computational evaluation.`,
        methodologicalTrajectory: "Transitioning from heuristic baselines to scalable multimodal algorithmic validation.",
        identifiedGaps: [
          "Limited real-world benchmark stress testing in out-of-distribution environments.",
          "Need for unified comparative frameworks across heterogeneous data modalities."
        ],
        recommendedHypotheses: [
          "Domain-constrained neural operator formulation reduces latency while preserving empirical precision."
        ],
        keyPioneers: seedTheses[0]?.authors || ["Dr. Eleanor Vance"],
        citationEcosystem: {
          earliestAnchorYear: 2019,
          peakActivityYear: 2024,
          interdisciplinaryOverlapPct: 85
        }
      });
    } finally {
      setLoadingSynthesis(false);
    }
  };

  // Initial synthesis load
  useEffect(() => {
    if (!synthesisReport) {
      handleGenerateSynthesis();
    }
  }, [seedTheses]);

  // Collection Handlers
  const handleCreateCollection = (name: string, description: string, color: string) => {
    const newCol: RabbitCollection = {
      id: `col-${Date.now()}`,
      name,
      description,
      color,
      seedIds: [INITIAL_THESES[0].id],
      createdAt: new Date().toISOString().split("T")[0],
      updatedAt: new Date().toISOString().split("T")[0],
    };
    setCollections((prev) => [newCol, ...prev]);
    setActiveCollectionId(newCol.id);
    setBreadcrumbs([
      { id: "bc-root", label: "ResearchRabbit Universe", type: "collection" },
      { id: `bc-${newCol.id}`, label: newCol.name, type: "collection", targetId: newCol.id }
    ]);
  };

  const handleDeleteCollection = (id: string) => {
    if (collections.length <= 1) return;
    setCollections((prev) => prev.filter((c) => c.id !== id));
    if (activeCollectionId === id) {
      const remaining = collections.filter((c) => c.id !== id);
      setActiveCollectionId(remaining[0]?.id || "col-ai-quantum");
    }
    onShowToast("Collection Deleted", "", "info");
  };

  const handleAddSeedToActiveCollection = (thesis: Thesis) => {
    setCollections((prev) =>
      prev.map((col) => {
        if (col.id === activeCollectionId) {
          if (!col.seedIds.includes(thesis.id)) {
            return { ...col, seedIds: [...col.seedIds, thesis.id], updatedAt: new Date().toISOString().split("T")[0] };
          }
        }
        return col;
      })
    );
  };

  const handleRemoveSeedFromActiveCollection = (thesisId: string) => {
    setCollections((prev) =>
      prev.map((col) => {
        if (col.id === activeCollectionId) {
          return { ...col, seedIds: col.seedIds.filter((id) => id !== thesisId) };
        }
        return col;
      })
    );
  };

  // Pivot / Follow Rabbit Hole
  const handlePivotExplore = (thesis: Thesis) => {
    handleAddSeedToActiveCollection(thesis);
    setSelectedThesis(thesis);
    setSelectedNodeId(thesis.id);
    setBreadcrumbs((prev) => [
      ...prev,
      {
        id: `bc-hop-${Date.now()}`,
        label: thesis.title.length > 25 ? `${thesis.title.slice(0, 23)}...` : thesis.title,
        type: "paper",
        targetId: thesis.id,
      }
    ]);
  };

  const handleSelectNodeFromGraph = (node: RabbitGraphNode) => {
    setSelectedNodeId(node.id);
    const target = INITIAL_THESES.find((t) => t.id === node.id);
    if (target) {
      setSelectedThesis(target);
    }
  };

  // Batch Export Bibliography
  const handleBatchExport = (format: "bib" | "ris" | "txt") => {
    const allRelevant = [...seedTheses, ...literatureUniverse.similarTheses, ...literatureUniverse.earlierTheses];
    let content = "";
    if (format === "bib") {
      content = allRelevant.map((t) => t.bibtex || `@article{ref_${t.id},\n  title={${t.title}},\n  author={${t.authors.join(" and ")}},\n  year={${t.year}}\n}`).join("\n\n");
    } else if (format === "ris") {
      content = allRelevant.map((t) => `TY  - THES\nTI  - ${t.title}\nAU  - ${t.authors[0]}\nPY  - ${t.year}\nPB  - ${t.university}\nER  -`).join("\n\n");
    } else {
      content = allRelevant.map((t, idx) => `[${idx + 1}] ${t.authors.join(", ")} (${t.year}). ${t.title}. ${t.university}. https://doi.org/${t.doi}`).join("\n\n");
    }

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `researchrabbit_collection_${activeCollection?.name.replace(/[^a-zA-Z0-9]/g, "_").toLowerCase()}.${format}`;
    a.click();
    URL.revokeObjectURL(url);
    onShowToast("Collection Exported", `Exported ${allRelevant.length} papers in ${format.toUpperCase()} format`, "success");
  };

  const isSelectedSaved = selectedThesis ? savedIds.has(selectedThesis.id) : false;
  const isSelectedSeed = selectedThesis ? activeCollection.seedIds?.includes(selectedThesis.id) : false;

  return (
    <div className="space-y-4 pb-12">
      {/* Top Banner & Breadcrumbs Header */}
      <div className="p-4 sm:p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-950 text-white shadow-md border border-indigo-500/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-indigo-300 text-xs font-extrabold uppercase tracking-wider">
            <span className="w-5 h-5 rounded-lg bg-indigo-500/30 flex items-center justify-center text-amber-300">
              🐇
            </span>
            ResearchRabbit Literature Intelligence
          </div>

          <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            Visual Literature Mapping & Cascading Discovery
          </h1>

          {/* Breadcrumb Rabbit Hole trail */}
          <div className="flex items-center gap-1.5 overflow-x-auto text-xs text-slate-300 pt-1 scrollbar-none">
            {breadcrumbs.map((bc, idx) => (
              <React.Fragment key={bc.id}>
                {idx > 0 && <ChevronRight className="w-3.5 h-3.5 text-slate-500 shrink-0" />}
                <button
                  onClick={() => {
                    setBreadcrumbs((prev) => prev.slice(0, idx + 1));
                    if (bc.targetId) {
                      const found = INITIAL_THESES.find((t) => t.id === bc.targetId);
                      if (found) {
                        setSelectedThesis(found);
                        setSelectedNodeId(found.id);
                      }
                    }
                  }}
                  className={`hover:text-indigo-300 transition-colors truncate max-w-[200px] ${
                    idx === breadcrumbs.length - 1 ? "font-bold text-indigo-400" : "text-slate-400"
                  }`}
                >
                  {bc.label}
                </button>
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Top Actions: Layout Mode & Batch Export */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center bg-slate-950/80 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setLayoutMode("split")}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                layoutMode === "split" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-white"
              }`}
              title="Split View (Graph + Explorer)"
            >
              Split View
            </button>
            <button
              onClick={() => setLayoutMode("graph-focus")}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                layoutMode === "graph-focus" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-white"
              }`}
              title="Graph Fullscreen"
            >
              Graph Only
            </button>
            <button
              onClick={() => setLayoutMode("list-focus")}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                layoutMode === "list-focus" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-white"
              }`}
              title="Hub Fullscreen"
            >
              Hub Only
            </button>
          </div>

          <button
            onClick={() => handleBatchExport("bib")}
            className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all"
          >
            <Download className="w-3.5 h-3.5" /> Export BibTeX
          </button>
        </div>
      </div>

      {/* Main 3-Column Cascading Grid ("Spotify for Papers" Architecture) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* COLUMN 1: Collections & Seed Papers Sidebar (3 Cols) */}
        <div className="lg:col-span-3 h-[720px] sticky top-20">
          <RabbitCollectionsSidebar
            collections={collections}
            activeCollectionId={activeCollectionId}
            onSelectCollection={(id) => {
              setActiveCollectionId(id);
              const foundCol = collections.find((c) => c.id === id);
              if (foundCol) {
                setBreadcrumbs([
                  { id: "bc-root", label: "ResearchRabbit Universe", type: "collection" },
                  { id: `bc-${foundCol.id}`, label: foundCol.name, type: "collection", targetId: foundCol.id }
                ]);
              }
            }}
            onCreateCollection={handleCreateCollection}
            onDeleteCollection={handleDeleteCollection}
            seedTheses={seedTheses}
            allTheses={INITIAL_THESES}
            onAddSeed={handleAddSeedToActiveCollection}
            onRemoveSeed={handleRemoveSeedFromActiveCollection}
            onShowToast={onShowToast}
            onSelectDetails={(t) => {
              setSelectedThesis(t);
              setSelectedNodeId(t.id);
            }}
          />
        </div>

        {/* COLUMN 2: Exploration Hub ("Spotify for Papers" Categories) (4 Cols in Split, 9 in List-Focus) */}
        <div
          className={`${
            layoutMode === "graph-focus"
              ? "hidden"
              : layoutMode === "list-focus"
              ? "lg:col-span-9"
              : "lg:col-span-4"
          } h-[720px] sticky top-20`}
        >
          <RabbitExplorationHub
            activeTab={activeTab}
            onChangeTab={setActiveTab}
            similarTheses={literatureUniverse.similarTheses}
            earlierTheses={literatureUniverse.earlierTheses}
            laterTheses={literatureUniverse.laterTheses}
            authors={literatureUniverse.authors}
            synthesisReport={synthesisReport}
            loadingSynthesis={loadingSynthesis}
            onRefreshSynthesis={handleGenerateSynthesis}
            onSelectThesis={(t) => {
              setSelectedThesis(t);
              setSelectedNodeId(t.id);
            }}
            onAddSeed={handleAddSeedToActiveCollection}
            onPivotExplore={handlePivotExplore}
            savedIds={savedIds}
            onToggleSave={onToggleSave}
            onShowToast={onShowToast}
            selectedNodeId={selectedNodeId}
          />
        </div>

        {/* COLUMN 3: Visual Graph OR Paper Inspector (5 Cols in Split, 9 in Graph-Focus) */}
        <div
          className={`${
            layoutMode === "list-focus"
              ? "hidden"
              : layoutMode === "graph-focus"
              ? "lg:col-span-9"
              : "lg:col-span-5"
          } h-[720px] flex flex-col gap-4 sticky top-20`}
        >
          {/* Visual Graph Box */}
          <div className="flex-1 h-full min-h-[360px]">
            <RabbitVisualGraph
              nodes={literatureUniverse.nodes}
              links={literatureUniverse.links}
              selectedNodeId={selectedNodeId}
              onSelectNode={handleSelectNodeFromGraph}
              onAddSeed={(id) => {
                const target = INITIAL_THESES.find((t) => t.id === id);
                if (target) handleAddSeedToActiveCollection(target);
              }}
              onExploreNode={(node) => {
                const target = INITIAL_THESES.find((t) => t.id === node.id);
                if (target) handlePivotExplore(target);
              }}
              allTheses={INITIAL_THESES}
            />
          </div>

          {/* Deep Dive Paper Inspector Drawer (below graph or overlay) */}
          {selectedThesis && (
            <div className="h-[340px]">
              <RabbitPaperInspector
                thesis={selectedThesis}
                onClose={() => setSelectedThesis(null)}
                isSeed={isSelectedSeed}
                onToggleSeed={(t) => {
                  if (isSelectedSeed) handleRemoveSeedFromActiveCollection(t.id);
                  else handleAddSeedToActiveCollection(t);
                }}
                onPivotExplore={handlePivotExplore}
                isSaved={isSelectedSaved}
                onToggleSave={onToggleSave}
                onBuildProposal={onBuildProposal}
                onShowToast={onShowToast}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
