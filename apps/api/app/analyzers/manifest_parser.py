import json
import re
from pathlib import Path
from typing import Dict, List, Tuple
from app.models.schemas import DependencyNode, DependencyType, RiskLevel

class ManifestParser:
    """Parses manifest files (package.json, requirements.txt, pyproject.toml) to extract dependency specs."""

    @staticmethod
    def parse_manifests(repo_path: Path) -> List[DependencyNode]:
        nodes: Dict[str, DependencyNode] = {}

        # 1. Check package.json (Node.js / TS)
        pkg_path = repo_path / "package.json"
        if pkg_path.exists():
            try:
                with open(pkg_path, "r", encoding="utf-8") as f:
                    data = json.load(f)
                
                deps = data.get("dependencies", {})
                for name, ver in deps.items():
                    clean_ver = ver.lstrip("^~>=")
                    nodes[name] = DependencyNode(
                        id=f"npm:{name}",
                        name=name,
                        version=clean_ver,
                        ecosystem="npm",
                        dep_type=DependencyType.DIRECT,
                    )
                
                dev_deps = data.get("devDependencies", {})
                for name, ver in dev_deps.items():
                    clean_ver = ver.lstrip("^~>=")
                    nodes[name] = DependencyNode(
                        id=f"npm:{name}",
                        name=name,
                        version=clean_ver,
                        ecosystem="npm",
                        dep_type=DependencyType.DEV,
                    )
            except Exception as e:
                print(f"Error parsing package.json: {e}")

        # 2. Check requirements.txt (Python)
        req_path = repo_path / "requirements.txt"
        if req_path.exists():
            try:
                with open(req_path, "r", encoding="utf-8") as f:
                    lines = f.readlines()
                for line in lines:
                    line = line.strip()
                    if line and not line.startswith("#"):
                        parts = re.split(r"==|>=|<=|~=", line)
                        name = parts[0].strip()
                        ver = parts[1].strip() if len(parts) > 1 else "latest"
                        if name:
                            nodes[name] = DependencyNode(
                                id=f"pypi:{name}",
                                name=name,
                                version=ver,
                                ecosystem="pypi",
                                dep_type=DependencyType.DIRECT,
                            )
            except Exception as e:
                print(f"Error parsing requirements.txt: {e}")

        # 3. Check pyproject.toml (Python)
        pyproj_path = repo_path / "pyproject.toml"
        if pyproj_path.exists():
            try:
                with open(pyproj_path, "r", encoding="utf-8") as f:
                    content = f.read()
                # Simple regex match for pyproject dependencies
                matches = re.findall(r'([a-zA-Z0-9_\-]+)\s*=\s*"([^"]+)"', content)
                for name, ver in matches:
                    if name not in ("name", "version", "description", "authors", "readme"):
                        clean_ver = ver.lstrip("^~>=")
                        nodes[name] = DependencyNode(
                            id=f"pypi:{name}",
                            name=name,
                            version=clean_ver,
                            ecosystem="pypi",
                            dep_type=DependencyType.DIRECT,
                        )
            except Exception as e:
                print(f"Error parsing pyproject.toml: {e}")

        return list(nodes.values())
