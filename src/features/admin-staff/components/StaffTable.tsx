import { useMemo } from 'react'
import { AlertTriangle } from 'lucide-react'
import type { UserResponseDto } from '@/shared/types/auth'
import { useAuthStore } from '@/shared/stores/authStore'
import { Skeleton } from '@/shared/components/Skeleton'
import { RoleBadge } from './RoleBadge'
import { StatusBadge } from './StatusBadge'

interface StaffTableProps {
  staff: UserResponseDto[]
  locationsById: Map<string, string>
  onSelect: (userId: string) => void
  isLoading?: boolean
}

const TABLE_HEAD = (
  <tr className="border-b border-zinc-200 bg-zinc-50 text-xs font-semibold tracking-wide text-zinc-500 uppercase">
    <th className="px-4 py-3">Adı Soyadı</th>
    <th className="px-4 py-3">Personel No</th>
    <th className="px-4 py-3">Rol · Yerleşke</th>
    <th className="px-4 py-3">Durum</th>
    <th className="px-4 py-3">İşlemler</th>
  </tr>
)

export function StaffTable({ staff, locationsById, onSelect, isLoading }: StaffTableProps) {
  const authUser = useAuthStore((state) => state.user)
  const adminLocationIds = useMemo(
    () => new Set(authUser?.locationRoles.filter((lr) => lr.role === 'ADMIN').map((lr) => lr.locationId) ?? []),
    [authUser],
  )

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

  if (staff.length === 0) {
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
          {staff.map((member) => (
            <tr
              key={member.id}
              onClick={() => onSelect(member.id)}
              className="cursor-pointer border-b border-zinc-100 transition-colors last:border-b-0 hover:bg-zinc-100/80"
            >
              <td className="px-4 py-3 font-medium text-zinc-900">
                <span className="flex items-center gap-1.5">
                  {member.firstName} {member.lastName}
                  {member.isFirstLogin && (
                    <span title="Henüz ilk girişini yapmadı" className="inline-flex">
                      <AlertTriangle className="size-3.5 text-amber-500" />
                    </span>
                  )}
                </span>
              </td>
            <td className="px-4 py-3 tabular-nums text-zinc-500">
              {`${member.personalId.slice(0, 2)}*******${member.personalId.slice(-2)}`}
            </td>
              <td className="px-4 py-3">
                <div className="flex flex-wrap gap-1">
                  {member.locationRoles
                    .filter((lr) => adminLocationIds.has(lr.locationId))
                    .map((lr) => (
                      <RoleBadge key={`${lr.role}-${lr.locationId}`} role={lr.role} locationName={locationsById.get(lr.locationId) ?? '—'} />
                    ))}
                  {member.roles.includes('SUPER_ADMIN') && <RoleBadge role="SUPER_ADMIN" />}
                </div>
              </td>
              <td className="px-4 py-3">
                <StatusBadge isActive={member.isActive} />
              </td>
              <td className="px-4 py-3">
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation()
                    onSelect(member.id)
                  }}
                  className="border border-zinc-200 px-2.5 py-1 text-xs font-medium text-zinc-600 transition-colors hover:border-zinc-300 hover:bg-zinc-50"
                >
                  Detay
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
