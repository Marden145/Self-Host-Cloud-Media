import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { Sidebar } from '../components/Media/Sidebar'
import { TopBar } from '../components/Media/TopBar'
import { MediaGrid } from '../components/Media/MediaGrid'
import { Lightbox } from '../components/Media/Lightbox'
import { useMediaList } from '../hooks/useMediaList'
import { getTrash } from '../services/mediaService'

function Trash() {
  const {
    items, loading, loadingMore, error, hasMorePages, loadMore,
    handleAddMedia, handleRecover,
  } = useMediaList(getTrash)

  const [openIndex, setOpenIndex] = useState(-1)

  return (
    <div className="flex min-h-dvh">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar onAddMedia={handleAddMedia} />
        <main className="flex flex-col gap-6 pb-16 pt-6">
          <div className="px-4 lg:px-8">
            <h1 className="text-2xl font-semibold tracking-tight">Papelera</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Los archivos se eliminan definitivamente después de un tiempo.
            </p>
          </div>
          {loading && <p className="px-4 text-sm text-muted-foreground lg:px-8">Cargando...</p>}
          {error && <p className="px-4 text-sm text-red-500 lg:px-8">{error}</p>}
          {!loading && !error && (
            <MediaGrid
              items={items}
              onOpen={(id) => setOpenIndex(items.findIndex((i) => i.id === id))}
              onRecover={handleRecover}
              emptyMessage="La papelera está vacía"
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
          />
        )}
      </AnimatePresence>
    </div>
  )
}

export default Trash