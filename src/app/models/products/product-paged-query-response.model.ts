import { PagedQueryResponse } from '../common/paged-query-response.model';
import { Product } from './product.model';

export interface ProductPagedQueryResponse extends PagedQueryResponse {
  results: Product[];
}
