# Sprint 2: CI/CD with GitHub Actions — 2026-06-07

- **What was done:**
  Set up two GitHub Actions workflows from scratch. The first one is a CI pipeline that runs on every pull request to `main` and `dev` it installs dependencies, checks linting and formatting, builds the project, and runs the test suite. The second workflow handles automatic deployment to GitHub Pages whenever a commit lands on `main`.

  Also built two presentational components `ec-header` and `ec-footer`. Header has a logo, navigation links with active state highlighting, and action buttons. Footer has link columns, a newsletter subscription form, and a bottom bar with payment badges. Both components are straightforward, no services, no async logic, just templates and styles. Covered both with unit tests. No real blockers on either of them.

- **Problems:**

  **1. Had no idea where to start**

  Before this task I had never touched GitHub Actions at all. I knew CI/CD existed and roughly what it does, but had zero practical experience writing workflows. So the first thing I did was open the GitHub Actions documentation and just start reading. It took some time to understand the basic concepts what a workflow file is, how jobs and steps work, what `on:` triggers mean, and how the `actions/checkout` and `actions/setup-node` actions work. The docs are actually pretty good once you get past the initial terminology overload.

  **2. Node.js version mismatch**

  The first run on the CI runner failed because the Node version it picked didn't match what we use locally. The fix was straightforward once I found it instead of hardcoding a version number in the workflow, I pointed `actions/setup-node` to read from `.nvmrc`. That way the CI always uses the same Node version as the local environment, and there's no need to update the workflow file every time we bump Node.

  **3. Tests were failing during the CI run**

  The `npm test` command by default starts Vitest in watch mode, which just hangs forever in a non-interactive environment. Had to figure out that you need to pass `--watch=false` to make it exit after running. Also had some pre-existing test failures unrelated to CI that I had to fix first before the pipeline could go green.

  **4. GitHub Pages deployment needed a base href**

  The app was building fine but all assets 404'd when opened from the GitHub Pages URL. The root cause was that the app was being served from a subpath (`/e-commerce-angular/`) but Angular's router and asset paths assumed it was served from `/`. Had to pass `--base-href /e-commerce-angular/` to the build command, which Angular uses to prefix all internal links and asset paths.

- **Solutions:**
  - Read the GitHub Actions docs start to finish before writing a single line of YAML helped a lot to understand the structure before trying to do anything
  - Used `node-version-file: .nvmrc` in `actions/setup-node` to sync Node versions between CI and local
  - Added `-- --watch=false` to the test command so it exits cleanly in CI
  - Fixed the failing tests locally before pushing so the pipeline wasn't blocked on unrelated issues
  - Added `--base-href` flag to the build step for GitHub Pages

- **What I learned:**
  GitHub Actions is not that scary once you understand that a workflow is just a list of shell commands with some metadata on top. The hardest part was the initial mental model once I understood what jobs, steps, and runners actually are, the rest clicked pretty quickly. The biggest practical takeaway is that CI environments are stateless and non-interactive, so anything that works locally because of assumptions about the environment (watch mode, cached node modules, local `.env` files) will break in CI and needs to be handled explicitly. Also learned that GitHub Pages has its own quirks around base paths and permissions that are completely separate from just deploying a static site.

- **Time spent:** 4h
