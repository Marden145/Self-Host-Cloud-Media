import { ImageOff } from 'lucide-react'
import { MediaTile } from './MediaTile'

export function MediaGrid({ items, onOpen }) {
  if (items.length === 0) {
    return (
      <div className="mx-4 flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed px-6 py-20 text-center lg:mx-8">
        <ImageOff className="size-8 text-muted-foreground" aria-hidden="true" />
        <p className="font-medium">No hay archivos todavía</p>
      </div>
    )
  }

  return (
    <ul className="grid grid-cols-3 gap-0.5 sm:gap-1 md:grid-cols-4 lg:px-8 2xl:grid-cols-6">
      {items.map((item) => (
        <li key={item.id}>
          <MediaTile item={item} onOpen={() => onOpen(item.id)} />
        </li>
      ))}
    </ul>
  )
}