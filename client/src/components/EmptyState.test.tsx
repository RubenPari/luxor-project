import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import EmptyState from './EmptyState'

describe('EmptyState', () => {
  const defaultProps = {
    icon: <span data-testid="test-icon">🔍</span>,
    title: 'Nessun Risultato',
    description: 'Non abbiamo trovato nulla.',
  }

  it('renderizza il titolo', () => {
    render(<EmptyState {...defaultProps} />)

    expect(screen.getByText('Nessun Risultato')).toBeInTheDocument()
  })

  it('renderizza la descrizione', () => {
    render(<EmptyState {...defaultProps} />)

    expect(screen.getByText('Non abbiamo trovato nulla.')).toBeInTheDocument()
  })

  it('renderizza l\'icona passata come prop', () => {
    render(<EmptyState {...defaultProps} />)

    expect(screen.getByTestId('test-icon')).toBeInTheDocument()
  })

  it('applica le classi CSS corrette per il layout centrato', () => {
    const { container } = render(<EmptyState {...defaultProps} />)

    expect(container.firstChild).toHaveClass('text-center')
  })

  it('accetta diversi tipi di icona come ReactNode', () => {
    const customIcon = (
      <svg data-testid="svg-icon" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" />
      </svg>
    )

    render(<EmptyState {...defaultProps} icon={customIcon} />)

    expect(screen.getByTestId('svg-icon')).toBeInTheDocument()
  })

  it('renderizza titoli lunghi correttamente', () => {
    const longTitle = 'Questo è un titolo molto lungo che potrebbe andare su più righe'
    
    render(<EmptyState {...defaultProps} title={longTitle} />)

    expect(screen.getByText(longTitle)).toBeInTheDocument()
  })
})
