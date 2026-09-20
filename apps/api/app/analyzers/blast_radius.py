import networkx as nx
from pathlib import Path
from typing import Dict, List, Set, Tuple
from app.models.schemas import FileUsage, RiskLevel, EvidenceItem
from app.analyzers.code_analyzer import CodeAnalyzer

class BlastRadiusCalculator:
    """Calculates blast radius (direct & transitive dependents), test file impact, and risk levels."""

    @staticmethod
    def compute_blast_radius(
        repo_path: Path,
        dep_name: str,
        direct_files: Set[str],
        file_snippets: Dict[str, List[str]],
        evidence_list: List[EvidenceItem]
    ) -> Tuple[List[FileUsage], List[str], RiskLevel, str]:
        
        internal_graph_dict = CodeAnalyzer.build_internal_import_graph(repo_path)
        
        # Build NetworkX directed graph: edge (A -> B) means file A imports file B
        G = nx.DiGraph()
        for file_a, imports_b in internal_graph_dict.items():
            G.add_node(file_a)
            for file_b in imports_b:
                G.add_edge(file_a, file_b)

        # Transitive dependents: any file A that can reach a file in direct_files via directed paths A -> ... -> D
        # Or in reverse graph, nodes reachable from direct_files in G_reversed
        G_rev = G.reverse(copy=True)

        transitive_files: Set[str] = set()
        for d_file in direct_files:
            if d_file in G_rev:
                reachable = nx.descendants(G_rev, d_file)
                transitive_files.update(reachable)

        # Remove direct files from transitive set to avoid double counting
        transitive_files = transitive_files - direct_files

        # Identify test files in total affected files
        all_affected = direct_files.union(transitive_files)
        test_files: List[str] = []
        for f in all_affected:
            lower_f = f.lower()
            if "test" in lower_f or "spec" in lower_f:
                test_files.append(f)

        # Build FileUsage list
        affected_file_usages: List[FileUsage] = []
        
        for d_file in direct_files:
            is_test = d_file in test_files
            snippets = file_snippets.get(d_file, [])
            affected_file_usages.append(
                FileUsage(
                    file_path=d_file,
                    usage_level="HIGH",
                    import_count=sum(1 for e in evidence_list if e.file_path == d_file and e.evidence_type == "import"),
                    call_snippets=snippets,
                    is_test_file=is_test
                )
            )

        for t_file in transitive_files:
            is_test = t_file in test_files
            affected_file_usages.append(
                FileUsage(
                    file_path=t_file,
                    usage_level="MEDIUM" if not is_test else "LOW",
                    import_count=0,
                    call_snippets=[],
                    is_test_file=is_test
                )
            )

        # Calculate explainable risk level
        direct_count = len(direct_files)
        transitive_count = len(transitive_files)
        total_call_sites = sum(len(snips) for snips in file_snippets.values())

        if direct_count >= 3 or transitive_count >= 5 or total_call_sites >= 4:
            risk_level = RiskLevel.HIGH
            explanation = (
                f"High impact detected: {direct_count} direct source files, "
                f"{transitive_count} transitive files, and {total_call_sites} API usage sites touch '{dep_name}'."
            )
        elif direct_count >= 1 or transitive_count >= 1:
            risk_level = RiskLevel.MEDIUM
            explanation = (
                f"Medium impact: {direct_count} direct source files and {transitive_count} "
                f"transitive dependents touch '{dep_name}' across the codebase."
            )
        else:
            risk_level = RiskLevel.LOW
            explanation = f"Low impact: No active source code usage was detected for '{dep_name}'."

        return affected_file_usages, test_files, risk_level, explanation
