import { LocalizedString } from '@models/common/localized-string.model';
import { ProductVariant } from './product-variant.model';
import { ProductTypeReference } from './product-type-reference.model';

export interface Product {
  id: string;
  key?: string;
  version: number;
  productType?: ProductTypeReference;
  name: LocalizedString;
  description?: LocalizedString;
  slug?: LocalizedString;
  masterVariant: ProductVariant;
  variants?: ProductVariant[];
  published?: boolean;
  categories?: { typeId: 'category'; id: string }[];
}
