export const ROLES = [
  'ADMIN',
  'CASHIER',
  'WAITER',
  'STOCK_MANAGER',
  'INVENTORY_STAFF',
  'KITCHEN',
  'SUPER_ADMIN'
] as const

export type Role = (typeof ROLES)[number]

export const ROLE_LABELS: Record<Role, string> = {
  ADMIN: 'Yönetici',
  CASHIER: 'Kasiyer',
  WAITER: 'Garson',
  STOCK_MANAGER: 'Stok Yöneticisi',
  INVENTORY_STAFF: 'Depo Görevlisi',
  KITCHEN: 'Mutfak',
  SUPER_ADMIN: 'Süper Yönetici',
}

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
  token: string
  expiresAt: string
  user: UserResponseDto
}

export type RefreshResponse = LoginResponse

export interface RawUserResponseDto extends Omit<UserResponseDto, 'roles'> {
  roles: number[]
}

export interface RawLoginResponse extends Omit<LoginResponse, 'user'> {
  user: RawUserResponseDto
}

export function mapUserResponse(raw: RawUserResponseDto): UserResponseDto {
  return { ...raw, roles: raw.roles.map((code) => ROLES[code]) }
}

export interface ChangePasswordRequest {
  newPassword: string
}

export interface ApiProblemDetails {
  status: number
  title: string
  detail: string
  instance?: string
}
