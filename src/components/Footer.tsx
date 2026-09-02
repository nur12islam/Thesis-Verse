import React from "react";
import { Sparkles, BookOpen, ShieldCheck, Globe, GraduationCap } from "lucide-react";
import { UserProfile } from "../types/thesis";

interface FooterProps {
  setActiveTab: (tab: string) => void;
  currentUser?: UserProfile | null;
}

export const Footer: React.FC<FooterProps> = ({ setActiveTab, currentUser }) => {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-400 py-12 px-4 sm:px-6 lg:px-8 mt-20 transition-colors">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand info */}
        <div className="space-y-3 md:col-span-1">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md">
              <BookOpen className="w-4 h-4" />
            </div>
            <span className="font-extrabold text-lg tracking-tight text-slate-900 dark:text-white">
              Thesis<span className="text-indigo-600 dark:text-indigo-400">Verse</span>
            </span>
          </div>
          <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">
            A comprehensive academic research search engine and discovery portal for dissertations, literature studies, and scholarly proposals.
          </p>
          <div className="flex items-center gap-1.5 text-xs text-slate-400 pt-1">
            <Globe className="w-3.5 h-3.5 text-indigo-500" />
            <span>Open Access DOI Compatible Repository</span>
          </div>
        </div>

        {/* Search & Discovery */}
        <div>
          <h4 className="font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-slate-200 mb-3.5">
            Academic Discovery
          </h4>
          <ul className="space-y-2.5 text-xs">
            <li>
              <button
                onClick={() => setActiveTab("search")}
                className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              >
                Search Literature & Dissertations
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab("rare")}
                className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              >
                Rare Thesis Discovery
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab("proposal")}
                className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              >
                Research Proposal Generator
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab("compare")}
                className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              >
                Paper Comparison Matrix
              </button>
            </li>
          </ul>
        </div>

        {/* Platform & Account */}
        <div>
          <h4 className="font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-slate-200 mb-3.5">
            Research Tools
          </h4>
          <ul className="space-y-2.5 text-xs">
            <li>
              <button
                onClick={() => setActiveTab("chat")}
                className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              >
                AI Literature Assistant
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab("library")}
                className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              >
                My Research Workspace
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab("about")}
                className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              >
                About the Platform
              </button>
            </li>
            {currentUser?.email === "nurislam76898@gmail.com" && (
              <li>
                <button
                  onClick={() => setActiveTab("admin")}
                  className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline"
                >
                  Admin Command Center
                </button>
              </li>
            )}
          </ul>
        </div>

        {/* Standards & Trust */}
        <div>
          <h4 className="font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-slate-200 mb-3.5">
            Academic Standards
          </h4>
          <ul className="space-y-2 text-xs text-slate-500 dark:text-slate-400">
            <li className="flex items-center gap-2">
              <GraduationCap className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
              <span>Verified University Records</span>
            </li>
            <li className="flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span>BibTeX & MLA Standards</span>
            </li>
            <li className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span>AI Research Gap Scoring</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto border-t border-slate-200 dark:border-slate-800/80 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
        <p>© {new Date().getFullYear()} ThesisVerse. All rights reserved.</p>
        <div className="flex items-center gap-4 mt-3 sm:mt-0">
          <button
            onClick={() => setActiveTab("legal")}
            className="hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
          >
            Privacy & Terms
          </button>
          <span>•</span>
          <button
            onClick={() => setActiveTab("contact")}
            className="hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
          >
            Contact & Support
          </button>
        </div>
      </div>
    </footer>
  );
};
