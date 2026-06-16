# Sprint 3: Standardizing Import Structure, Contribution Guide & ESLint Rules — 2026-06-13

- **What was done:**
  - Standardized the project's import system by implementing absolute path aliases (`@app`, `@core`, `@models`, `@pages`, `@services`, `@shared`) to map to root directories in `tsconfig.json`.
  - Refactored relative parent imports (`../`, `../../`) to use these path aliases across components, services, and models. **Used AI to automate file name standardizations, refactoring imports, and resolving typescript path errors.**
  - Created a consolidated `CONTRIBUTING.md` developer guide documenting imports, file naming conventions, branch naming strategy (`[type]/[developer]/[issue-id]`), commit message rules (`[type]: [developer]#[issue-id] [description]`), and environment variable configurations.
  - Enforced absolute path imports by configuring the `no-restricted-imports` rule in `eslint.config.js` to prevent relative parent imports.
  - Cleaned up the project by removing broken/redundant spec files (`logo.spec.ts`) and referencing the new contribution guide in the root `README.md`.
  - Added environment variable documentation and debugging guidelines to help resolve production issues related to missing build-time configurations.

- **Problems:**
  - Manually refactoring relative parent paths in a large codebase is tedious and highly error-prone.
  - Ensuring new code contributions adhere to strict import conventions without automated linting leads to configuration drift.
  - Experienced a production deployment bug where the application loaded with undefined API configuration. Because it is a static SPA, environment variables must be present at build time, and missing GitHub Secrets during compilation led to runtime failures.

- **Solutions:**
  - **Leveraged AI code assistance** to safely rename files, refactor imports in bulk, and resolve compilation and linter errors.
  - Configured ESLint (`eslint.config.js`) to reject any import matching `../*`, preventing regression at commit/CI stage.
  - Ensured the build job in `.github/workflows/deploy.yml` has access to the Commercetools `NG_APP_*` secrets at build time, and documented these debug steps in the contribution guide to prevent future production outages.

- **What I learned:**
  - **Strict path boundaries simplify onboarding** and make moving files between folders trivial since absolute paths do not break on relocation.
  - Automating architectural rules with ESLint is far more reliable than relying solely on documentation.
  - **Environment variables in SPAs are baked-in at compilation.** Statically served applications cannot read runtime environment variables from the host OS; all `NG_APP_` variables must be injected during the build step on the CI runner.

- **Time spent:** 2h
