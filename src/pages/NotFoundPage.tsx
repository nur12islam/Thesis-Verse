import React from "react";
import { Sparkles, Home, Compass, ArrowLeft } from "lucide-react";

interface NotFoundPageProps {
  setActiveTab: (tab: string) => void;
}

export const NotFoundPage: React.FC<NotFoundPageProps> = ({ setActiveTab }) => {
  return (
    <div className="max-w-xl mx-auto my-16 text-center space-y-6 p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl">
      <div className="relative w-32 h-32 mx-auto flex items-center justify-center rounded-3xl bg-gradient-to-tr from-indigo-900 via-slate-900 to-indigo-950 border border-indigo-500/30 text-indigo-400 shadow-xl">
        <Compass className="w-16 h-16 animate-spin-slow text-indigo-400" />
        <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-bold">
          404
        </span>
      </div>

      <div className="space-y-2">
        <h1 className="text-3xl font-black text-slate-900 dark:text-white">
          Academic Void Encountered
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
          The requested dissertation page or resource route does not exist in our index. It may have been relocated or removed.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
        <button
          onClick={() => setActiveTab("landing")}
          className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition-colors flex items-center justify-center gap-2"
        >
          <Home className="w-4 h-4" /> Return to Home
        </button>

        <button
          onClick={() => setActiveTab("search")}
          className="w-full sm:w-auto px-6 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs transition-colors flex items-center justify-center gap-2"
        >
          <Compass className="w-4 h-4" /> Search Literature
        </button>
      </div>
    </div>
  );
};
