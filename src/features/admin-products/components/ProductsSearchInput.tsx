import { SearchInput } from '@/shared/components/SearchInput'

interface ProductsSearchInputProps {
  value: string
  onChange: (value: string) => void
}

export function ProductsSearchInput({ value, onChange }: ProductsSearchInputProps) {
  return <SearchInput value={value} onChange={onChange} placeholder="Ürün ismine göre arayın" />
}
