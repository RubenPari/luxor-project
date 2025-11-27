/**
 * @file App.tsx
 * @description Componente radice dell'applicazione Luxor.
 * 
 * Questo componente orchestra l'intera struttura dell'applicazione:
 * - Gestisce la navigazione tramite React Router
 * - Mostra gli errori globali dal context dei preferiti
 * - Definisce il layout principale con header, main e footer
 * 
 * Route disponibili:
 * - / : Pagina di ricerca foto
 * - /favorites : Pagina dei preferiti
 */

import { Routes, Route } from 'react-router-dom'
import Navigation from './components/Navigation'
import SearchPage from './components/SearchPage'
import FavoritesPage from './components/FavoritesPage'
import Toast from './components/Toast'
import { useFavorites } from './contexts/FavoritesContext'

/**
 * Componente principale dell'applicazione.
 * 
 * Responsabilità:
 * - Configura le route dell'applicazione con React Router
 * - Consuma il context dei preferiti per conteggio e gestione errori
 * - Renderizza il layout completo con navigazione, contenuto e footer
 * 
 * @returns JSX con la struttura completa dell'applicazione
 */
function App() {
  // === CONTEXT ===
  
  /**
   * Valori dal context dei preferiti:
   * - favoriteIds: Set per contare i preferiti (mostrato nel badge)
   * - error: eventuale errore da mostrare all'utente
   * - clearError: funzione per chiudere il messaggio di errore
   * - toasts: array di notifiche toast da visualizzare
   * - removeToast: funzione per rimuovere un toast
   */
  const { favoriteIds, error, clearError, toasts, removeToast } = useFavorites()

  // === RENDERING ===

  return (
    // Container principale con supporto dark mode
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      
      {/* Barra di navigazione sticky in alto */}
      <Navigation favoritesCount={favoriteIds.size} />

      {/* Contenuto principale */}
      <main className="container mx-auto p-4 md:p-8">
        
        {/* Banner di errore globale (visibile solo se c'è un errore) */}
        {error && (
          <div
            className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-md shadow-md"
            role="alert"  // Accessibilità: identifica come alert per screen reader
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

        {/* Route dell'applicazione */}
        <Routes>
          <Route path="/" element={<SearchPage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
        </Routes>
      </main>

      {/* Footer con copyright e crediti */}
      <footer className="bg-white dark:bg-gray-800 shadow-inner py-6 mt-12">
        <div className="container mx-auto text-center text-gray-600 dark:text-gray-400">
          <p>&copy; 2025 Luxor. Tutti i diritti riservati.</p>
          <p className="mt-1">
            Realizzato con React, Tailwind CSS e le API di Unsplash.
          </p>
        </div>
      </footer>

      {/* Toast notifications */}
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  )
}

export default App
