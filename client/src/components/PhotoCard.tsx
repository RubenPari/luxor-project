/**
 * @file PhotoCard.tsx
 * @description Componente card per visualizzare una singola foto.
 * 
 * Mostra una foto con:
 * - Immagine con lazy loading e hover effect
 * - Pulsante cuore per toggle preferiti
 * - Overlay con info fotografo (avatar, nome, username)
 * - Link alla foto originale su Unsplash
 * 
 * Design responsive con effetto scale on hover.
 */

import { memo } from 'react'
import type { UnsplashPhoto } from "../types/unsplash"
import { HeartIcon } from './icons'
import { PHOTO_CARD_ASPECT_RATIO } from '../constants'

/**
 * Props per il componente PhotoCard.
 */
interface PhotoCardProps {
  /** Dati completi della foto da visualizzare */
  photo: UnsplashPhoto;
  /** Indica se la foto è nei preferiti (default: false) */
  isFavorite?: boolean;
  /** Callback per toggle preferito (se undefined, nasconde il pulsante) */
  onToggleFavorite?: (photo: UnsplashPhoto) => void;
}

/**
 * Componente per visualizzare una singola foto in formato card.
 * 
 * Caratteristiche:
 * - Immagine con lazy loading per performance
 * - Effetto zoom al passaggio del mouse
 * - Gradiente scuro in basso per leggibilità testo
 * - Pulsante cuore per preferiti (condizionale)
 * - Info fotografo con link al profilo
 * 
 * @param props - Props di configurazione
 * @returns Card foto con interazioni
 */
function PhotoCard({ photo, isFavorite = false, onToggleFavorite }: PhotoCardProps) {
  
  // === EVENT HANDLERS ===
  
  /**
   * Gestisce il click sul pulsante preferiti.
   * Previene la propagazione per evitare di aprire il link della foto.
   * 
   * @param e - Evento click del mouse
   */
  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();       // Previene navigazione del link parent
    e.stopPropagation();      // Ferma bubbling dell'evento
    onToggleFavorite?.(photo); // Chiama callback se definita
  };

  // === DERIVAZIONE DATI ===
  
  /** URL della pagina foto su Unsplash (fallback a #) */
  const photoPageUrl = photo.links?.html ?? "#";
  
  /** URL del profilo fotografo (portfolio o profilo Unsplash) */
  const userProfileUrl =
    photo.user?.portfolio_url ||
    (photo.user?.username ? `https://unsplash.com/@${photo.user.username}` : photoPageUrl);
  
  /** URL avatar fotografo con fallback a thumb della foto */
  const userAvatar = photo.user?.profile_image || photo.urls.small || photo.urls.thumb || "";
  
  /** Nome visualizzato del fotografo con fallback */
  const userName = photo.user?.name || photo.user?.username || "Fotografo sconosciuto";
  
  /** Username del fotografo per display @handle */
  const userUsername = photo.user?.username || "unknown";

  // === RENDERING ===

  return (
    // Container card con effetto hover scale e aspect ratio fisso
    <div className={`group relative overflow-hidden rounded-lg shadow-lg transition-transform duration-300 ease-in-out hover:scale-105 aspect-[${PHOTO_CARD_ASPECT_RATIO}]`}>
      
      {/* Link alla foto su Unsplash */}
      <a href={photoPageUrl} target="_blank" rel="noopener noreferrer" className="block h-full">
        {/* Immagine principale con lazy loading - object-cover riempie lo spazio */}
        <img
          src={photo.urls.regular || photo.urls.small || photo.urls.thumb || ""}
          alt={photo.alt_description || photo.description || "Unsplash photo"}
          loading="lazy"  // Caricamento differito per performance
          className="h-full w-full object-cover transition-opacity duration-300 group-hover:opacity-80"
        />
        {/* Overlay gradiente per leggibilità info fotografo */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
      </a>

      {/* Pulsante preferiti (visibile solo se callback definita) */}
      {onToggleFavorite && (
        <button
          onClick={handleFavoriteClick}
          title={isFavorite ? "Rimuovi dai preferiti" : "Aggiungi ai preferiti"}
          className={`absolute top-3 right-3 z-10 rounded-full p-2 transition-colors duration-300 
            ${isFavorite 
              ? "text-red-500 bg-white/80 hover:bg-white"  // Stile attivo: cuore rosso
              : "text-white/80 bg-black/30 hover:text-white hover:bg-black/50"  // Stile inattivo
            }
          `}
        >
          {/* Icona cuore SVG */}
          <HeartIcon filled={isFavorite} className="h-6 w-6" />
        </button>
      )}

      {/* Overlay info fotografo in basso */}
      <div className="absolute bottom-0 left-0 w-full p-4 text-white">
        <div className="flex items-center">
          {/* Avatar fotografo con link al profilo */}
          <a href={userProfileUrl} target="_blank" rel="noopener noreferrer" className="flex-shrink-0">
            {userAvatar && (
              <img
                src={userAvatar}
                alt={userName}
                className="h-10 w-10 rounded-full border-2 border-white/80 object-cover"
              />
            )}
          </a>
          {/* Nome e username fotografo */}
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

/** PhotoCard memoizzato per evitare re-render non necessari */
export default memo(PhotoCard)
