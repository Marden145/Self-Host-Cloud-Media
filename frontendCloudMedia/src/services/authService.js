import api from './api'
export async function loginWithGoogle(idToken) {
  const response = await api.post('/LoginGoogle/sing-google', { idToken })
  return response.data 
}