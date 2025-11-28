/**
 * @file ErrorBanner.tsx
 * @description Componente riutilizzabile per mostrare errori.
 * 
 * Banner di errore con bordo colorato, messaggio e pulsante di chiusura.
 * Usato per errori globali in App.tsx e errori locali nei componenti.
 */

import { memo } from 'react'

/**
 * Props per il componente ErrorBanner.
 */
interface ErrorBannerProps {
  /** Messaggio di errore da visualizzare */
  message: string
  /** Callback chiamata quando l'utente chiude il banner */
  onClose: () => void
  /** Classi CSS aggiuntive per il container */
  className?: string
}

/**
 * Componente banner per visualizzare messaggi di errore.
 * 
 * Caratteristiche:
 * - Sfondo rosso chiaro con bordo laterale
 * - Titolo "Errore" in grassetto
 * - Pulsante per chiudere il banner
 * - Accessibilità con role="alert"
 * 
 * Memoizzato per evitare re-render non necessari.
 * 
 * @param props - Props di configurazione
 * @returns Banner di errore o null se non c'è messaggio
 */
const ErrorBanner = memo(function ErrorBanner({
  message,
  onClose,
  className = '',
}: ErrorBannerProps) {
  return (
    <div
      className={`bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md shadow-md ${className}`}
      role="alert"
    >
      <p className="font-bold">Errore</p>
      <p>{message}</p>
      <button
        onClick={onClose}
        className="mt-2 px-3 py-1 bg-red-200 text-red-800 text-sm rounded hover:bg-red-300 transition-colors"
      >
        Chiudi
      </button>
    </div>
  )
})

export default ErrorBanner
