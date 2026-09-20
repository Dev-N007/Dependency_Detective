import { RepositoryAnalysis, ImpactReport, ArchaeologyReport } from '../types';

const API_BASE = '/api';

export async function fetchDemoRepository(): Promise<RepositoryAnalysis> {
  const res = await fetch(`${API_BASE}/repositories/demo`);
  if (!res.ok) throw new Error('Failed to load demo repository');
  return res.json();
}

export async function analyzeRepository(path?: string): Promise<RepositoryAnalysis> {
  const res = await fetch(`${API_BASE}/repositories/analyze${path ? `?repo_path=${encodeURIComponent(path)}` : ''}`, {
    method: 'POST',
  });
  if (!res.ok) throw new Error('Failed to analyze repository');
  return res.json();
}

export async function investigateImpact(
  repoPath: string,
  depName: string,
  currentVer: string,
  targetVer?: string
): Promise<ImpactReport> {
  const res = await fetch(`${API_BASE}/investigations/impact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      repo_path: repoPath,
      dependency_name: depName,
      current_version: currentVer,
      target_version: targetVer || 'latest',
    }),
  });
  if (!res.ok) throw new Error('Failed to execute impact investigation');
  return res.json();
}

export async function investigateArchaeology(repoPath: string, depName: string): Promise<ArchaeologyReport> {
  const res = await fetch(`${API_BASE}/investigations/archaeology`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      repo_path: repoPath,
      dependency_name: depName,
    }),
  });
  if (!res.ok) throw new Error('Failed to execute archaeology investigation');
  return res.json();
}
