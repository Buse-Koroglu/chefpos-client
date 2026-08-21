import { useState, useRef, useEffect } from 'react'
import axios from 'axios'
import { useQueryClient } from '@tanstack/react-query'
import { Dialog } from '@base-ui/react/dialog'
import { AlertTriangle, Eye, EyeOff, X, ChevronDown, Check } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { Role, UserResponseDto } from '@/shared/types/auth'
import type { LocationDto } from '@/shared/types/location'
import {
  activateUser,
  addRole,
  assignLocationAccess,
  deactivateUser,
  removeRole,
  revokeLocationAccess,
} from '@/shared/api/endpoints/users'
import { Skeleton } from '@/shared/components/Skeleton'
import { ROLE_LABELS, ROLE_OPTIONS } from '@/features/admin-staff/constants'
import { useUserDetail } from '@/features/admin-staff/hooks/useUserDetail'

const FIELD_CLASSNAME =
  'h-10 w-full rounded-none border border-zinc-200 bg-white px-3 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none transition-colors focus-visible:border-zinc-400'

function getDetailErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status
    if (status === 401 || status === 403) {
      return 'Bu personeli görüntülemek için yönetici yetkisine sahip olmalısınız.'
    }
  }
  return 'Personel bilgileri yüklenemedi.'
}

function updateUserInCache(queryClient: ReturnType<typeof useQueryClient>, user: UserResponseDto) {
  queryClient.setQueryData(['users', 'detail', user.id], user)
  queryClient.setQueriesData<UserResponseDto[]>({ queryKey: ['users'], exact: false }, (old) =>
    Array.isArray(old) ? old.map((member) => (member.id === user.id ? user : member)) : old,
  )
}

interface MultiSelectDropdownProps<T extends string> {
  label: string
  placeholder: string
  options: { id: T; label: string }[]
  selectedIds: T[]
  onToggle: (id: T) => void
  disabled?: boolean
}

function MultiSelectDropdown<T extends string>({
  label,
  placeholder,
  options,
  selectedIds,
  onToggle,
  disabled,
}: MultiSelectDropdownProps<T>) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="relative space-y-1.5" ref={dropdownRef}>
      <label className="block text-xs font-medium text-zinc-600">{label}</label>

      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen((prev) => !prev)}
        className={cn(
          FIELD_CLASSNAME,
          'flex items-center justify-between text-left cursor-pointer transition-all',
          isOpen && 'border-[#133458] ring-1 ring-[#133458]',
          disabled && 'opacity-60 cursor-not-allowed bg-zinc-50'
        )}
      >
        <span className="truncate text-zinc-600">
          {selectedIds.length === 0 ? placeholder : `${selectedIds.length} öğe seçildi`}
        </span>
        <ChevronDown
          className={cn('size-4 text-zinc-400 transition-transform duration-200', isOpen && 'rotate-180')}
        />
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-1 max-h-56 w-full overflow-y-auto border border-zinc-200 bg-white shadow-lg">
          <div className="p-1 space-y-0.5">
            {options.map((option) => {
              const isSelected = selectedIds.includes(option.id)
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => onToggle(option.id)}
                  className={cn(
                    'flex w-full items-center justify-between px-3 py-2 text-xs font-medium transition-colors text-left',
                    isSelected
                      ? 'bg-[#133458]/10 text-[#133458]'
                      : 'text-zinc-700 hover:bg-zinc-100'
                  )}
                >
                  <span className="truncate">{option.label}</span>
                  {isSelected && <Check className="size-3.5 text-[#133458] shrink-0 ml-2" />}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {selectedIds.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pt-1">
          {selectedIds.map((id) => {
            const opt = options.find((o) => o.id === id)
            return (
              <span
                key={id}
                className="inline-flex items-center gap-1 border border-[#133458] bg-[#133458] px-2 py-0.5 text-xs font-medium text-white"
              >
                {opt?.label ?? id}
                <button
                  type="button"
                  onClick={() => onToggle(id)}
                  disabled={disabled}
                  className="hover:opacity-75 focus:outline-none"
                >
                  <X className="size-3" />
                </button>
              </span>
            )
          })}
        </div>
      )}
    </div>
  )
}

interface StaffEditFormProps {
  staff: UserResponseDto
  locations: LocationDto[]
  onClose: () => void
}

function StaffEditForm({ staff, locations, onClose }: StaffEditFormProps) {
  const queryClient = useQueryClient()

  const [baseline, setBaseline] = useState(staff)
  const [roles, setRoles] = useState<Role[]>(staff.roles)
  const [locationIds, setLocationIds] = useState<string[]>(staff.locationIds)
  const [isActive, setIsActive] = useState(staff.isActive)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [saveErrors, setSaveErrors] = useState<string[]>([])
  const [showPersonalId, setShowPersonalId] = useState(false)

  function toggleRole(role: Role) {
    setRoles((prev) => (prev.includes(role) ? prev.filter((value) => value !== role) : [...prev, role]))
  }

  function toggleLocation(locationId: string) {
    setLocationIds((prev) =>
      prev.includes(locationId) ? prev.filter((value) => value !== locationId) : [...prev, locationId],
    )
  }

  async function handleSave() {
    setIsSubmitting(true)
    setSaveErrors([])

    let current = baseline
    const errors: string[] = []

    const rolesToAdd = roles.filter((role) => !baseline.roles.includes(role))
    const rolesToRemove = baseline.roles.filter((role) => !roles.includes(role))
    const locationsToAdd = locationIds.filter((id) => !baseline.locationIds.includes(id))
    const locationsToRemove = baseline.locationIds.filter((id) => !locationIds.includes(id))

    for (const role of rolesToAdd) {
      try {
        current = await addRole(current.id, role)
      } catch {
        errors.push(`${ROLE_LABELS[role]} rolü eklenemedi.`)
      }
    }

    for (const role of rolesToRemove) {
      try {
        current = await removeRole(current.id, role)
      } catch {
        errors.push(`${ROLE_LABELS[role]} rolü kaldırılamadı.`)
      }
    }

    for (const locationId of locationsToAdd) {
      try {
        current = await assignLocationAccess(current.id, locationId)
      } catch {
        const name = locations.find((location) => location.id === locationId)?.name ?? locationId
        errors.push(`${name} lokasyonu atanamadı.`)
      }
    }

    for (const locationId of locationsToRemove) {
      try {
        current = await revokeLocationAccess(current.id, locationId)
      } catch {
        const name = locations.find((location) => location.id === locationId)?.name ?? locationId
        errors.push(`${name} lokasyonu kaldırılamadı.`)
      }
    }

    if (isActive !== baseline.isActive) {
      try {
        current = isActive ? await activateUser(current.id) : await deactivateUser(current.id)
      } catch {
        errors.push('Durum güncellenemedi.')
      }
    }

    updateUserInCache(queryClient, current)
    setBaseline(current)
    setRoles(current.roles)
    setLocationIds(current.locationIds)
    setIsActive(current.isActive)
    setIsSubmitting(false)

    if (errors.length > 0) {
      setSaveErrors(errors)
      return
    }

    toast.success('Personel bilgileri güncellendi.')
    onClose()
  }

  const hasChanges =
    roles.length !== baseline.roles.length ||
    roles.some((role) => !baseline.roles.includes(role)) ||
    locationIds.length !== baseline.locationIds.length ||
    locationIds.some((id) => !baseline.locationIds.includes(id)) ||
    isActive !== baseline.isActive

  const roleOptions = ROLE_OPTIONS.map((r) => ({ id: r, label: ROLE_LABELS[r] }))
  const locationOptions = locations.map((loc) => ({ id: loc.id, label: loc.name }))

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
        {saveErrors.length > 0 && (
          <div className="border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
            <p className="font-medium">Bazı değişiklikler kaydedilemedi:</p>
            <ul className="mt-1 list-inside list-disc">
              {saveErrors.map((message) => (
                <li key={message}>{message}</li>
              ))}
            </ul>
          </div>
        )}

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

        <MultiSelectDropdown
          label="Görev"
          placeholder="Görev seçiniz..."
          options={roleOptions}
          selectedIds={roles}
          onToggle={toggleRole}
          disabled={isSubmitting}
        />

        <MultiSelectDropdown
          label="Lokasyon"
          placeholder="Lokasyon seçiniz..."
          options={locationOptions}
          selectedIds={locationIds}
          onToggle={toggleLocation}
          disabled={isSubmitting}
        />

        <div>
          <label className="mb-1.5 block text-xs font-medium text-zinc-600">Durum</label>
          <div className="flex border border-zinc-200">
            <button
              type="button"
              onClick={() => setIsActive(true)}
              disabled={isSubmitting}
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
              disabled={isSubmitting}
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
          onClick={handleSave}
          disabled={isSubmitting || !hasChanges}
        >
          {isSubmitting ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
        </Button>
      </div>
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
        <Dialog.Backdrop className="fixed inset-0 bg-zinc-900/40 backdrop-blur-sm" />
        <Dialog.Popup className="fixed top-1/2 left-1/2 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 border border-zinc-200 bg-white">
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
            <StaffEditForm key={staff.id} staff={staff} locations={locations} onClose={onClose} />
          )}
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  )
}