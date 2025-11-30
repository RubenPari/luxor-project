/**
 * @file unsplash.ts
 * @description Servizio per l'interazione con l'API Unsplash tramite il backend.
 * 
 * Questo modulo fornisce funzioni per effettuare ricerche di foto sulla piattaforma
 * Unsplash. Le richieste vengono instradate attraverso il backend Laravel che gestisce
 * l'autenticazione con l'API Unsplash e applica eventuali logiche di caching o rate limiting.
 */

import type { UnsplashSearchResponse } from "../types/unsplash";

/**
 * URL base dell'API backend.
 * Viene letto dalla variabile d'ambiente VITE_API_URL se definita,
 * altrimenti usa il default localhost per lo sviluppo locale.
 */
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

/**
 * Esegue una ricerca di foto su Unsplash tramite il backend.
 * 
 * Questa funzione invia una richiesta GET all'endpoint di ricerca del backend,
 * che a sua volta interroga l'API Unsplash. Supporta la paginazione per gestire
 * grandi quantità di risultati.
 * 
 * @param query - Termine di ricerca (es. "natura", "montagna", "tramonto")
 * @param page - Numero di pagina da recuperare (default: 1)
 * @param perPage - Numero di risultati per pagina (default: 12)
 * @param userId - ID univoco dell'utente (UUID)
 * @returns Promise con la risposta contenente le foto trovate e i metadati di paginazione
 * @throws Error se la richiesta HTTP fallisce
 * 
 * @example
 * // Ricerca semplice
 * const risultati = await searchPhotos('montagna', 1, 12, userId);
 * 
 * @example
 * // Ricerca con paginazione personalizzata
 * const risultati = await searchPhotos('tramonto', 2, 20, userId);
 */
export async function searchPhotos(
  query: string,
  page: number = 1,
  perPage: number = 12,
  userId: string,
  signal?: AbortSignal
): Promise<UnsplashSearchResponse> {
  // Costruisce i parametri della query string
  const params = new URLSearchParams({
    query,
    page: page.toString(),
    per_page: perPage.toString(),
  });

  // Effettua la richiesta GET all'endpoint di ricerca con l'header X-User-ID
  const response = await fetch(`${API_BASE_URL}/unsplash/search?${params}`, { 
    signal,
    headers: {
      'X-User-ID': userId,
    },
  });
  
  // Verifica che la risposta sia valida (status 2xx)
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  // Parsifica e restituisce il JSON della risposta
  return response.json();
}
