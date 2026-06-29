export interface ProductFilters {
  categoryId?: string;
  priceMin?: number;
  priceMax?: number;
  brands?: string[];
  dynamicFilters?: Record<string, string[]>;
}
