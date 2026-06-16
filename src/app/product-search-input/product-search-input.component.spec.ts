import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, ActivatedRoute } from '@angular/router';
import { of, Observable } from 'rxjs';
import { vi } from 'vitest';
import { ProductSearchInput } from './product-search-input.component';

describe('ProductSearchInput', () => {
  let component: ProductSearchInput;
  let fixture: ComponentFixture<ProductSearchInput>;
  let routerMock: { navigate: ReturnType<typeof vi.fn> };
  let activatedRouteMock: { queryParams: Observable<Record<string, string>> };

  beforeEach(async () => {
    routerMock = {
      navigate: vi.fn(),
    };
    activatedRouteMock = {
      queryParams: of({}),
    };

    await TestBed.configureTestingModule({
      imports: [ProductSearchInput],
      providers: [
        { provide: Router, useValue: routerMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductSearchInput);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to product-list with search query on submit', () => {
    component.searchQuery.set('laptop');
    component.onSubmit();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/product-list'], {
      queryParams: { search: 'laptop' },
      queryParamsHandling: 'merge',
    });
  });

  it('should navigate and clear search query if empty on submit', () => {
    component.searchQuery.set('   ');
    component.onSubmit();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/product-list'], {
      queryParams: { search: null },
      queryParamsHandling: 'merge',
    });
  });
});
