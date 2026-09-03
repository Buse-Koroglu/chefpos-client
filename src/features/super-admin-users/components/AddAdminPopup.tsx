import { useState, type ReactNode } from 'react'
import { Dialog } from '@base-ui/react/dialog'
import { AlertTriangle, Check, Copy, RotateCcw, X } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { UserResponseDto } from '@/shared/types/auth'
import type { LocationDto } from '@/shared/types/location'
import { useCreateAdmin, type CreateAdminFormData } from '../hooks/useCreateAdmin'

const FIELD_CLASSNAME = 'h-10 w-full rounded-none border border-zinc-200 bg-white px-3 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none transition-colors focus-visible:border-zinc-400'

const ALERT_VARIANT_CLASSNAME = {
  error: 'border-red-200 bg-red-50 text-red-700',
  success: 'border-green-200 bg-green-50 text-green-700',
} as const

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

function PopupHeader({ title, showClose = true }: { title: string; showClose?: boolean }) {
  return (
    <div className="flex items-center justify-between border-b border-zinc-200 px-5 py-4">
      <Dialog.Title className="text-sm font-semibold tracking-wide text-zinc-900 uppercase">{title}</Dialog.Title>
      {showClose && (
        <Dialog.Close className="text-zinc-400 transition-colors hover:text-zinc-700">
          <X className="size-4" />
        </Dialog.Close>
      )}
    </div>
  )
}

function InlineAlert({ variant, icon, children }: { variant: keyof typeof ALERT_VARIANT_CLASSNAME; icon?: ReactNode; children: ReactNode }) {
  return (
    <div className={cn('flex items-center gap-2 border px-3 py-2 text-xs', ALERT_VARIANT_CLASSNAME[variant])}>
      {icon}
      {children}
    </div>
  )
}

function FormField({ label, error, children }: { label: string; error?: string; children: ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-zinc-600">{label}</label>
      {children}
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  )
}

interface AdminFormStepProps {
  locations: LocationDto[]
  isSubmitting: boolean
  submitError: string | null
  onCancel: () => void
  onSubmit: (data: CreateAdminFormData) => void
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
      <PopupHeader title="Yeni Admin Ekle" />

      <div className="space-y-4 px-5 py-4">
        {submitError && <InlineAlert variant="error">{submitError}</InlineAlert>}

        <div className="grid grid-cols-2 gap-3">
          <FormField label="Ad *" error={errors.firstName}>
            <input
              value={firstName}
              onChange={(event) => setFirstName(event.target.value)}
              className={cn(FIELD_CLASSNAME, errors.firstName && 'border-red-300')}
            />
          </FormField>
          <FormField label="Soyad *" error={errors.lastName}>
            <input
              value={lastName}
              onChange={(event) => setLastName(event.target.value)}
              className={cn(FIELD_CLASSNAME, errors.lastName && 'border-red-300')}
            />
          </FormField>
        </div>

        <FormField label="Personel No *" error={errors.personalId}>
          <input
            value={personalId}
            onChange={(event) => setPersonalId(event.target.value.replace(/\D/g, '').slice(0, 11))}
            inputMode="numeric"
            placeholder="11 haneli numara"
            className={cn(FIELD_CLASSNAME, errors.personalId && 'border-red-300')}
          />
        </FormField>

        <FormField label="Yönetici Olacağı Yerleşke *" error={errors.locationId}>
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
        </FormField>
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

function AdminResultStep({ user, generatedPassword, locationAssigned, onRetryLocation, isRetrying, onFinish }: AdminResultStepProps) {
  function handleCopy() {
    if (!generatedPassword) return
    navigator.clipboard.writeText(generatedPassword).then(() => toast.success('Şifre kopyalandı.'))
  }

  return (
    <>
      <PopupHeader title="Yönetici Oluşturuldu" showClose={false} />

      <div className="space-y-4 px-5 py-4">
        <InlineAlert variant="success" icon={<Check className="size-4 shrink-0" />}>
          {user.firstName} {user.lastName} başarıyla oluşturuldu.
        </InlineAlert>

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
        <Button type="button" className="h-11 rounded-none bg-[#133458] px-6 text-sm text-white hover:bg-[#0f2843]" onClick={onFinish}>
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
  const flow = useCreateAdmin()

  function handleClose() {
    flow.reset()
    onClose()
  }

  return (
    <Dialog.Root open={open} onOpenChange={(nextOpen) => !nextOpen && handleClose()}>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-50 bg-zinc-900/40 backdrop-blur-sm" />
        <Dialog.Popup className="fixed top-1/2 left-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 border border-zinc-200 bg-white">
          {flow.step === 'form' ? (
            <AdminFormStep
              key={open ? 'open' : 'closed'}
              locations={locations}
              isSubmitting={flow.isSubmitting}
              submitError={flow.submitError}
              onCancel={handleClose}
              onSubmit={flow.submit}
            />
          ) : (
            flow.createdUser && (
              <AdminResultStep
                user={flow.createdUser}
                generatedPassword={flow.generatedPassword}
                locationAssigned={flow.locationAssigned}
                onRetryLocation={flow.retryLocation}
                isRetrying={flow.isRetrying}
                onFinish={handleClose}
              />
            )
          )}
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
