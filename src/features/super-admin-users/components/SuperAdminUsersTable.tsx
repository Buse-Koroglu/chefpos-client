import type { UserResponseDto } from '@/shared/types/auth'
import { Skeleton } from '@/shared/components/Skeleton'
import { RoleBadge } from '@/features/admin-staff/components/RoleBadge'
import { StatusBadge } from '@/features/admin-staff/components/StatusBadge'

interface SuperAdminUsersTableProps {
  users: UserResponseDto[]
  locationsById: Map<string, string>
  isLoading?: boolean
  onSelect: (userId: string) => void
  onPromote: (userId: string) => void
  onDemote: (userId: string) => void
  demotingUserId: string | null
}

const TABLE_HEAD = (
  <tr className="border-b border-zinc-200 bg-zinc-50 text-xs font-semibold tracking-wide text-zinc-500 uppercase">
    <th className="px-4 py-3">Adı Soyadı</th>
    <th className="px-4 py-3">Personel No</th>
    <th className="px-4 py-3">Roller</th>
    <th className="px-4 py-3">Yerleşkeler</th>
    <th className="px-4 py-3">Durum</th>
    <th className="px-4 py-3">İşlemler</th>
  </tr>
)

export function SuperAdminUsersTable({users,locationsById,isLoading,onSelect,onPromote,onDemote,demotingUserId,}: SuperAdminUsersTableProps) {
  if (isLoading) {
    return (
      <div className="overflow-x-auto border border-zinc-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead>{TABLE_HEAD}</thead>
          <tbody>
            {Array.from({ length: 6 }).map((_, index) => (
              <tr key={index} className="border-b border-zinc-100 last:border-b-0">
                {Array.from({ length: 6 }).map((__, cellIndex) => (
                  <td key={cellIndex} className="px-4 py-3">
                    <Skeleton className="h-4 w-24" />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  if (users.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center border border-zinc-200 bg-white py-16 text-sm text-zinc-500">
        Aradığınız kriterlere uygun sonuç bulunamadı.
      </div>
    )
  }

  return (
    <div className="overflow-x-auto border border-zinc-200 bg-white">
      <table className="w-full text-left text-sm">
        <thead>{TABLE_HEAD}</thead>
        <tbody>
          {users.map((user) => {
            const isAdmin = user.roles.includes('ADMIN')
            const isSuperAdmin = user.roles.includes('SUPER_ADMIN')

            return (
              <tr
                key={user.id}
                onClick={() => onSelect(user.id)}
                className="cursor-pointer border-b border-zinc-100 transition-colors last:border-b-0 hover:bg-zinc-100/80"
              >
                <td className="px-4 py-3 font-medium text-zinc-900">
                  {user.firstName} {user.lastName}
                </td>
                <td className="px-4 py-3 tabular-nums text-zinc-500">
                  {`${user.personalId.slice(0, 2)}*******${user.personalId.slice(-2)}`}
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1">
                    {user.roles.map((role) => (
                      <RoleBadge key={role} role={role} />
                    ))}
                  </div>
                </td>
                <td className="px-4 py-3 text-zinc-600">
                  {user.locationIds.map((id) => locationsById.get(id) ?? '—').join(', ') || '—'}
                </td>
                <td className="px-4 py-3">
                  <StatusBadge isActive={user.isActive} />
                </td>
                <td className="px-4 py-3">
                  {isSuperAdmin ? null : isAdmin ? (
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation()
                        onDemote(user.id)
                      }}
                      disabled={demotingUserId === user.id}
                      className="border border-red-200 px-2.5 py-1 text-xs font-medium text-red-600 transition-colors hover:border-red-300 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {demotingUserId === user.id ? 'İşleniyor...' : 'Yöneticilik Al'}
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation()
                        onPromote(user.id)
                      }}
                      className="border border-zinc-200 px-2.5 py-1 text-xs font-medium text-zinc-600 transition-colors hover:border-zinc-300 hover:bg-zinc-50"
                    >
                      Yönetici Yap
                    </button>
                  )}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
