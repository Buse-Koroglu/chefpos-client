import { SearchInput } from '@/shared/components/SearchInput'

interface TablesSearchInputProps {
  value: string
  onChange: (value: string) => void
}

export function TablesSearchInput({ value, onChange }: TablesSearchInputProps) {
  return <SearchInput value={value} onChange={onChange} placeholder="Masa numarasına göre arayın" />
}
