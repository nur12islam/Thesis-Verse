import React, { useState } from "react";
import { Shield, FileText, Scale, BookOpen, Lock, AlertCircle, CheckCircle2 } from "lucide-react";

export const LegalPage: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<
    "privacy" | "terms" | "ai-integrity" | "cookies" | "copyright"
  >("privacy");

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-12 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-400 text-xs font-bold">
            <Scale className="w-3.5 h-3.5" />
            Legal, Privacy & Academic Integrity
          </div>
          <h1 className="text-3xl font-black tracking-tight">ThesisVerse Legal Framework</h1>
          <p className="text-xs text-slate-500 max-w-xl mx-auto">
            Comprehensive statements on data privacy, open access standards, academic integrity guidelines, and AI research assistance terms.
          </p>
        </div>

        {/* Subtabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-4">
          {[
            { id: "privacy", label: "Privacy Policy", icon: Lock },
            { id: "terms", label: "Terms of Service", icon: FileText },
            { id: "ai-integrity", label: "Academic Integrity & AI", icon: Shield },
            { id: "cookies", label: "Cookie Policy", icon: BookOpen },
            { id: "copyright", label: "Copyright & Open Access", icon: Scale }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                    : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-100"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content Box */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          {activeSubTab === "privacy" && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Lock className="w-5 h-5 text-indigo-500" /> Global Privacy Policy
              </h2>
              <p className="text-xs text-slate-500">Effective Date: August 2026 | Version 2.4</p>
              <p>
                ThesisVerse (“Platform”, “we”, “us”) prioritizes the confidentiality and privacy of academic researchers, scholars, and university students. This Privacy Policy details how we handle data collected during search queries, proposal generations, and user accounts.
              </p>
              <h3 className="font-bold text-slate-900 dark:text-slate-100">1. Information We Collect</h3>
              <ul className="list-disc pl-5 space-y-1 text-xs">
                <li><strong>Account Identifiers:</strong> Name, academic email address, university affiliation, role.</li>
                <li><strong>Research Telemetry:</strong> Search queries, saved paper bookmarks, generated thesis proposal drafts.</li>
                <li><strong>Technical Logs:</strong> IP address, device telemetry, browser type for server health monitoring.</li>
              </ul>
              <h3 className="font-bold text-slate-900 dark:text-slate-100">2. How Research Data is Used</h3>
              <p className="text-xs">
                Generated research proposals and private library items are strictly protected. We never sell user research proposals to third parties or use private drafts for public AI model training without explicit consent.
              </p>
            </div>
          )}

          {activeSubTab === "terms" && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-500" /> Terms of Service
              </h2>
              <p className="text-xs text-slate-500 font-mono">Last Updated: August 2026</p>
              <p>
                By accessing or using ThesisVerse, you agree to adhere to these Terms of Service. If you do not agree to these terms, you may not access or use our academic discovery tools.
              </p>
              <h3 className="font-bold text-slate-900 dark:text-slate-100">1. Acceptable Use</h3>
              <p className="text-xs">
                ThesisVerse is intended solely for academic research, thesis ideation, literature discovery, and proposal structuring. Users are strictly prohibited from utilizing the API for automated spam, scraping, or intellectual property infringement.
              </p>
              <h3 className="font-bold text-slate-900 dark:text-slate-100">2. IP Rights in Generated Content</h3>
              <p className="text-xs">
                Proposals, thesis ideas, and literature reviews generated on ThesisVerse belong to the creating user, subject to proper academic citation standards and institutional policies.
              </p>
            </div>
          )}

          {activeSubTab === "ai-integrity" && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Shield className="w-5 h-5 text-indigo-500" /> Academic Integrity & AI Policy
              </h2>
              <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-200 space-y-2">
                <div className="font-bold flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                  Mandatory Academic Ethics Statement
                </div>
                <p>
                  ThesisVerse is an <strong>intelligence co-pilot</strong> designed to discover research gaps, synthesize literature, and structure proposals. It is NOT a substitute for original empirical research, primary data collection, or critical critical human scholarship.
                </p>
              </div>

              <h3 className="font-bold text-slate-900 dark:text-slate-100">Guidance for University Students & Scholars</h3>
              <ul className="list-disc pl-5 space-y-2 text-xs">
                <li><strong>Human in the Loop:</strong> Always critically review, verify primary sources, and refine AI-generated outlines before submitting proposals to university thesis committees.</li>
                <li><strong>Citation Standards:</strong> When using AI generated synthesis, disclose tool usage in accordance with your university’s ethics board (e.g., APA, IEEE, MLA guidelines for generative AI assistance).</li>
                <li><strong>Anti-Plagiarism:</strong> ThesisVerse includes built-in originality evaluation tools to help researchers avoid clichéd research tropes and ensure novel contributions.</li>
              </ul>
            </div>
          )}

          {activeSubTab === "cookies" && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-indigo-500" /> Cookie & Local Storage Policy
              </h2>
              <p className="text-xs">
                ThesisVerse utilizes minimal essential browser local storage (`localStorage`) and essential session cookies to store your preferred dark/light theme, saved paper library, and comparison matrix items locally on your device.
              </p>
            </div>
          )}

          {activeSubTab === "copyright" && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Scale className="w-5 h-5 text-indigo-500" /> Copyright & Open Access Terms
              </h2>
              <p className="text-xs">
                All indexed research papers, DOIs, abstracts, and author attributions are derived from open access repository metadata under Creative Commons CC-BY 4.0 licenses or public domain academic listings.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
