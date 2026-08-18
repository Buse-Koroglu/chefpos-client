import type { Role } from '@/shared/types/auth'

export const ROLE_LABELS: Record<Role, string> = {
  ADMIN: 'Yönetici',
  CASHIER: 'Kasiyer',
  WAITER: 'Garson',
  STOCK_MANAGER: 'Stok Yöneticisi',
  INVENTORY_STAFF: 'Depo Görevlisi',
  KITCHEN: 'Mutfak',
}

export const ROLE_OPTIONS: Role[] = ['ADMIN', 'CASHIER', 'WAITER', 'STOCK_MANAGER', 'INVENTORY_STAFF', 'KITCHEN']

export const STAFF_PAGE_SIZE = 20
export const STAFF_SEARCH_DEBOUNCE_MS = 400
