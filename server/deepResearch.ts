import type { Express, Request, Response } from "express";

type WebResult = {
  title: string;
  url: string;
  snippet: string;
  displayLink?: string;
  sourceType: "web" | "university" | "news" | "report" | "youtube";
};

type AiFinding = {
  claim: string;
  evidence: string[];
  confidence: number;
  sources: string[];
  caveat?: string;
};

const clean = (value: unknown) => typeof value === "string" ? value.replace(/\s+/g, " ").trim() : "";

async function fetchJson(url: string, init?: RequestInit) {
  try {
    const response = await fetch(url, init);
    if (!response.ok) return null;
    return await response.json();
  } catch {
    return null;
  }
}

async function googleSearch(query: string, sourceType: WebResult["sourceType"], limit = 8): Promise<WebResult[]> {
  const key = process.env.GOOGLE_CSE_API_KEY;
  const cx = process.env.GOOGLE_CSE_CX;
  if (!key || !cx) return [];
  const url = `https://www.googleapis.com/customsearch/v1?key=${encodeURIComponent(key)}&cx=${encodeURIComponent(cx)}&q=${encodeURIComponent(query)}&num=${Math.min(limit, 10)}&safe=active`;
  const data = await fetchJson(url);
  return (data?.items || []).map((item: any) => ({
    title: clean(item.title),
    url: clean(item.link),
    snippet: clean(item.snippet),
    displayLink: clean(item.displayLink),
    sourceType
  })).filter((x: WebResult) => x.title && x.url);
}

async function youtubeSearch(query: string, limit = 8): Promise<WebResult[]> {
  const key = process.env.YOUTUBE_API_KEY || process.env.GOOGLE_CSE_API_KEY;
  if (!key) return [];
  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&order=relevance&safeSearch=strict&maxResults=${Math.min(limit, 50)}&q=${encodeURIComponent(query)}&key=${encodeURIComponent(key)}`;
  const data = await fetchJson(url);
  return (data?.items || []).map((item: any) => ({
    title: clean(item.snippet?.title),
    url: item.id?.videoId ? `https://www.youtube.com/watch?v=${item.id.videoId}` : "",
    snippet: clean(item.snippet?.description),
    displayLink: "youtube.com",
    sourceType: "youtube" as const
  })).filter((x: WebResult) => x.title && x.url);
}

async function callOpenRouter(model: string, prompt: string): Promise<string> {
  const key = process.env.OPENROUTER_API_KEY;
  if (!key) return "";
  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`,
      "HTTP-Referer": "https://thesisverse.dpdns.org",
      "X-Title": "ThesisVerse Deep Research"
    },
    body: JSON.stringify({
      model,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.1,
      max_tokens: 1400
    })
  });
  if (!response.ok) return "";
  const data = await response.json();
  return clean(data?.choices?.[0]?.message?.content);
}

function extractJson<T>(text: string, fallback: T): T {
  try {
    const match = text.match(/\{[\s\S]*\}/);
    return match ? JSON.parse(match[0]) as T : fallback;
  } catch {
    return fallback;
  }
}

function dedupe(results: WebResult[]) {
  const seen = new Set<string>();
  return results.filter((item) => {
    const key = item.url.toLowerCase().replace(/[?#].*$/, "");
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function evidencePacket(topic: string, results: WebResult[]) {
  return results.slice(0, 36).map((r, i) => `[${i + 1}] ${r.title}\nURL: ${r.url}\nTYPE: ${r.sourceType}\n${r.snippet}`).join("\n\n");
}

async function runAiPanel(topic: string, results: WebResult[]) {
  const packet = evidencePacket(topic, results);
  const analystJobs = [
    {
      role: "source analyst",
      model: "openai/gpt-oss-120b:free",
      task: "Extract only factual claims directly supported by the supplied source snippets. Separate facts from interpretation."
    },
    {
      role: "academic analyst",
      model: "qwen/qwen3-235b-a22b:free",
      task: "Identify academic context, terminology, institutions, reports, historical details and research leads. Do not invent missing facts."
    },
    {
      role: "skeptic",
      model: "deepseek/deepseek-r1-0528:free",
      task: "Act as a skeptical fact checker. Identify claims that need stronger evidence, conflicting statements, weak sources and likely misinformation."
    }
  ];

  const outputs = await Promise.all(analystJobs.map(async (job) => {
    const prompt = `You are the ${job.role} in ThesisVerse Deep Research.\nJOB: ${job.task}\nTOPIC: ${topic}\nSOURCE MATERIAL:\n${packet}\n\nReturn JSON only: {"findings":[{"claim":"...","evidence":["[1]"],"confidence":0-100,"sources":["url"],"caveat":"optional"}]}. Never create a citation or URL that is not in the source material.`;
    const text = await callOpenRouter(job.model, prompt);
    return { model: job.model, role: job.role, findings: extractJson<{ findings: AiFinding[] }>(text, { findings: [] }).findings || [] };
  }));

  const combined = outputs.flatMap((o) => o.findings);
  const verificationPrompt = `You are the lead verification editor for an academic research tool. Verify claims using ONLY the supplied source packet and analyst findings. A claim is verified only when at least two independent credible sources support it, or one highly authoritative primary source supports it. Do not treat AI output as evidence. Do not turn YouTube opinion into fact. Return JSON only: {"verified":[{"claim":"...","evidence":["[1]","[4]"],"confidence":0-100,"sources":["url"],"caveat":"..."}],"rejected":["..."]}. TOPIC: ${topic}\nSOURCE PACKET:\n${packet}\nANALYST FINDINGS:\n${JSON.stringify(combined).slice(0, 18000)}`;
  const verifierText = await callOpenRouter("openai/gpt-oss-120b:free", verificationPrompt);
  const verification = extractJson<{ verified: AiFinding[]; rejected: string[] }>(verifierText, { verified: [], rejected: [] });

  return { analysts: outputs, verification };
}

export function registerDeepResearchRoutes(app: Express) {
  app.post("/api/deep-research", async (req: Request, res: Response) => {
    const topic = clean(req.body?.topic || req.query.topic);
    if (!topic) return res.status(400).json({ error: "topic is required" });

    const direct = await Promise.all([
      googleSearch(`"${topic}" research thesis paper`, "web", 8),
      googleSearch(`"${topic}" site:edu OR site:ac.in university`, "university", 8),
      googleSearch(`"${topic}" report filetype:pdf`, "report", 8),
      googleSearch(`"${topic}" news`, "news", 8),
      youtubeSearch(`${topic} lecture research documentary`, 8)
    ]);

    const sources = dedupe(direct.flat()).slice(0, 50);
    const ai = sources.length ? await runAiPanel(topic, sources) : { analysts: [], verification: { verified: [], rejected: [] } };

    const verifiedUrls = new Set(ai.verification.verified.flatMap((x) => x.sources || []));
    const verifiedSources = sources.filter((s) => verifiedUrls.has(s.url));
    const relatedSources = sources.filter((s) => !verifiedUrls.has(s.url));

    res.json({
      topic,
      mode: "deep",
      sourceCount: sources.length,
      sources: verifiedSources,
      relatedSources,
      analysts: ai.analysts.map((a) => ({ role: a.role, model: a.model, findingCount: a.findings.length })),
      verifiedFindings: ai.verification.verified,
      rejectedClaims: ai.verification.rejected,
      disclaimer: "AI-assisted synthesis. Verify the original source before citing or submitting academic work."
    });
  });
}
