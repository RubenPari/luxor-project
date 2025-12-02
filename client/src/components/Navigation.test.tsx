import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Navigation from './Navigation'

// Wrapper per fornire il router context
const renderWithRouter = (ui: React.ReactElement, { route = '/' } = {}) => {
  return render(
    <MemoryRouter initialEntries={[route]}>
      {ui}
    </MemoryRouter>
  )
}

describe('Navigation', () => {
  it('renderizza il logo Luxor', () => {
    renderWithRouter(<Navigation favoritesCount={0} />)

    expect(screen.getByText('Luxor')).toBeInTheDocument()
  })

  it('renderizza il link Cerca', () => {
    renderWithRouter(<Navigation favoritesCount={0} />)

    expect(screen.getByText('Cerca')).toBeInTheDocument()
  })

  it('renderizza il link Preferiti', () => {
    renderWithRouter(<Navigation favoritesCount={0} />)

    expect(screen.getByText('Preferiti')).toBeInTheDocument()
  })

  it('mostra il badge con il conteggio preferiti quando > 0', () => {
    renderWithRouter(<Navigation favoritesCount={5} />)

    expect(screen.getByText('5')).toBeInTheDocument()
  })

  it('non mostra il badge quando il conteggio è 0', () => {
    renderWithRouter(<Navigation favoritesCount={0} />)

    expect(screen.queryByText('0')).not.toBeInTheDocument()
  })

  it('mostra lo spinner quando isLoading è true', () => {
    const { container } = renderWithRouter(
      <Navigation favoritesCount={5} isLoading={true} />
    )

    // Lo spinner ha la classe animate-spin
    const spinner = container.querySelector('.animate-spin')
    expect(spinner).toBeInTheDocument()
  })

  it('non mostra il badge durante il caricamento', () => {
    renderWithRouter(<Navigation favoritesCount={5} isLoading={true} />)

    // Il badge non dovrebbe essere visibile durante il loading
    expect(screen.queryByText('5')).not.toBeInTheDocument()
  })

  it('il link Cerca ha lo stile attivo quando sulla home', () => {
    renderWithRouter(<Navigation favoritesCount={0} />, { route: '/' })

    const cercaLink = screen.getByText('Cerca').closest('a')
    expect(cercaLink).toHaveClass('bg-purple-600')
  })

  it('il link Preferiti ha lo stile attivo quando sulla pagina preferiti', () => {
    renderWithRouter(<Navigation favoritesCount={0} />, { route: '/favorites' })

    const preferitiLink = screen.getByText('Preferiti').closest('a')
    expect(preferitiLink).toHaveClass('bg-purple-600')
  })

  it('ha la navigazione sticky', () => {
    const { container } = renderWithRouter(<Navigation favoritesCount={0} />)

    const nav = container.querySelector('nav')
    expect(nav).toHaveClass('sticky')
    expect(nav).toHaveClass('top-0')
  })

  it('mostra conteggi grandi nel badge', () => {
    renderWithRouter(<Navigation favoritesCount={99} />)

    expect(screen.getByText('99')).toBeInTheDocument()
  })

  it('il logo è un link alla home', () => {
    renderWithRouter(<Navigation favoritesCount={0} />)

    const logoLink = screen.getByText('Luxor').closest('a')
    expect(logoLink).toHaveAttribute('href', '/')
  })
})
