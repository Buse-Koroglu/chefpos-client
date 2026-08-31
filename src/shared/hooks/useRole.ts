import { useAuthStore } from '@/shared/stores/authStore'
import type { Role } from '@/shared/types/auth'

const DEFAULT_EMPTY_ROLES: Role[] = []

export function useRole() {
  const roles = useAuthStore((state) => state.user?.roles ?? DEFAULT_EMPTY_ROLES)

  return {
    roles,
    hasRole: (role: Role) => roles.includes(role), // tek rol kontrolü
    hasAnyRole: (allowed: Role[]) => allowed.some((role) => roles.includes(role)), // çoklu rol kontrolü
  }
}
