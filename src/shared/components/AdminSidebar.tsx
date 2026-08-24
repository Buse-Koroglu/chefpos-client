import type { LucideIcon } from 'lucide-react'
import { BookOpen, Boxes, ClipboardList, Home, Layers, Table2, UtensilsCrossed, Users } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { SidebarUserCard } from './SidebarUserCard'

interface NavItem {
  label: string
  icon: LucideIcon
  to: string
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Ana Sayfa', icon: Home, to: '/app/dashboard' },
  { label: 'Personeller', icon: Users, to: '/app/users' },
  { label: 'Ürün Kategorileri', icon: Layers, to: '/app/categories' },
  { label: 'Ürün Ham Maddeleri', icon: Boxes, to: '/app/ingredients' },
  { label: 'Ürünler', icon: UtensilsCrossed, to: '/app/products' },
  { label: 'Menüler', icon: BookOpen, to: '/app/menus' },
  { label: 'Masalar', icon: Table2, to: '/app/tables' },
  { label: 'Stok Talepleri', icon: ClipboardList, to: '/app/stock-requests' },
]

export function AdminSidebar() {
  return (
    <aside className="flex h-screen w-64 shrink-0 flex-col border-r border-zinc-200 bg-zinc-100">
      <div className="flex items-center gap-2 border-b border-zinc-200 px-5 py-5">
        <img src="/logo.png" alt="ChefPos" className="size-8 shrink-0 object-contain" />
        <span className="text-base font-semibold tracking-tight text-zinc-900">ChefPos</span>
      </div>

      <nav className="flex flex-1 flex-col gap-1 px-3 py-3">
        {NAV_ITEMS.map(({ label, icon: Icon, to }) => (
          <NavLink
            key={label}
            to={to}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-2.5 border-l-2 px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'border-[#133458] bg-zinc-200 text-zinc-900'
                  : 'border-transparent text-zinc-500 hover:bg-zinc-200/60 hover:text-zinc-900',
              )
            }
          >
            <Icon className="size-4" />
            {label}
          </NavLink>
        ))}
      </nav>

      <SidebarUserCard />
    </aside>
  )
}
