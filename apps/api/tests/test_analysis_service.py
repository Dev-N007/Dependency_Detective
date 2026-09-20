import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from app.services.analysis_service import AnalysisService

def test_resolve_local_and_demo():
    path, is_remote, remote_url = AnalysisService._resolve_repo_path(None)
    assert path.exists()
    assert is_remote is False
    assert remote_url is None

def test_resolve_remote_url_detection():
    path, is_remote, remote_url = AnalysisService._resolve_repo_path("expressjs/express")
    assert is_remote is True
    assert remote_url == "https://github.com/expressjs/express.git"

