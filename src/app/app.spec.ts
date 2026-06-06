import { TestBed } from '@angular/core/testing';
import { App } from './app';
import { ProductService } from './services/product.service';
import { ProductPagedQueryResponse } from './models/products/product-paged-query-response.model';

describe('App', () => {
  let mockProductService: Pick<ProductService, 'fetchPagedProducts'>;

  beforeEach(async () => {
    mockProductService = {
      fetchPagedProducts: () =>
        Promise.resolve({
          limit: 4,
          offset: 0,
          count: 1,
          total: 10,
          results: [
            {
              id: 'db-1',
              version: 1,
              name: { en: 'Test DB Product' },
              masterVariant: {
                prices: [{ value: { centAmount: 9900 } }],
                images: [{ url: 'http://example.com/test.jpg' }],
              },
            },
          ],
        } as unknown as ProductPagedQueryResponse),
    };

    await TestBed.configureTestingModule({
      imports: [App],
      providers: [{ provide: ProductService, useValue: mockProductService }],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render title', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Pagination Wrapper Component');
  });
});
