export interface PagedQueryResponse {
  limit: number;
  offset: number;
  count: number;
  total?: number;
}
