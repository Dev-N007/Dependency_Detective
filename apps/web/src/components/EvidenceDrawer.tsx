import React from 'react';
import { EvidenceItem } from '../types';
import { X, FileCode, Tag } from 'lucide-react';

interface EvidenceDrawerProps {
  evidence: EvidenceItem | null;
  onClose: () => void;
}

export const EvidenceDrawer: React.FC<EvidenceDrawerProps> = ({ evidence, onClose }) => {
  if (!evidence) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 dark:bg-black/70 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-xl bg-white dark:bg-[#0f141d] border-l border-slate-200 dark:border-[#202b3c] h-full flex flex-col justify-between shadow-2xl overflow-y-auto transition-colors">
        <div>
          {/* Drawer Header */}
          <div className="p-6 border-b border-slate-200 dark:border-[#202b3c] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-sky-50 dark:bg-cyan-950 border border-sky-200 dark:border-cyan-500/30 flex items-center justify-center text-sky-600 dark:text-cyan-400 shadow-xs">
                <FileCode className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase text-sky-700 dark:text-cyan-400 block tracking-widest font-bold">
                  Codebase Evidence Viewer
                </span>
                <h3 className="text-base font-bold font-mono text-slate-900 dark:text-slate-100">{evidence.file_path}</h3>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-100 dark:bg-[#151b26] border border-slate-200 dark:border-[#202b3c] text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Evidence Details */}
          <div className="p-6 space-y-6">
            <div className="flex items-center gap-3 text-xs font-mono">
              <span className="px-2.5 py-1 rounded-full bg-sky-50 dark:bg-cyan-950 border border-sky-200 dark:border-cyan-500/30 text-sky-700 dark:text-cyan-400 font-bold flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5" /> Line {evidence.line_number}
              </span>
              <span className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-[#151b26] border border-slate-200 dark:border-[#202b3c] text-slate-700 dark:text-slate-300 font-semibold">
                Type: {evidence.evidence_type}
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#151b26] border border-slate-200 dark:border-[#202b3c]">
              <span className="text-xs font-mono text-slate-500 dark:text-slate-400 block mb-1 font-semibold uppercase tracking-wider">Description</span>
              <p className="text-xs font-mono text-slate-800 dark:text-slate-200">{evidence.description}</p>
            </div>

            {/* Code Snippet Box */}
            <div className="space-y-2">
              <span className="text-xs font-mono text-slate-500 dark:text-slate-400 block font-bold uppercase tracking-wider">Source Code Snippet Context</span>
              <div className="p-4 rounded-xl bg-slate-900 dark:bg-[#080a0f] border border-slate-700 dark:border-[#202b3c] overflow-x-auto text-xs font-mono text-sky-300 dark:text-cyan-300 leading-relaxed shadow-inner">
                <pre>{evidence.snippet_context || `${evidence.line_number} | ${evidence.line_content}`}</pre>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-200 dark:border-[#202b3c] bg-slate-50 dark:bg-[#080a0f] text-xs font-mono text-slate-500 dark:text-slate-400">
          ✓ Verified by Deterministic AST Code Parser & AWS OpenSearch evidence layer.
        </div>
      </div>
    </div>
  );
};
