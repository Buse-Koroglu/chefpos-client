import { useState } from 'react'
import axios from 'axios'
import { useQueryClient } from '@tanstack/react-query'
import { Dialog } from '@base-ui/react/dialog'
import { AlertTriangle, Check, Copy, RotateCcw, X } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { UserResponseDto } from '@/shared/types/auth'
import type { LocationDto } from '@/shared/types/location'
import { assignLocationAccess, createUser, getAdminByLocation } from '@/shared/api/endpoints/users'
import { getApiErrorMessage } from '@/shared/api/apiError'

const FIELD_CLASSNAME =
  'h-10 w-full rounded-none border border-zinc-200 bg-white px-3 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none transition-colors focus-visible:border-zinc-400'

interface FormErrors {
  firstName?: string
  lastName?: string
  personalId?: string
  locationId?: string
}

function validate(firstName: string, lastName: string, personalId: string, locationId: string): FormErrors {
  const errors: FormErrors = {}
  if (!firstName.trim()) errors.firstName = 'Ad zorunludur.'
  if (!lastName.trim()) errors.lastName = 'Soyad zorunludur.'
  if (!/^\d{11}$/.test(personalId)) errors.personalId = 'Personel no 11 haneli olmalıdır.'
  if (!locationId) errors.locationId = 'Yerleşke seçimi zorunludur.'
  return errors
}

function getCreateErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status
    if (status === 409) return 'Bu personel numarası zaten kayıtlı.'
    if (status === 401 || status === 403) return 'Bu işlem için süper yönetici yetkisine sahip olmalısınız.'
  }
  return 'Yönetici oluşturulamadı. Lütfen tekrar deneyin.'
}

interface AdminFormStepProps {
  locations: LocationDto[]
  isSubmitting: boolean
  submitError: string | null
  onCancel: () => void
  onSubmit: (data: { firstName: string; lastName: string; personalId: string; locationId: string }) => void
}

function AdminFormStep({ locations, isSubmitting, submitError, onCancel, onSubmit }: AdminFormStepProps) {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [personalId, setPersonalId] = useState('')
  const [locationId, setLocationId] = useState('')
  const [errors, setErrors] = useState<FormErrors>({})

  function handleSubmit() {
    const nextErrors = validate(firstName, lastName, personalId, locationId)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return
    onSubmit({ firstName, lastName, personalId, locationId })
  }

  return (
    <>
      <div className="flex items-center justify-between border-b border-zinc-200 px-5 py-4">
        <Dialog.Title className="text-sm font-semibold tracking-wide text-zinc-900 uppercase">
          Yeni Admin Ekle
        </Dialog.Title>
        <Dialog.Close className="text-zinc-400 transition-colors hover:text-zinc-700">
          <X className="size-4" />
        </Dialog.Close>
      </div>

      <div className="space-y-4 px-5 py-4">
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
          <label className="mb-1.5 block text-xs font-medium text-zinc-600">Yönetici Olacağı Yerleşke *</label>
          <select
            value={locationId}
            onChange={(event) => setLocationId(event.target.value)}
            className={cn(FIELD_CLASSNAME, errors.locationId && 'border-red-300')}
          >
            <option value="">Yerleşke seçin</option>
            {locations.map((location) => (
              <option key={location.id} value={location.id}>
                {location.name}
              </option>
            ))}
          </select>
          {errors.locationId && <p className="mt-1 text-xs text-red-600">{errors.locationId}</p>}
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
          {isSubmitting ? 'Kaydediliyor...' : 'Admini Kaydet'}
        </Button>
      </div>
    </>
  )
}

interface AdminResultStepProps {
  user: UserResponseDto
  generatedPassword: string | null
  locationAssigned: boolean
  onRetryLocation: () => void
  isRetrying: boolean
  onFinish: () => void
}

function AdminResultStep({
  user,
  generatedPassword,
  locationAssigned,
  onRetryLocation,
  isRetrying,
  onFinish,
}: AdminResultStepProps) {
  function handleCopy() {
    if (!generatedPassword) return
    navigator.clipboard.writeText(generatedPassword).then(() => toast.success('Şifre kopyalandı.'))
  }

  return (
    <>
      <div className="flex items-center justify-between border-b border-zinc-200 px-5 py-4">
        <Dialog.Title className="text-sm font-semibold tracking-wide text-zinc-900 uppercase">
          Yönetici Oluşturuldu
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
              Bu şifreyi yöneticiye iletin, bir daha gösterilmeyecek.
            </p>
          </div>
        )}

        {!locationAssigned && (
          <div className="border border-red-200 bg-red-50 px-3 py-2.5">
            <p className="text-xs font-medium text-red-700">Yerleşke ataması başarısız oldu.</p>
            <button
              type="button"
              onClick={onRetryLocation}
              disabled={isRetrying}
              className="mt-1.5 flex items-center gap-1 border border-red-300 px-2 py-1 text-xs font-medium text-red-700 transition-colors hover:bg-red-100 disabled:opacity-50"
            >
              <RotateCcw className="size-3" />
              {isRetrying ? 'Deneniyor...' : 'Tekrar Dene'}
            </button>
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

interface AddAdminPopupProps {
  open: boolean
  locations: LocationDto[]
  onClose: () => void
}

export function AddAdminPopup({ open, locations, onClose }: AddAdminPopupProps) {
  const queryClient = useQueryClient()

  const [step, setStep] = useState<'form' | 'result'>('form')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [createdUser, setCreatedUser] = useState<UserResponseDto | null>(null)
  const [generatedPassword, setGeneratedPassword] = useState<string | null>(null)
  const [pendingLocationId, setPendingLocationId] = useState<string | null>(null)
  const [locationAssigned, setLocationAssigned] = useState(true)
  const [isRetrying, setIsRetrying] = useState(false)

  function reset() {
    setStep('form')
    setIsSubmitting(false)
    setSubmitError(null)
    setCreatedUser(null)
    setGeneratedPassword(null)
    setPendingLocationId(null)
    setLocationAssigned(true)
    setIsRetrying(false)
  }

  function handleClose() {
    reset()
    onClose()
  }

  async function handleSubmit(data: { firstName: string; lastName: string; personalId: string; locationId: string }) {
    setIsSubmitting(true)
    setSubmitError(null)

    try {
      const existingAdmin = await getAdminByLocation(data.locationId)
      if (existingAdmin) {
        setSubmitError(
          `Bu yerleşkede zaten bir Yönetici atanmış: ${existingAdmin.firstName} ${existingAdmin.lastName}.`,
        )
        setIsSubmitting(false)
        return
      }

      const { user, generatedPassword: password } = await createUser({
        personalId: data.personalId,
        firstName: data.firstName,
        lastName: data.lastName,
        roles: ['ADMIN'],
      })

      let finalUser = user
      let assigned = true
      try {
        finalUser = await assignLocationAccess(user.id, data.locationId)
      } catch {
        assigned = false
      }

      queryClient.invalidateQueries({ queryKey: ['users'], exact: false })
      setCreatedUser(finalUser)
      setGeneratedPassword(password)
      setPendingLocationId(data.locationId)
      setLocationAssigned(assigned)
      setStep('result')

      if (assigned) {
        toast.success('Yönetici başarıyla oluşturuldu.')
      } else {
        toast.warning(`${finalUser.firstName} ${finalUser.lastName} oluşturuldu ancak yerleşke ataması başarısız oldu.`)
      }
    } catch (error) {
      setSubmitError(getCreateErrorMessage(error))
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleRetryLocation() {
    if (!createdUser || !pendingLocationId) return
    setIsRetrying(true)
    try {
      const updatedUser = await assignLocationAccess(createdUser.id, pendingLocationId)
      setCreatedUser(updatedUser)
      setLocationAssigned(true)
      queryClient.invalidateQueries({ queryKey: ['users'], exact: false })
      toast.success('Yerleşke ataması tamamlandı.')
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Yerleşke ataması yine başarısız oldu.'))
    } finally {
      setIsRetrying(false)
    }
  }

  return (
    <Dialog.Root open={open} onOpenChange={(nextOpen) => !nextOpen && handleClose()}>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 bg-zinc-900/40 backdrop-blur-sm" />
        <Dialog.Popup className="fixed top-1/2 left-1/2 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 border border-zinc-200 bg-white">
          {step === 'form' ? (
            <AdminFormStep
              key={open ? 'open' : 'closed'}
              locations={locations}
              isSubmitting={isSubmitting}
              submitError={submitError}
              onCancel={handleClose}
              onSubmit={handleSubmit}
            />
          ) : (
            createdUser && (
              <AdminResultStep
                user={createdUser}
                generatedPassword={generatedPassword}
                locationAssigned={locationAssigned}
                onRetryLocation={handleRetryLocation}
                isRetrying={isRetrying}
                onFinish={handleClose}
              />
            )
          )}
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
