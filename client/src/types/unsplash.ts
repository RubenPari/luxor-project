export interface UnsplashPhoto {
  id: string;
  width: number;
  height: number;
  description: string | null;
  alt_description: string | null;
  urls: {
    raw: string | null;
    full: string | null;
    regular: string | null;
    small: string | null;
    thumb: string | null;
  };
  links: {
    self: string | null;
    html: string | null;
    download: string | null;
  };
  user: {
    id: string | null;
    username: string | null;
    name: string | null;
    portfolio_url: string | null;
    profile_image: string | null;
  };
  created_at: string;
}

export interface UnsplashSearchResponse {
  success: boolean;
  data: {
    results: UnsplashPhoto[];
    total: number;
    total_pages: number;
  };
  message?: string;
  error?: string;
}

export interface Favorite {
  id: number;
  user_id: number | null;
  photo_id: string;
  photo_data: UnsplashPhoto;
  created_at: string;
  updated_at: string;
}

export interface FavoriteResponse {
  success: boolean;
  data?: Favorite | Favorite[];
  message?: string;
  error?: string;
}
