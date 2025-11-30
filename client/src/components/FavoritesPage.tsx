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
import EmptyState from './EmptyState'
import { HeartIcon } from './icons'
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
   * - savingPhotoIds: set di ID in fase di salvataggio/rimozione
   * - toggleFavorite: funzione per aggiungere/rimuovere preferiti
   */
  const { favorites, isLoading, savingPhotoIds, toggleFavorite } = useFavorites()

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
        <EmptyState
          icon={<HeartIcon filled={false} className="w-16 h-16 text-red-400 dark:text-red-500" />}
          title="Nessun Preferito"
          description="Clicca sul cuore di una foto per salvarla qui."
        />
      )}

      {/* Container griglia con altezza minima */}
      <div className="min-h-[500px]">
        <PhotoGrid
          photos={photos}
          isLoading={isLoading}
          favoritePhotoIds={favoritePhotoIds}
          savingPhotoIds={savingPhotoIds}
          onToggleFavorite={toggleFavorite}  // Permette rimozione dai preferiti
        />
      </div>
    </div>
  )
}
