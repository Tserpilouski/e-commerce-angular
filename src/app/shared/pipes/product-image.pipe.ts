import { Pipe, PipeTransform } from '@angular/core';
import { Product } from '@models/products/product.model';

@Pipe({
  name: 'productImage',
})
export class ProductImagePipe implements PipeTransform {
  transform(
    value?: Product | null,
    fallback = 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80',
  ): string {
    if (!value) return fallback;
    const images = value.masterVariant?.images;
    if (images && images.length > 0) {
      return images[0].url;
    }
    return fallback;
  }
}
