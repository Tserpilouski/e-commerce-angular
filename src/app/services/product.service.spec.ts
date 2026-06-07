import { TestBed } from '@angular/core/testing';
import { ProductService } from './product.service';
import { ApiClientService } from './api-client.service';
import { vi } from 'vitest';

describe('ProductService', () => {
  let service: ProductService;
  let apiClientMock: {
    ecomFetch: ReturnType<typeof vi.fn>;
    ecomFetchWithState: ApiClientService['ecomFetchWithState'];
  };

  beforeEach(() => {
    apiClientMock = {
      ecomFetch: vi.fn(),
      ecomFetchWithState: ApiClientService.prototype.ecomFetchWithState,
    };
    TestBed.configureTestingModule({
      providers: [{ provide: ApiClientService, useValue: apiClientMock }],
    });
    service = TestBed.inject(ProductService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch products and update signal', async () => {
    const mockData = { results: [{ id: '1', version: 1, name: { en: 'Product 1' }, masterVariant: { id: 1 } }] };
    apiClientMock.ecomFetch.mockResolvedValue(mockData);

    const products = await service.fetchProducts(10, 0);
    expect(apiClientMock.ecomFetch).toHaveBeenCalledWith('product-projections?limit=10&offset=0');
    expect(products.length).toBe(1);
    expect(service.products().length).toBe(1);
  });

  it('should fetch product by key and update selectedProduct signal with expanded productType labels', async () => {
    const mockProduct = {
      id: 'p123',
      key: 'macbook',
      version: 1,
      name: { en: 'MacBook' },
      masterVariant: {
        id: 1,
        attributes: [{ name: 'memory', value: { key: '16gb', label: '16 GB' } }],
      },
      productType: {
        typeId: 'product-type',
        id: 'pt1',
        obj: {
          id: 'pt1',
          version: 1,
          name: 'Computer',
          attributes: [{ name: 'memory', label: { en: 'Memory (RAM)' } }],
        },
      },
    };
    apiClientMock.ecomFetch.mockResolvedValue(mockProduct);

    const product = await service.fetchProductByKey('macbook');
    expect(apiClientMock.ecomFetch).toHaveBeenCalledWith('product-projections/key=macbook', {
      params: { expand: 'productType' },
    });
    expect(product.key).toBe('macbook');
    expect(service.selectedProduct()?.key).toBe('macbook');
    expect(product.masterVariant?.attributes?.[0].label).toBe('Memory (RAM)');
  });
});
