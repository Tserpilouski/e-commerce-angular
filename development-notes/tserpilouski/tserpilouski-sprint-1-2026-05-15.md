# Sprint 1: Project Setup & Team Configuration — 2026-05-15

- **What was done:** Created the GitHub repository and initialized the Angular project. Added all teammates as collaborators. Installed and configured ESLint (`angular-eslint`), Prettier, Husky git hooks, lint-staged, and Commitlint to enforce a shared code quality baseline across the team.
- **Problems:** Aligning ESLint and Prettier without rule conflicts took extra time.
- **Solutions:** Added `eslint-config-prettier` as the last ESLint config entry to silence formatting conflicts.
- **What I learned:** Tooling configured at the repo level (Husky + lint-staged + Commitlint) removes the need for manual code-style enforcement violations are caught automatically at commit time. Setting this up in Sprint 1 saves the whole team time in every subsequent sprint.
- **Time spent:** 3 hours
