import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import Pagination from './Pagination'

describe('Pagination', () => {
  const defaultProps = {
    currentPage: 1,
    totalPages: 10,
    onPageChange: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renderizza i pulsanti e l\'indicatore di pagina', () => {
    render(<Pagination {...defaultProps} />)

    expect(screen.getByText('Precedente')).toBeInTheDocument()
    expect(screen.getByText('Successiva')).toBeInTheDocument()
    expect(screen.getByText('Pagina 1 di 10')).toBeInTheDocument()
  })

  it('mostra la pagina corrente nell\'indicatore', () => {
    render(<Pagination {...defaultProps} currentPage={5} />)

    expect(screen.getByText('Pagina 5 di 10')).toBeInTheDocument()
  })

  it('disabilita il pulsante Precedente alla prima pagina', () => {
    render(<Pagination {...defaultProps} currentPage={1} />)

    expect(screen.getByText('Precedente')).toBeDisabled()
  })

  it('abilita il pulsante Precedente dopo la prima pagina', () => {
    render(<Pagination {...defaultProps} currentPage={2} />)

    expect(screen.getByText('Precedente')).not.toBeDisabled()
  })

  it('disabilita il pulsante Successiva all\'ultima pagina', () => {
    render(<Pagination {...defaultProps} currentPage={10} totalPages={10} />)

    expect(screen.getByText('Successiva')).toBeDisabled()
  })

  it('abilita il pulsante Successiva prima dell\'ultima pagina', () => {
    render(<Pagination {...defaultProps} currentPage={9} totalPages={10} />)

    expect(screen.getByText('Successiva')).not.toBeDisabled()
  })

  it('chiama onPageChange con pagina precedente quando si clicca Precedente', () => {
    const onPageChange = vi.fn()

    render(
      <Pagination
        currentPage={5}
        totalPages={10}
        onPageChange={onPageChange}
      />
    )

    fireEvent.click(screen.getByText('Precedente'))

    expect(onPageChange).toHaveBeenCalledTimes(1)
    expect(onPageChange).toHaveBeenCalledWith(4)
  })

  it('chiama onPageChange con pagina successiva quando si clicca Successiva', () => {
    const onPageChange = vi.fn()

    render(
      <Pagination
        currentPage={5}
        totalPages={10}
        onPageChange={onPageChange}
      />
    )

    fireEvent.click(screen.getByText('Successiva'))

    expect(onPageChange).toHaveBeenCalledTimes(1)
    expect(onPageChange).toHaveBeenCalledWith(6)
  })

  it('non chiama onPageChange quando il pulsante è disabilitato', () => {
    const onPageChange = vi.fn()

    render(
      <Pagination
        currentPage={1}
        totalPages={10}
        onPageChange={onPageChange}
      />
    )

    // Il pulsante Precedente è disabilitato
    fireEvent.click(screen.getByText('Precedente'))

    expect(onPageChange).not.toHaveBeenCalled()
  })

  it('applica le classi CSS personalizzate', () => {
    const { container } = render(
      <Pagination
        {...defaultProps}
        className="my-custom-class"
      />
    )

    expect(container.firstChild).toHaveClass('my-custom-class')
  })

  it('gestisce il caso di una sola pagina', () => {
    render(<Pagination currentPage={1} totalPages={1} onPageChange={vi.fn()} />)

    expect(screen.getByText('Precedente')).toBeDisabled()
    expect(screen.getByText('Successiva')).toBeDisabled()
    expect(screen.getByText('Pagina 1 di 1')).toBeInTheDocument()
  })

  it('gestisce molte pagine', () => {
    render(
      <Pagination
        currentPage={500}
        totalPages={1000}
        onPageChange={vi.fn()}
      />
    )

    expect(screen.getByText('Pagina 500 di 1000')).toBeInTheDocument()
    expect(screen.getByText('Precedente')).not.toBeDisabled()
    expect(screen.getByText('Successiva')).not.toBeDisabled()
  })
})
