import React from "react";
import {
  Sparkles,
  Search,
  Dices,
  FileText,
  Bookmark,
  MessageSquare,
  BarChart3,
  Info,
  Menu,
  X,
  User,
  Sun,
  Moon,
  Mail,
  ShieldAlert,
  Code,
  Scale,
  Compass,
  Network
} from "lucide-react";
import { UserProfile } from "../types/thesis";

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  savedCount: number;
  compareCount: number;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  onSearchSubmit: () => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  currentUser: UserProfile | null;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  savedCount,
  compareCount,
  searchQuery,
  setSearchQuery,
  onSearchSubmit,
  isDarkMode,
  onToggleTheme,
  currentUser,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const allNavItems = [
    { id: "landing", label: "Home" },
    { id: "search", label: "Search Engine", icon: Search },
    { id: "rabbit", label: "Literature Graph", icon: Compass, badgeHighlight: "Rabbit" },
    { id: "rare", label: "Rare Discovery", icon: Dices },
    { id: "proposal", label: "Proposal Builder", icon: FileText },
    { id: "compare", label: "Compare Papers", icon: BarChart3, badge: compareCount },
    { id: "chat", label: "AI Assistant", icon: MessageSquare },
    { id: "library", label: "My Library", icon: Bookmark, badge: savedCount },
    { id: "admin", label: "Admin", icon: ShieldAlert, adminOnly: true },
    { id: "about", label: "About", icon: Info },
  ];

  const isAdmin = currentUser?.email === "nurislam76898@gmail.com";
  const navItems = allNavItems.filter((item) => !item.adminOnly || isAdmin);

  const handleNavClick = (id: string) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white/85 dark:bg-slate-950/85 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Brand Logo */}
          <div
            onClick={() => handleNavClick("landing")}
            className="flex items-center gap-2.5 cursor-pointer group shrink-0"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <Sparkles className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <span className="font-bold text-lg tracking-tight text-slate-900 dark:text-white flex items-center gap-1">
                Thesis<span className="text-indigo-600 dark:text-indigo-400">Verse</span>
              </span>
              <p className="text-[9px] uppercase font-semibold text-slate-500 dark:text-slate-400 tracking-wider -mt-1">
                Academic Discovery AI
              </p>
            </div>
          </div>

          {/* Inline Quick Search (Desktop) */}
          <div className="hidden md:flex flex-1 max-w-sm mx-4">
            <div className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    onSearchSubmit();
                    setActiveTab("search");
                  }
                }}
                placeholder="Search thesis, DOIs, subjects..."
                className="w-full pl-9 pr-4 py-1.5 text-xs rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition-all"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`relative px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                    isActive
                      ? "bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 font-bold"
                      : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900"
                  }`}
                >
                  {Icon && <Icon className="w-3.5 h-3.5" />}
                  {item.label}
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="ml-1 px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-indigo-600 text-white">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Theme Switcher & User Profile Avatar */}
          <div className="flex items-center gap-2">
            <button
              onClick={onToggleTheme}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {isDarkMode ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-600" />
              )}
            </button>

            {currentUser ? (
              <button
                onClick={() => handleNavClick("profile")}
                className={`p-1 rounded-full border-2 transition-all ${
                  activeTab === "profile"
                    ? "border-indigo-600"
                    : "border-transparent hover:border-slate-300 dark:hover:border-slate-700"
                }`}
                title="User Profile Settings"
              >
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-7 h-7 rounded-full object-cover"
                />
              </button>
            ) : (
              <button
                onClick={() => handleNavClick("auth")}
                className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
                title="Sign In or Register"
              >
                <User className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Sign In</span>
              </button>
            )}

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 pt-3 pb-6 space-y-2">
          <div className="relative w-full mb-3">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  onSearchSubmit();
                  setActiveTab("search");
                  setMobileMenuOpen(false);
                }
              }}
              placeholder="Search thesis, DOIs, topics..."
              className="w-full pl-9 pr-4 py-2 text-sm rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-4 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                  isActive
                    ? "bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-bold"
                    : "text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900"
                }`}
              >
                <span className="flex items-center gap-2.5">
                  {Icon && <Icon className="w-4 h-4" />}
                  {item.label}
                </span>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-indigo-600 text-white">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          <button
            onClick={() => handleNavClick("profile")}
            className="w-full flex items-center justify-between px-4 py-2.5 rounded-lg text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900"
          >
            <span className="flex items-center gap-2.5">
              <User className="w-4 h-4 text-indigo-500" /> User Profile & Settings
            </span>
          </button>
        </div>
      )}
    </header>
  );
};
