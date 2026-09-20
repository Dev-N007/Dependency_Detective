import React, { useState } from 'react';
import { DependencyNode, DependencyGraph as GraphType } from '../types';
import { Search, Filter, ShieldAlert, Zap, History, ChevronRight, FileCode } from 'lucide-react';

interface DependencyGraphProps {
  graph: GraphType;
  selectedNode: DependencyNode | null;
  onSelectNode: (node: DependencyNode) => void;
  onTriggerWhatIf: (node: DependencyNode) => void;
  onTriggerArchaeology: (node: DependencyNode) => void;
}

export const DependencyGraphView: React.FC<DependencyGraphProps> = ({
  graph,
  selectedNode,
  onSelectNode,
  onTriggerWhatIf,
  onTriggerArchaeology,
}) => {
  const [filterType, setFilterType] = useState<'all' | 'direct' | 'transitive'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredNodes = graph.nodes.filter((node) => {
    const matchesType =
      filterType === 'all'
        ? true
        : filterType === 'direct'
        ? node.dep_type === 'direct'
        : node.dep_type === 'transitive';
    const matchesSearch = node.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesSearch;
  });

  return (
    <div className="flex-1 flex flex-col lg:flex-row h-full overflow-hidden bg-slate-50 dark:bg-[#080a0f] transition-colors">
      {/* Node Grid View - Centerpiece Canvas */}
      <div className="flex-1 flex flex-col border-r border-slate-200 dark:border-[#202b3c] p-6 overflow-y-auto cyber-grid">
        {/* Graph Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-200 dark:border-[#202b3c]">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-sky-600 dark:text-cyan-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search package (e.g. axios, lodash, requests)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white dark:bg-[#0f141d] border border-slate-200 dark:border-[#202b3c] rounded-xl pl-9 pr-4 py-2 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-sky-500 dark:focus:border-cyan-500 font-mono shadow-xs"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">Filter:</span>
            <div className="flex bg-white dark:bg-[#0f141d] p-1 rounded-xl border border-slate-200 dark:border-[#202b3c] text-xs font-mono shadow-xs">
              <button
                onClick={() => setFilterType('all')}
                className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                  filterType === 'all'
                    ? 'bg-sky-50 dark:bg-cyan-950 text-sky-700 dark:text-cyan-400 font-bold border border-sky-200 dark:border-cyan-500/30'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                All ({graph.nodes.length})
              </button>
              <button
                onClick={() => setFilterType('direct')}
                className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                  filterType === 'direct'
                    ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 font-bold border border-emerald-200 dark:border-emerald-500/30'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                Direct
              </button>
              <button
                onClick={() => setFilterType('transitive')}
                className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                  filterType === 'transitive'
                    ? 'bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-400 font-bold border border-purple-200 dark:border-purple-500/30'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                Transitive
              </button>
            </div>
          </div>
        </div>

        {/* Package Grid Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredNodes.map((node) => {
            const isSelected = selectedNode?.id === node.id;
            return (
              <div
                key={node.id}
                onClick={() => onSelectNode(node)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden group ${
                  isSelected
                    ? 'bg-white dark:bg-[#151b26] border-sky-500 dark:border-cyan-500 shadow-md glow-cyan ring-1 ring-sky-500/30'
                    : 'bg-white dark:bg-[#0f141d]/90 border-slate-200 dark:border-[#202b3c] hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50/80 dark:hover:bg-[#151b26]/70 shadow-xs'
                }`}
              >
                {node.risk_level === 'HIGH' && (
                  <div className="absolute top-0 right-0 w-12 h-12 overflow-hidden pointer-events-none">
                    <div className="bg-rose-500 text-[9px] font-bold text-white py-0.5 text-center uppercase rotate-45 translate-x-3 translate-y-1 font-mono">
                      HIGH
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold font-mono text-slate-900 dark:text-slate-100 group-hover:text-sky-600 dark:group-hover:text-cyan-400 transition-colors">
                      {node.name}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">v{node.version}</span>
                  </div>
                  <span
                    className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded-full border ${
                      node.dep_type === 'direct'
                        ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-400 font-semibold'
                        : 'bg-purple-50 dark:bg-purple-950/60 border-purple-200 dark:border-purple-500/30 text-purple-700 dark:text-purple-400 font-semibold'
                    }`}
                  >
                    {node.dep_type}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-slate-100 dark:border-[#202b3c]/60 text-xs font-mono">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Usages</span>
                    <span className="font-bold text-sky-600 dark:text-cyan-300">{node.usages_count}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Direct Dep.</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-300">{node.direct_dependents_count}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Transitive</span>
                    <span className="font-bold text-purple-600 dark:text-purple-300">{node.transitive_dependents_count}</span>
                  </div>
                </div>

                {node.is_removable && (
                  <div className="mt-3 pt-2 text-[11px] text-amber-600 dark:text-amber-400 font-mono flex items-center gap-1.5 font-medium">
                    <ShieldAlert className="w-3.5 h-3.5" />
                    <span>Potentially removable (low usage)</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Forensic Node Detail Inspector Panel */}
      {selectedNode ? (
        <div className="w-full lg:w-96 bg-white dark:bg-[#0f141d] p-6 border-l border-slate-200 dark:border-[#202b3c] flex flex-col justify-between overflow-y-auto transition-colors shadow-xs">
          <div>
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-200 dark:border-[#202b3c]">
              <div>
                <span className="text-xs font-mono text-sky-600 dark:text-cyan-400 uppercase tracking-widest block font-bold">
                  Forensic Inspector
                </span>
                <h3 className="text-xl font-extrabold font-mono text-slate-900 dark:text-slate-100">{selectedNode.name}</h3>
              </div>
              <span className="text-xs font-mono px-2.5 py-1 rounded-md bg-slate-100 dark:bg-[#151b26] border border-slate-200 dark:border-[#202b3c] text-slate-700 dark:text-slate-300 font-semibold">
                v{selectedNode.version}
              </span>
            </div>

            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#151b26] border border-slate-200 dark:border-[#202b3c]">
                <span className="text-xs font-mono text-slate-400 block mb-1">Ecosystem & Scope</span>
                <div className="flex items-center gap-2 text-xs font-mono">
                  <span className="uppercase px-2 py-0.5 rounded bg-sky-50 dark:bg-cyan-950 text-sky-700 dark:text-cyan-400 border border-sky-200 dark:border-cyan-500/30 font-bold">
                    {selectedNode.ecosystem}
                  </span>
                  <span className="uppercase px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 font-bold">
                    {selectedNode.dep_type}
                  </span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#151b26] border border-slate-200 dark:border-[#202b3c]">
                <span className="text-xs font-mono text-slate-400 block mb-2 font-bold uppercase tracking-wider">Codebase Impact Profile</span>
                <div className="space-y-2 text-xs font-mono">
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Direct File References:</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">{selectedNode.direct_dependents_count}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Transitive File Reach:</span>
                    <span className="text-purple-600 dark:text-purple-400 font-bold">{selectedNode.transitive_dependents_count}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-slate-400">AST Code Usages:</span>
                    <span className="text-sky-600 dark:text-cyan-400 font-bold">{selectedNode.usages_count}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Risk Assessment:</span>
                    <span
                      className={`font-bold ${
                        selectedNode.risk_level === 'HIGH'
                          ? 'text-rose-600 dark:text-amber-400'
                          : selectedNode.risk_level === 'MEDIUM'
                          ? 'text-amber-600 dark:text-cyan-400'
                          : 'text-emerald-600 dark:text-emerald-400'
                      }`}
                    >
                      {selectedNode.risk_level}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Hero Action Triggers */}
          <div className="mt-6 pt-4 border-t border-slate-200 dark:border-[#202b3c] space-y-3">
            <button
              onClick={() => onTriggerWhatIf(selectedNode)}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-sky-600 via-sky-500 to-cyan-500 dark:from-cyan-600 dark:to-cyan-500 hover:from-sky-500 hover:to-cyan-400 text-white dark:text-slate-950 font-bold font-mono text-sm flex items-center justify-center gap-2 shadow-md shadow-sky-500/15 dark:shadow-cyan-950/50 transition-all group cursor-pointer"
            >
              <Zap className="w-4 h-4 fill-white dark:fill-slate-950" />
              <span>WHAT IF I CHANGE THIS?</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => onTriggerArchaeology(selectedNode)}
              className="w-full py-3 px-4 rounded-xl bg-slate-100 dark:bg-[#151b26] hover:bg-slate-200 dark:hover:bg-[#1a2332] border border-slate-200 dark:border-[#202b3c] text-slate-800 dark:text-slate-200 font-bold font-mono text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
            >
              <History className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <span>WHY IS THIS HERE?</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="w-full lg:w-96 bg-white dark:bg-[#0f141d] p-6 border-l border-slate-200 dark:border-[#202b3c] flex items-center justify-center text-center transition-colors">
          <div className="space-y-2 max-w-xs">
            <FileCode className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto" />
            <h4 className="text-sm font-bold font-mono text-slate-800 dark:text-slate-300">Select a Dependency Node</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
              Click any package card in the graph grid to inspect codebase reach, run Change Impact simulation, or execute Git Archaeology.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
