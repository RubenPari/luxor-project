import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { getFavorites, addFavorite, removeFavorite } from './favorites'
import type { UnsplashPhoto } from '../types/unsplash'

// Mock fetch globale
const mockFetch = vi.fn()
global.fetch = mockFetch

const TEST_USER_ID = '550e8400-e29b-41d4-a716-446655440000'

const mockPhoto: UnsplashPhoto = {
  id: 'test_photo_123',
  width: 1920,
  height: 1080,
  description: 'Test photo description',
  alt_description: 'Test alt description',
  urls: {
    raw: 'https://example.com/raw.jpg',
    full: 'https://example.com/full.jpg',
    regular: 'https://example.com/regular.jpg',
    small: 'https://example.com/small.jpg',
    thumb: 'https://example.com/thumb.jpg',
  },
  links: {
    self: 'https://api.unsplash.com/photos/test',
    html: 'https://unsplash.com/photos/test',
    download: 'https://unsplash.com/photos/test/download',
  },
  user: {
    id: 'user_123',
    username: 'testuser',
    name: 'Test User',
    portfolio_url: 'https://example.com',
    profile_image: 'https://example.com/avatar.jpg',
  },
  created_at: '2024-01-01T00:00:00Z',
}

describe('favorites service', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('getFavorites', () => {
    it('restituisce i preferiti quando la chiamata ha successo', async () => {
      const mockData = {
        success: true,
        data: [{ photo_id: 'test_123', photo_data: mockPhoto }],
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      })

      const result = await getFavorites(TEST_USER_ID)

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/favorites'),
        expect.objectContaining({
          headers: expect.objectContaining({
            'X-User-ID': TEST_USER_ID,
          }),
        })
      )
      expect(result).toEqual(mockData)
    })

    it('restituisce errore quando la risposta HTTP non è ok', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
      })

      const result = await getFavorites(TEST_USER_ID)

      expect(result.success).toBe(false)
      expect(result.error).toBeDefined()
    })

    it('gestisce errori di rete', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'))

      const result = await getFavorites(TEST_USER_ID)

      expect(result.success).toBe(false)
      expect(result.error).toBe('Network error')
    })
  })

  describe('addFavorite', () => {
    it('aggiunge un preferito con successo', async () => {
      const mockResponse = {
        success: true,
        data: { id: 1, photo_id: mockPhoto.id, photo_data: mockPhoto },
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      })

      const result = await addFavorite(mockPhoto, TEST_USER_ID)

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/favorites'),
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            'X-User-ID': TEST_USER_ID,
          }),
          body: JSON.stringify({
            photo_id: mockPhoto.id,
            photo_data: mockPhoto,
          }),
        })
      )
      expect(result).toEqual(mockResponse)
    })

    it('restituisce errore quando la risposta HTTP non è ok', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 422,
        statusText: 'Unprocessable Entity',
      })

      const result = await addFavorite(mockPhoto, TEST_USER_ID)

      expect(result.success).toBe(false)
      expect(result.error).toBeDefined()
    })

    it('gestisce errori di rete', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Connection refused'))

      const result = await addFavorite(mockPhoto, TEST_USER_ID)

      expect(result.success).toBe(false)
      expect(result.error).toBe('Connection refused')
    })
  })

  describe('removeFavorite', () => {
    it('rimuove un preferito con successo', async () => {
      const mockResponse = { success: true }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      })

      const result = await removeFavorite('test_photo_123', TEST_USER_ID)

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/favorites/test_photo_123'),
        expect.objectContaining({
          method: 'DELETE',
          headers: expect.objectContaining({
            'X-User-ID': TEST_USER_ID,
          }),
        })
      )
      expect(result).toEqual(mockResponse)
    })

    it('restituisce errore quando il preferito non esiste', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found',
      })

      const result = await removeFavorite('nonexistent', TEST_USER_ID)

      expect(result.success).toBe(false)
      expect(result.error).toBeDefined()
    })

    it('gestisce errori di rete', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Timeout'))

      const result = await removeFavorite('test_photo_123', TEST_USER_ID)

      expect(result.success).toBe(false)
      expect(result.error).toBe('Timeout')
    })
  })
})
