import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {activateCategory,addCategoryLocation, deactivateCategory, removeCategoryLocation,updateCategory} from '@/shared/api/endpoints/categories'
import type { CategoryAdminResponseDto } from '@/shared/types/category'
import type { LocationDto } from '@/shared/types/location'

interface UpdateCategoryVariables {
  category: CategoryAdminResponseDto
  locations: LocationDto[]
  name: string
  icon: string
  locationIds: string[]
  isActive: boolean
}

interface UpdateCategoryResult {
  errors: string[]
  succeededLocationIds: string[]
}

async function persistCategoryChanges({category,locations,name,icon,locationIds,isActive}: UpdateCategoryVariables): Promise<UpdateCategoryResult> {
  const errors: string[] = []

  const locationsToAdd = locationIds.filter((id) => !category.locationIds.includes(id))
  const locationsToRemove = category.locationIds.filter((id) => !locationIds.includes(id))
  let succeededLocationIds = category.locationIds

  for (const locationId of locationsToAdd) {
    try {
      await addCategoryLocation(category.id, locationId)
      succeededLocationIds = [...succeededLocationIds, locationId]
    } catch {
      const locationName = locations.find((location) => location.id === locationId)?.name ?? locationId
      errors.push(`${locationName} yerleşkesi eklenemedi.`)
    }
  }

  for (const locationId of locationsToRemove) {
    try {
      await removeCategoryLocation(category.id, locationId)
      succeededLocationIds = succeededLocationIds.filter((id) => id !== locationId)
    } catch {
      const locationName = locations.find((location) => location.id === locationId)?.name ?? locationId
      errors.push(`${locationName} yerleşkesi kaldırılamadı.`)
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

  return { errors, succeededLocationIds }
}

export function useUpdateCategory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: persistCategoryChanges,
    onSuccess: (result) => {
      if (result.errors.length === 0) {
        queryClient.invalidateQueries({ queryKey: ['categories'], exact: false })
        toast.success('Kategori bilgileri güncellendi.')
      }
    },
  })
}
