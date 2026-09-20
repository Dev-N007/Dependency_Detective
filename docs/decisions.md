# Architecture Decision Records (ADRs)

### ADR-001: Deterministic Analysis First, AI Reasoning Second
- **Status**: Accepted
- **Context**: Developers do not trust AI chatbots that guess file paths or hallucinate breaking changes.
- **Decision**: All line numbers, import locations, function calls, and Git history must be gathered deterministically via AST and Git parsers before invoking AI agents.
- **Consequences**: Zero hallucinated file paths; 100% evidence-grounded reports.

---

### ADR-002: Selection of AWS Strands Agents SDK
- **Status**: Accepted
- **Context**: The Build It track requires meaningful integration of AWS open-source frameworks.
- **Decision**: Adopt Strands Agents SDK to orchestrate Impact, Archaeology, and Migration tools.

---

### ADR-003: Selection of AWS OpenSearch as Local Evidence Engine
- **Status**: Accepted
- **Context**: Codebases contain thousands of lines of source code; dumping entire repos into LLM contexts is slow and expensive.
- **Decision**: Index AST snippets and commit messages into OpenSearch for precise document search and evidence retrieval.

---

### ADR-004: Local-First Privacy Model
- **Status**: Accepted
- **Context**: Developers cannot upload proprietary corporate codebase source code to third-party SaaS servers.
- **Decision**: All parsers, OpenSearch indices, and Finch containers run 100% locally on the developer machine.

---

### ADR-005: Technology Stack (Python + TypeScript / React)
- **Status**: Accepted
- **Context**: Backend analysis, AST parsing, Git inspection, and AI frameworks excel in Python. Modern interactive web graphs excel in React/TypeScript.
- **Decision**: FastAPI (Python) backend + Vite/React (TypeScript) frontend connected over clean REST APIs.

---

### ADR-006: Primary Ecosystem Focus (JavaScript/TypeScript + Python)
- **Status**: Accepted
- **Context**: Supporting 20 programming languages shallowly yields poor AST precision.
- **Decision**: Provide deep AST usage analysis for JS/TS (`package.json`, `package-lock.json`) and Python (`requirements.txt`, `pyproject.toml`).
