# Privacy & Local Security Model

Dependency Detective is engineered from the ground up as a **local-first developer tool**.

---

## 🔒 Data Flow Privacy Guarantees

1. **Zero Cloud Uploads**: Source code files, AST representations, and Git commit logs are never uploaded to remote servers by default.
2. **Local Indexing**: AWS OpenSearch indices operate locally inside containerized or localhost environments.
3. **Secret Exclusions**: The analysis engine automatically excludes sensitive files and directories:
   - `.env`, `.env.*`
   - `*.pem`, `*.key`
   - `credentials*`, `secrets*`
   - `node_modules/`, `venv/`, `.git/`
4. **Local LLM Compatibility**: Fully supports local model runtimes (such as Ollama or local Bedrock proxies), allowing 100% offline agentic reasoning.
