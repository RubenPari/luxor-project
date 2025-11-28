/**
 * @file favorites.ts
 * @description Servizio per la gestione dei preferiti utente.
 * 
 * Questo modulo fornisce funzioni CRUD per interagire con l'API dei preferiti
 * del backend Laravel. Permette di recuperare, aggiungere e rimuovere foto
 * dalla lista dei preferiti dell'utente.
 * 
 * Tutte le funzioni gestiscono internamente gli errori e restituiscono
 * sempre un oggetto FavoriteResponse con informazioni sullo stato dell'operazione.
 */

import type { UnsplashPhoto, FavoriteResponse } from '../types/unsplash'

/**
 * URL base dell'API backend.
 * Configurabile tramite variabile d'ambiente per supportare diversi ambienti
 * (sviluppo, staging, produzione).
 */
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

/**
 * Recupera la lista dei preferiti dal backend.
 * 
 * Effettua una richiesta GET all'endpoint /favorites.
 * 
 * @returns Promise con la risposta contenente l'array dei preferiti
 * 
 * @example
 * const { success, data } = await getFavorites();
 */
export async function getFavorites(): Promise<FavoriteResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/favorites`)
    return await response.json()
  } catch (error) {
    console.error('Failed to fetch favorites:', error)
    return {
      success: false,
      message: 'Failed to fetch favorites',
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * Aggiunge una foto ai preferiti.
 * 
 * Invia una richiesta POST all'endpoint /favorites con i dati completi della foto.
 * Il backend salva sia l'ID della foto che tutti i suoi metadati (photo_data)
 * per permettere la visualizzazione offline dei preferiti.
 * 
 * @param photo - Oggetto UnsplashPhoto completo da salvare nei preferiti
 * @returns Promise con la risposta contenente il preferito creato
 * 
 * @example
 * const foto = { id: 'abc123', urls: {...}, ... };
 * const { success, data } = await addFavorite(foto);
 */
export async function addFavorite(photo: UnsplashPhoto): Promise<FavoriteResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/favorites`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        photo_id: photo.id,
        photo_data: photo,
      }),
    })
    return await response.json()
  } catch (error) {
    console.error('Failed to add favorite:', error)
    return {
      success: false,
      message: 'Failed to add favorite',
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * Rimuove una foto dai preferiti.
 * 
 * Invia una richiesta DELETE all'endpoint /favorites/{photoId}.
 * 
 * @param photoId - ID della foto Unsplash da rimuovere dai preferiti
 * @returns Promise con la risposta che conferma l'eliminazione
 * 
 * @example
 * const { success } = await removeFavorite('abc123');
 * if (success) {
 *   console.log('Preferito rimosso con successo');
 * }
 */
export async function removeFavorite(photoId: string): Promise<FavoriteResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/favorites/${photoId}`, {
      method: 'DELETE',
    })
    return await response.json()
  } catch (error) {
    console.error('Failed to remove favorite:', error)
    return {
      success: false,
      message: 'Failed to remove favorite',
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}
