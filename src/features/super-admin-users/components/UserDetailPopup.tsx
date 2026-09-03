import { Dialog } from '@base-ui/react/dialog'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { UserResponseDto } from '@/shared/types/auth'
import { RoleBadge } from '@/features/admin-staff/components/RoleBadge'
import { useUpdateUserStatus } from '@/features/super-admin-users/hooks/useUpdateUserStatus'
import { useRevokeRoleAtLocation } from '@/features/super-admin-users/hooks/useRevokeRoleAtLocation'

interface UserDetailPopupProps {
  user: UserResponseDto | null
  locationsById: Map<string, string>
  onClose: () => void
}

export function UserDetailPopup({ user, locationsById, onClose }: UserDetailPopupProps) {
  const updateStatusMutation = useUpdateUserStatus()
  const isUpdatingStatus = updateStatusMutation.isPending
  const revokeRoleMutation = useRevokeRoleAtLocation()

  function handleRevokeAssignment(role: UserResponseDto['locationRoles'][number]['role'], locationId: string) {
    if (!user) return
    revokeRoleMutation.mutate({ userId: user.id, role, locationId })
  }

  function handleSetActive(nextActive: boolean) {
    if (!user || user.isActive === nextActive) return
    updateStatusMutation.mutate({ userId: user.id, nextActive })
  }

  return (
    <Dialog.Root open={Boolean(user)} onOpenChange={(nextOpen) => !nextOpen && onClose()}>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-50 bg-zinc-900/40 backdrop-blur-sm" />
        <Dialog.Popup className="fixed top-1/2 left-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 border border-zinc-200 bg-white">
          <div className="flex items-center justify-between border-b border-zinc-200 px-5 py-4">
            <Dialog.Title className="text-sm font-semibold tracking-wide text-zinc-900 uppercase">
              Kullanıcı Detayı
            </Dialog.Title>
            <Dialog.Close className="text-zinc-400 transition-colors hover:text-zinc-700">
              <X className="size-4" />
            </Dialog.Close>
          </div>

          {user && (
            <div className="space-y-4 px-5 py-4">
              <div>
                <p className="text-sm font-medium text-zinc-900">
                  {user.firstName} {user.lastName}
                </p>
                <p className="mt-0.5 text-xs tabular-nums text-zinc-500">
                  {`${user.personalId.slice(0, 2)}*******${user.personalId.slice(-2)}`}
                </p>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium text-zinc-600">Görev · Yerleşke</label>
                {user.locationRoles.length === 0 && !user.roles.includes('SUPER_ADMIN') ? (
                  <p className="text-sm text-zinc-600">—</p>
                ) : (
                  <div className="flex flex-wrap gap-1.5">
                    {user.locationRoles.map((lr) => (
                      <span
                        key={`${lr.role}-${lr.locationId}`}
                        className="flex items-center gap-1.5 border border-zinc-200 bg-zinc-50 py-1 pr-1 pl-2 text-xs text-zinc-700"
                      >
                        <RoleBadge role={lr.role} locationName={locationsById.get(lr.locationId) ?? '—'} />
                        <button
                          type="button"
                          onClick={() => handleRevokeAssignment(lr.role, lr.locationId)}
                          disabled={revokeRoleMutation.isPending}
                          className="text-zinc-400 transition-colors hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                          title="Bu atamayı kaldır"
                        >
                          <X className="size-3" />
                        </button>
                      </span>
                    ))}
                    {user.roles.includes('SUPER_ADMIN') && <RoleBadge role="SUPER_ADMIN" />}
                  </div>
                )}
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium text-zinc-600">Durum</label>
  
                <div className="flex border border-zinc-200">
                  <button
                    type="button"
                    onClick={() => handleSetActive(true)}
                    disabled={isUpdatingStatus}
                    className={cn(
                      'flex-1 border-r border-zinc-200 py-2 text-xs font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50',
                      user.isActive ? 'bg-[#84994F] text-white hover:bg-[#708243]' : 'bg-white text-zinc-600 hover:bg-zinc-50',
                    )}
                  >
                    Aktif
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSetActive(false)}
                    disabled={isUpdatingStatus}
                    className={cn(
                      'flex-1 py-2 text-xs font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50',
                      !user.isActive ? 'bg-destructive text-white hover:bg-destructive/90' : 'bg-white text-zinc-600 hover:bg-zinc-50',
                    )}
                  >
                    Pasif
                  </button>
                </div>
              </div>
            </div>
          )}
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
