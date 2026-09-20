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
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="w-full max-w-xl bg-[#0f141d] border-l border-[#202b3c] h-full flex flex-col justify-between shadow-2xl overflow-y-auto">
        <div>
          {/* Drawer Header */}
          <div className="p-6 border-b border-[#202b3c] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-cyan-950 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <FileCode className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase text-cyan-400 block tracking-widest">
                  Codebase Evidence Viewer
                </span>
                <h3 className="text-base font-bold font-mono text-slate-100">{evidence.file_path}</h3>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-[#151b26] border border-[#202b3c] text-slate-400 hover:text-slate-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Evidence Details */}
          <div className="p-6 space-y-6">
            <div className="flex items-center gap-3 text-xs font-mono">
              <span className="px-2.5 py-1 rounded bg-cyan-950 border border-cyan-500/30 text-cyan-400 font-bold flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5" /> Line {evidence.line_number}
              </span>
              <span className="px-2.5 py-1 rounded bg-[#151b26] border border-[#202b3c] text-slate-300">
                Type: {evidence.evidence_type}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-[#151b26] border border-[#202b3c]">
              <span className="text-xs font-mono text-slate-400 block mb-1">Description</span>
              <p className="text-xs font-mono text-slate-200">{evidence.description}</p>
            </div>

            {/* Code Snippet Box */}
            <div className="space-y-2">
              <span className="text-xs font-mono text-slate-400 block">Source Code Snippet Context</span>
              <div className="p-4 rounded-xl bg-[#080a0f] border border-[#202b3c] overflow-x-auto text-xs font-mono text-cyan-300 leading-relaxed">
                <pre>{evidence.snippet_context || `${evidence.line_number} | ${evidence.line_content}`}</pre>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-[#202b3c] bg-[#080a0f] text-xs font-mono text-slate-400">
          ✓ Verified by Deterministic AST Code Parser & AWS OpenSearch evidence layer.
        </div>
      </div>
    </div>
  );
};
