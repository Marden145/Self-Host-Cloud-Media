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
export async function deleteAlbum(idAlbum) {
  const response = await api.delete(`/Album/DeleteAlbum/${idAlbum}`)
  return response.data
}

export async function addAlbumMedia(idAlbum, idMedias) {
  const response = await api.post('/Album/AddAlbumMedia', { idAlbum, IdMedias: idMedias })
  return response.data
}

export async function deleteAlbumMedia(idAlbum, idMedias) {
  const response = await api.delete(`/Album/DeleteAlbumMedia/${idAlbum}`, { data: idMedias })
  return response.data
}