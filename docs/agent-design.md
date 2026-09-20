# Agent Design: AWS Strands Agents SDK

Dependency Detective integrates the **AWS Strands Agents SDK** to orchestrate agentic reasoning over structured code evidence.

---

## Why Agents?

Traditional static analysis tools spit out raw arrays of file paths. LLMs without tool grounding hallucinate imports and file paths.

Strands agents act as specialized investigators that consume deterministic evidence and structure it into actionable developer recommendations.

---

## Agent Roles & Tool Specifications

### 1. Impact Agent
- **Answers**: *"What could be affected if I change this dependency?"*
- **Registered Tools**:
  - `get_dependency()`: Retrieves target package manifest details.
  - `get_dependents()`: Queries direct and transitive dependent files.
  - `find_imports()`: Locates import statements.
  - `find_usages()`: Locates API method call expressions.
  - `get_blast_radius()`: Runs NetworkX graph reachability traversal.
  - `find_related_tests()`: Filters reachable test files.

### 2. Archaeology Agent
- **Answers**: *"Why does this dependency exist in this codebase?"*
- **Registered Tools**:
  - `git_log()`: Fetches commit history.
  - `git_blame()`: Line-level author blame.
  - `find_introduction_commit()`: Identifies manifest introduction commit hash.
  - `find_historical_usage()`: Tracks usage shifts across commits.

### 3. Migration Agent
- **Answers**: *"What specific review steps must the developer perform?"*
- **Registered Tools**:
  - `get_change_evidence()`: Extracts snippet context.
  - `get_usage_patterns()`: Categorizes high vs medium impact entrypoints.

---

## Grounding & Fallback Architecture

To guarantee zero hallucination:
1. Agents are fed Pydantic-validated evidence output produced by static AST analysis.
2. If external LLM model endpoints are offline or unconfigured, agents execute deterministic fallback logic that populates structured reports using evidence facts.
