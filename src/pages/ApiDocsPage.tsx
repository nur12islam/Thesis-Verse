import React, { useState } from "react";
import { Terminal, Code, Copy, Check, Download, Zap, BookOpen, Key, Server, Play, Shield } from "lucide-react";

export const ApiDocsPage: React.FC = () => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<"curl" | "js" | "python">("curl");
  const [activeEndpointIndex, setActiveEndpointIndex] = useState(0);
  const [testResponse, setTestResponse] = useState<string | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);

  const endpoints = [
    {
      method: "GET",
      path: "/api/search",
      summary: "Academic Research & Thesis Search",
      description: "Query indexed academic papers and rare dissertations with multi-filter parameters.",
      params: [
        { name: "q", type: "string", required: false, desc: "Search keywords or DOI" },
        { name: "subject", type: "string", required: false, desc: "Subject category filter" },
        { name: "type", type: "string", required: false, desc: "Document type: All, Thesis, Dissertation, Journal" },
        { name: "minNoveltyScore", type: "number", required: false, desc: "Filter by novelty rating (0-100)" },
        { name: "page", type: "number", required: false, desc: "Page number (default: 1)" }
      ],
      sampleResponse: `{
  "total": 12,
  "page": 1,
  "totalPages": 1,
  "data": [
    {
      "id": "th-101",
      "title": "Quantum Neural Operators for Non-Linear Partial Differential Equations",
      "authors": ["Dr. Aris Thorne", "Prof. Elena Rostova"],
      "university": "MIT",
      "year": 2026,
      "doi": "10.1038/s41586-2026-00101-x",
      "noveltyScore": 94
    }
  ]
}`
    },
    {
      method: "POST",
      path: "/api/ai/rare-thesis",
      summary: "Generate Rare Thesis Discovery Idea",
      description: "Uses Gemini 3.6 Flash to synthesize a ground-breaking, frontier cross-disciplinary thesis idea.",
      params: [
        { name: "domains", type: "array", required: false, desc: "Target research domains" },
        { name: "focus", type: "string", required: false, desc: "Keyword or research focus" },
        { name: "degreeLevel", type: "string", required: false, desc: "Ph.D. or Master's" }
      ],
      sampleResponse: `{
  "thesis": {
    "id": "rare-17728392",
    "title": "Optogenetic Control of Closed-Loop Neural Operators in Synthetic Organoids",
    "subject": "Bio-Engineering & Genomics",
    "noveltyScore": 96,
    "researchGap": "Unexplored integration of light-actuated cellular switches with real-time neural operator models."
  }
}`
    },
    {
      method: "POST",
      path: "/api/ai/generate-proposal",
      summary: "Build Full Academic Research Proposal",
      description: "Generates a complete 6-chapter dissertation proposal with methodology, objectives, and literature.",
      params: [
        { name: "topic", type: "string", required: true, desc: "Core research proposal topic" },
        { name: "degree", type: "string", required: false, desc: "Ph.D., Master's, or Bachelor's" },
        { name: "methodologyType", type: "string", required: false, desc: "Quantitative, Qualitative, or Mixed" }
      ],
      sampleResponse: `{
  "fullProposal": {
    "id": "prop-17728392",
    "title": "Evaluating Quantum Neural Operators: A Methodological Investigation",
    "degree": "Ph.D.",
    "qualityScore": { "overallScore": 91 },
    "chapterOutline": [...]
  }
}`
    },
    {
      method: "GET",
      path: "/api/health",
      summary: "System Health & API Readiness",
      description: "Returns server uptime status, indexed records count, and database pool readiness.",
      params: [],
      sampleResponse: `{
  "status": "ok",
  "service": "ThesisVerse Academic Search API",
  "recordsIndexed": 12,
  "timestamp": "2026-08-07T03:49:00.000Z"
}`
    }
  ];

  const currentEp = endpoints[activeEndpointIndex];

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleRunTest = async () => {
    setIsExecuting(true);
    setTestResponse(null);
    try {
      if (currentEp.method === "GET") {
        const res = await fetch(currentEp.path);
        const data = await res.json();
        setTestResponse(JSON.stringify(data, null, 2));
      } else {
        const res = await fetch(currentEp.path, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ topic: "Quantum Neural Operators", degree: "Ph.D." })
        });
        const data = await res.json();
        setTestResponse(JSON.stringify(data, null, 2));
      }
    } catch (err: any) {
      setTestResponse(JSON.stringify({ error: "API execution failed", details: err.message }, null, 2));
    } finally {
      setIsExecuting(false);
    }
  };

  const generateSnippet = () => {
    if (selectedLanguage === "curl") {
      if (currentEp.method === "GET") {
        return `curl -X GET "https://thesisverse.org${currentEp.path}?q=Quantum" \\
  -H "Accept: application/json"`;
      }
      return `curl -X POST "https://thesisverse.org${currentEp.path}" \\
  -H "Content-Type: application/json" \\
  -d '{"topic": "Quantum Neural Operators", "degree": "Ph.D."}'`;
    } else if (selectedLanguage === "js") {
      if (currentEp.method === "GET") {
        return `const res = await fetch("https://thesisverse.org${currentEp.path}?q=Quantum");
const data = await res.json();
console.log(data);`;
      }
      return `const res = await fetch("https://thesisverse.org${currentEp.path}", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ topic: "Quantum Neural Operators", degree: "Ph.D." })
});
const data = await res.json();
console.log(data);`;
    } else {
      if (currentEp.method === "GET") {
        return `import requests

response = requests.get("https://thesisverse.org${currentEp.path}", params={"q": "Quantum"})
print(response.json())`;
      }
      return `import requests

payload = {"topic": "Quantum Neural Operators", "degree": "Ph.D."}
response = requests.post("https://thesisverse.org${currentEp.path}", json=payload)
print(response.json())`;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-12 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-200 dark:border-slate-800 pb-8">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-400 text-xs font-bold">
              <Zap className="w-3.5 h-3.5" />
              Developer API & OpenAPI 3.0 Reference
            </div>
            <h1 className="text-3xl font-black tracking-tight">ThesisVerse REST API Documentation</h1>
            <p className="text-xs text-slate-500 max-w-2xl">
              Integrate ThesisVerse academic search, rare thesis generation, and AI proposal builder directly into university portals and research applications.
            </p>
          </div>

          <a
            href="/api/health"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition-all shrink-0"
          >
            <Download className="w-4 h-4" />
            <span>OpenAPI 3.0 Spec</span>
          </a>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Endpoint Sidebar */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider px-1">Endpoints List</h3>
            <div className="space-y-2">
              {endpoints.map((ep, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setActiveEndpointIndex(idx);
                    setTestResponse(null);
                  }}
                  className={`w-full p-3 rounded-xl border text-left transition-all flex items-center justify-between gap-2 ${
                    activeEndpointIndex === idx
                      ? "bg-white dark:bg-slate-900 border-indigo-500 shadow-md ring-2 ring-indigo-500/20"
                      : "bg-white/60 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 hover:bg-white"
                  }`}
                >
                  <div className="space-y-1 overflow-hidden">
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-1.5 py-0.5 rounded text-[10px] font-extrabold ${
                          ep.method === "GET"
                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400"
                            : "bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-400"
                        }`}
                      >
                        {ep.method}
                      </span>
                      <span className="font-mono text-xs font-bold truncate">{ep.path}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 truncate">{ep.summary}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Endpoint Details & Interactive Code Tester */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-black ${
                        currentEp.method === "GET"
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400"
                          : "bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-400"
                      }`}
                    >
                      {currentEp.method}
                    </span>
                    <span className="font-mono text-base font-bold">{currentEp.path}</span>
                  </div>
                  <p className="text-xs text-slate-500">{currentEp.description}</p>
                </div>

                <button
                  onClick={handleRunTest}
                  disabled={isExecuting}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md flex items-center gap-1.5 transition-all"
                >
                  <Play className={`w-3.5 h-3.5 ${isExecuting ? "animate-spin" : ""}`} />
                  <span>{isExecuting ? "Executing..." : "Try It Out"}</span>
                </button>
              </div>

              {/* Request Parameters */}
              {currentEp.params.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                    Parameters
                  </h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-semibold">
                          <th className="py-2">Field</th>
                          <th className="py-2">Type</th>
                          <th className="py-2">Description</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {currentEp.params.map((p, i) => (
                          <tr key={i}>
                            <td className="py-2 font-mono font-bold text-indigo-600 dark:text-indigo-400">{p.name}</td>
                            <td className="py-2 font-mono text-slate-500">{p.type}</td>
                            <td className="py-2 text-slate-600 dark:text-slate-400">{p.desc}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Code Snippets Generator */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                    Client Code Snippet
                  </h4>
                  <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg text-[10px]">
                    {(["curl", "js", "python"] as const).map((lang) => (
                      <button
                        key={lang}
                        onClick={() => setSelectedLanguage(lang)}
                        className={`px-2.5 py-1 rounded font-bold uppercase transition-all ${
                          selectedLanguage === lang
                            ? "bg-white dark:bg-slate-900 text-indigo-600 shadow-sm"
                            : "text-slate-500 hover:text-slate-900"
                        }`}
                      >
                        {lang}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="relative bg-slate-950 text-slate-100 p-4 rounded-xl font-mono text-xs overflow-x-auto shadow-inner">
                  <pre>{generateSnippet()}</pre>
                  <button
                    onClick={() => handleCopy(generateSnippet(), 99)}
                    className="absolute top-3 right-3 p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                  >
                    {copiedIndex === 99 ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Live Test Results Output */}
              {testResponse && (
                <div className="space-y-2 border-t border-slate-100 dark:border-slate-800 pt-4">
                  <h4 className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Check className="w-4 h-4" /> Live Response Payload (200 OK)
                  </h4>
                  <pre className="bg-slate-950 text-emerald-400 p-4 rounded-xl font-mono text-xs overflow-x-auto max-h-60 overflow-y-auto">
                    {testResponse}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
