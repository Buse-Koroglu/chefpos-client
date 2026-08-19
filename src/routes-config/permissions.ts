import type { Role } from '@/shared/types/auth'

export interface RouteConfig {
  path: string
  label: string
  allowedRoles: Role[] | 'ANY'
  showInSidebar: boolean
}

export const APP_ROUTES: RouteConfig[] = [
  { path: '/app/dashboard', label: 'Panel', allowedRoles: ['ADMIN'], showInSidebar: true },
  { path: '/app/home', label: 'Ana Sayfa', allowedRoles: ['CASHIER'], showInSidebar: false },
  { path: '/app/pos', label: 'Sipariş Al', allowedRoles: ['CASHIER'], showInSidebar: true },
  { path: '/app/pending-orders', label: 'Bekleyen Siparişler', allowedRoles: ['CASHIER'], showInSidebar: true },
  { path: '/app/past-orders', label: 'Geçmiş Siparişler', allowedRoles: ['CASHIER'], showInSidebar: true },
  { path: '/app/orders/:id', label: 'Sipariş Detay', allowedRoles: ['CASHIER', 'WAITER', 'ADMIN'], showInSidebar: false },
  { path: '/app/waiter-orders', label: 'Sipariş Al', allowedRoles: ['WAITER'], showInSidebar: true },
  { path: '/app/products', label: 'Ürünler', allowedRoles: ['ADMIN'], showInSidebar: true },
  { path: '/app/tables', label: 'Masalar', allowedRoles: ['ADMIN'], showInSidebar: true },
  { path: '/app/categories', label: 'Kategoriler', allowedRoles: ['ADMIN'], showInSidebar: true },
  { path: '/app/kitchen-orders', label: 'Mutfak Siparişleri', allowedRoles: ['ADMIN', 'KITCHEN'], showInSidebar: true },
  { path: '/app/ingredients', label: 'Hammaddeler', allowedRoles: ['ADMIN', 'STOCK_MANAGER', 'INVENTORY_STAFF'], showInSidebar: true },
  { path: '/app/stock-requests', label: 'Stok Talepleri', allowedRoles: ['ADMIN', 'STOCK_MANAGER', 'INVENTORY_STAFF'], showInSidebar: true },
  { path: '/app/inventory', label: 'Stok Görevlisi Ana Sayfa', allowedRoles: ['INVENTORY_STAFF'],showInSidebar:true},
  { path: '/app/users', label: 'Kullanıcılar', allowedRoles: ['ADMIN'], showInSidebar: true },
  { path: '/app/locations', label: 'Şubeler', allowedRoles: ['ADMIN'], showInSidebar: true },
  { path: '/app/change-password', label: 'Şifre Değiştir', allowedRoles: 'ANY', showInSidebar: false },
]

export function findRouteConfig(path: string): RouteConfig | undefined {
  return APP_ROUTES.find((route) => route.path === path)
}

const DEFAULT_ROUTE_BY_ROLE: Array<{ role: Role; path: string }> = [
  { role: 'ADMIN', path: '/app/dashboard' },
  { role: 'CASHIER', path: '/app/home' },
  { role: 'WAITER', path: '/app/waiter-orders' },
  { role: 'STOCK_MANAGER', path: '/app/stock-requests' },
  { role: 'INVENTORY_STAFF', path: '/app/inventory' },
  { role: 'KITCHEN', path: '/app/kitchen-orders' },
]

export function getDefaultRouteForRoles(roles: Role[]): string {
  const match = DEFAULT_ROUTE_BY_ROLE.find((entry) => roles.includes(entry.role))
  return match?.path ?? '/app/dashboard'
}

export function getDefaultRouteForRole(role: Role): string {
  return DEFAULT_ROUTE_BY_ROLE.find((entry) => entry.role === role)?.path ?? '/app/dashboard'
}
