import { useCallback, useState } from 'react'
import type { UnsplashPhoto } from '../types/unsplash'
import { searchPhotos } from '../services/unsplash'

interface UseUnsplashSearchOptions {
  perPage?: number
}

interface UseUnsplashSearchResult {
  photos: UnsplashPhoto[]
  isLoading: boolean
  error: string | null
  currentQuery: string
  currentPage: number
  totalPages: number
  search: (query: string) => Promise<void>
  goToPage: (page: number) => Promise<void>
  clearError: () => void
}

export function useUnsplashSearch(options: UseUnsplashSearchOptions = {}): UseUnsplashSearchResult {
  const { perPage = 12 } = options

  const [photos, setPhotos] = useState<UnsplashPhoto[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentQuery, setCurrentQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)

  const performSearch = useCallback(
    async (query: string, page: number = 1) => {
      const trimmed = query.trim()
      if (!trimmed) return

      setIsLoading(true)
      setError(null)
      setCurrentQuery(trimmed)
      setCurrentPage(page)

      try {
        const response = await searchPhotos(trimmed, page, perPage)

        if (response.success) {
          setPhotos(response.data.results)
          setTotalPages(response.data.total_pages)
        } else {
          setError(response.message || 'Failed to search photos')
          setPhotos([])
          setTotalPages(0)
        }
      } catch (err) {
        console.error('Search error:', err)
        setError('An error occurred while searching. Please try again.')
        setPhotos([])
        setTotalPages(0)
      } finally {
        setIsLoading(false)
      }
    },
    [perPage],
  )

  const search = useCallback(
    async (query: string) => {
      await performSearch(query, 1)
    },
    [performSearch],
  )

  const goToPage = useCallback(
    async (page: number) => {
      if (!currentQuery || page <= 0 || (totalPages && page > totalPages)) return
      await performSearch(currentQuery, page)
      if (typeof window !== 'undefined') {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    },
    [currentQuery, totalPages, performSearch],
  )

  const clearError = useCallback(() => setError(null), [])

  return {
    photos,
    isLoading,
    error,
    currentQuery,
    currentPage,
    totalPages,
    search,
    goToPage,
    clearError,
  }
}
