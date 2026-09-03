import React, { useState, useEffect } from "react";
import { Thesis, UserProfile, SearchHistoryItem } from "./types/thesis";
import { INITIAL_THESES } from "./data/thesesData";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { ToastContainer, ToastMessage } from "./components/Toast";
import { ThesisDetailModal } from "./components/ThesisDetailModal";
import { auth, onAuthStateChanged, db, doc, getDoc } from "./lib/firebase";
import { LandingPage } from "./pages/LandingPage";
import { AdvancedResearchExplorerPage } from "./pages/AdvancedResearchExplorerPage";
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
import { DeepSearchButton } from "./components/DeepSearchButton";

const HISTORY_KEY = "thesisVerseTab";

export default function App() {
  const [activeTab, setActiveTab] = useState<string>(() => { const state = window.history.state; return state?.[HISTORY_KEY] || "landing"; });
  useEffect(() => { if (!window.history.state?.[HISTORY_KEY]) window.history.replaceState({ [HISTORY_KEY]: "landing" }, "", window.location.href); const handlePopState = (event: PopStateEvent) => setActiveTab(event.state?.[HISTORY_KEY] || "landing"); window.addEventListener("popstate", handlePopState); return () => window.removeEventListener("popstate", handlePopState); }, []);
  const navigate = (tab: string) => { if (tab === activeTab) return; window.history.pushState({ [HISTORY_KEY]: tab }, "", window.location.href); setActiveTab(tab); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => { try { const storedTheme = localStorage.getItem("thesisverse_theme"); if (storedTheme) return storedTheme === "dark"; return window.matchMedia("(prefers-color-scheme: dark)").matches; } catch { return true; } });
  useEffect(() => { try { document.documentElement.classList.toggle("dark", isDarkMode); localStorage.setItem("thesisverse_theme", isDarkMode ? "dark" : "light"); } catch {} }, [isDarkMode]);
  const toggleTheme = () => setIsDarkMode(!isDarkMode);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => { try { const stored = localStorage.getItem("thesisverse_user_profile"); if (stored) return JSON.parse(stored); } catch {} return null; });
  useEffect(() => { const unsubscribe = onAuthStateChanged(auth, async (fbUser) => { if (fbUser) { try { const snap = await getDoc(doc(db, "users", fbUser.uid)); if (snap.exists()) { const data = snap.data(); const profile: UserProfile = { id: fbUser.uid, name: data.name || fbUser.displayName || "Academic Researcher", email: fbUser.email || "", avatar: data.avatar || fbUser.photoURL || "", role: data.role || "Literature Researcher", universityAffiliation: data.universityAffiliation || "", researchBranch: data.researchBranch || "", bio: data.bio || "", savedCount: data.savedCount || 0, theme: (data.theme as "dark" | "light") || "dark", citationFormatPreference: (data.citationFormatPreference as "MLA" | "APA" | "Chicago" | "BibTeX") || "MLA" }; setCurrentUser(profile); localStorage.setItem("thesisverse_user_profile", JSON.stringify(profile)); } } catch (err) { console.warn(err); } } else if (!localStorage.getItem("thesisverse_user_profile")) setCurrentUser(null); }); return () => unsubscribe(); }, []);
  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>(() => { try { return JSON.parse(localStorage.getItem("thesisverse_search_history") || "[]"); } catch { return []; } });
  useEffect(() => { try { localStorage.setItem("thesisverse_search_history", JSON.stringify(searchHistory)); } catch {} }, [searchHistory]);
  const [savedTheses, setSavedTheses] = useState<Thesis[]>(() => { try { return JSON.parse(localStorage.getItem("thesisverse_saved") || "[]"); } catch { return []; } });
  const [comparedTheses, setComparedTheses] = useState<Thesis[]>(() => { try { return JSON.parse(localStorage.getItem("thesisverse_compared") || "[]"); } catch { return []; } });
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDetailsThesis, setSelectedDetailsThesis] = useState<Thesis | null>(null);
  const [proposalInitialThesis, setProposalInitialThesis] = useState<Thesis | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const addToast = (title: string, message?: string, type: "success" | "error" | "info" = "info") => { const id = `toast-${Date.now()}-${Math.random()}`; setToasts((prev) => [...prev, { id, title, message, type }]); setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000); };
  const removeToast = (id: string) => setToasts((prev) => prev.filter((t) => t.id !== id));
  useEffect(() => { try { localStorage.setItem("thesisverse_saved", JSON.stringify(savedTheses)); setCurrentUser((prev) => prev ? { ...prev, savedCount: savedTheses.length } : prev); } catch {} }, [savedTheses]);
  useEffect(() => { try { localStorage.setItem("thesisverse_compared", JSON.stringify(comparedTheses)); } catch {} }, [comparedTheses]);
  const savedIds = new Set(savedTheses.map((t) => t.id)); const comparedIds = new Set(comparedTheses.map((t) => t.id));
  const handleToggleSave = (thesis: Thesis) => { if (savedIds.has(thesis.id)) { setSavedTheses(savedTheses.filter((t) => t.id !== thesis.id)); addToast("Removed from Library", "", "info"); } else { setSavedTheses([...savedTheses, thesis]); addToast("Saved to Library", "", "success"); } };
  const handleToggleCompare = (thesis: Thesis) => { if (comparedIds.has(thesis.id)) setComparedTheses(comparedTheses.filter((t) => t.id !== thesis.id)); else if (comparedTheses.length < 4) setComparedTheses([...comparedTheses, thesis]); else addToast("Comparison Limit Reached", "You can compare up to 4 papers.", "error"); };
  const handleBuildProposal = (thesis: Thesis) => { setProposalInitialThesis(thesis); navigate("proposal"); };
  const handleCiteQuick = (thesis: Thesis) => { navigator.clipboard?.writeText(`${thesis.authors.join(", ")} (${thesis.year}). ${thesis.title}. ${thesis.university}. https://doi.org/${thesis.doi}`); addToast("Citation copied", "", "success"); };
  const handleSearchTopic = (q: string) => { setSearchQuery(q); if (q.trim()) setSearchHistory((prev) => [{ id: "sh-" + Date.now(), query: q.trim(), subject: "General Search", timestamp: "Just now", resultsCount: 0 }, ...prev.filter((i) => i.query !== q.trim())]); };
  const handleClearHistory = () => setSearchHistory([]);
  const [rabbitSeedThesis, setRabbitSeedThesis] = useState<Thesis | null>(null);
  const handleExploreRabbit = (thesis: Thesis) => { setRabbitSeedThesis(thesis); navigate("rabbit"); };
  const rareThesesList: Thesis[] = [INITIAL_THESES[0], INITIAL_THESES[1], INITIAL_THESES[3], INITIAL_THESES[4], INITIAL_THESES[5]];

  return <div className="min-h-screen bg-slate-100/60 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white transition-colors">
    <Navbar activeTab={activeTab} setActiveTab={navigate} savedCount={savedTheses.length} compareCount={comparedTheses.length} searchQuery={searchQuery} setSearchQuery={setSearchQuery} onSearchSubmit={() => { handleSearchTopic(searchQuery); navigate("research-explorer"); }} isDarkMode={isDarkMode} onToggleTheme={toggleTheme} currentUser={currentUser} />
    <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8">
      {activeTab === "landing" && <LandingPage rareTheses={rareThesesList} onSearchTopic={handleSearchTopic} onSearchCategory={handleSearchTopic} setActiveTab={navigate} savedIds={savedIds} comparedIds={comparedIds} onToggleSave={handleToggleSave} onToggleCompare={handleToggleCompare} onSelectDetails={setSelectedDetailsThesis} onBuildProposal={handleBuildProposal} onCite={handleCiteQuick} />}
      {(activeTab === "research-explorer" || activeTab === "search") && <><div className="max-w-5xl mx-auto -mb-2 flex justify-end"><DeepSearchButton initialQuery={searchQuery} /></div><AdvancedResearchExplorerPage initialQuery={searchQuery} onShowToast={addToast} /></>}
      {activeTab === "rare" && <RareDiscoveryPage savedIds={savedIds} onToggleSave={handleToggleSave} onBuildProposal={handleBuildProposal} onShowToast={addToast} />}
      {activeTab === "proposal" && <ProposalBuilderPage initialThesis={proposalInitialThesis} onShowToast={addToast} />}
      {activeTab === "compare" && <ComparePage comparedTheses={comparedTheses} onRemoveCompare={handleToggleCompare} onClearCompare={() => setComparedTheses([])} onSelectDetails={setSelectedDetailsThesis} onShowToast={addToast} />}
      {activeTab === "library" && <LibraryPage currentUser={currentUser} savedTheses={savedTheses} comparedIds={comparedIds} onToggleSave={handleToggleSave} onToggleCompare={handleToggleCompare} onSelectDetails={setSelectedDetailsThesis} onBuildProposal={handleBuildProposal} onCite={handleCiteQuick} onShowToast={addToast} />}
      {activeTab === "chat" && <AiChatPage savedTheses={savedTheses} onShowToast={addToast} />}
      {activeTab === "profile" && <ProfilePage user={currentUser} setUser={setCurrentUser} searchHistory={searchHistory} onClearHistory={handleClearHistory} onSearchTopic={(q) => { handleSearchTopic(q); navigate("research-explorer"); }} setActiveTab={navigate} isDarkMode={isDarkMode} onToggleTheme={toggleTheme} />}
      {activeTab === "auth" && <AuthPage onLoginSuccess={(u) => { setCurrentUser(u); addToast("Welcome back!", `Logged in as ${u.name}`, "success"); }} setActiveTab={navigate} />}
      {activeTab === "ai-tools" && <AiResearchToolsPage savedTheses={savedTheses} comparedTheses={comparedTheses} onRemoveCompare={handleToggleCompare} onClearCompare={() => setComparedTheses([])} onSelectDetails={setSelectedDetailsThesis} onShowToast={addToast} />}
      {activeTab === "rabbit" && <ResearchRabbitPage initialSeedThesis={rabbitSeedThesis} savedIds={savedIds} onToggleSave={handleToggleSave} onBuildProposal={handleBuildProposal} onShowToast={addToast} />}
      {activeTab === "admin" && <AdminPage currentUser={currentUser} onShowToast={addToast} setActiveTab={navigate} />}
      {activeTab === "api-docs" && <ApiDocsPage />}{activeTab === "srs" && <SrsDocsPage />}{activeTab === "legal" && <LegalPage />}{activeTab === "about" && <AboutPage />}{activeTab === "contact" && <ContactPage />}
      {!['landing','research-explorer','search','rabbit','rare','proposal','compare','library','chat','profile','auth','about','contact','ai-tools','admin','api-docs','srs','legal'].includes(activeTab) && <NotFoundPage setActiveTab={navigate} />}
    </main>
    <Footer setActiveTab={navigate} currentUser={currentUser} />
    <ThesisDetailModal thesis={selectedDetailsThesis} onClose={() => setSelectedDetailsThesis(null)} isSaved={selectedDetailsThesis ? savedIds.has(selectedDetailsThesis.id) : false} onToggleSave={handleToggleSave} onBuildProposal={handleBuildProposal} onExploreRabbit={handleExploreRabbit} onShowToast={addToast} />
    <ToastContainer toasts={toasts} onDismiss={removeToast} />
  </div>;
}
