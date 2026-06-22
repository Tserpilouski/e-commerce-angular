# Sprint 3: 404 Page & Global Toast Component — 2026-06-22

- **What was done:**
  - Built the `NotFoundComponent` (`ec-not-found`) as a standalone lazy-loaded page registered on the `**` wildcard route in `app.routes.ts`. The page shows a custom image, a heading, a short message, and an `ec-button` that navigates back to the home route via `RouterLink`.
  - Built a global `ToastComponent` (`ec-toast`) and a companion `ToastService`. The service uses Angular's `signal` API to hold an array of active toasts and exposes `show(type, message, duration?)` and `remove(id)` methods. Each toast is uniquely identified by a `Symbol` so removal is always O(1) with no index collisions. When a `duration` is provided the service auto-removes the toast via `setTimeout`. The component is mounted once in `app.html` so it is always rendered on top of all pages without any per-page wiring.
  - Defined a typed model layer for toasts: `ToastBase`, `ProdactToast` (extends base with `productName`), and a `ToastType` enum covering `success`, `error`, `warning`, and `info` variants.
  - Covered both the service and the component with unit tests.

- **Problems:**

  **1. Wildcard route placement**

  Angular's router matches routes top-to-bottom and stops at the first match. Putting `**` anywhere but last in the routes array would swallow legitimate routes. Had to make sure it sits after all defined routes in `app.routes.ts`, otherwise every page would render 404.

  **2. Toast identity without a shared counter**

  Toasts need a unique id so the service can remove a specific one without touching the rest of the list. A simple numeric counter would work but requires shared mutable state. Using `Symbol()` gives a guaranteed-unique value per call with no counter, no race condition risk, and no need to reset anything between sessions.

  **3. Auto-dismiss timing**

  The `show` method schedules a `setTimeout` when `duration` is provided, but the component can be destroyed before the timer fires. This isn't an issue now because `ec-toast` lives in `app.html` and is never destroyed during a session, but it's something to keep in mind if the component is ever moved to a page-level outlet.

- **Solutions:**
  - Placed the `**` route last in the routes array to ensure it only catches genuinely unmatched paths.
  - Used `Symbol()` for toast ids instead of a shared counter — no mutation, no collision.
  - Mounted `ec-toast` globally in `app.html` once, so the service and component lifetime are always aligned and the auto-dismiss timer always fires against a live component.

- **What I learned:**
  Angular's `signal` API is a clean fit for a toast queue: the component re-renders reactively whenever the array changes without needing `ChangeDetectionStrategy.OnPush` or manual subscriptions. The pattern of keeping a service-owned signal and injecting the service directly into the component (rather than passing data via `@Input`) works well for cross-cutting UI concerns like toasts where there is no meaningful parent-child relationship.

- **Time spent:** 4h
