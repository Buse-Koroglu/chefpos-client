import { Search } from 'lucide-react'

const SEARCH_INPUT_CLASSNAME =
  'h-10 w-full max-w-sm rounded-none border border-zinc-200 bg-zinc-50 pl-9 pr-3 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none transition-colors focus-visible:border-zinc-400'

interface LocationsSearchInputProps {
  value: string
  onChange: (value: string) => void
}

export function LocationsSearchInput({ value, onChange }: LocationsSearchInputProps) {
  return (
    <div className="relative">
      <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-zinc-400" />
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Yerleşke ismine göre arayın"
        className={SEARCH_INPUT_CLASSNAME}
      />
    </div>
  )
}
