import { useCallback, useEffect, useRef, useState } from 'react'
import { saveMedia, setFavorites, deleteMedia, recoverMedia } from '../services/mediaService'
import {  addAlbumMedia } from '../services/albumService'
export function useMediaList(fetchPage, { pageSize = 30 } = {}) {
  // guardamos la función de fetch en un ref para no reiniciar la carga
  // cada vez que el componente que llama al hook se re-renderiza
  const fetchPageRef = useRef(fetchPage)
  useEffect(() => {
    fetchPageRef.current = fetchPage
  })

  const [items, setItems] = useState([])
  const [pageIndex, setPageIndex] = useState(1)
  const [meta, setMeta] = useState({})
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState(null)

  const hasMorePages = pageIndex < totalPages

  const loadPage = useCallback(async (page) => {
    const raw = await fetchPageRef.current(page, pageSize)
    console.log(raw)
    const paged = raw.media ?? raw // soporta respuesta "plana" o "envuelta" (como la de álbumes)

    if (raw.media) {
      const { media, ...rest } = raw
      setMeta(rest) // guarda name, idAlbum, createdAt, etc. — lo que venga aparte de "media"
    }

    setItems((prev) => {
      const existingIds = new Set(prev.map((i) => i.id))
      const newItems = paged.items.filter((i) => !existingIds.has(i.id))
      return [...prev, ...newItems]
    })
    
    setTotalPages(paged.totalPages)
  }, [pageSize])

  useEffect(() => {
    setLoading(true)
    loadPage(1)
      .catch((err) => { setError('No se pudo cargar el contenido.'); console.error(err) })
      .finally(() => setLoading(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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

  const addItem = useCallback((item) => {
    setItems((prev) => (prev.some((i) => i.id === item.id) ? prev : [item, ...prev]))
  }, [])

  const updateItem = useCallback((id, updates) => {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, ...updates } : i)))
  }, [])

  const removeItem = useCallback((id) => {
    setItems((prev) => prev.filter((i) => i.id !== id))
  }, [])

  const handleAddMedia = useCallback(async (files) => {
    for (const file of files) {
      const formData = new FormData()
      formData.append('file', file)
      const saved = await saveMedia(formData)
      addItem(saved)
    }
  }, [addItem])

  
  const handleToggleFavorite = useCallback(async (item) => {
    const nextValue = !item.isFavorite
    updateItem(item.id, { isFavorite: nextValue })
    try {
      await setFavorites(item.id, nextValue)
    } catch (err) {
      updateItem(item.id, { isFavorite: item.isFavorite })
      console.error(err)
    }
  }, [updateItem])

  const handleDelete = useCallback(async (item) => {
    removeItem(item.id)
    try {
      await deleteMedia([item.id])
    } catch (err) {
      addItem(item)
      console.error(err)
    }
  }, [removeItem, addItem])

  const handleRecover = useCallback(async (item) => {
    removeItem(item.id)
    try {
      await recoverMedia(item.id)
    } catch (err) {
      addItem(item)
      console.error(err)
    }
  }, [removeItem, addItem])



  return {
    items, loading, meta,loadingMore, error, hasMorePages, loadMore,
    addItem, updateItem, removeItem,
    handleAddMedia, handleToggleFavorite, handleDelete, handleRecover,
  }
}