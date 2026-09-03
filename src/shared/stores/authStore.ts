import { create } from 'zustand'
import * as authApi from '@/shared/api/endpoints/auth'
import type { UserResponseDto } from '@/shared/types/auth'
import { useActiveRoleStore } from '@/shared/stores/activeRoleStore'
import { useLocationStore } from '@/shared/stores/locationStore'
import { getDefaultRoleForRoles } from '@/routes-config/permissions'

interface AuthState {
  accessToken: string | null
  user: UserResponseDto | null
  isAuthenticated: boolean
  isFirstLogin: boolean
  setSession: (accessToken: string, user: UserResponseDto) => void
  login: (personalId: string, password: string) => Promise<UserResponseDto>
  logout: () => void
  completePasswordChange: () => void
}

export const useAuthStore = create<AuthState>((set, get) => ({accessToken: null,user: null, isAuthenticated: false,isFirstLogin: false,
  
  setSession: (accessToken, user) => {
    set({ accessToken, user, isAuthenticated: true, isFirstLogin: user.isFirstLogin,})

    const { activeRole, setActiveRole } = useActiveRoleStore.getState()
    if (!activeRole || !user.roles.includes(activeRole)) {
      setActiveRole(getDefaultRoleForRoles(user.roles))
    }
  },

  login: async (personalId, password) => {
    const { token, user } = await authApi.login({ personalId, password })
    get().setSession(token, user)
    return user
  },

  logout: () => {
    set({ accessToken: null, user: null, isAuthenticated: false, isFirstLogin: false })
    useActiveRoleStore.getState().reset()
    useLocationStore.getState().reset()
    authApi.logout().catch(() => {
    })
  },

  completePasswordChange: () => {
    const { user } = get()
    if (!user) return
    set({ user: { ...user, isFirstLogin: false }, isFirstLogin: false }) // change password sonrası isFirstLogin false set edilir
  },
}))
