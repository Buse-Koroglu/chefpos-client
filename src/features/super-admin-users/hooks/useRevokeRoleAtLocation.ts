import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import type { Role } from '@/shared/types/auth'
import { revokeRoleAtLocation } from '@/shared/api/endpoints/users'
import { getApiErrorMessage } from '@/shared/api/apiError'

export function useRevokeRoleAtLocation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ userId, role, locationId }: { userId: string; role: Role; locationId: string }) =>
      revokeRoleAtLocation(userId, role, locationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'], exact: false })
      toast.success('Rol ataması kaldırıldı.')
    },
    onError: (err) => {
      toast.error(getApiErrorMessage(err, 'Rol ataması kaldırılamadı.'))
    },
  })
}
