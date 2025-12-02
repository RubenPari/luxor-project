import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useUserId } from './useUserId'

describe('useUserId', () => {
  const STORAGE_KEY = 'luxor_user_id'
  
  // Mock localStorage
  const localStorageMock = (() => {
    let store: Record<string, string> = {}
    return {
      getItem: vi.fn((key: string) => store[key] || null),
      setItem: vi.fn((key: string, value: string) => {
        store[key] = value
      }),
      removeItem: vi.fn((key: string) => {
        delete store[key]
      }),
      clear: vi.fn(() => {
        store = {}
      }),
    }
  })()

  beforeEach(() => {
    vi.clearAllMocks()
    localStorageMock.clear()
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
      writable: true,
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('genera un nuovo UUID se non esiste in localStorage', () => {
    const { result } = renderHook(() => useUserId())

    expect(result.current).toBeDefined()
    expect(typeof result.current).toBe('string')
    expect(result.current.length).toBe(36) // Formato UUID
  })

  it('salva il nuovo UUID in localStorage', () => {
    renderHook(() => useUserId())

    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      STORAGE_KEY,
      expect.any(String)
    )
  })

  it('restituisce lo stesso UUID su chiamate successive', () => {
    const { result: result1 } = renderHook(() => useUserId())
    
    // Simula che localStorage ora contiene l'UUID
    localStorageMock.getItem.mockReturnValue(result1.current)
    
    const { result: result2 } = renderHook(() => useUserId())

    expect(result2.current).toBe(result1.current)
  })

  it('recupera l\'UUID esistente da localStorage', () => {
    const existingUuid = '550e8400-e29b-41d4-a716-446655440000'
    localStorageMock.getItem.mockReturnValue(existingUuid)

    const { result } = renderHook(() => useUserId())

    expect(result.current).toBe(existingUuid)
    expect(localStorageMock.setItem).not.toHaveBeenCalled()
  })

  it('genera UUID nel formato corretto', () => {
    const { result } = renderHook(() => useUserId())

    // Formato UUID: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    expect(result.current).toMatch(uuidRegex)
  })

  it('gestisce errori di localStorage senza crashare', () => {
    localStorageMock.setItem.mockImplementation(() => {
      throw new Error('QuotaExceededError')
    })
    
    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

    const { result } = renderHook(() => useUserId())

    // Dovrebbe comunque restituire un UUID valido
    expect(result.current).toBeDefined()
    expect(result.current.length).toBe(36)
    
    consoleSpy.mockRestore()
  })

  it('genera UUID diversi ad ogni nuova generazione', () => {
    // Prima generazione
    const { result: result1 } = renderHook(() => useUserId())
    
    // Reset localStorage per forzare nuova generazione
    localStorageMock.clear()
    localStorageMock.getItem.mockReturnValue(null)
    
    // Seconda generazione
    const { result: result2 } = renderHook(() => useUserId())

    // Gli UUID dovrebbero essere diversi (con altissima probabilità)
    expect(result1.current).not.toBe(result2.current)
  })
})
