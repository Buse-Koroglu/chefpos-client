import { SearchInput } from '@/shared/components/SearchInput'

interface CategoriesSearchInputProps {
  value: string
  onChange: (value: string) => void
}

export function CategoriesSearchInput({ value, onChange }: CategoriesSearchInputProps) {
  return <SearchInput value={value} onChange={onChange} placeholder="Kategori ismine göre arayın" />
}
