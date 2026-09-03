import { useMemo, useState } from 'react'
import axios from 'axios'
import { Dialog } from '@base-ui/react/dialog'
import { AlertTriangle, Eye, EyeOff, X } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { Role, UserResponseDto } from '@/shared/types/auth'
import type { LocationDto } from '@/shared/types/location'
import { ROLE_LABELS } from '@/shared/types/auth'
import { useAuthStore } from '@/shared/stores/authStore'
import { Skeleton } from '@/shared/components/Skeleton'
import { InfoDialog } from '@/shared/components/InfoDialog'
import { getApiErrorMessage } from '@/shared/api/apiError'
import { ROLE_OPTIONS } from '@/features/admin-staff/constants'
import { findStockManagerConflictMessage, isStockManagerConflict } from '@/features/admin-staff/utils'
import { useUserDetail } from '@/features/admin-staff/hooks/useUserDetail'
import { useUpdateStaffMember } from '@/features/admin-staff/hooks/useUpdateStaffMember'
import { useGrantRoleAtLocation } from '@/features/admin-staff/hooks/useGrantRoleAtLocation'
import { useRevokeRoleAtLocation } from '@/features/admin-staff/hooks/useRevokeRoleAtLocation'
import { FIELD_CLASSNAME } from './MultiSelectDropdown'

function getDetailErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status
    if (status === 401 || status === 403) {
      return 'Bu personeli görüntülemek için yönetici yetkisine sahip olmalısınız.'
    }
  }
  return 'Personel bilgileri yüklenemedi.'
}

interface StaffEditFormProps {
  staff: UserResponseDto
  locations: LocationDto[]
  onClose: () => void
}

function StaffEditForm({ staff, locations, onClose }: StaffEditFormProps) {
  const updateStaffMember = useUpdateStaffMember()
  const grantRole = useGrantRoleAtLocation()
  const revokeRole = useRevokeRoleAtLocation()

  const authUser = useAuthStore((state) => state.user)
  const adminLocations = useMemo(() => {
    const adminLocationIds = new Set(authUser?.locationRoles.filter((lr) => lr.role === 'ADMIN').map((lr) => lr.locationId) ?? [])
    return locations.filter((location) => adminLocationIds.has(location.id))
  }, [locations, authUser])

  const [isActive, setIsActive] = useState(staff.isActive)
  const [showPersonalId, setShowPersonalId] = useState(false)
  const [addRole, setAddRole] = useState<Role>(ROLE_OPTIONS[0])
  const [addLocationId, setAddLocationId] = useState(adminLocations[0]?.id ?? '')
  const [stockManagerConflictMessage, setStockManagerConflictMessage] = useState<string | null>(null)

  const locationsById = new Map(locations.map((location) => [location.id, location.name]))
  const visibleLocationRoles = staff.locationRoles.filter((lr) => adminLocations.some((location) => location.id === lr.locationId))
  const isMutatingAssignment = grantRole.isPending || revokeRole.isPending

  async function handleAddAssignment() {
    if (!addLocationId) return

    if (addRole === 'STOCK_MANAGER') {
      const conflict = await findStockManagerConflictMessage([addLocationId], locationsById, staff.id)
      if (conflict) {
        setStockManagerConflictMessage(
          `${conflict} Değişiklik yapmadan önce ilgili kullanıcının rolünü değiştirin veya farklı bir yerleşke seçin.`,
        )
        return
      }
    }

    try {
      await grantRole.mutateAsync({ userId: staff.id, role: addRole, locationId: addLocationId })
      toast.success('Rol ataması eklendi.')
    } catch (error) {
      if (isStockManagerConflict(error)) {
        setStockManagerConflictMessage(getApiErrorMessage(error))
      } else {
        toast.error(getApiErrorMessage(error, 'Rol ataması eklenemedi.'))
      }
    }
  }

  async function handleRemoveAssignment(role: Role, locationId: string) {
    try {
      await revokeRole.mutateAsync({ userId: staff.id, role, locationId })
      toast.success('Rol ataması kaldırıldı.')
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Rol ataması kaldırılamadı.'))
    }
  }

  function handleSaveStatus() {
    updateStaffMember.mutate({ userId: staff.id, isActive })
  }

  const statusChanged = isActive !== staff.isActive

  return (
    <>
      <div className="flex items-center justify-between border-b border-zinc-200 px-5 py-4">
        <Dialog.Title className="text-sm font-semibold tracking-wide text-zinc-900 uppercase">
          Personel Bilgileri &amp; Düzenle
        </Dialog.Title>
        <Dialog.Close className="text-zinc-400 transition-colors hover:text-zinc-700">
          <X className="size-4" />
        </Dialog.Close>
      </div>

      <div className="max-h-[70vh] space-y-4 overflow-y-auto px-5 py-4">
        <div>
          <label className="mb-1.5 block text-xs font-medium text-zinc-600">Personel ID</label>
          <div className="flex h-10 w-full items-center border border-zinc-200 bg-zinc-50">
            <span className="flex-1 px-3 text-sm tabular-nums text-zinc-500">
              {showPersonalId
                ? staff.personalId
                : `${staff.personalId.slice(0, 2)}*******${staff.personalId.slice(-2)}`}
            </span>

            <button
              type="button"
              onClick={() => setShowPersonalId((prev) => !prev)}
              className="flex h-full w-10 items-center justify-center border-l border-zinc-200 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-700"
              aria-label={showPersonalId ? "Personel ID'yi gizle" : "Personel ID'yi göster"}
            >
              {showPersonalId ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium text-zinc-600">Ad Soyad</label>
          <input
            value={`${staff.firstName} ${staff.lastName}`}
            readOnly
            className={cn(FIELD_CLASSNAME, 'bg-zinc-50 text-zinc-500')}
          />
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium text-zinc-600">Görev · Yerleşke</label>
          {visibleLocationRoles.length === 0 ? (
            <p className="text-sm text-zinc-500">Henüz bir rol ataması yok.</p>
          ) : (
            <div className="flex flex-wrap gap-1.5">
              {visibleLocationRoles.map((lr) => (
                <span
                  key={`${lr.role}-${lr.locationId}`}
                  className="flex items-center gap-1.5 border border-zinc-200 bg-zinc-50 py-1 pr-1 pl-2 text-xs text-zinc-700"
                >
                  {ROLE_LABELS[lr.role]} · {locationsById.get(lr.locationId) ?? '—'}
                  <button
                    type="button"
                    onClick={() => handleRemoveAssignment(lr.role, lr.locationId)}
                    disabled={isMutatingAssignment}
                    className="text-zinc-400 transition-colors hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                    title="Bu atamayı kaldır"
                  >
                    <X className="size-3" />
                  </button>
                </span>
              ))}
            </div>
          )}

          <div className="mt-2 flex gap-2">
            <select
              value={addRole}
              onChange={(event) => setAddRole(event.target.value as Role)}
              disabled={isMutatingAssignment}
              className={FIELD_CLASSNAME}
            >
              {ROLE_OPTIONS.map((role) => (
                <option key={role} value={role}>
                  {ROLE_LABELS[role]}
                </option>
              ))}
            </select>
            <select
              value={addLocationId}
              onChange={(event) => setAddLocationId(event.target.value)}
              disabled={isMutatingAssignment}
              className={FIELD_CLASSNAME}
            >
              {adminLocations.map((location) => (
                <option key={location.id} value={location.id}>
                  {location.name}
                </option>
              ))}
            </select>
            <Button
              type="button"
              className="h-10 shrink-0 rounded-none bg-[#133458] px-4 text-sm text-white hover:bg-[#0f2843]"
              onClick={handleAddAssignment}
              disabled={isMutatingAssignment || !addLocationId}
            >
              Ekle
            </Button>
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium text-zinc-600">Durum</label>
          <div className="flex border border-zinc-200">
            <button
              type="button"
              onClick={() => setIsActive(true)}
              disabled={updateStaffMember.isPending}
              className={cn(
                'flex-1 border-r border-zinc-200 py-2 text-xs font-medium transition-colors',
                isActive ? 'bg-[#84994F] text-white hover:bg-[#708243]' : 'bg-white text-zinc-600 hover:bg-zinc-50',
              )}
            >
              Aktif
            </button>
            <button
              type="button"
              onClick={() => setIsActive(false)}
              disabled={updateStaffMember.isPending}
              className={cn(
                'flex-1 py-2 text-xs font-medium transition-colors',
                !isActive ? 'bg-destructive text-white hover:bg-destructive/90' : 'bg-white text-zinc-600 hover:bg-zinc-50',
              )}
            >
              Pasif
            </button>
          </div>
        </div>

        {staff.isFirstLogin && (
          <p className="flex items-center gap-1.5 text-xs text-amber-600">
            <AlertTriangle className="size-3.5" />
            Bu personel henüz ilk girişini yapmadı.
          </p>
        )}
      </div>

      <div className="flex gap-2 border-t border-zinc-200 p-4">
        <Button type="button" variant="secondary" className="h-11 flex-1 rounded-none text-sm" onClick={onClose}>
          Kapat
        </Button>
        <Button
          type="button"
          className="h-11 flex-1 rounded-none bg-[#133458] text-sm text-white hover:bg-[#0f2843]"
          onClick={handleSaveStatus}
          disabled={updateStaffMember.isPending || !statusChanged}
        >
          {updateStaffMember.isPending ? 'Kaydediliyor...' : 'Durumu Kaydet'}
        </Button>
      </div>

      <InfoDialog
        open={Boolean(stockManagerConflictMessage)}
        title="Stok Yöneticisi Atanamadı"
        message={stockManagerConflictMessage ?? ''}
        onClose={() => setStockManagerConflictMessage(null)}
      />
    </>
  )
}

interface StaffEditPopupProps {
  userId: string | null
  locations: LocationDto[]
  onClose: () => void
}

export function StaffEditPopup({ userId, locations, onClose }: StaffEditPopupProps) {
  const { data: staff, isLoading, isError, error } = useUserDetail(userId ?? undefined)

  return (
    <Dialog.Root open={Boolean(userId)} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-50 bg-zinc-900/40 backdrop-blur-sm" />
        <Dialog.Popup className="fixed top-1/2 left-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 border border-zinc-200 bg-white">
          {isError ? (
            <div className="p-5">
              <div className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {getDetailErrorMessage(error)}
              </div>
            </div>
          ) : isLoading || !staff ? (
            <div className="space-y-3 p-5">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : (
            <StaffEditForm staff={staff} locations={locations} onClose={onClose} />
          )}
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
