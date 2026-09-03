import { useMemo, useRef, useState } from 'react'

import { StaffHeader } from '@/shared/components/StaffHeader'
import { StockManagerSidebar } from '@/shared/components/StockManagerSidebar'
import { IngredientCard } from '@/shared/components/IngredientCard'
import { SearchInput } from '@/shared/components/SearchInput'
import { Skeleton } from '@/shared/components/Skeleton'
import { useLocations } from '@/shared/hooks/useLocations'
import { useLocationStore } from '@/shared/stores/locationStore'
import { useDebouncedValue } from '@/shared/hooks/useDebouncedValue'
import { useInfiniteScrollTrigger } from '@/shared/hooks/useInfiniteScrollTrigger'
import { useIngredientsPaged } from '@/features/inventory-dashboard/hooks/useIngredientsPaged'
import { StockRequestDetailPopup } from '@/features/admin-stock-requests/components/StockRequestDetailPopup'
import { RecordIngredientPurchasePopup } from '@/features/admin-ingredients/components/RecordIngredientPurchasePopup'
import type { IngredientAdminResponseDto } from '@/shared/types/ingredient'

import { usePendingRequestsByIngredient } from '../hooks/usePendingRequestsByIngredient'

export function StockManagerIngredientsPage() {
  const locationId = useLocationStore((state) => state.selectedLocationId) ?? undefined
  const { data: locations = [] } = useLocations()
  const locationName = locations.find((location) => location.id === locationId)?.name ?? '—'

  const [searchInput, setSearchInput] = useState('')
  const debouncedSearch = useDebouncedValue(searchInput, 400)

  const [pageNumber, setPageNumber] = useState(1)
  const [collectedItems, setCollectedItems] = useState<IngredientAdminResponseDto[]>([])

  const filterKey = `${locationId ?? ''}|${debouncedSearch}`
  const [lastFilterKey, setLastFilterKey] = useState(filterKey)
  if (filterKey !== lastFilterKey) {
    setLastFilterKey(filterKey)
    setPageNumber(1)
    setCollectedItems([])
  }

  const { data: ingredientsPage, isLoading, isFetching } = useIngredientsPaged(locationId, debouncedSearch, pageNumber)

  const [lastMergedPage, setLastMergedPage] = useState<typeof ingredientsPage>(undefined)
  if (ingredientsPage && ingredientsPage !== lastMergedPage && filterKey === lastFilterKey) {
    setLastMergedPage(ingredientsPage)
    setCollectedItems((current) =>
      ingredientsPage.pageNumber === 1 ? ingredientsPage.items : [...current, ...ingredientsPage.items],
    )
  }

  const hasMore = Boolean(ingredientsPage) && ingredientsPage!.pageNumber < ingredientsPage!.totalPages

  const scrollRef = useRef<HTMLDivElement>(null)
  const sentinelRef = useInfiniteScrollTrigger({
    rootRef: scrollRef,
    hasMore,
    isLoading: isFetching,
    onLoadMore: () => setPageNumber((current) => current + 1),
  })

  const { data: pendingRequestsData, byIngredientId } = usePendingRequestsByIngredient(locationId)

  const [purchaseIngredient, setPurchaseIngredient] = useState<IngredientAdminResponseDto | null>(null)
  const [selectedStockRequestId, setSelectedStockRequestId] = useState<string | null>(null)

  const pendingItems = pendingRequestsData?.items ?? []
  const selectedStockRequest = useMemo(
    () => pendingItems.find((request) => request.id === selectedStockRequestId) ?? null,
    [pendingItems, selectedStockRequestId],
  )

  function handleCardClick(ingredient: IngredientAdminResponseDto) {
    const pendingRequest = byIngredientId.get(ingredient.id)
    if (pendingRequest) {
      setSelectedStockRequestId(pendingRequest.id)
    } else {
      setPurchaseIngredient(ingredient)
    }
  }

  return (
    <div className="flex h-screen bg-zinc-50">
      <StockManagerSidebar />

      <div ref={scrollRef} className="flex min-w-0 flex-1 flex-col overflow-y-auto">
        <StaffHeader title="Ham Maddeler" locationName={locationName} />

        <main className="flex flex-1 flex-col gap-4 p-6">
          <p className="text-xs text-zinc-500">
            Bekleyen stok talebi olan ham maddelere tıklayarak talebi onaylayabilir/reddedebilirsiniz. Talebi
            olmayan bir ham maddeye tıkladığınızda doğrudan parti alışı ekleyebilirsiniz.
          </p>

          <SearchInput value={searchInput} onChange={setSearchInput} placeholder="Ham madde adına göre arayın" />

          {isLoading ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, index) => (
                <Skeleton key={index} className="h-36 w-full" />
              ))}
            </div>
          ) : collectedItems.length === 0 ? (
            <div className="flex flex-1 items-center justify-center border border-zinc-200 bg-white py-16 text-sm text-zinc-500">
              {debouncedSearch ? 'Aradığınız kriterlere uygun ham madde bulunamadı.' : 'Bu yerleşkede kayıtlı ham madde bulunamadı.'}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {collectedItems.map((ingredient) => (
                  <IngredientCard
                    key={ingredient.id}
                    ingredient={ingredient}
                    hasPendingRequest={byIngredientId.has(ingredient.id)}
                    onClick={() => handleCardClick(ingredient)}
                  />
                ))}
              </div>

              <div ref={sentinelRef} className="h-1" />

              {isFetching && pageNumber > 1 && (
                <p className="py-3 text-center text-sm text-zinc-400">Yükleniyor...</p>
              )}
            </>
          )}
        </main>
      </div>

      <StockRequestDetailPopup stockRequest={selectedStockRequest} onClose={() => setSelectedStockRequestId(null)} />

      {purchaseIngredient && (
        <RecordIngredientPurchasePopup
          open={Boolean(purchaseIngredient)}
          ingredientId={purchaseIngredient.id}
          ingredientName={purchaseIngredient.name}
          onClose={() => setPurchaseIngredient(null)}
        />
      )}
    </div>
  )
}
