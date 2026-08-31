import { useMemo, useState } from 'react'
import axios from 'axios'
import { useLocationStore } from '@/shared/stores/locationStore'
import { useLocations } from '@/shared/hooks/useLocations'
import { useDebouncedValue } from '@/shared/hooks/useDebouncedValue'
import { StockManagerSidebar } from '@/shared/components/StockManagerSidebar'
import { StaffHeader } from '@/shared/components/StaffHeader'
import { StockRequestsSearchInput } from '@/features/admin-stock-requests/components/StockRequestsSearchInput'
import { StockRequestsTable } from '@/features/admin-stock-requests/components/StockRequestsTable'
import { StockRequestsPagination } from '@/features/admin-stock-requests/components/StockRequestsPagination'
import { StockRequestDetailPopup } from '@/features/admin-stock-requests/components/StockRequestDetailPopup'
import { STOCK_REQUESTS_SEARCH_DEBOUNCE_MS } from '@/features/admin-stock-requests/constants'
import { useStockManagerPendingRequests } from '../hooks/useStockManagerPendingRequests'

function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status
    if (status === 401 || status === 403) {
      return 'Oturumunuz sona ermiş veya bu sayfayı görüntüleme yetkiniz yok.'
    }
  }
  return 'Stok talepleri yüklenemedi. Lütfen tekrar deneyin.'
}

export function StockManagerPendingRequestsPage() {
  const locationId = useLocationStore((state) => state.selectedLocationId) ?? undefined
  const { data: locations = [] } = useLocations()
  const locationName = locations.find((location) => location.id === locationId)?.name ?? '—'

  const [searchInput, setSearchInput] = useState('')
  const [pageNumber, setPageNumber] = useState(1)
  const [selectedStockRequestId, setSelectedStockRequestId] = useState<string | null>(null)

  const searchTerm = useDebouncedValue(searchInput, STOCK_REQUESTS_SEARCH_DEBOUNCE_MS)

  const { data, isLoading, isFetching, isError, error } = useStockManagerPendingRequests(
    locationId,
    searchTerm,
    pageNumber,
  )

  const items = useMemo(() => data?.items ?? [], [data])
  const selectedStockRequest = useMemo(
    () => items.find((stockRequest) => stockRequest.id === selectedStockRequestId) ?? null,
    [items, selectedStockRequestId],
  )

  function handleSearchChange(value: string) {
    setSearchInput(value)
    setPageNumber(1)
  }

  return (
    <div className="flex h-screen bg-zinc-50">
      <StockManagerSidebar />

      <div className="flex min-w-0 flex-1 flex-col overflow-y-auto">
        <StaffHeader title="Bekleyen Stok Talepleri" locationName={locationName} />

        <main className="flex min-h-0 flex-1 flex-col gap-4 p-4">
          <StockRequestsSearchInput value={searchInput} onChange={handleSearchChange} />

          {isError && (
            <div className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {getErrorMessage(error)}
            </div>
          )}

          <div className="flex min-h-0 flex-1 flex-col">
            <StockRequestsTable
              stockRequests={items}
              onSelect={setSelectedStockRequestId}
              isLoading={isLoading || (isFetching && items.length === 0)}
            />
            <StockRequestsPagination
              pageNumber={data?.pageNumber ?? pageNumber}
              totalPages={data?.totalPages ?? 1}
              totalCount={data?.totalCount ?? 0}
              onPageChange={setPageNumber}
            />
          </div>
        </main>
      </div>

      <StockRequestDetailPopup stockRequest={selectedStockRequest} onClose={() => setSelectedStockRequestId(null)} />
    </div>
  )
}
