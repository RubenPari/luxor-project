import type { UnsplashPhoto, FavoriteResponse } from '../types/unsplash'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

export async function getFavorites(userId?: number): Promise<FavoriteResponse> {
  try {
    const url = new URL(`${API_BASE_URL}/favorites`)
    if (userId) {
      url.searchParams.append('user_id', userId.toString())
    }
    
    const response = await fetch(url.toString())
    return await response.json()
  } catch (error) {
    console.error('Failed to fetch favorites:', error)
    return {
      success: false,
      message: 'Failed to fetch favorites',
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

export async function addFavorite(
  photo: UnsplashPhoto,
  userId?: number
): Promise<FavoriteResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/favorites`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        photo_id: photo.id,
        photo_data: photo,
        user_id: userId,
      }),
    })
    
    return await response.json()
  } catch (error) {
    console.error('Failed to add favorite:', error)
    return {
      success: false,
      message: 'Failed to add favorite',
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

export async function removeFavorite(
  photoId: string,
  userId?: number
): Promise<FavoriteResponse> {
  try {
    const url = new URL(`${API_BASE_URL}/favorites/${photoId}`)
    if (userId) {
      url.searchParams.append('user_id', userId.toString())
    }
    
    const response = await fetch(url.toString(), {
      method: 'DELETE',
    })
    
    return await response.json()
  } catch (error) {
    console.error('Failed to remove favorite:', error)
    return {
      success: false,
      message: 'Failed to remove favorite',
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}
