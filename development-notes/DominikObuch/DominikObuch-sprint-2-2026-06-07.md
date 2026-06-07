# Sprint 3: Authentication, Shared UI, Route Lazy Loading & Guards — 2026-06-07

- **What was done:**
  - Developed a functional route guard (`guestGuard` in `src/app/guards/guest.guard.ts`) to manage page access by redirecting authenticated users back to the homepage.
  - Implemented the login system by developing the `LoginComponent` subview (using custom input components).
  - Configured Route Lazy Loading (lazy-loaded routing) in `app.routes.ts` for authentication paths (`/login`, `/register`) and product details (`/product/:key`).
  - Designed and implemented the modular authentication wrapper component (`AuthComponent`) with a splitscreen layout.
  - Created a universal tab-bar component (`<ec-tabs>`) controlled by a dynamic `TabOption` model to swap active subviews.
  - Integrated `AuthService` state management using Signals (`currentUser` and `isAuthenticated` computed signal) for login and registration, and implemented fallback mock responses to test authentication locally.
  - Set up inline form error alerts on login/registration failures instead of redirecting the user away.
  - Added unit test cases for the tabs system, logo, and the `guestGuard` (using Vitest and mock injections).

- **Problems:**

  **1. TypeScript compilation errors with `TestBed.runInContext`**

  Testing functional guards requires simulating Angular's dependency injection context. Calling `TestBed.runInContext` failed to compile because the API has been renamed in modern Angular releases.

- **Solutions:**

  **1. Injection Context Execution**

  Swapped the testing call to `TestBed.runInInjectionContext` which correctly executes the functional guard logic while resolving its `inject()` calls.

- **What I learned:**
  - **Functional guards simplify codebases.** Using CanActivate Fn definitions with `inject()` dramatically reduces class boilerplate and coordinates cleanly with lazy-loaded standalone routing.
  - **Dynamic imports define physical chunk boundaries.** Configuring routes via `loadComponent` tells the compiler to output distinct JS chunks (e.g. `chunk-auth.js`), lowering the size of the initial entry bundle (`main.js`).
  - **Testing functional APIs requires injection simulation.** Because functional guards fetch dependencies via runtime context injection, they must be tested inside a simulated injection context using `TestBed.runInInjectionContext`.

- **Time spent:** 6h
