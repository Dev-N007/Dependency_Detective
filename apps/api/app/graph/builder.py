from pathlib import Path
from typing import List, Dict, Set
from app.models.schemas import DependencyGraph, DependencyNode, GraphEdge, RiskLevel
from app.analyzers.manifest_parser import ManifestParser
from app.analyzers.code_analyzer import CodeAnalyzer
from app.analyzers.blast_radius import BlastRadiusCalculator

class GraphBuilder:
    """Constructs the repository dependency graph with nodes and directed edges."""

    @staticmethod
    def build_graph(repo_path: Path) -> DependencyGraph:
        nodes = ManifestParser.parse_manifests(repo_path)
        edges: List[GraphEdge] = []

        for node in nodes:
            evidence_list, direct_files, file_snippets = CodeAnalyzer.analyze_dependency_usages(repo_path, node.name)
            affected_file_usages, test_files, risk_level, _ = BlastRadiusCalculator.compute_blast_radius(
                repo_path, node.name, direct_files, file_snippets, evidence_list
            )

            node.usages_count = len(evidence_list)
            node.direct_dependents_count = len(direct_files)
            node.transitive_dependents_count = max(0, len(affected_file_usages) - len(direct_files))
            node.risk_level = risk_level
            node.is_removable = (node.usages_count <= 2)

            # Create edges from file usages to dependency node
            for f_usage in affected_file_usages:
                edges.append(
                    GraphEdge(
                        source=f_usage.file_path,
                        target=node.id,
                        relationship="imports" if f_usage.usage_level == "HIGH" else "transitively_depends"
                    )
                )

        return DependencyGraph(nodes=nodes, edges=edges)
