import { Outlet } from 'react-router-dom'
import { useAuthStore } from '@/shared/stores/authStore'
import { useSidebarRoutes } from '@/shared/hooks/useSidebarRoutes'
import { Sidebar } from '@/app/layout/Sidebar'
import { Header } from '@/app/layout/Header'

export function AppLayout() {
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)
  const sidebarRoutes = useSidebarRoutes()

  return (
    <div className="flex min-h-screen">
      <Sidebar routes={sidebarRoutes} />

      <div className="flex min-w-0 flex-1 flex-col">
        <Header user={user} onLogout={logout} />

        <main className="flex-1 p-4">
          <Outlet />
        </main>
      </div>
    </div>
  )
}