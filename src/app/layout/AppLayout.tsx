import { NavLink, Outlet } from 'react-router-dom'
import { LogOut } from 'lucide-react'
import { useAuthStore } from '@/shared/stores/authStore'
import { useRole } from '@/shared/hooks/useRole'
import { APP_ROUTES } from '@/routes-config/permissions'

export function AppLayout() {
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)
  const { hasAnyRole } = useRole()

  const sidebarRoutes = APP_ROUTES.filter(
    (route) =>
      route.showInSidebar &&
      (route.allowedRoles === 'ANY' || hasAnyRole(route.allowedRoles)),
  )

  return (
    <div className="flex min-h-screen">
      <aside className="w-60 shrink-0 border-r bg-sidebar text-sidebar-foreground">
        <div className="px-4 py-4 text-lg font-semibold">ChefPos</div>
        <nav className="flex flex-col gap-1 px-2">
          {sidebarRoutes.map((route) => (
            <NavLink
              key={route.path}
              to={route.path}
              className={({ isActive }) =>
                `rounded-md px-3 py-2 text-sm ${
                  isActive
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                    : 'hover:bg-sidebar-accent/50'
                }`
              }
            >
              {route.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between border-b px-4 py-3">
          <div className="text-sm text-muted-foreground">Şube: (seçilmedi)</div>
          <div className="flex items-center gap-3 text-sm">
            <span>
              {user?.firstName} {user?.lastName}
            </span>
            <button
              type="button"
              onClick={logout}
              className="flex items-center gap-1 text-muted-foreground hover:text-foreground"
            >
              <LogOut className="size-4" />
              Çıkış
            </button>
          </div>
        </header>

        <main className="flex-1 p-4">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
