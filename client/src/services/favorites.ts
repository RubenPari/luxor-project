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
 * Ottiene i header comuni per tutte le richieste API.
 * Include il Content-Type e l'X-User-ID per l'identificazione dell'utente.
 * 
 * @param userId ID univoco dell'utente (UUID)
 * @returns Oggetto con i header da inviare
 */
function getHeaders(userId: string) {
  return {
    'Content-Type': 'application/json',
    'X-User-ID': userId,
  }
}

/**
 * Recupera la lista dei preferiti dal backend.
 * 
 * Effettua una richiesta GET all'endpoint /favorites.
 * 
 * @param userId ID univoco dell'utente (UUID)
 * @returns Promise con la risposta contenente l'array dei preferiti
 * 
 * @example
 * const { success, data } = await getFavorites(userId);
 */
export async function getFavorites(userId: string): Promise<FavoriteResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/favorites`, {
      headers: getHeaders(userId),
    })
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
 * @param userId - ID univoco dell'utente (UUID)
 * @returns Promise con la risposta contenente il preferito creato
 * 
 * @example
 * const foto = { id: 'abc123', urls: {...}, ... };
 * const { success, data } = await addFavorite(foto, userId);
 */
export async function addFavorite(photo: UnsplashPhoto, userId: string): Promise<FavoriteResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/favorites`, {
      method: 'POST',
      headers: getHeaders(userId),
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
 * @param userId - ID univoco dell'utente (UUID)
 * @returns Promise con la risposta che conferma l'eliminazione
 * 
 * @example
 * const { success } = await removeFavorite('abc123', userId);
 * if (success) {
 *   console.log('Preferito rimosso con successo');
 * }
 */
export async function removeFavorite(photoId: string, userId: string): Promise<FavoriteResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/favorites/${photoId}`, {
      method: 'DELETE',
      headers: getHeaders(userId),
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
