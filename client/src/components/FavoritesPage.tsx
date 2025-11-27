/**
 * @file FavoritesPage.tsx
 * @description Pagina per visualizzare le foto salvate nei preferiti.
 * 
 * Mostra:
 * - Header con titolo e conteggio preferiti
 * - Stato vuoto con messaggio e icona cuore
 * - Griglia delle foto preferite con possibilità di rimuoverle
 * 
 * I preferiti vengono letti e gestiti tramite FavoritesContext.
 * Il pulsante cuore permette di rimuovere le foto dai preferiti.
 */

import { useMemo } from 'react'
import PhotoGrid from './PhotoGrid'
import { useFavorites } from '../contexts/FavoritesContext'

/**
 * Componente pagina per visualizzare i preferiti dell'utente.
 * 
 * Caratteristiche:
 * - Mostra conteggio dinamico delle foto salvate
 * - Stato vuoto con CTA per aggiungere preferiti
 * - Riutilizza PhotoGrid per la visualizzazione
 * - Permette rimozione foto dai preferiti tramite click sul cuore
 * 
 * @returns Pagina completa dei preferiti
 */
export default function FavoritesPage() {
  // === CONTEXT ===
  
  /**
   * Dati e azioni dal context dei preferiti:
   * - favorites: array completo dei preferiti con photo_data
   * - isLoading: flag per stato di caricamento iniziale
   * - toggleFavorite: funzione per aggiungere/rimuovere preferiti
   */
  const { favorites, isLoading, toggleFavorite } = useFavorites()

  // === DERIVAZIONE DATI ===
  
  /** Estrae i dati foto dall'array dei preferiti per PhotoGrid */
  const photos = favorites.map((fav) => fav.photo_data)
  
  /**
   * Set memoizzato degli ID preferiti.
   * Ricalcolato solo quando cambia l'array favorites.
   * Usato per evidenziare i cuori nella griglia (anche se toggle disabilitato).
   */
  const favoritePhotoIds = useMemo(() => new Set(favorites.map((fav) => fav.photo_id)), [favorites])

  // === RENDERING ===

  return (
    <div className="container mx-auto px-4 py-8">
      
      {/* Header con titolo e conteggio */}
      <header className="text-center mb-12">
        <h1 className="text-5xl font-extrabold text-gray-900 dark:text-white mb-2">
          I Tuoi Preferiti
        </h1>
        {/* Conteggio con pluralizzazione corretta */}
        <p className="text-xl text-gray-600 dark:text-gray-300">
          Hai {favorites.length} {favorites.length === 1 ? 'foto salvata' : 'foto salvate'}.
        </p>
      </header>

      {/* Stato vuoto - visibile solo se non in caricamento e array vuoto */}
      {!isLoading && favorites.length === 0 && (
        <div className="text-center py-16 text-gray-500 dark:text-gray-400">
          {/* Icona cuore decorativa */}
          <div className="inline-block bg-gray-100 dark:bg-gray-800 p-6 rounded-full mb-4">
            <svg className="w-16 h-16 text-red-400 dark:text-red-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          {/* Messaggio e istruzioni */}
          <h3 className="text-2xl font-semibold mb-2 text-gray-800 dark:text-gray-200">Nessun Preferito</h3>
          <p className="text-lg">
            Clicca sul cuore di una foto per salvarla qui.
          </p>
        </div>
      )}

      {/* Container griglia con altezza minima */}
      <div className="min-h-[500px]">
        <PhotoGrid
          photos={photos}
          isLoading={isLoading}
          favoritePhotoIds={favoritePhotoIds}
          onToggleFavorite={toggleFavorite}  // Permette rimozione dai preferiti
        />
      </div>
    </div>
  )
}
