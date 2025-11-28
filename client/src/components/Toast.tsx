/**
 * @file Toast.tsx
 * @description Componente per notifiche toast temporanee.
 * 
 * Mostra messaggi di feedback all'utente che scompaiono automaticamente.
 * Supporta diversi tipi di notifica (success, error, info).
 * 
 * Posizionato in basso a destra dello schermo con animazioni di entrata/uscita.
 */

import { useEffect, useState, memo } from 'react'
import { CloseIcon, CheckIcon, InfoIcon } from './icons'
import { TOAST_DURATION_MS, ANIMATION_DURATION_MS } from '../constants'

/**
 * Tipi di toast disponibili.
 */
export type ToastType = 'success' | 'error' | 'info'

/**
 * Props per il componente Toast.
 */
interface ToastProps {
  /** Messaggio da visualizzare */
  message: string
  /** Tipo di toast (determina colore e icona) */
  type: ToastType
  /** Durata in millisecondi prima della scomparsa (default: 3000) */
  duration?: number
  /** Callback chiamata quando il toast viene chiuso */
  onClose: () => void
}

/**
 * Componente Toast per notifiche temporanee.
 * 
 * Caratteristiche:
 * - Auto-dismiss dopo la durata specificata
 * - Animazione di fade in/out
 * - Pulsante X per chiusura manuale
 * - Colori diversi per tipo (verde/rosso/blu)
 * 
 * @param props - Props di configurazione
 * @returns Elemento toast o null se non visibile
 */
function Toast({ message, type, duration = TOAST_DURATION_MS, onClose }: ToastProps) {
  // Stato per gestire l'animazione di uscita
  const [isVisible, setIsVisible] = useState(true)

  // Effect per auto-dismiss
  useEffect(() => {
    // Timer per iniziare l'animazione di uscita
    const hideTimer = setTimeout(() => {
      setIsVisible(false)
    }, duration - ANIMATION_DURATION_MS) // Inizia fade-out prima della rimozione

    // Timer per rimuovere completamente il toast
    const removeTimer = setTimeout(() => {
      onClose()
    }, duration)

    // Cleanup dei timer
    return () => {
      clearTimeout(hideTimer)
      clearTimeout(removeTimer)
    }
  }, [duration, onClose])

  // Classi per i diversi tipi di toast
  const typeClasses = {
    success: 'bg-green-500 text-white',
    error: 'bg-red-500 text-white',
    info: 'bg-blue-500 text-white',
  }

  // Icone per i diversi tipi
  const icons = {
    success: <CheckIcon />,
    error: <CloseIcon />,
    info: <InfoIcon />,
  }

  return (
    <div
      className={`
        fixed bottom-4 right-4 z-50
        flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg
        transition-all duration-300 ease-in-out
        ${typeClasses[type]}
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}
      `}
      role="alert"
    >
      {/* Icona */}
      <span className="flex-shrink-0">{icons[type]}</span>
      
      {/* Messaggio */}
      <p className="font-medium">{message}</p>
      
      {/* Pulsante chiusura */}
      <button
        onClick={() => {
          setIsVisible(false)
          setTimeout(onClose, ANIMATION_DURATION_MS)
        }}
        className="ml-2 p-1 rounded hover:bg-white/20 transition-colors"
        aria-label="Chiudi notifica"
      >
        <CloseIcon className="w-4 h-4" />
      </button>
    </div>
  )
}

/** Toast memoizzato per evitare re-render non necessari */
export default memo(Toast)
