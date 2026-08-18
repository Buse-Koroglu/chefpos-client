const MAX_VISIBLE_LOCATIONS = 2

const CHIP_CLASSNAME = 'border border-zinc-200 bg-zinc-50 px-2 py-0.5 text-xs font-medium text-zinc-600'

interface ProductLocationChipsProps {
  locationNames: string[]
}

export function ProductLocationChips({ locationNames }: ProductLocationChipsProps) {
  if (locationNames.length === 0) {
    return <span className="text-xs text-zinc-400">—</span>
  }

  const visible = locationNames.slice(0, MAX_VISIBLE_LOCATIONS)
  const overflowCount = locationNames.length - visible.length

  return (
    <div className="flex flex-wrap items-center gap-1">
      {visible.map((name) => (
        <span key={name} className={CHIP_CLASSNAME}>
          {name}
        </span>
      ))}
      {overflowCount > 0 && <span className={CHIP_CLASSNAME}>+{overflowCount}</span>}
    </div>
  )
}
