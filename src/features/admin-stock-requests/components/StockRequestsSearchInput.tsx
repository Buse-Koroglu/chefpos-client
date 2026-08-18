import { SearchInput } from '@/shared/components/SearchInput'

interface StockRequestsSearchInputProps {
  value: string
  onChange: (value: string) => void
}

export function StockRequestsSearchInput({ value, onChange }: StockRequestsSearchInputProps) {
  return <SearchInput value={value} onChange={onChange} placeholder="Ürün ismine göre arayın" />
}
