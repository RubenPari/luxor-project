import { useState, FormEvent } from 'react'
import PhotoGrid from './PhotoGrid'
import { searchPhotos } from '../services/unsplash'
import type { UnsplashPhoto } from '../types/unsplash'

interface SearchPageProps {
  favoritePhotoIds: Set<string>
  onToggleFavorite: (photo: UnsplashPhoto) => void
}

export default function SearchPage({ favoritePhotoIds, onToggleFavorite }: SearchPageProps) {
  const [query, setQuery] = useState('')
  const [photos, setPhotos] = useState<UnsplashPhoto[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentQuery, setCurrentQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)

  const handleSearch = async (searchQuery: string, page: number = 1) => {
    if (!searchQuery.trim()) return

    setIsLoading(true)
    setError(null)
    setCurrentQuery(searchQuery)
    setCurrentPage(page)

    try {
      const response = await searchPhotos(searchQuery, page, 12)
      if (response.success) {
        setPhotos(response.data.results)
        setTotalPages(response.data.total_pages)
      } else {
        setError(response.message || 'Failed to search photos')
        setPhotos([])
      }
    } catch (err) {
      setError('An error occurred while searching. Please try again.')
      setPhotos([])
      console.error('Search error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    handleSearch(query, 1)
  }

  const handlePageChange = async (newPage: number) => {
    if (currentQuery && newPage > 0 && newPage <= totalPages) {
      await handleSearch(currentQuery, newPage)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="text-center mb-12">
        <h1 className="text-5xl font-extrabold text-gray-900 dark:text-white mb-2">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-600">
            Luxor Photo Search
          </span>
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300">
          Discover stunning, high-resolution images from the Unsplash community.
        </p>
      </header>

      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto mb-12">
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for anything..."
            disabled={isLoading}
            className="w-full pl-4 pr-12 py-3 text-lg border-2 border-gray-300 dark:border-gray-700 rounded-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
          />
          <button
            type="submit"
            disabled={isLoading || !query.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-purple-600 text-white hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? (
              <svg className="animate-spin h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            )}
          </button>
        </div>
      </form>

      {error && (
        <div className="text-center my-8 p-4 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-lg">
          <p><strong>Error:</strong> {error}</p>
        </div>
      )}

      <div className="min-h-[500px]">
        <PhotoGrid 
          photos={photos} 
          isLoading={isLoading} 
          favoritePhotoIds={favoritePhotoIds}
          onToggleFavorite={onToggleFavorite}
        />
      </div>

      {!isLoading && photos.length > 0 && totalPages > 1 && (
        <div className="flex justify-center items-center space-x-4 mt-12">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>
          <span className="text-gray-700 dark:text-gray-300">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}
