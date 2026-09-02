import React, { useRef, useState } from "react";
import { UserProfile, SearchHistoryItem } from "../types/thesis";
import { auth, signOut, db, doc, setDoc, serverTimestamp } from "../lib/firebase";
import {
  User,
  Mail,
  Bookmark,
  History,
  Moon,
  Sun,
  BookOpen,
  School,
  Settings,
  CheckCircle2,
  Trash2,
  Search,
  ExternalLink,
  Camera,
  Upload,
  BookMarked,
  Award,
  PenTool,
  ShieldCheck,
  LogOut
} from "lucide-react";

interface ProfilePageProps {
  user: UserProfile | null;
  setUser: React.Dispatch<React.SetStateAction<UserProfile | null>>;
  searchHistory: SearchHistoryItem[];
  onClearHistory: () => void;
  onSearchTopic: (query: string) => void;
  setActiveTab: (tab: string) => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({
  user,
  setUser,
  searchHistory,
  onClearHistory,
  onSearchTopic,
  setActiveTab,
  isDarkMode,
  onToggleTheme,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<"overview" | "history" | "settings">("overview");
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [photoMessage, setPhotoMessage] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto my-12 p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 mx-auto flex items-center justify-center">
          <User className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">Guest Researcher</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            You are currently browsing ThesisVerse as an unauthenticated guest. Sign in or create an account with Google Firebase Authentication to sync your saved thesis citations, search history, and research proposals.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={() => setActiveTab("auth")}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/25 transition-all"
          >
            <User className="w-4 h-4" />
            <span>Sign In / Register</span>
          </button>
          <button
            onClick={() => setActiveTab("search")}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs transition-all"
          >
            <span>Explore Academic Search Engine</span>
          </button>
        </div>
      </div>
    );
  }

  // Handle local image file upload & convert to Data URL
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setPhotoMessage("Image size should be less than 5MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        const updatedUser = { ...user, avatar: dataUrl };
        setUser(updatedUser);
        localStorage.setItem("thesisverse_user_profile", JSON.stringify(updatedUser));
        setPhotoMessage("Profile photo updated successfully!");
        setTimeout(() => setPhotoMessage(""), 3000);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem("thesisverse_user_profile");
      setActiveTab("auth");
    } catch (err) {
      console.warn("Sign out error:", err);
      localStorage.removeItem("thesisverse_user_profile");
      setActiveTab("auth");
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("thesisverse_user_profile", JSON.stringify(user));

    if (user.id && !user.id.startsWith("u-101")) {
      try {
        const userRef = doc(db, "users", user.id);
        await setDoc(userRef, {
          ...user,
          updatedAt: serverTimestamp(),
        }, { merge: true });
      } catch (err) {
        console.warn("Error updating Firestore user doc:", err);
      }
    }

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      {/* Hidden file input for photo upload */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        onChange={handlePhotoUpload}
        className="hidden"
      />

      {/* Profile Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-950 p-6 sm:p-8 border border-slate-800 text-white shadow-xl">
        <div className="relative z-10 flex flex-col sm:flex-row items-center gap-6">
          {/* Avatar with Camera Overlay Trigger */}
          <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
            <img
              src={user.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250"}
              alt={user.name}
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-indigo-500/30 object-cover shadow-lg group-hover:opacity-80 transition-opacity"
            />
            <div className="absolute inset-0 rounded-full bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white">
              <Camera className="w-6 h-6 mb-0.5 text-indigo-300" />
              <span className="text-[10px] font-bold uppercase tracking-wider">Change Photo</span>
            </div>
            <span className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-slate-900" title="Online Academic Profile" />
          </div>

          <div className="text-center sm:text-left space-y-1.5 flex-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold">{user.name}</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-semibold">
                {user.role}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 flex items-center justify-center sm:justify-start gap-1.5">
              <Mail className="w-3.5 h-3.5 text-indigo-400" /> {user.email}
            </p>
            {user.universityAffiliation && (
              <p className="text-xs text-slate-400 flex items-center justify-center sm:justify-start gap-1.5">
                <School className="w-3.5 h-3.5 text-amber-400" /> {user.universityAffiliation}
              </p>
            )}
            {user.researchBranch && (
              <p className="text-xs text-indigo-300 flex items-center justify-center sm:justify-start gap-1.5 font-medium">
                <BookMarked className="w-3.5 h-3.5 text-indigo-400" /> {user.researchBranch}
              </p>
            )}
            {user.orcid && (
              <p className="text-[11px] text-slate-400 flex items-center justify-center sm:justify-start gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> ORCID: <span className="font-mono text-slate-200">{user.orcid}</span>
              </p>
            )}
          </div>

          <div className="flex sm:flex-col gap-2">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md transition-colors"
            >
              <Upload className="w-4 h-4" /> Upload Photo
            </button>

            <button
              onClick={() => setActiveSubTab("settings")}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-2 border border-slate-700 transition-colors"
            >
              <Settings className="w-4 h-4 text-indigo-400" /> Edit Profile
            </button>

            <button
              onClick={handleSignOut}
              className="px-4 py-2 rounded-xl bg-rose-950/80 hover:bg-rose-900/80 text-rose-300 text-xs font-bold flex items-center justify-center gap-2 border border-rose-800/60 transition-colors"
            >
              <LogOut className="w-4 h-4 text-rose-400" /> Sign Out
            </button>
          </div>
        </div>

        {photoMessage && (
          <div className="mt-4 p-2.5 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-bold text-center animate-in fade-in">
            {photoMessage}
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-4">
        <button
          onClick={() => setActiveSubTab("overview")}
          className={`pb-3 text-sm font-semibold flex items-center gap-2 border-b-2 transition-all ${
            activeSubTab === "overview"
              ? "border-indigo-600 dark:border-indigo-400 text-indigo-600 dark:text-indigo-400 font-bold"
              : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
          }`}
        >
          <User className="w-4 h-4" /> Account Overview
        </button>
        <button
          onClick={() => setActiveSubTab("history")}
          className={`pb-3 text-sm font-semibold flex items-center gap-2 border-b-2 transition-all ${
            activeSubTab === "history"
              ? "border-indigo-600 dark:border-indigo-400 text-indigo-600 dark:text-indigo-400 font-bold"
              : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
          }`}
        >
          <History className="w-4 h-4" /> Search History ({searchHistory.length})
        </button>
        <button
          onClick={() => setActiveSubTab("settings")}
          className={`pb-3 text-sm font-semibold flex items-center gap-2 border-b-2 transition-all ${
            activeSubTab === "settings"
              ? "border-indigo-600 dark:border-indigo-400 text-indigo-600 dark:text-indigo-400 font-bold"
              : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
          }`}
        >
          <Settings className="w-4 h-4" /> Edit Profile & Photo
        </button>
      </div>

      {/* Overview SubTab */}
      {activeSubTab === "overview" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
              <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                <Bookmark className="w-6 h-6" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{user.savedCount}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Saved Dissertations & Theses</p>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
              <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
                <History className="w-6 h-6" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{searchHistory.length}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Searches Conducted</p>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
              <div className="p-3 rounded-xl bg-violet-50 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{user.citationFormatPreference}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Preferred Citation Format</p>
              </div>
            </div>
          </div>

          {/* Academic Bio */}
          {user.bio && (
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
              <h2 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <PenTool className="w-4 h-4 text-indigo-500" /> Academic Statement & Focus
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed italic">
                "{user.bio}"
              </p>
            </div>
          )}

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
            <h2 className="font-bold text-base text-slate-900 dark:text-white">Research Workspace Quick Links</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                onClick={() => setActiveTab("search")}
                className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 text-left transition-colors flex items-center justify-between"
              >
                <div>
                  <p className="font-bold text-sm text-slate-900 dark:text-white">Thesis Search</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Search literary & academic papers</p>
                </div>
                <ExternalLink className="w-4 h-4 text-indigo-500" />
              </button>

              <button
                onClick={() => setActiveTab("compare")}
                className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 text-left transition-colors flex items-center justify-between"
              >
                <div>
                  <p className="font-bold text-sm text-slate-900 dark:text-white">Thesis Comparison</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Compare papers side-by-side</p>
                </div>
                <ExternalLink className="w-4 h-4 text-amber-500" />
              </button>

              <button
                onClick={() => setActiveTab("library")}
                className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 text-left transition-colors flex items-center justify-between"
              >
                <div>
                  <p className="font-bold text-sm text-slate-900 dark:text-white">My Library</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Manage saved research & notes</p>
                </div>
                <ExternalLink className="w-4 h-4 text-emerald-500" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* History SubTab */}
      {activeSubTab === "history" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-lg text-slate-900 dark:text-white">Recent Research Search Queries</h2>
            {searchHistory.length > 0 && (
              <button
                onClick={onClearHistory}
                className="text-xs text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1 font-semibold"
              >
                <Trash2 className="w-3.5 h-3.5" /> Clear History
              </button>
            )}
          </div>

          {searchHistory.length === 0 ? (
            <div className="p-8 text-center rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400">
              <History className="w-8 h-8 mx-auto mb-2 text-slate-400 opacity-60" />
              <p className="text-sm font-medium">No search history recorded yet.</p>
              <p className="text-xs mt-1">Queries searched in the Thesis Finder will appear here for easy re-running.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {searchHistory.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4"
                >
                  <div className="space-y-0.5">
                    <p className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                      <Search className="w-3.5 h-3.5 text-indigo-500" />
                      "{item.query}"
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Subject: {item.subject || "All Literature"} • {item.timestamp}
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      onSearchTopic(item.query);
                      setActiveTab("search");
                    }}
                    className="px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 text-xs font-bold transition-colors"
                  >
                    Re-run Search
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Settings SubTab */}
      {activeSubTab === "settings" && (
        <form onSubmit={handleUpdateProfile} className="space-y-6">
          {/* Photo Upload Section */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
            <h2 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
              <Camera className="w-5 h-5 text-indigo-500" /> Profile Photo & Avatar
            </h2>

            <div className="flex flex-col sm:flex-row items-center gap-6 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-20 h-20 rounded-full object-cover border-2 border-indigo-500/40 shadow-sm"
              />
              <div className="space-y-2 text-center sm:text-left flex-1">
                <p className="font-bold text-xs text-slate-800 dark:text-slate-200">
                  Upload a custom profile image (JPG, PNG, WebP)
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Your image is saved locally to your academic session. Max file size: 5MB.
                </p>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-colors inline-flex"
                >
                  <Upload className="w-4 h-4" /> Select Image File
                </button>
              </div>
            </div>
          </div>

          {/* Personal Details */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
            <h2 className="font-bold text-lg text-slate-900 dark:text-white">Academic Details & Department</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={user.name}
                  onChange={(e) => setUser({ ...user, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={user.email}
                  onChange={(e) => setUser({ ...user, email: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Academic Role
                </label>
                <input
                  type="text"
                  value={user.role}
                  onChange={(e) => setUser({ ...user, role: e.target.value })}
                  placeholder="e.g. Professor of Literature / Graduate Scholar"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Research Branch / Department
                </label>
                <input
                  type="text"
                  value={user.researchBranch || ""}
                  onChange={(e) => setUser({ ...user, researchBranch: e.target.value })}
                  placeholder="e.g. Comparative Literature & Hermeneutics"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  University / Institution
                </label>
                <input
                  type="text"
                  value={user.universityAffiliation || ""}
                  onChange={(e) => setUser({ ...user, universityAffiliation: e.target.value })}
                  placeholder="e.g. University of Edinburgh"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  ORCID iD (Optional)
                </label>
                <input
                  type="text"
                  value={user.orcid || ""}
                  onChange={(e) => setUser({ ...user, orcid: e.target.value })}
                  placeholder="0000-0002-1825-0097"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Academic Statement / Bio
              </label>
              <textarea
                rows={3}
                value={user.bio || ""}
                onChange={(e) => setUser({ ...user, bio: e.target.value })}
                placeholder="Brief summary of your primary literary focus, corpus under study, and theoretical frameworks..."
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              />
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
            <h2 className="font-bold text-lg text-slate-900 dark:text-white">Theme & Citation Preferences</h2>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                <div className="flex items-center gap-3">
                  {isDarkMode ? (
                    <Moon className="w-5 h-5 text-indigo-400" />
                  ) : (
                    <Sun className="w-5 h-5 text-amber-500" />
                  )}
                  <div>
                    <p className="font-bold text-sm text-slate-900 dark:text-white">
                      Appearance Theme
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Currently using {isDarkMode ? "Dark Mode" : "Light Mode"}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={onToggleTheme}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-colors"
                >
                  Switch to {isDarkMode ? "Light Mode" : "Dark Mode"}
                </button>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Default Citation Format
                </label>
                <select
                  value={user.citationFormatPreference}
                  onChange={(e) =>
                    setUser({
                      ...user,
                      citationFormatPreference: e.target.value as any,
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="MLA">MLA 9th Edition (Literature Default)</option>
                  <option value="APA">APA 7th Edition</option>
                  <option value="Chicago">Chicago Manual of Style</option>
                  <option value="BibTeX">BibTeX Code</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3">
            {savedSuccess && (
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Profile & Settings Saved!
              </span>
            )}
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition-colors"
            >
              Save Profile Changes
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
