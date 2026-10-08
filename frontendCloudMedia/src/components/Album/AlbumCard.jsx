import { motion } from 'framer-motion'
import { Images,Trash2  } from 'lucide-react'
import { Link } from 'react-router-dom'

export function AlbumCard({ album, index = 0, onDelete }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: Math.min(index, 12) * 0.03 }}
      className="group relative"
    >
      <Link to={`/albumes/${album.idAlbum}`} className="block">
        <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-muted ring-1 ring-border transition-shadow group-hover:shadow-md">
          <div className="flex h-full w-full items-center justify-center">
            <Images className="size-9 text-muted-foreground/40" aria-hidden="true" />
          </div>
        </div>
        <p className="mt-2 truncate text-sm font-medium">{album.name}</p>
      </Link>

      {onDelete && (
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault()
            onDelete(album)
          }}
          aria-label={`Eliminar álbum ${album.name}`}
          className="absolute right-1.5 top-1.5 flex size-7 items-center justify-center rounded-full bg-black/40 text-white opacity-0 backdrop-blur-sm transition-opacity hover:bg-black/60 focus-visible:opacity-100 group-hover:opacity-100 [@media(hover:none)]:opacity-100"
        >
          <Trash2 className="size-3.5" aria-hidden="true" />
        </button>
      )}
    </motion.div>
  )
}