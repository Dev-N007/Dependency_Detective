import React from 'react';
import { ArchaeologyReport, EvidenceItem } from '../types';
import { History, GitCommit, Calendar, User, ShieldCheck, Eye, ArrowLeft } from 'lucide-react';

interface ArchaeologyViewProps {
  report: ArchaeologyReport;
  onOpenEvidence: (evidence: EvidenceItem) => void;
  onBackToGraph: () => void;
}

export const ArchaeologyView: React.FC<ArchaeologyViewProps> = ({
  report,
  onOpenEvidence,
  onBackToGraph,
}) => {
  return (
    <div className="flex-1 bg-slate-50 dark:bg-[#080a0f] overflow-y-auto p-6 space-y-6 transition-colors">
      {/* Header Banner */}
      <div className="cyber-panel p-6 rounded-2xl relative overflow-hidden bg-white dark:bg-[#0f141d]/90 border border-slate-200 dark:border-[#202b3c] shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-mono px-2.5 py-0.5 rounded bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-400 border border-purple-300 dark:border-purple-500/30 uppercase tracking-wider font-bold">
                DEPENDENCY ARCHAEOLOGY (HERO FEATURE B)
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-mono text-slate-900 dark:text-slate-100">
              Why is {report.dependency_name} here?
            </h2>
          </div>

          <button
            onClick={onBackToGraph}
            className="px-4 py-2.5 rounded-xl bg-white dark:bg-[#151b26] border border-slate-200 dark:border-[#202b3c] hover:border-slate-400 dark:hover:border-slate-500 text-xs font-mono text-slate-700 dark:text-slate-300 transition-colors flex items-center gap-2 self-start md:self-auto cursor-pointer shadow-sm"
          >
            <ArrowLeft className="w-4 h-4 text-purple-600 dark:text-purple-400" /> Back to Graph
          </button>
        </div>
      </div>

      {/* Forensic Overview Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white dark:bg-[#0f141d] border border-slate-200 dark:border-[#202b3c] shadow-sm">
          <span className="text-xs font-mono text-slate-500 dark:text-slate-400 block mb-1">Introduced Date</span>
          <span className="text-lg font-bold font-mono text-purple-600 dark:text-purple-400 flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-purple-600 dark:text-purple-400" /> {report.introduced_date}
          </span>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-[#0f141d] border border-slate-200 dark:border-[#202b3c] shadow-sm">
          <span className="text-xs font-mono text-slate-500 dark:text-slate-400 block mb-1">Introducing Commit</span>
          <span className="text-lg font-bold font-mono text-sky-600 dark:text-cyan-300 flex items-center gap-1.5">
            <GitCommit className="w-4 h-4 text-sky-600 dark:text-cyan-400" /> {report.introduced_commit}
          </span>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-[#0f141d] border border-slate-200 dark:border-[#202b3c] shadow-sm">
          <span className="text-xs font-mono text-slate-500 dark:text-slate-400 block mb-1">Introducing Author</span>
          <span className="text-lg font-bold font-mono text-slate-900 dark:text-slate-200 flex items-center gap-1.5">
            <User className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> {report.introduced_author}
          </span>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-[#0f141d] border border-slate-200 dark:border-[#202b3c] shadow-sm">
          <span className="text-xs font-mono text-slate-500 dark:text-slate-400 block mb-1">Replaceability Verdict</span>
          <span
            className={`text-lg font-bold font-mono flex items-center gap-1.5 ${
              report.is_potentially_removable ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            {report.is_potentially_removable ? 'Potentially Removable' : 'Deeply Integrated'}
          </span>
        </div>
      </div>

      {/* Forensic Git Timeline */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold font-mono text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <History className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          Git History Timeline & Evolution
        </h3>

        <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-300 dark:before:bg-[#202b3c]">
          {report.timeline.map((event, idx) => (
            <div key={idx} className="relative pl-6">
              <div
                className={`absolute -left-6 top-1.5 w-5 h-5 rounded-full border flex items-center justify-center text-[10px] font-mono font-bold ${
                  event.event_type === 'introduced'
                    ? 'bg-purple-100 dark:bg-purple-950 border-purple-500 text-purple-700 dark:text-purple-400 glow-purple'
                    : event.event_type === 'current'
                    ? 'bg-sky-100 dark:bg-cyan-950 border-sky-500 dark:border-cyan-500 text-sky-700 dark:text-cyan-400 glow-cyan'
                    : 'bg-white dark:bg-[#151b26] border-slate-300 dark:border-[#202b3c] text-slate-500 dark:text-slate-400'
                }`}
              >
                ●
              </div>

              <div className="p-4 rounded-xl bg-white dark:bg-[#0f141d] border border-slate-200 dark:border-[#202b3c] space-y-2 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-slate-900 dark:text-slate-100">{event.title}</span>
                  <div className="flex items-center gap-2 font-mono text-xs text-slate-500 dark:text-slate-400">
                    <span>{event.date}</span>
                    <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-[#151b26] border border-slate-200 dark:border-[#202b3c] text-sky-600 dark:text-cyan-400 font-bold">
                      {event.commit_hash}
                    </span>
                  </div>
                </div>
                <p className="text-xs font-mono text-slate-800 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-[#151b26] p-3 rounded-lg border border-slate-200 dark:border-[#202b3c]">
                  {event.description}
                </p>
                <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400">Author: {event.author}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Suggested Archaeology Steps */}
      <div className="p-5 rounded-2xl bg-white dark:bg-[#0f141d] border border-slate-200 dark:border-[#202b3c] space-y-3 shadow-sm">
        <h4 className="text-sm font-bold font-mono text-slate-900 dark:text-slate-100">Archaeology Investigation Next Steps</h4>
        <div className="space-y-2 font-mono text-xs">
          {report.suggested_next_steps.map((step, idx) => (
            <div key={idx} className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
              <span className="text-purple-600 dark:text-purple-400 font-bold">✓</span> {step}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
