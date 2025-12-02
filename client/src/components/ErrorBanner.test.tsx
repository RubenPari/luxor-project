import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import ErrorBanner from './ErrorBanner'

describe('ErrorBanner', () => {
  const defaultProps = {
    message: 'Si è verificato un errore',
    onClose: vi.fn(),
  }

  it('renderizza il messaggio di errore', () => {
    render(<ErrorBanner {...defaultProps} />)

    expect(screen.getByText('Si è verificato un errore')).toBeInTheDocument()
  })

  it('renderizza il titolo "Errore"', () => {
    render(<ErrorBanner {...defaultProps} />)

    expect(screen.getByText('Errore')).toBeInTheDocument()
  })

  it('ha il ruolo alert per accessibilità', () => {
    render(<ErrorBanner {...defaultProps} />)

    expect(screen.getByRole('alert')).toBeInTheDocument()
  })

  it('renderizza il pulsante Chiudi', () => {
    render(<ErrorBanner {...defaultProps} />)

    expect(screen.getByText('Chiudi')).toBeInTheDocument()
  })

  it('chiama onClose quando si clicca il pulsante Chiudi', () => {
    const onClose = vi.fn()
    render(<ErrorBanner {...defaultProps} onClose={onClose} />)

    fireEvent.click(screen.getByText('Chiudi'))

    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('applica le classi CSS personalizzate', () => {
    const { container } = render(
      <ErrorBanner {...defaultProps} className="custom-class" />
    )

    expect(container.firstChild).toHaveClass('custom-class')
  })

  it('ha lo stile visivo corretto (sfondo rosso)', () => {
    const { container } = render(<ErrorBanner {...defaultProps} />)

    expect(container.firstChild).toHaveClass('bg-red-100')
    expect(container.firstChild).toHaveClass('border-red-500')
  })

  it('renderizza messaggi lunghi correttamente', () => {
    const longMessage = 'Questo è un messaggio di errore molto lungo che descrive dettagliatamente cosa è andato storto durante l\'operazione.'
    
    render(<ErrorBanner {...defaultProps} message={longMessage} />)

    expect(screen.getByText(longMessage)).toBeInTheDocument()
  })
})
