import axios, { AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios';

const WORDPRESS_API_URL = import.meta.env.VITE_WORDPRESS_API_URL || '';
const WORDPRESS_REST_API_URL = import.meta.env.VITE_WORDPRESS_REST_API_URL || '';

// Types
export interface WordPressMedia {
  id: number;
  source_url: string;
  alt_text: string;
  media_type: 'image' | 'video';
  mime_type: string;
}

interface WordPressACFFields {
  hero_title?: string;
  hero_subtitle?: string;
  background_video?: string;
  // Add more ACF fields as needed
}

export interface WordPressPost {
  id: number;
  date: string;
  slug: string;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
  };
  excerpt: {
    rendered: string;
  };
  acf?: WordPressACFFields;
  _embedded?: {
    'wp:featuredmedia'?: WordPressMedia[];
  };
  // Add more fields as needed
}

export interface WordPressPage extends Omit<WordPressPost, 'excerpt'> {
  // Add page-specific fields if needed
  acf?: WordPressACFFields;
}

// Create axios instance for WordPress API
const wordpressApi = axios.create({
  baseURL: WORDPRESS_REST_API_URL || WORDPRESS_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for auth if needed
wordpressApi.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = import.meta.env.VITE_WORDPRESS_APPLICATION_PASSWORD;
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor for error handling
wordpressApi.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    console.error('WordPress API Error:', error.message);
    return Promise.reject(error);
  }
);

// Example API functions
export const fetchPosts = async (params: Record<string, any> = {}): Promise<WordPressPost[]> => {
  try {
    const response = await wordpressApi.get<WordPressPost[]>('/posts', { 
      params: {
        _embed: true, // Include embedded resources
        ...params,
      }, 
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching posts:', error);
    throw error;
  }
};

export const fetchPageBySlug = async (slug: string): Promise<WordPressPage | null> => {
  try {
    const response = await wordpressApi.get<WordPressPage[]>('/pages', {
      params: {
        slug,
        _embed: true, // Include featured media and author data
      },
    });
    return response.data?.[0] || null;
  } catch (error) {
    console.error(`Error fetching page with slug ${slug}:`, error);
    throw error;
  }
};

export const fetchMedia = async (mediaId: number) => {
  try {
    const response = await wordpressApi.get(`/media/${mediaId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching media ${mediaId}:`, error);
    throw error;
  }
};

// Add more API functions as needed

export default wordpressApi;
