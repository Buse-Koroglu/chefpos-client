import { useState } from 'react'
import axios from 'axios'
import { Dialog } from '@base-ui/react/dialog'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { LocationDto } from '@/shared/types/location'
import { useActiveCategories } from '@/features/admin-products/hooks/useActiveCategories'
import { useCreateProduct } from '@/features/admin-products/hooks/useCreateProduct'
import { ImageUploadInput } from '@/shared/components/ImageUploadInput'
import { FIELD_CLASSNAME, MultiSelectDropdown } from './MultiSelectDropdown'

interface FormErrors {
  name?: string
  categoryId?: string
  price?: string
  locationIds?: string
}

interface FormValues {
  name: string
  categoryId: string
  price: string
  locationIds: string[]
}

function validate(values: FormValues, categoryLocationIds: string[] | undefined): FormErrors {
  const errors: FormErrors = {}
  if (!values.name.trim()) errors.name = 'Ürün adı zorunludur.'
  if (!values.categoryId) errors.categoryId = 'Kategori seçmelisiniz.'
  if (values.price.trim() === '' || Number(values.price) < 0) errors.price = 'Geçerli bir fiyat girin.'
  if (values.locationIds.length === 0) errors.locationIds = 'En az bir yerleşke seçmelisiniz.'
  else if (categoryLocationIds && !values.locationIds.every((id) => categoryLocationIds.includes(id))) {
    errors.locationIds = 'Seçilen kategori, seçilen yerleşkelerin tümünde tanımlı değil.'
  }
  return errors
}

function getCreateErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status
    if (status === 400) return error.response?.data?.detail ?? 'Bilgileri kontrol edip tekrar deneyin.'
    if (status === 401 || status === 403) return 'Bu işlem için yönetici yetkisine sahip olmalısınız.'
  }
  return 'Ürün oluşturulamadı. Lütfen tekrar deneyin.'
}

interface AddProductPopupProps {
  open: boolean
  locations: LocationDto[]
  onClose: () => void
}

export function AddProductPopup({ open, locations, onClose }: AddProductPopupProps) {
  const { data: categories = [] } = useActiveCategories()
  const createProductMutation = useCreateProduct()

  const [name, setName] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [price, setPrice] = useState('')
  const [description, setDescription] = useState('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [locationIds, setLocationIds] = useState<string[]>([])
  const [errors, setErrors] = useState<FormErrors>({})
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [uploadProgress, setUploadProgress] = useState<number | undefined>(undefined)
  const isSubmitting = createProductMutation.isPending

  const selectedCategory = categories.find((category) => category.id === categoryId)

  function reset() {
    setName('')
    setCategoryId('')
    setPrice('')
    setDescription('')
    setImageFile(null)
    setLocationIds([])
    setErrors({})
    setSubmitError(null)
    setUploadProgress(undefined)
  }

  function handleClose() {
    reset()
    onClose()
  }

  function toggleLocation(locationId: string) {
    setLocationIds((prev) =>
      prev.includes(locationId) ? prev.filter((value) => value !== locationId) : [...prev, locationId],
    )
  }

  async function handleSubmit() {
    const nextErrors = validate({ name, categoryId, price, locationIds }, selectedCategory?.locationIds)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setSubmitError(null)

    try {
      await createProductMutation.mutateAsync({
        name: name.trim(),
        price: Number(price),
        categoryId,
        locationIds,
        description: description.trim() || null,
        imageFile,
        onUploadProgress: setUploadProgress,
      })

      handleClose()
    } catch (error) {
      setSubmitError(getCreateErrorMessage(error))
    }
  }

  const locationOptions = locations.map((loc) => ({ id: loc.id, label: loc.name }))

  return (
    <Dialog.Root open={open} onOpenChange={(nextOpen) => !nextOpen && handleClose()}>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-50 bg-zinc-900/40 backdrop-blur-sm" />
        <Dialog.Popup className="fixed top-1/2 left-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 border border-zinc-200 bg-white">
          <div className="flex items-center justify-between border-b border-zinc-200 px-5 py-4">
            <Dialog.Title className="text-sm font-semibold tracking-wide text-zinc-900 uppercase">
              Yeni Ürün Ekle
            </Dialog.Title>
            <Dialog.Close className="text-zinc-400 transition-colors hover:text-zinc-700">
              <X className="size-4" />
            </Dialog.Close>
          </div>

          <div className="max-h-[70vh] space-y-4 overflow-y-auto px-5 py-4">
            {submitError && (
              <div className="border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">{submitError}</div>
            )}

            <div>
              <label className="mb-1.5 block text-xs font-medium text-zinc-600">Ürün Adı</label>
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Örn. Türk Kahvesi"
                className={cn(FIELD_CLASSNAME, errors.name && 'border-red-300')}
                autoFocus
              />
              {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-zinc-600">Kategori</label>
                <select
                  value={categoryId}
                  onChange={(event) => setCategoryId(event.target.value)}
                  className={cn(FIELD_CLASSNAME, errors.categoryId && 'border-red-300')}
                >
                  <option value="">Seçiniz</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                {errors.categoryId && <p className="mt-1 text-xs text-red-600">{errors.categoryId}</p>}
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-zinc-600">Satış Fiyatı</label>
                <input
                  value={price}
                  onChange={(event) => setPrice(event.target.value)}
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  className={cn(FIELD_CLASSNAME, errors.price && 'border-red-300')}
                />
                {errors.price && <p className="mt-1 text-xs text-red-600">{errors.price}</p>}
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-zinc-600">Açıklama (opsiyonel)</label>
              <input
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Ürün açıklaması"
                className={FIELD_CLASSNAME}
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-zinc-600">Görsel (opsiyonel)</label>
              <ImageUploadInput
                file={imageFile}
                onFileChange={setImageFile}
                disabled={isSubmitting}
                uploading={isSubmitting && uploadProgress !== undefined}
                uploadProgress={uploadProgress}
              />
            </div>

            <div>
              <MultiSelectDropdown
                label="Yerleşkeler"
                placeholder="Yerleşke seçiniz..."
                options={locationOptions}
                selectedIds={locationIds}
                onToggle={toggleLocation}
                disabled={isSubmitting}
                hasError={Boolean(errors.locationIds)}
              />
              {errors.locationIds && <p className="mt-1 text-xs text-red-600">{errors.locationIds}</p>}
              <p className="mt-1.5 text-xs text-zinc-400">
                Reçete, ürün oluşturulduktan sonra düzenleme ekranından yerleşke bazlı eklenebilir.
              </p>
            </div>
          </div>

          <div className="flex gap-2 border-t border-zinc-200 p-4">
            <Button
              type="button"
              variant="outline"
              className="h-11 flex-1 rounded-none text-sm"
              onClick={handleClose}
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
              {isSubmitting ? 'Kaydediliyor...' : 'Kaydet'}
            </Button>
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  )
}