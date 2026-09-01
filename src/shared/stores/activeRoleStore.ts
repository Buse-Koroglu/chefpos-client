import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Role } from '@/shared/types/auth'

interface ActiveRoleState {
  activeRole: Role | null
  setActiveRole: (role: Role | null) => void
  reset: () => void
}

// bir personelin birden fazla rolü olma ve roller arası geçiş yapabilmesi için store ile tutuluyor

export const useActiveRoleStore = create<ActiveRoleState>()(
  persist(  // aktif rol bilgisini local storage içinde tutuyoruz
    (set) => ({
      activeRole: null,
      setActiveRole: (role) => set({ activeRole: role }),
      reset: () => set({ activeRole: null }),
    }),
    { name: 'chefpos-active-role' }, 
  ),
)
