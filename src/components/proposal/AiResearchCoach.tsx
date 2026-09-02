import React, { useState, useRef, useEffect } from "react";
import { FullProposal } from "../../types/thesis";
import { sendCoachChatMessage } from "../../services/api";
import { MessageSquare, Send, Sparkles, Bot, User, Loader2, ShieldCheck, HelpCircle } from "lucide-react";

interface AiResearchCoachProps {
  proposal: FullProposal;
  onShowToast: (title: string, message?: string, type?: "success" | "error" | "info") => void;
}

interface ChatMessage {
  id: string;
  sender: "user" | "coach";
  text: string;
  timestamp: string;
}

export const AiResearchCoach: React.FC<AiResearchCoachProps> = ({ proposal, onShowToast }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome-1",
      sender: "coach",
      text: `Hello! I am your AI Research Coach for "${proposal.title}". Ask me anything about narrowing your scope, refining objectives, picking methodologies, or finding search keywords!`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const promptPills = [
    "Is this scope too broad?",
    "How can I improve my research objectives?",
    "Which methodology fits my topic best?",
    "Suggest literature search keywords",
    "How can I strengthen my proposal?"
  ];

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSendMessage = async (customText?: string) => {
    const textToSend = customText || input;
    if (!textToSend.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: "user",
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!customText) setInput("");
    setLoading(true);

    try {
      const conversationHistory = messages.map((m) => ({
        sender: m.sender,
        text: m.text
      }));

      const res = await sendCoachChatMessage(proposal, textToSend, conversationHistory);

      const coachMsg: ChatMessage = {
        id: `c-${Date.now()}`,
        sender: "coach",
        text: res.text,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      };

      setMessages((prev) => [...prev, coachMsg]);
    } catch (err: any) {
      onShowToast("Coach Unavailable", err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 flex flex-col h-[520px]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 shrink-0">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-indigo-100 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-sm">AI Research Coach</h3>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">Contextual Proposal & Methodology Advisor</p>
          </div>
        </div>
        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
          <ShieldCheck className="w-3 h-3" /> Grounded
        </span>
      </div>

      {/* Prompt Pills */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 shrink-0 scrollbar-none">
        {promptPills.map((pill, i) => (
          <button
            key={i}
            onClick={() => handleSendMessage(pill)}
            disabled={loading}
            className="text-[11px] whitespace-nowrap px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-950 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors border border-slate-200/60 dark:border-slate-700/60"
          >
            {pill}
          </button>
        ))}
      </div>

      {/* Chat Messages Body */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-1 text-xs">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex items-start gap-2 ${m.sender === "user" ? "flex-row-reverse" : ""}`}
          >
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                m.sender === "user"
                  ? "bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-900"
                  : "bg-indigo-600 text-white"
              }`}
            >
              {m.sender === "user" ? <User className="w-3.5 h-3.5" /> : <Sparkles className="w-3.5 h-3.5" />}
            </div>
            <div
              className={`p-3 rounded-2xl max-w-[85%] space-y-1 ${
                m.sender === "user"
                  ? "bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-tr-none"
                  : "bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-none leading-relaxed"
              }`}
            >
              <div className="whitespace-pre-wrap">{m.text}</div>
              <div
                className={`text-[9px] text-right ${
                  m.sender === "user" ? "text-slate-300 dark:text-slate-600" : "text-slate-400"
                }`}
              >
                {m.timestamp}
              </div>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2 text-slate-400 text-xs py-2">
            <Loader2 className="w-4 h-4 animate-spin text-indigo-500" />
            Coach is analyzing proposal context...
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input Box */}
      <div className="shrink-0 pt-2 border-t border-slate-100 dark:border-slate-800 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
          placeholder="Ask AI Coach about this proposal..."
          className="flex-1 text-xs p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
        />
        <button
          onClick={() => handleSendMessage()}
          disabled={!input.trim() || loading}
          className="px-3.5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs flex items-center justify-center transition-colors disabled:opacity-50"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
