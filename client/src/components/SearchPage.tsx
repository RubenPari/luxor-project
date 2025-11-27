/**
 * @file SearchPage.tsx
 * @description Pagina principale per la ricerca di foto su Unsplash.
 * 
 * Questa pagina include:
 * - Header con titolo e descrizione
 * - Form di ricerca con input e pulsante submit
 * - Griglia dei risultati con supporto preferiti
 * - Controlli di paginazione
 * 
 * Utilizza l'hook useUnsplashSearch per la logica di ricerca
 * e il context FavoritesContext per la gestione dei preferiti.
 */

import { useState, FormEvent } from 'react'
import PhotoGrid from './PhotoGrid'
import { useFavorites } from '../contexts/FavoritesContext'
import { useUnsplashSearch } from '../hooks/useUnsplashSearch'

/**
 * Componente pagina per la ricerca di foto.
 * 
 * Funzionalità:
 * - Ricerca foto tramite query testuale
 * - Visualizzazione risultati in griglia responsive
 * - Toggle preferiti direttamente dalla griglia
 * - Navigazione tra pagine di risultati
 * 
 * @returns Pagina completa di ricerca foto
 */
export default function SearchPage() {
  // === CONTEXT E HOOKS ===
  
  /** Context dei preferiti per ID e toggle */
  const { favoriteIds, toggleFavorite } = useFavorites()
  
  /** Stato locale per l'input di ricerca (controllato) */
  const [query, setQuery] = useState('')

  /**
   * Hook personalizzato per la ricerca.
   * Gestisce stato di caricamento, errori, paginazione e risultati.
   */
  const {
    photos,       // Array delle foto trovate
    isLoading,    // Flag caricamento in corso
    error,        // Eventuale messaggio di errore
    currentPage,  // Pagina corrente (1-indexed)
    totalPages,   // Totale pagine disponibili
    search,       // Funzione per avviare ricerca
    goToPage,     // Funzione per cambiare pagina
  } = useUnsplashSearch({ perPage: 12 })

  // === EVENT HANDLERS ===
  
  /**
   * Gestisce il submit del form di ricerca.
   * Previene il comportamento default e avvia la ricerca.
   * 
   * @param e - Evento submit del form
   */
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    void search(query)  // void per ignorare la Promise (gestita internamente)
  }

  /**
   * Gestisce il cambio di pagina.
   * Wrapper per goToPage che ignora la Promise restituita.
   * 
   * @param newPage - Numero della nuova pagina
   */
  const handlePageChange = (newPage: number) => {
    void goToPage(newPage)
  }

  // === RENDERING ===

  return (
    <div className="container mx-auto px-4 py-8">
      
      {/* Header della pagina con titolo e sottotitolo */}
      <header className="text-center mb-12">
        <h1 className="text-5xl font-extrabold text-gray-900 dark:text-white mb-2">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-600">
            Luxor Ricerca Foto
          </span>
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300">
          Scopri immagini straordinarie in alta risoluzione dalla community di Unsplash.
        </p>
      </header>

      {/* Form di ricerca con input e pulsante */}
      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto mb-12">
        <div className="relative">
          {/* Input di ricerca - campo controllato */}
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cerca qualsiasi cosa..."
            disabled={isLoading}
            className="w-full pl-4 pr-12 py-3 text-lg border-2 border-gray-300 dark:border-gray-700 rounded-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
          />
          {/* Pulsante submit con icona (lente o spinner) */}
          <button
            type="submit"
            disabled={isLoading || !query.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-purple-600 text-white hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? (
              // Spinner animato durante il caricamento
              <svg className="animate-spin h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              // Icona lente di ingrandimento
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            )}
          </button>
        </div>
      </form>

      {/* Messaggio di errore (visibile solo se presente) */}
      {error && (
        <div className="text-center my-8 p-4 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-lg">
          <p><strong>Errore:</strong> {error}</p>
        </div>
      )}

      {/* Container risultati con altezza minima per evitare layout shift */}
      <div className="min-h-[500px]">
        <PhotoGrid 
          photos={photos} 
          isLoading={isLoading} 
          favoritePhotoIds={favoriteIds}
          onToggleFavorite={toggleFavorite}
        />
      </div>

      {/* Controlli paginazione (visibili solo se ci sono risultati e più pagine) */}
      {!isLoading && photos.length > 0 && totalPages > 1 && (
        <div className="flex justify-center items-center space-x-4 mt-12">
          {/* Pulsante pagina precedente */}
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Precedente
          </button>
          
          {/* Indicatore pagina corrente */}
          <span className="text-gray-700 dark:text-gray-300">
            Pagina {currentPage} di {totalPages}
          </span>
          
          {/* Pulsante pagina successiva */}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Successiva
          </button>
        </div>
      )}
    </div>
  )
}
