import type { UnsplashPhoto } from '../types/unsplash';
import PhotoCard from './PhotoCard';

interface PhotoGridProps {
  photos: UnsplashPhoto[];
  isLoading?: boolean;
  favoritePhotoIds?: Set<string>;
  onToggleFavorite?: (photo: UnsplashPhoto) => void;
  /** classi di colonne, es. 'grid-cols-2 md:grid-cols-3' */
  gridCols?: string;
}

// Skeleton per stato di caricamento
const PhotoSkeleton = () => (
  <div
    data-testid="photo-skeleton"
    className="bg-gray-200 dark:bg-gray-800 rounded-lg shadow-md animate-pulse"
  >
    <div className="w-full h-64 bg-gray-300 dark:bg-gray-700 rounded-t-lg"></div>
    <div className="p-4">
      <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
      <div className="mt-2 h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
    </div>
  </div>
);

export default function PhotoGrid({
  photos,
  isLoading = false,
  favoritePhotoIds = new Set(),
  onToggleFavorite,
  gridCols = 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
}: PhotoGridProps) {
  if (isLoading) {
    return (
      <div className={`grid ${gridCols} gap-8`}>
        {Array.from({ length: 12 }).map((_, index) => (
          <PhotoSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (photos.length === 0) {
    return (
      <div className="text-center py-16 text-gray-500 dark:text-gray-400">
        <div className="inline-block bg-gray-100 dark:bg-gray-800 p-6 rounded-full mb-4">
          <svg
            className="w-16 h-16 text-gray-400 dark:text-gray-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l-1.586-1.586a2 2 0 010-2.828L14 8"
            />
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          </svg>
        </div>
        <h3 className="text-2xl font-semibold mb-2">No Photos Found</h3>
        <p className="text-lg">Try a different search term to find what you're looking for.</p>
      </div>
    );
  }

  return (
    <div className={`grid ${gridCols} gap-8`}>
      {photos.map((photo) => (
        <PhotoCard
          key={photo.id}
          photo={photo}
          isFavorite={favoritePhotoIds.has(photo.id)}
          onToggleFavorite={onToggleFavorite}
        />
      ))}
    </div>
  );
}
