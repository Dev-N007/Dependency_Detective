import os
import re
from pathlib import Path
from typing import Dict, List, Set, Any, Tuple
from app.models.schemas import EvidenceItem

EXCLUDE_DIRS = {
    "node_modules", ".git", "venv", ".venv", "dist", "build", ".next",
    "__pycache__", ".pytest_cache", ".idea", ".vscode"
}

EXCLUDE_FILES = {
    ".env", ".env.local", ".env.production", "package-lock.json", "yarn.lock", "pnpm-lock.yaml"
}

SUPPORTED_EXTENSIONS = {".js", ".jsx", ".ts", ".tsx", ".py"}

class CodeAnalyzer:
    """Scans repository source files to locate dependency usages, imports, and symbol references."""

    @staticmethod
    def get_source_files(repo_path: Path) -> List[Path]:
        source_files = []
        for root, dirs, files in os.walk(repo_path):
            dirs[:] = [d for d in dirs if d not in EXCLUDE_DIRS]
            for file in files:
                if file in EXCLUDE_FILES or file.startswith(".env"):
                    continue
                ext = Path(file).suffix
                if ext in SUPPORTED_EXTENSIONS:
                    source_files.append(Path(root) / file)
        return source_files

    @staticmethod
    def analyze_dependency_usages(
        repo_path: Path, dep_name: str
    ) -> Tuple[List[EvidenceItem], Set[str], Dict[str, List[str]]]:
        """
        Returns:
        - List of EvidenceItem instances
        - Set of file paths importing or using the dependency directly
        - Dict mapping file path to list of detected call snippets
        """
        source_files = CodeAnalyzer.get_source_files(repo_path)
        evidence_list: List[EvidenceItem] = []
        direct_files: Set[str] = set()
        file_snippets_map: Dict[str, List[str]] = {}

        # Regex patterns for imports
        js_import_pattern = re.compile(rf"""(?:import\s+.*?from\s+['"]{re.escape(dep_name)}(?:/[^'"]*)?['"]|require\(['"]{re.escape(dep_name)}(?:/[^'"]*)?['"]\))""")
        py_import_pattern = re.compile(rf"""(?:import\s+{re.escape(dep_name)}|from\s+{re.escape(dep_name)}\s+import)""")

        # Call pattern
        symbol_call_pattern = re.compile(rf"""{re.escape(dep_name)}\.([a-zA-Z0-9_]+)""")

        for file_path in source_files:
            rel_path = str(file_path.relative_to(repo_path)).replace("\\", "/")
            try:
                with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
                    lines = f.readlines()
            except Exception:
                continue

            has_import = False
            file_calls: List[str] = []

            for i, line in enumerate(lines, 1):
                line_str = line.strip()
                if not line_str or line_str.startswith("//") or line_str.startswith("#"):
                    continue

                # Check import matches
                is_js_import = bool(js_import_pattern.search(line_str))
                is_py_import = bool(py_import_pattern.search(line_str))

                if is_js_import or is_py_import:
                    has_import = True
                    direct_files.add(rel_path)
                    
                    # Generate snippet context
                    start = max(0, i - 3)
                    end = min(len(lines), i + 2)
                    context_lines = [f"{idx} | {lines[idx-1].rstrip()}" for idx in range(start + 1, end + 1)]
                    snippet_context = "\n".join(context_lines)

                    evidence_list.append(
                        EvidenceItem(
                            id=f"ev_{rel_path}_{i}",
                            file_path=rel_path,
                            line_number=i,
                            line_content=line_str,
                            snippet_context=snippet_context,
                            evidence_type="import",
                            description=f"Direct import of package '{dep_name}'",
                        )
                    )

                # Check method calls / symbol references
                call_match = symbol_call_pattern.search(line_str)
                if call_match:
                    func_name = call_match.group(1)
                    call_expr = f"{dep_name}.{func_name}()"
                    if call_expr not in file_calls:
                        file_calls.append(call_expr)

                    if not has_import:
                        direct_files.add(rel_path)

                    start = max(0, i - 2)
                    end = min(len(lines), i + 2)
                    context_lines = [f"{idx} | {lines[idx-1].rstrip()}" for idx in range(start + 1, end + 1)]
                    snippet_context = "\n".join(context_lines)

                    evidence_list.append(
                        EvidenceItem(
                            id=f"ev_{rel_path}_{i}",
                            file_path=rel_path,
                            line_number=i,
                            line_content=line_str,
                            snippet_context=snippet_context,
                            evidence_type="call",
                            description=f"API usage of '{call_expr}'",
                        )
                    )

            if file_calls:
                file_snippets_map[rel_path] = file_calls

        return evidence_list, direct_files, file_snippets_map

    @staticmethod
    def build_internal_import_graph(repo_path: Path) -> Dict[str, Set[str]]:
        """
        Builds a dictionary mapping internal file path -> set of internal file paths that it imports.
        e.g., 'src/services/payment.ts' -> {'src/api/client.ts'}
        """
        source_files = CodeAnalyzer.get_source_files(repo_path)
        internal_graph: Dict[str, Set[str]] = {
            str(f.relative_to(repo_path)).replace("\\", "/"): set() for f in source_files
        }

        # Maps module base names / relative targets to relative path
        all_rel_paths = set(internal_graph.keys())

        rel_import_pattern = re.compile(r"""from\s+['"](\.[^'"]+)['"]|require\(['"](\.[^'"]+)['"]\)""")

        for file_path in source_files:
            rel_path = str(file_path.relative_to(repo_path)).replace("\\", "/")
            file_dir = file_path.parent

            try:
                with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
                    content = f.read()
            except Exception:
                continue

            matches = rel_import_pattern.findall(content)
            for m in matches:
                target_spec = m[0] or m[1]
                if not target_spec:
                    continue

                # Resolve relative path
                resolved_target = (file_dir / target_spec).resolve()
                try:
                    target_rel = str(resolved_target.relative_to(repo_path.resolve())).replace("\\", "/")
                except ValueError:
                    continue

                # Match against known source files (try appending .ts, .js, /index.ts, etc.)
                candidates = [
                    target_rel,
                    f"{target_rel}.ts",
                    f"{target_rel}.tsx",
                    f"{target_rel}.js",
                    f"{target_rel}.jsx",
                    f"{target_rel}/index.ts",
                    f"{target_rel}/index.js",
                ]

                for candidate in candidates:
                    if candidate in all_rel_paths:
                        internal_graph[rel_path].add(candidate)
                        break

        return internal_graph
