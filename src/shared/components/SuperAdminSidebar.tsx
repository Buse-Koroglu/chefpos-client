import type { LucideIcon } from 'lucide-react'
import { BookOpen, Boxes, Layers, MapPin, UtensilsCrossed, Users } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { SidebarUserCard } from './SidebarUserCard'

interface SidebarItem {
  label: string
  icon: LucideIcon
  to: string
}

// Super Admin Sidebar

const SIDEBAR_ITEMS: SidebarItem[] = [
  { label: 'Personeller', icon: Users, to: '/app/super-admin/users' },
  { label: 'Yerleşkeler', icon: MapPin, to: '/app/locations' },
  { label: 'Kategoriler', icon: Layers, to: '/app/super-admin/categories' },
  { label: 'Ürünler', icon: UtensilsCrossed, to: '/app/super-admin/products' },
  { label: 'Menüler', icon: BookOpen, to: '/app/super-admin/menus' },
  { label: 'Ham Maddeler', icon: Boxes, to: '/app/super-admin/ingredients' },
]

export function SuperAdminSidebar() {
  return (
    <aside className="flex h-screen w-64 shrink-0 flex-col border-r border-zinc-200 bg-zinc-100">
      <div className="flex items-center gap-2 border-b border-zinc-200 px-5 py-5">
        <img src="/logo.png" alt="ChefPos" className="size-8 shrink-0 object-contain" />
        <span className="text-base font-semibold tracking-tight text-zinc-900">ChefPos</span>
      </div>

      <nav className="flex flex-1 flex-col gap-1 px-3 py-3">
        {SIDEBAR_ITEMS.map(({ label, icon: Icon, to }) => (
          <NavLink
            key={label}
            to={to}
            className={({ isActive }) =>
              cn('flex items-center gap-2.5 border-l-2 px-3 py-2 text-sm font-medium transition-colors',
                isActive ? 'border-[#133458] bg-zinc-200 text-zinc-900' : 'border-transparent text-zinc-500 hover:bg-zinc-200/60 hover:text-zinc-900',
              )} >
            <Icon className="size-4" />
            {label}
          </NavLink>
        ))}
      </nav>

      <SidebarUserCard />
    </aside>
  )
}
