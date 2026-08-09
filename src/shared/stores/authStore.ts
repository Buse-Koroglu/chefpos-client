import { create } from 'zustand'
import * as authApi from '@/shared/api/endpoints/auth'
import type { UserResponseDto } from '@/shared/types/auth'

interface AuthState {
  accessToken: string | null
  user: UserResponseDto | null
  isAuthenticated: boolean
  isFirstLogin: boolean
  setSession: (accessToken: string, user: UserResponseDto) => void
  login: (personalId: string, password: string) => Promise<UserResponseDto>
  logout: () => void
}

export const useAuthStore = create<AuthState>((set, get) => ({
  accessToken: null,
  user: null,
  isAuthenticated: false,
  isFirstLogin: false,

  setSession: (accessToken, user) => {
    set({
      accessToken,
      user,
      isAuthenticated: true,
      isFirstLogin: user.isFirstLogin,
    })
  },

  login: async (personalId, password) => {
    const { accessToken, user } = await authApi.login({ personalId, password })
    get().setSession(accessToken, user)
    return user
  },

  logout: () => {
    set({ accessToken: null, user: null, isAuthenticated: false, isFirstLogin: false })
    authApi.logout().catch(() => {
    })
  },
}))
