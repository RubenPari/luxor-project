import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { searchPhotos } from './unsplash'

// Mock fetch globale
const mockFetch = vi.fn()
global.fetch = mockFetch

const TEST_USER_ID = '550e8400-e29b-41d4-a716-446655440000'

const mockSearchResponse = {
  success: true,
  data: {
    results: [
      {
        id: 'photo_1',
        width: 1920,
        height: 1080,
        description: 'Mountain landscape',
        urls: { regular: 'https://example.com/photo1.jpg' },
        user: { name: 'Photographer 1' },
      },
      {
        id: 'photo_2',
        width: 1920,
        height: 1080,
        description: 'Beach sunset',
        urls: { regular: 'https://example.com/photo2.jpg' },
        user: { name: 'Photographer 2' },
      },
    ],
    total: 100,
    total_pages: 10,
  },
}

describe('unsplash service', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('searchPhotos', () => {
    it('effettua una ricerca con i parametri corretti', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockSearchResponse,
      })

      const result = await searchPhotos('mountain', 1, 12, TEST_USER_ID)

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringMatching(/\/unsplash\/search\?query=mountain&page=1&per_page=12/),
        expect.objectContaining({
          headers: expect.objectContaining({
            'X-User-ID': TEST_USER_ID,
          }),
        })
      )
      expect(result).toEqual(mockSearchResponse)
    })

    it('usa i valori di default per page e perPage', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockSearchResponse,
      })

      await searchPhotos('sunset', 1, 12, TEST_USER_ID)

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringMatching(/page=1/),
        expect.anything()
      )
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringMatching(/per_page=12/),
        expect.anything()
      )
    })

    it('supporta la paginazione personalizzata', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockSearchResponse,
      })

      await searchPhotos('nature', 3, 20, TEST_USER_ID)

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringMatching(/page=3&per_page=20/),
        expect.anything()
      )
    })

    it('lancia errore quando la risposta HTTP non è ok', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
      })

      await expect(searchPhotos('test', 1, 12, TEST_USER_ID)).rejects.toThrow(
        'HTTP error! status: 500'
      )
    })

    it('propaga il segnale di abort', async () => {
      const controller = new AbortController()
      
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockSearchResponse,
      })

      await searchPhotos('test', 1, 12, TEST_USER_ID, controller.signal)

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          signal: controller.signal,
        })
      )
    })

    it('gestisce errori di rete', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'))

      await expect(searchPhotos('test', 1, 12, TEST_USER_ID)).rejects.toThrow(
        'Network error'
      )
    })

    it('gestisce AbortError quando la richiesta viene cancellata', async () => {
      const abortError = new DOMException('Aborted', 'AbortError')
      mockFetch.mockRejectedValueOnce(abortError)

      await expect(searchPhotos('test', 1, 12, TEST_USER_ID)).rejects.toThrow()
    })
  })
})
