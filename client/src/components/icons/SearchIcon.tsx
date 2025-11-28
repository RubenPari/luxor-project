/**
 * @file SearchIcon.tsx
 * @description Icona lente di ingrandimento per la ricerca.
 */

import { memo } from 'react'

interface IconProps {
  className?: string
}

const SearchIcon = memo(function SearchIcon({ className = 'h-6 w-6' }: IconProps) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
      />
    </svg>
  )
})

export default SearchIcon
