import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import type { Role, UserResponseDto } from '@/shared/types/auth'
import { assignLocationAccess, createUser } from '@/shared/api/endpoints/users'
import { getApiErrorMessage } from '@/shared/api/apiError'
import { addUserToCache, findStockManagerConflictMessage, isStockManagerConflict, StockManagerPrecheckError } from '@/features/admin-staff/utils'

export interface CreateStaffMemberInput {
  firstName: string
  lastName: string
  personalId: string
  roles: Role[]
  locationIds: string[]
  locationsById: Map<string, string>
}

export interface CreateStaffMemberResult {
  user: UserResponseDto
  generatedPassword: string | null
  failedLocationIds: string[]
  stockManagerConflictMessage: string | null
}

export function useCreateStaffMember() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: CreateStaffMemberInput): Promise<CreateStaffMemberResult> => {
      if (input.roles.includes('STOCK_MANAGER')) {
        const conflict = await findStockManagerConflictMessage(input.locationIds, input.locationsById)
        if (conflict) {
          throw new StockManagerPrecheckError(
            `${conflict} Personeli oluşturmadan önce ilgili kullanıcının rolünü değiştirin veya farklı bir yerleşke seçin.`,
          )
        }
      }

      const { user, generatedPassword } = await createUser({ personalId: input.personalId,firstName: input.firstName,   lastName: input.lastName, roles: input.roles  })

      let finalUser = user
      const failedLocationIds: string[] = []
      let stockManagerConflictMessage: string | null = null

      for (const locationId of input.locationIds) {
        try {
          finalUser = await assignLocationAccess(finalUser.id, locationId)
        } catch (error) {
          failedLocationIds.push(locationId)
          if (isStockManagerConflict(error)) {
            stockManagerConflictMessage = getApiErrorMessage(error)
          }
        }
      }

      return { user: finalUser, generatedPassword, failedLocationIds, stockManagerConflictMessage }
    },
    onSuccess: (result, variables) => {
      addUserToCache(queryClient, result.user)
      if (result.failedLocationIds.length > 0) {
        const failedNames = result.failedLocationIds
          .map((id) => variables.locationsById.get(id) ?? id)
          .join(', ')
        toast.warning(`${result.user.firstName} ${result.user.lastName} oluşturuldu ancak ${failedNames} lokasyonu atanamadı.`)
      } else {
        toast.success('Personel başarıyla eklendi.')
      }
    },
  })
}
