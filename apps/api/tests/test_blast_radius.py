import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from app.analyzers.code_analyzer import CodeAnalyzer
from app.analyzers.blast_radius import BlastRadiusCalculator
from app.config import DEMO_REPO_PATH

def test_blast_radius_axios():
    evidence, direct_files, file_snippets = CodeAnalyzer.analyze_dependency_usages(DEMO_REPO_PATH, "axios")
    affected_files, test_files, risk_level, explanation = BlastRadiusCalculator.compute_blast_radius(
        DEMO_REPO_PATH, "axios", direct_files, file_snippets, evidence
    )
    assert len(affected_files) >= len(direct_files)
    assert len(test_files) >= 1
    assert risk_level in ("MEDIUM", "HIGH")
