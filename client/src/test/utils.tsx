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

import type { ReactElement } from 'react'
import { render, type RenderOptions } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { FavoritesProvider } from '../contexts/FavoritesContext'

/**
 * Opzioni estese per il render personalizzato.
 */
interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  /** Route iniziale per il router (default: '/') */
  initialRoute?: string
}

/**
 * Funzione render personalizzata che wrappa i componenti con i provider.
 * 
 * Wrappa automaticamente il componente in test con:
 * - MemoryRouter: per il routing isolato tra i test
 * - FavoritesProvider: per il context dei preferiti
 * 
 * @param ui - Elemento React da renderizzare
 * @param options - Opzioni di render con initialRoute opzionale
 * @returns Risultato del render con utilities di query
 * 
 * @example
 * import { render, screen } from './test/utils'
 * 
 * test('esempio', () => {
 *   render(<MioComponente />)
 *   expect(screen.getByText('testo')).toBeInTheDocument()
 * })
 * 
 * test('con route specifica', () => {
 *   render(<App />, { initialRoute: '/favorites' })
 * })
 */
const customRender = (
  ui: ReactElement,
  { initialRoute = '/', ...options }: CustomRenderOptions = {}
) => {
  // Wrappa il componente con tutti i provider necessari
  // MemoryRouter garantisce isolamento tra i test
  return render(
    <MemoryRouter initialEntries={[initialRoute]}>
      <FavoritesProvider>{ui}</FavoritesProvider>
    </MemoryRouter>,
    { ...options }
  )
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
