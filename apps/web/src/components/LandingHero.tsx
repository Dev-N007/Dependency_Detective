import React, { useState } from 'react';
import { Terminal, Shield, Zap, Search, ArrowRight, GitBranch, Cpu } from 'lucide-react';

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
    <div className="flex-1 flex flex-col justify-center items-center px-6 py-12 bg-slate-50 dark:bg-[#080a0f] cyber-grid relative overflow-hidden transition-colors">
      {/* Subtle Glow Backdrops */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-sky-500/10 dark:bg-cyan-500/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-indigo-500/10 dark:bg-purple-500/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-4xl text-center space-y-8 relative z-10">
        {/* Hackathon Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white dark:bg-[#151b26] border border-slate-200 dark:border-[#202b3c] text-xs font-mono text-sky-700 dark:text-cyan-400 shadow-xs">
          <span className="w-2 h-2 rounded-full bg-sky-500 dark:bg-cyan-400 animate-pulse" />
          First Commit Hackathon 2026 — Build It Track
        </div>

        {/* Hero Title */}
        <div className="space-y-4">
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 leading-tight font-sans">
            YOU ARE ABOUT TO CHANGE A DEPENDENCY.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 via-indigo-600 to-purple-600 dark:from-cyan-400 dark:via-emerald-400 dark:to-purple-400 block mt-2">
              DO YOU KNOW WHAT BREAKS?
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto font-sans leading-relaxed">
            Investigate the blast radius before you upgrade, remove, or replace a dependency. Grounded in AST source code evidence & Git history.
          </p>
        </div>

        {/* CTA Buttons & Repository Input */}
        <div className="space-y-4 max-w-xl mx-auto">
          <button
            onClick={onLoadDemo}
            disabled={isLoading}
            className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-sky-600 via-sky-500 to-cyan-500 dark:from-cyan-500 dark:via-cyan-400 dark:to-emerald-400 hover:from-sky-500 hover:to-cyan-400 text-white dark:text-slate-950 font-bold font-mono text-sm flex items-center justify-center gap-3 shadow-lg shadow-sky-500/15 dark:shadow-cyan-950/50 transition-all transform hover:-translate-y-0.5 group cursor-pointer"
          >
            {isLoading ? (
              <span>Analyzing Codebase...</span>
            ) : (
              <>
                <Zap className="w-4 h-4 fill-white dark:fill-slate-950" />
                <span>LAUNCH DEMO REPOSITORY INVESTIGATION</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>

          <div className="relative flex items-center my-4">
            <div className="flex-grow border-t border-slate-200 dark:border-[#202b3c]"></div>
            <span className="flex-shrink mx-4 text-xs font-mono text-slate-400 dark:text-slate-500 uppercase font-semibold">OR SCAN LOCAL PATH / GIT REMOTE URL</span>
            <div className="flex-grow border-t border-slate-200 dark:border-[#202b3c]"></div>
          </div>

          <form onSubmit={handleSubmit} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                placeholder="Enter local path (e.g. d:/Projects/Repo) or Git URL (https://github.com/org/repo.git)..."
                value={customPath}
                onChange={(e) => setCustomPath(e.target.value)}
                className="w-full bg-white dark:bg-[#0f141d] border border-slate-200 dark:border-[#202b3c] rounded-xl pl-10 pr-4 py-2.5 text-xs font-mono text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-sky-500 dark:focus:border-cyan-500 shadow-xs"
              />
            </div>
            <button
              type="submit"
              disabled={!customPath.trim() || isLoading}
              className="px-4 py-2.5 rounded-xl bg-slate-900 dark:bg-[#151b26] hover:bg-slate-800 border border-slate-800 dark:border-[#202b3c] text-xs font-mono font-bold text-white dark:text-slate-200 transition-colors disabled:opacity-50 shadow-xs cursor-pointer"
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
                className="px-2.5 py-1 rounded-lg bg-sky-50 dark:bg-cyan-950/60 hover:bg-sky-100 dark:hover:bg-cyan-900/60 border border-sky-200 dark:border-cyan-500/30 text-sky-700 dark:text-cyan-300 text-[11px] font-mono transition-colors cursor-pointer"
              >
                github.com/{preset}
              </button>
            ))}
          </div>
        </div>

        {/* Highlights Badges */}
        <div className="pt-8 border-t border-slate-200 dark:border-[#202b3c]/60 grid grid-cols-1 sm:grid-cols-3 gap-4 text-left max-w-3xl mx-auto">
          <div className="p-4 rounded-xl bg-white dark:bg-[#0f141d]/80 border border-slate-200 dark:border-[#202b3c] space-y-1 shadow-xs">
            <div className="text-xs font-mono font-bold text-sky-700 dark:text-cyan-400 flex items-center gap-1.5">
              <Shield className="w-4 h-4" /> Local-First Privacy
            </div>
            <p className="text-xs font-mono text-slate-500 dark:text-slate-400">
              Runs 100% on your developer machine. Code logic never leaves local environment.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white dark:bg-[#0f141d]/80 border border-slate-200 dark:border-[#202b3c] space-y-1 shadow-xs">
            <div className="text-xs font-mono font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
              <GitBranch className="w-4 h-4" /> Git Archaeology
            </div>
            <p className="text-xs font-mono text-slate-500 dark:text-slate-400">
              Uncover introduced commit hashes, original authors, and historical usage evolution.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white dark:bg-[#0f141d]/80 border border-slate-200 dark:border-[#202b3c] space-y-1 shadow-xs">
            <div className="text-xs font-mono font-bold text-purple-700 dark:text-purple-400 flex items-center gap-1.5">
              <Cpu className="w-4 h-4" /> Strands + OpenSearch
            </div>
            <p className="text-xs font-mono text-slate-500 dark:text-slate-400">
              Powered by AWS OpenSource agentic reasoning & line-level AST evidence indexing.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
