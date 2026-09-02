import React from "react";
import { Thesis } from "../types/thesis";
import { POPULAR_TOPICS, CATEGORIES_LIST } from "../data/thesesData";
import { ArrowRight, BookOpen, Bookmark, FileSearch, Lightbulb, Search, Sparkles } from "lucide-react";

interface LandingPageProps {
  rareTheses: Thesis[];
  onSearchTopic: (topic: string) => void;
  onSearchCategory: (category: string) => void;
  setActiveTab: (tab: string) => void;
  savedIds: Set<string>;
  comparedIds: Set<string>;
  onToggleSave: (thesis: Thesis) => void;
  onToggleCompare: (thesis: Thesis) => void;
  onSelectDetails: (thesis: Thesis) => void;
  onBuildProposal: (thesis: Thesis) => void;
  onCite: (thesis: Thesis) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  rareTheses,
  onSearchTopic,
  onSearchCategory,
  setActiveTab,
}) => {
  const [query, setQuery] = React.useState("");
  const featuredTopics = POPULAR_TOPICS.slice(0, 6);
  const featuredCategories = CATEGORIES_LIST.slice(0, 8);

  const openSearch = (value: string) => {
    const clean = value.trim();
    if (!clean) return;
    onSearchTopic(clean);
    setActiveTab("search");
  };

  const submitSearch = (event: React.FormEvent) => {
    event.preventDefault();
    openSearch(query);
  };

  return (
    <div className="space-y-20 pb-16">
      <section className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white px-6 py-14 dark:border-slate-800 dark:bg-slate-950 sm:px-10 sm:py-20 lg:px-16">
        <div className="pointer-events-none absolute -right-28 -top-28 h-72 w-72 rounded-full bg-[var(--tv-accent-soft)] opacity-70 dark:opacity-30" />
        <div className="pointer-events-none absolute -bottom-32 -left-24 h-80 w-80 rounded-full bg-[var(--tv-accent-soft)] opacity-50 dark:opacity-20" />

        <div className="relative mx-auto max-w-4xl text-center">
          <div className="mx-auto mb-7 inline-flex items-center gap-2 rounded-full border border-[var(--tv-border-strong)] bg-[var(--tv-accent-soft)] px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--tv-accent-dark)] dark:text-[var(--tv-accent)]">
            <Sparkles className="h-3.5 w-3.5" /> Research discovery platform
          </div>

          <h1 className="mx-auto max-w-4xl font-serif text-4xl font-semibold leading-[1.08] tracking-tight text-[var(--tv-heading)] sm:text-6xl lg:text-7xl">
            Find the question
            <span className="block text-[var(--tv-accent-dark)] dark:text-[var(--tv-accent)]">worth researching.</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-sm leading-7 text-[var(--tv-muted)] sm:text-base">
            Explore existing research, understand what has already been studied, uncover promising gaps, and turn a rough idea into a researchable topic.
          </p>

          <form onSubmit={submitSearch} className="mx-auto mt-9 max-w-3xl">
            <div className="flex flex-col gap-2 rounded-2xl border border-[var(--tv-border-strong)] bg-[var(--tv-surface-soft)] p-2 shadow-sm transition focus-within:border-[var(--tv-accent)] focus-within:ring-4 focus-within:ring-[var(--tv-accent)]/10 sm:flex-row">
              <div className="flex min-w-0 flex-1 items-center px-3">
                <Search className="mr-3 h-5 w-5 shrink-0 text-[var(--tv-muted)]" />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="What are you interested in researching?"
                  aria-label="Research topic"
                  className="w-full bg-transparent py-3 text-sm text-[var(--tv-text)] outline-none placeholder:text-[var(--tv-muted)]"
                />
              </div>
              <button type="submit" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[var(--tv-accent-dark)] px-6 text-sm font-semibold text-white transition hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[var(--tv-accent)] focus:ring-offset-2 dark:bg-[var(--tv-accent)] dark:text-[var(--tv-on-accent)]">
                Explore research <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </form>

          <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-xs text-[var(--tv-muted)]">
            <span className="mr-1 font-medium">Try:</span>
            {featuredTopics.slice(0, 4).map((topic) => (
              <button key={topic} onClick={() => openSearch(topic)} className="rounded-full border border-[var(--tv-border)] bg-[var(--tv-surface)] px-3 py-1.5 transition hover:border-[var(--tv-accent)] hover:text-[var(--tv-accent-dark)] dark:hover:text-[var(--tv-accent)]">
                {topic}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl">
        <div className="grid gap-4 md:grid-cols-3">
          {[
            { icon: FileSearch, title: "Explore the literature", text: "Search papers, theses and research around the subject you care about." },
            { icon: Lightbulb, title: "Spot opportunities", text: "Compare established and emerging areas to identify promising directions." },
            { icon: Bookmark, title: "Build your research", text: "Save useful work and develop promising ideas into a structured plan." },
          ].map(({ icon: Icon, title, text }) => (
            <div key={title} className="rounded-2xl border border-[var(--tv-border)] bg-[var(--tv-surface)] p-6">
              <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--tv-accent-soft)] text-[var(--tv-accent-dark)] dark:text-[var(--tv-accent)]">
                <Icon className="h-5 w-5" />
              </div>
              <h2 className="font-serif text-xl font-semibold text-[var(--tv-heading)]">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-[var(--tv-muted)]">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="mb-7 flex items-end justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--tv-accent-dark)] dark:text-[var(--tv-accent)]">Start somewhere</p>
            <h2 className="mt-2 font-serif text-3xl font-semibold text-[var(--tv-heading)]">Explore research areas</h2>
            <p className="mt-2 max-w-xl text-sm text-[var(--tv-muted)]">Choose a field to browse its literature and discover directions worth investigating.</p>
          </div>
          <button onClick={() => setActiveTab("search")} className="hidden items-center gap-1 text-sm font-semibold text-[var(--tv-accent-dark)] hover:opacity-80 dark:text-[var(--tv-accent)] sm:flex">
            View all <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {featuredCategories.map((category) => (
            <button key={category.name} onClick={() => openSearch(category.name)} className="group flex min-h-28 flex-col justify-between rounded-2xl border border-[var(--tv-border)] bg-[var(--tv-surface)] p-4 text-left transition hover:-translate-y-0.5 hover:border-[var(--tv-accent)] hover:shadow-sm">
              <BookOpen className="h-5 w-5 text-[var(--tv-accent-dark)] transition group-hover:scale-105 dark:text-[var(--tv-accent)]" />
              <span>
                <span className="block text-sm font-semibold text-[var(--tv-heading)]">{category.name}</span>
                <span className="mt-1 block text-xs text-[var(--tv-muted)]">{category.count.toLocaleString()} indexed</span>
              </span>
            </button>
          ))}
        </div>
      </section>

      <section className="rounded-[2rem] border border-[var(--tv-border-strong)] bg-[var(--tv-accent-soft)] p-7 sm:p-10">
        <div className="grid items-center gap-8 lg:grid-cols-[1fr_auto]">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--tv-accent-dark)] dark:text-[var(--tv-accent)]">From idea to direction</p>
            <h2 className="mt-2 max-w-2xl font-serif text-3xl font-semibold text-[var(--tv-heading)] sm:text-4xl">Don't start with a blank page.</h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--tv-muted)]">Start with a subject. ThesisVerse helps you understand the landscape before you commit to a question.</p>
          </div>
          <button onClick={() => setActiveTab("search")} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[var(--tv-accent-dark)] px-6 text-sm font-semibold text-white transition hover:opacity-90 dark:bg-[var(--tv-accent)] dark:text-[var(--tv-on-accent)]">
            Start exploring <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </section>

      {rareTheses.length > 0 && (
        <section>
          <div className="mb-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--tv-accent-dark)] dark:text-[var(--tv-accent)]">Curated discovery</p>
            <h2 className="mt-2 font-serif text-3xl font-semibold text-[var(--tv-heading)]">A few directions to spark ideas</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {rareTheses.slice(0, 3).map((thesis) => (
              <button key={thesis.id} onClick={() => openSearch(thesis.subject)} className="rounded-2xl border border-[var(--tv-border)] bg-[var(--tv-surface)] p-6 text-left transition hover:border-[var(--tv-accent)] hover:shadow-sm">
                <span className="text-xs font-semibold text-[var(--tv-accent-dark)] dark:text-[var(--tv-accent)]">{thesis.subject}</span>
                <h3 className="mt-3 font-serif text-lg font-semibold leading-snug text-[var(--tv-heading)]">{thesis.title}</h3>
                <span className="mt-5 inline-flex items-center gap-1 text-xs font-semibold text-[var(--tv-muted)]">Explore this area <ArrowRight className="h-3.5 w-3.5" /></span>
              </button>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
