import React, { useEffect, useState } from 'react';
import { RepositoryAnalysis, DependencyNode, ImpactReport, ArchaeologyReport, EvidenceItem } from './types';
import { fetchDemoRepository, analyzeRepository, investigateImpact, investigateArchaeology } from './lib/api';
import { Navbar } from './components/Navbar';
import { StatsBar } from './components/StatsBar';
import { DependencyGraphView } from './components/DependencyGraph';
import { WhatIfView } from './components/WhatIfView';
import { ArchaeologyView } from './components/ArchaeologyView';
import { EvidenceDrawer } from './components/EvidenceDrawer';
import { CommandPalette } from './components/CommandPalette';
import { LandingHero } from './components/LandingHero';

export const App: React.FC = () => {
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    return (localStorage.getItem('dd-theme') as 'dark' | 'light') || 'light';
  });
  const [analysis, setAnalysis] = useState<RepositoryAnalysis | null>(null);
  const [selectedNode, setSelectedNode] = useState<DependencyNode | null>(null);
  const [activeView, setActiveView] = useState<'graph' | 'whatif' | 'archaeology'>('graph');
  const [impactReport, setImpactReport] = useState<ImpactReport | null>(null);
  const [archaeologyReport, setArchaeologyReport] = useState<ArchaeologyReport | null>(null);
  const [activeEvidence, setActiveEvidence] = useState<EvidenceItem | null>(null);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    document.documentElement.classList.remove('dark', 'light');
    document.documentElement.classList.add(theme);
    document.body.classList.remove('dark', 'light');
    document.body.classList.add(theme);
    localStorage.setItem('dd-theme', theme);
  }, [theme]);

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleLoadDemo = async () => {
    setIsLoading(true);
    try {
      const data = await fetchDemoRepository();
      setAnalysis(data);
      if (data.graph.nodes.length > 0) {
        setSelectedNode(data.graph.nodes[0]);
      }
      setActiveView('graph');
    } catch (err) {
      console.error(err);
      alert('Could not load demo repository. Please ensure backend is running.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnalyzePath = async (path: string) => {
    setIsLoading(true);
    try {
      const data = await analyzeRepository(path);
      setAnalysis(data);
      if (data.graph.nodes.length > 0) {
        setSelectedNode(data.graph.nodes[0]);
      }
      setActiveView('graph');
    } catch (err) {
      console.error(err);
      alert(`Could not analyze repository at ${path}. Please check path or URL.`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTriggerWhatIf = async (node: DependencyNode) => {
    if (!analysis) return;
    setIsLoading(true);
    try {
      const report = await investigateImpact(analysis.repo_path, node.name, node.version);
      setImpactReport(report);
      setActiveView('whatif');
    } catch (err) {
      console.error(err);
      alert(`Failed to run What-If investigation for ${node.name}.`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTriggerArchaeology = async (node: DependencyNode) => {
    if (!analysis) return;
    setIsLoading(true);
    try {
      const report = await investigateArchaeology(analysis.repo_path, node.name);
      setArchaeologyReport(report);
      setActiveView('archaeology');
    } catch (err) {
      console.error(err);
      alert(`Failed to run Archaeology investigation for ${node.name}.`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#080a0f] text-slate-900 dark:text-slate-100 font-sans transition-colors">
      <Navbar
        repoName={analysis?.repo_name}
        isDemo={analysis?.is_demo}
        isRemote={analysis?.is_remote}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        onResetToLanding={() => setAnalysis(null)}
      />

      {!analysis ? (
        <LandingHero onLoadDemo={handleLoadDemo} onAnalyzePath={handleAnalyzePath} isLoading={isLoading} />
      ) : (
        <div className="flex-1 flex flex-col h-[calc(100vh-61px)] overflow-hidden">
          <StatsBar stats={analysis.stats} />

          {activeView === 'graph' && (
            <DependencyGraphView
              graph={analysis.graph}
              selectedNode={selectedNode}
              onSelectNode={(node) => setSelectedNode(node)}
              onTriggerWhatIf={handleTriggerWhatIf}
              onTriggerArchaeology={handleTriggerArchaeology}
            />
          )}

          {activeView === 'whatif' && impactReport && (
            <WhatIfView
              report={impactReport}
              onOpenEvidence={(ev) => setActiveEvidence(ev)}
              onBackToGraph={() => setActiveView('graph')}
            />
          )}

          {activeView === 'archaeology' && archaeologyReport && (
            <ArchaeologyView
              report={archaeologyReport}
              onOpenEvidence={(ev) => setActiveEvidence(ev)}
              onBackToGraph={() => setActiveView('graph')}
            />
          )}
        </div>
      )}

      {/* Slide-out Evidence Drawer */}
      <EvidenceDrawer evidence={activeEvidence} onClose={() => setActiveEvidence(null)} />

      {/* Command Palette Keyboard Modal */}
      {analysis && (
        <CommandPalette
          isOpen={isCommandPaletteOpen}
          onClose={() => setIsCommandPaletteOpen(false)}
          nodes={analysis.graph.nodes}
          onSelectNode={(node) => setSelectedNode(node)}
          onTriggerWhatIf={handleTriggerWhatIf}
          onTriggerArchaeology={handleTriggerArchaeology}
          onLoadDemoRepo={handleLoadDemo}
        />
      )}
    </div>
  );
};
