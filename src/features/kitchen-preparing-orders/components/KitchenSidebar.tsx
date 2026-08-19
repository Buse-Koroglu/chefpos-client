import {
  ClipboardList,
} from 'lucide-react'
import { NavLink } from 'react-router-dom'

import { cn } from '@/lib/utils'
import { SidebarUserCard } from '@/shared/components/SidebarUserCard'

const NAV_ITEMS = [
  {
    label: 'Bekleyen Siparişler',
    icon: ClipboardList,
    to: '/app/kitchen-orders',
  },
]

export function KitchenSidebar() {
  return (
    <aside className="flex h-screen w-64 shrink-0 flex-col border-r border-zinc-200 bg-zinc-100">
      {/* LOGO */}
      <div className="flex items-center gap-2 border-b border-zinc-200 px-5 py-5">
        <img
          src="/logo.png"
          alt="ChefPos"
          className="size-8 shrink-0 object-contain"
        />

        <span className="text-base font-semibold tracking-tight text-zinc-900">
          ChefPos
        </span>
      </div>

      {/* NAVIGATION */}
      <nav className="flex flex-1 flex-col gap-1 px-3 py-3">
        {NAV_ITEMS.map(
          ({ label, icon: Icon, to }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-2.5 border-l-2 px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'border-zinc-900 bg-zinc-200 text-zinc-900'
                    : 'border-transparent text-zinc-500 hover:bg-zinc-200 hover:text-zinc-900',
                )
              }
            >
              <Icon className="size-4" />
              {label}
            </NavLink>
          ),
        )}
      </nav>

      {/* USER / LOGOUT */}
      <div className="border-t border-zinc-200 p-3">
        <SidebarUserCard />

      </div>
    </aside>
  )
}