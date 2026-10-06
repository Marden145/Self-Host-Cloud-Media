import { motion } from 'framer-motion'
import { Images } from 'lucide-react'
import { Link } from 'react-router-dom'

export function AlbumCard({ album, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: Math.min(index, 12) * 0.03 }}
    >
      <Link to={`/albumes/${album.idAlbum}`} className="group block">
        <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-muted ring-1 ring-border transition-shadow group-hover:shadow-md">
          <div className="flex h-full w-full items-center justify-center">
            <Images className="size-9 text-muted-foreground/40" aria-hidden="true" />
          </div>
        </div>
        <p className="mt-2 truncate text-sm font-medium">{album.name}</p>
      </Link>
    </motion.div>
  )
}