import { UtensilsCrossed } from 'lucide-react'
import type { MenuResponseDto } from '@/shared/types/menu'
import { MenuStatusBadge } from './MenuStatusBadge'

interface MenuCardProps {
  menu: MenuResponseDto
  onClick: () => void
}

export function MenuCard({ menu, onClick }: MenuCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex flex-col gap-3 border border-zinc-200 bg-white p-4 text-left transition-colors hover:border-zinc-300"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <UtensilsCrossed className="size-4 shrink-0 text-zinc-400" />
          <p className="font-semibold text-zinc-900">{menu.name}</p>
        </div>
        <MenuStatusBadge isActive={menu.isActive} />
      </div>

      {menu.description && <p className="line-clamp-2 text-xs text-zinc-500">{menu.description}</p>}

      <p className="text-xs text-zinc-500">{menu.products.length} ürün</p>
    </button>
  )
}
