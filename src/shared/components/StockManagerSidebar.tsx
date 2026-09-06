import type { LucideIcon } from 'lucide-react'
import {Archive,ChevronLeft,ChevronRight,Clock3,Home,Wheat} from 'lucide-react'
import { NavLink } from 'react-router-dom'

import { cn } from '@/lib/utils'
import { useSidebarStore } from '@/shared/stores/sidebarStore'
import { useLocationStore } from '@/shared/stores/locationStore'
import { usePendingRequestsByIngredient } from '@/shared/hooks/usePendingRequestsByIngredient'
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

const INGREDIENTS_PATH = '/app/stock-manager/ingredients'

export function StockManagerSidebar() {
  const isCollapsed = useSidebarStore((state) => state.isCollapsed)
  const toggleSidebar = useSidebarStore((state) => state.toggleSidebar)

  const locationId = useLocationStore((state) => state.selectedLocationId) ?? undefined
  const { byIngredientId } = usePendingRequestsByIngredient(locationId)
  const pendingIngredientsCount = byIngredientId.size

  return (
    <aside
      className={cn(
        'relative flex h-screen shrink-0 flex-col border-r border-zinc-200 bg-zinc-100 transition-[width] duration-200',
        isCollapsed ? 'w-16' : 'w-72',
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
        {SIDEBAR_ITEMS.map(({ label, icon: Icon, to, end }) => (
          <NavLink
            key={label}
            to={to}
            end={end}
            title={isCollapsed ? label : undefined}
            className={({ isActive }) =>cn('flex items-center gap-2.5 border-l-2 px-3 py-2.5 text-base font-medium transition-colors',
                isActive? 'border-[#133458] bg-zinc-200 text-zinc-900' : 'border-transparent text-zinc-500 hover:bg-zinc-200/60 hover:text-zinc-900',
              )
            }
          >
            <Icon className="size-5 shrink-0" />
            {!isCollapsed && (
              <span className="flex flex-1 items-center justify-between gap-2">
                <span>{label}</span>
                {to === INGREDIENTS_PATH && pendingIngredientsCount > 0 && (
                  <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-red-500 text-[11px] font-bold text-white">
                    {pendingIngredientsCount}
                  </span>
                )}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      <SidebarUserCard isCollapsed={isCollapsed} />
    </aside>
  )
}
