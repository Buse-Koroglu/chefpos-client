import type { LucideIcon } from 'lucide-react'
import { History, Home, ListOrdered, ShoppingCart } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { SidebarUserCard } from './SidebarUserCard'

interface SidebarItem {
  label: string
  icon: LucideIcon
  to?: string
}
// Cashier sidebar component içerisinde SidebarUserCard'ı da bulundurur

const SIDEBAR_ITEMS: SidebarItem[] = [
  { label: 'Ana Sayfa', icon: Home, to: '/app/home' },
  { label: 'Yeni Sipariş', icon: ShoppingCart, to: '/app/pos' },
  { label: 'Bekleyen Siparişler', icon: ListOrdered, to: '/app/pending-orders' },
  { label: 'Geçmiş Siparişler', icon: History, to: '/app/order-history' },
]

export function CashierSidebar() {
  return (
    <aside className="flex h-screen w-64 shrink-0 flex-col border-r border-zinc-200 bg-zinc-100">
      <div className="flex items-center gap-2 border-b border-zinc-200 px-5 py-5">
        <img src="/logo.png" alt="ChefPos" className="size-8 shrink-0 object-contain" />
        <span className="text-base font-semibold tracking-tight text-zinc-900">ChefPos</span>
      </div>

      <nav className="flex flex-1 flex-col gap-1 px-3 py-3">
        {SIDEBAR_ITEMS.map(({ label, icon: Icon, to }) =>
          to ? (
            <NavLink
              key={label}
              to={to}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-2.5 border-l-2 px-3 py-2 text-sm font-medium transition-colors',
                  isActive  ? 'border-[#133458] bg-zinc-200 text-zinc-900' : 'border-transparent text-zinc-500 hover:bg-zinc-200/60 hover:text-zinc-900',
                )
              }
            >
              <Icon className="size-4" />
              {label}
            </NavLink> ) : ( <span
              key={label}
              className="flex cursor-not-allowed items-center gap-2.5 border-l-2 border-transparent px-3 py-2 text-sm font-medium text-zinc-400"
            >
              <Icon className="size-4" />
              {label}
            </span>
          ),
        )}
      </nav>

      <SidebarUserCard />
    </aside>
  )
}
