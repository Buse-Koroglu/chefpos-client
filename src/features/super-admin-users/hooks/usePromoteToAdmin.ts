import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { addRole, assignLocationAccess, getAdminByLocation, removeRole } from '@/shared/api/endpoints/users'

export class ExistingAdminError extends Error {}

interface PromoteToAdminVariables {
  userId: string
  locationId: string
}

export function usePromoteToAdmin() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ userId, locationId }: PromoteToAdminVariables) => {
      const existingAdmin = await getAdminByLocation(locationId)
      if (existingAdmin && existingAdmin.id !== userId) {
        throw new ExistingAdminError(
          `Bu yerleşkede zaten bir Yönetici atanmış: ${existingAdmin.firstName} ${existingAdmin.lastName}. Devam etmeden önce mevcut yöneticiyi indirin.`,
        )
      }

      await addRole(userId, 'ADMIN')

      try {
        await assignLocationAccess(userId, locationId)
      } catch (assignError) {
        await removeRole(userId, 'ADMIN')
        throw assignError
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'], exact: false })
      toast.success('Kullanıcı yönetici olarak atandı.')
    },
  })
}
