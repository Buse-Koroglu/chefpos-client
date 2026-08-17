import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { Dialog } from '@base-ui/react/dialog'
import { AlertTriangle, X } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { LocationDto } from '@/shared/types/location'
import type { CategoryAdminResponseDto } from '@/shared/types/category'
import {
  activateCategory,
  addCategoryLocation,
  deactivateCategory,
  removeCategoryLocation,
  updateCategory,
} from '@/shared/api/endpoints/categories'
import { CategoryIcon } from './CategoryIcon'

const FIELD_CLASSNAME =
  'h-10 w-full rounded-none border border-zinc-200 bg-white px-3 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none transition-colors focus-visible:border-zinc-400'

const LOCATION_CHIP_CLASSNAME = 'border px-2.5 py-1 text-xs font-medium transition-colors'

interface CategoryEditFormProps {
  category: CategoryAdminResponseDto
  locations: LocationDto[]
  onClose: () => void
}

function CategoryEditForm({ category, locations, onClose }: CategoryEditFormProps) {
  const queryClient = useQueryClient()

  const [name, setName] = useState(category.name)
  const [icon, setIcon] = useState(category.icon ?? '')
  const [locationIds, setLocationIds] = useState<string[]>(category.locationIds)
  const [isActive, setIsActive] = useState(category.isActive)
  const [saveErrors, setSaveErrors] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [confirmingDeactivate, setConfirmingDeactivate] = useState(false)

  const hasChanges =
    name.trim() !== category.name ||
    icon.trim() !== (category.icon ?? '') ||
    isActive !== category.isActive ||
    locationIds.length !== category.locationIds.length ||
    locationIds.some((id) => !category.locationIds.includes(id))

  const isMultiLocationDeactivation = category.isActive && !isActive && locationIds.length > 1
  const selectedLocationNames = locations
    .filter((location) => locationIds.includes(location.id))
    .map((location) => location.name)

  function setIsActiveAndResetConfirm(value: boolean) {
    setIsActive(value)
    setConfirmingDeactivate(false)
  }

  function toggleLocation(locationId: string) {
    setConfirmingDeactivate(false)
    setLocationIds((prev) => {
      if (prev.includes(locationId)) {
        if (prev.length <= 1) return prev
        return prev.filter((id) => id !== locationId)
      }
      return [...prev, locationId]
    })
  }

  async function persistChanges() {
    setIsSubmitting(true)
    setSaveErrors([])

    const errors: string[] = []

    const locationsToAdd = locationIds.filter((id) => !category.locationIds.includes(id))
    const locationsToRemove = category.locationIds.filter((id) => !locationIds.includes(id))
    let succeededLocationIds = category.locationIds

    for (const locationId of locationsToAdd) {
      try {
        await addCategoryLocation(category.id, locationId)
        succeededLocationIds = [...succeededLocationIds, locationId]
      } catch {
        const name = locations.find((location) => location.id === locationId)?.name ?? locationId
        errors.push(`${name} yerleşkesi eklenemedi.`)
      }
    }

    for (const locationId of locationsToRemove) {
      try {
        await removeCategoryLocation(category.id, locationId)
        succeededLocationIds = succeededLocationIds.filter((id) => id !== locationId)
      } catch {
        const name = locations.find((location) => location.id === locationId)?.name ?? locationId
        errors.push(`${name} yerleşkesi kaldırılamadı.`)
      }
    }

    try {
      if (name.trim() !== category.name || icon.trim() !== (category.icon ?? '')) {
        await updateCategory(category.id, { name: name.trim(), icon: icon.trim() || null })
      }
      if (isActive !== category.isActive) {
        await (isActive
          ? activateCategory(category.id, succeededLocationIds[0])
          : deactivateCategory(category.id, succeededLocationIds[0]))
      }
    } catch {
      errors.push('Kategori bilgileri güncellenemedi.')
    }

    setLocationIds(succeededLocationIds)
    setIsSubmitting(false)

    if (errors.length > 0) {
      setSaveErrors(errors)
      return
    }

    queryClient.invalidateQueries({ queryKey: ['categories'], exact: false })
    toast.success('Kategori bilgileri güncellendi.')
    onClose()
  }

  function handleSave() {
    if (!name.trim()) {
      setSaveErrors(['Kategori adı zorunludur.'])
      return
    }

    if (isMultiLocationDeactivation && !confirmingDeactivate) {
      setConfirmingDeactivate(true)
      return
    }

    void persistChanges()
  }

  return (
    <>
      <div className="flex items-center justify-between border-b border-zinc-200 px-5 py-4">
        <Dialog.Title className="text-sm font-semibold tracking-wide text-zinc-900 uppercase">
          Kategori Bilgileri &amp; Düzenle
        </Dialog.Title>
        <Dialog.Close className="text-zinc-400 transition-colors hover:text-zinc-700">
          <X className="size-4" />
        </Dialog.Close>
      </div>

      <div className="space-y-4 px-5 py-4">
        {saveErrors.length > 0 && (
          <div className="border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
            {saveErrors.length === 1 ? (
              saveErrors[0]
            ) : (
              <>
                <p className="font-medium">Bazı değişiklikler kaydedilemedi:</p>
                <ul className="mt-1 list-inside list-disc">
                  {saveErrors.map((message) => (
                    <li key={message}>{message}</li>
                  ))}
                </ul>
              </>
            )}
          </div>
        )}

        <div>
          <label className="mb-1.5 block text-xs font-medium text-zinc-600">Kategori Adı</label>
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            disabled={isSubmitting}
            className={FIELD_CLASSNAME}
          />
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium text-zinc-600">İkon</label>
          <div className="flex items-center gap-2">
            <span className="flex size-10 shrink-0 items-center justify-center border border-zinc-200 bg-zinc-50">
              <CategoryIcon icon={icon.trim() || null} />
            </span>
            <input
              value={icon}
              onChange={(event) => setIcon(event.target.value)}
              placeholder="Örn. coffee"
              disabled={isSubmitting}
              className={FIELD_CLASSNAME}
            />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium text-zinc-600">Yerleşkeler</label>
          <div className="flex flex-wrap gap-2">
            {locations.map((location) => {
              const isAssigned = locationIds.includes(location.id)
              const isLastRemaining = isAssigned && locationIds.length <= 1
              return (
                <button
                  key={location.id}
                  type="button"
                  onClick={() => toggleLocation(location.id)}
                  disabled={isSubmitting || isLastRemaining}
                  title={isLastRemaining ? 'Bir kategorinin en az bir yerleşkesi olmalıdır.' : undefined}
                  className={cn(
                    LOCATION_CHIP_CLASSNAME,
                    isAssigned
                      ? 'border-[#133458] bg-[#133458] text-white disabled:opacity-60'
                      : 'border-zinc-200 text-zinc-600 hover:border-zinc-300',
                  )}
                >
                  {location.name}
                </button>
              )
            })}
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium text-zinc-600">Ürün Sayısı</label>
          <input value={category.productCount} readOnly className={cn(FIELD_CLASSNAME, 'bg-zinc-50 text-zinc-500')} />
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium text-zinc-600">Durum</label>
          <div className="flex border border-zinc-200">
            <button
              type="button"
              onClick={() => setIsActiveAndResetConfirm(true)}
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
              onClick={() => setIsActiveAndResetConfirm(false)}
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

        {confirmingDeactivate && (
          <div className="flex items-start gap-2 border border-amber-200 bg-amber-50 px-3 py-2.5 text-xs text-amber-700">
            <AlertTriangle className="mt-0.5 size-3.5 shrink-0" />
            <span>
              Bu kategori {selectedLocationNames.join(', ')} yerleşkelerinde kullanılıyor. Deaktive ederseniz{' '}
              <strong>hepsinde</strong> pasif hale gelecektir.
            </span>
          </div>
        )}
      </div>

      <div className="flex gap-2 border-t border-zinc-200 p-4">
        {confirmingDeactivate ? (
          <>
            <Button
              type="button"
              variant="outline"
              className="h-11 flex-1 rounded-none text-sm"
              onClick={() => setConfirmingDeactivate(false)}
              disabled={isSubmitting}
            >
              Vazgeç
            </Button>
            <Button
              type="button"
              className="h-11 flex-1 rounded-none bg-destructive text-sm text-white hover:bg-destructive/90"
              onClick={handleSave}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Kaydediliyor...' : 'Evet, Deaktive Et'}
            </Button>
          </>
        ) : (
          <>
            <Button type="button" variant="outline" className="h-11 flex-1 rounded-none text-sm" onClick={onClose}>
              İptal
            </Button>
            <Button
              type="button"
              className="h-11 flex-1 rounded-none bg-[#133458] text-sm text-white hover:bg-[#0f2843]"
              onClick={handleSave}
              disabled={isSubmitting || !hasChanges}
            >
              {isSubmitting ? 'Kaydediliyor...' : 'Güncelle'}
            </Button>
          </>
        )}
      </div>
    </>
  )
}

interface CategoryEditPopupProps {
  category: CategoryAdminResponseDto | null
  locations: LocationDto[]
  onClose: () => void
}

export function CategoryEditPopup({ category, locations, onClose }: CategoryEditPopupProps) {
  return (
    <Dialog.Root open={Boolean(category)} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 bg-zinc-900/40 backdrop-blur-sm" />
        <Dialog.Popup className="fixed top-1/2 left-1/2 w-full max-w-md -translate-x-1/2 -translate-y-1/2 border border-zinc-200 bg-white">
          {category && <CategoryEditForm key={category.id} category={category} locations={locations} onClose={onClose} />}
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
