import React, { useEffect, useState } from 'react';
import { DependencyNode } from '../types';
import { Search, Zap, History, RefreshCw, X, ArrowRight } from 'lucide-react';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  nodes: DependencyNode[];
  onSelectNode: (node: DependencyNode) => void;
  onTriggerWhatIf: (node: DependencyNode) => void;
  onTriggerArchaeology: (node: DependencyNode) => void;
  onLoadDemoRepo: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  nodes,
  onSelectNode,
  onTriggerWhatIf,
  onTriggerArchaeology,
  onLoadDemoRepo,
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        isOpen ? onClose() : void 0;
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filtered = nodes.filter((n) => n.name.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 bg-black/70 backdrop-blur-xs animate-in fade-in p-4">
      <div className="w-full max-w-2xl bg-[#0f141d] border border-[#202b3c] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-[#202b3c] flex items-center gap-3 bg-[#151b26]">
          <Search className="w-5 h-5 text-cyan-400" />
          <input
            type="text"
            placeholder="Type command or package name (e.g. axios, lodash, demo)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="flex-1 bg-transparent text-sm font-mono text-slate-100 placeholder-slate-400 focus:outline-none"
          />
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-200">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="p-3 overflow-y-auto space-y-2 flex-1">
          {/* Quick Action: Reset Demo */}
          <div
            onClick={() => {
              onLoadDemoRepo();
              onClose();
            }}
            className="p-3 rounded-xl bg-[#151b26] hover:bg-cyan-950/40 border border-[#202b3c] hover:border-cyan-500/40 flex items-center justify-between cursor-pointer transition-colors group"
          >
            <div className="flex items-center gap-3">
              <RefreshCw className="w-4 h-4 text-amber-400 group-hover:rotate-180 transition-transform" />
              <div>
                <span className="text-xs font-bold font-mono text-slate-100 block">Load Synthetic Demo Repository</span>
                <span className="text-[11px] font-mono text-slate-400">Instantly inspect PayStream Core bundled repo</span>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400" />
          </div>

          <div className="px-2 py-1 text-[10px] font-mono uppercase text-slate-400 tracking-wider">
            Package Search Results ({filtered.length})
          </div>

          {filtered.map((node) => (
            <div
              key={node.id}
              className="p-3 rounded-xl bg-[#080a0f] hover:bg-[#151b26] border border-[#202b3c] flex items-center justify-between gap-4 group transition-colors"
            >
              <div
                onClick={() => {
                  onSelectNode(node);
                  onClose();
                }}
                className="flex-1 cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold font-mono text-slate-100 group-hover:text-cyan-400 transition-colors">
                    {node.name}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">v{node.version}</span>
                </div>
                <span className="text-[10px] font-mono text-slate-400 block">{node.usages_count} code references</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    onTriggerWhatIf(node);
                    onClose();
                  }}
                  className="px-2.5 py-1 rounded bg-cyan-950 hover:bg-cyan-900 border border-cyan-500/30 text-cyan-300 text-[11px] font-mono flex items-center gap-1 transition-colors"
                >
                  <Zap className="w-3 h-3 text-cyan-400" /> What-If
                </button>
                <button
                  onClick={() => {
                    onTriggerArchaeology(node);
                    onClose();
                  }}
                  className="px-2.5 py-1 rounded bg-purple-950 hover:bg-purple-900 border border-purple-500/30 text-purple-300 text-[11px] font-mono flex items-center gap-1 transition-colors"
                >
                  <History className="w-3 h-3 text-purple-400" /> Why?
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
