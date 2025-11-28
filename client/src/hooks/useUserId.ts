/**
 * @file useUserId.ts
 * @description Hook personalizzato per la gestione dell'identificatore utente.
 *
 * Genera un UUID al primo accesso e lo salva in localStorage per identificare
 * l'utente nell'applicazione. Successivi accessi recuperano lo stesso UUID.
 */

import { useMemo } from 'react'

/**
 * Chiave usata per memorizzare l'userId nel localStorage.
 */
const STORAGE_KEY = 'luxor_user_id'

/**
 * Genera un UUID versione 4 casuale.
 *
 * @returns UUID string nel formato xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
 */
function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

/**
 * Hook per recuperare o generare l'identificatore utente univoco.
 *
 * Comportamento:
 * - Se localStorage contiene già un userId, lo restituisce
 * - Altrimenti genera un nuovo UUID, lo salva e lo restituisce
 * - Il valore è memorizzato con useMemo per evitare rigenerazioni inutili
 *
 * @returns Stringa UUID che identifica univocamente l'utente
 *
 * @example
 * function MyComponent() {
 *   const userId = useUserId();
 *   console.log('User ID:', userId); // es: "550e8400-e29b-41d4-a716-446655440000"
 * }
 */
export function useUserId(): string {
  const userId = useMemo(() => {
    // Tenta di recuperare l'userId da localStorage
    let stored = localStorage.getItem(STORAGE_KEY)

    // Se non esiste, genera uno nuovo
    if (!stored) {
      stored = generateUUID()
      try {
        localStorage.setItem(STORAGE_KEY, stored)
      } catch (error) {
        console.warn('Failed to save user ID to localStorage:', error)
        // Continua comunque con l'UUID generato
      }
    }

    return stored
  }, [])

  return userId
}
