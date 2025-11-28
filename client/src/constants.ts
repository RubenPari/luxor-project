/**
 * @file constants.ts
 * @description Costanti globali dell'applicazione.
 * 
 * Centralizza tutti i valori "magici" per migliorare manutenibilità e leggibilità.
 */

// === PAGINAZIONE ===

/** Numero di foto per pagina nei risultati di ricerca */
export const PHOTOS_PER_PAGE = 12

/** Numero di skeleton da mostrare durante il caricamento */
export const SKELETON_COUNT = 12

// === ANIMAZIONI ===

/** Durata delle animazioni di transizione in millisecondi */
export const ANIMATION_DURATION_MS = 300

/** Durata di visualizzazione dei toast in millisecondi */
export const TOAST_DURATION_MS = 3000

// === UI ===

/** Aspect ratio delle card foto (3:4) */
export const PHOTO_CARD_ASPECT_RATIO = 'aspect-[3/4]'

/** Classi Tailwind per la griglia responsive di default */
export const DEFAULT_GRID_COLS = 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'

// === API ===

/** URL base dell'API backend */
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'
