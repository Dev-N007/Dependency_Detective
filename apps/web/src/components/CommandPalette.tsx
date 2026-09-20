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
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 bg-slate-900/40 dark:bg-black/70 backdrop-blur-sm animate-in fade-in p-4">
      <div className="w-full max-w-2xl bg-white dark:bg-[#0f141d] border border-slate-200 dark:border-[#202b3c] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh] transition-colors">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-slate-200 dark:border-[#202b3c] flex items-center gap-3 bg-slate-50 dark:bg-[#151b26]">
          <Search className="w-5 h-5 text-sky-600 dark:text-cyan-400" />
          <input
            type="text"
            placeholder="Type command or package name (e.g. axios, lodash, demo)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="flex-1 bg-transparent text-sm font-mono text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none"
          />
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer">
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
            className="p-3 rounded-xl bg-slate-50 dark:bg-[#151b26] hover:bg-sky-50 dark:hover:bg-cyan-950/40 border border-slate-200 dark:border-[#202b3c] hover:border-sky-300 dark:hover:border-cyan-500/40 flex items-center justify-between cursor-pointer transition-colors group shadow-xs"
          >
            <div className="flex items-center gap-3">
              <RefreshCw className="w-4 h-4 text-amber-600 dark:text-amber-400 group-hover:rotate-180 transition-transform" />
              <div>
                <span className="text-xs font-bold font-mono text-slate-900 dark:text-slate-100 block">Load Synthetic Demo Repository</span>
                <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">Instantly inspect PayStream Core bundled repo</span>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-sky-600 dark:group-hover:text-cyan-400" />
          </div>

          <div className="px-2 py-1 text-[10px] font-mono uppercase text-slate-500 dark:text-slate-400 tracking-wider font-bold">
            Package Search Results ({filtered.length})
          </div>

          {filtered.map((node) => (
            <div
              key={node.id}
              className="p-3 rounded-xl bg-white dark:bg-[#080a0f] hover:bg-slate-50 dark:hover:bg-[#151b26] border border-slate-200 dark:border-[#202b3c] flex items-center justify-between gap-4 group transition-colors shadow-xs"
            >
              <div
                onClick={() => {
                  onSelectNode(node);
                  onClose();
                }}
                className="flex-1 cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold font-mono text-slate-900 dark:text-slate-100 group-hover:text-sky-600 dark:group-hover:text-cyan-400 transition-colors">
                    {node.name}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">v{node.version}</span>
                </div>
                <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 block">{node.usages_count} code references</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    onTriggerWhatIf(node);
                    onClose();
                  }}
                  className="px-2.5 py-1 rounded-md bg-sky-50 dark:bg-cyan-950 hover:bg-sky-100 dark:hover:bg-cyan-900 border border-sky-200 dark:border-cyan-500/30 text-sky-700 dark:text-cyan-300 text-[11px] font-mono flex items-center gap-1 transition-colors cursor-pointer font-semibold"
                >
                  <Zap className="w-3 h-3 text-sky-600 dark:text-cyan-400" /> What-If
                </button>
                <button
                  onClick={() => {
                    onTriggerArchaeology(node);
                    onClose();
                  }}
                  className="px-2.5 py-1 rounded-md bg-purple-50 dark:bg-purple-950 hover:bg-purple-100 dark:hover:bg-purple-900 border border-purple-200 dark:border-purple-500/30 text-purple-700 dark:text-purple-300 text-[11px] font-mono flex items-center gap-1 transition-colors cursor-pointer font-semibold"
                >
                  <History className="w-3 h-3 text-purple-600 dark:text-purple-400" /> Why?
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
