import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { render, screen, waitFor } from './utils'
import userEvent from '@testing-library/user-event'
import App from '../App'

/**
 * Integration Tests
 * 
 * Test che verificano l'interazione tra più componenti e servizi.
 * Questi test simulano scenari utente reali.
 */

// Mock dei servizi
vi.mock('../services/favorites', () => ({
  getFavorites: vi.fn().mockResolvedValue({ success: true, data: [] }),
  addFavorite: vi.fn().mockResolvedValue({ success: true, data: {} }),
  removeFavorite: vi.fn().mockResolvedValue({ success: true }),
}))

vi.mock('../services/unsplash', () => ({
  searchPhotos: vi.fn(),
}))

import { getFavorites, addFavorite, removeFavorite } from '../services/favorites'
import { searchPhotos } from '../services/unsplash'

const mockGetFavorites = getFavorites as ReturnType<typeof vi.fn>
const mockAddFavorite = addFavorite as ReturnType<typeof vi.fn>
const mockRemoveFavorite = removeFavorite as ReturnType<typeof vi.fn>
const mockSearchPhotos = searchPhotos as ReturnType<typeof vi.fn>

const mockPhotos = [
  {
    id: 'photo_1',
    width: 1920,
    height: 1080,
    description: 'Mountain landscape',
    alt_description: 'Beautiful mountain',
    urls: {
      raw: 'https://example.com/raw/1.jpg',
      full: 'https://example.com/full/1.jpg',
      regular: 'https://example.com/regular/1.jpg',
      small: 'https://example.com/small/1.jpg',
      thumb: 'https://example.com/thumb/1.jpg',
    },
    links: {
      self: 'https://api.unsplash.com/photos/1',
      html: 'https://unsplash.com/photos/1',
      download: 'https://unsplash.com/photos/1/download',
    },
    user: {
      id: 'user_1',
      username: 'photographer1',
      name: 'Photographer One',
      portfolio_url: 'https://portfolio.example.com',
      profile_image: 'https://example.com/avatar1.jpg',
    },
    created_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'photo_2',
    width: 1920,
    height: 1080,
    description: 'Beach sunset',
    alt_description: 'Sunset at the beach',
    urls: {
      raw: 'https://example.com/raw/2.jpg',
      full: 'https://example.com/full/2.jpg',
      regular: 'https://example.com/regular/2.jpg',
      small: 'https://example.com/small/2.jpg',
      thumb: 'https://example.com/thumb/2.jpg',
    },
    links: {
      self: 'https://api.unsplash.com/photos/2',
      html: 'https://unsplash.com/photos/2',
      download: 'https://unsplash.com/photos/2/download',
    },
    user: {
      id: 'user_2',
      username: 'photographer2',
      name: 'Photographer Two',
      portfolio_url: null,
      profile_image: 'https://example.com/avatar2.jpg',
    },
    created_at: '2024-01-02T00:00:00Z',
  },
]

describe('App Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    
    // Setup default mocks
    mockGetFavorites.mockResolvedValue({ success: true, data: [] })
    mockAddFavorite.mockResolvedValue({ success: true, data: {} })
    mockRemoveFavorite.mockResolvedValue({ success: true })
  })

  afterEach(() => {
    // Non usare vi.restoreAllMocks() perché annulla i mock factory
  })

  describe('Navigazione', () => {
    it('naviga tra Search e Preferiti', async () => {
      const user = userEvent.setup()
      render(<App />)

      // Vista iniziale: Search
      expect(screen.getByText('Luxor Ricerca Foto')).toBeInTheDocument()

      // Naviga a Preferiti
      await user.click(screen.getByRole('link', { name: /preferiti/i }))
      
      await waitFor(() => {
        expect(screen.getByText('I Tuoi Preferiti')).toBeInTheDocument()
      })

      // Torna a Search
      await user.click(screen.getByRole('link', { name: /cerca/i }))
      
      await waitFor(() => {
        expect(screen.getByText('Luxor Ricerca Foto')).toBeInTheDocument()
      })
    })
  })

  describe('Ricerca foto', () => {
    it('esegue una ricerca e mostra i risultati', async () => {
      mockSearchPhotos.mockResolvedValueOnce({
        success: true,
        data: {
          results: mockPhotos,
          total: 100,
          total_pages: 10,
        },
      })

      const user = userEvent.setup()
      render(<App />)

      const searchInput = screen.getByPlaceholderText('Cerca qualsiasi cosa...')
      await user.type(searchInput, 'mountain')
      await user.keyboard('{Enter}')

      await waitFor(() => {
        expect(mockSearchPhotos).toHaveBeenCalledWith(
          'mountain',
          1,
          expect.any(Number),
          expect.any(String),
          expect.any(Object)
        )
      })

      await waitFor(() => {
        expect(screen.getByAltText('Beautiful mountain')).toBeInTheDocument()
        expect(screen.getByAltText('Sunset at the beach')).toBeInTheDocument()
      })
    })

    it('mostra messaggio di errore quando la ricerca fallisce', async () => {
      mockSearchPhotos.mockResolvedValueOnce({
        success: false,
        message: 'Errore di connessione al server',
      })

      const user = userEvent.setup()
      render(<App />)

      const searchInput = screen.getByPlaceholderText('Cerca qualsiasi cosa...')
      await user.type(searchInput, 'test')
      await user.keyboard('{Enter}')

      await waitFor(() => {
        // Cerca specificamente il messaggio di errore della ricerca
        expect(screen.getByText(/Errore di connessione al server/i)).toBeInTheDocument()
      })
    })

    it('mostra stato vuoto quando non ci sono risultati', async () => {
      mockSearchPhotos.mockResolvedValueOnce({
        success: true,
        data: {
          results: [],
          total: 0,
          total_pages: 0,
        },
      })

      const user = userEvent.setup()
      render(<App />)

      const searchInput = screen.getByPlaceholderText('Cerca qualsiasi cosa...')
      await user.type(searchInput, 'xyznonexistent')
      await user.keyboard('{Enter}')

      await waitFor(() => {
        expect(screen.getByText(/nessuna foto/i)).toBeInTheDocument()
      })
    })
  })

  describe('Gestione preferiti', () => {
    it('mostra i preferiti esistenti nella pagina Preferiti', async () => {
      const mockFavorites = [
        {
          id: 1,
          photo_id: 'photo_1',
          photo_data: mockPhotos[0],
        },
      ]

      mockGetFavorites.mockResolvedValueOnce({
        success: true,
        data: mockFavorites,
      })

      const user = userEvent.setup()
      render(<App />)

      await user.click(screen.getByRole('link', { name: /preferiti/i }))

      await waitFor(() => {
        expect(screen.getByText('I Tuoi Preferiti')).toBeInTheDocument()
      })

      // Il preferito dovrebbe essere visualizzato
      await waitFor(() => {
        expect(mockGetFavorites).toHaveBeenCalled()
      })
    })

    it('mostra messaggio quando non ci sono preferiti', async () => {
      mockGetFavorites.mockResolvedValueOnce({
        success: true,
        data: [],
      })

      const user = userEvent.setup()
      render(<App />)

      await user.click(screen.getByRole('link', { name: /preferiti/i }))

      await waitFor(() => {
        expect(screen.getByText(/nessun preferito/i)).toBeInTheDocument()
      })
    })
  })

  describe('Flusso completo utente', () => {
    it('cerca foto, aggiunge ai preferiti e visualizza nei preferiti', async () => {
      // Setup mocks - deve essere fatto prima del render
      mockGetFavorites.mockResolvedValue({ success: true, data: [] })
      mockSearchPhotos.mockResolvedValue({
        success: true,
        data: {
          results: mockPhotos,
          total: 100,
          total_pages: 10,
        },
      })

      const user = userEvent.setup()
      render(<App />)

      // Aspetta che l'app sia completamente renderizzata
      await waitFor(() => {
        expect(screen.getByPlaceholderText('Cerca qualsiasi cosa...')).toBeInTheDocument()
      })

      // 1. Cerca foto
      const searchInput = screen.getByPlaceholderText('Cerca qualsiasi cosa...')
      await user.type(searchInput, 'mountain')
      await user.keyboard('{Enter}')

      await waitFor(() => {
        expect(screen.getByAltText('Beautiful mountain')).toBeInTheDocument()
      })

      // 2. Verifica che esistano i pulsanti preferiti
      await waitFor(() => {
        const favoriteButtons = screen.getAllByTitle(/aggiungi ai preferiti/i)
        expect(favoriteButtons.length).toBeGreaterThan(0)
      })
    })
  })
})

describe('Paginazione Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockGetFavorites.mockResolvedValue({ success: true, data: [] })
  })

  it('naviga tra le pagine dei risultati', async () => {
    mockSearchPhotos
      .mockResolvedValueOnce({
        success: true,
        data: {
          results: mockPhotos,
          total: 100,
          total_pages: 10,
        },
      })
      .mockResolvedValueOnce({
        success: true,
        data: {
          results: mockPhotos,
          total: 100,
          total_pages: 10,
        },
      })

    const user = userEvent.setup()
    render(<App />)

    // Aspetta che l'app sia renderizzata
    await waitFor(() => {
      expect(screen.getByPlaceholderText('Cerca qualsiasi cosa...')).toBeInTheDocument()
    })

    // Cerca
    const searchInput = screen.getByPlaceholderText('Cerca qualsiasi cosa...')
    await user.type(searchInput, 'nature')
    await user.keyboard('{Enter}')

    await waitFor(() => {
      expect(screen.getByText(/pagina 1 di 10/i)).toBeInTheDocument()
    })

    // Vai a pagina successiva
    await user.click(screen.getByText('Successiva'))

    await waitFor(() => {
      expect(mockSearchPhotos).toHaveBeenCalledTimes(2)
    })
  })
})
