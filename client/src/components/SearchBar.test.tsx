import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SearchBar from './SearchBar';

describe('SearchBar', () => {
  it('renders search input and button', () => {
    const mockOnSearch = vi.fn();
    render(<SearchBar onSearch={mockOnSearch} />);
    
    expect(screen.getByPlaceholderText('Search for photos...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Search' })).toBeInTheDocument();
  });

  it('calls onSearch with query when form is submitted', async () => {
    const mockOnSearch = vi.fn();
    const user = userEvent.setup();
    render(<SearchBar onSearch={mockOnSearch} />);
    
    const input = screen.getByPlaceholderText('Search for photos...');
    const button = screen.getByRole('button', { name: 'Search' });
    
    await user.type(input, 'nature');
    await user.click(button);
    
    expect(mockOnSearch).toHaveBeenCalledWith('nature');
  });

  it('does not call onSearch when query is empty', async () => {
    const mockOnSearch = vi.fn();
    const user = userEvent.setup();
    render(<SearchBar onSearch={mockOnSearch} />);
    
    const button = screen.getByRole('button', { name: 'Search' });
    await user.click(button);
    
    expect(mockOnSearch).not.toHaveBeenCalled();
  });

  it('trims whitespace from query', async () => {
    const mockOnSearch = vi.fn();
    const user = userEvent.setup();
    render(<SearchBar onSearch={mockOnSearch} />);
    
    const input = screen.getByPlaceholderText('Search for photos...');
    const button = screen.getByRole('button', { name: 'Search' });
    
    await user.type(input, '  nature  ');
    await user.click(button);
    
    expect(mockOnSearch).toHaveBeenCalledWith('nature');
  });

  it('disables input and button when loading', () => {
    const mockOnSearch = vi.fn();
    render(<SearchBar onSearch={mockOnSearch} isLoading={true} />);
    
    const input = screen.getByPlaceholderText('Search for photos...');
    const button = screen.getByRole('button', { name: 'Searching...' });
    
    expect(input).toBeDisabled();
    expect(button).toBeDisabled();
  });

  it('submits form on Enter key', () => {
    const mockOnSearch = vi.fn();
    render(<SearchBar onSearch={mockOnSearch} />);
    
    const input = screen.getByPlaceholderText('Search for photos...');
    fireEvent.change(input, { target: { value: 'mountain' } });
    fireEvent.submit(input.closest('form')!);
    
    expect(mockOnSearch).toHaveBeenCalledWith('mountain');
  });
});
