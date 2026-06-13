import { ProductImagePipe } from './product-image.pipe';
import { Product } from '@models/products/product.model';

describe('ProductImagePipe', () => {
  let pipe: ProductImagePipe;
  const defaultFallback = 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80';

  beforeEach(() => {
    pipe = new ProductImagePipe();
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return default fallback when product is null or undefined', () => {
    expect(pipe.transform(null)).toBe(defaultFallback);
    expect(pipe.transform(undefined)).toBe(defaultFallback);
  });

  it('should return custom fallback when provided', () => {
    const customFallback = 'https://custom-fallback.png';
    expect(pipe.transform(null, customFallback)).toBe(customFallback);
  });

  it('should return product image url when available', () => {
    const product: Partial<Product> = {
      masterVariant: {
        id: 1,
        images: [{ url: 'https://product-image.png', dimensions: { w: 100, h: 100 } }],
      },
    };
    expect(pipe.transform(product as Product)).toBe('https://product-image.png');
  });
});
