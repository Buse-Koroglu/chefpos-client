export const ROLES = [
  'ADMIN',
  'CASHIER',
  'WAITER',
  'STOCK_MANAGER',
  'INVENTORY_STAFF',
] as const

export type Role = (typeof ROLES)[number]

export interface UserResponseDto {
  id: string
  personalId: string
  firstName: string
  lastName: string
  roles: Role[]
  locationIds: string[]
  isActive: boolean
  isFirstLogin: boolean
}

export interface LoginRequest {
  personalId: string
  password: string
}

export interface LoginResponse {
  accessToken: string
  user: UserResponseDto
}

export interface RefreshResponse {
  accessToken: string
  user: UserResponseDto
}
