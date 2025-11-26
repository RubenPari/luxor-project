import { useMemo } from 'react'
import PhotoGrid from './PhotoGrid'
import { useFavorites } from '../contexts/FavoritesContext'

export default function FavoritesPage() {
  const { favorites, favoriteIds, isLoading } = useFavorites()

  const photos = favorites.map((fav) => fav.photo_data)
  const favoritePhotoIds = useMemo(() => new Set(favorites.map((fav) => fav.photo_id)), [favorites])

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="text-center mb-12">
        <h1 className="text-5xl font-extrabold text-gray-900 dark:text-white mb-2">
          Your Favorites
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300">
          You have {favorites.length} {favorites.length === 1 ? 'photo' : 'photos'} saved.
        </p>
      </header>

      {!isLoading && favorites.length === 0 && (
        <div className="text-center py-16 text-gray-500 dark:text-gray-400">
          <div className="inline-block bg-gray-100 dark:bg-gray-800 p-6 rounded-full mb-4">
            <svg className="w-16 h-16 text-red-400 dark:text-red-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <h3 className="text-2xl font-semibold mb-2 text-gray-800 dark:text-gray-200">No Favorites Yet</h3>
          <p className="text-lg">
            Click the heart on any photo to save it here.
          </p>
        </div>
      )}

      <div className="min-h-[500px]">
        <PhotoGrid
          photos={photos}
          isLoading={isLoading}
          favoritePhotoIds={favoritePhotoIds}
          onToggleFavorite={undefined}
        />
      </div>
    </div>
  )
}
