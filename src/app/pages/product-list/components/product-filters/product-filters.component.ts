import { Component, EventEmitter, Output, Input, inject, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSliderModule } from '@angular/material/slider';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatListModule, MatSelectionListChange } from '@angular/material/list';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';
import { ProductFilters } from '@models/products/product-filters.model';
import { ProductService } from '@services/product.service';
import { ProductSearchInput } from '@app/product-search-input/product-search-input.component';

@Component({
  selector: 'ec-product-filters',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatSliderModule,
    MatCheckboxModule,
    MatInputModule,
    MatFormFieldModule,
    ProductSearchInput,
    MatListModule,
    MatExpansionModule,
    MatButtonModule,
  ],
  templateUrl: './product-filters.component.html',
  styleUrls: ['./product-filters.component.scss'],
})
export class ProductFiltersComponent implements OnInit, OnChanges {
  private readonly productService = inject(ProductService);

  @Input() initialFilters: ProductFilters | undefined;
  @Output() filtersChanged = new EventEmitter<ProductFilters>();

  // Use dynamic options from service
  readonly availableAttributes = this.productService.availableAttributes;
  readonly availableBrands = this.productService.availableBrands;
  readonly categories = this.productService.categories;

  selectedCategoryId: string | null = null;
  selectedDynamicFilters: Record<string, Set<string>> = {};
  expandedFilters: Record<string, boolean> = {};

  ngOnInit() {
    this.productService.fetchCategories();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['initialFilters']) {
      this.syncStateWithFilters(this.initialFilters);
    }
  }

  private syncStateWithFilters(filters: ProductFilters | undefined) {
    if (!filters) {
      this.selectedCategoryId = null;
      this.priceMin = 0;
      this.priceMax = 5000;
      this.selectedBrands.clear();
      this.selectedDynamicFilters = {};
      return;
    }

    this.selectedCategoryId = filters.categoryId || null;
    this.priceMin = filters.priceMin ? filters.priceMin / 100 : 0;
    this.priceMax = filters.priceMax ? filters.priceMax / 100 : 5000;

    this.selectedBrands.clear();
    if (filters.brands) {
      filters.brands.forEach((b) => this.selectedBrands.add(b));
    }

    this.selectedDynamicFilters = {};
    if (filters.dynamicFilters) {
      for (const [key, values] of Object.entries(filters.dynamicFilters)) {
        this.selectedDynamicFilters[key] = new Set(values);
      }
    }
  }

  selectCategory(categoryId: string | null) {
    this.selectedCategoryId = categoryId;
    this.selectedBrands.clear();
    this.priceMin = 0;
    this.priceMax = 5000;
    this.selectedDynamicFilters = {}; // Reset dynamic filters on category change
    this.emitFilters();
  }

  onCategorySelection(event: MatSelectionListChange) {
    const selectedOption = event.options[0];
    this.selectCategory(selectedOption ? selectedOption.value : null);
  }

  toggleDynamicFilter(attrName: string, value: string, checked?: boolean) {
    if (!this.selectedDynamicFilters[attrName]) {
      this.selectedDynamicFilters[attrName] = new Set<string>();
    }

    if (checked) {
      this.selectedDynamicFilters[attrName].add(value);
    } else {
      this.selectedDynamicFilters[attrName].delete(value);
    }
    this.emitFilters();
  }

  toggleExpand(filterName: string) {
    this.expandedFilters[filterName] = !this.expandedFilters[filterName];
  }

  getVisibleItems<T>(items: T[], filterName: string): T[] {
    return this.expandedFilters[filterName] ? items : items.slice(0, 4);
  }

  formatAttributeName(name: string): string {
    return name.replace(/_/g, ' ').toUpperCase();
  }

  // Price range (in dollars)
  priceMin = 0;
  priceMax = 5000;
  sliderMin = 0;
  sliderMax = 5000;

  selectedBrands = new Set<string>();

  toggleBrand(brand: string, checked: boolean) {
    if (checked) {
      this.selectedBrands.add(brand);
    } else {
      this.selectedBrands.delete(brand);
    }
    this.emitFilters();
  }

  onPriceChange() {
    this.emitFilters();
  }

  private emitFilters() {
    const dynamicFiltersToEmit: Record<string, string[]> = {};
    for (const [key, set] of Object.entries(this.selectedDynamicFilters)) {
      if (set.size > 0) {
        dynamicFiltersToEmit[key] = Array.from(set);
      }
    }

    this.filtersChanged.emit({
      categoryId: this.selectedCategoryId || undefined,
      priceMin: this.priceMin ? this.priceMin * 100 : undefined, // Convert to cents
      priceMax: this.priceMax ? this.priceMax * 100 : undefined, // Convert to cents
      brands: Array.from(this.selectedBrands),
      dynamicFilters: Object.keys(dynamicFiltersToEmit).length > 0 ? dynamicFiltersToEmit : undefined,
    });
  }
}
