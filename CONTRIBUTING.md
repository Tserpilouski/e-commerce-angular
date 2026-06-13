# Contribution Guide

Welcome to the `e-commerce-angular` project! Below are the key coding standards and practices for contributing to this codebase.

## Import Path Aliases

To prevent production build failures and ensure clean code resolution, **relative parent imports (`../*`) are disabled**. Always use the configured path aliases:

- `@core/*` &rarr; Core modules, route guards, interceptors (`src/app/core/*`)
- `@models/*` &rarr; TypeScript models/types (`src/app/models/*`)
- `@pages/*` &rarr; Page-level components (`src/app/pages/*`)
- `@services/*` &rarr; Injectable API/business logic services (`src/app/services/*`)
- `@shared/*` &rarr; Shared components, pipes, directives (`src/app/shared/*`)
- `@app/*` &rarr; Application root (`src/app/*`)

_Note: Sibling/child relative imports (`./`) are allowed. Parent imports are blocked by ESLint._

## File Naming Conventions

When creating new files, adhere to the following naming conventions based on the file type:

- **Components**: `[name].component.ts` (e.g., `login.component.ts`)
- **Services**: `[name].service.ts` (e.g., `auth.service.ts`)
- **Guards**: `[name].guard.ts` (e.g., `guest.guard.ts`)
- **Models**: `[name].model.ts` (e.g., `product.model.ts`)

## Git Branching Strategy

We use a structured naming convention for branches:
`[type]/[developer-name]/[issue-id]`

- **Type**: `feat`, `fix`, `chore`, `docs`, `refactor`, `style`, `test`
- **Developer Name**: The developer's first name in lowercase (e.g., `dominik`, `vlad`, `kiryl`)
- **Issue ID**: The issue key from the project board (e.g., `EPAM-48`, `EPAM-26`, `EPAM-7`)

_Examples:_

- `feat/dominik/EPAM-44`
- `fix/dominik/EPAM-48`
- `feat/vlad/EPAM-26`

## Commit Message Conventions

Commit messages (comments) follow Conventional Commits and should include the developer's username and the issue ID where applicable:
`[type]: [developer-username]#[issue-id] [description]`

- **Developer Username**: `dominik`, `kiryl`, `vladsklemapl`
- **Examples**:
  - `feat: dominik#EPAM-45 added login registration`
  - `feat: kiryl#EPAM-7 add header component`
  - `feat: vladsklemapl#EPAM-26 add home page`
  - `docs: kiryl add development notes`
  - `fix: sync package-lock.json and remove duplicate selector`

## Verification Checks

Before submitting a pull request, ensure all verification checks pass locally:

1. **Linting**: `npm run lint` (checks code quality rules)
2. **Testing**: `npm run test -- --watch=false` (executes all Vitest unit tests)
3. **Build**: `npm run build` (verifies production compilation)
