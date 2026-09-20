export type DependencyType = 'direct' | 'transitive' | 'dev';
export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH';

export interface DependencyNode {
  id: string;
  name: string;
  version: string;
  ecosystem: string;
  dep_type: DependencyType;
  usages_count: number;
  direct_dependents_count: number;
  transitive_dependents_count: number;
  is_removable: boolean;
  risk_level: RiskLevel;
}

export interface GraphEdge {
  source: string;
  target: string;
  relationship: string;
}

export interface DependencyGraph {
  nodes: DependencyNode[];
  edges: GraphEdge[];
}

export interface RepositoryStats {
  total_dependencies: number;
  direct_dependencies: number;
  transitive_dependencies: number;
  high_impact_dependencies: number;
  potentially_removable: number;
  total_source_references: number;
  total_relevant_commits: number;
}

export interface RepositoryAnalysis {
  repo_id: string;
  repo_name: string;
  repo_path: string;
  is_demo: boolean;
  is_remote?: boolean;
  remote_url?: string;
  language_ecosystems: string[];
  stats: RepositoryStats;
  graph: DependencyGraph;
}

export interface EvidenceItem {
  id: string;
  file_path: string;
  line_number: number;
  line_content: string;
  snippet_context: string;
  evidence_type: string;
  description: string;
}

export interface FileUsage {
  file_path: string;
  usage_level: string;
  import_count: number;
  call_snippets: string[];
  is_test_file: boolean;
}

export interface ImpactReport {
  dependency_name: string;
  current_version: string;
  target_version?: string;
  risk_level: RiskLevel;
  risk_explanation: string;
  direct_files_affected: number;
  transitive_files_affected: number;
  tests_to_review: number;
  usage_patterns_count: number;
  affected_files: FileUsage[];
  test_files: string[];
  evidence: EvidenceItem[];
  ai_explanation: string;
  recommended_actions: string[];
  confidence: string;
}

export interface ArchaeologyTimelineEvent {
  date: string;
  commit_hash: string;
  author: string;
  title: string;
  description: string;
  event_type: string;
}

export interface ArchaeologyReport {
  dependency_name: string;
  introduced_date: string;
  introduced_commit: string;
  introduced_author: string;
  original_purpose: string;
  current_usage_files_count: number;
  last_meaningful_usage_date: string;
  is_potentially_removable: boolean;
  confidence: string;
  timeline: ArchaeologyTimelineEvent[];
  evidence: EvidenceItem[];
  ai_summary: string;
  suggested_next_steps: string[];
}
