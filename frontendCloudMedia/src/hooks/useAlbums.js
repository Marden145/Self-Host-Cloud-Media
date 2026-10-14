import { useCallback, useEffect, useState } from 'react'
import { getAlbums, addAlbum, deleteAlbum } from '../services/albumService'

export function useAlbums() {
  const [albums, setAlbums] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const refresh = useCallback(async () => {
    const data = await getAlbums()
    setAlbums(data)
    return data
  }, [])

  useEffect(() => {
    setLoading(true)
    refresh()
      .catch((err) => { setError('No se pudieron cargar los álbumes.'); console.error(err) })
      .finally(() => setLoading(false))
  }, [refresh])

  const handleCreateAlbum = useCallback(async ({ name, cover }) => {
  const created = await addAlbum({ name, coverMediaId: cover?.id ?? null })
  const album = { ...created, coverAlbumUrl: cover?.storagePath ?? null }
  setAlbums((prev) =>
    prev.some((a) => a.idAlbum === album.idAlbum) ? prev : [album, ...prev],
  )
}, [])

  const handleDeleteAlbum = useCallback(async (idAlbum) => {
    setAlbums((prev) => prev.filter((a) => a.idAlbum !== idAlbum)) // optimista
    try {
      await deleteAlbum(idAlbum)
    } catch (err) {
      await refresh() // si falla, recarga la lista real en vez de adivinar cómo revertir
      console.error(err)
    }
  }, [refresh])

  return { albums, loading, error, handleCreateAlbum, handleDeleteAlbum }
}