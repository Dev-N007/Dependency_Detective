import sys
from pathlib import Path
from fastapi.testclient import TestClient

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from main import app

client = TestClient(app)

def test_root_endpoint():
    res = client.get("/")
    assert res.status_code == 200
    assert res.json()["status"] == "online"

def test_demo_repository_endpoint():
    res = client.get("/api/repositories/demo")
    assert res.status_code == 200
    data = res.json()
    assert data["repo_name"] == "demo-repository"
    assert data["stats"]["total_dependencies"] > 0

def test_investigate_impact_endpoint():
    res = client.post(
        "/api/investigations/impact",
        json={
            "repo_path": str(Path("demo-repository").resolve()),
            "dependency_name": "axios",
            "current_version": "1.6.8",
            "target_version": "1.8.4"
        }
    )
    assert res.status_code == 200
    data = res.json()
    assert data["dependency_name"] == "axios"
    assert len(data["evidence"]) > 0
    assert len(data["recommended_actions"]) > 0

def test_investigate_archaeology_endpoint():
    res = client.post(
        "/api/investigations/archaeology",
        json={
            "repo_path": str(Path("demo-repository").resolve()),
            "dependency_name": "lodash"
        }
    )
    assert res.status_code == 200
    data = res.json()
    assert data["dependency_name"] == "lodash"
    assert len(data["timeline"]) > 0
