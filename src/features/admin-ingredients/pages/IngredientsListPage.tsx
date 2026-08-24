import { useMemo, useState } from 'react'
import axios from 'axios'
import { Plus } from 'lucide-react'
import { useLocations } from '@/shared/hooks/useLocations'
import { useDebouncedValue } from '@/shared/hooks/useDebouncedValue'
import { AdminSidebar } from '@/shared/components/AdminSidebar'
import { SuperAdminSidebar } from '@/shared/components/SuperAdminSidebar'
import { AdminHeader } from '@/shared/components/AdminHeader'
import { IngredientsSearchInput } from '@/features/admin-ingredients/components/IngredientsSearchInput'
import { IngredientsFiltersBar } from '@/features/admin-ingredients/components/IngredientsFiltersBar'
import { IngredientsTable } from '@/features/admin-ingredients/components/IngredientsTable'
import { IngredientsPagination } from '@/features/admin-ingredients/components/IngredientsPagination'
import { IngredientEditPopup } from '@/features/admin-ingredients/components/IngredientEditPopup'
import { AddIngredientPopup } from '@/features/admin-ingredients/components/AddIngredientPopup'
import { usePagedIngredientsAdmin } from '@/features/admin-ingredients/hooks/usePagedIngredientsAdmin'
import { INGREDIENTS_SEARCH_DEBOUNCE_MS } from '@/features/admin-ingredients/constants'
import type { IngredientStatusFilter } from '@/features/admin-ingredients/types'

function getIngredientsErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status
    if (status === 401 || status === 403) {
      return 'Bu verileri görüntülemek için yönetici yetkisine sahip olmalısınız.'
    }
  }
  return 'Ham madde listesi yüklenemedi. Lütfen tekrar deneyin.'
}

interface IngredientsListPageProps {
  variant?: 'admin' | 'super-admin'
}

export function IngredientsListPage({ variant = 'admin' }: IngredientsListPageProps) {
  const isSuperAdmin = variant === 'super-admin'
  const [searchInput, setSearchInput] = useState('')
  const [locationId, setLocationId] = useState('ALL')
  const [status, setStatus] = useState<IngredientStatusFilter>('ALL')
  const [pageNumber, setPageNumber] = useState(1)
  const [selectedIngredientId, setSelectedIngredientId] = useState<string | null>(null)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)

  const { data: locations = [] } = useLocations()
  const searchTerm = useDebouncedValue(searchInput, INGREDIENTS_SEARCH_DEBOUNCE_MS)

  const { data, isLoading, isFetching, isError, error } = usePagedIngredientsAdmin(
    searchTerm,
    locationId,
    status,
    pageNumber,
  )
  const items = useMemo(() => data?.items ?? [], [data])
  const selectedIngredient = useMemo(
    () => items.find((ingredient) => ingredient.id === selectedIngredientId) ?? null,
    [items, selectedIngredientId],
  )

  function handleSearchChange(value: string) {
    setSearchInput(value)
    setPageNumber(1)
  }

  function handleLocationChange(value: string) {
    setLocationId(value)
    setPageNumber(1)
  }

  function handleStatusChange(value: IngredientStatusFilter) {
    setStatus(value)
    setPageNumber(1)
  }

  return (
    <div className="flex h-screen bg-zinc-50">
      {isSuperAdmin ? <SuperAdminSidebar /> : <AdminSidebar />}

      <div className="flex min-w-0 flex-1 flex-col overflow-y-auto">
        <AdminHeader
          title="Ham Maddeler"
          actions={
            <div className="flex items-center gap-3">
              {isSuperAdmin && (
                <IngredientsFiltersBar
                  locationId={locationId}
                  status={status}
                  locations={locations}
                  onLocationChange={handleLocationChange}
                  onStatusChange={handleStatusChange}
                />
              )}
              {isSuperAdmin && (
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(true)}
                  className="flex items-center gap-1.5 bg-[#133458] px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-[#0f2843]"
                >
                  <Plus className="size-4" />
                  Yeni Ham Madde Ekle
                </button>
              )}
            </div>
          }
        />

        <main className="flex flex-1 flex-col gap-4 p-6">
          {isError && (
            <div className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {getIngredientsErrorMessage(error)}
            </div>
          )}

          <IngredientsSearchInput value={searchInput} onChange={handleSearchChange} />

          <div className="flex flex-1 flex-col">
            <IngredientsTable
              ingredients={items}
              onSelect={setSelectedIngredientId}
              isLoading={isLoading || (isFetching && items.length === 0)}
            />
            <IngredientsPagination
              pageNumber={data?.pageNumber ?? pageNumber}
              totalPages={data?.totalPages ?? 1}
              totalCount={data?.totalCount ?? 0}
              onPageChange={setPageNumber}
            />
          </div>
        </main>
      </div>

      <IngredientEditPopup ingredient={selectedIngredient} onClose={() => setSelectedIngredientId(null)} />
      {isSuperAdmin && (
        <AddIngredientPopup open={isAddModalOpen} locations={locations} onClose={() => setIsAddModalOpen(false)} />
      )}
    </div>
  )
}
