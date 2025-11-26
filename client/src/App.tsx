import { useState } from 'react'
import Navigation from './components/Navigation'
import SearchPage from './components/SearchPage'
import FavoritesPage from './components/FavoritesPage'
import { useFavorites } from './contexts/FavoritesContext'

function App() {
  const [currentView, setCurrentView] = useState<'search' | 'favorites'>('search')
  const { favoriteIds, error, clearError } = useFavorites()

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <Navigation
        currentView={currentView}
        onViewChange={setCurrentView}
        favoritesCount={favoriteIds.size}
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
              onClick={clearError}
              className="mt-2 px-3 py-1 bg-red-200 text-red-800 text-sm rounded hover:bg-red-300"
            >
              Chiudi
            </button>
          </div>
        )}

        {currentView === 'search' ? (
          <SearchPage />
        ) : (
          <FavoritesPage />
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
