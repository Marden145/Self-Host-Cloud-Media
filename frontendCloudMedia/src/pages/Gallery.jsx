import { useEffect, useRef, useState, useCallback } from 'react'
import { Sidebar } from '../components/Media/Sidebar'
import { TopBar } from '../components/Media/TopBar'
import { MediaGrid } from '../components/Media/MediaGrid'
import { Lightbox } from '../components/Media/Lightbox'
import { getMedia, saveMedia } from '../services/mediaService'

const PAGE_SIZE = 30

function Gallery() {
  const [items, setItems] = useState([])
  const [pageIndex, setPageIndex] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState(null)
  const [openIndex, setOpenIndex] = useState(-1)

  const hasMorePages = pageIndex < totalPages
  const sentinelRef = useRef(null)

  // Carga una página y la agrega al final de lo que ya había
  const loadPage = useCallback(async (page) => {
    const data = await getMedia(page, PAGE_SIZE)
    setItems((prev) => {
    const existingIds = new Set(prev.map((i) => i.id))
    const newItems = data.items.filter((i) => !existingIds.has(i.id))
    return [...prev, ...newItems]
  })
    setTotalPages(data.totalPages)
  }, [])

  // Carga inicial
  useEffect(() => {
    setLoading(true)
    loadPage(1)
      .catch((err) => { setError('No se pudo cargar la galería.'); console.error(err) })
      .finally(() => setLoading(false))
  }, [loadPage])

  // Trae la siguiente página cuando haga falta (llamado desde el grid o desde el Lightbox)
  const loadMore = useCallback(async () => {
    if (loadingMore || !hasMorePages) return
    setLoadingMore(true)
    try {
      const nextPage = pageIndex + 1
      await loadPage(nextPage)
      setPageIndex(nextPage)
    } finally {
      setLoadingMore(false)
    }
  }, [loadPage, pageIndex, hasMorePages, loadingMore])

  // Detecta cuándo el usuario llega al final del grid (Intersection Observer)
  useEffect(() => {
    if (!sentinelRef.current) return
    const observer = new IntersectionObserver(
      (entries) => { if (entries[0].isIntersecting) loadMore() },
      { rootMargin: '400px' } // empieza a cargar un poco antes de llegar al final
    )
    observer.observe(sentinelRef.current)
    return () => observer.disconnect()
  }, [loadMore])

  const handleAddMedia = async (files) => {
    for (const file of files) {
      const formData = new FormData()
      formData.append('file', file)
      
       // aparece de inmediato arriba, sin recargar todo
    }
  }

  return (
    <div className="flex min-h-dvh">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar onAddMedia={handleAddMedia} />
        <main className="flex flex-col gap-6 pb-16 pt-6">
          {loading && <p className="px-4 text-sm text-muted-foreground lg:px-8">Cargando...</p>}
          {error && <p className="px-4 text-sm text-red-500 lg:px-8">{error}</p>}
          {!loading && !error && (
            <>
              <MediaGrid items={items} onOpen={(id) => setOpenIndex(items.findIndex((i) => i.id === id))} />
              <div ref={sentinelRef} className="h-1" />
              {loadingMore && <p className="text-center text-sm text-muted-foreground">Cargando más...</p>}
            </>
          )}
        </main>
      </div>

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
    </div>
  )
}

export default Gallery