import React from "react";
import { RareDiscoveryAnalytics as RareDiscoveryAnalyticsType } from "../types/thesis";
import {
  BarChart3,
  TrendingUp,
  Sparkles,
  PieChart,
  Compass,
  Award,
  Zap,
  BookmarkCheck
} from "lucide-react";

interface RareDiscoveryAnalyticsProps {
  analytics: RareDiscoveryAnalyticsType;
  totalSavedIdeasCount: number;
}

export const RareDiscoveryAnalyticsComponent: React.FC<RareDiscoveryAnalyticsProps> = ({
  analytics,
  totalSavedIdeasCount,
}) => {
  return (
    <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
        <div>
          <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-indigo-500" /> Platform Rare Discovery Analytics
          </h3>
          <p className="text-xs text-slate-500">
            Real-time analytics on novelty distributions, interdisciplinary ratios, and research trends.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
        {/* Metric 1 */}
        <div className="p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/50 space-y-1">
          <span className="text-[10px] font-bold uppercase text-slate-400">Average Novelty Score</span>
          <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400">
            {analytics.averageNoveltyScore}%
          </p>
          <span className="text-[10px] text-emerald-600 font-bold">🔴 High Novelty Standard</span>
        </div>

        {/* Metric 2 */}
        <div className="p-4 rounded-2xl bg-purple-50/50 dark:bg-purple-950/40 border border-purple-100 dark:border-purple-900/50 space-y-1">
          <span className="text-[10px] font-bold uppercase text-slate-400">Interdisciplinary Ratio</span>
          <p className="text-2xl font-black text-purple-600 dark:text-purple-400">
            {analytics.interdisciplinaryRatio}%
          </p>
          <span className="text-[10px] text-purple-600 font-bold">Cross-Domain Focus</span>
        </div>

        {/* Metric 3 */}
        <div className="p-4 rounded-2xl bg-amber-50/50 dark:bg-amber-950/40 border border-amber-100 dark:border-amber-900/50 space-y-1">
          <span className="text-[10px] font-bold uppercase text-slate-400">Saved Rare Ideas</span>
          <p className="text-2xl font-black text-amber-600 dark:text-amber-400">
            {totalSavedIdeasCount}
          </p>
          <span className="text-[10px] text-amber-600 font-bold">In Local Library</span>
        </div>

        {/* Metric 4 */}
        <div className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/50 space-y-1">
          <span className="text-[10px] font-bold uppercase text-slate-400">Duplicate Prevention</span>
          <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
            100%
          </p>
          <span className="text-[10px] text-emerald-600 font-bold">Session Hash Shield</span>
        </div>
      </div>

      {/* Popular Generated Disciplines Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
            Most Generated Disciplines:
          </span>
          <div className="space-y-2">
            {analytics.mostGeneratedSubjects.map((sub, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-800 dark:text-slate-200">{sub.subject}</span>
                  <span className="text-indigo-600 dark:text-indigo-400 font-bold">{sub.count} topics</span>
                </div>
                <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-500 rounded-full"
                    style={{ width: `${Math.min(100, (sub.count / 20) * 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
            Top Saved Research Frontiers:
          </span>
          <div className="space-y-2">
            {analytics.mostSavedTopics.map((top, idx) => (
              <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs">
                <span className="font-semibold text-slate-800 dark:text-slate-200">{top.topic}</span>
                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400 font-bold text-[10px]">
                  {top.count} saves
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
