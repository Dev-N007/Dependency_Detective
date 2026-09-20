import os
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

BASE_DIR = Path(__file__).resolve().parent.parent
WORKSPACE_DIR = BASE_DIR.parent.parent
DEMO_REPO_PATH = WORKSPACE_DIR / "demo-repository"

OPENSEARCH_HOST = os.getenv("OPENSEARCH_HOST", "localhost")
OPENSEARCH_PORT = int(os.getenv("OPENSEARCH_PORT", "9200"))
OPENSEARCH_USER = os.getenv("OPENSEARCH_USER", "admin")
OPENSEARCH_PASSWORD = os.getenv("OPENSEARCH_PASSWORD", "admin")
USE_OPENSEARCH = os.getenv("USE_OPENSEARCH", "true").lower() in ("true", "1", "yes")

STRANDS_MODEL_NAME = os.getenv("STRANDS_MODEL_NAME", "anthropic.claude-3-5-sonnet-20240620-v1:0")
AWS_REGION = os.getenv("AWS_REGION", "us-east-1")
