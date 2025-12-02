import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import ErrorBoundary from './ErrorBoundary'

// Componente che genera errore per testare l'ErrorBoundary
function ThrowError({ shouldThrow }: { shouldThrow: boolean }) {
  if (shouldThrow) {
    throw new Error('Test error')
  }
  return <div>Contenuto normale</div>
}

describe('ErrorBoundary', () => {
  // Sopprimi i log di errore di React durante i test
  const originalError = console.error
  
  beforeEach(() => {
    console.error = vi.fn()
  })

  afterEach(() => {
    console.error = originalError
  })

  it('renderizza i children quando non ci sono errori', () => {
    render(
      <ErrorBoundary>
        <div>Contenuto figlio</div>
      </ErrorBoundary>
    )

    expect(screen.getByText('Contenuto figlio')).toBeInTheDocument()
  })

  it('mostra il fallback di default quando si verifica un errore', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    )

    expect(screen.getByText('Qualcosa è andato storto')).toBeInTheDocument()
  })

  it('mostra un messaggio descrittivo quando si verifica un errore', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    )

    expect(screen.getByText(/errore imprevisto/i)).toBeInTheDocument()
  })

  it('mostra un pulsante per ricaricare la pagina', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    )

    expect(screen.getByText('Ricarica la pagina')).toBeInTheDocument()
  })

  it('usa il fallback personalizzato se fornito', () => {
    const customFallback = <div>Errore personalizzato</div>

    render(
      <ErrorBoundary fallback={customFallback}>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    )

    expect(screen.getByText('Errore personalizzato')).toBeInTheDocument()
    expect(screen.queryByText('Qualcosa è andato storto')).not.toBeInTheDocument()
  })

  it('cattura errori nei componenti figli annidati', () => {
    render(
      <ErrorBoundary>
        <div>
          <div>
            <ThrowError shouldThrow={true} />
          </div>
        </div>
      </ErrorBoundary>
    )

    expect(screen.getByText('Qualcosa è andato storto')).toBeInTheDocument()
  })

  it('non cattura errori se il componente figlio non genera errori', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={false} />
      </ErrorBoundary>
    )

    expect(screen.getByText('Contenuto normale')).toBeInTheDocument()
    expect(screen.queryByText('Qualcosa è andato storto')).not.toBeInTheDocument()
  })
})
