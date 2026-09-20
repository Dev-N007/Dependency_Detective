import sys
from pathlib import Path

# Add app to import path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from app.analyzers.manifest_parser import ManifestParser
from app.config import DEMO_REPO_PATH

def test_parse_demo_manifests():
    nodes = ManifestParser.parse_manifests(DEMO_REPO_PATH)
    names = [n.name for n in nodes]
    assert "axios" in names
    assert "lodash" in names
    assert "requests" in names
    assert "pydantic" in names
