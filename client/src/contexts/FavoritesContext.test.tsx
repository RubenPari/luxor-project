import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor, act } from '@testing-library/react'
import { FavoritesProvider, useFavorites } from './FavoritesContext'
import type { ReactNode } from 'react'

// Mock dei servizi
vi.mock('../services/favorites', () => ({
  getFavorites: vi.fn().mockResolvedValue({ success: true, data: [] }),
  addFavorite: vi.fn().mockResolvedValue({ success: true, data: {} }),
  removeFavorite: vi.fn().mockResolvedValue({ success: true }),
}))

// Mock dell'hook useUserId
vi.mock('../hooks/useUserId', () => ({
  useUserId: vi.fn(() => '550e8400-e29b-41d4-a716-446655440000'),
}))

import { getFavorites, addFavorite, removeFavorite } from '../services/favorites'

const mockGetFavorites = getFavorites as ReturnType<typeof vi.fn>
const mockAddFavorite = addFavorite as ReturnType<typeof vi.fn>
const mockRemoveFavorite = removeFavorite as ReturnType<typeof vi.fn>

const mockPhoto = {
  id: 'photo_1',
  width: 1920,
  height: 1080,
  description: 'Test photo',
  alt_description: 'Test alt',
  urls: { regular: 'https://example.com/photo.jpg' },
  links: { html: 'https://unsplash.com/photos/1' },
  user: { name: 'Test User', username: 'testuser' },
  created_at: '2024-01-01T00:00:00Z',
}

// Wrapper per il provider
const wrapper = ({ children }: { children: ReactNode }) => (
  <FavoritesProvider>{children}</FavoritesProvider>
)

describe('FavoritesContext', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockGetFavorites.mockResolvedValue({ success: true, data: [] })
    mockAddFavorite.mockResolvedValue({ success: true, data: {} })
    mockRemoveFavorite.mockResolvedValue({ success: true })
  })

  describe('useFavorites hook', () => {
    it('lancia errore se usato fuori dal provider', () => {
      // Sopprimi l'errore della console durante questo test
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      expect(() => {
        renderHook(() => useFavorites())
      }).toThrow('useFavorites deve essere usato all\'interno di FavoritesProvider')

      consoleSpy.mockRestore()
    })

    it('fornisce i valori iniziali corretti', async () => {
      const { result } = renderHook(() => useFavorites(), { wrapper })

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(result.current.favorites).toEqual([])
      expect(result.current.favoriteIds.size).toBe(0)
      expect(result.current.error).toBeNull()
    })

    it('carica i preferiti al mount', async () => {
      const mockFavorites = [
        { photo_id: 'photo_1', photo_data: mockPhoto },
      ]
      mockGetFavorites.mockResolvedValueOnce({ success: true, data: mockFavorites })

      const { result } = renderHook(() => useFavorites(), { wrapper })

      await waitFor(() => {
        expect(result.current.favorites).toEqual(mockFavorites)
      })

      expect(mockGetFavorites).toHaveBeenCalled()
    })

    it('aggiorna favoriteIds in base ai preferiti', async () => {
      const mockFavorites = [
        { photo_id: 'photo_1', photo_data: mockPhoto },
        { photo_id: 'photo_2', photo_data: { ...mockPhoto, id: 'photo_2' } },
      ]
      mockGetFavorites.mockResolvedValueOnce({ success: true, data: mockFavorites })

      const { result } = renderHook(() => useFavorites(), { wrapper })

      await waitFor(() => {
        expect(result.current.favoriteIds.has('photo_1')).toBe(true)
        expect(result.current.favoriteIds.has('photo_2')).toBe(true)
      })
    })

    it('gestisce errori nel caricamento dei preferiti', async () => {
      mockGetFavorites.mockResolvedValueOnce({
        success: false,
        message: 'Errore di connessione',
      })

      const { result } = renderHook(() => useFavorites(), { wrapper })

      await waitFor(() => {
        expect(result.current.error).toBe('Errore di connessione')
      })
    })

    it('clearError cancella l\'errore', async () => {
      mockGetFavorites.mockResolvedValueOnce({
        success: false,
        message: 'Errore',
      })

      const { result } = renderHook(() => useFavorites(), { wrapper })

      await waitFor(() => {
        expect(result.current.error).toBe('Errore')
      })

      act(() => {
        result.current.clearError()
      })

      expect(result.current.error).toBeNull()
    })
  })

  describe('toggleFavorite', () => {
    it('aggiunge una foto ai preferiti', async () => {
      const newFavorite = { photo_id: 'photo_1', photo_data: mockPhoto }
      mockAddFavorite.mockResolvedValueOnce({ success: true, data: newFavorite })

      const { result } = renderHook(() => useFavorites(), { wrapper })

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      await act(async () => {
        await result.current.toggleFavorite(mockPhoto)
      })

      expect(mockAddFavorite).toHaveBeenCalledWith(mockPhoto, expect.any(String))
    })

    it('rimuove una foto dai preferiti', async () => {
      const mockFavorites = [{ photo_id: 'photo_1', photo_data: mockPhoto }]
      mockGetFavorites.mockResolvedValueOnce({ success: true, data: mockFavorites })

      const { result } = renderHook(() => useFavorites(), { wrapper })

      await waitFor(() => {
        expect(result.current.favoriteIds.has('photo_1')).toBe(true)
      })

      await act(async () => {
        await result.current.toggleFavorite(mockPhoto)
      })

      expect(mockRemoveFavorite).toHaveBeenCalledWith('photo_1', expect.any(String))
    })

    it('applica aggiornamento ottimistico', async () => {
      const { result } = renderHook(() => useFavorites(), { wrapper })

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      // Rallenta la risposta per verificare l'aggiornamento ottimistico
      mockAddFavorite.mockImplementation(
        () => new Promise((resolve) => setTimeout(() => resolve({ success: true, data: {} }), 100))
      )

      act(() => {
        result.current.toggleFavorite(mockPhoto)
      })

      // L'aggiornamento ottimistico dovrebbe aver già aggiunto l'ID
      expect(result.current.favoriteIds.has('photo_1')).toBe(true)
    })
  })

  describe('reloadFavorites', () => {
    it('ricarica i preferiti dal server', async () => {
      const { result } = renderHook(() => useFavorites(), { wrapper })

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      const newFavorites = [{ photo_id: 'new_photo', photo_data: mockPhoto }]
      mockGetFavorites.mockResolvedValueOnce({ success: true, data: newFavorites })

      await act(async () => {
        await result.current.reloadFavorites()
      })

      await waitFor(() => {
        expect(result.current.favorites).toEqual(newFavorites)
      })
    })
  })

  describe('toasts', () => {
    it('aggiunge un toast dopo aggiunta preferito', async () => {
      const newFavorite = { photo_id: 'photo_1', photo_data: mockPhoto }
      mockAddFavorite.mockResolvedValueOnce({ success: true, data: newFavorite })

      const { result } = renderHook(() => useFavorites(), { wrapper })

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      await act(async () => {
        await result.current.toggleFavorite(mockPhoto)
      })

      await waitFor(() => {
        expect(result.current.toasts.length).toBeGreaterThan(0)
      })
    })

    it('removeToast rimuove un toast', async () => {
      const newFavorite = { photo_id: 'photo_1', photo_data: mockPhoto }
      mockAddFavorite.mockResolvedValueOnce({ success: true, data: newFavorite })

      const { result } = renderHook(() => useFavorites(), { wrapper })

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      await act(async () => {
        await result.current.toggleFavorite(mockPhoto)
      })

      await waitFor(() => {
        expect(result.current.toasts.length).toBeGreaterThan(0)
      })

      const toastId = result.current.toasts[0].id

      act(() => {
        result.current.removeToast(toastId)
      })

      expect(result.current.toasts.find((t) => t.id === toastId)).toBeUndefined()
    })
  })
})
