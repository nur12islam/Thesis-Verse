import React, { useState } from "react";
import { Thesis } from "../types/thesis";
import { sendAiChatMessage } from "../services/api";
import { MessageSquare, Send, Loader2, Bot, User, BookOpen } from "lucide-react";

interface AiChatPageProps {
  savedTheses: Thesis[];
  onShowToast: (title: string, message?: string, type?: "success" | "error" | "info") => void;
}

export const AiChatPage: React.FC<AiChatPageProps> = ({ savedTheses, onShowToast }) => {
  const [messages, setMessages] = useState<{ sender: "user" | "ai"; text: string }[]>([
    { sender: "ai", text: "Hello! I am ThesisVerse AI, your academic research assistant. Ask me about literature reviews, methodology, research gaps, thesis ideas, or proposal design." },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedContextPaper, setSelectedContextPaper] = useState<Thesis | null>(savedTheses[0] || null);

  const SUGGESTIONS = [
    "How do I structure a 5-chapter Ph.D. dissertation proposal?",
    "Explain the primary research gaps in quantum computing operators.",
    "What are best practices for calculating sample sizes in neural implant trials?",
    "Help me draft 3 empirical research questions for my thesis."
  ];

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || input;
    if (!textToSend.trim() || loading) return;

    const updated = [...messages, { sender: "user" as const, text: textToSend.trim() }];
    setMessages(updated);
    setInput("");
    setLoading(true);

    try {
      const res = await sendAiChatMessage(updated, selectedContextPaper || undefined, "fast");
      if (!res?.reply?.trim()) throw new Error("The AI service returned an empty response.");
      setMessages([...updated, { sender: "ai" as const, text: res.reply }]);
    } catch (err: any) {
      const message = err?.message || "AI Assistant could not reach the AI service.";
      setMessages([...updated, { sender: "ai" as const, text: `I couldn't complete that request. ${message}` }]);
      onShowToast("AI Assistant Error", message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2"><MessageSquare className="w-7 h-7 tv-accent" /> AI Literature & Research Assistant</h1>
        <p className="text-xs mt-1 text-slate-500 dark:text-slate-400">Ask questions and get academic guidance powered by the ThesisVerse AI engine.</p>
      </div>

      {savedTheses.length > 0 && (
        <div className="p-3 rounded-xl tv-surface border flex items-center gap-2 text-xs">
          <BookOpen className="w-4 h-4 tv-accent shrink-0" />
          <span className="font-bold text-[10px] uppercase text-slate-500 dark:text-slate-400">Context Paper:</span>
          <select value={selectedContextPaper?.id || ""} onChange={(e) => setSelectedContextPaper(savedTheses.find(t => t.id === e.target.value) || null)} className="flex-1 p-1.5 rounded-lg border font-semibold">
            <option value="">-- No Specific Paper Context --</option>
            {savedTheses.map(t => <option key={t.id} value={t.id}>{t.title}</option>)}
          </select>
        </div>
      )}

      <div className="flex flex-wrap gap-2 text-xs">
        {SUGGESTIONS.map((s, idx) => <button key={idx} onClick={() => handleSend(s)} disabled={loading} className="px-3 py-1.5 rounded-full tv-surface border text-left text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#222a21] disabled:opacity-50">💡 {s}</button>)}
      </div>

      <div className="min-h-[350px] max-h-[560px] overflow-y-auto p-5 rounded-2xl tv-surface border space-y-4">
        {messages.map((m, idx) => (
          <div key={idx} className={`flex items-start gap-3 text-xs ${m.sender === "user" ? "flex-row-reverse" : "flex-row"}`}>
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border ${m.sender === "user" ? "bg-[#849779] text-[#172016] border-transparent" : "bg-[var(--tv-accent-soft)] tv-accent border-[var(--tv-border)]"}`}>
              {m.sender === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>
            <div className={`p-4 rounded-2xl max-w-[82%] leading-relaxed border ${m.sender === "user" ? "bg-[#849779] text-[#172016] border-transparent" : "bg-[var(--tv-surface-soft)] text-[var(--tv-text)] border-[var(--tv-border)]"}`}>
              <span className="font-bold block mb-1 text-[10px] opacity-70">{m.sender === "user" ? "You" : "ThesisVerse AI Assistant"}</span>
              <p className="whitespace-pre-wrap">{m.text}</p>
            </div>
          </div>
        ))}
        {loading && <div className="flex items-center gap-2 text-xs tv-accent p-2"><Loader2 className="w-4 h-4 animate-spin" /> Thinking…</div>}
      </div>

      <div className="flex items-center gap-2">
        <input type="text" value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && handleSend()} placeholder="Ask an academic research question…" className="flex-1 p-3 text-xs rounded-xl border focus:outline-none focus:ring-2 focus:ring-[#849779]/30" />
        <button onClick={() => handleSend()} disabled={loading || !input.trim()} className="px-5 py-3 rounded-xl bg-[#849779] hover:bg-[#65775a] disabled:opacity-50 text-[#172016] font-bold text-xs transition-colors flex items-center gap-1.5"><Send className="w-4 h-4" /> Send</button>
      </div>
    </div>
  );
};
