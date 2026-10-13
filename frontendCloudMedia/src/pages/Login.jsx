import { useState } from 'react'
import { GoogleLogin } from '@react-oauth/google'
import { loginWithGoogle } from '../services/authService'
import { useAuth } from '../context/AuthContext'
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
function Login() {
  const { login, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname ?? '/galeria'
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  if (isAuthenticated) return <Navigate to={from} replace />

  const handleSuccess = async (credentialResponse) => {
    setError(null)
    setLoading(true)

    try {
      const token = await loginWithGoogle(credentialResponse.credential)

      if (!token.validacionExitosa) {
        setError('No se pudo iniciar sesión con Google.')
        return
      }

     
      login(token)
      navigate(from, { replace: true })
       console.log('Token recibido:', token.accessToken)
    } catch (err) {
      setError('Ocurrió un error al conectar con el servidor.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm text-center">
      <h1 className="text-2xl font-semibold mb-6">Iniciar sesión</h1>

      {loading && <p className="text-gray-500 mb-4">Verificando...</p>}
      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="flex justify-center">
        <GoogleLogin
          onSuccess={handleSuccess}
          onError={() => setError('El login con Google falló.')}
          size="large"
          shape="pill"
          width="280"
        />
      </div>
    </div>
  </div>
)
}

export default Login