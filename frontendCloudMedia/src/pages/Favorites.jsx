import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { Sidebar } from '../components/Media/Sidebar'
import { TopBar } from '../components/Media/TopBar'
import { MediaGrid } from '../components/Media/MediaGrid'
import { Lightbox } from '../components/Media/Lightbox'
import { useMediaList } from '../hooks/useMediaList'
import { getFavorites, saveMedia, setFavorites } from '../services/mediaService'

function Favorites() {
  const {
    items, loading, loadingMore, error, hasMorePages,
    loadMore, addItem, updateItem, removeItem,
  } = useMediaList(getFavorites)

  const [openIndex, setOpenIndex] = useState(-1)

  const handleAddMedia = async (files) => {
    for (const file of files) {
      const formData = new FormData()
      formData.append('file', file)
      await saveMedia(formData) 
    }
  }

  const handleToggleFavorite = async (item) => {
   
    removeItem(item.id)
    try {
      await setFavorites(item.id, false)
    } catch (err) {
      addItem(item) 
      console.error(err)
    }
  }

  return (
    <div className="flex min-h-dvh">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar onAddMedia={handleAddMedia} />
        <main className="flex flex-col gap-6 pb-16 pt-6">
          <h1 className="px-4 text-2xl font-semibold tracking-tight lg:px-8">Favoritos</h1>
          {loading && <p className="px-4 text-sm text-muted-foreground lg:px-8">Cargando...</p>}
          {error && <p className="px-4 text-sm text-red-500 lg:px-8">{error}</p>}
          {!loading && !error && (
            <MediaGrid
              items={items}
              onOpen={(id) => setOpenIndex(items.findIndex((i) => i.id === id))}
              onToggleFavorite={handleToggleFavorite}
              emptyMessage="Aún no tienes favoritos"
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
    </div>
  )
}

export default Favorites