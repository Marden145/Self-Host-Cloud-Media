import api from './api'

export async function getAlbums() {
  const response = await api.get('/Album/GetAlbums')
  return response.data
}

export async function getAlbumMedia(idAlbum, pageIndex = 1, pageSize = 30) {
  const response = await api.get(`/Album/GetAlbumMedia/${idAlbum}/${pageIndex}/${pageSize}`)
  return response.data
}

export async function addAlbum(name) {
  const response = await api.post('/Album/AddAlbum', { Name: name })
  return response.data
}