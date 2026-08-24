import type { Role } from '@/shared/types/auth'

export { ROLE_LABELS } from '@/shared/types/auth'

export const ROLE_OPTIONS: Role[] = ['CASHIER', 'WAITER', 'STOCK_MANAGER', 'INVENTORY_STAFF', 'KITCHEN']

export const STAFF_PAGE_SIZE = 20
export const STAFF_SEARCH_DEBOUNCE_MS = 400
