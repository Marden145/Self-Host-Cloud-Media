import api from './api'

export async function getStorage() {
  const response = await api.get('/Storage/storageAvailable')
  return response.data || null // el 204 (NoContent) llega como cuerpo vacío
}