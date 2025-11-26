import type { UnsplashSearchResponse } from "../types/unsplash";

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export async function searchPhotos(
  query: string,
  page: number = 1,
  perPage: number = 12
): Promise<UnsplashSearchResponse> {
  const params = new URLSearchParams({
    query,
    page: page.toString(),
    per_page: perPage.toString(),
  });

  const response = await fetch(`${API_BASE_URL}/unsplash/search?${params}`);
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return response.json();
}
