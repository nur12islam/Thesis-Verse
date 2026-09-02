import React, { useState, useEffect } from "react";
import { Thesis, UserProfile, SearchHistoryItem } from "./types/thesis";
import { INITIAL_THESES } from "./data/thesesData";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { ToastContainer, ToastMessage } from "./components/Toast";
import { ThesisDetailModal } from "./components/ThesisDetailModal";
import { auth, onAuthStateChanged, db, doc, getDoc } from "./lib/firebase";

import { LandingPage } from "./pages/LandingPage";
import { SearchPage } from "./pages/SearchPage";
import { RareDiscoveryPage } from "./pages/RareDiscoveryPage";
import { ProposalBuilderPage } from "./pages/ProposalBuilderPage";
import { ComparePage } from "./pages/ComparePage";
import { LibraryPage } from "./pages/LibraryPage";
import { AiChatPage } from "./pages/AiChatPage";
import { AboutPage } from "./pages/AboutPage";
import { ProfilePage } from "./pages/ProfilePage";
import { AuthPage } from "./pages/AuthPage";
import { ContactPage } from "./pages/ContactPage";
import { AiResearchToolsPage } from "./pages/AiResearchToolsPage";
import { ResearchRabbitPage } from "./pages/ResearchRabbitPage";
import { AdminPage } from "./pages/AdminPage";
import { ApiDocsPage } from "./pages/ApiDocsPage";
import { LegalPage } from "./pages/LegalPage";
import { SrsDocsPage } from "./pages/SrsDocsPage";
import { NotFoundPage } from "./pages/NotFoundPage";

export default function App() {
  const [activeTab, setActiveTab] = useState<string>("landing");

  // Dark / Light Theme state
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    try {
      const storedTheme = localStorage.getItem("thesisverse_theme");
      if (storedTheme) return storedTheme === "dark";
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    } catch {
      return true;
    }
  });

  useEffect(() => {
    try {
      if (isDarkMode) {
        document.documentElement.classList.add("dark");
        localStorage.setItem("thesisverse_theme", "dark");
      } else {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("thesisverse_theme", "light");
      }
    } catch (e) {
      console.warn("Theme toggle error", e);
    }
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  // User Profile State
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    try {
      const stored = localStorage.getItem("thesisverse_user_profile");
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.warn("User profile parse error", e);
    }
    return null; // Not logged in by default
  });

  // Firebase Auth State Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        try {
          const userRef = doc(db, "users", fbUser.uid);
          const snap = await getDoc(userRef);
          if (snap.exists()) {
            const data = snap.data();
            const profile: UserProfile = {
              id: fbUser.uid,
              name: data.name || fbUser.displayName || "Academic Researcher",
              email: fbUser.email || "",
              avatar: data.avatar || fbUser.photoURL || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250",
              role: data.role || "Literature Researcher",
              universityAffiliation: data.universityAffiliation || "University of Edinburgh",
              researchBranch: data.researchBranch || "Comparative Literature & Hermeneutics",
              bio: data.bio || "",
              savedCount: data.savedCount || 0,
              theme: (data.theme as "dark" | "light") || "dark",
              citationFormatPreference: (data.citationFormatPreference as "MLA" | "APA" | "Chicago" | "BibTeX") || "MLA",
            };
            setCurrentUser(profile);
            localStorage.setItem("thesisverse_user_profile", JSON.stringify(profile));
          }
        } catch (err) {
          console.warn("Error fetching Firebase user profile on state change:", err);
        }
      } else {
        const stored = localStorage.getItem("thesisverse_user_profile");
        if (!stored) {
          setCurrentUser(null);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  // Search History State
  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>(() => {
    try {
      const stored = localStorage.getItem("thesisverse_search_history");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("thesisverse_search_history", JSON.stringify(searchHistory));
    } catch (e) {
      console.warn("Error saving search history", e);
    }
  }, [searchHistory]);

  // Local storage or memory persistence for library & compare lists
  const [savedTheses, setSavedTheses] = useState<Thesis[]>(() => {
    try {
      const stored = localStorage.getItem("thesisverse_saved");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [comparedTheses, setComparedTheses] = useState<Thesis[]>(() => {
    try {
      const stored = localStorage.getItem("thesisverse_compared");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDetailsThesis, setSelectedDetailsThesis] = useState<Thesis | null>(null);
  const [proposalInitialThesis, setProposalInitialThesis] = useState<Thesis | null>(null);

  // Toast system
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (title: string, message?: string, type: "success" | "error" | "info" = "info") => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Sync state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("thesisverse_saved", JSON.stringify(savedTheses));
      setCurrentUser((prev) => ({ ...prev, savedCount: savedTheses.length }));
    } catch (e) {
      console.warn("LocalStorage save error", e);
    }
  }, [savedTheses]);

  useEffect(() => {
    try {
      localStorage.setItem("thesisverse_compared", JSON.stringify(comparedTheses));
    } catch (e) {
      console.warn("LocalStorage compare error", e);
    }
  }, [comparedTheses]);

  const savedIds = new Set(savedTheses.map((t) => t.id));
  const comparedIds = new Set(comparedTheses.map((t) => t.id));

  // Toggle Save / Bookmark
  const handleToggleSave = (thesis: Thesis) => {
    if (savedIds.has(thesis.id)) {
      setSavedTheses(savedTheses.filter((t) => t.id !== thesis.id));
      addToast("Removed from Library", `"${thesis.title.slice(0, 30)}..."`, "info");
    } else {
      setSavedTheses([...savedTheses, thesis]);
      addToast("Saved to Library", `"${thesis.title.slice(0, 30)}..."`, "success");
    }
  };

  // Toggle Paper Comparison
  const handleToggleCompare = (thesis: Thesis) => {
    if (comparedIds.has(thesis.id)) {
      setComparedTheses(comparedTheses.filter((t) => t.id !== thesis.id));
      addToast("Removed from Comparison", "", "info");
    } else {
      if (comparedTheses.length >= 4) {
        addToast("Comparison Limit Reached", "You can compare up to 4 papers simultaneously.", "error");
        return;
      }
      setComparedTheses([...comparedTheses, thesis]);
      addToast("Added to Comparison Matrix", "Navigate to 'Compare Papers' tab to view.", "success");
    }
  };

  // Build Proposal from Thesis
  const handleBuildProposal = (thesis: Thesis) => {
    setProposalInitialThesis(thesis);
    setActiveTab("proposal");
    addToast("Loaded into Proposal Builder", `Topic: ${thesis.title.slice(0, 35)}...`, "info");
  };

  // Copy Citation Quick
  const handleCiteQuick = (thesis: Thesis) => {
    const citeStr = `${thesis.authors.join(", ")} (${thesis.year}). ${thesis.title} (Doctoral dissertation, ${thesis.university}). https://doi.org/${thesis.doi}`;
    navigator.clipboard.writeText(citeStr);
    addToast("APA Citation Copied", citeStr, "success");
  };

  // Execute Search from topic/category
  const handleSearchTopic = (q: string) => {
    setSearchQuery(q);
    if (q.trim()) {
      const newItem: SearchHistoryItem = {
        id: "sh-" + Date.now(),
        query: q.trim(),
        subject: "General Search",
        timestamp: "Just now",
        resultsCount: 12,
      };
      setSearchHistory((prev) => [newItem, ...prev.filter((item) => item.query !== q.trim())]);
    }
  };

  const handleClearHistory = () => {
    setSearchHistory([]);
    addToast("Search History Cleared", "", "info");
  };

  const [rabbitSeedThesis, setRabbitSeedThesis] = useState<Thesis | null>(null);

  const handleExploreRabbit = (thesis: Thesis) => {
    setRabbitSeedThesis(thesis);
    setActiveTab("rabbit");
    addToast("Opened in Literature Graph", `Exploring network for "${thesis.title.slice(0, 30)}..."`, "info");
  };

  // All Rare Theses list
  const rareThesesList: Thesis[] = [
    INITIAL_THESES[0],
    INITIAL_THESES[1],
    INITIAL_THESES[3],
    INITIAL_THESES[4],
    INITIAL_THESES[5],
  ];

  return (
    <div className="min-h-screen bg-slate-100/60 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white transition-colors">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        savedCount={savedTheses.length}
        compareCount={comparedTheses.length}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSearchSubmit={() => {
          handleSearchTopic(searchQuery);
          setActiveTab("search");
        }}
        isDarkMode={isDarkMode}
        onToggleTheme={toggleTheme}
        currentUser={currentUser}
      />

      {/* Main View Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {activeTab === "landing" && (
          <LandingPage
            rareTheses={rareThesesList}
            onSearchTopic={(q) => handleSearchTopic(q)}
            onSearchCategory={(cat) => handleSearchTopic(cat)}
            setActiveTab={setActiveTab}
            savedIds={savedIds}
            comparedIds={comparedIds}
            onToggleSave={handleToggleSave}
            onToggleCompare={handleToggleCompare}
            onSelectDetails={(t) => setSelectedDetailsThesis(t)}
            onBuildProposal={handleBuildProposal}
            onCite={handleCiteQuick}
          />
        )}

        {activeTab === "search" && (
          <SearchPage
            initialQuery={searchQuery}
            savedIds={savedIds}
            comparedIds={comparedIds}
            onToggleSave={handleToggleSave}
            onToggleCompare={handleToggleCompare}
            onSelectDetails={(t) => setSelectedDetailsThesis(t)}
            onBuildProposal={handleBuildProposal}
            onCite={handleCiteQuick}
            onShowToast={addToast}
          />
        )}

        {activeTab === "rare" && (
          <RareDiscoveryPage
            savedIds={savedIds}
            onToggleSave={handleToggleSave}
            onBuildProposal={handleBuildProposal}
            onShowToast={addToast}
          />
        )}

        {activeTab === "proposal" && (
          <ProposalBuilderPage
            initialThesis={proposalInitialThesis}
            onShowToast={addToast}
          />
        )}

        {activeTab === "compare" && (
          <ComparePage
            comparedTheses={comparedTheses}
            onRemoveCompare={(t) => handleToggleCompare(t)}
            onClearCompare={() => setComparedTheses([])}
            onSelectDetails={(t) => setSelectedDetailsThesis(t)}
            onShowToast={addToast}
          />
        )}

        {activeTab === "library" && (
          <LibraryPage
            currentUser={currentUser}
            savedTheses={savedTheses}
            comparedIds={comparedIds}
            onToggleSave={handleToggleSave}
            onToggleCompare={handleToggleCompare}
            onSelectDetails={(t) => setSelectedDetailsThesis(t)}
            onBuildProposal={handleBuildProposal}
            onCite={handleCiteQuick}
            onShowToast={addToast}
          />
        )}

        {activeTab === "chat" && (
          <AiChatPage savedTheses={savedTheses} onShowToast={addToast} />
        )}

        {activeTab === "profile" && (
          <ProfilePage
            user={currentUser}
            setUser={setCurrentUser}
            searchHistory={searchHistory}
            onClearHistory={handleClearHistory}
            onSearchTopic={(q) => {
              handleSearchTopic(q);
              setActiveTab("search");
            }}
            setActiveTab={setActiveTab}
            isDarkMode={isDarkMode}
            onToggleTheme={toggleTheme}
          />
        )}

        {activeTab === "auth" && (
          <AuthPage
            onLoginSuccess={(u) => {
              setCurrentUser(u);
              addToast("Welcome back!", `Logged in as ${u.name}`, "success");
            }}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === "ai-tools" && (
          <AiResearchToolsPage
            savedTheses={savedTheses}
            comparedTheses={comparedTheses}
            onRemoveCompare={(t) => handleToggleCompare(t)}
            onClearCompare={() => setComparedTheses([])}
            onSelectDetails={(t) => setSelectedDetailsThesis(t)}
            onShowToast={addToast}
          />
        )}

        {activeTab === "rabbit" && (
          <ResearchRabbitPage
            initialSeedThesis={rabbitSeedThesis}
            savedIds={savedIds}
            onToggleSave={handleToggleSave}
            onBuildProposal={handleBuildProposal}
            onShowToast={addToast}
          />
        )}

        {activeTab === "admin" && (
          <AdminPage
            currentUser={currentUser}
            onShowToast={addToast}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === "api-docs" && <ApiDocsPage />}

        {activeTab === "srs" && <SrsDocsPage />}

        {activeTab === "legal" && <LegalPage />}

        {activeTab === "about" && <AboutPage />}

        {activeTab === "contact" && <ContactPage />}

        {![
          "landing",
          "search",
          "rabbit",
          "rare",
          "proposal",
          "compare",
          "library",
          "chat",
          "profile",
          "auth",
          "about",
          "contact",
          "ai-tools",
          "admin",
          "api-docs",
          "srs",
          "legal",
        ].includes(activeTab) && <NotFoundPage setActiveTab={setActiveTab} />}
      </main>

      {/* Footer */}
      <Footer setActiveTab={setActiveTab} currentUser={currentUser} />

      {/* Thesis Detail Modal */}
      <ThesisDetailModal
        thesis={selectedDetailsThesis}
        onClose={() => setSelectedDetailsThesis(null)}
        isSaved={selectedDetailsThesis ? savedIds.has(selectedDetailsThesis.id) : false}
        onToggleSave={handleToggleSave}
        onBuildProposal={handleBuildProposal}
        onExploreRabbit={handleExploreRabbit}
        onShowToast={addToast}
      />

      {/* Toast Notification Container */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </div>
  );
}
