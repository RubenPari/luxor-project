import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react'
import type { Favorite, UnsplashPhoto } from '../types/unsplash'
import { addFavorite, getFavorites, removeFavorite } from '../services/favorites'

interface FavoritesContextValue {
  favorites: Favorite[]
  favoriteIds: Set<string>
  isLoading: boolean
  error: string | null
  toggleFavorite: (photo: UnsplashPhoto) => Promise<void>
  reloadFavorites: () => Promise<void>
  clearError: () => void
}

const FavoritesContext = createContext<FavoritesContextValue | undefined>(undefined)

interface FavoritesProviderProps {
  children: ReactNode
}

export function FavoritesProvider({ children }: FavoritesProviderProps) {
  const [favorites, setFavorites] = useState<Favorite[]>([])
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set())
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const syncFavoriteIds = (items: Favorite[]) => new Set(items.map((fav) => fav.photo_id))

  const reloadFavorites = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await getFavorites()

      if (response.success && Array.isArray(response.data)) {
        const items = response.data
        setFavorites(items)
        setFavoriteIds(syncFavoriteIds(items))
      } else {
        setFavorites([])
        setFavoriteIds(new Set())
        setError(response.message || 'Impossibile caricare i preferiti.')
      }
    } catch (err) {
      console.error('Errore durante il caricamento dei preferiti:', err)
      setFavorites([])
      setFavoriteIds(new Set())
      setError('Si è verificato un errore inatteso durante il caricamento dei preferiti.')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    void reloadFavorites()
  }, [reloadFavorites])

  const toggleFavorite = useCallback(
    async (photo: UnsplashPhoto) => {
      const isFavorite = favoriteIds.has(photo.id)

      // Aggiornamento ottimistico sugli ID
      setFavoriteIds((prev) => {
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

          // rollback sugli ID
          setFavoriteIds((prev) => {
            const next = new Set(prev)
            if (isFavorite) {
              next.add(photo.id)
            } else {
              next.delete(photo.id)
            }
            return next
          })
          return
        }

        // Aggiorna la lista dei preferiti se abbiamo dati utili dalla risposta
        if (!isFavorite && response.data && !Array.isArray(response.data)) {
          const created = response.data as Favorite
          setFavorites((prev) => {
            const without = prev.filter((fav) => fav.photo_id !== created.photo_id)
            return [created, ...without]
          })
        } else if (isFavorite) {
          setFavorites((prev) => prev.filter((fav) => fav.photo_id !== photo.id))
        }
      } catch (err) {
        console.error('Errore durante l\'aggiornamento dei preferiti:', err)
        setError('Si è verificato un errore inatteso durante l\'aggiornamento dei preferiti.')

        // rollback sugli ID
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
    [favoriteIds],
  )

  const clearError = useCallback(() => setError(null), [])

  const value: FavoritesContextValue = {
    favorites,
    favoriteIds,
    isLoading,
    error,
    toggleFavorite,
    reloadFavorites,
    clearError,
  }

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>
}

export function useFavorites(): FavoritesContextValue {
  const ctx = useContext(FavoritesContext)
  if (!ctx) {
    throw new Error('useFavorites deve essere usato all\'interno di FavoritesProvider')
  }
  return ctx
}
