import React from "react";
import { Search, Dices, FileText, Bookmark, MessageSquare, BarChart3, Info, Menu, X, User, Sun, Moon, ShieldAlert, Compass } from "lucide-react";
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
        className={`${mobile ? "py-2.5 text-sm" : "py-2 text-xs"} w-full pl-9 pr-4 rounded-full bg-[#f1f3ee] dark:bg-[#1a2119] border border-[#dce1d8] dark:border-[#303930] text-[#1d251b] dark:text-[#e9ede5] placeholder-[#7b8576] dark:placeholder-[#8e9888] focus:outline-none focus:ring-2 focus:ring-[#9baa8d]/20 focus:border-[#9baa8d] transition-colors`}
      />
      <Search className="w-4 h-4 text-[#7b8576] dark:text-[#9baa8d] absolute left-3 top-1/2 -translate-y-1/2" />
    </div>
  );
  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#dce1d8] dark:border-[#303930] bg-[#f7f8f5] dark:bg-[#0e120e] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          <button onClick={() => handleNavClick("landing")} className="flex items-center gap-2.5 shrink-0 text-left">
            <div className="w-9 h-9 rounded-full border border-[#9baa8d] dark:border-[#65775a] flex items-center justify-center text-[#65775a] dark:text-[#9baa8d]">
              <span className="text-base font-serif font-bold">T</span>
            </div>
            <div>
              <span className="font-serif font-bold text-xl tracking-tight text-[#1d251b] dark:text-[#f4f5f0]">Thesis<span className="italic font-normal text-[#7e9270] dark:text-[#9baa8d]">Verse</span></span>
              <p className="text-[9px] uppercase font-semibold text-[#7b8576] dark:text-[#8e9888] tracking-[0.16em] -mt-0.5">Academic Discovery</p>
            </div>
          </button>
          <div className="hidden md:flex flex-1 justify-center">{searchBox()}</div>
          <nav className="hidden xl:flex items-center gap-0.5">
            {navItems.map((item) => {
              const Icon = item.icon; const isActive = activeTab === item.id;
              return <button key={item.id} onClick={() => handleNavClick(item.id)} className={`px-2.5 py-2 rounded-full text-xs font-medium flex items-center gap-1.5 transition-colors ${isActive ? "bg-[#e7ece2] dark:bg-[#293126] text-[#4d5c45] dark:text-[#c3ceb9]" : "text-[#687264] dark:text-[#a5ae9f] hover:bg-[#eef1eb] dark:hover:bg-[#1a2119] hover:text-[#1d251b] dark:hover:text-[#f4f5f0]"}`}>
                {Icon && <Icon className="w-3.5 h-3.5" />}{item.label}
                {item.badge !== undefined && item.badge > 0 && <span className="ml-0.5 min-w-4 px-1 text-[10px] font-bold rounded-full bg-[#91a482] text-[#172016]">{item.badge}</span>}
              </button>;
            })}
          </nav>
          <div className="flex items-center gap-1">
            <button onClick={onToggleTheme} className="p-2 rounded-full text-[#687264] dark:text-[#a5ae9f] hover:bg-[#eef1eb] dark:hover:bg-[#1a2119]" title={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}>{isDarkMode ? <Sun className="w-4 h-4 text-[#9baa8d]" /> : <Moon className="w-4 h-4" />}</button>
            {currentUser ? <button onClick={() => handleNavClick("profile")} className={`p-1 rounded-full border-2 ${activeTab === "profile" ? "border-[#91a482] dark:border-[#9baa8d]" : "border-transparent"}`} title="Profile"><img src={currentUser.avatar} alt={currentUser.name} className="w-7 h-7 rounded-full object-cover" /></button> : <button onClick={() => handleNavClick("auth")} className="px-3 py-2 rounded-full bg-[#91a482] hover:bg-[#7e9270] text-[#172016] text-xs font-semibold flex items-center gap-1.5"><User className="w-3.5 h-3.5" /><span className="hidden sm:inline">Sign in</span></button>}
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="xl:hidden p-2 rounded-full text-[#687264] dark:text-[#a5ae9f] hover:bg-[#eef1eb] dark:hover:bg-[#1a2119]">{mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}</button>
          </div>
        </div>
      </div>
      {mobileMenuOpen && <div className="xl:hidden border-t border-[#dce1d8] dark:border-[#303930] bg-[#f7f8f5] dark:bg-[#0e120e] px-4 pt-3 pb-5 space-y-1">{searchBox(true)}{navItems.map((item) => { const Icon = item.icon; const isActive = activeTab === item.id; return <button key={item.id} onClick={() => handleNavClick(item.id)} className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium ${isActive ? "bg-[#e7ece2] dark:bg-[#293126] text-[#4d5c45] dark:text-[#c3ceb9]" : "text-[#687264] dark:text-[#a5ae9f] hover:bg-[#eef1eb] dark:hover:bg-[#1a2119]"}`}><span className="flex items-center gap-2.5">{Icon && <Icon className="w-4 h-4" />}{item.label}</span>{item.badge !== undefined && item.badge > 0 && <span className="px-1.5 text-xs rounded-full bg-[#91a482] text-[#172016]">{item.badge}</span>}</button>; })}<button onClick={() => handleNavClick("profile")} className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-[#687264] dark:text-[#a5ae9f] hover:bg-[#eef1eb] dark:hover:bg-[#1a2119]"><User className="w-4 h-4" /> Profile & Settings</button></div>}
    </header>
  );
};
