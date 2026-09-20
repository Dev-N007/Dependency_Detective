import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from app.analyzers.code_analyzer import CodeAnalyzer
from app.config import DEMO_REPO_PATH

def test_analyze_axios_usages():
    evidence, direct_files, file_snippets = CodeAnalyzer.analyze_dependency_usages(DEMO_REPO_PATH, "axios")
    assert len(evidence) > 0
    assert any("src/api/client.ts" in f for f in direct_files)
    assert any("src/services/payment.ts" in f for f in direct_files)

def test_analyze_lodash_usages():
    evidence, direct_files, file_snippets = CodeAnalyzer.analyze_dependency_usages(DEMO_REPO_PATH, "lodash")
    assert len(evidence) > 0
    assert any("src/services/search.ts" in f for f in direct_files)
