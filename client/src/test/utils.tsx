import { ReactElement } from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { FavoritesProvider } from '../contexts/FavoritesContext'

/**
 * Custom render function that wraps components with providers
 * Aggiungi qui tutti i provider globali (es. Router, Theme, Store)
 */
const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => {
  return render(<FavoritesProvider>{ui}</FavoritesProvider>, { ...options })
}

// Re-export everything from testing library
export * from '@testing-library/react'
export { customRender as render }
