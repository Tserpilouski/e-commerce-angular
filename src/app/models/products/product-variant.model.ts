import { Image } from '../common/image.model';
import { Price } from '../common/price.model';
import { Attribute } from '../attributes/attribute.model';

export interface ProductVariant {
  id: number;
  sku?: string;
  key?: string;
  prices?: Price[];
  images?: Image[];
  attributes?: Attribute[];
}
