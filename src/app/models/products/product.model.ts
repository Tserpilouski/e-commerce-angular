import { LocalizedString } from '../common/localized-string.model';
import { ProductVariant } from './product-variant.model';

export interface Product {
  id: string;
  key?: string;
  version: number;
  name: LocalizedString;
  description?: LocalizedString;
  slug?: LocalizedString;
  masterVariant: ProductVariant;
  variants?: ProductVariant[];
  published?: boolean;
}
