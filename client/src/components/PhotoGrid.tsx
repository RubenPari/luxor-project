/**
 * @file PhotoGrid.tsx
 * @description Componente griglia per visualizzare collezioni di foto.
 * 
 * Gestisce tre stati principali:
 * 1. Loading: mostra skeleton placeholder animati
 * 2. Empty: mostra messaggio "nessun risultato"
 * 3. Data: mostra griglia di PhotoCard
 * 
 * La griglia è completamente responsive con breakpoint configurabili.
 */

import { memo } from 'react'
import type { UnsplashPhoto } from '../types/unsplash'
import PhotoCard from './PhotoCard'
import EmptyState from './EmptyState'
import { PhotoIcon } from './icons'
import { SKELETON_COUNT, DEFAULT_GRID_COLS } from '../constants'

/**
 * Props per il componente PhotoGrid.
 */
interface PhotoGridProps {
  /** Array di foto da visualizzare */
  photos: UnsplashPhoto[];
  /** Flag per mostrare stato di caricamento (default: false) */
  isLoading?: boolean;
  /** Set di ID foto nei preferiti per evidenziare i cuori */
  favoritePhotoIds?: Set<string>;
  /** Callback per toggle preferito su una foto */
  onToggleFavorite?: (photo: UnsplashPhoto) => void;
  /** Classi Tailwind per le colonne della griglia (personalizzabile) */
  gridCols?: string;
}

/**
 * Componente skeleton per simulare il caricamento di una foto.
 * Mostra un placeholder animato con pulse effect mentre i dati
 * vengono caricati dal server.
 * 
 * Memoizzato per evitare re-render non necessari.
 * 
 * @returns Elemento placeholder con animazione pulse
 */
const PhotoSkeleton = memo(function PhotoSkeleton() {
  return (
    <div
      data-testid="photo-skeleton"
      className="bg-gray-200 dark:bg-gray-800 rounded-lg shadow-md animate-pulse aspect-[3/4]"
    >
      <div className="w-full h-full bg-gray-300 dark:bg-gray-700 rounded-lg" />
    </div>
  )
})

/**
 * Componente griglia per visualizzare una collezione di foto.
 * 
 * Gestisce automaticamente tre stati:
 * - **Loading**: griglia di 12 skeleton animati
 * - **Empty**: messaggio con icona e suggerimento
 * - **Data**: griglia di PhotoCard con supporto preferiti
 * 
 * La griglia è responsive di default:
 * - Mobile: 1 colonna
 * - Tablet: 2-3 colonne
 * - Desktop: 4 colonne
 * 
 * @param props - Props di configurazione
 * @returns Griglia di foto o stato alternativo
 */
export default function PhotoGrid({
  photos,
  isLoading = false,
  favoritePhotoIds = new Set(),
  onToggleFavorite,
  gridCols = DEFAULT_GRID_COLS,
}: PhotoGridProps) {
  // === STATO: CARICAMENTO ===
  if (isLoading) {
    return (
      <div className={`grid ${gridCols} gap-8`}>
        {Array.from({ length: SKELETON_COUNT }).map((_, index) => (
          <PhotoSkeleton key={`skeleton-${index}`} />
        ))}
      </div>
    )
  }

  // === STATO: NESSUN RISULTATO ===
  if (photos.length === 0) {
    return (
      <EmptyState
        icon={<PhotoIcon className="w-16 h-16 text-gray-400 dark:text-gray-500" />}
        title="Nessuna Foto Trovata"
        description="Prova un termine di ricerca diverso per trovare quello che cerchi."
      />
    )
  }

  // === STATO: DATI PRESENTI ===
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
  )
}
