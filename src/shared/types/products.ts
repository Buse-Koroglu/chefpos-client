import type { GetProductsPagedQueryRequest } from "./product";

export type ExportProductsQueryRequest = Omit<GetProductsPagedQueryRequest, 'pageNumber' | 'pageSize'>
