import { useMemo, useState } from 'react'
import axios from 'axios'
import { Dialog } from '@base-ui/react/dialog'
import { AlertTriangle, Check, Copy, RotateCcw, X } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/shared/stores/authStore'
import type { Role, UserResponseDto } from '@/shared/types/auth'
import type { LocationDto } from '@/shared/types/location'
import { InfoDialog } from '@/shared/components/InfoDialog'
import { getApiErrorMessage } from '@/shared/api/apiError'
import { ROLE_LABELS, ROLE_OPTIONS } from '@/features/admin-staff/constants'
import { isStockManagerConflict, StockManagerPrecheckError } from '@/features/admin-staff/utils'
import { FIELD_CLASSNAME, MultiSelectDropdown } from './MultiSelectDropdown'
import { useCreateStaffMember } from '@/features/admin-staff/hooks/useCreateStaffMember'
import { useAssignLocationAccess } from '@/features/admin-staff/hooks/useAssignLocationAccess'

interface FormErrors {
  firstName?: string
  lastName?: string
  personalId?: string
  roles?: string
}

function validate(firstName: string, lastName: string, personalId: string, roles: Role[]): FormErrors {
  const errors: FormErrors = {}
  if (!firstName.trim()) errors.firstName = 'Ad zorunludur.'
  if (!lastName.trim()) errors.lastName = 'Soyad zorunludur.'
  if (!/^\d{11}$/.test(personalId)) errors.personalId = 'Personel no 11 haneli olmalıdır.'
  if (roles.length === 0) errors.roles = 'En az bir rol seçmelisiniz.'
  return errors
}

function getCreateErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status
    if (status === 409) return 'Bu personel numarası zaten kayıtlı.'
    if (status === 401 || status === 403) return 'Bu işlem için yönetici yetkisine sahip olmalısınız.'
  }
  return 'Personel oluşturulamadı. Lütfen tekrar deneyin.'
}

interface StaffFormStepProps {
  locations: LocationDto[]
  adminLocationId: string | undefined
  isSubmitting: boolean
  submitError: string | null
  onCancel: () => void
  onSubmit: (data: { firstName: string; lastName: string; personalId: string; roles: Role[]; locationIds: string[] }) => void
}

function StaffFormStep({ locations, adminLocationId, isSubmitting, submitError, onCancel, onSubmit }: StaffFormStepProps) {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [personalId, setPersonalId] = useState('')
  const [roles, setRoles] = useState<Role[]>([])
  const [errors, setErrors] = useState<FormErrors>({})

  const locationIds = adminLocationId ? [adminLocationId] : []
  const adminLocationName = locations.find((location) => location.id === adminLocationId)?.name ?? '—'

  function toggleRole(role: Role) {
    setRoles((prev) => (prev.includes(role) ? prev.filter((value) => value !== role) : [...prev, role]))
  }

  function handleSubmit() {
    const nextErrors = validate(firstName, lastName, personalId, roles)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return
    onSubmit({ firstName, lastName, personalId, roles, locationIds })
  }

  const roleOptions = ROLE_OPTIONS.map((r) => ({ id: r, label: ROLE_LABELS[r] }))

  return (
    <>
      <div className="flex items-center justify-between border-b border-zinc-200 px-5 py-4">
        <Dialog.Title className="text-sm font-semibold tracking-wide text-zinc-900 uppercase">
          Yeni Personel Ekle
        </Dialog.Title>
        <Dialog.Close className="text-zinc-400 transition-colors hover:text-zinc-700">
          <X className="size-4" />
        </Dialog.Close>
      </div>

      <div className="max-h-[70vh] space-y-4 overflow-y-auto px-5 py-4">
        {submitError && (
          <div className="border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">{submitError}</div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-zinc-600">Ad *</label>
            <input
              value={firstName}
              onChange={(event) => setFirstName(event.target.value)}
              className={cn(FIELD_CLASSNAME, errors.firstName && 'border-red-300')}
            />
            {errors.firstName && <p className="mt-1 text-xs text-red-600">{errors.firstName}</p>}
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-zinc-600">Soyad *</label>
            <input
              value={lastName}
              onChange={(event) => setLastName(event.target.value)}
              className={cn(FIELD_CLASSNAME, errors.lastName && 'border-red-300')}
            />
            {errors.lastName && <p className="mt-1 text-xs text-red-600">{errors.lastName}</p>}
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium text-zinc-600">Personel No *</label>
          <input
            value={personalId}
            onChange={(event) => setPersonalId(event.target.value.replace(/\D/g, '').slice(0, 11))}
            inputMode="numeric"
            placeholder="11 haneli numara"
            className={cn(FIELD_CLASSNAME, errors.personalId && 'border-red-300')}
          />
          {errors.personalId && <p className="mt-1 text-xs text-red-600">{errors.personalId}</p>}
        </div>

        <div>
          <MultiSelectDropdown
            label="Görev *"
            placeholder="Görev seçiniz..."
            itemLabelSingular="görev"
            options={roleOptions}
            selectedIds={roles}
            onToggle={toggleRole}
            disabled={isSubmitting}
            hasError={Boolean(errors.roles)}
          />
          {errors.roles && <p className="mt-1 text-xs text-red-600">{errors.roles}</p>}
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium text-zinc-600">Yerleşke</label>
          <input value={adminLocationName} readOnly className={cn(FIELD_CLASSNAME, 'bg-zinc-50 text-zinc-500')} />
        </div>
      </div>

      <div className="flex gap-2 border-t border-zinc-200 p-4">
        <Button
          type="button"
          variant="outline"
          className="h-11 flex-1 rounded-none text-sm"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          İptal
        </Button>
        <Button
          type="button"
          className="h-11 flex-1 rounded-none bg-[#133458] text-sm text-white hover:bg-[#0f2843]"
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Kaydediliyor...' : 'Personeli Kaydet'}
        </Button>
      </div>
    </>
  )
}

interface StaffResultStepProps {
  user: UserResponseDto
  generatedPassword: string | null
  failedLocationIds: string[]
  locationsById: Map<string, string>
  onRetryLocation: (locationId: string) => void
  retryingLocationId: string | null
  onFinish: () => void
}

function StaffResultStep({user,generatedPassword,failedLocationIds,locationsById,onRetryLocation,retryingLocationId,onFinish}:StaffResultStepProps) {
  function handleCopy(value: string, successMessage: string) {
    navigator.clipboard.writeText(value).then(() => toast.success(successMessage))
  }

  return (
    <>
      <div className="flex items-center justify-between border-b border-zinc-200 px-5 py-4">
        <Dialog.Title className="text-sm font-semibold tracking-wide text-zinc-900 uppercase">
          Personel Oluşturuldu
        </Dialog.Title>
      </div>

      <div className="space-y-4 px-5 py-4">
        <div className="flex items-center gap-2 border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">
          <Check className="size-4 shrink-0" />
          {user.firstName} {user.lastName} başarıyla oluşturuldu.
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium text-zinc-600">Personel No</label>
          <div className="flex items-center gap-2">
            <span className="flex-1 border border-zinc-200 bg-zinc-50 px-3 py-2 font-mono text-sm text-zinc-900">
              {user.personalId}
            </span>
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="size-10 rounded-none"
              onClick={() => handleCopy(user.personalId, 'Personel no kopyalandı.')}
            >
              <Copy className="size-4" />
            </Button>
          </div>
        </div>

        {generatedPassword && (
          <div>
            <label className="mb-1.5 block text-xs font-medium text-zinc-600">Oluşturulan Şifre</label>
            <div className="flex items-center gap-2">
              <span className="flex-1 border border-zinc-200 bg-zinc-50 px-3 py-2 font-mono text-sm text-zinc-900">
                {generatedPassword}
              </span>
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="size-10 rounded-none"
                onClick={() => handleCopy(generatedPassword, 'Şifre kopyalandı.')}
              >
                <Copy className="size-4" />
              </Button>
            </div>
            <p className="mt-1.5 flex items-center gap-1.5 text-xs text-red-600">
              <AlertTriangle className="size-3.5 shrink-0" />
              Bu şifreyi personele iletin, bir daha gösterilmeyecek.
            </p>
          </div>
        )}

        {failedLocationIds.length > 0 && (
          <div className="border border-red-200 bg-red-50 px-3 py-2.5">
            <p className="text-xs font-medium text-red-700">Aşağıdaki lokasyonlar atanamadı:</p>
            <ul className="mt-1.5 space-y-1.5">
              {failedLocationIds.map((locationId) => (
                <li key={locationId} className="flex items-center justify-between gap-2 text-xs text-red-700">
                  {locationsById.get(locationId) ?? locationId}
                  <button
                    type="button"
                    onClick={() => onRetryLocation(locationId)}
                    disabled={retryingLocationId === locationId}
                    className="flex items-center gap-1 border border-red-300 px-2 py-1 font-medium text-red-700 transition-colors hover:bg-red-100 disabled:opacity-50"
                  >
                    <RotateCcw className="size-3" />
                    {retryingLocationId === locationId ? 'Deneniyor...' : 'Tekrar Dene'}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="flex justify-end border-t border-zinc-200 p-4">
        <Button type="button" className="h-11 rounded-none bg-zinc-900 px-6 text-sm text-white hover:bg-zinc-800" onClick={onFinish}>
          Tamam
        </Button>
      </div>
    </>
  )
}

interface AddStaffPopupProps {
  open: boolean
  locations: LocationDto[]
  onClose: () => void
}

export function AddStaffPopup({ open, locations, onClose }: AddStaffPopupProps) {
  const adminLocationId = useAuthStore((state) => state.user?.locationIds[0])
  const locationsById = useMemo(() => new Map(locations.map((location) => [location.id, location.name])), [locations])

  const createStaffMember = useCreateStaffMember()
  const assignLocation = useAssignLocationAccess()

  const [step, setStep] = useState<'form' | 'result'>('form')
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [createdUser, setCreatedUser] = useState<UserResponseDto | null>(null)
  const [generatedPassword, setGeneratedPassword] = useState<string | null>(null)
  const [failedLocationIds, setFailedLocationIds] = useState<string[]>([])
  const [retryingLocationId, setRetryingLocationId] = useState<string | null>(null)
  const [stockManagerConflictMessage, setStockManagerConflictMessage] = useState<string | null>(null)

  function reset() {
    setStep('form')
    setSubmitError(null)
    setCreatedUser(null)
    setGeneratedPassword(null)
    setFailedLocationIds([])
    setRetryingLocationId(null)
    setStockManagerConflictMessage(null)
  }

  function handleClose() {
    reset()
    onClose()
  }

  async function handleSubmit(data: {
    firstName: string
    lastName: string
    personalId: string
    roles: Role[]
    locationIds: string[]
  }) {
    setSubmitError(null)

    try {
      const result = await createStaffMember.mutateAsync({ ...data, locationsById })
      setCreatedUser(result.user)
      setGeneratedPassword(result.generatedPassword)
      setFailedLocationIds(result.failedLocationIds)
      setStep('result')
      if (result.stockManagerConflictMessage) {
        setStockManagerConflictMessage(result.stockManagerConflictMessage)
      }
    } catch (error) {
      if (error instanceof StockManagerPrecheckError) {
        setStockManagerConflictMessage(error.message)
      } else {
        setSubmitError(getCreateErrorMessage(error))
      }
    }
  }

  async function handleRetryLocation(locationId: string) {
    if (!createdUser) return
    setRetryingLocationId(locationId)
    try {
      const updatedUser = await assignLocation.mutateAsync({ userId: createdUser.id, locationId })
      setCreatedUser(updatedUser)
      setFailedLocationIds((prev) => prev.filter((id) => id !== locationId))
      toast.success('Lokasyon ataması tamamlandı.')
    } catch (error) {
      if (isStockManagerConflict(error)) {
        setStockManagerConflictMessage(getApiErrorMessage(error))
      } else {
        toast.error(getApiErrorMessage(error, 'Lokasyon ataması yine başarısız oldu.'))
      }
    } finally {
      setRetryingLocationId(null)
    }
  }

  return (
    <>
    <Dialog.Root open={open} onOpenChange={(nextOpen) => !nextOpen && handleClose()}>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-50 bg-zinc-900/40 backdrop-blur-sm" />
        <Dialog.Popup className="fixed top-1/2 left-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 border border-zinc-200 bg-white">
          {step === 'form' ? (
            <StaffFormStep
              key={open ? 'open' : 'closed'}
              locations={locations}
              adminLocationId={adminLocationId}
              isSubmitting={createStaffMember.isPending}
              submitError={submitError}
              onCancel={handleClose}
              onSubmit={handleSubmit}
            />
          ) : (
            createdUser && (
              <StaffResultStep
                user={createdUser}
                generatedPassword={generatedPassword}
                failedLocationIds={failedLocationIds}
                locationsById={locationsById}
                onRetryLocation={handleRetryLocation}
                retryingLocationId={retryingLocationId}
                onFinish={handleClose}
              />
            )
          )}
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>

      <InfoDialog
        open={Boolean(stockManagerConflictMessage)}
        title="Stok Yöneticisi Atanamadı"
        message={stockManagerConflictMessage ?? ''}
        onClose={() => setStockManagerConflictMessage(null)}
      />
    </>
  )
}
