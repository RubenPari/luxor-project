/**
 * @file CheckIcon.tsx
 * @description Icona segno di spunta per stati di successo.
 */

import { memo } from 'react'

interface CheckIconProps {
  /** Classi CSS aggiuntive */
  className?: string
}

/**
 * Icona segno di spunta (check mark).
 * Usata per indicare successo o completamento.
 */
function CheckIcon({ className = 'w-5 h-5' }: CheckIconProps) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  )
}

export default memo(CheckIcon)
