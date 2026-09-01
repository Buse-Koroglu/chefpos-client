import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { activateLocation, deactivateLocation, updateLocation } from '@/shared/api/endpoints/locations'

interface UpdateLocationVariables {
  locationId: string
  name?: string
  isActive?: boolean
}

export function useUpdateLocation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ locationId, name, isActive }: UpdateLocationVariables) => {
      if (name !== undefined) {
        await updateLocation(locationId, { name })
      }
      if (isActive !== undefined) {
        await (isActive ? activateLocation(locationId) : deactivateLocation(locationId))
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['locations'], exact: false })
      toast.success('Yerleşke bilgileri güncellendi.')
    },
  })
}
