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

import type { UnsplashPhoto } from '../types/unsplash';
import PhotoCard from './PhotoCard';

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
 * @returns Elemento placeholder con animazione pulse
 */
const PhotoSkeleton = () => (
  <div
    data-testid="photo-skeleton"  // Test ID per i test automatizzati
    className="bg-gray-200 dark:bg-gray-800 rounded-lg shadow-md animate-pulse"
  >
    {/* Placeholder per l'immagine */}
    <div className="w-full h-64 bg-gray-300 dark:bg-gray-700 rounded-t-lg"></div>
    {/* Placeholder per i metadati (simula testo) */}
    <div className="p-4">
      <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
      <div className="mt-2 h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
    </div>
  </div>
);

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
  gridCols = 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
}: PhotoGridProps) {
  
  // === STATO: CARICAMENTO ===
  // Mostra 12 skeleton mentre i dati vengono caricati
  if (isLoading) {
    return (
      <div className={`grid ${gridCols} gap-8`}>
        {Array.from({ length: 12 }).map((_, index) => (
          <PhotoSkeleton key={index} />
        ))}
      </div>
    );
  }

  // === STATO: NESSUN RISULTATO ===
  // Mostra messaggio informativo quando non ci sono foto
  if (photos.length === 0) {
    return (
      <div className="text-center py-16 text-gray-500 dark:text-gray-400">
        {/* Icona decorativa */}
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
        {/* Messaggio e suggerimento */}
        <h3 className="text-2xl font-semibold mb-2">Nessuna Foto Trovata</h3>
        <p className="text-lg">Prova un termine di ricerca diverso per trovare quello che cerchi.</p>
      </div>
    );
  }

  // === STATO: DATI PRESENTI ===
  // Renderizza la griglia di PhotoCard
  return (
    <div className={`grid ${gridCols} gap-8`}>
      {photos.map((photo) => (
        <PhotoCard
          key={photo.id}  // ID univoco per React reconciliation
          photo={photo}
          isFavorite={favoritePhotoIds.has(photo.id)}  // Lookup O(1) nel Set
          onToggleFavorite={onToggleFavorite}
        />
      ))}
    </div>
  );
}
