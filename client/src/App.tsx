import { useState } from 'react'
import SearchBar from './components/SearchBar'
import PhotoGrid from './components/PhotoGrid'
import { searchPhotos } from './services/unsplash'
import './App.css'
import type { UnsplashPhoto } from './types/unsplash'

function App() {
  const [photos, setPhotos] = useState<UnsplashPhoto[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentQuery, setCurrentQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)

  const handleSearch = async (query: string, page: number = 1) => {
    setIsLoading(true)
    setError(null)
    setCurrentQuery(query)
    setCurrentPage(page)

    try {
      const response = await searchPhotos(query, page, 12)
      
      if (response.success) {
        setPhotos(response.data.results)
        setTotalPages(response.data.total_pages)
      } else {
        setError(response.message || 'Failed to search photos')
      }
    } catch (err) {
      setError('An error occurred while searching. Please try again.')
      console.error('Search error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handlePageChange = (newPage: number) => {
    if (currentQuery && newPage > 0 && newPage <= totalPages) {
      handleSearch(currentQuery, newPage)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Unsplash Photo Search
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Search for beautiful, free images from Unsplash
          </p>
        </header>

        <div className="mb-8">
          <SearchBar onSearch={(query) => handleSearch(query, 1)} isLoading={isLoading} />
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded-lg">
            {error}
          </div>
        )}

        <PhotoGrid photos={photos} isLoading={isLoading} />

        {!isLoading && photos.length > 0 && totalPages > 1 && (
          <div className="mt-8 flex justify-center items-center gap-4">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            <span className="text-gray-700 dark:text-gray-300">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
