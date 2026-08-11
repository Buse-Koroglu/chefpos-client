export type StockUnit = 'KG' | 'LT';

export interface GetProductsQueryParams {
  locationId: string;
  categoryId?: string | null;
  includeInactive?: boolean;
}

export interface ProductItemResponse {
  id: string;
  ingredientId: string;
  ingredientName: string;
  unit: StockUnit;
  quantityPerServing: number;
}

export interface ProductResponse {
  id: string;
  name: string;
  price: number;
  description?: string | null;
  imageUrl?: string | null;
  isActive: boolean;
  locationId: string;
  categoryId: string;
  ingredients: ProductItemResponse[];
}