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

import { useState, type FormEvent } from 'react'
import PhotoGrid from './PhotoGrid'
import Pagination from './Pagination'
import { SearchIcon, SpinnerIcon } from './icons'
import { useFavorites } from '../contexts/FavoritesContext'
import { useUnsplashSearch } from '../hooks/useUnsplashSearch'
import { PHOTOS_PER_PAGE } from '../constants'

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
  
  /** Context dei preferiti per ID, toggle e stato salvataggio */
  const { favoriteIds, savingPhotoIds, toggleFavorite } = useFavorites()
  
  /** Stato locale per l'input di ricerca (controllato) */
  const [query, setQuery] = useState('')

  /**
   * Hook personalizzato per la ricerca.
   * Gestisce stato di caricamento, errori, paginazione e risultati.
   */
  const {
    photos,
    isLoading,
    error,
    currentPage,
    totalPages,
    search,
    goToPage,
  } = useUnsplashSearch({ perPage: PHOTOS_PER_PAGE })

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
            {isLoading ? <SpinnerIcon /> : <SearchIcon />}
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
          savingPhotoIds={savingPhotoIds}
          onToggleFavorite={toggleFavorite}
        />
      </div>

      {/* Controlli paginazione */}
      {!isLoading && photos.length > 0 && totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          className="mt-12"
        />
      )}
    </div>
  )
}
