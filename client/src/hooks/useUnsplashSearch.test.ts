import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, waitFor, act } from '@testing-library/react'
import { useUnsplashSearch } from './useUnsplashSearch'

// Mock del servizio unsplash
vi.mock('../services/unsplash', () => ({
  searchPhotos: vi.fn(),
}))

// Mock dell'hook useUserId
vi.mock('./useUserId', () => ({
  useUserId: vi.fn(() => '550e8400-e29b-41d4-a716-446655440000'),
}))

import { searchPhotos } from '../services/unsplash'

const mockSearchPhotos = searchPhotos as ReturnType<typeof vi.fn>

const mockPhotos = [
  {
    id: 'photo_1',
    width: 1920,
    height: 1080,
    description: 'Test photo 1',
    alt_description: 'Alt 1',
    urls: { regular: 'https://example.com/1.jpg' },
    user: { name: 'User 1' },
  },
  {
    id: 'photo_2',
    width: 1920,
    height: 1080,
    description: 'Test photo 2',
    alt_description: 'Alt 2',
    urls: { regular: 'https://example.com/2.jpg' },
    user: { name: 'User 2' },
  },
]

describe('useUnsplashSearch', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('inizializza con stato vuoto', () => {
    const { result } = renderHook(() => useUnsplashSearch())

    expect(result.current.photos).toEqual([])
    expect(result.current.isLoading).toBe(false)
    expect(result.current.error).toBeNull()
    expect(result.current.currentQuery).toBe('')
    expect(result.current.currentPage).toBe(1)
    expect(result.current.totalPages).toBe(0)
  })

  it('esegue una ricerca con successo', async () => {
    mockSearchPhotos.mockResolvedValueOnce({
      success: true,
      data: {
        results: mockPhotos,
        total: 100,
        total_pages: 10,
      },
    })

    const { result } = renderHook(() => useUnsplashSearch())

    await act(async () => {
      await result.current.search('nature')
    })

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.photos).toEqual(mockPhotos)
    expect(result.current.currentQuery).toBe('nature')
    expect(result.current.totalPages).toBe(10)
    expect(result.current.error).toBeNull()
  })

  it('gestisce errori di ricerca', async () => {
    mockSearchPhotos.mockResolvedValueOnce({
      success: false,
      message: 'API Error',
    })

    const { result } = renderHook(() => useUnsplashSearch())

    await act(async () => {
      await result.current.search('test')
    })

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.error).toBe('API Error')
    expect(result.current.photos).toEqual([])
  })

  it('ignora query vuote', async () => {
    const { result } = renderHook(() => useUnsplashSearch())

    await act(async () => {
      await result.current.search('')
    })

    expect(mockSearchPhotos).not.toHaveBeenCalled()
    expect(result.current.isLoading).toBe(false)
  })

  it('ignora query con solo spazi', async () => {
    const { result } = renderHook(() => useUnsplashSearch())

    await act(async () => {
      await result.current.search('   ')
    })

    expect(mockSearchPhotos).not.toHaveBeenCalled()
  })

  it('naviga a una pagina specifica', async () => {
    mockSearchPhotos
      .mockResolvedValueOnce({
        success: true,
        data: { results: mockPhotos, total: 100, total_pages: 10 },
      })
      .mockResolvedValueOnce({
        success: true,
        data: { results: mockPhotos, total: 100, total_pages: 10 },
      })

    const { result } = renderHook(() => useUnsplashSearch())

    // Prima ricerca
    await act(async () => {
      await result.current.search('nature')
    })

    await waitFor(() => {
      expect(result.current.currentPage).toBe(1)
    })

    // Naviga a pagina 3
    await act(async () => {
      await result.current.goToPage(3)
    })

    await waitFor(() => {
      expect(result.current.currentPage).toBe(3)
    })
  })

  it('non naviga a pagine invalide', async () => {
    mockSearchPhotos.mockResolvedValueOnce({
      success: true,
      data: { results: mockPhotos, total: 30, total_pages: 3 },
    })

    const { result } = renderHook(() => useUnsplashSearch())

    await act(async () => {
      await result.current.search('nature')
    })

    await waitFor(() => {
      expect(result.current.totalPages).toBe(3)
    })

    // Prova a navigare oltre il limite
    await act(async () => {
      await result.current.goToPage(10)
    })

    // Dovrebbe rimanere sulla pagina corrente
    expect(result.current.currentPage).toBe(1)
  })

  it('non naviga a pagina 0 o negativa', async () => {
    mockSearchPhotos.mockResolvedValueOnce({
      success: true,
      data: { results: mockPhotos, total: 100, total_pages: 10 },
    })

    const { result } = renderHook(() => useUnsplashSearch())

    await act(async () => {
      await result.current.search('nature')
    })

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    await act(async () => {
      await result.current.goToPage(0)
    })

    expect(result.current.currentPage).toBe(1)

    await act(async () => {
      await result.current.goToPage(-1)
    })

    expect(result.current.currentPage).toBe(1)
  })

  it('clearError cancella l\'errore', async () => {
    mockSearchPhotos.mockResolvedValueOnce({
      success: false,
      message: 'Test error',
    })

    const { result } = renderHook(() => useUnsplashSearch())

    await act(async () => {
      await result.current.search('test')
    })

    await waitFor(() => {
      expect(result.current.error).toBe('Test error')
    })

    act(() => {
      result.current.clearError()
    })

    expect(result.current.error).toBeNull()
  })

  it('utilizza il perPage personalizzato', async () => {
    mockSearchPhotos.mockResolvedValueOnce({
      success: true,
      data: { results: mockPhotos, total: 100, total_pages: 5 },
    })

    const { result } = renderHook(() => useUnsplashSearch({ perPage: 20 }))

    await act(async () => {
      await result.current.search('nature')
    })

    expect(mockSearchPhotos).toHaveBeenCalledWith(
      'nature',
      1,
      20,
      expect.any(String),
      expect.any(Object)
    )
  })
})
