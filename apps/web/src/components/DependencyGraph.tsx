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
    <div className="flex-1 flex flex-col lg:flex-row h-full overflow-hidden bg-[#080a0f]">
      {/* Node Grid View */}
      <div className="flex-1 flex flex-col border-r border-[#202b3c] p-6 overflow-y-auto cyber-grid">
        {/* Graph Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-[#202b3c]">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-cyan-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search package (e.g. axios, lodash, requests)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#0f141d] border border-[#202b3c] rounded-lg pl-9 pr-4 py-2 text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:border-cyan-500 font-mono"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-xs text-slate-400 font-mono">Filter:</span>
            <div className="flex bg-[#0f141d] p-1 rounded-lg border border-[#202b3c] text-xs font-mono">
              <button
                onClick={() => setFilterType('all')}
                className={`px-3 py-1 rounded-md transition-colors ${
                  filterType === 'all' ? 'bg-cyan-950 text-cyan-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                All ({graph.nodes.length})
              </button>
              <button
                onClick={() => setFilterType('direct')}
                className={`px-3 py-1 rounded-md transition-colors ${
                  filterType === 'direct' ? 'bg-emerald-950 text-emerald-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Direct
              </button>
              <button
                onClick={() => setFilterType('transitive')}
                className={`px-3 py-1 rounded-md transition-colors ${
                  filterType === 'transitive' ? 'bg-purple-950 text-purple-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
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
                className={`p-4 rounded-xl border transition-all cursor-pointer relative overflow-hidden group ${
                  isSelected
                    ? 'bg-[#151b26] border-cyan-500 shadow-lg shadow-cyan-950/40 glow-cyan'
                    : 'bg-[#0f141d]/90 border-[#202b3c] hover:border-slate-600 hover:bg-[#151b26]/70'
                }`}
              >
                {node.risk_level === 'HIGH' && (
                  <div className="absolute top-0 right-0 w-12 h-12 overflow-hidden pointer-events-none">
                    <div className="bg-amber-500 text-[9px] font-bold text-slate-950 py-0.5 text-center uppercase rotate-45 translate-x-3 translate-y-1">
                      HIGH
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold font-mono text-slate-100 group-hover:text-cyan-400 transition-colors">
                      {node.name}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">v{node.version}</span>
                  </div>
                  <span
                    className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded border ${
                      node.dep_type === 'direct'
                        ? 'bg-emerald-950/60 border-emerald-500/30 text-emerald-400'
                        : 'bg-purple-950/60 border-purple-500/30 text-purple-400'
                    }`}
                  >
                    {node.dep_type}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-[#202b3c]/60 text-xs font-mono">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Usages</span>
                    <span className="font-semibold text-cyan-300">{node.usages_count}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Direct Dep.</span>
                    <span className="font-semibold text-emerald-300">{node.direct_dependents_count}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Transitive</span>
                    <span className="font-semibold text-purple-300">{node.transitive_dependents_count}</span>
                  </div>
                </div>

                {node.is_removable && (
                  <div className="mt-3 pt-2 text-[11px] text-amber-400 font-mono flex items-center gap-1.5">
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
        <div className="w-full lg:w-96 bg-[#0f141d] p-6 border-l border-[#202b3c] flex flex-col justify-between overflow-y-auto">
          <div>
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-[#202b3c]">
              <div>
                <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest block">
                  Forensic Inspector
                </span>
                <h3 className="text-xl font-bold font-mono text-slate-100">{selectedNode.name}</h3>
              </div>
              <span className="text-xs font-mono px-2.5 py-1 rounded bg-[#151b26] border border-[#202b3c] text-slate-300">
                v{selectedNode.version}
              </span>
            </div>

            <div className="space-y-4">
              <div className="p-3 rounded-lg bg-[#151b26] border border-[#202b3c]">
                <span className="text-xs font-mono text-slate-400 block mb-1">Ecosystem & Scope</span>
                <div className="flex items-center gap-2 text-xs font-mono">
                  <span className="uppercase px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-500/30">
                    {selectedNode.ecosystem}
                  </span>
                  <span className="uppercase px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                    {selectedNode.dep_type}
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-[#151b26] border border-[#202b3c]">
                <span className="text-xs font-mono text-slate-400 block mb-2">Codebase Impact Profile</span>
                <div className="space-y-2 text-xs font-mono">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Direct File References:</span>
                    <span className="text-emerald-400 font-bold">{selectedNode.direct_dependents_count}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Transitive File Reach:</span>
                    <span className="text-purple-400 font-bold">{selectedNode.transitive_dependents_count}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">AST Code Usages:</span>
                    <span className="text-cyan-400 font-bold">{selectedNode.usages_count}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Risk Assessment:</span>
                    <span
                      className={`font-bold ${
                        selectedNode.risk_level === 'HIGH'
                          ? 'text-amber-400'
                          : selectedNode.risk_level === 'MEDIUM'
                          ? 'text-cyan-400'
                          : 'text-emerald-400'
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
          <div className="mt-6 pt-4 border-t border-[#202b3c] space-y-3">
            <button
              onClick={() => onTriggerWhatIf(selectedNode)}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-slate-950 font-bold font-mono text-sm flex items-center justify-center gap-2 shadow-lg shadow-cyan-950/50 transition-all group"
            >
              <Zap className="w-4 h-4 fill-slate-950" />
              <span>WHAT IF I CHANGE THIS?</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => onTriggerArchaeology(selectedNode)}
              className="w-full py-3 px-4 rounded-xl bg-[#151b26] hover:bg-[#1a2332] border border-[#202b3c] hover:border-slate-500 text-slate-200 font-bold font-mono text-sm flex items-center justify-center gap-2 transition-all"
            >
              <History className="w-4 h-4 text-purple-400" />
              <span>WHY IS THIS HERE?</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="w-full lg:w-96 bg-[#0f141d] p-6 border-l border-[#202b3c] flex items-center justify-center text-center">
          <div className="space-y-2 max-w-xs">
            <FileCode className="w-10 h-10 text-slate-400 mx-auto opacity-40" />
            <h4 className="text-sm font-bold font-mono text-slate-300">Select a Dependency Node</h4>
            <p className="text-xs text-slate-400 font-mono">
              Click any package card in the graph grid to inspect codebase reach, run Change Impact simulation, or execute Git Archaeology.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
