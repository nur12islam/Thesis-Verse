import React, { useState, useEffect } from "react";
import { Thesis, UserProfile } from "../types/thesis";
import {
  SavedPaper,
  SavedIdeaItem,
  SavedProposalItem,
  WorkspaceCollection,
  WorkspaceTag,
  WorkspaceActivityItem,
  WorkspaceNotification,
  ReadingProgressStatus
} from "../types/workspace";
import {
  loadWorkspacePapers,
  saveWorkspacePapers,
  loadWorkspaceIdeas,
  saveWorkspaceIdeas,
  loadWorkspaceProposals,
  saveWorkspaceProposals,
  loadWorkspaceCollections,
  saveWorkspaceCollections,
  loadWorkspaceTags,
  saveWorkspaceTags,
  loadWorkspaceActivities,
  saveWorkspaceActivities,
  loadWorkspaceNotifications,
  saveWorkspaceNotifications,
  calculateWorkspaceStats
} from "../services/workspaceService";

import { WorkspaceSidebar } from "../components/workspace/WorkspaceSidebar";
import { WorkspaceDashboard } from "../components/workspace/WorkspaceDashboard";
import { WorkspaceLibraryView } from "../components/workspace/WorkspaceLibraryView";
import { WorkspaceInspector } from "../components/workspace/WorkspaceInspector";
import { WorkspaceCollectionsManager } from "../components/workspace/WorkspaceCollectionsManager";
import { WorkspaceImportExportModal } from "../components/workspace/WorkspaceImportExportModal";
import { WorkspaceSyncNotificationDrawer } from "../components/workspace/WorkspaceSyncNotificationDrawer";

interface LibraryPageProps {
  currentUser?: UserProfile | null;
  savedTheses: Thesis[];
  comparedIds: Set<string>;
  onToggleSave: (thesis: Thesis) => void;
  onToggleCompare: (thesis: Thesis) => void;
  onSelectDetails: (thesis: Thesis) => void;
  onBuildProposal: (thesis: Thesis) => void;
  onCite: (thesis: Thesis) => void;
  onShowToast: (title: string, message?: string, type?: "success" | "error" | "info") => void;
}

export const LibraryPage: React.FC<LibraryPageProps> = ({
  currentUser,
  savedTheses,
  comparedIds,
  onToggleSave,
  onToggleCompare,
  onSelectDetails,
  onBuildProposal,
  onCite,
  onShowToast,
}) => {
  // Primary View State
  const [activeView, setActiveView] = useState<string>("dashboard"); // 'dashboard' | 'papers' | 'theses' | 'ideas' | 'proposals'
  const [selectedCollectionId, setSelectedCollectionId] = useState<string | null>(null);
  const [selectedTagId, setSelectedTagId] = useState<string | null>(null);
  const [filterPinnedOnly, setFilterPinnedOnly] = useState<boolean>(false);
  const [filterFavoriteOnly, setFilterFavoriteOnly] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Workspace Data States
  const [papers, setPapers] = useState<SavedPaper[]>(() => loadWorkspacePapers());
  const [ideas, setIdeas] = useState<SavedIdeaItem[]>(() => loadWorkspaceIdeas());
  const [proposals, setProposals] = useState<SavedProposalItem[]>(() => loadWorkspaceProposals());
  const [collections, setCollections] = useState<WorkspaceCollection[]>(() => loadWorkspaceCollections());
  const [tags, setTags] = useState<WorkspaceTag[]>(() => loadWorkspaceTags());
  const [activities, setActivities] = useState<WorkspaceActivityItem[]>(() => loadWorkspaceActivities());
  const [notifications, setNotifications] = useState<WorkspaceNotification[]>(() => loadWorkspaceNotifications());

  // Modals & Inspector State
  const [selectedInspectorItem, setSelectedInspectorItem] = useState<{
    item: any;
    type: "paper" | "thesis" | "idea" | "proposal";
  } | null>(null);

  const [isCollectionsModalOpen, setIsCollectionsModalOpen] = useState(false);
  const [isImportExportModalOpen, setIsImportExportModalOpen] = useState(false);
  const [isSyncDrawerOpen, setIsSyncDrawerOpen] = useState(false);
  const [syncStatusText, setSyncStatusText] = useState("Synced to Cloud");

  // Sync state changes to LocalStorage
  useEffect(() => {
    saveWorkspacePapers(papers);
  }, [papers]);

  useEffect(() => {
    saveWorkspaceIdeas(ideas);
  }, [ideas]);

  useEffect(() => {
    saveWorkspaceProposals(proposals);
  }, [proposals]);

  useEffect(() => {
    saveWorkspaceCollections(collections);
  }, [collections]);

  useEffect(() => {
    saveWorkspaceTags(tags);
  }, [tags]);

  useEffect(() => {
    saveWorkspaceActivities(activities);
  }, [activities]);

  useEffect(() => {
    saveWorkspaceNotifications(notifications);
  }, [notifications]);

  // Sync external savedTheses with papers state
  useEffect(() => {
    if (savedTheses.length > 0) {
      setPapers((prev) => {
        const existingPaperIds = new Set(prev.map((p) => p.id));
        const existingThesisIds = new Set(prev.map((p) => p.thesis.id));
        const toAdd: SavedPaper[] = [];

        savedTheses.forEach((t) => {
          const newId = `sp-${t.id}`;
          if (!existingThesisIds.has(t.id) && !existingPaperIds.has(newId)) {
            existingThesisIds.add(t.id);
            existingPaperIds.add(newId);
            toAdd.push({
              id: newId,
              thesis: t,
              readingProgress: "unread",
              isPinned: false,
              isFavorite: true,
              tags: ["tag-important"],
              collectionIds: ["col-foundation"],
              notes: "",
              savedAt: new Date().toISOString(),
              lastViewedAt: new Date().toISOString(),
            });
          }
        });

        if (toAdd.length === 0) return prev;
        return [...toAdd, ...prev];
      });
    }
  }, [savedTheses]);

  // Stats calculation
  const stats = calculateWorkspaceStats(papers, ideas, proposals, collections);

  // Counts for sidebar badges
  const counts = {
    papers: papers.length,
    theses: papers.filter((p) => p.thesis.documentType === "Thesis" || p.thesis.documentType === "Dissertation").length,
    ideas: ideas.length,
    proposals: proposals.length,
    collections: collections.length,
    pinned: papers.filter((p) => p.isPinned).length + ideas.filter((i) => i.isPinned).length + proposals.filter((pr) => pr.isPinned).length,
    favorites: papers.filter((p) => p.isFavorite).length + ideas.filter((i) => i.isFavorite).length + proposals.filter((pr) => pr.isFavorite).length,
  };

  // Handlers for Item Actions
  const handleTogglePin = (id: string, type: "paper" | "thesis" | "idea" | "proposal") => {
    if (type === "paper" || type === "thesis") {
      setPapers((prev) =>
        prev.map((p) => (p.id === id ? { ...p, isPinned: !p.isPinned } : p))
      );
    } else if (type === "idea") {
      setIdeas((prev) =>
        prev.map((i) => (i.id === id ? { ...i, isPinned: !i.isPinned } : i))
      );
    } else if (type === "proposal") {
      setProposals((prev) =>
        prev.map((pr) => (pr.id === id ? { ...pr, isPinned: !pr.isPinned } : pr))
      );
    }
  };

  const handleToggleFavorite = (id: string, type: "paper" | "thesis" | "idea" | "proposal") => {
    if (type === "paper" || type === "thesis") {
      setPapers((prev) =>
        prev.map((p) => (p.id === id ? { ...p, isFavorite: !p.isFavorite } : p))
      );
    } else if (type === "idea") {
      setIdeas((prev) =>
        prev.map((i) => (i.id === id ? { ...i, isFavorite: !i.isFavorite } : i))
      );
    } else if (type === "proposal") {
      setProposals((prev) =>
        prev.map((pr) => (pr.id === id ? { ...pr, isFavorite: !pr.isFavorite } : pr))
      );
    }
  };

  const handleChangeProgress = (
    id: string,
    type: "paper" | "idea",
    progress: ReadingProgressStatus
  ) => {
    if (type === "paper") {
      setPapers((prev) =>
        prev.map((p) => (p.id === id ? { ...p, readingProgress: progress } : p))
      );
      onShowToast("Reading Progress Updated", `Status set to ${progress.toUpperCase()}`, "info");
    }
  };

  const handleDeleteItem = (id: string, type: "paper" | "thesis" | "idea" | "proposal") => {
    if (type === "paper" || type === "thesis") {
      const target = papers.find((p) => p.id === id);
      setPapers((prev) => prev.filter((p) => p.id !== id));
      if (target?.thesis) onToggleSave(target.thesis);
      onShowToast("Removed from Library", "Item deleted from workspace.", "info");
    } else if (type === "idea") {
      setIdeas((prev) => prev.filter((i) => i.id !== id));
      onShowToast("Idea Deleted", "", "info");
    } else if (type === "proposal") {
      setProposals((prev) => prev.filter((pr) => pr.id !== id));
      onShowToast("Proposal Deleted", "", "info");
    }

    if (selectedInspectorItem?.item.id === id) {
      setSelectedInspectorItem(null);
    }
  };

  const handleSaveNotes = (id: string, type: string, notesContent: string) => {
    if (type === "paper" || type === "thesis") {
      setPapers((prev) =>
        prev.map((p) => (p.id === id ? { ...p, notes: notesContent } : p))
      );
    } else if (type === "idea") {
      setIdeas((prev) =>
        prev.map((i) => (i.id === id ? { ...i, notes: notesContent } : i))
      );
    } else if (type === "proposal") {
      setProposals((prev) =>
        prev.map((pr) => (pr.id === id ? { ...pr, notes: notesContent } : pr))
      );
    }
  };

  const handleToggleTagOnItem = (itemId: string, itemType: string, tagId: string) => {
    if (itemType === "paper" || itemType === "thesis") {
      setPapers((prev) =>
        prev.map((p) => {
          if (p.id === itemId) {
            const hasTag = p.tags.includes(tagId);
            const newTags = hasTag ? p.tags.filter((t) => t !== tagId) : [...p.tags, tagId];
            return { ...p, tags: newTags };
          }
          return p;
        })
      );
    }
  };

  const handleToggleCollectionOnItem = (itemId: string, itemType: string, collectionId: string) => {
    if (itemType === "paper" || itemType === "thesis") {
      setPapers((prev) =>
        prev.map((p) => {
          if (p.id === itemId) {
            const hasCol = p.collectionIds.includes(collectionId);
            const newCols = hasCol
              ? p.collectionIds.filter((c) => c !== collectionId)
              : [...p.collectionIds, collectionId];
            return { ...p, collectionIds: newCols };
          }
          return p;
        })
      );

      // update collection itemIds array as well
      setCollections((prev) =>
        prev.map((col) => {
          if (col.id === collectionId) {
            const hasItem = col.itemIds.includes(itemId);
            const newItems = hasItem
              ? col.itemIds.filter((i) => i !== itemId)
              : [...col.itemIds, itemId];
            return { ...col, itemIds: newItems };
          }
          return col;
        })
      );
    }
  };

  const handleCreateCollection = (
    col: Omit<WorkspaceCollection, "id" | "createdAt" | "itemIds">
  ) => {
    const newCollection: WorkspaceCollection = {
      ...col,
      id: `col-${Date.now()}`,
      createdAt: new Date().toISOString().split("T")[0],
      itemIds: [],
    };
    setCollections((prev) => [...prev, newCollection]);
    onShowToast("Collection Created", `"${newCollection.name}" added to sidebar.`, "success");
  };

  const handleDeleteCollection = (id: string) => {
    setCollections((prev) => prev.filter((c) => c.id !== id));
    if (selectedCollectionId === id) setSelectedCollectionId(null);
    onShowToast("Collection Deleted", "", "info");
  };

  const handleImportSuccess = (importedPapers: SavedPaper[]) => {
    setPapers((prev) => [...importedPapers, ...prev]);
  };

  const handleDuplicateProposal = (item: SavedProposalItem) => {
    const dup: SavedProposalItem = {
      ...item,
      id: `prop-dup-${Date.now()}`,
      proposal: {
        ...item.proposal,
        id: `prop-dup-${Date.now()}`,
        title: `${item.proposal.title} (Copy)`,
      },
      updatedAt: new Date().toISOString(),
    };
    setProposals((prev) => [dup, ...prev]);
    onShowToast("Proposal Duplicated", `Created copy of "${item.proposal.title}"`, "success");
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 pb-20 relative">
      {/* 1. Left Sidebar */}
      <WorkspaceSidebar
        activeView={activeView}
        onSelectView={(v) => {
          setActiveView(v);
          setFilterPinnedOnly(false);
          setFilterFavoriteOnly(false);
        }}
        selectedCollectionId={selectedCollectionId}
        onSelectCollection={(colId) => {
          setSelectedCollectionId(colId);
          if (colId && activeView === "dashboard") setActiveView("papers");
        }}
        selectedTagId={selectedTagId}
        onSelectTag={(tagId) => {
          setSelectedTagId(tagId);
          if (tagId && activeView === "dashboard") setActiveView("papers");
        }}
        filterPinnedOnly={filterPinnedOnly}
        onTogglePinnedOnly={() => {
          setFilterPinnedOnly(!filterPinnedOnly);
          if (activeView === "dashboard") setActiveView("papers");
        }}
        filterFavoriteOnly={filterFavoriteOnly}
        onToggleFavoriteOnly={() => {
          setFilterFavoriteOnly(!filterFavoriteOnly);
          if (activeView === "dashboard") setActiveView("papers");
        }}
        collections={collections}
        tags={tags}
        counts={counts}
        onOpenCreateCollection={() => setIsCollectionsModalOpen(true)}
        onOpenImportExport={() => setIsImportExportModalOpen(true)}
        onOpenSyncDrawer={() => setIsSyncDrawerOpen(true)}
        syncStatusText={syncStatusText}
      />

      {/* 2. Center Panel View Container */}
      <div className="flex-1 min-w-0">
        {activeView === "dashboard" && !selectedCollectionId && !selectedTagId && !filterPinnedOnly && !filterFavoriteOnly ? (
          <WorkspaceDashboard
            stats={stats}
            papers={papers}
            ideas={ideas}
            proposals={proposals}
            collections={collections}
            recentSearches={["Quantum Neural Operators", "Optogenetics", "Synaptic Plasticity"]}
            userName={currentUser?.name || "Academic Researcher"}
            onSelectView={setActiveView}
            onSelectItem={(item, type) => setSelectedInspectorItem({ item, type })}
            onExecuteSearch={(q) => {
              setSearchQuery(q);
              setActiveView("papers");
            }}
            onOpenCreateCollection={() => setIsCollectionsModalOpen(true)}
            onOpenImportExport={() => setIsImportExportModalOpen(true)}
          />
        ) : (
          <WorkspaceLibraryView
            viewType={
              activeView === "dashboard" ? "papers" : (activeView as "papers" | "theses" | "ideas" | "proposals")
            }
            papers={papers}
            ideas={ideas}
            proposals={proposals}
            collections={collections}
            tags={tags}
            selectedCollectionId={selectedCollectionId}
            selectedTagId={selectedTagId}
            filterPinnedOnly={filterPinnedOnly}
            filterFavoriteOnly={filterFavoriteOnly}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onSelectItem={(item, type) => setSelectedInspectorItem({ item, type })}
            onTogglePin={handleTogglePin}
            onToggleFavorite={handleToggleFavorite}
            onChangeProgress={handleChangeProgress}
            onDeleteItem={handleDeleteItem}
            onBuildProposalFromIdea={(item) => {
              if (item.idea) {
                const dummyThesis: any = {
                  id: item.idea.id,
                  title: item.idea.title,
                  university: "AI Studio Research Engine",
                  authors: ["Rare Thesis Generator"],
                  year: 2026,
                  abstract: item.idea.description,
                  subject: item.idea.subject,
                  degree: item.idea.suggestedDegree,
                  doi: "10.1016/rare.2026",
                };
                onBuildProposal(dummyThesis);
              }
            }}
            onOpenProposal={(propItem) => {
              if (propItem.proposal) {
                const dummyThesis: any = {
                  id: propItem.proposal.id,
                  title: propItem.proposal.title,
                  university: propItem.proposal.targetUniversity || "Graduate School",
                  authors: ["Research Author"],
                  year: 2026,
                  abstract: propItem.proposal.background?.context || "",
                  subject: propItem.proposal.subject,
                  degree: propItem.proposal.degree,
                  doi: "10.1016/prop.2026",
                };
                onBuildProposal(dummyThesis);
              }
            }}
            onDuplicateProposal={handleDuplicateProposal}
            onShowToast={onShowToast}
          />
        )}
      </div>

      {/* 3. Right Inspector Panel */}
      <WorkspaceInspector
        selectedItem={selectedInspectorItem}
        onClose={() => setSelectedInspectorItem(null)}
        collections={collections}
        tags={tags}
        onSaveNotes={handleSaveNotes}
        onToggleTagOnItem={handleToggleTagOnItem}
        onToggleCollectionOnItem={handleToggleCollectionOnItem}
        onBuildProposal={(item) => {
          const thesisObj = item.thesis || {
            id: item.id,
            title: item.title || item.idea?.title || "Research Topic",
            university: "Graduate School",
            authors: ["Author"],
            year: 2026,
            abstract: item.notes || "Proposal topic",
            subject: "Computer Science",
            degree: "Ph.D.",
            doi: "10.1016/prop.2026",
          };
          onBuildProposal(thesisObj);
        }}
        onShowToast={onShowToast}
      />

      {/* 4. Modals & Drawers */}
      <WorkspaceCollectionsManager
        isOpen={isCollectionsModalOpen}
        onClose={() => setIsCollectionsModalOpen(false)}
        collections={collections}
        onCreateCollection={handleCreateCollection}
        onDeleteCollection={handleDeleteCollection}
      />

      <WorkspaceImportExportModal
        isOpen={isImportExportModalOpen}
        onClose={() => setIsImportExportModalOpen(false)}
        papers={papers}
        ideas={ideas}
        proposals={proposals}
        collections={collections}
        onImportSuccess={handleImportSuccess}
        onShowToast={onShowToast}
      />

      <WorkspaceSyncNotificationDrawer
        isOpen={isSyncDrawerOpen}
        onClose={() => setIsSyncDrawerOpen(false)}
        notifications={notifications}
        onMarkNotificationRead={(id) =>
          setNotifications((prev) =>
            prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
          )
        }
        onClearAllNotifications={() => setNotifications([])}
        syncStatusText={syncStatusText}
        onForceSync={() => {
          setSyncStatusText("Syncing...");
          setTimeout(() => setSyncStatusText("Synced to Cloud"), 600);
        }}
        onShowToast={onShowToast}
      />
    </div>
  );
};
