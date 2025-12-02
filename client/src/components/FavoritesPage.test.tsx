import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import FavoritesPage from './FavoritesPage'

// Mock del context dei preferiti
vi.mock('../contexts/FavoritesContext', () => ({
  useFavorites: vi.fn(),
}))

import { useFavorites } from '../contexts/FavoritesContext'

const mockUseFavorites = useFavorites as ReturnType<typeof vi.fn>

const mockPhoto = {
  id: 'photo_1',
  width: 1920,
  height: 1080,
  description: 'Test photo',
  alt_description: 'Test alt',
  urls: {
    raw: 'https://example.com/raw.jpg',
    full: 'https://example.com/full.jpg',
    regular: 'https://example.com/regular.jpg',
    small: 'https://example.com/small.jpg',
    thumb: 'https://example.com/thumb.jpg',
  },
  links: {
    self: 'https://api.unsplash.com/photos/1',
    html: 'https://unsplash.com/photos/1',
    download: 'https://unsplash.com/photos/1/download',
  },
  user: {
    id: 'user_1',
    username: 'testuser',
    name: 'Test User',
    portfolio_url: null,
    profile_image: 'https://example.com/avatar.jpg',
  },
  created_at: '2024-01-01T00:00:00Z',
}

describe('FavoritesPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renderizza il titolo della pagina', () => {
    mockUseFavorites.mockReturnValue({
      favorites: [],
      isLoading: false,
      savingPhotoIds: new Set(),
      toggleFavorite: vi.fn(),
    })

    render(<FavoritesPage />)

    expect(screen.getByText('I Tuoi Preferiti')).toBeInTheDocument()
  })

  it('mostra il conteggio corretto al singolare', () => {
    mockUseFavorites.mockReturnValue({
      favorites: [{ photo_id: 'photo_1', photo_data: mockPhoto }],
      isLoading: false,
      savingPhotoIds: new Set(),
      toggleFavorite: vi.fn(),
    })

    render(<FavoritesPage />)

    expect(screen.getByText(/Hai 1 foto salvata/i)).toBeInTheDocument()
  })

  it('mostra il conteggio corretto al plurale', () => {
    mockUseFavorites.mockReturnValue({
      favorites: [
        { photo_id: 'photo_1', photo_data: mockPhoto },
        { photo_id: 'photo_2', photo_data: { ...mockPhoto, id: 'photo_2' } },
      ],
      isLoading: false,
      savingPhotoIds: new Set(),
      toggleFavorite: vi.fn(),
    })

    render(<FavoritesPage />)

    expect(screen.getByText(/Hai 2 foto salvate/i)).toBeInTheDocument()
  })

  it('mostra lo stato vuoto quando non ci sono preferiti', () => {
    mockUseFavorites.mockReturnValue({
      favorites: [],
      isLoading: false,
      savingPhotoIds: new Set(),
      toggleFavorite: vi.fn(),
    })

    render(<FavoritesPage />)

    expect(screen.getByText('Nessun Preferito')).toBeInTheDocument()
    expect(screen.getByText(/Clicca sul cuore/i)).toBeInTheDocument()
  })

  it('non mostra lo stato vuoto durante il caricamento', () => {
    mockUseFavorites.mockReturnValue({
      favorites: [],
      isLoading: true,
      savingPhotoIds: new Set(),
      toggleFavorite: vi.fn(),
    })

    render(<FavoritesPage />)

    expect(screen.queryByText('Nessun Preferito')).not.toBeInTheDocument()
  })

  it('non mostra lo stato vuoto quando ci sono preferiti', () => {
    mockUseFavorites.mockReturnValue({
      favorites: [{ photo_id: 'photo_1', photo_data: mockPhoto }],
      isLoading: false,
      savingPhotoIds: new Set(),
      toggleFavorite: vi.fn(),
    })

    render(<FavoritesPage />)

    expect(screen.queryByText('Nessun Preferito')).not.toBeInTheDocument()
  })

  it('mostra 0 foto quando la lista è vuota', () => {
    mockUseFavorites.mockReturnValue({
      favorites: [],
      isLoading: false,
      savingPhotoIds: new Set(),
      toggleFavorite: vi.fn(),
    })

    render(<FavoritesPage />)

    expect(screen.getByText(/Hai 0 foto salvate/i)).toBeInTheDocument()
  })
})
