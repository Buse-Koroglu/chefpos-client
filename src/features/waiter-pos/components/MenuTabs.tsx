import type { MenuResponseDto } from '@/shared/types/menu'

interface MenuTabsProps {
  menus: MenuResponseDto[]
  selectedMenuId: string
  onSelect: (menuId: string) => void
}

export function MenuTabs({ menus, selectedMenuId, onSelect }: MenuTabsProps) {
  if (menus.length === 0) return null

  const allTab = { id: '', name: 'Ürünler' }

  return (
    <div className="scrollbar-hide flex gap-2 overflow-x-auto border-b border-zinc-200 bg-white px-3 py-2">
      {[allTab, ...menus].map((menu) => (
        <button
          key={menu.id}
          type="button"
          onClick={() => onSelect(menu.id)}
          className={`shrink-0 whitespace-nowrap border px-3 py-1.5 text-xs font-medium ${
            selectedMenuId === menu.id
              ? 'border-zinc-700 bg-[#133458] text-white'
              : 'border-zinc-200 bg-white text-zinc-600'
          }`}
        >
          {menu.name}
        </button>
      ))}
    </div>
  )
}
