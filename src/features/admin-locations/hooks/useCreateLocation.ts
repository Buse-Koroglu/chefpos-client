import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { createLocation } from '@/shared/api/endpoints/locations'
import { grantRoleAtLocation } from '@/shared/api/endpoints/users'
import { getApiErrorMessage } from '@/shared/api/apiError'

interface CreateLocationVariables {
  name: string
  adminUserId?: string
}

export function useCreateLocation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ name, adminUserId }: CreateLocationVariables) => {
      const location = await createLocation({ name })
      queryClient.invalidateQueries({ queryKey: ['locations'], exact: false })

      if (adminUserId) {
        try {
          await grantRoleAtLocation(adminUserId, 'ADMIN', location.id)
          queryClient.invalidateQueries({ queryKey: ['users'], exact: false })
          toast.success('Yerleşke ve Yönetici ataması başarıyla tamamlandı.')
        } catch (adminError) {
          toast.warning(
            `Yerleşke oluşturuldu ancak Yönetici ataması başarısız oldu: ${getApiErrorMessage(adminError)}`,
          )
        }
      } else {
        toast.success('Yerleşke başarıyla eklendi.')
      }

      return location
    },
  })
}
