import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import PhotoCard from './PhotoCard'
import type { UnsplashPhoto } from '../types/unsplash'

const mockPhoto: UnsplashPhoto = {
  id: 'test_photo_123',
  width: 1920,
  height: 1080,
  description: 'A beautiful mountain landscape',
  alt_description: 'Mountain at sunset',
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
    username: 'photographer',
    name: 'John Photographer',
    portfolio_url: 'https://portfolio.example.com',
    profile_image: 'https://example.com/avatar.jpg',
  },
  created_at: '2024-01-01T00:00:00Z',
}

describe('PhotoCard', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renderizza l\'immagine con l\'URL corretto', () => {
    render(<PhotoCard photo={mockPhoto} />)

    const img = screen.getByRole('img', { name: /mountain at sunset/i })
    expect(img).toBeInTheDocument()
    expect(img).toHaveAttribute('src', mockPhoto.urls.regular)
  })

  it('mostra il testo alternativo corretto', () => {
    render(<PhotoCard photo={mockPhoto} />)

    expect(screen.getByAltText('Mountain at sunset')).toBeInTheDocument()
  })

  it('usa description come fallback per alt quando alt_description è assente', () => {
    const photoWithoutAlt = {
      ...mockPhoto,
      alt_description: null,
    }

    render(<PhotoCard photo={photoWithoutAlt} />)

    expect(screen.getByAltText('A beautiful mountain landscape')).toBeInTheDocument()
  })

  it('mostra il nome del fotografo', () => {
    render(<PhotoCard photo={mockPhoto} />)

    expect(screen.getByText('John Photographer')).toBeInTheDocument()
  })

  it('mostra lo username del fotografo', () => {
    render(<PhotoCard photo={mockPhoto} />)

    expect(screen.getByText('@photographer')).toBeInTheDocument()
  })

  it('ha un link alla foto su Unsplash', () => {
    render(<PhotoCard photo={mockPhoto} />)

    const links = screen.getAllByRole('link')
    const photoLink = links.find((link) => 
      link.getAttribute('href') === 'https://unsplash.com/photos/test'
    )

    expect(photoLink).toBeInTheDocument()
    expect(photoLink).toHaveAttribute('target', '_blank')
    expect(photoLink).toHaveAttribute('rel', 'noopener noreferrer')
  })

  describe('pulsante preferiti', () => {
    it('non mostra il pulsante se onToggleFavorite non è definito', () => {
      render(<PhotoCard photo={mockPhoto} />)

      expect(screen.queryByTitle(/preferiti/i)).not.toBeInTheDocument()
    })

    it('mostra il pulsante se onToggleFavorite è definito', () => {
      const onToggle = vi.fn()

      render(<PhotoCard photo={mockPhoto} onToggleFavorite={onToggle} />)

      expect(screen.getByTitle(/aggiungi ai preferiti/i)).toBeInTheDocument()
    })

    it('mostra stato attivo quando isFavorite è true', () => {
      const onToggle = vi.fn()

      render(
        <PhotoCard
          photo={mockPhoto}
          isFavorite={true}
          onToggleFavorite={onToggle}
        />
      )

      expect(screen.getByTitle(/rimuovi dai preferiti/i)).toBeInTheDocument()
    })

    it('chiama onToggleFavorite quando viene cliccato', () => {
      const onToggle = vi.fn()

      render(<PhotoCard photo={mockPhoto} onToggleFavorite={onToggle} />)

      fireEvent.click(screen.getByTitle(/aggiungi ai preferiti/i))

      expect(onToggle).toHaveBeenCalledTimes(1)
      expect(onToggle).toHaveBeenCalledWith(mockPhoto)
    })

    it('previene la navigazione quando si clicca sul pulsante', () => {
      const onToggle = vi.fn()
      const stopPropagation = vi.fn()
      const preventDefault = vi.fn()

      render(<PhotoCard photo={mockPhoto} onToggleFavorite={onToggle} />)

      const button = screen.getByTitle(/aggiungi ai preferiti/i)

      fireEvent.click(button, {
        stopPropagation,
        preventDefault,
      })

      expect(onToggle).toHaveBeenCalled()
    })

    it('mostra lo spinner quando isSaving è true', () => {
      const onToggle = vi.fn()

      render(
        <PhotoCard
          photo={mockPhoto}
          isSaving={true}
          onToggleFavorite={onToggle}
        />
      )

      expect(screen.getByTitle(/salvataggio in corso/i)).toBeInTheDocument()
    })

    it('disabilita il pulsante quando isSaving è true', () => {
      const onToggle = vi.fn()

      render(
        <PhotoCard
          photo={mockPhoto}
          isSaving={true}
          onToggleFavorite={onToggle}
        />
      )

      const button = screen.getByTitle(/salvataggio in corso/i)
      expect(button).toBeDisabled()
    })
  })

  describe('fallback e casi limite', () => {
    it('gestisce foto senza portfolio_url', () => {
      const photoWithoutPortfolio = {
        ...mockPhoto,
        user: {
          ...mockPhoto.user,
          portfolio_url: null,
        },
      }

      render(<PhotoCard photo={photoWithoutPortfolio} />)

      // Deve usare il link al profilo Unsplash
      const links = screen.getAllByRole('link')
      const profileLink = links.find((link) =>
        link.getAttribute('href')?.includes('unsplash.com/@photographer')
      )

      expect(profileLink).toBeInTheDocument()
    })

    it('usa "Fotografo sconosciuto" quando manca il nome utente', () => {
      const photoWithoutUserName = {
        ...mockPhoto,
        user: {
          ...mockPhoto.user,
          name: '',
          username: '',
        },
      }

      render(<PhotoCard photo={photoWithoutUserName} />)

      expect(screen.getByText('Fotografo sconosciuto')).toBeInTheDocument()
    })

    it('gestisce URL immagine mancanti con fallback', () => {
      const photoWithMinimalUrls = {
        ...mockPhoto,
        urls: {
          raw: '',
          full: '',
          regular: '',
          small: 'https://example.com/small.jpg',
          thumb: '',
        },
      }

      render(<PhotoCard photo={photoWithMinimalUrls} />)

      const img = screen.getByRole('img', { name: /mountain at sunset/i })
      expect(img).toHaveAttribute('src', 'https://example.com/small.jpg')
    })
  })
})
