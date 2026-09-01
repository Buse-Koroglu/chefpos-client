import { useEffect, useMemo } from 'react'
import { LogOut } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/shared/stores/authStore'
import { useActiveRoleStore } from '@/shared/stores/activeRoleStore'
import { useLocationStore } from '@/shared/stores/locationStore'
import { useLocations } from '@/shared/hooks/useLocations'
import { ROLE_LABELS } from '@/shared/types/auth'
import type { Role } from '@/shared/types/auth'
import { getDefaultRouteForRole } from '@/routes-config/permissions'
import { LocationSelect } from './LocationSelect'
import { RoleSelect } from './RoleSelect'

interface SidebarUserCardProps {
  isCollapsed?: boolean
}

// SidebarUserCard componenti personel bilgisini ve rol/yerleşke seçimini gösterir
export function SidebarUserCard({ isCollapsed = false }: SidebarUserCardProps) {
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

  const userLocations = useMemo( // personel hangi yerleşkelerde görevliyse sadece onları görebilmeli
    () => allLocations.filter((location) => user?.locationIds.includes(location.id)),
    [allLocations, user], 
  )

  useEffect(() => {
    if (currentRole && currentRole !== 'ADMIN' && currentRole !== 'SUPER_ADMIN' && !selectedLocationId && userLocations.length > 0) {
      setSelectedLocationId(userLocations[0].id) // user locationlardan ilki olan default olarak gelir
    }
  }, [currentRole, selectedLocationId, userLocations, setSelectedLocationId])

  function handleRoleChange(role: Role) {  // dropdown üzerinden rol değişimi için gerekli fonk
    setActiveRole(role)
    navigate(getDefaultRouteForRole(role))
  }

  const userName = `${user?.firstName ?? ''} ${user?.lastName ?? ''}`.trim()

  if (isCollapsed) {
    return (
      <div className="flex flex-col items-center gap-3 border-t border-zinc-200 px-2 py-4">
        <button
          type="button"
          onClick={logout}
          title="Çıkış Yap"
          className="flex items-center justify-center p-2 text-zinc-500 transition-colors hover:bg-zinc-200/60 hover:text-zinc-900"
        >
          <LogOut className="size-5" />
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3 border-t border-zinc-200 px-3 py-4">
      {currentRole && currentRole !== 'ADMIN' && currentRole !== 'SUPER_ADMIN' && (
        <LocationSelect
          locations={userLocations}
          selectedLocationId={selectedLocationId}
          onSelect={setSelectedLocationId}
        />
      )}

      <div className="flex items-center justify-between gap-2 border border-zinc-200 bg-white px-3 py-2.5">
        <p className="truncate text-base font-medium text-zinc-900">{userName}</p>
        <div className="flex shrink-0 items-center gap-1.5 text-sm text-zinc-500">
          <span className="size-1.5 shrink-0 rounded-full bg-blue-500" />
          {roles.length > 1 ? (
            <RoleSelect roles={roles} currentRole={currentRole} onSelect={handleRoleChange} />
          ) : (
            <span>{currentRole ? ROLE_LABELS[currentRole] : ''}</span>
          )}
        </div>
      </div>

      <button
        type="button"
        onClick={logout}
        className="flex items-center gap-2.5 px-3 py-2 text-base font-medium text-zinc-500 transition-colors hover:bg-zinc-200/60 hover:text-zinc-900"
      >
        <LogOut className="size-5" />
        Çıkış Yap
      </button>
    </div>
  )
}
