import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import  Gallery  from './pages/Gallery'
import Favorites from './pages/Favorites'
import Trash from './pages/Trash'
import Albums from './pages/Albums'
import AlbumDetail from './pages/AlbumDetail'
import { AuthProvider } from './context/AuthContext'
import { StorageProvider } from './context/StorageContext'
import { PrivateRoute } from './components/PrivateRoute'

function App() {
  return (
    <AuthProvider>
      <StorageProvider>
        <BrowserRouter>
          <Routes>
            {/* pública */}
            <Route path="/login" element={<Login />} />

            {/* protegidas: cada página ya incluye su Sidebar y TopBar */}
            <Route path="/galeria" element={<PrivateRoute><Gallery /></PrivateRoute>} />
            <Route path="/favoritos" element={<PrivateRoute><Favorites /></PrivateRoute>} />
            <Route path="/papelera" element={<PrivateRoute><Trash /></PrivateRoute>} />
            <Route path="/albumes" element={<PrivateRoute><Albums /></PrivateRoute>} />
            <Route path="/albumes/:idAlbum" element={<PrivateRoute><AlbumDetail /></PrivateRoute>} />

            <Route path="/" element={<Navigate to="/galeria" replace />} />
          </Routes>
        </BrowserRouter>
      </StorageProvider>
    </AuthProvider>
  )
}

export default App
