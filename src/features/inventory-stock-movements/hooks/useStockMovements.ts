import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { getStockMovementsPaged } from '@/shared/api/endpoints/stockMovements'
import type { StockMovementType } from '@/shared/types/stockMovement'
import { STOCK_MOVEMENTS_PAGE_SIZE } from '../constants'

export function useStockMovements(locationId: string | undefined, type: StockMovementType | undefined, pageNumber: number) {
  return useQuery({
    queryKey: ['stockMovements', locationId, type, pageNumber],
    queryFn: () =>
      getStockMovementsPaged({
        locationId,
        type,
        pageNumber,
        pageSize: STOCK_MOVEMENTS_PAGE_SIZE,
      }),
    enabled: Boolean(locationId),
    placeholderData: keepPreviousData,
  })
}
