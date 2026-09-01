import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface SidebarState {
  isCollapsed: boolean
  toggleSidebar: () => void
}

// kasiyer sidebar'ının açık/kapalı durumu sayfalar arası geçişte korunsun diye local storage'da tutuluyor
export const useSidebarStore = create<SidebarState>()(
  persist(
    (set) => ({
      isCollapsed: false,
      toggleSidebar: () => set((state) => ({ isCollapsed: !state.isCollapsed })),
    }),
    { name: 'chefpos-cashier-sidebar' },
  ),
)
