import type { LucideIcon } from 'lucide-react'
import { History, Home, ListOrdered, LogOut, ShoppingCart } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { cn } from '@/lib/utils'

interface NavItem {
  label: string
  icon: LucideIcon
  to?: string
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Ana Sayfa', icon: Home, to: '/app/home' },
  { label: 'Yeni Sipariş', icon: ShoppingCart, to: '/app/pos' },
  { label: 'Bekleyen Siparişler', icon: ListOrdered, to: '/app/pending-orders' },
  { label: 'Geçmiş Siparişler', icon: History, to: '/app/order-history' },
]

interface CashierSidebarProps {
  locationName: string
  userName: string
  userRole: string
  onLogout: () => void
}

export function CashierSidebar({ locationName, userName, userRole, onLogout }: CashierSidebarProps) {
  return (
    <aside className="flex h-screen w-64 shrink-0 flex-col border-r border-zinc-200 bg-zinc-100">
      <div className="flex items-center gap-2 border-b border-zinc-200 px-5 py-5">
        <img src="/logo.png" alt="ChefPos" className="size-8 shrink-0 object-contain" />
        <span className="text-base font-semibold tracking-tight text-zinc-900">ChefPos</span>
      </div>

      <nav className="flex flex-1 flex-col gap-1 px-3 py-3">
        {NAV_ITEMS.map(({ label, icon: Icon, to }) =>
          to ? (
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
          ) : (
            <span
              key={label}
              className="flex cursor-not-allowed items-center gap-2.5 border-l-2 border-transparent px-3 py-2 text-sm font-medium text-zinc-400"
            >
              <Icon className="size-4" />
              {label}
            </span>
          ),
        )}
      </nav>

      <div className="flex flex-col gap-3 border-t border-zinc-200 px-3 py-4">
        <p className="px-2 text-xs text-zinc-500">{locationName}</p>

        <div className="border border-zinc-200 bg-white px-3 py-2.5">
          <p className="truncate text-sm font-medium text-zinc-900">{userName}</p>
          <p className="mt-0.5 flex items-center gap-1.5 text-xs text-zinc-500">
            <span className="size-1.5 shrink-0 rounded-full bg-green-500" /> {userRole}
          </p>
        </div>

        <button
          type="button"
          onClick={onLogout}
          className="flex items-center gap-2.5 px-3 py-2 text-sm font-medium text-zinc-500 transition-colors hover:bg-zinc-200/60 hover:text-zinc-900"
        >
          <LogOut className="size-4" />
          Çıkış Yap
        </button>
      </div>
    </aside>
  )
}
