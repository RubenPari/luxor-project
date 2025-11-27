/**
 * @file utils.tsx
 * @description Utility per il testing con React Testing Library.
 * 
 * Questo modulo fornisce una funzione render personalizzata che wrappa
 * automaticamente i componenti con tutti i provider necessari.
 * 
 * Vantaggi:
 * - Non serve wrappare manualmente ogni test con i provider
 * - Centralizza la configurazione dei provider
 * - Facilita l'aggiunta di nuovi provider globali
 * 
 * Uso: importare `render` da questo file invece che da @testing-library/react
 */

import { ReactElement } from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { FavoritesProvider } from '../contexts/FavoritesContext'

/**
 * Funzione render personalizzata che wrappa i componenti con i provider.
 * 
 * Wrappa automaticamente il componente in test con:
 * - FavoritesProvider: per il context dei preferiti
 * 
 * Aggiungere qui altri provider globali se necessario:
 * - Router (React Router)
 * - ThemeProvider
 * - Redux Store
 * - etc.
 * 
 * @param ui - Elemento React da renderizzare
 * @param options - Opzioni di render (esclude 'wrapper' che viene gestito internamente)
 * @returns Risultato del render con utilities di query
 * 
 * @example
 * import { render, screen } from './test/utils'
 * 
 * test('esempio', () => {
 *   render(<MioComponente />)
 *   expect(screen.getByText('testo')).toBeInTheDocument()
 * })
 */
const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>  // Esclude wrapper dalle opzioni
) => {
  // Wrappa il componente con tutti i provider necessari
  return render(<FavoritesProvider>{ui}</FavoritesProvider>, { ...options })
}

/**
 * Re-esporta tutte le utility di @testing-library/react.
 * Questo permette di importare tutto da un unico punto.
 */
export * from '@testing-library/react'

/**
 * Esporta la funzione render personalizzata come 'render'.
 * Sovrascrive l'export di render da @testing-library/react.
 */
export { customRender as render }
