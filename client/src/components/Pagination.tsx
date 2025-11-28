/**
 * @file Pagination.tsx
 * @description Componente riutilizzabile per la navigazione tra pagine.
 * 
 * Mostra pulsanti precedente/successiva con indicatore della pagina corrente.
 * I pulsanti sono disabilitati automaticamente ai limiti della paginazione.
 */

import { memo } from 'react'

/**
 * Props per il componente Pagination.
 */
interface PaginationProps {
  /** Pagina corrente (1-indexed) */
  currentPage: number
  /** Numero totale di pagine */
  totalPages: number
  /** Callback chiamata quando l'utente cambia pagina */
  onPageChange: (page: number) => void
  /** Classi CSS aggiuntive per il container */
  className?: string
}

/**
 * Componente per la navigazione paginata.
 * 
 * Caratteristiche:
 * - Pulsante "Precedente" disabilitato a pagina 1
 * - Pulsante "Successiva" disabilitato all'ultima pagina
 * - Indicatore "Pagina X di Y"
 * - Supporta dark mode
 * 
 * Memoizzato per evitare re-render non necessari.
 * 
 * @param props - Props di configurazione
 * @returns Elemento con controlli di paginazione
 */
const Pagination = memo(function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className = '',
}: PaginationProps) {
  /** Classi comuni per i pulsanti */
  const buttonClasses = `
    px-4 py-2 rounded-md transition-colors
    bg-gray-200 dark:bg-gray-700 
    text-gray-800 dark:text-gray-200 
    hover:bg-gray-300 dark:hover:bg-gray-600 
    disabled:opacity-50 disabled:cursor-not-allowed
  `

  return (
    <div className={`flex justify-center items-center space-x-4 ${className}`}>
      {/* Pulsante pagina precedente */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={buttonClasses}
      >
        Precedente
      </button>

      {/* Indicatore pagina corrente */}
      <span className="text-gray-700 dark:text-gray-300">
        Pagina {currentPage} di {totalPages}
      </span>

      {/* Pulsante pagina successiva */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={buttonClasses}
      >
        Successiva
      </button>
    </div>
  )
})

export default Pagination
