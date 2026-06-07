import { ProductType } from './product-type.model';

export interface ProductTypeReference {
  typeId: string;
  id: string;
  obj?: ProductType;
}
