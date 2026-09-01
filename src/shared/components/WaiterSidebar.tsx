import { useEffect, useMemo } from 'react'
import { History, LogOut, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/shared/stores/authStore'
import { useActiveRoleStore } from '@/shared/stores/activeRoleStore'
import { useLocationStore } from '@/shared/stores/locationStore'
import { useLocations } from '@/shared/hooks/useLocations'
import { ROLE_LABELS, type Role } from '@/shared/types/auth'
import { getDefaultRouteForRole } from '@/routes-config/permissions'
import { BlockSelect } from './BlockSelect'
import { LocationSelect } from './LocationSelect'

// Waiter sayfası ve aynı zamanda waiter için olan sidebar

interface WaiterSidebarProps {
  open: boolean
  onClose: () => void
}

export function WaiterSidebar({ open, onClose }: WaiterSidebarProps) {
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)
  const navigate = useNavigate()

  const activeRole = useActiveRoleStore((state) => state.activeRole)
  const setActiveRole = useActiveRoleStore((state) => state.setActiveRole)

  const selectedLocationId = useLocationStore((state) => state.selectedLocationId)
  const setSelectedLocationId = useLocationStore((state) => state.setSelectedLocationId)

  const { data: allLocations = [] } = useLocations()

  const roles = user?.roles ?? []
  const currentRole: Role | undefined = (activeRole && roles.includes(activeRole) ? activeRole : roles[0]) ?? undefined

  const userLocations = useMemo(
    () => allLocations.filter((location) => user?.locationIds.includes(location.id)),
    [allLocations, user],
  )

  useEffect(() => {
    if (!selectedLocationId && userLocations.length > 0) {
      setSelectedLocationId(userLocations[0].id)
    }
  }, [selectedLocationId, userLocations, setSelectedLocationId])

  function handleRoleChange(role: Role) {
    setActiveRole(role)
    onClose()
    navigate(getDefaultRouteForRole(role))
  }

  function handleLogout() {
    onClose()
    logout()
  }

  if (!open) return null

  const userName = `${user?.firstName ?? ''} ${user?.lastName ?? ''}`.trim()

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      <div className="relative flex h-full w-72 max-w-[85vw] flex-col border-r border-zinc-300 bg-white">
        <div className="flex items-center justify-between border-b border-zinc-200 px-4 py-3.5">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="ChefPos" className="size-8 shrink-0 object-contain" />
            <span className="text-base font-semibold tracking-tight text-zinc-900">ChefPos</span>
          </div>
          <button type="button" onClick={onClose} aria-label="Kapat" className="text-zinc-500">
            <X className="size-5" />
          </button>
        </div>

        <div className="flex flex-col gap-3 p-4">
          {roles.length > 1 && (
            <label className="flex flex-col gap-1">
              <span className="text-xs font-semibold tracking-wide text-zinc-700 uppercase">Görev</span>
              <BlockSelect
                options={roles.map((role) => ({ value: role, label: ROLE_LABELS[role] }))}
                value={currentRole ?? null}
                onChange={(value) => handleRoleChange(value as Role)}
                direction="down"
              />
            </label>
          )}

          <label className="flex flex-col gap-1">
            <span className="flex items-center gap-1 text-xs font-semibold tracking-wide text-zinc-700 uppercase">
              Yerleşke
            </span>
            {userLocations.length > 1 ? (
              <LocationSelect
                locations={userLocations}
                selectedLocationId={selectedLocationId}
                onSelect={setSelectedLocationId}
                direction="down"
              />
            ) : (
              <span className="flex h-10 items-center border border-zinc-200 bg-zinc-50 px-3 text-sm text-zinc-500">
                {userLocations[0]?.name ?? 'Yerleşke yok'}
              </span>
            )}
          </label>
        </div>

        {roles.includes('WAITER') && (
          <nav className="border-t border-zinc-200 px-2 py-2">
            <button
              type="button"
              onClick={() => {
                onClose()
                navigate('/app/waiter-orders/history')
              }}
              className="flex w-full items-center gap-2.5 px-3 py-2.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 hover:text-zinc-900"
            >
              <History className="size-4" />
              Geçmiş Siparişler
            </button>
          </nav>
        )}

        <div className="mt-auto flex flex-col gap-3 border-t border-zinc-200 p-4">
          <div className="border border-zinc-200 bg-zinc-50 px-3 py-2.5">
            <p className="truncate text-sm font-medium text-zinc-900">{userName}</p>
            <p className="text-xs text-zinc-500">{currentRole ? ROLE_LABELS[currentRole] : ''}</p>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-2.5 px-3 py-2 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900"
          >
            <LogOut className="size-4" />
            Çıkış Yap
          </button>
        </div>
      </div>
    </div>
  )
}