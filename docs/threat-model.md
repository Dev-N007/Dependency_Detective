# Threat Model & Security Controls

## Security Philosophy

> **Treat analyzed codebase content as untrusted input. NEVER execute repository source code during analysis.**

---

## Identified Threats & Countermeasures

| Threat | Risk Level | Countermeasure |
| :--- | :--- | :--- |
| **Arbitrary Code Execution via Repo Parsing** | High | Static analysis uses AST & regex parsers only. No build scripts or code files are ever evaluated (`eval`, `exec`, `importlib`). |
| **Path Traversal Attacks** | High | All file paths are sanitized and validated to remain strictly bounded within `repo_path.resolve()`. |
| **Prompt Injection in Code Snippets** | Medium | Code snippets passed to Strands agents are wrapped in rigid schema parameters and evaluated via structured JSON constraints. |
| **Secret Leakage in Evidence Snippets** | Medium | Excludes `.env`, `credentials`, `private.key`, and certificate files during directory traversal. |
