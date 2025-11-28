/**
 * @file InfoIcon.tsx
 * @description Icona informazioni per messaggi informativi.
 */

import { memo } from 'react'

interface InfoIconProps {
  /** Classi CSS aggiuntive */
  className?: string
}

/**
 * Icona informazioni (cerchio con i).
 * Usata per messaggi informativi.
 */
function InfoIcon({ className = 'w-5 h-5' }: InfoIconProps) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
}

export default memo(InfoIcon)
