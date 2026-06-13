import { Image } from '@models/common/image.model';
import { Price } from '@models/common/price.model';
import { Attribute } from '@models/attributes/attribute.model';

export interface ProductVariant {
  id: number;
  sku?: string;
  key?: string;
  prices?: Price[];
  images?: Image[];
  attributes?: Attribute[];
}
