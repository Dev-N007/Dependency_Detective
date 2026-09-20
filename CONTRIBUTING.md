# Contributing to Dependency Detective

Thank you for your interest in contributing to **Dependency Detective**!

## Development Setup

1. Clone repository:
   ```bash
   git clone https://github.com/your-org/dependency-detective.git
   cd dependency-detective
   ```

2. Backend Development:
   ```bash
   cd apps/api
   pip install -r requirements.txt
   python -m pytest tests
   python main.py
   ```

3. Frontend Development:
   ```bash
   cd apps/web
   npm install
   npm run dev
   ```

4. Code Style & Verification:
   - Ensure all `pytest` unit tests pass.
   - Run `npm run build` in `apps/web` to verify TypeScript type checking.
