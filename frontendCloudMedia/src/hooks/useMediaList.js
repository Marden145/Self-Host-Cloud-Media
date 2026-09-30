import { useCallback, useEffect, useRef, useState } from 'react'

export function useMediaList(fetchPage, pageSize = 30) {
  // guardamos la función de fetch en un ref para no reiniciar la carga
  // cada vez que el componente que llama al hook se re-renderiza
  const fetchPageRef = useRef(fetchPage)
  useEffect(() => {
    fetchPageRef.current = fetchPage
  })

  const [items, setItems] = useState([])
  const [pageIndex, setPageIndex] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState(null)

  const hasMorePages = pageIndex < totalPages

  const loadPage = useCallback(async (page) => {
    const data = await fetchPageRef.current(page, pageSize)
    setItems((prev) => {
      const existingIds = new Set(prev.map((i) => i.id))
      const newItems = data.items.filter((i) => !existingIds.has(i.id))
      return [...prev, ...newItems]
    })
    setTotalPages(data.totalPages)
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

  return { items, loading, loadingMore, error, hasMorePages, loadMore, addItem, updateItem, removeItem }
}