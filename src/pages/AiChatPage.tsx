import React, { useState } from "react";
import { Thesis } from "../types/thesis";
import { sendAiChatMessage } from "../services/api";
import {
  MessageSquare,
  Send,
  Loader2,
  Sparkles,
  Bot,
  User,
  BookOpen,
  HelpCircle
} from "lucide-react";

interface AiChatPageProps {
  savedTheses: Thesis[];
  onShowToast: (title: string, message?: string, type?: "success" | "error" | "info") => void;
}

export const AiChatPage: React.FC<AiChatPageProps> = ({ savedTheses, onShowToast }) => {
  const [messages, setMessages] = useState<{ sender: "user" | "ai"; text: string }[]>([
    {
      sender: "ai",
      text: "Hello! I am ThesisVerse AI, your academic literature and dissertation research assistant. How can I assist with your literature review, methodology, or research proposal today?",
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedContextPaper, setSelectedContextPaper] = useState<Thesis | null>(
    savedTheses[0] || null
  );

  const SUGGESTIONS = [
    "How do I structure a 5-chapter Ph.D. dissertation proposal?",
    "Explain the primary research gaps in quantum computing operators.",
    "What are best practices for calculating sample sizes in neural implant trials?",
    "Help me draft 3 empirical research questions for my thesis."
  ];

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || input;
    if (!textToSend.trim()) return;

    const updated = [...messages, { sender: "user" as const, text: textToSend }];
    setMessages(updated);
    if (!queryText) setInput("");
    setLoading(true);

    try {
      const res = await sendAiChatMessage(updated, selectedContextPaper || undefined);
      setMessages([...updated, { sender: "ai" as const, text: res.reply }]);
    } catch (err: any) {
      onShowToast("Chat Error", err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-12 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <MessageSquare className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
          AI Literature & Research Assistant
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Chat with Gemini 3.6 Flash regarding research gaps, methodologies, literature synthesis, or citation standards.
        </p>
      </div>

      {/* Context Paper Selector */}
      {savedTheses.length > 0 && (
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center gap-2 text-xs">
          <BookOpen className="w-4 h-4 text-indigo-600 shrink-0" />
          <span className="font-bold text-slate-500 uppercase text-[10px]">Context Paper:</span>
          <select
            value={selectedContextPaper?.id || ""}
            onChange={(e) => {
              const found = savedTheses.find((t) => t.id === e.target.value);
              setSelectedContextPaper(found || null);
            }}
            className="flex-1 p-1.5 rounded-lg bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 font-semibold"
          >
            <option value="">-- No Specific Paper Context --</option>
            {savedTheses.map((t) => (
              <option key={t.id} value={t.id}>
                {t.title}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Suggestion Chips */}
      <div className="flex flex-wrap gap-2 text-xs">
        {SUGGESTIONS.map((s, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(s)}
            className="px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 border border-slate-200 dark:border-slate-700/80 transition-colors text-left"
          >
            💡 {s}
          </button>
        ))}
      </div>

      {/* Chat Messages Box */}
      <div className="min-h-[350px] max-h-[500px] overflow-y-auto p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex items-start gap-3 text-xs ${
              m.sender === "user" ? "flex-row-reverse" : "flex-row"
            }`}
          >
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                m.sender === "user"
                  ? "bg-indigo-600 text-white"
                  : "bg-gradient-to-tr from-amber-500 to-indigo-600 text-white"
              }`}
            >
              {m.sender === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            <div
              className={`p-4 rounded-2xl max-w-[80%] leading-relaxed ${
                m.sender === "user"
                  ? "bg-indigo-600 text-white font-medium"
                  : "bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-800"
              }`}
            >
              <span className="font-bold block mb-1 text-[10px] opacity-75">
                {m.sender === "user" ? "You" : "ThesisVerse AI Assistant"}
              </span>
              <p className="whitespace-pre-wrap">{m.text}</p>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2 text-xs text-indigo-500 p-2">
            <Loader2 className="w-4 h-4 animate-spin" /> Synthesizing literature advice with Gemini...
          </div>
        )}
      </div>

      {/* Input Box */}
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Ask AI academic research question..."
          className="flex-1 p-3 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
        />
        <button
          onClick={() => handleSend()}
          disabled={loading || !input.trim()}
          className="px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs transition-colors flex items-center gap-1.5"
        >
          <Send className="w-4 h-4" /> Send
        </button>
      </div>
    </div>
  );
};
