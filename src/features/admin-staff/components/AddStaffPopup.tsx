import { useMemo, useState } from 'react'
import axios from 'axios'
import { useQueryClient } from '@tanstack/react-query'
import { Dialog } from '@base-ui/react/dialog'
import { AlertTriangle, Check, Copy, RotateCcw, X } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { Role, UserResponseDto } from '@/shared/types/auth'
import type { LocationDto } from '@/shared/types/location'
import { assignLocationAccess, createUser } from '@/shared/api/endpoints/users'
import { ROLE_LABELS, ROLE_OPTIONS } from '@/features/admin-staff/constants'

const FIELD_CLASSNAME =
  'h-10 w-full rounded-none border border-zinc-200 bg-white px-3 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none transition-colors focus-visible:border-zinc-400'

const TOGGLE_CHIP_CLASSNAME = 'border px-2.5 py-1 text-xs font-medium transition-colors'

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

function addUserToCache(queryClient: ReturnType<typeof useQueryClient>, user: UserResponseDto) {
  queryClient.setQueriesData<UserResponseDto[]>({ queryKey: ['users'], exact: false }, (old) =>
    Array.isArray(old) ? [user, ...old.filter((member) => member.id !== user.id)] : old,
  )
}

function updateUserInCache(queryClient: ReturnType<typeof useQueryClient>, user: UserResponseDto) {
  queryClient.setQueriesData<UserResponseDto[]>({ queryKey: ['users'], exact: false }, (old) =>
    Array.isArray(old) ? old.map((member) => (member.id === user.id ? user : member)) : old,
  )
}

interface StaffFormStepProps {
  locations: LocationDto[]
  isSubmitting: boolean
  submitError: string | null
  onCancel: () => void
  onSubmit: (data: { firstName: string; lastName: string; personalId: string; roles: Role[]; locationIds: string[] }) => void
}

function StaffFormStep({ locations, isSubmitting, submitError, onCancel, onSubmit }: StaffFormStepProps) {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [personalId, setPersonalId] = useState('')
  const [roles, setRoles] = useState<Role[]>([])
  const [locationIds, setLocationIds] = useState<string[]>([])
  const [errors, setErrors] = useState<FormErrors>({})

  function toggleRole(role: Role) {
    setRoles((prev) => (prev.includes(role) ? prev.filter((value) => value !== role) : [...prev, role]))
  }

  function toggleLocation(locationId: string) {
    setLocationIds((prev) =>
      prev.includes(locationId) ? prev.filter((value) => value !== locationId) : [...prev, locationId],
    )
  }

  function handleSubmit() {
    const nextErrors = validate(firstName, lastName, personalId, roles)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return
    onSubmit({ firstName, lastName, personalId, roles, locationIds })
  }

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
            <label className="mb-1.5 block text-xs font-medium text-zinc-600">Ad</label>
            <input
              value={firstName}
              onChange={(event) => setFirstName(event.target.value)}
              className={cn(FIELD_CLASSNAME, errors.firstName && 'border-red-300')}
            />
            {errors.firstName && <p className="mt-1 text-xs text-red-600">{errors.firstName}</p>}
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-zinc-600">Soyad</label>
            <input
              value={lastName}
              onChange={(event) => setLastName(event.target.value)}
              className={cn(FIELD_CLASSNAME, errors.lastName && 'border-red-300')}
            />
            {errors.lastName && <p className="mt-1 text-xs text-red-600">{errors.lastName}</p>}
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium text-zinc-600">Personel No</label>
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
          <label className="mb-1.5 block text-xs font-medium text-zinc-600">Rol</label>
          <div className="flex flex-wrap gap-2">
            {ROLE_OPTIONS.map((role) => (
              <button
                key={role}
                type="button"
                onClick={() => toggleRole(role)}
                className={cn(
                  TOGGLE_CHIP_CLASSNAME,
                  roles.includes(role)
                    ? 'border-[#133458] bg-[#133458] text-white'
                    : 'border-zinc-200 text-zinc-600 hover:border-zinc-300',
                )}
              >
                {ROLE_LABELS[role]}
              </button>
            ))}
          </div>
          {errors.roles && <p className="mt-1 text-xs text-red-600">{errors.roles}</p>}
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium text-zinc-600">Lokasyonlar</label>
          <div className="flex flex-wrap gap-2">
            {locations.map((location) => (
              <button
                key={location.id}
                type="button"
                onClick={() => toggleLocation(location.id)}
                className={cn(
                  TOGGLE_CHIP_CLASSNAME,
                  locationIds.includes(location.id)
                    ? 'border-[#133458] bg-[#133458] text-white'
                    : 'border-zinc-200 text-zinc-600 hover:border-zinc-300',
                )}
              >
                {location.name}
              </button>
            ))}
          </div>
          {locationIds.length === 0 && (
            <p className="mt-1 text-xs text-amber-600">
              Lokasyonsuz personel hiçbir yere erişemez, en az bir lokasyon seçmeniz önerilir.
            </p>
          )}
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

function StaffResultStep({
  user,
  generatedPassword,
  failedLocationIds,
  locationsById,
  onRetryLocation,
  retryingLocationId,
  onFinish,
}: StaffResultStepProps) {
  function handleCopy() {
    if (!generatedPassword) return
    navigator.clipboard.writeText(generatedPassword).then(() => toast.success('Şifre kopyalandı.'))
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

        {generatedPassword && (
          <div>
            <label className="mb-1.5 block text-xs font-medium text-zinc-600">Oluşturulan Şifre</label>
            <div className="flex items-center gap-2">
              <span className="flex-1 border border-zinc-200 bg-zinc-50 px-3 py-2 font-mono text-sm text-zinc-900">
                {generatedPassword}
              </span>
              <Button type="button" variant="outline" size="icon" className="size-10 rounded-none" onClick={handleCopy}>
                <Copy className="size-4" />
              </Button>
            </div>
            <p className="mt-1.5 flex items-center gap-1.5 text-xs text-amber-600">
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
  const queryClient = useQueryClient()
  const locationsById = useMemo(() => new Map(locations.map((location) => [location.id, location.name])), [locations])

  const [step, setStep] = useState<'form' | 'result'>('form')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [createdUser, setCreatedUser] = useState<UserResponseDto | null>(null)
  const [generatedPassword, setGeneratedPassword] = useState<string | null>(null)
  const [failedLocationIds, setFailedLocationIds] = useState<string[]>([])
  const [retryingLocationId, setRetryingLocationId] = useState<string | null>(null)

  function reset() {
    setStep('form')
    setIsSubmitting(false)
    setSubmitError(null)
    setCreatedUser(null)
    setGeneratedPassword(null)
    setFailedLocationIds([])
    setRetryingLocationId(null)
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
    setIsSubmitting(true)
    setSubmitError(null)

    try {
      const { user, generatedPassword: password } = await createUser({
        personalId: data.personalId,
        firstName: data.firstName,
        lastName: data.lastName,
        roles: data.roles,
      })

      let finalUser = user
      const failed: string[] = []

      for (const locationId of data.locationIds) {
        try {
          finalUser = await assignLocationAccess(user.id, locationId)
        } catch {
          failed.push(locationId)
        }
      }

      addUserToCache(queryClient, finalUser)
      setCreatedUser(finalUser)
      setGeneratedPassword(password)
      setFailedLocationIds(failed)
      setStep('result')

      if (failed.length > 0) {
        const failedNames = failed.map((id) => locationsById.get(id) ?? id).join(', ')
        toast.warning(`${finalUser.firstName} ${finalUser.lastName} oluşturuldu ancak ${failedNames} lokasyonu atanamadı.`)
      } else {
        toast.success('Personel başarıyla eklendi.')
      }
    } catch (error) {
      setSubmitError(getCreateErrorMessage(error))
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleRetryLocation(locationId: string) {
    if (!createdUser) return
    setRetryingLocationId(locationId)
    try {
      const updatedUser = await assignLocationAccess(createdUser.id, locationId)
      setCreatedUser(updatedUser)
      setFailedLocationIds((prev) => prev.filter((id) => id !== locationId))
      updateUserInCache(queryClient, updatedUser)
      toast.success('Lokasyon ataması tamamlandı.')
    } catch {
      toast.error('Lokasyon ataması yine başarısız oldu.')
    } finally {
      setRetryingLocationId(null)
    }
  }

  return (
    <Dialog.Root open={open} onOpenChange={(nextOpen) => !nextOpen && handleClose()}>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 bg-zinc-900/40 backdrop-blur-sm" />
        <Dialog.Popup className="fixed top-1/2 left-1/2 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 border border-zinc-200 bg-white">
          {step === 'form' ? (
            <StaffFormStep
              key={open ? 'open' : 'closed'}
              locations={locations}
              isSubmitting={isSubmitting}
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
  )
}
