import React from 'react';
import { RepositoryStats } from '../types';
import { Package, Layers, AlertTriangle, Trash2, Code2, GitCommit } from 'lucide-react';

interface StatsBarProps {
  stats: RepositoryStats;
}

export const StatsBar: React.FC<StatsBarProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 p-4 bg-slate-100/70 dark:bg-[#0f141d]/80 border-b border-slate-200 dark:border-[#202b3c] transition-colors">
      <div className="p-3 rounded-xl bg-white dark:bg-[#151b26] border border-slate-200 dark:border-[#202b3c] flex flex-col justify-between shadow-xs">
        <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-mono">
          <span>Dependencies</span>
          <Package className="w-4 h-4 text-sky-600 dark:text-cyan-400" />
        </div>
        <div className="mt-2 text-xl font-bold font-mono text-slate-900 dark:text-slate-100 flex items-baseline gap-1.5">
          {stats.total_dependencies}
          <span className="text-[10px] text-slate-400 font-normal font-mono">total</span>
        </div>
      </div>

      <div className="p-3 rounded-xl bg-white dark:bg-[#151b26] border border-slate-200 dark:border-[#202b3c] flex flex-col justify-between shadow-xs">
        <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-mono">
          <span>Direct / Transitive</span>
          <Layers className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
        </div>
        <div className="mt-2 text-xl font-bold font-mono text-slate-900 dark:text-slate-100 flex items-baseline gap-1">
          <span className="text-emerald-600 dark:text-emerald-400">{stats.direct_dependencies}</span>
          <span className="text-slate-300 dark:text-slate-600 text-xs">/</span>
          <span className="text-sky-600 dark:text-cyan-400">{stats.transitive_dependencies}</span>
        </div>
      </div>

      <div className="p-3 rounded-xl bg-white dark:bg-[#151b26] border border-slate-200 dark:border-[#202b3c] flex flex-col justify-between shadow-xs">
        <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-mono">
          <span>High-Impact</span>
          <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-amber-400" />
        </div>
        <div className="mt-2 text-xl font-bold font-mono text-rose-600 dark:text-amber-400">
          {stats.high_impact_dependencies}
        </div>
      </div>

      <div className="p-3 rounded-xl bg-white dark:bg-[#151b26] border border-slate-200 dark:border-[#202b3c] flex flex-col justify-between shadow-xs">
        <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-mono">
          <span>Removable</span>
          <Trash2 className="w-4 h-4 text-amber-600 dark:text-purple-400" />
        </div>
        <div className="mt-2 text-xl font-bold font-mono text-amber-600 dark:text-purple-400">
          {stats.potentially_removable}
        </div>
      </div>

      <div className="p-3 rounded-xl bg-white dark:bg-[#151b26] border border-slate-200 dark:border-[#202b3c] flex flex-col justify-between shadow-xs">
        <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-mono">
          <span>Source Refs</span>
          <Code2 className="w-4 h-4 text-sky-600 dark:text-cyan-400" />
        </div>
        <div className="mt-2 text-xl font-bold font-mono text-sky-600 dark:text-cyan-300">
          {stats.total_source_references}
        </div>
      </div>

      <div className="p-3 rounded-xl bg-white dark:bg-[#151b26] border border-slate-200 dark:border-[#202b3c] flex flex-col justify-between shadow-xs">
        <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-mono">
          <span>Git Commits</span>
          <GitCommit className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
        </div>
        <div className="mt-2 text-xl font-bold font-mono text-emerald-600 dark:text-emerald-300">
          {stats.total_relevant_commits}
        </div>
      </div>
    </div>
  );
};
