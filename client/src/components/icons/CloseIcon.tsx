/**
 * @file CloseIcon.tsx
 * @description Icona X per chiusura.
 */

import { memo } from 'react'

interface IconProps {
  className?: string
}

const CloseIcon = memo(function CloseIcon({ className = 'h-4 w-4' }: IconProps) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  )
})

export default CloseIcon
