import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductDetailsComponent } from './product-details.component';
import { ProductService } from '@services/product.service';
import { signal, WritableSignal } from '@angular/core';
import { vi } from 'vitest';

describe('ProductDetailsComponent', () => {
  let productMock: {
    fetchProductByKey: ReturnType<typeof vi.fn>;
    selectedProduct: WritableSignal<unknown>;
    loading: WritableSignal<boolean>;
    error: WritableSignal<string | null>;
  };
  let component: ProductDetailsComponent;
  let fixture: ComponentFixture<ProductDetailsComponent>;

  const mockProd = {
    id: '123',
    version: 1,
    name: { 'en-US': 'MacBook Pro 16"' },
    masterVariant: {
      id: 1,
      attributes: [{ name: 'memory', value: '48GB' }],
    },
  };

  beforeEach(async () => {
    productMock = {
      fetchProductByKey: vi.fn().mockResolvedValue(mockProd),
      selectedProduct: signal(mockProd),
      loading: signal(false),
      error: signal(null),
    };

    await TestBed.configureTestingModule({
      imports: [ProductDetailsComponent],
      providers: [{ provide: ProductService, useValue: productMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create and render core specifications component', () => {
    expect(component).toBeTruthy();
    const elem = fixture.nativeElement as HTMLElement;
    expect(elem.querySelector('.spec-card')).toBeTruthy();
  });

  it('should not fetch anything when no key is provided', async () => {
    await fixture.whenStable();
    expect(productMock.fetchProductByKey).not.toHaveBeenCalled();
  });

  it('should fetch specific product when key input is provided', async () => {
    fixture.componentRef.setInput('key', 'macbook-pro');
    fixture.detectChanges();
    await fixture.whenStable();
    expect(productMock.fetchProductByKey).toHaveBeenCalledWith('macbook-pro');
  });
});
