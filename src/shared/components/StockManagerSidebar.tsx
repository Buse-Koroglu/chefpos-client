import type { LucideIcon } from 'lucide-react'
import {Archive,Clock3,Home,Wheat} from 'lucide-react'
import { NavLink } from 'react-router-dom'

import { cn } from '@/lib/utils'
import { SidebarUserCard } from '@/shared/components/SidebarUserCard'

interface SidebarItem {
  label: string
  icon: LucideIcon
  to: string
  end?: boolean
}

// Stock Manager Sidebar

const SIDEBAR_ITEMS: SidebarItem[] = [
  { label: 'Genel Bakış', icon: Home, to: '/app/stock-manager', end: true },
  { label: 'Bekleyen Stok Talepleri', icon: Clock3, to: '/app/stock-manager/pending-requests' },
  { label: 'Geçmiş Stok Talepleri', icon: Archive, to: '/app/stock-manager/past-requests' },
  { label: 'Ham Maddeler', icon: Wheat, to: '/app/stock-manager/ingredients' },
]

export function StockManagerSidebar() {
  return (
    <aside className="flex h-screen w-64 shrink-0 flex-col border-r border-zinc-200 bg-zinc-100">
      <div className="flex items-center gap-2 border-b border-zinc-200 px-5 py-5">
        <img src="/logo.png" alt="ChefPos" className="size-8 shrink-0 object-contain" />

        <span className="text-base font-semibold tracking-tight text-zinc-900">ChefPos</span>
      </div>

      <nav className="flex flex-1 flex-col gap-1 px-3 py-3">
        {SIDEBAR_ITEMS.map(({ label, icon: Icon, to, end }) => (
          <NavLink
            key={label}
            to={to}
            end={end}
            className={({ isActive }) =>cn('flex items-center gap-2.5 border-l-2 px-3 py-2 text-sm font-medium transition-colors',
                isActive? 'border-[#133458] bg-zinc-200 text-zinc-900' : 'border-transparent text-zinc-500 hover:bg-zinc-200/60 hover:text-zinc-900',
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
