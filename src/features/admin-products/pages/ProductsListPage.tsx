import { useState } from 'react'
import axios from 'axios'
import { Plus } from 'lucide-react'
import { toast } from 'sonner'
import { useLocations } from '@/shared/hooks/useLocations'
import { useDebouncedValue } from '@/shared/hooks/useDebouncedValue'
import { AdminSidebar } from '@/shared/components/AdminSidebar'
import { SuperAdminSidebar } from '@/shared/components/SuperAdminSidebar'
import { AdminHeader } from '@/shared/components/AdminHeader'
import { ExportButton } from '@/shared/components/ExportButton'
import { downloadBlob } from '@/shared/lib/downloadBlob'
import { exportProducts } from '@/shared/api/endpoints/products'
import { ProductsSearchInput } from '@/features/admin-products/components/ProductsSearchInput'
import { ProductsFiltersBar } from '@/features/admin-products/components/ProductsFiltersBar'
import { ProductsTable } from '@/features/admin-products/components/ProductsTable'
import { ProductsPagination } from '@/features/admin-products/components/ProductsPagination'
import { ProductEditPopup } from '@/features/admin-products/components/ProductEditPopup'
import { AddProductPopup } from '@/features/admin-products/components/AddProductPopup'
import { usePagedProductsAdmin } from '@/features/admin-products/hooks/usePagedProductsAdmin'
import { useActiveCategories } from '@/features/admin-products/hooks/useActiveCategories'
import { PRODUCTS_SEARCH_DEBOUNCE_MS } from '@/features/admin-products/constants'
import type { ProductStatusFilter } from '@/features/admin-products/types'

function toIsActiveParam(status: ProductStatusFilter): boolean | undefined {
  if (status === 'ACTIVE') return true
  if (status === 'INACTIVE') return false
  return undefined
}

function getProductsErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status
    if (status === 401 || status === 403) {
      return 'Bu verileri görüntülemek için yönetici yetkisine sahip olmalısınız.'
    }
  }
  return 'Ürün listesi yüklenemedi. Lütfen tekrar deneyin.'
}

interface ProductsListPageProps {
  variant?: 'admin' | 'super-admin'
}

export function ProductsListPage({ variant = 'admin' }: ProductsListPageProps) {
  const isSuperAdmin = variant === 'super-admin'
  const [searchInput, setSearchInput] = useState('')
  const [locationId, setLocationId] = useState('ALL')
  const [status, setStatus] = useState<ProductStatusFilter>('ALL')
  const [pageNumber, setPageNumber] = useState(1)
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)

  const { data: locations = [] } = useLocations()
  const { data: categories = [] } = useActiveCategories()
  const searchTerm = useDebouncedValue(searchInput, PRODUCTS_SEARCH_DEBOUNCE_MS)

  const { data, isLoading, isFetching, isError, error } = usePagedProductsAdmin(
    searchTerm,
    locationId,
    status,
    pageNumber,
  )
  const items = data?.items ?? []

  function handleSearchChange(value: string) {
    setSearchInput(value)
    setPageNumber(1)
  }

  function handleLocationChange(value: string) {
    setLocationId(value)
    setPageNumber(1)
  }

  function handleStatusChange(value: ProductStatusFilter) {
    setStatus(value)
    setPageNumber(1)
  }

  return (
    <div className="flex h-screen bg-zinc-50">
      {isSuperAdmin ? <SuperAdminSidebar /> : <AdminSidebar />}

      <div className="flex min-w-0 flex-1 flex-col overflow-y-auto">
        <AdminHeader
          title="Ürünler"
          actions={
            <div className="flex items-center gap-3">
              {isSuperAdmin && (
                <ProductsFiltersBar
                  locationId={locationId}
                  status={status}
                  locations={locations}
                  onLocationChange={handleLocationChange}
                  onStatusChange={handleStatusChange}
                />
              )}
              <ExportButton
                onExport={async () => {
                  if ((data?.totalCount ?? 0) === 0) {
                    toast.error('Export edilecek kayıt bulunamadı.')
                    return
                  }
                  const blob = await exportProducts({
                    searchTerm: searchTerm || undefined,
                    locationId: locationId === 'ALL' ? undefined : locationId,
                    isActive: toIsActiveParam(status),
                    includeUncategorized: true,
                  })
                  downloadBlob(blob, `urunler_${new Date().toISOString().slice(0, 10)}.xlsx`)
                }}
              />
              {isSuperAdmin && (
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(true)}
                  className="flex items-center gap-1.5 bg-[#133458] px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-[#0f2843]"
                >
                  <Plus className="size-4" />
                  Yeni Ürün Ekle
                </button>
              )}
            </div>
          }
        />

        <main className="flex flex-1 flex-col gap-4 p-6">
          {isError && (
            <div className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {getProductsErrorMessage(error)}
            </div>
          )}

          <ProductsSearchInput value={searchInput} onChange={handleSearchChange} />

          <div className="flex flex-1 flex-col">
            <ProductsTable
              products={items}
              onSelect={setSelectedProductId}
              isLoading={isLoading || (isFetching && items.length === 0)}
            />
            <ProductsPagination
              pageNumber={data?.pageNumber ?? pageNumber}
              totalPages={data?.totalPages ?? 1}
              totalCount={data?.totalCount ?? 0}
              onPageChange={setPageNumber}
            />
          </div>
        </main>
      </div>

      <ProductEditPopup
        productId={selectedProductId}
        locations={locations}
        categories={categories}
        canEditLocations={isSuperAdmin}
        onClose={() => setSelectedProductId(null)}
      />
      {isSuperAdmin && (
        <AddProductPopup open={isAddModalOpen} locations={locations} onClose={() => setIsAddModalOpen(false)} />
      )}
    </div>
  )
}
