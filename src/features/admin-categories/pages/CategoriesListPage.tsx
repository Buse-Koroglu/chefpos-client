import { useMemo, useState } from 'react'
import axios from 'axios'
import { Plus } from 'lucide-react'
import { useLocations } from '@/shared/hooks/useLocations'
import { useDebouncedValue } from '@/shared/hooks/useDebouncedValue'
import { AdminSidebar } from '@/shared/components/AdminSidebar'
import { AdminHeader } from '@/shared/components/AdminHeader'
import { CategoriesSearchInput } from '@/features/admin-categories/components/CategoriesSearchInput'
import { CategoriesFiltersBar } from '@/features/admin-categories/components/CategoriesFiltersBar'
import { CategoriesTable } from '@/features/admin-categories/components/CategoriesTable'
import { CategoriesPagination } from '@/features/admin-categories/components/CategoriesPagination'
import { CategoryEditPopup } from '@/features/admin-categories/components/CategoryEditPopup'
import { AddCategoryPopup } from '@/features/admin-categories/components/AddCategoryPopup'
import { usePagedCategoriesAdmin } from '@/features/admin-categories/hooks/usePagedCategoriesAdmin'
import { CATEGORIES_SEARCH_DEBOUNCE_MS } from '@/features/admin-categories/constants'
import type { CategoryStatusFilter } from '@/features/admin-categories/types'

function getCategoriesErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status
    if (status === 401 || status === 403) {
      return 'Bu verileri görüntülemek için yönetici yetkisine sahip olmalısınız.'
    }
  }
  return 'Kategori listesi yüklenemedi. Lütfen tekrar deneyin.'
}

export function CategoriesListPage() {
  const [searchInput, setSearchInput] = useState('')
  const [locationId, setLocationId] = useState('ALL')
  const [status, setStatus] = useState<CategoryStatusFilter>('ALL')
  const [pageNumber, setPageNumber] = useState(1)
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)

  const { data: locations = [] } = useLocations()
  const searchTerm = useDebouncedValue(searchInput, CATEGORIES_SEARCH_DEBOUNCE_MS)

  const { data, isLoading, isFetching, isError, error } = usePagedCategoriesAdmin(
    searchTerm,
    locationId,
    status,
    pageNumber,
  )
  const items = useMemo(() => data?.items ?? [], [data])
  const selectedCategory = useMemo(
    () => items.find((category) => category.id === selectedCategoryId) ?? null,
    [items, selectedCategoryId],
  )

  function handleSearchChange(value: string) {
    setSearchInput(value)
    setPageNumber(1)
  }

  function handleLocationChange(value: string) {
    setLocationId(value)
    setPageNumber(1)
  }

  function handleStatusChange(value: CategoryStatusFilter) {
    setStatus(value)
    setPageNumber(1)
  }

  return (
    <div className="flex h-screen bg-zinc-50">
      <AdminSidebar />

      <div className="flex min-w-0 flex-1 flex-col overflow-y-auto">
        <AdminHeader
          title="Kategoriler"
          actions={
            <div className="flex items-center gap-3">
              <CategoriesFiltersBar
                locationId={locationId}
                status={status}
                locations={locations}
                onLocationChange={handleLocationChange}
                onStatusChange={handleStatusChange}
              />
              <button
                type="button"
                onClick={() => setIsAddModalOpen(true)}
                className="flex items-center gap-1.5 bg-[#133458] px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-[#0f2843]"
              >
                <Plus className="size-4" />
                Yeni Kategori Ekle
              </button>
            </div>
          }
        />

        <main className="flex flex-1 flex-col gap-4 p-6">
          {isError && (
            <div className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {getCategoriesErrorMessage(error)}
            </div>
          )}

          <CategoriesSearchInput value={searchInput} onChange={handleSearchChange} />

          <div className="flex flex-1 flex-col">
            <CategoriesTable
              categories={items}
              onSelect={setSelectedCategoryId}
              isLoading={isLoading || (isFetching && items.length === 0)}
            />
            <CategoriesPagination
              pageNumber={data?.pageNumber ?? pageNumber}
              totalPages={data?.totalPages ?? 1}
              totalCount={data?.totalCount ?? 0}
              onPageChange={setPageNumber}
            />
          </div>
        </main>
      </div>

      <CategoryEditPopup category={selectedCategory} locations={locations} onClose={() => setSelectedCategoryId(null)} />
      <AddCategoryPopup open={isAddModalOpen} locations={locations} onClose={() => setIsAddModalOpen(false)} />
    </div>
  )
}
