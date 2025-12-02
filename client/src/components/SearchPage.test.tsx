import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '../test/utils'
import userEvent from '@testing-library/user-event'
import SearchPage from './SearchPage'

// Mock dell'hook useUnsplashSearch
vi.mock('../hooks/useUnsplashSearch', () => ({
  useUnsplashSearch: vi.fn(() => ({
    photos: [],
    isLoading: false,
    error: null,
    currentPage: 1,
    totalPages: 0,
    search: vi.fn(),
    goToPage: vi.fn(),
    clearError: vi.fn(),
  })),
}))

// Mock del context dei preferiti
vi.mock('../contexts/FavoritesContext', () => ({
  useFavorites: vi.fn(() => ({
    favoriteIds: new Set(),
    savingPhotoIds: new Set(),
    toggleFavorite: vi.fn(),
  })),
  FavoritesProvider: ({ children }: { children: React.ReactNode }) => children,
}))

import { useUnsplashSearch } from '../hooks/useUnsplashSearch'

const mockUseUnsplashSearch = useUnsplashSearch as ReturnType<typeof vi.fn>

describe('SearchPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockUseUnsplashSearch.mockReturnValue({
      photos: [],
      isLoading: false,
      error: null,
      currentPage: 1,
      totalPages: 0,
      search: vi.fn(),
      goToPage: vi.fn(),
      clearError: vi.fn(),
    })
  })

  it('renderizza il titolo della pagina', () => {
    render(<SearchPage />)

    expect(screen.getByText('Luxor Ricerca Foto')).toBeInTheDocument()
  })

  it('renderizza il sottotitolo', () => {
    render(<SearchPage />)

    expect(screen.getByText(/Scopri immagini straordinarie/i)).toBeInTheDocument()
  })

  it('renderizza l\'input di ricerca', () => {
    render(<SearchPage />)

    expect(screen.getByPlaceholderText('Cerca qualsiasi cosa...')).toBeInTheDocument()
  })

  it('renderizza il pulsante di ricerca', () => {
    render(<SearchPage />)

    expect(screen.getByRole('button', { name: '' })).toBeInTheDocument()
  })

  it('aggiorna il valore dell\'input quando l\'utente digita', async () => {
    const user = userEvent.setup()
    render(<SearchPage />)

    const input = screen.getByPlaceholderText('Cerca qualsiasi cosa...')
    await user.type(input, 'montagna')

    expect(input).toHaveValue('montagna')
  })

  it('chiama search quando si sottomette il form', async () => {
    const mockSearch = vi.fn()
    mockUseUnsplashSearch.mockReturnValue({
      photos: [],
      isLoading: false,
      error: null,
      currentPage: 1,
      totalPages: 0,
      search: mockSearch,
      goToPage: vi.fn(),
      clearError: vi.fn(),
    })

    const user = userEvent.setup()
    render(<SearchPage />)

    const input = screen.getByPlaceholderText('Cerca qualsiasi cosa...')
    await user.type(input, 'natura')
    await user.keyboard('{Enter}')

    expect(mockSearch).toHaveBeenCalledWith('natura')
  })

  it('disabilita l\'input durante il caricamento', () => {
    mockUseUnsplashSearch.mockReturnValue({
      photos: [],
      isLoading: true,
      error: null,
      currentPage: 1,
      totalPages: 0,
      search: vi.fn(),
      goToPage: vi.fn(),
      clearError: vi.fn(),
    })

    render(<SearchPage />)

    expect(screen.getByPlaceholderText('Cerca qualsiasi cosa...')).toBeDisabled()
  })

  it('mostra l\'errore quando presente', () => {
    mockUseUnsplashSearch.mockReturnValue({
      photos: [],
      isLoading: false,
      error: 'Errore di connessione',
      currentPage: 1,
      totalPages: 0,
      search: vi.fn(),
      goToPage: vi.fn(),
      clearError: vi.fn(),
    })

    render(<SearchPage />)

    expect(screen.getByText(/Errore di connessione/i)).toBeInTheDocument()
  })

  it('mostra la paginazione quando ci sono risultati e più pagine', () => {
    const mockPhotos = [
      { id: '1', urls: { regular: 'test.jpg' }, user: { name: 'Test' } },
    ]

    mockUseUnsplashSearch.mockReturnValue({
      photos: mockPhotos,
      isLoading: false,
      error: null,
      currentPage: 1,
      totalPages: 5,
      search: vi.fn(),
      goToPage: vi.fn(),
      clearError: vi.fn(),
    })

    render(<SearchPage />)

    expect(screen.getByText(/Pagina 1 di 5/i)).toBeInTheDocument()
  })

  it('non mostra la paginazione quando c\'è una sola pagina', () => {
    const mockPhotos = [
      { id: '1', urls: { regular: 'test.jpg' }, user: { name: 'Test' } },
    ]

    mockUseUnsplashSearch.mockReturnValue({
      photos: mockPhotos,
      isLoading: false,
      error: null,
      currentPage: 1,
      totalPages: 1,
      search: vi.fn(),
      goToPage: vi.fn(),
      clearError: vi.fn(),
    })

    render(<SearchPage />)

    expect(screen.queryByText(/Pagina/i)).not.toBeInTheDocument()
  })
})
