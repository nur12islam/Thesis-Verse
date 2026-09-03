import React from "react";
import { Thesis } from "../types/thesis";
import { ArrowRight, BookOpen, FileSearch, Search, ShieldCheck, Sparkles } from "lucide-react";

interface LandingPageProps { rareTheses: Thesis[]; onSearchTopic: (topic: string) => void; onSearchCategory: (category: string) => void; setActiveTab: (tab: string) => void; savedIds: Set<string>; comparedIds: Set<string>; onToggleSave: (thesis: Thesis) => void; onToggleCompare: (thesis: Thesis) => void; onSelectDetails: (thesis: Thesis) => void; onBuildProposal: (thesis: Thesis) => void; onCite: (thesis: Thesis) => void; }

export const LandingPage: React.FC<LandingPageProps> = ({ onSearchTopic, setActiveTab }) => {
  const [query, setQuery] = React.useState("");
  const openSearch = (value: string) => { const clean = value.trim(); if (!clean) return; onSearchTopic(clean); setActiveTab("research-explorer"); };
  return <div className="pb-16">
    <section className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white px-6 py-16 dark:border-slate-800 dark:bg-slate-950 sm:px-10 sm:py-24 lg:px-16">
      <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-indigo-500/10 blur-3xl" />
      <div className="relative mx-auto max-w-4xl text-center">
        <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-indigo-600 dark:text-indigo-300"><Sparkles className="h-3.5 w-3.5" /> Research intelligence</div>
        <h1 className="font-serif text-4xl font-semibold leading-tight tracking-tight text-slate-950 dark:text-white sm:text-6xl">Start with an idea.<span className="block text-indigo-600 dark:text-indigo-400">We map the research.</span></h1>
        <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-slate-500 dark:text-slate-400 sm:text-base">Type a topic, even just two or three words. Find existing theses and research, understand the evidence, compare independent AI analyses, and uncover promising gaps.</p>
        <form onSubmit={(e) => { e.preventDefault(); openSearch(query); }} className="mx-auto mt-8 max-w-3xl rounded-2xl border border-slate-200 bg-slate-50 p-2 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:flex">
          <div className="flex min-w-0 flex-1 items-center px-3"><Search className="mr-3 h-5 w-5 shrink-0 text-slate-400" /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search for a topic or research question" aria-label="Research topic" className="w-full bg-transparent py-3 text-sm outline-none placeholder:text-slate-400 dark:text-white" /></div>
          <button className="mt-2 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 text-sm font-bold text-white hover:bg-indigo-700 sm:mt-0 sm:w-auto">Search <ArrowRight className="h-4 w-4" /></button>
        </form>
      </div>
    </section>
    <section className="mx-auto mt-8 grid max-w-5xl gap-4 md:grid-cols-3">
      {[
        { icon: FileSearch, title: "Find existing work", text: "Search ThesisVerse, OpenAlex and Crossref from one simple query." },
        { icon: ShieldCheck, title: "Cross-check evidence", text: "Keep source records visible and separate evidence from AI interpretation." },
        { icon: BookOpen, title: "Discover the gap", text: "Compare what has been studied and identify directions worth investigating." },
      ].map(({ icon: Icon, title, text }) => <div key={title} className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900"><div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-300"><Icon className="h-5 w-5" /></div><h2 className="font-serif text-xl font-semibold text-slate-900 dark:text-white">{title}</h2><p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">{text}</p></div>)}
    </section>
    <section className="mx-auto mt-8 max-w-5xl rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 sm:p-8"><div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-xs font-bold uppercase tracking-wider text-indigo-600">How it works</p><h2 className="mt-2 font-serif text-2xl font-semibold text-slate-900 dark:text-white">Idea → evidence → research gap</h2><p className="mt-2 text-sm text-slate-500 dark:text-slate-400">No need to know the academic wording before you start.</p></div><button onClick={() => setActiveTab("research-explorer")} className="inline-flex items-center justify-center gap-2 rounded-xl border border-indigo-500/30 px-4 py-3 text-sm font-bold text-indigo-600 dark:text-indigo-300">Open Research Explorer <ArrowRight className="h-4 w-4" /></button></div></section>
  </div>;
};