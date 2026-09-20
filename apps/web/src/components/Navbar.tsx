import React from 'react';
import { Search, Terminal, Cpu, Database, ShieldAlert, Sun, Moon } from 'lucide-react';

interface NavbarProps {
  repoName?: string;
  isDemo?: boolean;
  isRemote?: boolean;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  onOpenCommandPalette: () => void;
  onResetToLanding: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  repoName,
  isDemo,
  isRemote,
  theme,
  onToggleTheme,
  onOpenCommandPalette,
  onResetToLanding,
}) => {
  return (
    <header className="border-b border-slate-200 dark:border-[#202b3c] bg-white/95 dark:bg-[#0f141d]/95 backdrop-blur-md sticky top-0 z-40 px-6 py-3.5 flex items-center justify-between transition-colors shadow-xs">
      {/* Brand */}
      <div className="flex items-center gap-4">
        <button
          onClick={onResetToLanding}
          className="flex items-center gap-3 group text-left focus:outline-none"
        >
          <div className="w-9 h-9 rounded-lg bg-sky-100 dark:bg-cyan-950/80 border border-sky-400 dark:border-cyan-500/40 flex items-center justify-center text-sky-600 dark:text-cyan-400 group-hover:border-cyan-400 transition-colors shadow-lg">
            <Terminal className="w-5 h-5" />
          </div>
          <div>
            <div className="font-extrabold tracking-wider text-slate-900 dark:text-slate-100 flex items-center gap-2 text-base">
              DEPENDENCY DETECTIVE
              <span className="text-[10px] uppercase tracking-widest px-2 py-0.5 rounded bg-sky-100 dark:bg-cyan-950 text-sky-700 dark:text-cyan-400 border border-sky-300 dark:border-cyan-500/30">
                v1.0 Local
              </span>
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
              Investigate the impact before you change the dependency.
            </div>
          </div>
        </button>

        {repoName && (
          <div className="hidden md:flex items-center gap-2 pl-4 border-l border-slate-200 dark:border-[#202b3c]">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">REPO:</span>
            <span className="text-xs font-semibold px-2.5 py-1 rounded bg-slate-100 dark:bg-[#151b26] border border-slate-200 dark:border-[#202b3c] text-sky-600 dark:text-cyan-300 font-mono">
              {repoName}
            </span>
            {isDemo && (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-500/30 text-amber-700 dark:text-amber-400 uppercase">
                Synthetic Demo Repo
              </span>
            )}
            {isRemote && (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-100 dark:bg-purple-950/60 border border-purple-300 dark:border-purple-500/30 text-purple-700 dark:text-purple-300 uppercase">
                Git Remote Repo
              </span>
            )}
          </div>
        )}
      </div>

      {/* AWS Tech Stack Badges & Controls */}
      <div className="flex items-center gap-3">
        <div className="hidden lg:flex items-center gap-2 text-[11px] font-mono pr-3 border-r border-slate-200 dark:border-[#202b3c]">
          <span className="text-slate-500 dark:text-slate-400">AWS Tech:</span>
          <span className="px-2 py-0.5 rounded bg-sky-50 dark:bg-cyan-950/50 border border-sky-200 dark:border-cyan-500/30 text-sky-700 dark:text-cyan-300 flex items-center gap-1">
            <Cpu className="w-3 h-3 text-sky-500 dark:text-cyan-400" /> Strands Agents
          </span>
          <span className="px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-300 flex items-center gap-1">
            <Database className="w-3 h-3 text-emerald-500 dark:text-emerald-400" /> OpenSearch
          </span>
          <span className="px-2 py-0.5 rounded bg-purple-50 dark:bg-purple-950/50 border border-purple-200 dark:border-purple-500/30 text-purple-700 dark:text-purple-300 flex items-center gap-1">
            <ShieldAlert className="w-3 h-3 text-purple-500 dark:text-purple-400" /> Finch Local
          </span>
        </div>

        {/* Theme Switcher Button */}
        <button
          onClick={onToggleTheme}
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          className="p-2 rounded-lg bg-slate-100 dark:bg-[#151b26] border border-slate-200 dark:border-[#202b3c] text-slate-700 dark:text-slate-300 hover:border-sky-400 dark:hover:border-cyan-500/40 transition-colors shadow-sm"
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-amber-400 animate-spin-slow" />
          ) : (
            <Moon className="w-4 h-4 text-indigo-600" />
          )}
        </button>

        <button
          onClick={onOpenCommandPalette}
          className="flex items-center gap-3 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-[#151b26] border border-slate-200 dark:border-[#202b3c] text-slate-700 dark:text-slate-300 hover:border-sky-400 dark:hover:border-cyan-500/40 text-xs font-mono transition-colors shadow-sm"
        >
          <Search className="w-3.5 h-3.5 text-sky-500 dark:text-cyan-400" />
          <span>Command Palette...</span>
          <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-[#080a0f] border border-slate-200 dark:border-[#202b3c] text-[10px] text-slate-500 dark:text-slate-400 font-mono">
            Ctrl+K
          </kbd>
        </button>
      </div>
    </header>
  );
};
