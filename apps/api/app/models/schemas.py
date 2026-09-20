from typing import List, Dict, Optional, Any
from enum import Enum
from pydantic import BaseModel, Field

class DependencyType(str, Enum):
    DIRECT = "direct"
    TRANSITIVE = "transitive"
    DEV = "dev"

class RiskLevel(str, Enum):
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"

class DependencyNode(BaseModel):
    id: str
    name: str
    version: str
    ecosystem: str # "npm" or "pypi"
    dep_type: DependencyType
    usages_count: int = 0
    direct_dependents_count: int = 0
    transitive_dependents_count: int = 0
    is_removable: bool = False
    risk_level: RiskLevel = RiskLevel.LOW

class GraphEdge(BaseModel):
    source: str
    target: str
    relationship: str # "depends_on" or "imports"

class DependencyGraph(BaseModel):
    nodes: List[DependencyNode]
    edges: List[GraphEdge]

class RepositoryStats(BaseModel):
    total_dependencies: int
    direct_dependencies: int
    transitive_dependencies: int
    high_impact_dependencies: int
    potentially_removable: int
    total_source_references: int
    total_relevant_commits: int

class RepositoryAnalysis(BaseModel):
    repo_id: str
    repo_name: str
    repo_path: str
    is_demo: bool = False
    is_remote: bool = False
    remote_url: Optional[str] = None
    language_ecosystems: List[str]
    stats: RepositoryStats
    graph: DependencyGraph

class EvidenceItem(BaseModel):
    id: str
    file_path: str
    line_number: int
    line_content: str
    snippet_context: str
    evidence_type: str # "import", "call", "commit", "test"
    description: str

class FileUsage(BaseModel):
    file_path: str
    usage_level: str # "HIGH", "MEDIUM", "LOW"
    import_count: int
    call_snippets: List[str]
    is_test_file: bool = False

class ImpactRequest(BaseModel):
    repo_path: str
    dependency_name: str
    current_version: str = "1.6.8"
    target_version: Optional[str] = None
    investigation_mode: str = "upgrade" # "upgrade", "removal", "replace"

class ImpactReport(BaseModel):
    dependency_name: str
    current_version: str
    target_version: Optional[str] = None
    risk_level: RiskLevel
    risk_explanation: str
    direct_files_affected: int
    transitive_files_affected: int
    tests_to_review: int
    usage_patterns_count: int
    affected_files: List[FileUsage]
    test_files: List[str]
    evidence: List[EvidenceItem]
    ai_explanation: str
    recommended_actions: List[str]
    confidence: str = "HIGH"

class ArchaeologyRequest(BaseModel):
    repo_path: str
    dependency_name: str

class ArchaeologyTimelineEvent(BaseModel):
    date: str
    commit_hash: str
    author: str
    title: str
    description: str
    event_type: str # "introduced", "expanded", "current"

class ArchaeologyReport(BaseModel):
    dependency_name: str
    introduced_date: str
    introduced_commit: str
    introduced_author: str
    original_purpose: str
    current_usage_files_count: int
    last_meaningful_usage_date: str
    is_potentially_removable: bool
    confidence: str
    timeline: List[ArchaeologyTimelineEvent]
    evidence: List[EvidenceItem]
    ai_summary: str
    suggested_next_steps: List[str]
