# 🎬 3-Minute Recorded Demo Script — Dependency Detective

**Target Duration**: 3:00  
**Hackathon Track**: First Commit Hackathon 2026 — Build It Track

---

## ⏱️ Timeline & Narration Script

### 0:00 – 0:20 | The Problem
*(Screen shows developer changing `axios` version in `package.json`)*
> "Every day, software developers change package versions or remove dependencies without knowing what will actually break inside their codebase. Existing tools tell you CVE vulnerabilities or outdated version numbers, but they don't answer: *What will happen to MY codebase if I change this dependency?*"

### 0:20 – 0:40 | Introducing Dependency Detective
*(Screen cuts to Dependency Detective cyber-forensics dashboard with bundled PayStream Core demo repository loaded)*
> "Meet **Dependency Detective**. Investigate the impact before you change the dependency. Powered by AWS OpenSource technologies—Strands Agents SDK, OpenSearch, and Finch—it combines AST source analysis, Git history archaeology, and evidence-grounded AI."

### 0:40 – 1:05 | Interactive Dependency Graph
*(Cursor moves across package grid cards, filtering direct vs transitive dependencies, clicking `axios`)*
> "Here we see our repository's 47 dependencies. We select `axios`. Instantly, Dependency Detective highlights our codebase reach: 3 direct files, 7 transitive files, and 4 affected test suites."

### 1:05 – 1:40 | Hero Feature A — WHAT IF?
*(Click `[WHAT IF I CHANGE THIS?]` button. Screen opens Change Investigation view with HIGH IMPACT badge)*
> "Let's click **WHAT IF?**. The Strands Impact Agent evaluates upgrading `axios` from `1.6.8` to `1.8.4`. It calculates a HIGH impact blast radius, pinpoints `src/api/client.ts` request interceptors, and highlights 4 test suites to review. Every conclusion includes expandable, line-level source code evidence."

### 1:40 – 2:15 | Hero Feature B — DEPENDENCY ARCHAEOLOGY
*(Click `[WHY IS THIS HERE?]` button for `lodash`)*
> "Now let's ask: **WHY IS THIS HERE?**. Clicking Git Archaeology triggers the Strands Archaeology Agent. It inspects commit history to reveal commit `6e26755` by PayStream Core Team, introducing `lodash` for search input debouncing. It identifies only 2 active usages today—reaching a high-confidence verdict that `lodash` is potentially removable."

### 2:15 – 2:40 | AWS OpenSource Stack Architecture
*(Show architecture diagram slide / AWS badges)*
> "Under the hood, deterministic AST parsers establish line-level facts first. AWS OpenSearch indexes files, code snippets, and Git commits. The AWS Strands Agents SDK orchestrates specialized Impact and Archaeology agents to deliver zero-hallucination analysis. And Finch provides a 100% reproducible local container environment."

### 2:40 – 3:00 | Conclusion & CTA
> "**Dependency Detective**: Don't just update dependencies. Investigate them. Open-source, local-first, evidence-driven."
