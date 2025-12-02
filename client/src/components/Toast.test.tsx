import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import Toast from './Toast'

describe('Toast', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  const defaultProps = {
    message: 'Operazione completata',
    type: 'success' as const,
    onClose: vi.fn(),
  }

  it('renderizza il messaggio', () => {
    render(<Toast {...defaultProps} />)

    expect(screen.getByText('Operazione completata')).toBeInTheDocument()
  })

  it('ha il ruolo alert per accessibilità', () => {
    render(<Toast {...defaultProps} />)

    expect(screen.getByRole('alert')).toBeInTheDocument()
  })

  it('applica le classi CSS per il tipo success', () => {
    render(<Toast {...defaultProps} type="success" />)

    expect(screen.getByRole('alert')).toHaveClass('bg-green-500')
  })

  it('applica le classi CSS per il tipo error', () => {
    render(<Toast {...defaultProps} type="error" />)

    expect(screen.getByRole('alert')).toHaveClass('bg-red-500')
  })

  it('applica le classi CSS per il tipo info', () => {
    render(<Toast {...defaultProps} type="info" />)

    expect(screen.getByRole('alert')).toHaveClass('bg-blue-500')
  })

  it('chiama onClose quando si clicca il pulsante di chiusura', async () => {
    const onClose = vi.fn()
    render(<Toast {...defaultProps} onClose={onClose} />)

    const closeButton = screen.getByLabelText('Chiudi notifica')
    fireEvent.click(closeButton)

    // Avanza il tempo per permettere l'animazione
    vi.advanceTimersByTime(300)

    expect(onClose).toHaveBeenCalled()
  })

  it('si chiude automaticamente dopo la durata specificata', async () => {
    const onClose = vi.fn()
    render(<Toast {...defaultProps} onClose={onClose} duration={3000} />)

    // Non dovrebbe essere chiamato prima
    vi.advanceTimersByTime(2000)
    expect(onClose).not.toHaveBeenCalled()

    // Dovrebbe essere chiamato dopo la durata
    vi.advanceTimersByTime(1500)
    expect(onClose).toHaveBeenCalled()
  })

  it('usa la durata di default se non specificata', () => {
    const onClose = vi.fn()
    render(<Toast {...defaultProps} onClose={onClose} />)

    // La durata di default è TOAST_DURATION_MS (3000ms tipicamente)
    vi.advanceTimersByTime(2500)
    expect(onClose).not.toHaveBeenCalled()
  })

  it('renderizza il pulsante di chiusura', () => {
    render(<Toast {...defaultProps} />)

    expect(screen.getByLabelText('Chiudi notifica')).toBeInTheDocument()
  })

  it('è posizionato in basso a destra (fixed)', () => {
    render(<Toast {...defaultProps} />)

    const toast = screen.getByRole('alert')
    expect(toast).toHaveClass('fixed')
    expect(toast).toHaveClass('bottom-4')
    expect(toast).toHaveClass('right-4')
  })
})
