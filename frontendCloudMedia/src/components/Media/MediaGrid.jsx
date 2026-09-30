import { ImageOff } from 'lucide-react'
import { MediaTile } from './MediaTile'
import { motion } from 'framer-motion'
export function MediaGrid({ items, onOpen, onToggleFavorite, onDelete, onRecover, emptyMessage = 'No hay archivos todavía' }) {
  if (items.length === 0) {
    return (
      <div className="mx-4 flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed px-6 py-20 text-center lg:mx-8">
        <ImageOff className="size-8 text-muted-foreground" aria-hidden="true" />
        <p className="font-medium">{emptyMessage}</p>
      </div>
    )
  }

  return (
    <ul className="grid w-full grid-cols-3 gap-1 px-4 sm:gap-1.5 md:grid-cols-4 lg:px-8 2xl:grid-cols-6">
      {items.map((item, i) => (
        <motion.li
          key={item.id}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.25, delay: Math.min(i, 12) * 0.02 }}
        >
          <MediaTile
            item={item}
            onOpen={() => onOpen(item.id)}
            onToggleFavorite={onToggleFavorite}
            onDelete={onDelete}
            onRecover={onRecover}
          />
        </motion.li>
      ))}
    </ul>
  )
}