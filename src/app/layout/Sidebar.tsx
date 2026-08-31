import { NavLink } from 'react-router-dom'
import type { RouteConfiguration } from '@/routes-config/permissions'

interface SidebarProps {
  routes: RouteConfiguration[]
}

export function Sidebar({ routes }: SidebarProps) {
  return (
    <aside className="w-60 shrink-0 border-r bg-sidebar text-sidebar-foreground">
      <div className="px-4 py-4 text-lg font-semibold">ChefPos</div>
      <nav className="flex flex-col gap-1 px-2">
        {routes.map((route) => (
          <NavLink
            key={route.path}
            to={route.path}
            className={({ isActive }) =>
              `rounded-md px-3 py-2 text-sm ${
                isActive ? 'bg-sidebar-accent text-sidebar-accent-foreground' : 'hover:bg-sidebar-accent/50'
              }`} >
            {route.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}