import { useMemo, useState } from 'react'
import axios from 'axios'
import { useQueryClient } from '@tanstack/react-query'
import { Plus } from 'lucide-react'
import { toast } from 'sonner'
import { SuperAdminSidebar } from '@/shared/components/SuperAdminSidebar'
import { AdminHeader } from '@/shared/components/AdminHeader'
import { SearchInput } from '@/shared/components/SearchInput'
import { useLocations } from '@/shared/hooks/useLocations'
import { useDebouncedValue } from '@/shared/hooks/useDebouncedValue'
import { removeRole } from '@/shared/api/endpoints/users'
import { getApiErrorMessage } from '@/shared/api/apiError'
import { SuperAdminUsersTable } from '@/features/super-admin-users/components/SuperAdminUsersTable'
import { SuperAdminUsersPagination } from '@/features/super-admin-users/components/SuperAdminUsersPagination'
import { PromoteToAdminPopup } from '@/features/super-admin-users/components/PromoteToAdminPopup'
import { AddAdminPopup } from '@/features/super-admin-users/components/AddAdminPopup'
import { UserDetailPopup } from '@/features/super-admin-users/components/UserDetailPopup'
import { usePagedSuperAdminUsers } from '@/features/super-admin-users/hooks/usePagedSuperAdminUsers'

const SEARCH_DEBOUNCE_MS = 400

function getUsersErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status
    if (status === 401 || status === 403) {
      return 'Bu verileri görüntülemek için süper yönetici yetkisine sahip olmalısınız.'
    }
  }
  return 'Kullanıcı listesi yüklenemedi. Lütfen tekrar deneyin.'
}

export function SuperAdminUsersPage() {
  const queryClient = useQueryClient()
  const [searchInput, setSearchInput] = useState('')
  const [pageNumber, setPageNumber] = useState(1)
  const [promoteUserId, setPromoteUserId] = useState<string | null>(null)
  const [demotingUserId, setDemotingUserId] = useState<string | null>(null)
  const [isAddAdminOpen, setIsAddAdminOpen] = useState(false)
  const [detailUserId, setDetailUserId] = useState<string | null>(null)

  const { data: locations = [] } = useLocations()
  const locationsById = useMemo(() => new Map(locations.map((location) => [location.id, location.name])), [locations])

  const searchTerm = useDebouncedValue(searchInput, SEARCH_DEBOUNCE_MS)
  const { data, isLoading, isFetching, isError, error } = usePagedSuperAdminUsers(searchTerm, pageNumber)
  const items = useMemo(() => data?.items ?? [], [data])
  const promoteUser = items.find((user) => user.id === promoteUserId) ?? null
  const detailUser = items.find((user) => user.id === detailUserId) ?? null

  function handleSearchChange(value: string) {
    setSearchInput(value)
    setPageNumber(1)
  }

  async function handleDemote(userId: string) {
    setDemotingUserId(userId)
    try {
      await removeRole(userId, 'ADMIN')
      queryClient.invalidateQueries({ queryKey: ['users'], exact: false })
      toast.success('Kullanıcı yöneticilik indirildi.')
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Kullanıcı yöneticilik indirilemedi.'))
    } finally {
      setDemotingUserId(null)
    }
  }

  return (
    <div className="flex h-screen bg-zinc-50">
      <SuperAdminSidebar />

      <div className="flex min-w-0 flex-1 flex-col overflow-y-auto">
        <AdminHeader
          title="Personeller"
          actions={
            <button
              type="button"
              onClick={() => setIsAddAdminOpen(true)}
              className="flex items-center gap-1.5 bg-[#133458] px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-[#0f2843]"
            >
              <Plus className="size-4" />
              Yeni Yönetici Ekle
            </button>
          }
        />

        <main className="flex flex-1 flex-col gap-4 p-6">
          {isError && (
            <div className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {getUsersErrorMessage(error)}
            </div>
          )}

          <SearchInput value={searchInput} onChange={handleSearchChange} placeholder="Ad, soyad veya personel no ile arayın" />

          <div className="flex flex-1 flex-col">
            <SuperAdminUsersTable
              users={items}
              locationsById={locationsById}
              isLoading={isLoading || (isFetching && items.length === 0)}
              onSelect={setDetailUserId}
              onPromote={setPromoteUserId}
              onDemote={handleDemote}
              demotingUserId={demotingUserId}
            />
            <SuperAdminUsersPagination
              pageNumber={data?.pageNumber ?? pageNumber}
              totalPages={data?.totalPages ?? 1}
              totalCount={data?.totalCount ?? 0}
              onPageChange={setPageNumber}
            />
          </div>
        </main>
      </div>

      <PromoteToAdminPopup
        userId={promoteUserId}
        userName={promoteUser ? `${promoteUser.firstName} ${promoteUser.lastName}` : ''}
        locations={locations}
        onClose={() => setPromoteUserId(null)}
      />
      <AddAdminPopup open={isAddAdminOpen} locations={locations} onClose={() => setIsAddAdminOpen(false)} />
      <UserDetailPopup user={detailUser} locationsById={locationsById} onClose={() => setDetailUserId(null)} />
    </div>
  )
}
