import type { StockUnit } from './ingredient'

export interface GetProductsQueryRequest {
  locationId: string;
  categoryId?: string | null;
  includeInactive?: boolean;
  includeUncategorized?: boolean;
}

export interface ProductItemResponse {
  id: string;
  ingredientId: string;
  ingredientName: string;
  unit: StockUnit;
  quantityPerServing: number;
}

export interface ProductLocationIngredients {
  locationId: string;
  ingredients: ProductItemResponse[];
}

export interface ProductResponse {
  id: string;
  name: string;
  price: number;
  description?: string | null;
  imageUrl?: string | null;
  isActive: boolean;
  isAvailable: boolean;
  categoryId: string | null;
  locationIds: string[];
  locations: ProductLocationIngredients[];
}

export interface ProductAdminResponseDto {
  id: string;
  name: string;
  price: number;
  imageUrl?: string | null;
  isActive: boolean;
  categoryId: string | null;
  categoryName: string | null;
  locationIds: string[];
  locationNames: string[];
}

export interface GetProductsPagedQueryRequest {
  searchTerm?: string;
  locationId?: string;
  categoryId?: string;
  isActive?: boolean;
  pageNumber?: number;
  pageSize?: number;
  includeUncategorized?: boolean;
}

export interface CreateProductRequest {
  name: string;
  price: number;
  categoryId: string;
  locationIds: string[];
  description?: string | null;
}

export interface UpdateProductRequest {
  name: string;
  description?: string | null;
}

export interface AddProductIngredientRequest {
  locationId: string;
  ingredientId: string;
  quantityPerServing: number;
}

