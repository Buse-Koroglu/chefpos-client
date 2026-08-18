import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Role } from '@/shared/types/auth'

interface ActiveRoleState {
  activeRole: Role | null
  setActiveRole: (role: Role | null) => void
  reset: () => void
}

export const useActiveRoleStore = create<ActiveRoleState>()(
  persist(
    (set) => ({
      activeRole: null,
      setActiveRole: (role) => set({ activeRole: role }),
      reset: () => set({ activeRole: null }),
    }),
    { name: 'chefpos-active-role' },
  ),
)
