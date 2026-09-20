import React from 'react';
import { Search, Terminal, Cpu, Database, ShieldAlert } from 'lucide-react';

interface NavbarProps {
  repoName?: string;
  isDemo?: boolean;
  isRemote?: boolean;
  onOpenCommandPalette: () => void;
  onResetToLanding: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  repoName,
  isDemo,
  isRemote,
  onOpenCommandPalette,
  onResetToLanding,
}) => {
  return (
    <header className="border-b border-[#202b3c] bg-[#0f141d]/95 backdrop-blur-md sticky top-0 z-40 px-6 py-3.5 flex items-center justify-between">
      {/* Brand */}
      <div className="flex items-center gap-4">
        <button
          onClick={onResetToLanding}
          className="flex items-center gap-3 group text-left focus:outline-none"
        >
          <div className="w-9 h-9 rounded-lg bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center text-cyan-400 group-hover:border-cyan-400 transition-colors shadow-lg shadow-cyan-950/50">
            <Terminal className="w-5 h-5" />
          </div>
          <div>
            <div className="font-extrabold tracking-wider text-slate-100 flex items-center gap-2 text-base">
              DEPENDENCY DETECTIVE
              <span className="text-[10px] uppercase tracking-widest px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-500/30">
                v1.0 Local
              </span>
            </div>
            <div className="text-[11px] text-slate-400 font-mono">
              Investigate the impact before you change the dependency.
            </div>
          </div>
        </button>

        {repoName && (
          <div className="hidden md:flex items-center gap-2 pl-4 border-l border-[#202b3c]">
            <span className="text-xs text-slate-400 font-mono">REPO:</span>
            <span className="text-xs font-semibold px-2.5 py-1 rounded bg-[#151b26] border border-[#202b3c] text-cyan-300 font-mono">
              {repoName}
            </span>
            {isDemo && (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950/60 border border-amber-500/30 text-amber-400 uppercase">
                Synthetic Demo Repo
              </span>
            )}
            {isRemote && (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950/60 border border-purple-500/30 text-purple-300 uppercase">
                Git Remote Repo
              </span>
            )}
          </div>
        )}
      </div>

      {/* AWS Tech Stack Badges & Search */}
      <div className="flex items-center gap-3">
        <div className="hidden lg:flex items-center gap-2 text-[11px] font-mono pr-3 border-r border-[#202b3c]">
          <span className="text-slate-400">AWS Tech:</span>
          <span className="px-2 py-0.5 rounded bg-cyan-950/50 border border-cyan-500/30 text-cyan-300 flex items-center gap-1">
            <Cpu className="w-3 h-3 text-cyan-400" /> Strands Agents
          </span>
          <span className="px-2 py-0.5 rounded bg-emerald-950/50 border border-emerald-500/30 text-emerald-300 flex items-center gap-1">
            <Database className="w-3 h-3 text-emerald-400" /> OpenSearch
          </span>
          <span className="px-2 py-0.5 rounded bg-purple-950/50 border border-purple-500/30 text-purple-300 flex items-center gap-1">
            <ShieldAlert className="w-3 h-3 text-purple-400" /> Finch Local
          </span>
        </div>

        <button
          onClick={onOpenCommandPalette}
          className="flex items-center gap-3 px-3 py-1.5 rounded-lg bg-[#151b26] border border-[#202b3c] text-slate-300 hover:border-cyan-500/40 text-xs font-mono transition-colors shadow-sm"
        >
          <Search className="w-3.5 h-3.5 text-cyan-400" />
          <span>Command Palette...</span>
          <kbd className="px-1.5 py-0.5 rounded bg-[#080a0f] border border-[#202b3c] text-[10px] text-slate-400 font-mono">
            Ctrl+K
          </kbd>
        </button>
      </div>
    </header>
  );
};
