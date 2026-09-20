import React, { useState } from 'react';
import { Terminal, Shield, Zap, Search, ArrowRight, GitBranch, Cpu, Database } from 'lucide-react';

interface LandingHeroProps {
  onLoadDemo: () => void;
  onAnalyzePath: (path: string) => void;
  isLoading: boolean;
}

export const LandingHero: React.FC<LandingHeroProps> = ({ onLoadDemo, onAnalyzePath, isLoading }) => {
  const [customPath, setCustomPath] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customPath.trim()) {
      onAnalyzePath(customPath.trim());
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-center items-center px-6 py-12 bg-[#080a0f] cyber-grid relative overflow-hidden">
      {/* Glow Backdrops */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-cyan-500/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-purple-500/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-4xl text-center space-y-8 relative z-10">
        {/* Hackathon Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#151b26] border border-[#202b3c] text-xs font-mono text-cyan-400">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          First Commit Hackathon 2026 — Build It Track
        </div>

        {/* Hero Title */}
        <div className="space-y-4">
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight font-mono text-slate-100 leading-tight">
            YOU ARE ABOUT TO CHANGE A DEPENDENCY.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-emerald-400 to-purple-400 block mt-2">
              DO YOU KNOW WHAT BREAKS?
            </span>
          </h1>

          <p className="text-lg sm:text-xl font-mono text-slate-300 max-w-2xl mx-auto">
            Investigate the blast radius before you upgrade, remove, or replace a dependency. Grounded in AST source code evidence & Git history.
          </p>
        </div>

        {/* CTA Buttons & Repository Input */}
        <div className="space-y-4 max-w-xl mx-auto">
          <button
            onClick={onLoadDemo}
            disabled={isLoading}
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-cyan-500 via-cyan-400 to-emerald-400 hover:from-cyan-400 hover:to-emerald-300 text-slate-950 font-extrabold font-mono text-base flex items-center justify-center gap-3 shadow-xl shadow-cyan-950/50 transition-all transform hover:-translate-y-0.5 group"
          >
            {isLoading ? (
              <span>Analyzing Codebase...</span>
            ) : (
              <>
                <Zap className="w-5 h-5 fill-slate-950" />
                <span>LAUNCH DEMO REPOSITORY INVESTIGATION</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>

          <div className="relative flex items-center my-4">
            <div className="flex-grow border-t border-[#202b3c]"></div>
            <span className="flex-shrink mx-4 text-xs font-mono text-slate-400 uppercase">OR SCAN LOCAL PATH / GIT REMOTE URL</span>
            <div className="flex-grow border-t border-[#202b3c]"></div>
          </div>

          <form onSubmit={handleSubmit} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 dark:text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                placeholder="Enter local path (e.g. d:/Projects/Repo) or Git URL (https://github.com/org/repo.git)..."
                value={customPath}
                onChange={(e) => setCustomPath(e.target.value)}
                className="w-full bg-white dark:bg-[#0f141d] border border-slate-300 dark:border-[#202b3c] rounded-xl pl-10 pr-4 py-3 text-xs font-mono text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-cyan-500 shadow-sm"
              />
            </div>
            <button
              type="submit"
              disabled={!customPath.trim() || isLoading}
              className="px-5 py-3 rounded-xl bg-slate-900 dark:bg-[#151b26] border border-slate-700 dark:border-[#202b3c] hover:border-slate-500 text-xs font-mono font-bold text-slate-100 dark:text-slate-200 transition-colors disabled:opacity-50 shadow-sm"
            >
              Analyze
            </button>
          </form>

          {/* Quick Preset Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-xs font-mono">
            <span className="text-slate-500 dark:text-slate-400 text-[11px]">Try preset remote repos:</span>
            {['expressjs/express', 'axios/axios', 'psf/requests', 'lodash/lodash'].map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => {
                  setCustomPath(`https://github.com/${preset}.git`);
                  onAnalyzePath(`https://github.com/${preset}.git`);
                }}
                disabled={isLoading}
                className="px-2.5 py-1 rounded-lg bg-sky-100 dark:bg-cyan-950/60 hover:bg-sky-200 dark:hover:bg-cyan-900/60 border border-sky-300 dark:border-cyan-500/30 text-sky-700 dark:text-cyan-300 text-[11px] font-mono transition-colors"
              >
                github.com/{preset}
              </button>
            ))}
          </div>
        </div>

        {/* Highlights Badges */}
        <div className="pt-8 border-t border-[#202b3c]/60 grid grid-cols-1 sm:grid-cols-3 gap-4 text-left max-w-3xl mx-auto">
          <div className="p-4 rounded-xl bg-[#0f141d]/80 border border-[#202b3c] space-y-1">
            <div className="text-xs font-mono font-bold text-cyan-400 flex items-center gap-1.5">
              <Shield className="w-4 h-4" /> Local-First Privacy
            </div>
            <p className="text-xs font-mono text-slate-400">
              Runs 100% on your developer machine. Code logic never leaves local environment.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#0f141d]/80 border border-[#202b3c] space-y-1">
            <div className="text-xs font-mono font-bold text-emerald-400 flex items-center gap-1.5">
              <GitBranch className="w-4 h-4" /> Git Archaeology
            </div>
            <p className="text-xs font-mono text-slate-400">
              Uncover introduced commit hashes, original authors, and historical usage evolution.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#0f141d]/80 border border-[#202b3c] space-y-1">
            <div className="text-xs font-mono font-bold text-purple-400 flex items-center gap-1.5">
              <Cpu className="w-4 h-4" /> Strands + OpenSearch
            </div>
            <p className="text-xs font-mono text-slate-400">
              Powered by AWS OpenSource agentic reasoning & line-level AST evidence indexing.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
