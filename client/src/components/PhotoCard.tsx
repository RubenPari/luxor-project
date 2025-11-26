import type { UnsplashPhoto } from "../types/unsplash";

interface PhotoCardProps {
  photo: UnsplashPhoto;
}

export default function PhotoCard({ photo }: PhotoCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-lg bg-gray-200 dark:bg-gray-800 shadow-md hover:shadow-xl transition-shadow">
      <a
        href={photo.links.html || '#'}
        target="_blank"
        rel="noopener noreferrer"
        className="block aspect-square"
      >
        <img
          src={photo.urls.small || ''}
          alt={photo.alt_description || photo.description || 'Unsplash photo'}
          className="w-full h-full object-cover transition-transform group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
          <div className="text-white">
            {photo.user.name && (
              <p className="font-semibold text-sm">{photo.user.name}</p>
            )}
            {photo.user.username && (
              <p className="text-xs opacity-90">@{photo.user.username}</p>
            )}
          </div>
        </div>
      </a>
    </div>
  );
}
