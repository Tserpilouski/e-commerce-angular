# Sprint 3: Server-Side Pagination, Reusable Components & API Troubleshooting — 2026-06-15

- **What was done:**
  - Transitioned the `ProductService` from inefficient client-side filtering to native server-side pagination utilizing the Commercetools `/product-projections/search` API endpoint.
  - Implemented a reusable `ProductSearchInputComponent` with its own isolated scope, and integrated it across both the global `HeaderComponent` and the `ProductListComponent` for consistent search functionality.
  - Configured `subscriptSizing="dynamic"` on Angular Material form fields in `InputComponent` to cleanly collapse the reserved error spacing when used within headers and pagination controls.
  - Added generic click event emitters (`prefixIconClick`, `suffixIconClick`) to the shared `InputComponent` for interactive icon buttons.
  - Refactored `HeaderComponent` file paths and selectors to align with standard Angular architectural conventions (`header.component.ts` vs `header.ts`).

- **Problems:**
  - Commercetools does not natively support search for products by partial string matching (without SearchKeywords).
  - Encountered a `400 Bad Request` error specifically stating that the `product-projections/search` endpoint was deactivated on the Commercetools project settings.
  - Existing `InputComponent` design enforced a fixed bottom margin for error messages, which disrupted vertical alignment and created an ugly layout when rendering inline search or pagination inputs.

- **Solutions:**
  - Worked around the Commercetools search limitation by fetching a larger batch of products and performing client-side filtering/matching and manual pagination. **Note: In the future, we should implement a custom backend (BE) to handle this.**
  - Utilized `subscriptSizing="dynamic"` inside `<mat-form-field>` to dynamically omit the bottom spacing when no error or hint is present, cleaning up the pagination component UI.
  - Identified the root cause of the `400 Bad Request` to be a configuration toggle within the Commercetools Merchant Center, prompting a verification of API endpoint activation statuses.
  - Standardized component file naming (`.component.ts`, `.component.html`, `.component.scss`) to fix lingering architectural drift in the header folder.

- **What I learned:**
  - **Dynamic Form Field Sizing:** Angular Material form fields reserve fixed space for `mat-error` and `mat-hint` by default to prevent layout shifts. Toggling `subscriptSizing="dynamic"` provides a cleaner UI for inputs used strictly for search or inline forms where validation messages are not applicable.
  - **Single Source of Truth for Search:** Creating a dedicated `product-search-input` component reduces logic duplication across navigation headers and product listings, ensuring a uniform user experience.

- **Time spent:** 4h
