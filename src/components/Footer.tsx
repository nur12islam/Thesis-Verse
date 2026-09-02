import React from "react";
import { Sparkles, BookOpen, ShieldCheck, Globe, GraduationCap } from "lucide-react";
import { UserProfile } from "../types/thesis";

interface FooterProps {
  setActiveTab: (tab: string) => void;
  currentUser?: UserProfile | null;
}

export const Footer: React.FC<FooterProps> = ({ setActiveTab, currentUser }) => {
  return (
    <footer className="border-t border-[#dce1d8] dark:border-[#303930] bg-[#f1f3ee] dark:bg-[#151b15] text-[#687264] dark:text-[#a5ae9f] py-12 px-4 sm:px-6 lg:px-8 mt-20 transition-colors">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="space-y-3 md:col-span-1">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full border border-[#9baa8d] flex items-center justify-center text-[#65775a] dark:text-[#9baa8d]"><BookOpen className="w-4 h-4" /></div>
            <span className="font-serif font-bold text-xl tracking-tight text-[#1d251b] dark:text-[#f4f5f0]">Thesis<span className="italic font-normal text-[#7e9270] dark:text-[#9baa8d]">Verse</span></span>
          </div>
          <p className="text-xs leading-relaxed text-[#687264] dark:text-[#a5ae9f]">A comprehensive academic research search engine and discovery portal for dissertations, literature studies, and scholarly proposals.</p>
          <div className="flex items-center gap-1.5 text-xs text-[#7b8576] dark:text-[#8e9888] pt-1"><Globe className="w-3.5 h-3.5 text-[#849779]" /><span>Open Access DOI Compatible Repository</span></div>
        </div>

        <div>
          <h4 className="font-bold text-xs uppercase tracking-[0.12em] text-[#35402f] dark:text-[#dce3d7] mb-3.5">Academic Discovery</h4>
          <ul className="space-y-2.5 text-xs">
            <li><button onClick={() => setActiveTab("search")} className="hover:text-[#65775a] dark:hover:text-[#9baa8d] transition-colors">Search Literature & Dissertations</button></li>
            <li><button onClick={() => setActiveTab("rare")} className="hover:text-[#65775a] dark:hover:text-[#9baa8d] transition-colors">Rare Thesis Discovery</button></li>
            <li><button onClick={() => setActiveTab("proposal")} className="hover:text-[#65775a] dark:hover:text-[#9baa8d] transition-colors">Research Proposal Generator</button></li>
            <li><button onClick={() => setActiveTab("compare")} className="hover:text-[#65775a] dark:hover:text-[#9baa8d] transition-colors">Paper Comparison Matrix</button></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-xs uppercase tracking-[0.12em] text-[#35402f] dark:text-[#dce3d7] mb-3.5">Research Tools</h4>
          <ul className="space-y-2.5 text-xs">
            <li><button onClick={() => setActiveTab("chat")} className="hover:text-[#65775a] dark:hover:text-[#9baa8d] transition-colors">AI Literature Assistant</button></li>
            <li><button onClick={() => setActiveTab("library")} className="hover:text-[#65775a] dark:hover:text-[#9baa8d] transition-colors">My Research Workspace</button></li>
            <li><button onClick={() => setActiveTab("about")} className="hover:text-[#65775a] dark:hover:text-[#9baa8d] transition-colors">About the Platform</button></li>
            {currentUser?.email === "nurislam76898@gmail.com" && <li><button onClick={() => setActiveTab("admin")} className="text-[#65775a] dark:text-[#9baa8d] font-bold hover:underline">Admin Command Center</button></li>}
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-xs uppercase tracking-[0.12em] text-[#35402f] dark:text-[#dce3d7] mb-3.5">Academic Standards</h4>
          <ul className="space-y-2 text-xs text-[#687264] dark:text-[#a5ae9f]">
            <li className="flex items-center gap-2"><GraduationCap className="w-3.5 h-3.5 text-[#849779] shrink-0" /><span>Verified University Records</span></li>
            <li className="flex items-center gap-2"><ShieldCheck className="w-3.5 h-3.5 text-[#849779] shrink-0" /><span>BibTeX & MLA Standards</span></li>
            <li className="flex items-center gap-2"><Sparkles className="w-3.5 h-3.5 text-[#849779] shrink-0" /><span>AI Research Gap Scoring</span></li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto border-t border-[#dce1d8] dark:border-[#303930] mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-[#7b8576] dark:text-[#8e9888]">
        <p>© {new Date().getFullYear()} ThesisVerse. All rights reserved.</p>
        <div className="flex items-center gap-4 mt-3 sm:mt-0">
          <button onClick={() => setActiveTab("legal")} className="hover:text-[#35402f] dark:hover:text-[#dce3d7] transition-colors">Privacy & Terms</button>
          <span>•</span>
          <button onClick={() => setActiveTab("contact")} className="hover:text-[#35402f] dark:hover:text-[#dce3d7] transition-colors">Contact & Support</button>
        </div>
      </div>
    </footer>
  );
};
