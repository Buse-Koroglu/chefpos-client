import { useState, useRef, useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { Dialog } from '@base-ui/react/dialog'
import { AlertTriangle, Check, ChevronDown, X } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { LocationDto } from '@/shared/types/location'
import type { CategoryAdminResponseDto } from '@/shared/types/category'
import type { ProductResponse } from '@/shared/types/product'
import {
  activateProduct,
  addProductLocation,
  deactivateProduct,
  removeProductLocation,
  updateProduct,
  updateProductPrice,
} from '@/shared/api/endpoints/products'
import { Skeleton } from '@/shared/components/Skeleton'
import { useProductDetail } from '@/features/admin-products/hooks/useProductDetail'
import { ProductImagePreview } from './ProductImagePreview'
import { ProductRecipeSection } from './ProductRecipeSection'

const FIELD_CLASSNAME =
  'h-10 w-full rounded-none border border-zinc-200 bg-white px-3 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none transition-colors focus-visible:border-zinc-400'

function getDetailErrorMessage(): string {
  return 'Ürün bilgileri yüklenemedi.'
}

interface MultiSelectDropdownProps {
  label: string
  placeholder: string
  options: { id: string; label: string }[]
  selectedIds: string[]
  onToggle: (id: string) => void
  disabled?: boolean
  minRequired?: number
}

function MultiSelectDropdown({
  label,
  placeholder,
  options,
  selectedIds,
  onToggle,
  disabled,
  minRequired = 0,
}: MultiSelectDropdownProps) {
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

      {/* Tetikleyici Buton */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen((prev) => !prev)}
        className={cn(
          FIELD_CLASSNAME,
          'flex items-center justify-between text-left cursor-pointer transition-all',
          isOpen && 'border-[#133458] ring-1 ring-[#133458]',
          disabled && 'opacity-60 cursor-not-allowed bg-zinc-50',
        )}
      >
        <span className="truncate text-zinc-600">
          {selectedIds.length === 0 ? placeholder : `${selectedIds.length} yerleşke seçildi`}
        </span>
        <ChevronDown
          className={cn('size-4 text-zinc-400 transition-transform duration-200', isOpen && 'rotate-180')}
        />
      </button>

      {/* Açılır Liste */}
      {isOpen && (
        <div className="absolute z-50 mt-1 max-h-56 w-full overflow-y-auto border border-zinc-200 bg-white shadow-lg">
          <div className="p-1 space-y-0.5">
            {options.map((option) => {
              const isSelected = selectedIds.includes(option.id)
              const isLastRemaining = isSelected && selectedIds.length <= minRequired

              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => !isLastRemaining && onToggle(option.id)}
                  disabled={disabled || isLastRemaining}
                  title={isLastRemaining ? `En az ${minRequired} yerleşke seçili kalmalıdır.` : undefined}
                  className={cn(
                    'flex w-full items-center justify-between px-3 py-2 text-xs font-medium transition-colors text-left',
                    isSelected ? 'bg-[#133458]/10 text-[#133458]' : 'text-zinc-700 hover:bg-zinc-100',
                    isLastRemaining && 'cursor-not-allowed opacity-60',
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

      {/* Seçili Rozetler (Chips) */}
      {selectedIds.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pt-1">
          {selectedIds.map((id) => {
            const opt = options.find((o) => o.id === id)
            const isLastRemaining = selectedIds.length <= minRequired

            return (
              <span
                key={id}
                className={cn(
                  'inline-flex items-center gap-1 border border-[#133458] bg-[#133458] px-2 py-0.5 text-xs font-medium text-white',
                  isLastRemaining && 'opacity-90',
                )}
              >
                {opt?.label ?? id}
                <button
                  type="button"
                  onClick={() => !isLastRemaining && onToggle(id)}
                  disabled={disabled || isLastRemaining}
                  title={isLastRemaining ? `En az ${minRequired} yerleşke seçili kalmalıdır.` : undefined}
                  className={cn('hover:opacity-75 focus:outline-none', isLastRemaining && 'hidden')}
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

interface ProductEditFormProps {
  product: ProductResponse
  locations: LocationDto[]
  categories: CategoryAdminResponseDto[]
  canEditLocations: boolean
  onClose: () => void
}

function ProductEditForm({ product, locations, categories, canEditLocations, onClose }: ProductEditFormProps) {
  const queryClient = useQueryClient()

  const [name, setName] = useState(product.name)
  const [description, setDescription] = useState(product.description ?? '')
  const [imageUrl, setImageUrl] = useState(product.imageUrl ?? '')
  const [price, setPrice] = useState(String(product.price))
  const [locationIds, setLocationIds] = useState<string[]>(product.locationIds)
  const [isActive, setIsActive] = useState(product.isActive)
  const [saveErrors, setSaveErrors] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [confirmingDeactivate, setConfirmingDeactivate] = useState(false)

  const categoryName = categories.find((category) => category.id === product.categoryId)?.name ?? product.categoryId

  const hasChanges =
    name.trim() !== product.name ||
    description.trim() !== (product.description ?? '') ||
    imageUrl.trim() !== (product.imageUrl ?? '') ||
    Number(price) !== product.price ||
    isActive !== product.isActive ||
    locationIds.length !== product.locationIds.length ||
    locationIds.some((id) => !product.locationIds.includes(id))

  const isFormValid = name.trim() !== '' && Number(price) >= 0

  const isMultiLocationDeactivation = product.isActive && !isActive && locationIds.length > 1

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

    const locationsToAdd = locationIds.filter((id) => !product.locationIds.includes(id))
    const locationsToRemove = product.locationIds.filter((id) => !locationIds.includes(id))
    let succeededLocationIds = product.locationIds

    for (const locationId of locationsToAdd) {
      try {
        await addProductLocation(product.id, locationId)
        succeededLocationIds = [...succeededLocationIds, locationId]
      } catch {
        const name = locations.find((location) => location.id === locationId)?.name ?? locationId
        errors.push(`${name} yerleşkesi eklenemedi.`)
      }
    }

    for (const locationId of locationsToRemove) {
      try {
        await removeProductLocation(product.id, locationId)
        succeededLocationIds = succeededLocationIds.filter((id) => id !== locationId)
      } catch {
        const name = locations.find((location) => location.id === locationId)?.name ?? locationId
        errors.push(`${name} yerleşkesi kaldırılamadı.`)
      }
    }

    try {
      if (
        name.trim() !== product.name ||
        description.trim() !== (product.description ?? '') ||
        imageUrl.trim() !== (product.imageUrl ?? '')
      ) {
        await updateProduct(product.id, {
          name: name.trim(),
          description: description.trim() || null,
          imageUrl: imageUrl.trim() || null,
        })
      }
      if (Number(price) !== product.price) {
        await updateProductPrice(product.id, Number(price))
      }
      if (isActive !== product.isActive) {
        await (isActive ? activateProduct(product.id, succeededLocationIds[0]) : deactivateProduct(product.id, succeededLocationIds[0]))
      }
    } catch {
      errors.push('Ürün bilgileri güncellenemedi.')
    }

    setLocationIds(succeededLocationIds)
    setIsSubmitting(false)

    if (errors.length > 0) {
      setSaveErrors(errors)
      return
    }

    queryClient.invalidateQueries({ queryKey: ['products'], exact: false })
    toast.success('Ürün bilgileri güncellendi.')
    onClose()
  }

  function handleSave() {
    if (!isFormValid) {
      setSaveErrors(['Lütfen tüm alanları geçerli değerlerle doldurun.'])
      return
    }

    if (isMultiLocationDeactivation && !confirmingDeactivate) {
      setConfirmingDeactivate(true)
      return
    }

    void persistChanges()
  }

  const locationOptions = locations.map((loc) => ({ id: loc.id, label: loc.name }))

  return (
    <>
      <div className="flex items-center justify-between border-b border-zinc-200 px-5 py-4">
        <Dialog.Title className="text-sm font-semibold tracking-wide text-zinc-900 uppercase">
          Ürün Bilgileri &amp; Düzenle
        </Dialog.Title>
        <Dialog.Close className="text-zinc-400 transition-colors hover:text-zinc-700">
          <X className="size-4" />
        </Dialog.Close>
      </div>

      <div className="max-h-[75vh] space-y-4 overflow-y-auto px-5 py-4">
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
          <label className="mb-1.5 block text-xs font-medium text-zinc-600">Ürün Adı</label>
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            disabled={isSubmitting}
            className={FIELD_CLASSNAME}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-zinc-600">Kategori</label>
            <input value={categoryName} readOnly className={cn(FIELD_CLASSNAME, 'bg-zinc-50 text-zinc-500')} />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-zinc-600">Satış Fiyatı</label>
            <input
              value={price}
              onChange={(event) => setPrice(event.target.value)}
              type="number"
              min="0"
              step="0.01"
              disabled={isSubmitting}
              className={FIELD_CLASSNAME}
            />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium text-zinc-600">Açıklama</label>
          <input
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            disabled={isSubmitting}
            className={FIELD_CLASSNAME}
          />
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium text-zinc-600">Görsel URL</label>
          <div className="flex items-center gap-2">
            <ProductImagePreview imageUrl={imageUrl.trim() || null} />
            <input
              value={imageUrl}
              onChange={(event) => setImageUrl(event.target.value)}
              placeholder="https://..."
              disabled={isSubmitting}
              className={FIELD_CLASSNAME}
            />
          </div>
        </div>

        {/* Yerleşkeler */}
        {canEditLocations ? (
          <MultiSelectDropdown
            label="Yerleşkeler"
            placeholder="Yerleşke seçiniz..."
            options={locationOptions}
            selectedIds={locationIds}
            onToggle={toggleLocation}
            disabled={isSubmitting}
            minRequired={1}
          />
        ) : (
          <div>
            <label className="mb-1.5 block text-xs font-medium text-zinc-600">Yerleşke</label>
            <input
              value={
                locations
                  .filter((location) => locationIds.includes(location.id))
                  .map((location) => location.name)
                  .join(', ') || '—'
              }
              readOnly
              className={cn(FIELD_CLASSNAME, 'bg-zinc-50 text-zinc-500')}
            />
          </div>
        )}

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
              Bu ürün {locations.filter((location) => locationIds.includes(location.id)).map((location) => location.name).join(', ')}{' '}
              yerleşkelerinde kullanılıyor. Deaktive ederseniz <strong>hepsinde</strong> pasif hale gelecektir.
            </span>
          </div>
        )}

        <div>
          <label className="mb-1.5 block text-xs font-medium text-zinc-600">Reçete</label>
          <div className="space-y-2">
            {product.locations.map((locationRecipe) => (
              <ProductRecipeSection
                key={locationRecipe.locationId}
                productId={product.id}
                locationId={locationRecipe.locationId}
                locationName={locations.find((location) => location.id === locationRecipe.locationId)?.name ?? '—'}
                ingredients={locationRecipe.ingredients}
              />
            ))}
          </div>
        </div>
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
              {isSubmitting ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
            </Button>
          </>
        )}
      </div>
    </>
  )
}

interface ProductEditPopupProps {
  productId: string | null
  locations: LocationDto[]
  categories: CategoryAdminResponseDto[]
  canEditLocations?: boolean
  onClose: () => void
}

export function ProductEditPopup({ productId, locations, categories, canEditLocations = false, onClose }: ProductEditPopupProps) {
  const { data: product, isLoading, isError } = useProductDetail(productId ?? undefined)

  return (
    <Dialog.Root open={Boolean(productId)} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 bg-zinc-900/40 backdrop-blur-sm" />
        <Dialog.Popup className="fixed top-1/2 left-1/2 w-full max-w-xl -translate-x-1/2 -translate-y-1/2 border border-zinc-200 bg-white">
          {isError ? (
            <div className="p-5">
              <div className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {getDetailErrorMessage()}
              </div>
            </div>
          ) : isLoading || !product ? (
            <div className="space-y-3 p-5">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : (
            <ProductEditForm
              key={product.id}
              product={product}
              locations={locations}
              categories={categories}
              canEditLocations={canEditLocations}
              onClose={onClose}
            />
          )}
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  )
}