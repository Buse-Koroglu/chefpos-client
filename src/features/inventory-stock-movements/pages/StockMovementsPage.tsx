import { useState } from 'react'
import { Minus, PackagePlus } from 'lucide-react'

import { cn } from '@/lib/utils'
import { InventorySidebar } from '@/shared/components/InventorySidebar'
import { CashierHeader } from '@/shared/components/CashierHeader'
import { Pagination } from '@/shared/components/Pagination'
import { useLocations } from '@/shared/hooks/useLocations'
import { useLocationStore } from '@/shared/stores/locationStore'
import { STOCK_MOVEMENT_TYPES, STOCK_MOVEMENT_TYPE_LABELS } from '@/shared/types/stockMovement'
import type { StockMovementType } from '@/shared/types/stockMovement'

import { StockMovementsTable } from '../components/StockMovementsTable'
import { ManualDeductionPopup } from '../components/ManualDeductionPopup'
import { RecordProductionPopup } from '../components/RecordProductionPopup'
import { useStockMovements } from '../hooks/useStockMovements'

const FIELD_CLASSNAME =
  'h-10 rounded-none border border-zinc-200 bg-white px-3 text-sm text-zinc-900 outline-none transition-colors focus-visible:border-zinc-400'

export function StockMovementsPage() {
  const locationId = useLocationStore((state) => state.selectedLocationId) ?? undefined
  const { data: locations = [] } = useLocations()
  const locationName = locations.find((location) => location.id === locationId)?.name ?? '—'

  const [type, setType] = useState<StockMovementType | 'ALL'>('ALL')
  const [pageNumber, setPageNumber] = useState(1)
  const [isDeductionOpen, setIsDeductionOpen] = useState(false)
  const [isProductionOpen, setIsProductionOpen] = useState(false)

  const { data, isLoading, isFetching } = useStockMovements(
    locationId,
    type === 'ALL' ? undefined : type,
    pageNumber,
  )

  const items = data?.items ?? []

  function handleTypeChange(value: string) {
    setType(value as StockMovementType | 'ALL')
    setPageNumber(1)
  }

  return (
    <div className="flex h-screen bg-zinc-50">
      <InventorySidebar />

      <div className="flex min-w-0 flex-1 flex-col overflow-y-auto">
        <CashierHeader title="Stok Hareketleri" locationName={locationName} />

        <main className="flex min-h-0 flex-1 flex-col gap-4 p-4">
          <div className="flex flex-col gap-4 sm:flex-row">
            <button
              type="button"
              onClick={() => setIsDeductionOpen(true)}
              className="group flex flex-1 items-center justify-between gap-4 border-2 border-zinc-300 bg-white p-5 text-left transition-colors hover:border-zinc-400 hover:bg-zinc-50"
            >
              <div className="flex items-center gap-4">
                <span className="flex size-11 shrink-0 items-center justify-center bg-destructive text-white">
                  <Minus className="size-5" />
                </span>
                <div>
                  <p className="text-base font-semibold text-zinc-800">Elden Düşüm</p>
                  <p className="text-sm text-zinc-500">Fire, zayiat veya elle stok düşümü kaydet</p>
                </div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setIsProductionOpen(true)}
              className="group flex flex-1 items-center justify-between gap-4 border-2 border-zinc-300 bg-white p-5 text-left transition-colors hover:border-zinc-400 hover:bg-zinc-50"
            >
              <div className="flex items-center gap-4">
                <span className="flex size-11 shrink-0 items-center justify-center bg-[#133458] text-white">
                  <PackagePlus className="size-5" />
                </span>
                <div>
                  <p className="text-base font-semibold text-zinc-800">Üretim Kaydet</p>
                  <p className="text-sm text-zinc-500">Sipariş dışı ürün üretimi kaydet</p>
                </div>
              </div>
            </button>
          </div>

          <div className="flex items-center justify-between">
            <h2 className="text-xs font-semibold tracking-wider text-zinc-500 uppercase">Hareket Geçmişi</h2>
            <select value={type} onChange={(event) => handleTypeChange(event.target.value)} className={cn(FIELD_CLASSNAME)}>
              <option value="ALL">Tümü</option>
              {STOCK_MOVEMENT_TYPES.map((option) => (
                <option key={option} value={option}>
                  {STOCK_MOVEMENT_TYPE_LABELS[option]}
                </option>
              ))}
            </select>
          </div>

          <div className="flex min-h-0 flex-1 flex-col">
            <StockMovementsTable movements={items} isLoading={isLoading || (isFetching && items.length === 0)} />
            <Pagination
              pageNumber={data?.pageNumber ?? pageNumber}
              totalPages={data?.totalPages ?? 1}
              totalCount={data?.totalCount ?? 0}
              onPageChange={setPageNumber}
            />
          </div>
        </main>
      </div>

      <ManualDeductionPopup open={isDeductionOpen} onClose={() => setIsDeductionOpen(false)} />
      <RecordProductionPopup open={isProductionOpen} onClose={() => setIsProductionOpen(false)} />
    </div>
  )
}
