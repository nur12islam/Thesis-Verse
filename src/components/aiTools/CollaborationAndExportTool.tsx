import React, { useState } from "react";
import {
  Users,
  Share2,
  Download,
  Copy,
  Check,
  MessageSquare,
  UserPlus,
  Shield,
  FileText,
  Clock,
  Sparkles,
  Send
} from "lucide-react";

interface CollaborationAndExportToolProps {
  onShowToast: (title: string, message?: string, type?: "success" | "error" | "info") => void;
}

interface Collaborator {
  id: string;
  name: string;
  email: string;
  role: "Owner" | "Editor" | "Viewer";
  avatar: string;
}

interface Comment {
  id: string;
  author: string;
  role: string;
  text: string;
  timestamp: string;
}

export const CollaborationAndExportTool: React.FC<CollaborationAndExportToolProps> = ({ onShowToast }) => {
  const [activeTab, setActiveTab] = useState<"collab" | "export">("collab");

  // Collaborators State
  const [collaborators, setCollaborators] = useState<Collaborator[]>([
    { id: "1", name: "You (Principal Investigator)", email: "pi@university.edu", role: "Owner", avatar: "👨‍🔬" },
    { id: "2", name: "Dr. Aris Thorne", email: "thorne@mit.edu", role: "Editor", avatar: "👨‍🏫" },
    { id: "3", name: "Elena Rostova", email: "elena@ethz.ch", role: "Viewer", avatar: "👩‍🎓" },
  ]);
  const [newEmail, setNewEmail] = useState("");
  const [newRole, setNewRole] = useState<"Editor" | "Viewer">("Editor");

  // Comments Feed State
  const [comments, setComments] = useState<Comment[]>([
    {
      id: "c1",
      author: "Dr. Aris Thorne",
      role: "Editor",
      text: "Chapter 3 methodology looks solid, but please ensure sample variance is reported for the 2025 dataset.",
      timestamp: "10 minutes ago"
    },
    {
      id: "c2",
      author: "Elena Rostova",
      role: "Viewer",
      text: "The literature review citations match my independent search on IEEE Xplore.",
      timestamp: "2 hours ago"
    }
  ]);
  const [newCommentText, setNewCommentText] = useState("");

  const handleInvite = () => {
    if (!newEmail.trim()) {
      onShowToast("Email Required", "Please enter collaborator email address.", "info");
      return;
    }

    const newCollab: Collaborator = {
      id: String(Date.now()),
      name: newEmail.split("@")[0],
      email: newEmail.trim(),
      role: newRole,
      avatar: "👥"
    };

    setCollaborators([...collaborators, newCollab]);
    setNewEmail("");
    onShowToast("Invitation Sent", `Invited ${newCollab.email} as ${newRole}`, "success");
  };

  const handleAddComment = () => {
    if (!newCommentText.trim()) return;

    const commentObj: Comment = {
      id: String(Date.now()),
      author: "You",
      role: "Owner",
      text: newCommentText.trim(),
      timestamp: "Just now"
    };

    setComments([...comments, commentObj]);
    setNewCommentText("");
    onShowToast("Comment Posted", "", "success");
  };

  const handleExportDoc = (format: "md" | "txt" | "json") => {
    const data = `# THESISVERSE RESEARCH WORKSPACE EXPORT

## PROJECT COLLABORATORS
${collaborators.map((c) => `- ${c.name} (${c.email}) [${c.role}]`).join("\n")}

## PROJECT COMMENTS
${comments.map((cm) => `[${cm.timestamp}] ${cm.author}: ${cm.text}`).join("\n\n")}
`;

    const blob = new Blob([data], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `thesisverse_workspace_export.${format}`;
    a.click();
    URL.revokeObjectURL(url);
    onShowToast("Project Exported", `Downloaded workspace in .${format}`, "success");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white shadow-md border border-indigo-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-300 text-xs font-bold uppercase tracking-wider mb-2">
            <Users className="w-4 h-4 text-amber-300" /> Team Research Workspace
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white">
            Collaboration, Permissions & Smart Export
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            Invite co-authors, manage access roles, comment on research drafts, and export in 4 formats.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTab("collab")}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === "collab" ? "bg-indigo-600 text-white shadow-sm" : "text-slate-400 hover:text-white"
            }`}
          >
            <Users className="w-3.5 h-3.5" /> Team & Comments
          </button>
          <button
            onClick={() => setActiveTab("export")}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === "export" ? "bg-indigo-600 text-white shadow-sm" : "text-slate-400 hover:text-white"
            }`}
          >
            <Download className="w-3.5 h-3.5" /> Smart Export Suite
          </button>
        </div>
      </div>

      {activeTab === "collab" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Collaborator Management */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <UserPlus className="w-4 h-4 text-indigo-600" /> Invite Collaborators & Co-Authors
            </h3>

            <div className="flex gap-2">
              <input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="colleague@university.edu..."
                className="flex-1 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <select
                value={newRole}
                onChange={(e) => setNewRole(e.target.value as any)}
                className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200"
              >
                <option value="Editor">Editor</option>
                <option value="Viewer">Viewer</option>
              </select>
              <button
                onClick={handleInvite}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm shrink-0"
              >
                Invite
              </button>
            </div>

            <div className="space-y-2 pt-2">
              <span className="text-[10px] font-bold uppercase text-slate-400 block">Active Team Members ({collaborators.length})</span>
              {collaborators.map((c) => (
                <div key={c.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs">
                  <div className="flex items-center gap-2.5">
                    <span className="text-lg">{c.avatar}</span>
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white block">{c.name}</span>
                      <span className="text-[11px] text-slate-400">{c.email}</span>
                    </div>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full font-extrabold text-[10px] ${
                    c.role === "Owner" ? "bg-amber-500/10 text-amber-600" : c.role === "Editor" ? "bg-indigo-500/10 text-indigo-600" : "bg-slate-200 dark:bg-slate-800 text-slate-600"
                  }`}>
                    {c.role}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Comments Feed */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 flex flex-col justify-between">
            <div className="space-y-4">
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-indigo-600" /> Research Project Discussion Feed
              </h3>

              <div className="space-y-3 max-h-[250px] overflow-y-auto pr-1">
                {comments.map((cm) => (
                  <div key={cm.id} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 dark:text-white">{cm.author} ({cm.role})</span>
                      <span className="text-[10px] text-slate-400">{cm.timestamp}</span>
                    </div>
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{cm.text}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
              <input
                type="text"
                value={newCommentText}
                onChange={(e) => setNewCommentText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddComment()}
                placeholder="Add a comment or feedback note..."
                className="flex-1 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                onClick={handleAddComment}
                className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm flex items-center gap-1 shrink-0"
              >
                <Send className="w-3.5 h-3.5" /> Post
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* MODE 2: EXPORT SUITE */
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
            <Download className="w-5 h-5 text-indigo-600" /> Smart Multi-Format Academic Exporter
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { format: "md", label: "Markdown (.MD)", desc: "Clean, portable markdown format ideal for GitHub, Obsidian, or Notion." },
              { format: "txt", label: "Plain Text (.TXT)", desc: "Standard raw text format for offline manuscript drafting." },
              { format: "json", label: "JSON Data (.JSON)", desc: "Structured metadata format for programmatic research import." }
            ].map((exp) => (
              <div
                key={exp.format}
                onClick={() => handleExportDoc(exp.format as any)}
                className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-indigo-500/50 cursor-pointer transition-all space-y-2 group"
              >
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-sm text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors">
                    {exp.label}
                  </span>
                  <Download className="w-4 h-4 text-indigo-500 group-hover:scale-110 transition-transform" />
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">{exp.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
