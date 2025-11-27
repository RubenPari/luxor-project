import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from './test/utils'
import userEvent from '@testing-library/user-event'
import App from './App'

vi.mock('./services/favorites', () => ({
  getFavorites: vi.fn().mockResolvedValue({ success: true, data: [] }),
  addFavorite: vi.fn().mockResolvedValue({ success: true, data: {} }),
  removeFavorite: vi.fn().mockResolvedValue({ success: true }),
}))

beforeEach(() => {
  vi.clearAllMocks()
})

describe('App', () => {
  it('mostra il titolo principale e la barra di ricerca', () => {
    render(<App />)

    expect(screen.getByText('Luxor Ricerca Foto')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Cerca qualsiasi cosa...')).toBeInTheDocument()
  })

  it('permette di cambiare vista tra Search e Favorites', async () => {
    const user = userEvent.setup()
    render(<App />)

    // Vista di default: Search
    expect(screen.getByText('Luxor Ricerca Foto')).toBeInTheDocument()

    // Passa a Favorites
    await user.click(screen.getByRole('link', { name: /preferiti/i }))
    expect(screen.getByText('I Tuoi Preferiti')).toBeInTheDocument()
  })
})
