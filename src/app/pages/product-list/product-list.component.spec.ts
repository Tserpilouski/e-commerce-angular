import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductListComponent } from './product-list.component';
import { ProductService } from '@services/product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductDetailsComponent } from '@pages/product-details/product-details.component';
import { ProductService } from '@services/product.service';
import { signal, WritableSignal } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { vi } from 'vitest';
import { Product } from '@models/products/product.model';

describe('ProductListComponent', () => {
  let component: ProductListComponent;
  let fixture: ComponentFixture<ProductListComponent>;
  let productServiceMock: {
    fetchPagedProducts: ReturnType<typeof vi.fn>;
    loading: WritableSignal<boolean>;
    error: WritableSignal<string | null>;
    products: WritableSignal<Product[]>;
  };
  let routerMock: { navigate: ReturnType<typeof vi.fn> };
  let queryParamsSubject: BehaviorSubject<Record<string, string>>;

  const mockProductListResponse = {
    limit: 4,
    offset: 0,
    count: 2,
    total: 2,
    results: [
      { id: '1', version: 1, name: { en: 'Quantum Laptop 1' }, masterVariant: { id: 1 } },
      { id: '2', version: 1, name: { en: 'Quantum Laptop 2' }, masterVariant: { id: 2 } },
    ] as unknown as Product[],
  };

  beforeEach(async () => {
    productServiceMock = {
      fetchPagedProducts: vi.fn().mockResolvedValue(mockProductListResponse),
      loading: signal(false),
      error: signal(null),
      products: signal([]),
    };

    routerMock = {
      navigate: vi.fn(),
    };

    queryParamsSubject = new BehaviorSubject<Record<string, string>>({});

    await TestBed.configureTestingModule({
      imports: [ProductListComponent],
      providers: [
        { provide: ProductService, useValue: productServiceMock },
        { provide: Router, useValue: routerMock },
        {
          provide: ActivatedRoute,
          useValue: {
            queryParams: queryParamsSubject.asObservable(),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create and load products on init', () => {
    expect(component).toBeTruthy();
    expect(productServiceMock.fetchPagedProducts).toHaveBeenCalled();
  });

  it('should reload products when search query param changes', async () => {
    productServiceMock.fetchPagedProducts.mockClear();
    queryParamsSubject.next({ search: 'Quantum' });
    fixture.detectChanges();
    await fixture.whenStable();

    expect(component.searchQuery()).toBe('Quantum');
    expect(productServiceMock.fetchPagedProducts).toHaveBeenCalledWith(4, 0, 'Quantum');
  });

  it('should navigate and clear query params on search clear', () => {
    component.onClearSearch();
    expect(routerMock.navigate).toHaveBeenCalledWith([], {
      queryParams: { search: null },
      queryParamsHandling: 'merge',
    });
  });
});
