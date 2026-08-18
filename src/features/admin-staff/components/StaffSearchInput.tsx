import { SearchInput } from '@/shared/components/SearchInput'

interface StaffSearchInputProps {
  value: string
  onChange: (value: string) => void
}

export function StaffSearchInput({ value, onChange }: StaffSearchInputProps) {
  return <SearchInput value={value} onChange={onChange} placeholder="Ad, soyad veya personel no ile arayın" />
}
