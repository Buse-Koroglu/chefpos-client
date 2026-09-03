import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { Role } from '@/shared/types/auth'
import { grantRoleAtLocation } from '@/shared/api/endpoints/users'
import { updateUserInCache } from '@/features/admin-staff/utils'

export function useGrantRoleAtLocation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ userId, role, locationId }: { userId: string; role: Role; locationId: string }) =>
      grantRoleAtLocation(userId, role, locationId),
    onSuccess: (user) => updateUserInCache(queryClient, user),
  })
}
