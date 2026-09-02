import React from "react";
import { FullProposal } from "../../types/thesis";
import { FileText, CheckCircle2, Circle, Save } from "lucide-react";

interface ProposalSectionNavigatorProps {
  proposal: FullProposal;
  activeSection: string;
  onSelectSection: (sectionId: string) => void;
  onUpdateTemplate: (template: "Bachelor's" | "Master's" | "MPhil" | "Ph.D.") => void;
  onOpenExport: () => void;
  onSaveVersionSnapshot: () => void;
}

export const ProposalSectionNavigator: React.FC<ProposalSectionNavigatorProps> = ({ proposal, activeSection, onSelectSection, onUpdateTemplate, onOpenExport, onSaveVersionSnapshot }) => {
  const sections = [
    { id: "title-meta", label: "Title & Degree Meta", filled: Boolean(proposal.title) },
    { id: "background", label: "1. Background & Rationale", filled: Boolean(proposal.background?.context) },
    { id: "problem", label: "2. Problem Statement & Gap", filled: Boolean(proposal.problemStatement?.whatProblemExists) },
    { id: "objectives", label: "3. Objectives & Outcomes", filled: Boolean(proposal.objectives?.primaryObjective) },
    { id: "questions", label: "4. Research Questions", filled: Boolean(proposal.questions?.mainQuestion) },
    { id: "scope", label: "5. Scope & Limitations", filled: Boolean(proposal.scope?.includedTopics?.length) },
    { id: "methodology", label: "6. Research Methodology", filled: Boolean(proposal.methodology?.description) },
    { id: "chapters", label: "7. Chapter Outline", filled: Boolean(proposal.chapterOutline?.length) },
    { id: "contribution", label: "8. Expected Contributions", filled: Boolean(proposal.expectedContribution?.academicContribution) },
    { id: "keywords", label: "9. Keywords & Research Tags", filled: Boolean(proposal.keywords?.primary?.length) },
    { id: "timeline", label: "10. Research Timeline", filled: Boolean(proposal.timeline?.length) },
    { id: "literature", label: "11. Supporting Literature", filled: Boolean(proposal.supportingLiterature?.length) },
    { id: "quality-score", label: "12. Quality Audit & Feasibility", filled: true }
  ];
  const completionPercentage = Math.round((sections.filter((s) => s.filled).length / sections.length) * 100);

  return (
    <div className="proposal-workspace proposal-panel p-4 space-y-5">
      <div className="space-y-3 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div className="flex items-center justify-between"><span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Proposal Template</span><span className="text-[10px] font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">v{proposal.versionHistory?.length || 1}.0</span></div>
        <select value={proposal.templateType} onChange={(e) => onUpdateTemplate(e.target.value as any)} className="w-full text-xs p-2 rounded-xl">
          <option value="Bachelor's">Undergraduate / Bachelor's Thesis</option><option value="Master's">Master's Dissertation</option><option value="MPhil">MPhil Research Proposal</option><option value="Ph.D.">Ph.D. Dissertation Proposal</option>
        </select>
      </div>
      <div className="space-y-1.5"><div className="flex items-center justify-between text-xs"><span className="font-bold text-slate-700 dark:text-slate-300">Proposal Readiness</span><span className="font-extrabold text-slate-700 dark:text-slate-200">{completionPercentage}%</span></div><div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden"><div className="proposal-progress h-full transition-all duration-500 rounded-full" style={{ width: `${completionPercentage}%` }} /></div></div>
      <div className="space-y-1 text-xs"><span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block px-1 mb-2">Document Sections</span>{sections.map((sec) => { const isActive = activeSection === sec.id; return <button key={sec.id} onClick={() => onSelectSection(sec.id)} className={`w-full text-left px-3 py-2 rounded-xl font-medium transition-all flex items-center justify-between ${isActive ? "proposal-active font-bold" : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"}`}><span className="truncate">{sec.label}</span>{sec.filled ? <CheckCircle2 className="w-3.5 h-3.5 shrink-0 ml-2" /> : <Circle className="w-3.5 h-3.5 shrink-0 ml-2" />}</button>; })}</div>
      <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2"><button onClick={onSaveVersionSnapshot} className="proposal-muted-action w-full p-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-colors"><Save className="w-3.5 h-3.5" /> Save Version Snapshot</button><button onClick={onOpenExport} className="proposal-active w-full p-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-colors"><FileText className="w-3.5 h-3.5" /> Export & Print Proposal</button></div>
    </div>
  );
};
