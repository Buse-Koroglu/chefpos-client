import { useAuthStore } from '@/shared/stores/authStore'
import type { Role } from '@/shared/types/auth'

const EMPTY_ROLES: Role[] = []

export function useRole() {
  const roles = useAuthStore((state) => state.user?.roles ?? EMPTY_ROLES)

  return {
    roles,
    hasRole: (role: Role) => roles.includes(role),
    hasAnyRole: (allowed: Role[]) => allowed.some((role) => roles.includes(role)),
  }
}
