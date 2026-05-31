import { Button } from 'animal-island-ui'
import type { DialogueNext } from './types'

type Props = {
  items: ReadonlyArray<{ label: string; next: DialogueNext }>
  onSelect: (next: DialogueNext) => void
}

export function DialogueOptions({ items, onSelect }: Props) {
  return (
    <div className="mt-4 flex flex-wrap gap-2">
      {items.map((opt) => (
        <Button key={opt.label} type="primary" onClick={() => onSelect(opt.next)}>
          {opt.label}
        </Button>
      ))}
    </div>
  )
}
