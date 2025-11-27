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
 * Effettua una richiesta GET all'endpoint /favorites. Se viene fornito un userId,
 * filtra i risultati per quell'utente specifico. Altrimenti restituisce tutti
 * i preferiti (utile per utenti anonimi o in modalità demo).
 * 
 * @param userId - ID opzionale dell'utente per filtrare i preferiti
 * @returns Promise con la risposta contenente l'array dei preferiti
 * 
 * @example
 * // Recupera tutti i preferiti
 * const { success, data } = await getFavorites();
 * 
 * @example
 * // Recupera i preferiti di un utente specifico
 * const { success, data } = await getFavorites(123);
 */
export async function getFavorites(userId?: number): Promise<FavoriteResponse> {
  try {
    // Costruisce l'URL con eventuali parametri di query
    const url = new URL(`${API_BASE_URL}/favorites`)
    if (userId) {
      url.searchParams.append('user_id', userId.toString())
    }
    
    // Esegue la richiesta GET
    const response = await fetch(url.toString())
    return await response.json()
  } catch (error) {
    // Gestisce gli errori di rete o parsing
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
 * @param userId - ID opzionale dell'utente proprietario del preferito
 * @returns Promise con la risposta contenente il preferito creato
 * 
 * @example
 * const foto = { id: 'abc123', urls: {...}, ... };
 * const { success, data } = await addFavorite(foto);
 */
export async function addFavorite(
  photo: UnsplashPhoto,
  userId?: number
): Promise<FavoriteResponse> {
  try {
    // Effettua la richiesta POST con i dati della foto
    const response = await fetch(`${API_BASE_URL}/favorites`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        photo_id: photo.id,      // ID univoco della foto su Unsplash
        photo_data: photo,        // Dati completi per visualizzazione offline
        user_id: userId,          // Associazione opzionale all'utente
      }),
    })
    
    return await response.json()
  } catch (error) {
    // Gestisce gli errori di rete o parsing
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
 * Il backend identifica il preferito da rimuovere tramite l'ID della foto
 * (e opzionalmente l'ID utente se fornito).
 * 
 * @param photoId - ID della foto Unsplash da rimuovere dai preferiti
 * @param userId - ID opzionale dell'utente per identificare il preferito specifico
 * @returns Promise con la risposta che conferma l'eliminazione
 * 
 * @example
 * const { success } = await removeFavorite('abc123');
 * if (success) {
 *   console.log('Preferito rimosso con successo');
 * }
 */
export async function removeFavorite(
  photoId: string,
  userId?: number
): Promise<FavoriteResponse> {
  try {
    // Costruisce l'URL con l'ID della foto nel path
    const url = new URL(`${API_BASE_URL}/favorites/${photoId}`)
    if (userId) {
      url.searchParams.append('user_id', userId.toString())
    }
    
    // Esegue la richiesta DELETE
    const response = await fetch(url.toString(), {
      method: 'DELETE',
    })
    
    return await response.json()
  } catch (error) {
    // Gestisce gli errori di rete o parsing
    console.error('Failed to remove favorite:', error)
    return {
      success: false,
      message: 'Failed to remove favorite',
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}
