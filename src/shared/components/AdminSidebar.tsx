import type { LucideIcon } from 'lucide-react'
import { BookOpen, Boxes, ChevronLeft, ChevronRight, ClipboardList, Home, Layers, Table2, UtensilsCrossed, Users } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { useSidebarStore } from '@/shared/stores/sidebarStore'
import { SidebarUserCard } from './SidebarUserCard'

interface SidebarItem {
  label: string
  icon: LucideIcon
  to: string
}

// Admin sidebar component içerisinde SidebarUserCard'ı da bulundurur

const SIDEBAR_ITEMS: SidebarItem[] = [
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
  const isCollapsed = useSidebarStore((state) => state.isCollapsed)
  const toggleSidebar = useSidebarStore((state) => state.toggleSidebar)

  return (
    <aside
      className={cn(
        'relative flex h-screen shrink-0 flex-col border-r border-zinc-200 bg-zinc-100 transition-[width] duration-200',
        isCollapsed ? 'w-16' : 'w-64',
      )}
    >
      <button
        type="button"
        onClick={toggleSidebar}
        title={isCollapsed ? 'Menüyü genişlet' : 'Menüyü daralt'}
        className="absolute -right-4 top-7 z-10 flex size-8 items-center justify-center rounded-full border border-zinc-300 bg-white text-zinc-600 shadow-sm hover:border-zinc-400 hover:text-zinc-900"
      >
        {isCollapsed ? <ChevronRight className="size-4.5" /> : <ChevronLeft className="size-4.5" />}
      </button>

      <div className="flex items-center gap-2.5 border-b border-zinc-200 px-5 py-5">
        <img src="/logo.png" alt="ChefPos" className="size-11 shrink-0 object-contain" />
        {!isCollapsed && <span className="text-xl font-semibold tracking-tight text-zinc-900">ChefPos</span>}
      </div>

      <nav className="flex flex-1 flex-col gap-1 px-3 py-3">
        {SIDEBAR_ITEMS.map(({ label, icon: Icon, to }) => (
          <NavLink
            key={label}
            to={to}
            title={isCollapsed ? label : undefined}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-2.5 border-l-2 px-3 py-2.5 text-base font-medium transition-colors',
                isActive ? 'border-[#133458] bg-zinc-200 text-zinc-900' : 'border-transparent text-zinc-500 hover:bg-zinc-200/60 hover:text-zinc-900',
              )
            }
          >
            <Icon className="size-5 shrink-0" />
            {!isCollapsed && label}
          </NavLink>
        ))}
      </nav>

      <SidebarUserCard isCollapsed={isCollapsed} />
    </aside>
  )
}
