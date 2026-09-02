import React from "react";
import { Search, Dices, FileText, Bookmark, MessageSquare, BarChart3, Info, Menu, X, User, Sun, Moon, ShieldAlert, Compass, Sparkles } from "lucide-react";
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

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, savedCount, compareCount, searchQuery, setSearchQuery, onSearchSubmit, isDarkMode, onToggleTheme, currentUser }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const allNavItems = [
    { id: "landing", label: "Home" },
    { id: "search", label: "Search", icon: Search },
    { id: "rabbit", label: "Literature Graph", icon: Compass },
    { id: "rare", label: "Rare Discovery", icon: Dices },
    { id: "proposal", label: "Proposal Builder", icon: FileText },
    { id: "compare", label: "Compare", icon: BarChart3, badge: compareCount },
    { id: "chat", label: "Assistant", icon: MessageSquare },
    { id: "library", label: "My Library", icon: Bookmark, badge: savedCount },
    { id: "admin", label: "Admin", icon: ShieldAlert, adminOnly: true },
    { id: "about", label: "About", icon: Info },
  ];
  const isAdmin = currentUser?.email === "nurislam76898@gmail.com";
  const navItems = allNavItems.filter((item) => !item.adminOnly || isAdmin);
  const handleNavClick = (id: string) => { setActiveTab(id); setMobileMenuOpen(false); };
  const searchBox = (mobile = false) => (
    <div className={`relative w-full ${mobile ? "mb-3" : "max-w-sm mx-4"}`}>
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onKeyDown={(e) => { if (e.key === "Enter") { onSearchSubmit(); setActiveTab("search"); setMobileMenuOpen(false); } }}
        placeholder="Search theses, topics, DOIs..."
        className={`${mobile ? "py-2.5 text-sm" : "py-2 text-xs"} w-full pl-9 pr-4 rounded-lg bg-slate-50 dark:bg-[#0d1d12] border border-slate-200 dark:border-[#254331] text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-600/20 focus:border-green-700 dark:focus:border-green-400 transition-colors`}
      />
      <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
    </div>
  );
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-[#254331] bg-white dark:bg-[#07130b] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          <button onClick={() => handleNavClick("landing")} className="flex items-center gap-2.5 shrink-0 text-left">
            <div className="w-9 h-9 rounded-lg bg-[#176b35] dark:bg-[#14532d] flex items-center justify-center text-white">
              <span className="text-base font-serif font-bold">T</span>
            </div>
            <div>
              <span className="font-bold text-lg tracking-tight text-[#17351f] dark:text-[#edf7ef]">Thesis<span className="text-[#176b35] dark:text-[#63c982]">Verse</span></span>
              <p className="text-[9px] uppercase font-semibold text-slate-500 dark:text-[#9db3a3] tracking-wider -mt-1">Academic Discovery</p>
            </div>
          </button>
          <div className="hidden md:flex flex-1 justify-center">{searchBox()}</div>
          <nav className="hidden xl:flex items-center gap-0.5">
            {navItems.map((item) => {
              const Icon = item.icon; const isActive = activeTab === item.id;
              return <button key={item.id} onClick={() => handleNavClick(item.id)} className={`px-2.5 py-2 rounded-md text-xs font-medium flex items-center gap-1.5 transition-colors ${isActive ? "bg-[#e5f3e8] dark:bg-[#163b24] text-[#14532d] dark:text-[#8ee6a6]" : "text-slate-600 dark:text-[#b7c8ba] hover:bg-slate-100 dark:hover:bg-[#112619] hover:text-[#14532d] dark:hover:text-white"}`}>
                {Icon && <Icon className="w-3.5 h-3.5" />}{item.label}
                {item.badge !== undefined && item.badge > 0 && <span className="ml-0.5 min-w-4 px-1 text-[10px] font-bold rounded-full bg-[#176b35] text-white">{item.badge}</span>}
              </button>;
            })}
          </nav>
          <div className="flex items-center gap-1">
            <button onClick={onToggleTheme} className="p-2 rounded-lg text-slate-600 dark:text-[#b7c8ba] hover:bg-slate-100 dark:hover:bg-[#112619]" title={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}>{isDarkMode ? <Sun className="w-4 h-4 text-[#63c982]" /> : <Moon className="w-4 h-4" />}</button>
            {currentUser ? <button onClick={() => handleNavClick("profile")} className={`p-1 rounded-full border-2 ${activeTab === "profile" ? "border-[#176b35] dark:border-[#63c982]" : "border-transparent"}`} title="Profile"><img src={currentUser.avatar} alt={currentUser.name} className="w-7 h-7 rounded-full object-cover" /></button> : <button onClick={() => handleNavClick("auth")} className="px-3 py-2 rounded-lg bg-[#176b35] hover:bg-[#14532d] text-white text-xs font-semibold flex items-center gap-1.5"><User className="w-3.5 h-3.5" /><span className="hidden sm:inline">Sign in</span></button>}
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="xl:hidden p-2 rounded-lg text-slate-600 dark:text-[#b7c8ba] hover:bg-slate-100 dark:hover:bg-[#112619]">{mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}</button>
          </div>
        </div>
      </div>
      {mobileMenuOpen && <div className="xl:hidden border-t border-slate-200 dark:border-[#254331] bg-white dark:bg-[#07130b] px-4 pt-3 pb-5 space-y-1">{searchBox(true)}{navItems.map((item) => { const Icon = item.icon; const isActive = activeTab === item.id; return <button key={item.id} onClick={() => handleNavClick(item.id)} className={`w-full flex items-center justify-between px-3 py-2.5 rounded-md text-sm font-medium ${isActive ? "bg-[#e5f3e8] dark:bg-[#163b24] text-[#14532d] dark:text-[#8ee6a6]" : "text-slate-700 dark:text-[#dce9df] hover:bg-slate-100 dark:hover:bg-[#112619]"}`}><span className="flex items-center gap-2.5">{Icon && <Icon className="w-4 h-4" />}{item.label}</span>{item.badge !== undefined && item.badge > 0 && <span className="px-1.5 text-xs rounded-full bg-[#176b35] text-white">{item.badge}</span>}</button>; })}<button onClick={() => handleNavClick("profile")} className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-md text-sm font-medium text-slate-700 dark:text-[#dce9df] hover:bg-slate-100 dark:hover:bg-[#112619]"><User className="w-4 h-4" /> Profile & Settings</button></div>}
    </header>
  );
};
