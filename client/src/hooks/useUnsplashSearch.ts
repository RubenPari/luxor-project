/**
 * @file useUnsplashSearch.ts
 * @description Hook React personalizzato per la ricerca di foto su Unsplash.
 * 
 * Questo hook incapsula tutta la logica di ricerca foto, inclusi:
 * - Gestione dello stato di caricamento e errori
 * - Paginazione dei risultati
 * - Memorizzazione della query corrente
 * 
 * Separa la logica di business dalla UI, permettendo ai componenti
 * di consumare semplicemente i dati e le funzioni esposte.
 */

import { useCallback, useState } from 'react'
import type { UnsplashPhoto } from '../types/unsplash'
import { searchPhotos } from '../services/unsplash'

/**
 * Opzioni di configurazione per l'hook useUnsplashSearch.
 */
interface UseUnsplashSearchOptions {
  /** Numero di risultati per pagina (default: 12) */
  perPage?: number
}

/**
 * Interfaccia che descrive il valore restituito dall'hook.
 * Contiene lo stato della ricerca e le funzioni per controllarla.
 */
interface UseUnsplashSearchResult {
  /** Array delle foto trovate nella pagina corrente */
  photos: UnsplashPhoto[]
  /** Flag che indica se una ricerca è in corso */
  isLoading: boolean
  /** Messaggio di errore, null se non ci sono errori */
  error: string | null
  /** Query di ricerca attualmente attiva */
  currentQuery: string
  /** Numero della pagina corrente (1-indexed) */
  currentPage: number
  /** Numero totale di pagine disponibili per la query corrente */
  totalPages: number
  /** Funzione per eseguire una nuova ricerca (resetta alla pagina 1) */
  search: (query: string) => Promise<void>
  /** Funzione per navigare a una pagina specifica */
  goToPage: (page: number) => Promise<void>
  /** Funzione per cancellare l'errore corrente */
  clearError: () => void
}

/**
 * Hook personalizzato per gestire la ricerca di foto su Unsplash.
 * 
 * Fornisce un'interfaccia semplice per eseguire ricerche paginate,
 * gestendo automaticamente lo stato di caricamento, gli errori e
 * la navigazione tra le pagine dei risultati.
 * 
 * @param options - Opzioni di configurazione (opzionali)
 * @returns Oggetto con stato della ricerca e funzioni di controllo
 * 
 * @example
 * function SearchComponent() {
 *   const { photos, isLoading, search, goToPage } = useUnsplashSearch({ perPage: 20 });
 *   
 *   const handleSearch = () => search('montagna');
 *   const nextPage = () => goToPage(currentPage + 1);
 *   
 *   return (...);
 * }
 */
export function useUnsplashSearch(options: UseUnsplashSearchOptions = {}): UseUnsplashSearchResult {
  // Estrae le opzioni con valori di default
  const { perPage = 12 } = options

  // === STATO LOCALE ===
  
  /** Risultati della ricerca corrente */
  const [photos, setPhotos] = useState<UnsplashPhoto[]>([])
  
  /** Flag di caricamento per mostrare spinner/skeleton */
  const [isLoading, setIsLoading] = useState(false)
  
  /** Eventuale messaggio di errore da mostrare all'utente */
  const [error, setError] = useState<string | null>(null)
  
  /** Query di ricerca memorizzata per la paginazione */
  const [currentQuery, setCurrentQuery] = useState('')
  
  /** Pagina corrente (1-indexed) */
  const [currentPage, setCurrentPage] = useState(1)
  
  /** Totale pagine disponibili (calcolato dal server) */
  const [totalPages, setTotalPages] = useState(0)

  // === FUNZIONI DI RICERCA ===
  
  /**
   * Esegue la ricerca effettiva chiamando l'API.
   * Funzione interna usata sia da search() che da goToPage().
   * 
   * @param query - Termine di ricerca
   * @param page - Numero di pagina da recuperare (default: 1)
   */
  const performSearch = useCallback(
    async (query: string, page: number = 1) => {
      // Ignora query vuote o solo spazi
      const trimmed = query.trim()
      if (!trimmed) return

      // Imposta lo stato di caricamento e aggiorna query/pagina
      setIsLoading(true)
      setError(null)
      setCurrentQuery(trimmed)
      setCurrentPage(page)

      try {
        // Chiama il servizio di ricerca
        const response = await searchPhotos(trimmed, page, perPage)

        if (response.success) {
          // Successo: aggiorna risultati e metadati paginazione
          setPhotos(response.data.results)
          setTotalPages(response.data.total_pages)
        } else {
          // Errore dal server: mostra messaggio e resetta
          setError(response.message || 'Failed to search photos')
          setPhotos([])
          setTotalPages(0)
        }
      } catch (err) {
        // Errore di rete o imprevisto
        console.error('Search error:', err)
        setError('An error occurred while searching. Please try again.')
        setPhotos([])
        setTotalPages(0)
      } finally {
        // Termina sempre lo stato di caricamento
        setIsLoading(false)
      }
    },
    [perPage],
  )

  /**
   * Avvia una nuova ricerca partendo dalla prima pagina.
   * Resetta automaticamente la paginazione.
   * 
   * @param query - Termine di ricerca inserito dall'utente
   */
  const search = useCallback(
    async (query: string) => {
      await performSearch(query, 1)
    },
    [performSearch],
  )

  /**
   * Naviga a una pagina specifica dei risultati.
   * Valida i limiti della paginazione prima di eseguire la richiesta.
   * Scrolla automaticamente la pagina verso l'alto per UX migliore.
   * 
   * @param page - Numero della pagina desiderata (1-indexed)
   */
  const goToPage = useCallback(
    async (page: number) => {
      // Valida: deve esserci una query attiva e la pagina deve essere valida
      if (!currentQuery || page <= 0 || (totalPages && page > totalPages)) return
      
      // Esegue la ricerca per la pagina richiesta
      await performSearch(currentQuery, page)
      
      // Scrolla la pagina verso l'alto con animazione smooth
      if (typeof window !== 'undefined') {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    },
    [currentQuery, totalPages, performSearch],
  )

  /**
   * Cancella l'errore corrente.
   * Utile per permettere all'utente di chiudere i messaggi di errore.
   */
  const clearError = useCallback(() => setError(null), [])

  // === VALORE RESTITUITO ===
  
  return {
    // Stato
    photos,
    isLoading,
    error,
    currentQuery,
    currentPage,
    totalPages,
    // Funzioni
    search,
    goToPage,
    clearError,
  }
}
