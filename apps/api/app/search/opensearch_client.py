from typing import List, Dict, Any, Optional
try:
    from opensearchpy import OpenSearch
    HAS_OPENSEARCH_LIB = True
except ImportError:
    OpenSearch = Any
    HAS_OPENSEARCH_LIB = False
from app.config import OPENSEARCH_HOST, OPENSEARCH_PORT, OPENSEARCH_USER, OPENSEARCH_PASSWORD, USE_OPENSEARCH
from app.models.schemas import EvidenceItem

class OpenSearchEvidenceEngine:
    """
    AWS OpenSearch local evidence/search layer.
    Indexes repository source code, AST usages, and Git commits.
    Includes a built-in in-memory evidence index fallback for offline local runs.
    """

    def __init__(self):
        self.is_connected = False
        self.client: Optional[OpenSearch] = None
        self.in_memory_evidence: List[Dict[str, Any]] = []

        if USE_OPENSEARCH:
            try:
                self.client = OpenSearch(
                    hosts=[{"host": OPENSEARCH_HOST, "port": OPENSEARCH_PORT}],
                    http_auth=(OPENSEARCH_USER, OPENSEARCH_PASSWORD),
                    use_ssl=False,
                    verify_certs=False,
                    ssl_show_warn=False,
                    timeout=2,
                )
                info = self.client.info()
                self.is_connected = True
                print(f"[AWS OpenSearch] Connected successfully. Version: {info.get('version', {}).get('number')}")
            except Exception as e:
                print(f"[AWS OpenSearch] Cluster unavailable ({e}). Falling back to in-memory local evidence engine.")
                self.is_connected = False

    def index_repository_evidence(self, repo_id: str, evidence_items: List[EvidenceItem]):
        """Indexes code usages and evidence items into OpenSearch or local memory."""
        self.in_memory_evidence = [
            {
                "repo_id": repo_id,
                "id": ev.id,
                "file_path": ev.file_path,
                "line_number": ev.line_number,
                "line_content": ev.line_content,
                "snippet_context": ev.snippet_context,
                "evidence_type": ev.evidence_type,
                "description": ev.description,
            }
            for ev in evidence_items
        ]

        if self.is_connected and self.client:
            try:
                index_name = f"dd-evidence-{repo_id.lower().replace('/', '-')}"
                if not self.client.indices.exists(index=index_name):
                    self.client.indices.create(
                        index=index_name,
                        body={
                            "mappings": {
                                "properties": {
                                    "file_path": {"type": "keyword"},
                                    "line_content": {"type": "text"},
                                    "description": {"type": "text"},
                                    "evidence_type": {"type": "keyword"},
                                }
                            }
                        },
                    )

                for doc in self.in_memory_evidence:
                    self.client.index(index=index_name, id=doc["id"], body=doc)
            except Exception as e:
                print(f"[AWS OpenSearch] Error indexing documents: {e}")

    def search_evidence(self, query: str, limit: int = 10) -> List[Dict[str, Any]]:
        """Performs precise evidence retrieval across indexed codebase snippets."""
        if self.is_connected and self.client:
            try:
                res = self.client.search(
                    body={
                        "query": {
                            "multi_match": {
                                "query": query,
                                "fields": ["line_content^2", "description", "file_path"],
                            }
                        },
                        "size": limit,
                    }
                )
                hits = res.get("hits", {}).get("hits", [])
                return [h["_source"] for h in hits]
            except Exception as e:
                print(f"[AWS OpenSearch] Search error: {e}")

        # In-memory fallback search
        q_lower = query.lower()
        results = []
        for doc in self.in_memory_evidence:
            if (
                q_lower in doc["line_content"].lower()
                or q_lower in doc["file_path"].lower()
                or q_lower in doc["description"].lower()
            ):
                results.append(doc)
            if len(results) >= limit:
                break
        return results

opensearch_engine = OpenSearchEvidenceEngine()
