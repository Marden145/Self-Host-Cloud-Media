import { useEffect, useState } from 'react'
import { FolderPlus } from 'lucide-react'
import { Sidebar } from '../components/Sidebar'
import { TopBar } from '../components/TopBar'
import { AlbumCard } from '../components/AlbumCard'
import { Modal } from '../components/Modal'
import { saveMedia } from '../services/mediaService'
import { getAlbums, addAlbum } from '../services/albumService'

function Albums() {
  const [albums, setAlbums] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [newName, setNewName] = useState('')
  const [creating, setCreating] = useState(false)

  useEffect(() => {
    getAlbums()
      .then(setAlbums)
      .catch((err) => { setError('No se pudieron cargar los álbumes.'); console.error(err) })
      .finally(() => setLoading(false))
  }, [])

  const handleAddMedia = async (files) => {
    for (const file of files) {
      const formData = new FormData()
      formData.append('file', file)
      await saveMedia(formData)
    }
  }

  const handleCreateAlbum = async (e) => {
    e.preventDefault()
    if (!newName.trim()) return
    setCreating(true)
    try {
      await addAlbum(newName.trim())
      const refreshed = await getAlbums() // más simple y confiable que asumir la forma exacta de la respuesta
      setAlbums(refreshed)
      setNewName('')
      setModalOpen(false)
    } catch (err) {
      console.error(err)
    } finally {
      setCreating(false)
    }
  }

  return (
    <div className="flex min-h-dvh">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar onAddMedia={handleAddMedia} />
        <main className="flex flex-col gap-6 pb-16 pt-6">
          <div className="flex items-center justify-between px-4 lg:px-8">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">Álbumes</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                {albums.length} álbum{albums.length === 1 ? '' : 'es'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="inline-flex h-10 items-center gap-2 rounded-full bg-foreground px-4 text-sm font-medium text-background transition-opacity hover:opacity-90"
            >
              <FolderPlus className="size-4" aria-hidden="true" />
              <span className="hidden sm:inline">Nuevo álbum</span>
            </button>
          </div>

          {loading && <p className="px-4 text-sm text-muted-foreground lg:px-8">Cargando...</p>}
          {error && <p className="px-4 text-sm text-red-500 lg:px-8">{error}</p>}

          {!loading && !error && albums.length === 0 && (
            <div className="mx-4 flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed px-6 py-20 text-center lg:mx-8">
              <FolderPlus className="size-8 text-muted-foreground" aria-hidden="true" />
              <p className="font-medium">Aún no tienes álbumes</p>
              <p className="max-w-sm text-sm text-muted-foreground">Crea uno para empezar a organizar tus fotos.</p>
            </div>
          )}

          {!loading && !error && albums.length > 0 && (
            <ul className="grid grid-cols-2 gap-4 px-4 sm:grid-cols-3 md:grid-cols-4 lg:px-8 2xl:grid-cols-6">
              {albums.map((album, i) => (
                <li key={album.idAlbum}>
                  <AlbumCard album={album} index={i} />
                </li>
              ))}
            </ul>
          )}
        </main>
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Nuevo álbum">
        <form onSubmit={handleCreateAlbum} className="flex flex-col gap-4">
          <div>
            <label htmlFor="album-name" className="text-sm font-medium text-muted-foreground">
              Nombre del álbum
            </label>
            <input
              id="album-name"
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Ej. Vacaciones 2026"
              autoFocus
              className="mt-1.5 h-10 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none transition-shadow focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="h-10 rounded-full px-4 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={creating || !newName.trim()}
              className="h-10 rounded-full bg-highlight px-4 text-sm font-medium text-highlight-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {creating ? 'Creando...' : 'Crear álbum'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default Albums