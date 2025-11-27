/**
 * @file FavoritesContext.tsx
 * @description Context React per la gestione centralizzata dei preferiti.
 * 
 * Questo modulo implementa il pattern Context + Provider per gestire lo stato
 * globale dei preferiti nell'applicazione. Fornisce:
 * - Stato reattivo della lista preferiti
 * - Funzioni per aggiungere/rimuovere preferiti con aggiornamento ottimistico
 * - Gestione centralizzata degli errori
 * - Hook personalizzato per accedere al context
 * 
 * L'aggiornamento ottimistico migliora la UX aggiornando l'UI immediatamente
 * prima della conferma dal server, con rollback automatico in caso di errore.
 */

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react'
import type { Favorite, UnsplashPhoto } from '../types/unsplash'
import { addFavorite, getFavorites, removeFavorite } from '../services/favorites'

/**
 * Interfaccia per un messaggio toast.
 */
export interface ToastMessage {
  /** ID univoco del toast */
  id: string
  /** Messaggio da visualizzare */
  message: string
  /** Tipo di toast (success, error, info) */
  type: 'success' | 'error' | 'info'
}

/**
 * Interfaccia che definisce il valore esposto dal FavoritesContext.
 * Contiene sia lo stato che le funzioni per manipolarlo.
 */
interface FavoritesContextValue {
  /** Array completo dei preferiti con tutti i dati delle foto */
  favorites: Favorite[]
  /** Set degli ID foto per lookup O(1) - usato per verificare se una foto è nei preferiti */
  favoriteIds: Set<string>
  /** Flag che indica se è in corso il caricamento dei preferiti */
  isLoading: boolean
  /** Messaggio di errore corrente, null se non ci sono errori */
  error: string | null
  /** Array di toast da visualizzare */
  toasts: ToastMessage[]
  /** Funzione per aggiungere/rimuovere una foto dai preferiti */
  toggleFavorite: (photo: UnsplashPhoto) => Promise<void>
  /** Funzione per ricaricare la lista preferiti dal server */
  reloadFavorites: () => Promise<void>
  /** Funzione per cancellare l'errore corrente */
  clearError: () => void
  /** Funzione per rimuovere un toast */
  removeToast: (id: string) => void
}

/**
 * Context React per i preferiti.
 * Inizializzato a undefined per forzare l'uso all'interno del Provider.
 */
const FavoritesContext = createContext<FavoritesContextValue | undefined>(undefined)

/**
 * Props per il componente FavoritesProvider.
 */
interface FavoritesProviderProps {
  /** Componenti figli che avranno accesso al context */
  children: ReactNode
}

/**
 * Provider component che wrappa l'applicazione e fornisce lo stato dei preferiti.
 * 
 * Gestisce:
 * - Caricamento iniziale dei preferiti all'avvio
 * - Aggiornamenti ottimistici per UX fluida
 * - Rollback automatico in caso di errori API
 * - Sincronizzazione tra array completo e Set di ID
 * 
 * @param props - Props contenenti i children da wrappare
 * @returns Provider React con il context dei preferiti
 * 
 * @example
 * // Nell'entry point dell'app (main.tsx)
 * <FavoritesProvider>
 *   <App />
 * </FavoritesProvider>
 */
export function FavoritesProvider({ children }: FavoritesProviderProps) {
  // === STATO LOCALE ===
  
  /** Array completo dei preferiti - contiene tutti i dati per il rendering */
  const [favorites, setFavorites] = useState<Favorite[]>([])
  
  /** Set di ID per lookup rapido O(1) - sincronizzato con favorites */
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set())
  
  /** Flag di caricamento - true durante le operazioni async iniziali */
  const [isLoading, setIsLoading] = useState<boolean>(true)
  
  /** Messaggio di errore per feedback all'utente */
  const [error, setError] = useState<string | null>(null)
  
  /** Array di toast per notifiche temporanee */
  const [toasts, setToasts] = useState<ToastMessage[]>([])

  // === FUNZIONI HELPER ===
  
  /**
   * Crea un Set di ID foto a partire dall'array dei preferiti.
   * Usato per mantenere sincronizzati favorites e favoriteIds.
   * 
   * @param items - Array di preferiti
   * @returns Set contenente gli ID delle foto
   */
  const syncFavoriteIds = (items: Favorite[]) => new Set(items.map((fav) => fav.photo_id))
  
  /**
   * Aggiunge un nuovo toast alla lista.
   * 
   * @param message - Messaggio da visualizzare
   * @param type - Tipo di toast (success, error, info)
   */
  const addToast = useCallback((message: string, type: ToastMessage['type']) => {
    const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    setToasts((prev) => [...prev, { id, message, type }])
  }, [])
  
  /**
   * Rimuove un toast dalla lista.
   * 
   * @param id - ID del toast da rimuovere
   */
  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])

  // === FUNZIONI PRINCIPALI ===
  
  /**
   * Carica/ricarica la lista completa dei preferiti dal backend.
   * Chiamata automaticamente al mount del provider e disponibile
   * per refresh manuali.
   * 
   * Gestisce tutti i casi:
   * - Successo: aggiorna stato con i dati ricevuti
   * - Errore API: mostra messaggio e resetta lo stato
   * - Errore rete: mostra messaggio generico e resetta lo stato
   */
  const reloadFavorites = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await getFavorites()

      if (response.success && Array.isArray(response.data)) {
        // Successo: aggiorna entrambi gli stati
        const items = response.data
        setFavorites(items)
        setFavoriteIds(syncFavoriteIds(items))
      } else {
        // Errore lato server: resetta e mostra messaggio
        setFavorites([])
        setFavoriteIds(new Set())
        setError(response.message || 'Impossibile caricare i preferiti.')
      }
    } catch (err) {
      // Errore di rete o imprevisto
      console.error('Errore durante il caricamento dei preferiti:', err)
      setFavorites([])
      setFavoriteIds(new Set())
      setError('Si è verificato un errore inatteso durante il caricamento dei preferiti.')
    } finally {
      setIsLoading(false)
    }
  }, [])

  /**
   * Effect per il caricamento iniziale dei preferiti.
   * Viene eseguito una sola volta al mount del provider.
   */
  useEffect(() => {
    void reloadFavorites()
  }, [reloadFavorites])

  /**
   * Aggiunge o rimuove una foto dai preferiti (toggle).
   * 
   * Implementa il pattern "Optimistic Update":
   * 1. Aggiorna immediatamente l'UI (favoriteIds)
   * 2. Invia la richiesta al server
   * 3. In caso di errore, effettua rollback allo stato precedente
   * 
   * Questo approccio offre una UX più reattiva eliminando il delay
   * percepito dall'utente durante le operazioni di rete.
   * 
   * @param photo - Foto da aggiungere/rimuovere dai preferiti
   */
  const toggleFavorite = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    async (photo: UnsplashPhoto) => {
      // Determina l'azione da eseguire
      const isFavorite = favoriteIds.has(photo.id)

      // STEP 1: Aggiornamento ottimistico sugli ID (UI immediata)
      setFavoriteIds((prev) => {
        const next = new Set(prev)
        if (isFavorite) {
          next.delete(photo.id)  // Rimuove se era nei preferiti
        } else {
          next.add(photo.id)     // Aggiunge se non era nei preferiti
        }
        return next
      })

      try {
        // STEP 2: Chiamata API al backend
        const response = isFavorite
          ? await removeFavorite(photo.id)
          : await addFavorite(photo)

        if (!response.success) {
          // Errore dal server: mostra messaggio e rollback
          setError(response.message || `Impossibile ${isFavorite ? 'rimuovere' : 'aggiungere'} il preferito.`)

          // Rollback: ripristina lo stato precedente degli ID
          setFavoriteIds((prev) => {
            const next = new Set(prev)
            if (isFavorite) {
              next.add(photo.id)     // Ri-aggiunge se stavamo rimuovendo
            } else {
              next.delete(photo.id)  // Ri-rimuove se stavamo aggiungendo
            }
            return next
          })
          return
        }

        // STEP 3: Aggiorna l'array completo dei preferiti e mostra toast
        if (!isFavorite && response.data && !Array.isArray(response.data)) {
          // Aggiunta: inserisce il nuovo preferito in testa alla lista
          const created = response.data as Favorite
          setFavorites((prev) => {
            // Rimuove eventuali duplicati prima di aggiungere
            const without = prev.filter((fav) => fav.photo_id !== created.photo_id)
            return [created, ...without]
          })
          // Toast di successo per aggiunta
          addToast('Foto aggiunta ai preferiti', 'success')
        } else if (isFavorite) {
          // Rimozione: filtra via il preferito eliminato
          setFavorites((prev) => prev.filter((fav) => fav.photo_id !== photo.id))
          // Toast di successo per rimozione
          addToast('Foto rimossa dai preferiti', 'success')
        }
      } catch (err) {
        // Errore di rete: log, messaggio e rollback
        console.error('Errore durante l\'aggiornamento dei preferiti:', err)
        setError('Si è verificato un errore inatteso durante l\'aggiornamento dei preferiti.')

        // Rollback sugli ID
        setFavoriteIds((prev) => {
          const next = new Set(prev)
          if (isFavorite) {
            next.add(photo.id)
          } else {
            next.delete(photo.id)
          }
          return next
        })
      }
    },
    [favoriteIds, addToast],
  )

  /**
   * Cancella l'errore corrente.
   * Utile per permettere all'utente di chiudere i messaggi di errore.
   */
  const clearError = useCallback(() => setError(null), [])

  // === VALORE DEL CONTEXT ===
  
  /** Oggetto con tutti i valori e funzioni esposte dal context */
  const value: FavoritesContextValue = {
    favorites,
    favoriteIds,
    isLoading,
    error,
    toasts,
    toggleFavorite,
    reloadFavorites,
    clearError,
    removeToast,
  }

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>
}

/**
 * Hook personalizzato per accedere al context dei preferiti.
 * 
 * Deve essere utilizzato all'interno di un componente figlio di FavoritesProvider.
 * Lancia un errore esplicativo se usato al di fuori del provider.
 * 
 * @returns Oggetto FavoritesContextValue con stato e funzioni
 * @throws Error se chiamato fuori dal FavoritesProvider
 * 
 * @example
 * function MioComponente() {
 *   const { favorites, toggleFavorite, isLoading } = useFavorites();
 *   // ... usa i preferiti
 * }
 */
export function useFavorites(): FavoritesContextValue {
  const ctx = useContext(FavoritesContext)
  if (!ctx) {
    throw new Error('useFavorites deve essere usato all\'interno di FavoritesProvider')
  }
  return ctx
}
