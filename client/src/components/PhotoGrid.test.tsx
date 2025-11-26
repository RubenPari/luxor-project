import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import PhotoGrid from './PhotoGrid';
import { UnsplashPhoto } from '../types/unsplash';

const mockPhotos: UnsplashPhoto[] = [
  {
    id: '1',
    width: 1920,
    height: 1080,
    description: 'A beautiful landscape',
    alt_description: 'Mountain view',
    urls: {
      raw: 'https://example.com/raw/1',
      full: 'https://example.com/full/1',
      regular: 'https://example.com/regular/1',
      small: 'https://example.com/small/1',
      thumb: 'https://example.com/thumb/1',
    },
    links: {
      self: 'https://api.unsplash.com/photos/1',
      html: 'https://unsplash.com/photos/1',
      download: 'https://unsplash.com/photos/1/download',
    },
    user: {
      id: 'user1',
      username: 'photographer1',
      name: 'John Doe',
      portfolio_url: 'https://example.com/portfolio',
      profile_image: 'https://example.com/profile.jpg',
    },
    created_at: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    width: 1920,
    height: 1080,
    description: 'Another photo',
    alt_description: 'Beach sunset',
    urls: {
      raw: 'https://example.com/raw/2',
      full: 'https://example.com/full/2',
      regular: 'https://example.com/regular/2',
      small: 'https://example.com/small/2',
      thumb: 'https://example.com/thumb/2',
    },
    links: {
      self: 'https://api.unsplash.com/photos/2',
      html: 'https://unsplash.com/photos/2',
      download: 'https://unsplash.com/photos/2/download',
    },
    user: {
      id: 'user2',
      username: 'photographer2',
      name: 'Jane Smith',
      portfolio_url: null,
      profile_image: 'https://example.com/profile2.jpg',
    },
    created_at: '2024-01-02T00:00:00Z',
  },
];

describe('PhotoGrid', () => {
  it('shows loading spinner when loading', () => {
    render(<PhotoGrid photos={[]} isLoading={true} />);
    
    const spinner = document.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
  });

  it('shows empty state when no photos are provided', () => {
    render(<PhotoGrid photos={[]} isLoading={false} />);
    
    expect(screen.getByText(/No photos found/i)).toBeInTheDocument();
  });

  it('renders photos in a grid', () => {
    render(<PhotoGrid photos={mockPhotos} isLoading={false} />);
    
    const images = screen.getAllByRole('img');
    expect(images).toHaveLength(2);
    expect(images[0]).toHaveAttribute('src', 'https://example.com/small/1');
    expect(images[1]).toHaveAttribute('src', 'https://example.com/small/2');
  });

  it('displays photo alt text', () => {
    render(<PhotoGrid photos={mockPhotos} isLoading={false} />);
    
    expect(screen.getByAltText('Mountain view')).toBeInTheDocument();
    expect(screen.getByAltText('Beach sunset')).toBeInTheDocument();
  });

  it('does not show empty state when photos are loading', () => {
    render(<PhotoGrid photos={[]} isLoading={true} />);
    
    expect(screen.queryByText(/No photos found/i)).not.toBeInTheDocument();
  });
});
