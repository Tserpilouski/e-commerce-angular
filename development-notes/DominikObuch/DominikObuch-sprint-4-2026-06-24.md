# Sprint 4: Faceted Search & Advanced Product Filtering — 2026-06-24

- **What was done:**
  - Implemented product search and filtering (Category, Price, Brand, dynamic attributes) on the Commercetools `/product-projections/search` API endpoint.
  - Synced filter settings with URL query parameters and added logic to automatically reset all filters on category change.
  - Simplified list pagination to a standard 9-item numeric mode, removing the load-more mode.
  - Wrote comprehensive unit tests and resolved TypeScript strict type errors.

- **Problems:**
  - **Volatile Filter Options:** Dynamic filter sidebar selections disappeared when other filters changed.
  - **URL Parameter Pollution:** Obsolete query parameters (like `attr_*`) persisted in the URL query string.

- **Solutions:**
  - **Comma-Separated Queries:** Fixed query format to use standard comma-separated lists (e.g. `brand:"Vapor","Apex"`).
  - **Category Options Caching:** Added `lastOptionsCategoryId` to cache and load category-specific filter options only once.
  - **Pruning Parameters:** Added a cleanup loop to set removed filter parameters to `null` during URL updates.

- **What I learned:**
  - **Commercetools Search Spec:** Commercetools query search uses specific syntax for ranges and attributes.
  - **Angular Router State:** Managing state in URL query parameters requires careful param pruning.

- **Time spent:** 9h
