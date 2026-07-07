# Sprint 4: Product Filtering & Product Details Enhancements — 2026-07-07

- **What was done:**
  - **Backend-Driven Filtering (EPAM-20):** Shifted product queries from `product-projections` to the `product-projections/search` API. This offloads searching and filtering to the Commercetools backend.
  - **Dynamic Filter Extraction:** Implemented logic in `ProductService` (`loadFilterOptions`) to aggregate available attributes and brands dynamically. These are exposed via Angular `signal`s (`availableBrands`, `availableAttributes`, `categories`) for the UI to bind to.
  - **Product Details State & Computed Signals:** Extensively refactored the Product Details component to use `signal`s and `computed`. Added computed logic for `currentPrice`, `laptopSpecs`, `averageRating`, and `starsCount` based on the selected master variant attributes.
  - **Variant Selection:** Added the ability to select colors, storage options, and adjust quantities natively.
  - **Custom Objects for Reviews:** Integrated Commercetools Custom Objects (`custom-objects`) to fetch and persist user reviews per product key.
  - **Toast Integration:** Integrated the new global `ToastService` to show dynamic success and error notifications when adding to the cart and submitting reviews.

- **Problems:**

  **1. Filtering limits and Client-side overhead**
  Originally, filtering was handled entirely on the client side by fetching a larger batch of products and filtering them in memory. This didn't scale well and lacked support for dynamic category and attribute filters.

  **2. Missing dynamic filter options from backend**
  The Commercetools backend doesn't provide a trivial endpoint to "get all available filter values" for the current search context without using faceted search features, which can be complex to map.

  **3. Complex Variant Pricing & Attributes**
  Products (like laptops) have multiple dynamic attributes (CPU, RAM, Storage) and dynamic pricing based on selections, which may not always be perfectly modeled as individual Commercetools variants with pre-set prices.

  **4. Persisting User Reviews**
  Commercetools lacks a native built-in "Reviews" entity for products out-of-the-box without schema extensions.

- **Solutions:**
  - Transitioned to the `product-projections/search` endpoint. This allowed us to build an array of `filterQueries` (handling price ranges, category IDs, and dynamic attributes) that are passed natively to the backend.
  - Built a client-side aggregator (`loadFilterOptions`) that fetches the first batch of products in the current category context, scans their variants, and extracts unique values into Sets to populate filter UI options dynamically.
  - Utilized Angular's `computed` signals to calculate dynamic prices on the fly. For instance, `currentPrice` computes base price plus a surcharge determined by the storage array index. Also added computed signals to safely extract laptop specs from the master variant attributes.
  - Used Commercetools `custom-objects` to store JSON arrays of reviews, keyed by the product key, and placed in a dedicated container (`CustomObjectContainer.ProductReviews`). This handles read/write of user reviews securely without touching the product's core data structure.

- **What I learned:**
  Moving from client-side array manipulation to backend-driven searches dramatically improves scalability. Furthermore, utilizing Commercetools `custom-objects` provides immense flexibility for attaching generic JSON data (like reviews) to existing entities without requiring complex backend schema extensions. Angular's `computed` signals are extremely powerful for managing complex, interdependent UI state (like calculating cart totals or average review ratings) cleanly and synchronously.

- **Time spent:** ~8h
