# AWS Open Source Technology Integration

Dependency Detective relies on three core AWS open-source technologies to power local agentic analysis, evidence search, and reproducible container environments.

---

## Breakdown Table

| AWS Technology | Purpose | Where Used | Why Selected | Alternative Considered |
| :--- | :--- | :--- | :--- | :--- |
| **Strands Agents SDK** | Orchestrates agent tools & evidence-grounded reasoning | [`apps/api/app/agents/strands_agents.py`](file:///d:/Projects/Dependency_Detective/apps/api/app/agents/strands_agents.py) | Python-native agent framework designed for tool-based evidence orchestration. | LangChain (too bloated for local-first tool grounding). |
| **OpenSearch** | Local searchable evidence index for code snippets & git logs | [`apps/api/app/search/opensearch_client.py`](file:///d:/Projects/Dependency_Detective/apps/api/app/search/opensearch_client.py) | Full-text search engine optimized for indexing multi-field code & commit documents. | SQLite (lacks multi-field snippet scoring). |
| **Finch** | Container engine & reproducible local environment | [`infra/finch/finch-compose.yml`](file:///d:/Projects/Dependency_Detective/infra/finch/finch-compose.yml) | Open-source client for container development on local workstations. | Kubernetes (overly complex for desktop developer tool). |

---

## 1. AWS Strands Agents SDK

Strands agents receive structured code facts extracted by deterministic AST parsers and orchestrate tool execution to generate validated investigation reports.

## 2. AWS OpenSearch

Repository source files, symbol usages, and commit messages are indexed into OpenSearch. When the AI agent or developer queries evidence, OpenSearch retrieves exact line snippets without dumping full files into LLM prompts.

## 3. AWS Finch

Finch manages containerized services (`dd-opensearch`, `dd-api`, `dd-web`) via `finch-compose.yml`, ensuring consistent local setup across clean workstations.
