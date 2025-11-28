/**
 * @file EmptyState.tsx
 * @description Componente riutilizzabile per stati vuoti.
 * 
 * Mostra un'icona, titolo e descrizione quando non ci sono dati da visualizzare.
 * Usato in PhotoGrid (nessun risultato) e FavoritesPage (nessun preferito).
 */

import { memo, type ReactNode } from 'react'

/**
 * Props per il componente EmptyState.
 */
interface EmptyStateProps {
  /** Icona da visualizzare (ReactNode per flessibilità) */
  icon: ReactNode
  /** Titolo principale dello stato vuoto */
  title: string
  /** Descrizione o suggerimento per l'utente */
  description: string
}

/**
 * Componente per visualizzare uno stato vuoto con icona e messaggio.
 * 
 * Memoizzato per evitare re-render non necessari dato che è puramente presentazionale.
 * 
 * @param props - Props di configurazione
 * @returns Elemento con icona centrata, titolo e descrizione
 */
const EmptyState = memo(function EmptyState({ icon, title, description }: EmptyStateProps) {
  return (
    <div className="text-center py-16 text-gray-500 dark:text-gray-400">
      {/* Container icona con sfondo circolare */}
      <div className="inline-block bg-gray-100 dark:bg-gray-800 p-6 rounded-full mb-4">
        {icon}
      </div>
      {/* Titolo */}
      <h3 className="text-2xl font-semibold mb-2 text-gray-800 dark:text-gray-200">
        {title}
      </h3>
      {/* Descrizione */}
      <p className="text-lg">{description}</p>
    </div>
  )
})

export default EmptyState
