import { useState, useEffect } from 'react'
import Navigation from './components/Navigation'
import SearchPage from './components/SearchPage'
import FavoritesPage from './components/FavoritesPage'
import { getFavorites, addFavorite, removeFavorite } from './services/favorites'
import type { UnsplashPhoto } from './types/unsplash'

function App() {
  const [currentView, setCurrentView] = useState<'search' | 'favorites'>('search')
  const [favoritePhotoIds, setFavoritePhotoIds] = useState<Set<string>>(new Set())
  const [error, setError] = useState<string | null>(null)

  // Carica i preferiti all'avvio per il badge in navigazione
  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const response = await getFavorites()
        if (response.success && Array.isArray(response.data)) {
          const ids = new Set(response.data.map((fav) => fav.photo_id))
          setFavoritePhotoIds(ids)
        } else {
          setError(response.message || 'Impossibile caricare i preferiti.')
        }
      } catch (err) {
        setError('Si è verificato un errore inatteso durante il caricamento dei preferiti.')
        console.error(err)
      }
    }

    loadFavorites()
  }, [])

  const handleToggleFavorite = async (photo: UnsplashPhoto) => {
    const isFavorite = favoritePhotoIds.has(photo.id)

    // Aggiornamento ottimistico
    setFavoritePhotoIds((prev) => {
      const next = new Set(prev)
      if (isFavorite) {
        next.delete(photo.id)
      } else {
        next.add(photo.id)
      }
      return next
    })

    try {
      const response = isFavorite
        ? await removeFavorite(photo.id)
        : await addFavorite(photo)

      if (!response.success) {
        setError(response.message || `Impossibile ${isFavorite ? 'rimuovere' : 'aggiungere'} il preferito.`)

        // rollback in caso di errore
        setFavoritePhotoIds((prev) => {
          const next = new Set(prev)
          if (isFavorite) {
            next.add(photo.id)
          } else {
            next.delete(photo.id)
          }
          return next
        })
      }
    } catch (err) {
      setError('Si è verificato un errore inatteso durante l\'aggiornamento dei preferiti.')
      console.error(err)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <Navigation
        currentView={currentView}
        onViewChange={setCurrentView}
        favoritesCount={favoritePhotoIds.size}
      />

      <main className="container mx-auto p-4 md:p-8">
        {error && (
          <div
            className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-md shadow-md"
            role="alert"
          >
            <p className="font-bold">Errore</p>
            <p>{error}</p>
            <button
              onClick={() => setError(null)}
              className="mt-2 px-3 py-1 bg-red-200 text-red-800 text-sm rounded hover:bg-red-300"
            >
              Chiudi
            </button>
          </div>
        )}

        {currentView === 'search' ? (
          <SearchPage
            favoritePhotoIds={favoritePhotoIds}
            onToggleFavorite={handleToggleFavorite}
          />
        ) : (
          <FavoritesPage onToggleFavorite={handleToggleFavorite} />
        )}
      </main>

      <footer className="bg-white dark:bg-gray-800 shadow-inner py-6 mt-12">
        <div className="container mx-auto text-center text-gray-600 dark:text-gray-400">
          <p>&copy; 2025 Luxor. Tutti i diritti riservati.</p>
          <p className="mt-1">
            Powered by React, Tailwind CSS, and the Unsplash API.
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App
