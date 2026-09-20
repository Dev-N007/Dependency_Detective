import React from 'react';
import { RepositoryStats } from '../types';
import { Package, Layers, AlertTriangle, Trash2, Code2, GitCommit } from 'lucide-react';

interface StatsBarProps {
  stats: RepositoryStats;
}

export const StatsBar: React.FC<StatsBarProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 p-4 bg-[#0f141d]/80 border-b border-[#202b3c]">
      <div className="p-3 rounded-lg bg-[#151b26] border border-[#202b3c] flex flex-col justify-between">
        <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
          <span>Dependencies</span>
          <Package className="w-4 h-4 text-cyan-400" />
        </div>
        <div className="mt-2 text-xl font-bold font-mono text-slate-100 flex items-baseline gap-1.5">
          {stats.total_dependencies}
          <span className="text-[10px] text-slate-400 font-normal">total</span>
        </div>
      </div>

      <div className="p-3 rounded-lg bg-[#151b26] border border-[#202b3c] flex flex-col justify-between">
        <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
          <span>Direct / Transitive</span>
          <Layers className="w-4 h-4 text-emerald-400" />
        </div>
        <div className="mt-2 text-xl font-bold font-mono text-slate-100 flex items-baseline gap-1">
          <span className="text-emerald-400">{stats.direct_dependencies}</span>
          <span className="text-slate-400 text-xs">/</span>
          <span className="text-cyan-400">{stats.transitive_dependencies}</span>
        </div>
      </div>

      <div className="p-3 rounded-lg bg-[#151b26] border border-[#202b3c] flex flex-col justify-between">
        <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
          <span>High-Impact</span>
          <AlertTriangle className="w-4 h-4 text-amber-400" />
        </div>
        <div className="mt-2 text-xl font-bold font-mono text-amber-400">
          {stats.high_impact_dependencies}
        </div>
      </div>

      <div className="p-3 rounded-lg bg-[#151b26] border border-[#202b3c] flex flex-col justify-between">
        <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
          <span>Removable</span>
          <Trash2 className="w-4 h-4 text-purple-400" />
        </div>
        <div className="mt-2 text-xl font-bold font-mono text-purple-400">
          {stats.potentially_removable}
        </div>
      </div>

      <div className="p-3 rounded-lg bg-[#151b26] border border-[#202b3c] flex flex-col justify-between">
        <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
          <span>Source Refs</span>
          <Code2 className="w-4 h-4 text-cyan-400" />
        </div>
        <div className="mt-2 text-xl font-bold font-mono text-cyan-300">
          {stats.total_source_references}
        </div>
      </div>

      <div className="p-3 rounded-lg bg-[#151b26] border border-[#202b3c] flex flex-col justify-between">
        <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
          <span>Git Commits</span>
          <GitCommit className="w-4 h-4 text-emerald-400" />
        </div>
        <div className="mt-2 text-xl font-bold font-mono text-emerald-300">
          {stats.total_relevant_commits}
        </div>
      </div>
    </div>
  );
};
