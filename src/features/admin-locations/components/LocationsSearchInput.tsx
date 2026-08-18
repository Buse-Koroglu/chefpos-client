import { SearchInput } from '@/shared/components/SearchInput'

interface LocationsSearchInputProps {
  value: string
  onChange: (value: string) => void
}

export function LocationsSearchInput({ value, onChange }: LocationsSearchInputProps) {
  return <SearchInput value={value} onChange={onChange} placeholder="Yerleşke ismine göre arayın" />
}
