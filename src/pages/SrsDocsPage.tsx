import React, { useState } from "react";
import {
  FileText,
  Copy,
  Check,
  Download,
  BookOpen,
  Layers,
  Database,
  Server,
  Zap,
  Shield,
  Search,
  Activity,
  Cpu,
  Terminal,
  Settings,
  DollarSign,
  Scale,
  Users,
  ChevronRight,
  Code,
  Sparkles,
  Lock,
  Globe,
  HardDrive
} from "lucide-react";

export const SrsDocsPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>("1-overview");
  const [copied, setCopied] = useState(false);
  const [searchFilter, setSearchFilter] = useState("");

  const handleCopySrs = () => {
    navigator.clipboard.writeText(fullSrsMarkdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadSrs = () => {
    const element = document.createElement("a");
    const file = new Blob([fullSrsMarkdown], { type: "text/markdown" });
    element.href = URL.createObjectURL(file);
    element.download = "ThesisVerse_SRS_Specification_v3.0.md";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const sections = [
    { id: "1-overview", title: "1. Executive Summary & Overview", icon: BookOpen },
    { id: "2-architecture", title: "2. System Architecture & Topology", icon: Server },
    { id: "3-modules", title: "3. Complete 28 Main Modules Specification", icon: Layers },
    { id: "4-database", title: "4. Database Schema & Entity Relationships", icon: Database },
    { id: "5-api", title: "5. REST & OpenAPI Layer Design", icon: Code },
    { id: "6-ai-engine", title: "6. AI System & Multi-Model Architecture", icon: Sparkles },
    { id: "7-search-engine", title: "7. Academic Search Engine Pipeline", icon: Search },
    { id: "8-rare-engine", title: "8. Rare Thesis & Research Gap Algorithm", icon: Zap },
    { id: "9-security", title: "9. Security, Authentication & Access Control", icon: Shield },
    { id: "10-admin", title: "10. Admin Command Center & Monitoring", icon: Activity },
    { id: "11-deployment", title: "11. Cloud Infrastructure & CI/CD", icon: HardDrive },
    { id: "12-business", title: "12. Business Model, Pricing & Roadmap", icon: DollarSign },
    { id: "13-legal", title: "13. Legal, Academic Integrity & Governance", icon: Scale }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-10 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Banner Header */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-8 shadow-xl border border-indigo-500/20 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold border border-indigo-500/30">
                <FileText className="w-3.5 h-3.5" />
                IEEE 830-1998 Standard Compliant SRS
              </div>
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
                ThesisVerse — Software Requirements Specification (SRS)
              </h1>
              <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
                Version 3.0 Production Blueprint for investors, system architects, software engineering teams, and AI coding agents.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <button
                onClick={handleCopySrs}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 shadow-md transition-all"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? "Copied Markdown!" : "Copy SRS Markdown"}</span>
              </button>

              <button
                onClick={handleDownloadSrs}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition-all"
              >
                <Download className="w-4 h-4" />
                <span>Download .MD Blueprint</span>
              </button>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center gap-6 text-xs text-slate-400">
            <span><strong>Target Release:</strong> Production v3.0</span>
            <span><strong>Architecture:</strong> Node.js + Express + React + Tailwind + PostgreSQL + Multi-Model AI</span>
            <span><strong>Security:</strong> JWT + Rate Limiting + Role-Based ACL</span>
          </div>
        </div>

        {/* Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Nav */}
          <div className="space-y-4">
            <div className="sticky top-24 bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <h3 className="text-xs font-extrabold text-slate-500 uppercase tracking-wider px-2">
                Document Sections
              </h3>

              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  placeholder="Filter sections..."
                  className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:outline-none"
                />
              </div>

              <div className="space-y-1 max-h-[calc(100vh-250px)] overflow-y-auto">
                {sections
                  .filter((s) => s.title.toLowerCase().includes(searchFilter.toLowerCase()))
                  .map((sec) => {
                    const Icon = sec.icon;
                    const isActive = activeSection === sec.id;
                    return (
                      <button
                        key={sec.id}
                        onClick={() => setActiveSection(sec.id)}
                        className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-semibold text-left transition-all ${
                          isActive
                            ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                            : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          <Icon className="w-4 h-4 shrink-0" />
                          <span className="truncate">{sec.title}</span>
                        </div>
                        <ChevronRight className="w-3.5 h-3.5 opacity-60 shrink-0" />
                      </button>
                    );
                  })}
              </div>
            </div>
          </div>

          {/* Main SRS Reading View */}
          <div className="lg:col-span-3 space-y-8">
            {/* Section 1 */}
            {activeSection === "1-overview" && (
              <section className="bg-white dark:bg-slate-900 rounded-2xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 text-sm leading-relaxed">
                <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
                  <h2 className="text-2xl font-black text-indigo-600 dark:text-indigo-400">
                    1. Executive Summary & Product Vision
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">Document Standard: IEEE-830 Specification</p>
                </div>

                <div className="space-y-4">
                  <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">1.1 Product Purpose & Vision</h3>
                  <p>
                    <strong>ThesisVerse</strong> is a venture-grade, AI-powered academic discovery platform designed to solve the critical crisis of research redundancy and literature fragmentation in higher education. Every year, millions of dissertations and research proposals reproduce existing findings because researchers lack tools to instantly identify unexplored <strong>Research Gaps</strong> and calculate mathematical <strong>Novelty Ratings</strong>.
                  </p>

                  <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">1.2 Key Objectives</h3>
                  <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                    <li>Provide instant access to verified academic research papers, dissertations, and metadata with DOI resolution.</li>
                    <li>Synthesize novel cross-disciplinary thesis opportunities using the <strong>Rare Thesis Discovery Engine</strong> powered by Gemini 3.6 Flash.</li>
                    <li>Empower researchers to draft publication-grade 6-chapter dissertation proposals using the structured <strong>Proposal Builder</strong>.</li>
                    <li>Enforce high standards for academic integrity by clearly distinguishing verified primary literature from AI-generated synthesis.</li>
                  </ul>

                  <div className="p-4 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-xs text-indigo-900 dark:text-indigo-300">
                    <strong>Core Mandate:</strong> Zero Hallucinations on Verified Citations. All primary paper metadata must feature valid DOIs, university origins, and author attributions.
                  </div>
                </div>
              </section>
            )}

            {/* Section 2 */}
            {activeSection === "2-architecture" && (
              <section className="bg-white dark:bg-slate-900 rounded-2xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 text-sm leading-relaxed">
                <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
                  <h2 className="text-2xl font-black text-indigo-600 dark:text-indigo-400">
                    2. System Architecture & High-Level Flow
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">Monolithic Full-Stack Cloud Run Container Architecture</p>
                </div>

                <div className="space-y-4">
                  <h3 className="font-bold text-base">2.1 Infrastructure Topology</h3>
                  <pre className="bg-slate-950 text-emerald-400 p-5 rounded-2xl font-mono text-xs overflow-x-auto shadow-inner">
{`                  [ Users / Web Browsers ]
                             │
                             ▼
                    [ Nginx Reverse Proxy ]
                     (Port 3000 Container)
                             │
                             ▼
              [ Node.js + Express Backend Server ]
                             │
        ┌────────────────────┼────────────────────┐
        ▼                    ▼                    ▼
[ Academic Search ]   [ Multi-Model AI ]  [ PostgreSQL DB ]
 (Semantic Index)    (Gemini & AI Engine) (Supabase Store)`}
                  </pre>

                  <h3 className="font-bold text-base">2.2 System Component Breakdown</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
                      <span className="font-bold text-indigo-500">Frontend Tier:</span>
                      <p className="text-slate-600 dark:text-slate-400">React 18 + TypeScript + Tailwind CSS + Lucide Icons + Motion Animation Engine.</p>
                    </div>
                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
                      <span className="font-bold text-violet-500">Backend Tier:</span>
                      <p className="text-slate-600 dark:text-slate-400">Express REST Server compiled with esbuild to CJS (`dist/server.cjs`).</p>
                    </div>
                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
                      <span className="font-bold text-emerald-500">Database Tier:</span>
                      <p className="text-slate-600 dark:text-slate-400">PostgreSQL (Supabase) + Local state fallback with JSON persistence.</p>
                    </div>
                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
                      <span className="font-bold text-amber-500">AI Gateway Tier:</span>
                      <p className="text-slate-600 dark:text-slate-400">Multi-Model AI Gateway + Google GenAI (Gemini Flash & Specialized Models).</p>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* Section 3 */}
            {activeSection === "3-modules" && (
              <section className="bg-white dark:bg-slate-900 rounded-2xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 text-sm leading-relaxed">
                <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
                  <h2 className="text-2xl font-black text-indigo-600 dark:text-indigo-400">
                    3. Complete 28 Main Modules Specification
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">Exhaustive Functional Requirements Matrix</p>
                </div>

                <div className="space-y-4">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-slate-200 dark:border-slate-800 font-bold text-slate-500 bg-slate-50 dark:bg-slate-950">
                          <th className="p-3">#</th>
                          <th className="p-3">Module Name</th>
                          <th className="p-3">Primary Purpose</th>
                          <th className="p-3">Key Features & API Endpoints</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {[
                          { id: 1, name: "Landing Website", purpose: "Public entry point & value proposition", details: "Hero CTA, live statistics ticker, feature previews." },
                          { id: 2, name: "Authentication System", purpose: "User identity & session security", details: "JWT tokens, password hashing, role permissions (`/api/auth/*`)." },
                          { id: 3, name: "User Dashboard", purpose: "Personalized command center", details: "Saved thesis metrics, quick proposal status, recent search history." },
                          { id: 4, name: "Academic Search Engine", purpose: "Primary literature index querying", details: "Multi-filter search, keyword match, novelty filter (`/api/search`)." },
                          { id: 5, name: "Thesis Search", purpose: "Dedicated dissertation discovery", details: "Filter by university, degree level, publication year." },
                          { id: 6, name: "Research Paper Search", purpose: "Journal paper & conference index", details: "DOI resolution, peer-reviewed filter, citation counts." },
                          { id: 7, name: "AI Research Assistant", purpose: "Contextual literature helper", details: "Answers paper questions, generates layperson summaries." },
                          { id: 8, name: "Rare Thesis Discovery Engine", purpose: "Generate novel research ideas", details: "Calculates novelty score, domain mashup generator (`/api/ai/rare-thesis`)." },
                          { id: 9, name: "Research Gap Detection", purpose: "Identify unexplored field gaps", details: "Matrix visualization of underexplored academic subdomains." },
                          { id: 10, name: "Proposal Builder", purpose: "6-chapter dissertation builder", details: "Generates methodology, literature review, objectives (`/api/ai/generate-proposal`)." },
                          { id: 11, name: "Literature Review Assistant", purpose: "Synthesize paper collections", details: "Comparative analysis table, key theme clusterer." },
                          { id: 12, name: "Citation Manager", purpose: "BibTeX, APA, IEEE, Harvard exporter", details: "One-click copy, DOI verification, export `.bib` files." },
                          { id: 13, name: "Personal Research Library", purpose: "Bookmark & organize research", details: "Custom tags, reading status tracking (`/api/saved-theses`)." },
                          { id: 14, name: "AI Chat Co-Pilot", purpose: "Interactive thesis dialogue", details: "Conversational context memory, multi-turn Q&A." },
                          { id: 15, name: "Saved Collections", purpose: "Group research into folders", details: "Shared lists, tag filtering." },
                          { id: 16, name: "User Profile", purpose: "Academic persona management", details: "University affiliation, field of study, custom preferences." },
                          { id: 17, name: "Notifications System", purpose: "Alerts & updates", details: "Toast notifications, proposal generation completion alerts." },
                          { id: 18, name: "Admin Dashboard", purpose: "System monitoring & control", details: "Telemetry, user suspension, AI token spend controls (`/api/admin/*`)." },
                          { id: 19, name: "Analytics System", purpose: "Search & usage tracking", details: "Top keywords, daily active users, response latency logs." },
                          { id: 20, name: "Settings & Customization", purpose: "Theme & API preferences", details: "Dark/light toggle, default citation style." },
                          { id: 21, name: "Subscription & Quotas", purpose: "Usage rate limiting", details: "Free vs Pro tier daily API query limits." },
                          { id: 22, name: "REST API Layer", purpose: "Public & client API surface", details: "OpenAPI 3.0 specification, JSON payloads." },
                          { id: 23, name: "AI Engine", purpose: "OpenRouter & Gemini routing", details: "Prompt templates, fallback model switching." },
                          { id: 24, name: "Search Engine Pipeline", purpose: "Fast index retrieval", details: "In-memory caching, sub-50ms keyword index lookup." },
                          { id: 25, name: "Recommendation Engine", purpose: "Related thesis matching", details: "Content-based filtering using subject taxonomy." },
                          { id: 26, name: "Security Infrastructure", purpose: "XSS, CSRF & injection defense", details: "Input sanitization, CORS policy, bcrypt hashing." },
                          { id: 27, name: "Monitoring & Telemetry", purpose: "Container health checks", details: "Memory usage, CPU load, uptime SLA monitoring." },
                          { id: 28, name: "Deployment Infrastructure", purpose: "Production container hosting", details: "Cloud Run container, Docker CJS build (`dist/server.cjs`)." }
                        ].map((m) => (
                          <tr key={m.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                            <td className="p-3 font-mono font-bold text-slate-400">{m.id}</td>
                            <td className="p-3 font-bold text-slate-900 dark:text-slate-100">{m.name}</td>
                            <td className="p-3 text-slate-600 dark:text-slate-400">{m.purpose}</td>
                            <td className="p-3 text-slate-500 font-mono text-[11px]">{m.details}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </section>
            )}

            {/* Section 4 */}
            {activeSection === "4-database" && (
              <section className="bg-white dark:bg-slate-900 rounded-2xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 text-sm leading-relaxed">
                <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
                  <h2 className="text-2xl font-black text-indigo-600 dark:text-indigo-400">
                    4. Database Schema & Entity Relationships
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">PostgreSQL Relational Schema & Constraints</p>
                </div>

                <div className="space-y-4">
                  <pre className="bg-slate-950 text-emerald-400 p-5 rounded-2xl font-mono text-xs overflow-x-auto shadow-inner">
{`-- SQL Table Schema Design
CREATE TABLE users (
  id VARCHAR(64) PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(120) NOT NULL,
  role VARCHAR(30) DEFAULT 'Researcher',
  university VARCHAR(180),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE research_papers (
  id VARCHAR(64) PRIMARY KEY,
  title TEXT NOT NULL,
  abstract TEXT NOT NULL,
  authors TEXT[] NOT NULL,
  subject VARCHAR(100) NOT NULL,
  university VARCHAR(180),
  year INT NOT NULL,
  doi VARCHAR(120),
  novelty_score INT DEFAULT 85,
  is_rare_discovery BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE generated_proposals (
  id VARCHAR(64) PRIMARY KEY,
  user_id VARCHAR(64) REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  degree VARCHAR(50) NOT NULL,
  methodology_type VARCHAR(50),
  content_json JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);`}
                  </pre>
                </div>
              </section>
            )}

            {/* Section 5 */}
            {activeSection === "5-api" && (
              <section className="bg-white dark:bg-slate-900 rounded-2xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 text-sm leading-relaxed">
                <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
                  <h2 className="text-2xl font-black text-indigo-600 dark:text-indigo-400">
                    5. REST & OpenAPI 3.0 API Layer Design
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">Client-Server Protocol Contract</p>
                </div>

                <div className="space-y-3">
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    The API surface exposes strict REST endpoints returning JSON payloads. See full endpoint sandbox on the <strong>API Documentation</strong> tab.
                  </p>

                  <div className="p-4 rounded-xl bg-slate-950 text-slate-200 font-mono text-xs space-y-2">
                    <p className="text-indigo-400 font-bold"># Key API Endpoints List:</p>
                    <p>GET  /api/search                    — Query academic papers & dissertations</p>
                    <p>POST /api/ai/rare-thesis            — Generate Rare Thesis discovery payload</p>
                    <p>POST /api/ai/generate-proposal      — Build complete 6-chapter proposal</p>
                    <p>GET  /api/saved-theses              — Fetch user saved library items</p>
                    <p>POST /api/saved-theses              — Toggle paper save state</p>
                    <p>GET  /api/admin/stats               — Server telemetry & AI token usage metrics</p>
                  </div>
                </div>
              </section>
            )}

            {/* Section 6 */}
            {activeSection === "6-ai-engine" && (
              <section className="bg-white dark:bg-slate-900 rounded-2xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 text-sm leading-relaxed">
                <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
                  <h2 className="text-2xl font-black text-indigo-600 dark:text-indigo-400">
                    6. AI System & Multi-Model Architecture
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">Model Selection, Prompts & Fallback Chain</p>
                </div>

                <div className="space-y-4">
                  <h3 className="font-bold text-base">6.1 Multi-Model Routing Strategy</h3>
                  <p className="text-xs">
                    ThesisVerse utilizes a multi-tiered AI model architecture to guarantee sub-second initial responses and fallback resiliency:
                  </p>
                  <ul className="list-disc pl-5 space-y-1 text-xs">
                    <li><strong>Primary Model:</strong> `google/gemini-2.5-flash` (Fast, highly accurate academic formatting).</li>
                    <li><strong>Reasoning Model:</strong> `google/gemini-3.6-flash` (Used for complex 6-chapter proposal synthesis).</li>
                    <li><strong>Fallback Model:</strong> `anthropic/claude-3.5-sonnet` (Invoked automatically if rate limits occur).</li>
                  </ul>
                </div>
              </section>
            )}

            {/* Section 7 */}
            {activeSection === "7-search-engine" && (
              <section className="bg-white dark:bg-slate-900 rounded-2xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 text-sm leading-relaxed">
                <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
                  <h2 className="text-2xl font-black text-indigo-600 dark:text-indigo-400">
                    7. Academic Search Engine Pipeline
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">Multi-Filter Ingestion & Indexing</p>
                </div>

                <div className="space-y-3">
                  <p className="text-xs">
                    Queries execute against an indexed catalog of verified dissertations and paper records with sub-50ms latency.
                  </p>
                </div>
              </section>
            )}

            {/* Section 8 */}
            {activeSection === "8-rare-engine" && (
              <section className="bg-white dark:bg-slate-900 rounded-2xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 text-sm leading-relaxed">
                <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
                  <h2 className="text-2xl font-black text-indigo-600 dark:text-indigo-400">
                    8. Rare Thesis & Research Gap Algorithm
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">Novelty Scoring & Topic Saturation Index</p>
                </div>

                <div className="space-y-3 text-xs">
                  <p>
                    The <strong>Novelty Rating Formula</strong> calculates academic originality based on topic frequency, publication saturation, and cross-domain distance:
                  </p>
                  <div className="p-4 rounded-xl bg-slate-950 text-amber-400 font-mono">
                    NoveltyScore = 100 - (FieldSaturationIndex * 0.4 + TopicFrequencyScore * 0.3) + InterdisciplinaryBonus * 0.3
                  </div>
                </div>
              </section>
            )}

            {/* Section 9 */}
            {activeSection === "9-security" && (
              <section className="bg-white dark:bg-slate-900 rounded-2xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 text-sm leading-relaxed">
                <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
                  <h2 className="text-2xl font-black text-indigo-600 dark:text-indigo-400">
                    9. Security, Authentication & Access Control
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">Enterprise Defense & Privacy</p>
                </div>

                <div className="space-y-3 text-xs">
                  <p>Enforces JWT bearer sessions, bcrypt salt hashing, input sanitization against XSS/SQL injection, and strict CORS headers.</p>
                </div>
              </section>
            )}

            {/* Section 10 */}
            {activeSection === "10-admin" && (
              <section className="bg-white dark:bg-slate-900 rounded-2xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 text-sm leading-relaxed">
                <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
                  <h2 className="text-2xl font-black text-indigo-600 dark:text-indigo-400">
                    10. Admin Command Center & Monitoring
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">Telemetry, Quotas & Moderation</p>
                </div>

                <div className="space-y-3 text-xs">
                  <p>Monitors node memory limits, OpenRouter dollar spend, active PostgreSQL pool connections, and user suspensions.</p>
                </div>
              </section>
            )}

            {/* Section 11 */}
            {activeSection === "11-deployment" && (
              <section className="bg-white dark:bg-slate-900 rounded-2xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 text-sm leading-relaxed">
                <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
                  <h2 className="text-2xl font-black text-indigo-600 dark:text-indigo-400">
                    11. Cloud Infrastructure & CI/CD
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">Containerized Cloud Run Setup</p>
                </div>

                <div className="space-y-3 text-xs">
                  <p>Single build command `vite build && esbuild server.ts --bundle --platform=node --format=cjs --packages=external --outfile=dist/server.cjs` and start script `node dist/server.cjs`.</p>
                </div>
              </section>
            )}

            {/* Section 12 */}
            {activeSection === "12-business" && (
              <section className="bg-white dark:bg-slate-900 rounded-2xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 text-sm leading-relaxed">
                <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
                  <h2 className="text-2xl font-black text-indigo-600 dark:text-indigo-400">
                    12. Business Model, Pricing & Roadmap
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">Monetization & Monetization Tiers</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
                    <span className="font-bold text-slate-900 dark:text-slate-100">Free Scholar:</span>
                    <p className="text-slate-500">10 daily searches, 2 rare thesis generations per day.</p>
                  </div>
                  <div className="p-4 rounded-xl border border-indigo-500 bg-indigo-50/30 dark:bg-indigo-950/30">
                    <span className="font-bold text-indigo-600 dark:text-indigo-400">Pro Researcher ($19/mo):</span>
                    <p className="text-slate-500">Unlimited searches, full 6-chapter proposal builder, BibTeX export.</p>
                  </div>
                  <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
                    <span className="font-bold text-slate-900 dark:text-slate-100">University License:</span>
                    <p className="text-slate-500">Institutional SSO, custom library integrations, university analytics dashboard.</p>
                  </div>
                </div>
              </section>
            )}

            {/* Section 13 */}
            {activeSection === "13-legal" && (
              <section className="bg-white dark:bg-slate-900 rounded-2xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 text-sm leading-relaxed">
                <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
                  <h2 className="text-2xl font-black text-indigo-600 dark:text-indigo-400">
                    13. Legal, Academic Integrity & Governance
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">CC-BY 4.0 Open Access Standards</p>
                </div>

                <div className="space-y-3 text-xs">
                  <p>Full compliance with academic ethics boards, GDPR data privacy, and open access citation rules.</p>
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Full SRS Raw Markdown string for export/copying
const fullSrsMarkdown = `# Software Requirements Specification (SRS) for ThesisVerse
**Version:** 3.0 Production Blueprint  
**Standard:** IEEE Std 830-1998  
**Date:** August 2026  
**Status:** Approved for Production Deployment  

---

## 1. Executive Summary & Overview
ThesisVerse is an AI-powered academic discovery and research proposal platform designed for scholars, researchers, and universities.
### Key Modules Included:
1. Landing Page
2. Auth System (JWT)
3. User Dashboard
4. Academic Search Engine
5. Thesis Search
6. Research Paper Search
7. AI Research Assistant
8. Rare Thesis Discovery Engine
9. Research Gap Detection
10. Proposal Builder
11. Literature Review Assistant
12. Citation Manager
13. Personal Research Library
14. AI Chat
15. Saved Collections
16. User Profile
17. Notifications
18. Admin Dashboard
19. Analytics
20. Settings
21. Subscription System
22. API Layer
23. AI Engine & Multi-Model Gateway
24. Search Engine Pipeline
25. Recommendation Engine
26. Security Infrastructure
27. Monitoring & Telemetry
28. Deployment Infrastructure

---

## 2. System Architecture & Topology
- **Frontend:** React 18, TypeScript, Tailwind CSS, Lucide Icons
- **Backend:** Express, Node.js, esbuild CommonJS bundle (\`dist/server.cjs\`)
- **Database:** PostgreSQL (Supabase) + Local JSON persistence
- **AI Gateway:** Multi-Model AI Engine (\`google/gemini-2.5-flash\` & \`google/gemini-3.6-flash\`)

---

## 3. Database Schema
\`\`\`sql
CREATE TABLE users (
  id VARCHAR(64) PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(120) NOT NULL,
  role VARCHAR(30) DEFAULT 'Researcher',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
\`\`\`
`;
