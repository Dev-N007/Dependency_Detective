import re
from pathlib import Path
from typing import Dict, List, Optional, Tuple
from git import Repo
from app.config import DEMO_REPO_PATH, BASE_DIR
from app.models.schemas import (
    RepositoryAnalysis, RepositoryStats, DependencyGraph,
    ImpactRequest, ImpactReport, ArchaeologyRequest, ArchaeologyReport, EvidenceItem
)
from app.analyzers.manifest_parser import ManifestParser
from app.analyzers.code_analyzer import CodeAnalyzer
from app.analyzers.blast_radius import BlastRadiusCalculator
from app.git.archaeology import GitArchaeologyAnalyzer
from app.graph.builder import GraphBuilder
from app.search.opensearch_client import opensearch_engine
from app.agents.strands_agents import impact_agent, archaeology_agent

class AnalysisService:
    """Core analysis orchestrator for repository scanning, impact investigations, and archaeology."""

    @staticmethod
    def _resolve_repo_path(target_path: Optional[str]) -> Tuple[Path, bool, Optional[str]]:
        """Resolves local directory path, workspace relative path, or clones a remote Git repository URL."""
        if not target_path or target_path.strip() == "" or target_path.strip().lower() in ("demo", "demo-repository"):
            return DEMO_REPO_PATH.resolve(), False, None

        target = target_path.strip()

        # 1. Check direct local path
        try:
            candidate_local = Path(target).resolve()
            if candidate_local.exists():
                return candidate_local, False, None
        except Exception:
            pass

        # 2. Check workspace relative path
        try:
            workspace_candidate = (DEMO_REPO_PATH.parent / target).resolve()
            if workspace_candidate.exists():
                return workspace_candidate, False, None
        except Exception:
            pass

        # 3. Handle Git Remote URLs and Subfolders (e.g. https://github.com/owner/repo or https://github.com/owner/repo/backend)
        remote_url = target
        subfolder = ""

        # Parse GitHub URLs with subfolders (e.g., https://github.com/owner/repo/tree/main/subfolder or /backend)
        gh_match = re.match(r"^(https?://github\.com/([^/]+)/([^/]+?))(?:\.git)?(?:/(?:tree/[^/]+/(.+)|(.+)))?$", target)
        if gh_match:
            base_repo = gh_match.group(1)
            repo_owner = gh_match.group(2)
            repo_name = gh_match.group(3)
            subfolder = gh_match.group(4) or gh_match.group(5) or ""
            remote_url = f"{base_repo}.git"
        elif target.startswith("github.com/"):
            parts = target.split("/")
            if len(parts) >= 3:
                remote_url = f"https://github.com/{parts[1]}/{parts[2]}.git"
                if len(parts) > 3:
                    subfolder = "/".join(parts[3:])
            else:
                remote_url = f"https://{target}.git"
        elif "/" in target and not target.startswith((".", "/", "\\")) and ":" not in target and len(target.split("/")) == 2:
            remote_url = f"https://github.com/{target}.git"

        # Check if remote URL pattern
        is_remote_url = (
            remote_url.startswith("http://")
            or remote_url.startswith("https://")
            or remote_url.startswith("git@")
            or remote_url.startswith("git://")
            or remote_url.endswith(".git")
        )

        if is_remote_url:
            safe_name = re.sub(r"[^a-zA-Z0-9_\-]", "_", remote_url)
            cache_dir = (BASE_DIR / ".cache" / "remote_repos" / safe_name).resolve()
            cache_dir.mkdir(parents=True, exist_ok=True)

            if (cache_dir / ".git").exists():
                try:
                    repo = Repo(cache_dir)
                    repo.remotes.origin.pull()
                except Exception as e:
                    print(f"[AnalysisService] Git pull notice for {remote_url}: {e}")
            else:
                print(f"[AnalysisService] Cloning remote repository {remote_url} into {cache_dir}...")
                try:
                    Repo.clone_from(remote_url, cache_dir, depth=50)
                except Exception as e:
                    try:
                        Repo.clone_from(remote_url, cache_dir)
                    except Exception as clone_err:
                        raise ValueError(f"Failed to clone remote repository '{remote_url}': {clone_err}")

            final_path = (cache_dir / subfolder).resolve() if subfolder else cache_dir
            if not final_path.exists():
                raise ValueError(f"Subfolder '{subfolder}' does not exist inside cloned repository '{remote_url}'")

            return final_path, True, remote_url

        raise ValueError(f"Repository path or Git remote URL does not exist: {target}")

    @staticmethod
    def analyze_repository(target_path: Optional[str] = None) -> RepositoryAnalysis:
        repo_path, is_remote, remote_url = AnalysisService._resolve_repo_path(target_path)

        is_demo = (repo_path == DEMO_REPO_PATH.resolve())
        repo_name = repo_path.name if not is_remote else target_path.split("/")[-1].replace(".git", "")

        # Construct dependency graph
        graph = GraphBuilder.build_graph(repo_path)

        # Count total commits
        total_commits = 0
        try:
            r = Repo(repo_path)
            total_commits = len(list(r.iter_commits(max_count=100)))
        except Exception:
            total_commits = 5

        # Detect ecosystems
        ecosystems = list(set(n.ecosystem for n in graph.nodes))

        # Calculate stats
        direct_count = sum(1 for n in graph.nodes if n.dep_type == "direct")
        transitive_count = len(graph.nodes) - direct_count
        high_impact_count = sum(1 for n in graph.nodes if n.risk_level == "HIGH")
        removable_count = sum(1 for n in graph.nodes if n.is_removable)
        total_usages = sum(n.usages_count for n in graph.nodes)

        stats = RepositoryStats(
            total_dependencies=len(graph.nodes),
            direct_dependencies=direct_count,
            transitive_dependencies=transitive_count,
            high_impact_dependencies=high_impact_count,
            potentially_removable=removable_count,
            total_source_references=total_usages,
            total_relevant_commits=total_commits
        )

        repo_analysis = RepositoryAnalysis(
            repo_id=repo_name.lower(),
            repo_name=repo_name,
            repo_path=str(repo_path),
            is_demo=is_demo,
            is_remote=is_remote,
            remote_url=remote_url,
            language_ecosystems=ecosystems,
            stats=stats,
            graph=graph
        )

        return repo_analysis

    @staticmethod
    def investigate_impact(req: ImpactRequest) -> ImpactReport:
        repo_path, _, _ = AnalysisService._resolve_repo_path(req.repo_path)
        dep_name = req.dependency_name

        # Extract deterministic evidence
        evidence_list, direct_files, file_snippets = CodeAnalyzer.analyze_dependency_usages(repo_path, dep_name)
        affected_files, test_files, risk_level, explanation = BlastRadiusCalculator.compute_blast_radius(
            repo_path, dep_name, direct_files, file_snippets, evidence_list
        )

        # Index evidence into AWS OpenSearch
        opensearch_engine.index_repository_evidence(repo_path.name, evidence_list)

        # Execute Strands Impact Agent
        current_ver = "1.6.8"
        nodes = ManifestParser.parse_manifests(repo_path)
        for n in nodes:
            if n.name == dep_name:
                current_ver = n.version
                break

        report = impact_agent.investigate_impact(
            dep_name=dep_name,
            current_ver=current_ver,
            target_ver=req.target_version,
            risk_level=risk_level,
            risk_explanation=explanation,
            affected_files=affected_files,
            test_files=test_files,
            evidence=evidence_list
        )

        return report

    @staticmethod
    def investigate_archaeology(req: ArchaeologyRequest) -> ArchaeologyReport:
        repo_path, _, _ = AnalysisService._resolve_repo_path(req.repo_path)
        dep_name = req.dependency_name

        evidence_list, direct_files, _ = CodeAnalyzer.analyze_dependency_usages(repo_path, dep_name)
        
        report = GitArchaeologyAnalyzer.analyze_dependency_history(
            repo_path, dep_name, len(direct_files), evidence_list
        )

        # Enhance via Strands Archaeology Agent
        final_report = archaeology_agent.investigate_archaeology(report)
        return final_report
