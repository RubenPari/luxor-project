/**
 * @file PhotoIcon.tsx
 * @description Icona foto/immagine per stati vuoti.
 */

import { memo } from 'react'

interface IconProps {
  className?: string
}

const PhotoIcon = memo(function PhotoIcon({ className = 'w-16 h-16' }: IconProps) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l-1.586-1.586a2 2 0 010-2.828L14 8"
      />
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
    </svg>
  )
})

export default PhotoIcon
