export interface MenuProductDto {
  productId: string;
  productName: string;
  price: number;
  imageUrl?: string | null;
  productIsActive: boolean;
}

export interface MenuResponseDto {
  id: string;
  name: string;
  description?: string | null;
  locationId: string;
  isActive: boolean;
  products: MenuProductDto[];
}

export interface GetMenusQueryRequest {
  locationId: string;
  includeInactive?: boolean;
}

export interface CreateMenuRequest {
  name: string;
  description?: string | null;
  locationId: string;
}

export interface UpdateMenuRequest {
  name: string;
  description?: string | null;
}

export interface AddProductToMenuRequest {
  productId: string;
}

export interface CreateProductForMenuRequest {
  name: string;
  price: number;
  description?: string | null;
}
