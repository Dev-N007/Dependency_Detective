import React, { useState } from 'react';
import { ImpactReport, EvidenceItem } from '../types';
import { Zap, AlertTriangle, CheckCircle2, FileCode, TestTube, Cpu, ArrowRight, Eye, RefreshCw } from 'lucide-react';

interface WhatIfViewProps {
  report: ImpactReport;
  onOpenEvidence: (evidence: EvidenceItem) => void;
  onBackToGraph: () => void;
}

export const WhatIfView: React.FC<WhatIfViewProps> = ({
  report,
  onOpenEvidence,
  onBackToGraph,
}) => {
  const [targetVerInput, setTargetVerInput] = useState(report.target_version || '1.8.4');

  return (
    <div className="flex-1 bg-slate-50 dark:bg-[#080a0f] overflow-y-auto p-6 space-y-6 transition-colors">
      {/* Header Banner */}
      <div className="cyber-panel p-6 rounded-2xl relative overflow-hidden bg-white dark:bg-[#0f141d]/90 border border-slate-200 dark:border-[#202b3c] shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-mono px-2.5 py-0.5 rounded bg-sky-100 dark:bg-cyan-950 text-sky-700 dark:text-cyan-400 border border-sky-300 dark:border-cyan-500/30 uppercase tracking-wider font-bold">
                CHANGE INVESTIGATION (HERO FEATURE A)
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-mono text-slate-900 dark:text-slate-100 flex items-center gap-3">
              {report.dependency_name}
              <span className="text-sm font-normal text-slate-500 dark:text-slate-400 font-mono">
                {report.current_version} <ArrowRight className="inline w-3.5 h-3.5 text-sky-500 dark:text-cyan-400" /> {targetVerInput}
              </span>
            </h2>
          </div>

          {/* Risk Badge */}
          <div className="flex items-center gap-4">
            <div
              className={`p-4 rounded-xl border flex items-center gap-3 ${
                report.risk_level === 'HIGH'
                  ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-500/50 glow-amber text-amber-700 dark:text-amber-400'
                  : report.risk_level === 'MEDIUM'
                  ? 'bg-sky-50 dark:bg-cyan-950/40 border-sky-300 dark:border-cyan-500/50 glow-cyan text-sky-700 dark:text-cyan-300'
                  : 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-500/50 glow-emerald text-emerald-700 dark:text-emerald-400'
              }`}
            >
              <AlertTriangle className="w-6 h-6" />
              <div>
                <span className="text-[10px] uppercase font-mono tracking-widest block text-slate-500 dark:text-slate-400">
                  Impact Risk Level
                </span>
                <span className="text-lg font-bold font-mono uppercase">{report.risk_level} IMPACT</span>
              </div>
            </div>

            <button
              onClick={onBackToGraph}
              className="px-4 py-2.5 rounded-xl bg-white dark:bg-[#151b26] border border-slate-200 dark:border-[#202b3c] hover:border-slate-400 dark:hover:border-slate-500 text-xs font-mono text-slate-700 dark:text-slate-300 transition-colors cursor-pointer shadow-sm"
            >
              ← Back to Graph
            </button>
          </div>
        </div>
      </div>

      {/* Impact Summary Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white dark:bg-[#0f141d] border border-slate-200 dark:border-[#202b3c] shadow-sm">
          <span className="text-xs font-mono text-slate-500 dark:text-slate-400 block mb-1">Direct Files Affected</span>
          <span className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400">{report.direct_files_affected}</span>
        </div>
        <div className="p-4 rounded-xl bg-white dark:bg-[#0f141d] border border-slate-200 dark:border-[#202b3c] shadow-sm">
          <span className="text-xs font-mono text-slate-500 dark:text-slate-400 block mb-1">Transitive Files</span>
          <span className="text-2xl font-bold font-mono text-indigo-600 dark:text-purple-400">{report.transitive_files_affected}</span>
        </div>
        <div className="p-4 rounded-xl bg-white dark:bg-[#0f141d] border border-slate-200 dark:border-[#202b3c] shadow-sm">
          <span className="text-xs font-mono text-slate-500 dark:text-slate-400 block mb-1">Test Suites to Review</span>
          <span className="text-2xl font-bold font-mono text-sky-600 dark:text-cyan-400">{report.tests_to_review}</span>
        </div>
        <div className="p-4 rounded-xl bg-white dark:bg-[#0f141d] border border-slate-200 dark:border-[#202b3c] shadow-sm">
          <span className="text-xs font-mono text-slate-500 dark:text-slate-400 block mb-1">API Call Sites</span>
          <span className="text-2xl font-bold font-mono text-amber-600 dark:text-amber-400">{report.usage_patterns_count}</span>
        </div>
      </div>

      {/* AI Reasoning Rationale */}
      <div className="p-5 rounded-2xl bg-white dark:bg-[#0f141d] border border-slate-200 dark:border-[#202b3c] space-y-3 shadow-sm">
        <div className="flex items-center gap-2 text-sky-600 dark:text-cyan-400 font-mono text-xs font-bold uppercase tracking-wider">
          <Cpu className="w-4 h-4" />
          <span>Strands Agent Evidence-Backed Analysis</span>
        </div>
        <p className="text-sm font-mono text-slate-800 dark:text-slate-200 leading-relaxed bg-slate-50 dark:bg-[#151b26] p-4 rounded-xl border border-slate-200 dark:border-[#202b3c]">
          {report.ai_explanation}
        </p>
      </div>

      {/* Blast Radius & Affected Files */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Files List */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-lg font-bold font-mono text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <FileCode className="w-5 h-5 text-sky-600 dark:text-cyan-400" />
            Affected Source Codebase Files
          </h3>

          <div className="space-y-3">
            {report.affected_files.map((file, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-white dark:bg-[#0f141d] border border-slate-200 dark:border-[#202b3c] flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-bold text-slate-900 dark:text-slate-100">{file.file_path}</span>
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded border uppercase ${
                        file.usage_level === 'HIGH'
                          ? 'bg-amber-100 dark:bg-amber-950/60 border-amber-300 dark:border-amber-500/30 text-amber-700 dark:text-amber-400'
                          : 'bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {file.usage_level} IMPACT
                    </span>
                    {file.is_test_file && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-100 dark:bg-cyan-950/60 border border-sky-300 dark:border-cyan-500/30 text-sky-700 dark:text-cyan-400 uppercase flex items-center gap-1">
                        <TestTube className="w-3 h-3" /> Test File
                      </span>
                    )}
                  </div>
                  {file.call_snippets.length > 0 && (
                    <div className="mt-2 text-xs font-mono text-slate-600 dark:text-slate-400 space-y-1">
                      {file.call_snippets.map((snip, sIdx) => (
                        <div key={sIdx} className="text-sky-700 dark:text-cyan-300 bg-slate-50 dark:bg-[#151b26] px-2 py-1 rounded inline-block mr-2 border border-slate-200 dark:border-[#202b3c]">
                          ├─ {snip}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Open Evidence Button */}
                {report.evidence.find((ev) => ev.file_path === file.file_path) && (
                  <button
                    onClick={() => {
                      const ev = report.evidence.find((e) => e.file_path === file.file_path);
                      if (ev) onOpenEvidence(ev);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-sky-100 dark:bg-cyan-950/60 hover:bg-sky-200 dark:hover:bg-cyan-900/60 border border-sky-300 dark:border-cyan-500/30 text-sky-700 dark:text-cyan-300 text-xs font-mono flex items-center gap-1.5 transition-colors whitespace-nowrap cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5 text-sky-600 dark:text-cyan-400" />
                    <span>View Evidence</span>
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Recommended Review Checklist */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold font-mono text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            Recommended Review Checklist
          </h3>

          <div className="p-4 rounded-2xl bg-white dark:bg-[#0f141d] border border-slate-200 dark:border-[#202b3c] space-y-3 shadow-sm">
            {report.recommended_actions.map((act, idx) => (
              <div key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 dark:bg-[#151b26] border border-slate-200 dark:border-[#202b3c]">
                <span className="w-5 h-5 rounded-full bg-sky-100 dark:bg-cyan-950 text-sky-700 dark:text-cyan-400 border border-sky-300 dark:border-cyan-500/30 flex items-center justify-center text-xs font-mono font-bold flex-shrink-0">
                  {idx + 1}
                </span>
                <span className="text-xs font-mono text-slate-800 dark:text-slate-200 leading-relaxed">{act}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
