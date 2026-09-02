import React from "react";
import { ProposalFeasibility } from "../../types/thesis";
import { Gauge, Clock, Database, Layers, GraduationCap, CheckCircle } from "lucide-react";

interface ProposalFeasibilityCardProps {
  feasibility: ProposalFeasibility;
}

export const ProposalFeasibilityCard: React.FC<ProposalFeasibilityCardProps> = ({ feasibility }) => {
  const { difficulty, estimatedTimeMonths, dataAvailability, researchComplexity, recommendedDegree } = feasibility;

  const getDifficultyBadge = (diff: string) => {
    switch (diff) {
      case "Beginner Friendly":
        return "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800";
      case "Moderate":
        return "bg-blue-100 text-blue-800 dark:bg-blue-950/80 dark:text-blue-300 border-blue-300 dark:border-blue-800";
      case "High Challenge":
        return "bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border-amber-300 dark:border-amber-800";
      case "Very High / Frontier":
        return "bg-purple-100 text-purple-800 dark:bg-purple-950/80 dark:text-purple-300 border-purple-300 dark:border-purple-800";
      default:
        return "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300";
    }
  };

  return (
    <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Gauge className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <h3 className="font-bold text-slate-900 dark:text-white text-sm">Feasibility & Resource Analysis</h3>
        </div>
        <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${getDifficultyBadge(difficulty)}`}>
          {difficulty}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 text-xs">
        {/* Estimated Time */}
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800/80 space-y-1">
          <div className="flex items-center gap-1.5 text-slate-500 font-medium">
            <Clock className="w-3.5 h-3.5 text-indigo-500" />
            Estimated Duration
          </div>
          <div className="font-bold text-slate-900 dark:text-white text-sm">
            {estimatedTimeMonths} Months
          </div>
          <p className="text-[10px] text-slate-400">Typical execution window</p>
        </div>

        {/* Data Availability */}
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800/80 space-y-1">
          <div className="flex items-center gap-1.5 text-slate-500 font-medium">
            <Database className="w-3.5 h-3.5 text-emerald-500" />
            Data Availability
          </div>
          <div className="font-bold text-slate-900 dark:text-white text-sm">
            {dataAvailability}
          </div>
          <p className="text-[10px] text-slate-400">Primary/secondary access</p>
        </div>

        {/* Complexity */}
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800/80 space-y-1">
          <div className="flex items-center gap-1.5 text-slate-500 font-medium">
            <Layers className="w-3.5 h-3.5 text-amber-500" />
            Method Complexity
          </div>
          <div className="font-bold text-slate-900 dark:text-white text-sm">
            {researchComplexity}
          </div>
          <p className="text-[10px] text-slate-400">Technical & mathematical</p>
        </div>

        {/* Recommended Degree */}
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800/80 space-y-1">
          <div className="flex items-center gap-1.5 text-slate-500 font-medium">
            <GraduationCap className="w-3.5 h-3.5 text-purple-500" />
            Target Level
          </div>
          <div className="font-bold text-slate-900 dark:text-white text-sm">
            {recommendedDegree}
          </div>
          <p className="text-[10px] text-slate-400">Optimal academic level</p>
        </div>
      </div>
    </div>
  );
};
