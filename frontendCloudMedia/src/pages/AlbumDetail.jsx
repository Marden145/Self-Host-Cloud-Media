import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { ChevronLeft,ImagePlus,Trash2  } from 'lucide-react'
import { Sidebar } from '../components/Media/Sidebar'
import { TopBar } from '../components/Media/TopBar'
import { MediaGrid } from '../components/Media/MediaGrid'
import { Lightbox } from '../components/Media/Lightbox'
import { useMediaList } from '../hooks/useMediaList'
import { getAlbumMedia } from '../services/albumService'
import { deleteAlbum } from '../services/albumService'
import { MediaPickerModal } from '../components/Media/MediaPickerModal'
function AlbumDetailInner({ idAlbum }) {
  const navigate = useNavigate()

  const {
    items, meta, loading, loadingMore, error, hasMorePages, loadMore, handleToggleFavorite
  } = useMediaList((page, pageSize) => getAlbumMedia(idAlbum, page, pageSize), { idAlbum })

  const [openIndex, setOpenIndex] = useState(-1)
  const [pickerOpen, setPickerOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)

const handleDeleteAlbumClick = async () => {
  setDeleting(true)
  try {
    await deleteAlbum(idAlbum) 
    navigate('/albumes')
  } catch (err) {
    console.error(err)
    setDeleting(false)
  }
}
const handleAddAlbumMedia = async (selectedItems) => {
    await addAlbumMedia(idAlbum, selectedItems.map((i) => i.id))
    selectedItems.forEach(addItem) 
  }
 return (
    <div className="flex min-h-dvh">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar />
        <main className="flex flex-col gap-6 pb-16 pt-6">
          <div className="flex items-center justify-between gap-3 px-4 lg:px-8">
            <div className="flex min-w-0 items-center gap-3">
              <button
                type="button"
                onClick={() => navigate('/albumes')}
                aria-label="Volver a álbumes"
                className="flex size-9 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <ChevronLeft className="size-5" />
              </button>
              <h1 className="truncate text-2xl font-semibold tracking-tight">{meta.name || 'Álbum'}</h1>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <button
                type="button"
                onClick={() => setPickerOpen(true)}
                className="inline-flex h-10 items-center gap-2 rounded-full bg-foreground px-4 text-sm font-medium text-background transition-opacity hover:opacity-90"
              >
                <ImagePlus className="size-4" aria-hidden="true" />
                <span className="hidden sm:inline">Agregar fotos</span>
              </button>
              <button
                type="button"
                onClick={handleDeleteAlbumClick}
                disabled={deleting}
                aria-label="Eliminar álbum"
                className="flex size-10 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-red-50 hover:text-red-500 disabled:opacity-50"
              >
                <Trash2 className="size-4" aria-hidden="true" />
              </button>
            </div>
          </div>

          {loading && <p className="px-4 text-sm text-muted-foreground lg:px-8">Cargando...</p>}
          {error && <p className="px-4 text-sm text-red-500 lg:px-8">{error}</p>}
          {!loading && !error && (
            <MediaGrid
              items={items}
              onOpen={(id) => setOpenIndex(items.findIndex((i) => i.id === id))}
              onToggleFavorite={handleToggleFavorite}
              emptyMessage="Este álbum no tiene fotos todavía"
            />
          )}
          {loadingMore && <p className="text-center text-sm text-muted-foreground">Cargando más...</p>}
        </main>
      </div>

      <AnimatePresence>
        {openIndex >= 0 && (
          <Lightbox
            items={items}
            index={openIndex}
            onIndexChange={setOpenIndex}
            onClose={() => setOpenIndex(-1)}
            onNeedMore={loadMore}
            hasMorePages={hasMorePages}
            onToggleFavorite={handleToggleFavorite}
          />
        )}
      </AnimatePresence>

      <MediaPickerModal
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onConfirm={handleAddAlbumMedia}
        excludeIds={items.map((i) => i.id)}
      />
    </div>
  )
}

function AlbumDetail() {
  const { idAlbum } = useParams()
  return <AlbumDetailInner key={idAlbum} idAlbum={idAlbum} />
}

export default AlbumDetail