Sprint 2: Routing & Home Page — 2026-06-08

- **What was done:** Implemented Home page component with 4 sections: Hero, Shop by Category, Trending Now, Enterprise Solutions. Configured Angular routing and added route for home page. Connected ProductService to fetch real product data from CommerceTools API. Updated CardComponent to work with the API product model. Reorganized project structure: reusable components moved to shared/components/, pages to pages/.

- **Problems:** Merge conflicts when pulling main into feature branch. CardComponent used a simple Product model that didn't match the API response.

- **Solutions:** Resolved merge conflicts by accepting incoming changes from main. Updated CardComponent to use the API Product model from models/products/product.model.ts.

- **What I learned:** How Angular routing works (Routes, RouterOutlet, provideRouter()). How to use inject() instead of constructor injection. How signal() works and how to read signal values in templates with (). How to structure a large Angular project into pages/ and shared/components/.

- **Time spent:** ~10 hours
