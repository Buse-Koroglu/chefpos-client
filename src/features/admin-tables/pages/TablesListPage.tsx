import { useMemo, useState } from 'react'
import axios from 'axios'
import { Plus } from 'lucide-react'
import { toast } from 'sonner'
import { useLocations } from '@/shared/hooks/useLocations'
import { useDebouncedValue } from '@/shared/hooks/useDebouncedValue'
import { AdminSidebar } from '@/shared/components/AdminSidebar'
import { AdminHeader } from '@/shared/components/AdminHeader'
import { ExportButton } from '@/shared/components/ExportButton'
import { downloadBlob } from '@/shared/lib/downloadBlob'
import { exportTables } from '@/shared/api/endpoints/tables'
import { TablesSearchInput } from '@/features/admin-tables/components/TablesSearchInput'
import { TablesFiltersBar } from '@/features/admin-tables/components/TablesFiltersBar'
import { TablesTable } from '@/features/admin-tables/components/TablesTable'
import { TablesPagination } from '@/features/admin-tables/components/TablesPagination'
import { TableEditPopup } from '@/features/admin-tables/components/TableEditPopup'
import { AddTablePopup } from '@/features/admin-tables/components/AddTablePopup'
import { usePagedTablesAdmin } from '@/features/admin-tables/hooks/usePagedTablesAdmin'
import { TABLES_SEARCH_DEBOUNCE_TIME } from '@/features/admin-tables/constants'
import type { TableStatusFilter } from '@/features/admin-tables/types'

function toIsActiveParam(status: TableStatusFilter): boolean | undefined {
  if (status === 'ACTIVE') return true
  if (status === 'INACTIVE') return false
  return undefined
}

function getTablesErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status
    if (status === 401 || status === 403) {
      return 'Bu verileri görüntülemek için yönetici yetkisine sahip olmalısınız.'
    }
  }
  return 'Masa listesi yüklenemedi. Lütfen tekrar deneyin.'
}

export function TablesListPage() {
  const [searchInput, setSearchInput] = useState('')
  const [locationId, setLocationId] = useState('ALL')
  const [status, setStatus] = useState<TableStatusFilter>('ALL')
  const [pageNumber, setPageNumber] = useState(1)
  const [selectedTableId, setSelectedTableId] = useState<string | null>(null)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)

  const { data: locations = [] } = useLocations()
  const locationsById = useMemo(() => new Map(locations.map((location) => [location.id, location.name])), [locations])
  const searchTerm = useDebouncedValue(searchInput, TABLES_SEARCH_DEBOUNCE_TIME)

  const { data, isLoading, isFetching, isError, error } = usePagedTablesAdmin(searchTerm, locationId, status, pageNumber)
  const items = useMemo(() => data?.items ?? [], [data])
  const selectedTable = useMemo(() => items.find((table) => table.id === selectedTableId) ?? null, [items, selectedTableId])

  function handleSearchChange(value: string) {
    setSearchInput(value)
    setPageNumber(1)
  }

  function handleLocationChange(value: string) {
    setLocationId(value)
    setPageNumber(1)
  }

  function handleStatusChange(value: TableStatusFilter) {
    setStatus(value)
    setPageNumber(1)
  }

  return (
    <div className="flex h-screen bg-zinc-50">
      <AdminSidebar />

      <div className="flex min-w-0 flex-1 flex-col overflow-y-auto">
        <AdminHeader
          title="Masalar"
          actions={
            <div className="flex items-center gap-3">
              <TablesFiltersBar
                locationId={locationId}
                status={status}
                locations={locations}
                onLocationChange={handleLocationChange}
                onStatusChange={handleStatusChange}
              />
              <ExportButton
                onExport={async () => {
                  if ((data?.totalCount ?? 0) === 0) {
                    toast.error('Export edilecek kayıt bulunamadı.')
                    return
                  }
                  const blob = await exportTables({
                    searchTerm: searchTerm || undefined,
                    locationId: locationId === 'ALL' ? undefined : locationId,
                    isActive: toIsActiveParam(status),
                  })
                  downloadBlob(blob, `masalar_${new Date().toISOString().slice(0, 10)}.xlsx`)
                }}
              />
              <button
                type="button"
                onClick={() => setIsAddModalOpen(true)}
                className="flex items-center gap-1.5 bg-[#133458] px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-[#0f2843]"
              >
                <Plus className="size-4" />
                Yeni Masa Ekle
              </button>
            </div>
          }
        />

        <main className="flex flex-1 flex-col gap-4 p-6">
          {isError && (
            <div className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {getTablesErrorMessage(error)}
            </div>
          )}

          <TablesSearchInput value={searchInput} onChange={handleSearchChange} />

          <div className="flex flex-1 flex-col">
            <TablesTable
              tables={items}
              locationsById={locationsById}
              onSelect={setSelectedTableId}
              isLoading={isLoading || (isFetching && items.length === 0)}
            />
            <TablesPagination
              pageNumber={data?.pageNumber ?? pageNumber}
              totalPages={data?.totalPages ?? 1}
              totalCount={data?.totalCount ?? 0}
              onPageChange={setPageNumber}
            />
          </div>
        </main>
      </div>

      <TableEditPopup
        table={selectedTable}
        locationName={selectedTable ? (locationsById.get(selectedTable.locationId) ?? '—') : ''}
        onClose={() => setSelectedTableId(null)}
      />
      <AddTablePopup open={isAddModalOpen} locations={locations} onClose={() => setIsAddModalOpen(false)} />
    </div>
  )
}
