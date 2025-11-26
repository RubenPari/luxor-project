import type { UnsplashPhoto } from "../types/unsplash";

interface PhotoCardProps {
  photo: UnsplashPhoto;
  isFavorite?: boolean;
  onToggleFavorite?: (photo: UnsplashPhoto) => void;
}

export default function PhotoCard({ photo, isFavorite = false, onToggleFavorite }: PhotoCardProps) {
  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onToggleFavorite?.(photo);
  };

  const photoPageUrl = photo.links?.html ?? "#";
  const userProfileUrl =
    photo.user?.portfolio_url ||
    (photo.user?.username ? `https://unsplash.com/@${photo.user.username}` : photoPageUrl);
  const userAvatar = photo.user?.profile_image || photo.urls.small || photo.urls.thumb || "";
  const userName = photo.user?.name || photo.user?.username || "Unknown photographer";
  const userUsername = photo.user?.username || "unknown";

  return (
    <div className="group relative overflow-hidden rounded-lg shadow-lg transition-transform duration-300 ease-in-out hover:scale-105">
      <a href={photoPageUrl} target="_blank" rel="noopener noreferrer" className="block">
        <img
          src={photo.urls.regular || photo.urls.small || photo.urls.thumb || ""}
          alt={photo.alt_description || photo.description || "Unsplash photo"}
          loading="lazy"
          className="h-full w-full object-cover transition-opacity duration-300 group-hover:opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
      </a>

      {onToggleFavorite && (
        <button
          onClick={handleFavoriteClick}
          title={isFavorite ? "Remove from favorites" : "Add to favorites"}
          className={`absolute top-3 right-3 z-10 rounded-full p-2 transition-colors duration-300 
            ${isFavorite 
              ? "text-red-500 bg-white/80 hover:bg-white" 
              : "text-white/80 bg-black/30 hover:text-white hover:bg-black/50"}
          `}
        >
          <svg className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      )}

      <div className="absolute bottom-0 left-0 w-full p-4 text-white">
        <div className="flex items-center">
          <a href={userProfileUrl} target="_blank" rel="noopener noreferrer" className="flex-shrink-0">
            {userAvatar && (
              <img
                src={userAvatar}
                alt={userName}
                className="h-10 w-10 rounded-full border-2 border-white/80 object-cover"
              />
            )}
          </a>
          <div className="ml-3">
            <a
              href={userProfileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold hover:underline"
            >
              {userName}
            </a>
            <p className="text-sm text-white/80">@{userUsername}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
