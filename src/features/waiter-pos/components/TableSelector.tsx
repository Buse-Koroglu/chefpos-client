import { useState } from 'react'
import { ChevronDown, ShoppingBag } from 'lucide-react'
import type { Table } from '../types'

interface TableSelectorProps {
  tables: Table[]
  selectedTableId: string | null
  isPackage: boolean
  onSelect: (tableId: string) => void
  onSelectPackage: () => void
}

export function TableSelector({ tables, selectedTableId, isPackage, onSelect, onSelectPackage }: TableSelectorProps) {
  const [open, setOpen] = useState(false)
  const selected = tables.find((t) => t.id === selectedTableId)

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex h-11 w-full items-center justify-between border border-zinc-300 bg-white px-3 text-sm text-zinc-900"
      >
        <span>{isPackage ? 'Paket' : selected ? `Masa ${selected.tableNumber}` : 'Masa Seçin'}</span>
        <ChevronDown className="size-4 text-zinc-400" />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end" onClick={() => setOpen(false)}>
          <div className="absolute inset-0 bg-black/40" />
          <div
            className="relative max-h-[70vh] w-full overflow-y-auto border-t border-zinc-300 bg-white"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="border-b border-zinc-200 px-4 py-3 text-xs font-semibold tracking-wide text-zinc-500 uppercase">
              Masa Seçin
            </p>
            <button
              type="button"
              onClick={() => {
                onSelectPackage()
                setOpen(false)
              }}
              className={`flex w-full items-center gap-2 border-b border-zinc-100 px-4 py-3 text-sm font-medium ${
                isPackage ? 'bg-[#133458] text-white' : 'text-[#133458]'
              }`}
            >
              <ShoppingBag className="size-4" />
              Paket (Masasız Sipariş)
            </button>
            {tables.map((table) => (
              <button
                key={table.id}
                type="button"
                onClick={() => {
                  onSelect(table.id)
                  setOpen(false)
                }}
                className={`flex w-full items-center justify-between border-b border-zinc-100 px-4 py-3 text-sm ${
                  !isPackage && table.id === selectedTableId ? 'bg-zinc-900 text-white' : 'text-zinc-900'
                }`}
              >
                Masa {table.tableNumber}
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  )
}
