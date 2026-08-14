export const ROLES = [
  'ADMIN',
  'CASHIER',
  'WAITER',
  'STOCK_MANAGER',
  'INVENTORY_STAFF',
  'KITCHEN'
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
