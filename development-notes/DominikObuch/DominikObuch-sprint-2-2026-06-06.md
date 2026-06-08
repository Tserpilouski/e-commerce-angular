# Sprint 2: CommerceTools Integration & Pagination — 2026-06-06

- **What was done:**
  - Implemented a reusable `ec-pagination-wrapper` component that supports two modes: `Numeric` page navigation and `LoadMore` action.
  - Refactored `App` component state management (`app.ts`) to use Angular Signals (`signal()`, `computed()`) instead of plain class properties to align with the project's Zoneless architecture.
  - Integrated `ProductService` with Commercetools API fetching, returning signal-based states for products, loading, and error indications.
  - Wrote comprehensive unit tests for `PaginationWrapperComponent` to verify correct pagination calculations (including ellipses formatting) and attribute display logic.

- **Problems:**

  **1. UI changes were not rendering on pagination data updates (Zoneless environment)**

  When pagination offsets or page inputs changed, the Commercetools API request successfully fetched the new page of products, but the UI component gallery remained completely static. In a Zoneless Angular application, mutating plain class properties does not trigger change detection.

  **2. Dynamic pagination ranges overflowing the screen**

  When fetching a large collection of products, rendering a button for every single page caused the controls to overflow the wrapper boundary.

- **Solutions:**

  **1. Transitioned components to Angular Signals**

  Refactored state properties (`paginatedProducts`, `numericResponse`, `cumulativeProducts`, `loading`, etc.) into Signals. Because Signals natively notify the framework when their values change, this forces Angular to run change detection selectively on the target template even without Zone.js.

  Implemented a helper method in `PaginationWrapperComponent` called `generatePageRange()` which is wrapped in a `computed` signal. When the total page count exceeds 5, the page range is truncated with ellipses (e.g. `[1, 2, 3, '...', 10]`) based on the current page index.

- **What I learned:**
  - **Zoneless change detection is fully dependent on reactive state.** Standard property bindings do not notify the rendering engine in a zoneless environment; Signals are mandatory to trigger view updates upon asynchronous API data loading.
  - **Computed Signals are highly efficient** for translating raw API responses into UI presentation states (such as determining total pages and page arrays dynamically).
  - **Angular's new signal-based Inputs (`input()`)** pair extremely well with route parameter binding, allowing component effects to automatically respond to URL changes without manually subscribing to `ActivatedRoute`.

- **Time spent:** 4h
