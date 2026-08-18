import { SearchInput } from '@/shared/components/SearchInput'

interface IngredientsSearchInputProps {
  value: string
  onChange: (value: string) => void
}

export function IngredientsSearchInput({ value, onChange }: IngredientsSearchInputProps) {
  return <SearchInput value={value} onChange={onChange} placeholder="Ham madde ismine göre arayın" />
}
