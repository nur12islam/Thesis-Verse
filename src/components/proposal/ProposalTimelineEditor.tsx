import React, { useState } from "react";
import { ProposalTimelinePhase } from "../../types/thesis";
import { Calendar, Plus, Trash2, CheckSquare, Square, Clock, ChevronDown, ChevronUp } from "lucide-react";

interface ProposalTimelineEditorProps {
  timeline: ProposalTimelinePhase[];
  onChangeTimeline: (updatedTimeline: ProposalTimelinePhase[]) => void;
}

export const ProposalTimelineEditor: React.FC<ProposalTimelineEditorProps> = ({
  timeline,
  onChangeTimeline
}) => {
  const [expandedPhaseId, setExpandedPhaseId] = useState<string | null>(timeline[0]?.id || null);

  const togglePhaseComplete = (id: string) => {
    const next = timeline.map((phase) =>
      phase.id === id ? { ...phase, completed: !phase.completed } : phase
    );
    onChangeTimeline(next);
  };

  const handleTaskToggle = (phaseId: string, taskIdx: number) => {
    // Task check toggling inside phase
    const next = timeline.map((p) => {
      if (p.id !== phaseId) return p;
      const tasks = [...p.tasks];
      if (tasks[taskIdx].startsWith("[x] ")) {
        tasks[taskIdx] = tasks[taskIdx].replace("[x] ", "");
      } else {
        tasks[taskIdx] = `[x] ${tasks[taskIdx]}`;
      }
      return { ...p, tasks };
    });
    onChangeTimeline(next);
  };

  const handleDurationChange = (phaseId: string, weeks: number) => {
    const next = timeline.map((p) => (p.id === phaseId ? { ...p, durationWeeks: weeks } : p));
    onChangeTimeline(next);
  };

  const handleAddPhase = () => {
    const newPhase: ProposalTimelinePhase = {
      id: `phase-${Date.now()}`,
      phase: "New Research Phase",
      durationWeeks: 4,
      tasks: ["Define phase deliverable"],
      completed: false
    };
    onChangeTimeline([...timeline, newPhase]);
    setExpandedPhaseId(newPhase.id);
  };

  const handleDeletePhase = (id: string) => {
    onChangeTimeline(timeline.filter((p) => p.id !== id));
  };

  const totalWeeks = timeline.reduce((acc, curr) => acc + (curr.durationWeeks || 0), 0);

  return (
    <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-sm">Research Roadmap & Timeline</h3>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">Total Estimated Horizon: ~{totalWeeks} Weeks ({Math.round(totalWeeks / 4)} Months)</p>
          </div>
        </div>
        <button
          onClick={handleAddPhase}
          className="px-2.5 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/80 hover:bg-indigo-100 text-indigo-600 dark:text-indigo-400 font-semibold text-xs flex items-center gap-1 transition-colors border border-indigo-200 dark:border-indigo-800"
        >
          <Plus className="w-3.5 h-3.5" /> Add Phase
        </button>
      </div>

      {/* Visual Gantt Bar */}
      <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden flex gap-0.5">
        {timeline.map((phase, idx) => {
          const widthPct = Math.max(8, (phase.durationWeeks / (totalWeeks || 1)) * 100);
          return (
            <div
              key={phase.id}
              title={`${phase.phase} (${phase.durationWeeks} weeks)`}
              style={{ width: `${widthPct}%` }}
              className={`h-full first:rounded-l-full last:rounded-r-full transition-opacity ${
                phase.completed ? "bg-emerald-500 opacity-90" : idx % 2 === 0 ? "bg-indigo-600" : "bg-indigo-400"
              }`}
            />
          );
        })}
      </div>

      {/* Timeline Phase List */}
      <div className="space-y-3">
        {timeline.map((phase, index) => {
          const isExpanded = expandedPhaseId === phase.id;
          return (
            <div
              key={phase.id}
              className={`rounded-xl border transition-all ${
                phase.completed
                  ? "bg-emerald-50/40 dark:bg-emerald-950/10 border-emerald-200 dark:border-emerald-900/40"
                  : "bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800"
              }`}
            >
              {/* Phase Header */}
              <div className="p-3.5 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2.5 flex-1">
                  <button
                    onClick={() => togglePhaseComplete(phase.id)}
                    className="text-slate-400 hover:text-emerald-500 transition-colors"
                  >
                    {phase.completed ? (
                      <CheckSquare className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    ) : (
                      <Square className="w-4 h-4" />
                    )}
                  </button>
                  <span className="font-mono text-[10px] font-bold text-slate-400">P{index + 1}</span>
                  <input
                    type="text"
                    value={phase.phase}
                    onChange={(e) => {
                      const val = e.target.value;
                      onChangeTimeline(
                        timeline.map((p) => (p.id === phase.id ? { ...p, phase: val } : p))
                      );
                    }}
                    className={`font-bold bg-transparent focus:outline-none focus:border-b border-indigo-500 ${
                      phase.completed
                        ? "line-through text-slate-500 dark:text-slate-400"
                        : "text-slate-900 dark:text-slate-100"
                    }`}
                  />
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-900 px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-800">
                    <Clock className="w-3 h-3 text-indigo-500" />
                    <input
                      type="number"
                      min={1}
                      max={52}
                      value={phase.durationWeeks}
                      onChange={(e) => handleDurationChange(phase.id, parseInt(e.target.value) || 1)}
                      className="w-8 text-center font-bold bg-transparent focus:outline-none"
                    />
                    <span>wks</span>
                  </div>

                  <button
                    onClick={() => setExpandedPhaseId(isExpanded ? null : phase.id)}
                    className="p-1 hover:bg-slate-200 dark:hover:bg-slate-800 rounded text-slate-500"
                  >
                    {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>

                  <button
                    onClick={() => handleDeletePhase(phase.id)}
                    className="p-1 hover:text-rose-500 text-slate-400 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Expanded Tasks Body */}
              {isExpanded && (
                <div className="px-3.5 pb-3.5 pt-1 border-t border-slate-200/60 dark:border-slate-800/80 space-y-2 text-xs">
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    Phase Action Items
                  </div>
                  <ul className="space-y-1.5">
                    {phase.tasks.map((task, taskIdx) => {
                      const isDone = task.startsWith("[x] ");
                      const cleanTask = task.replace("[x] ", "");
                      return (
                        <li key={taskIdx} className="flex items-center gap-2 text-xs">
                          <button
                            onClick={() => handleTaskToggle(phase.id, taskIdx)}
                            className="text-slate-400 hover:text-indigo-500"
                          >
                            {isDone ? (
                              <CheckSquare className="w-3.5 h-3.5 text-indigo-600" />
                            ) : (
                              <Square className="w-3.5 h-3.5" />
                            )}
                          </button>
                          <input
                            type="text"
                            value={cleanTask}
                            onChange={(e) => {
                              const val = e.target.value;
                              const updatedTasks = [...phase.tasks];
                              updatedTasks[taskIdx] = isDone ? `[x] ${val}` : val;
                              onChangeTimeline(
                                timeline.map((p) => (p.id === phase.id ? { ...p, tasks: updatedTasks } : p))
                              );
                            }}
                            className={`flex-1 bg-transparent focus:outline-none ${
                              isDone ? "line-through text-slate-400" : "text-slate-800 dark:text-slate-200"
                            }`}
                          />
                        </li>
                      );
                    })}
                  </ul>
                  <button
                    onClick={() => {
                      const updatedTasks = [...phase.tasks, "New task item"];
                      onChangeTimeline(
                        timeline.map((p) => (p.id === phase.id ? { ...p, tasks: updatedTasks } : p))
                      );
                    }}
                    className="text-[11px] font-medium text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 pt-1"
                  >
                    + Add Task
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
