import { useMemo, useState } from 'react'
import axios from 'axios'
import { cn } from '@/lib/utils'
import { useLocationStore } from '@/shared/stores/locationStore'
import { useLocations } from '@/shared/hooks/useLocations'
import { useDebouncedValue } from '@/shared/hooks/useDebouncedValue'
import { InventorySidebar } from '@/shared/components/InventorySidebar'
import { StaffHeader } from '@/shared/components/StaffHeader'
import { Pagination } from '@/shared/components/Pagination'
import { StockRequestsSearchInput } from '@/features/admin-stock-requests/components/StockRequestsSearchInput'
import { StockRequestsTable } from '@/features/admin-stock-requests/components/StockRequestsTable'
import { StockRequestDetailPopup } from '@/features/admin-stock-requests/components/StockRequestDetailPopup'
import { STOCK_REQUESTS_SEARCH_DEBOUNCE_TIME } from '@/features/admin-stock-requests/constants'
import { useMyStockRequests } from '../hooks/useMyStockRequests'
import type { MyStockRequestsTab } from '../types'
import { useMyStockRequestsCount } from '../hooks/useMyStockRequestCount'

const TABS: Array<{ value: MyStockRequestsTab; label: string }> = [
  { value: 'PENDING', label: 'Bekleyen Stok Taleplerim' },
  { value: 'HISTORY', label: 'Geçmiş Stok Taleplerim' },
]

function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status
    if (status === 401 || status === 403) {
      return 'Oturumunuz sona ermiş veya bu sayfayı görüntüleme yetkiniz yok.'
    }
  }
  return 'Stok talepleri yüklenemedi. Lütfen tekrar deneyin.'
}

export function MyStockRequestsPage() {
  const locationId = useLocationStore((state) => state.selectedLocationId) ?? undefined
  const { data: locations = [] } = useLocations()
  const locationName = locations.find((location) => location.id === locationId)?.name ?? '—'

  const [tab, setTab] = useState<MyStockRequestsTab>('PENDING')
  const [searchInput, setSearchInput] = useState('')
  const [pageNumber, setPageNumber] = useState(1)
  const [selectedStockRequestId, setSelectedStockRequestId] = useState<string | null>(null)

  const searchTerm = useDebouncedValue(searchInput, STOCK_REQUESTS_SEARCH_DEBOUNCE_TIME)

  const { data, isLoading, isFetching, isError, error } = useMyStockRequests(locationId, tab, searchTerm, pageNumber)
  const { total: tabRequestCount } = useMyStockRequestsCount(locationId, tab)

  const items = useMemo(() => data?.items ?? [], [data])
  const selectedStockRequest = useMemo(
    () => items.find((stockRequest) => stockRequest.id === selectedStockRequestId) ?? null,
    [items, selectedStockRequestId],
  )

  function handleTabChange(nextTab: MyStockRequestsTab) {
    setTab(nextTab)
    setPageNumber(1)
  }

  function handleSearchChange(value: string) {
    setSearchInput(value)
    setPageNumber(1)
  }

  return (
    <div className="flex h-screen bg-zinc-50">
      <InventorySidebar />

      <div className="flex min-w-0 flex-1 flex-col overflow-y-auto">
        <StaffHeader title="Stok Taleplerim" locationName={locationName} />

        <main className="flex min-h-0 flex-1 flex-col gap-4 p-4">
          <div className="flex border border-zinc-200 bg-white">
            {TABS.map((tabItem) => (
              <button
                key={tabItem.value}
                type="button"
                onClick={() => handleTabChange(tabItem.value)}
                className={cn(
                  'flex-1 border-b-2 px-4 py-2.5 text-sm font-medium transition-colors',
                  tab === tabItem.value ? 'border-[#133458] bg-zinc-50 text-zinc-900' : 'border-transparent text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900',
                )}
              >
                {tabItem.label}
                {tab === tabItem.value && (
                  <span className="ml-1.5 inline-flex items-center border border-zinc-300 bg-white px-1.5 py-0.5 text-xs font-semibold text-zinc-700">
                    {tabRequestCount}
                  </span>
                )}
              </button>
            ))}
          </div>

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
            <Pagination
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