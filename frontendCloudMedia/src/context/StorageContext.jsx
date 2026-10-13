import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { getStorage } from '../services/storageService'
import { useAuth } from './AuthContext'

const StorageContext = createContext(null)

export function StorageProvider({ children }) {
  const { isAuthenticated } = useAuth()
  const [storage, setStorage] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const refresh = useCallback(async () => {
    try {
      const data = await getStorage()
      setStorage(data)
      setError(null)
    } catch (err) {
      setError('No se pudo cargar el almacenamiento.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!isAuthenticated) {
      setStorage(null)
      setError(null)
      return
    }
    setLoading(true)
    refresh()
  }, [isAuthenticated, refresh])

  const value = useMemo(
    () => ({ storage, loading, error, refresh }),
    [storage, loading, error, refresh],
  )

  return <StorageContext.Provider value={value}>{children}</StorageContext.Provider>
}

export function useStorage() {
  const ctx = useContext(StorageContext)
  if (!ctx) throw new Error('useStorage debe usarse dentro de <StorageProvider>')
  return ctx
}