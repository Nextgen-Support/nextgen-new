import axios, { AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios';

// Base WordPress URL - update this to match your WordPress installation
const WORDPRESS_BASE_URL = 'http://localhost/wp-cms';
const WORDPRESS_API_URL = `${WORDPRESS_BASE_URL}/wp-json`;
const WORDPRESS_REST_API_URL = `${WORDPRESS_API_URL}/wp/v2`;
const WORDPRESS_ACF_API_URL = `${WORDPRESS_API_URL}/acf/v3`;

// Add debug logs to show the API URLs being used
console.log('WordPress API Configuration:', {
  baseURL: WORDPRESS_BASE_URL,
  apiURL: WORDPRESS_API_URL,
  restURL: WORDPRESS_REST_API_URL,
  acfURL: WORDPRESS_ACF_API_URL
});

// Types
export interface WordPressMedia {
  id: number;
  source_url: string;
  alt_text: string;
  media_type: 'image' | 'video';
  mime_type: string;
}

interface WordPressACFFields {
  title?: string;
  sub_title?: string;
  background_video?: string;
  why_choose_us_title?: string;
  why_choose_us_subtitle?: string;
  why_choose_us_image?: number;
  why_choose_us_items?: string[];
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

export interface WhyChooseUsData {
  title: string;
  subtitle: string;
  imageUrl: string;
  items: string[];
}

export async function fetchWhyChooseUsData(): Promise<WhyChooseUsData | null> {
  try {
    console.log('Fetching Why Choose Us data...');
    
    // Define possible endpoints to try
    const endpoints = [
      // Try ACF options first
      { 
        url: `${WORDPRESS_ACF_API_URL}/options/options`,
        type: 'acf_options' as const,
        processor: (data: any) => data.acf || data
      },
      // Try pages endpoint
      { 
        url: `${WORDPRESS_REST_API_URL}/pages?slug=why-choose-us&_fields=acf,title,content,featured_media,_links&_embed`,
        type: 'page_by_slug' as const,
        processor: (data: any) => Array.isArray(data) ? data[0] : null
      },
      // Try home page as fallback
      { 
        url: `${WORDPRESS_REST_API_URL}/pages/42?_fields=acf,title,content,featured_media,_links&_embed`,
        type: 'home_page' as const,
        processor: (data: any) => Array.isArray(data) ? data[0] : data
      }
    ];

    let acfData: Record<string, any> | null = null;

    // Try each endpoint until we find the data
    for (const endpoint of endpoints) {
      try {
        console.log(`Trying endpoint: ${endpoint.url}`);
        const response = await axios.get(endpoint.url);
        
        if (response.data) {
          const responseData = endpoint.processor ? endpoint.processor(response.data) : response.data;
          
          // Handle different response formats
          if (responseData?.acf || responseData?.title) {
            acfData = {
              ...(responseData.acf || {}),
              title: responseData.acf?.title || responseData.title?.rendered || responseData.title,
              content: responseData.acf?.content || responseData.content?.rendered || responseData.content,
              sub_title: responseData.acf?.sub_title || responseData.sub_title,
              image: responseData.acf?.image || responseData.featured_media,
              items: responseData.acf?.items || []
            };
            console.log(`✅ Found data in ${endpoint.type} endpoint`);
            break;
          }
        }
      } catch (error) {
        console.error(`Error fetching from ${endpoint.type}:`, error);
        continue;
      }
    }

    if (!acfData) {
      console.error('No ACF data found in any endpoint');
      return null;
    }

    console.log('ACF Data found:', acfData);

    // Extract the data we need
    const title = acfData.title || 'Why Choose Us';
    const subtitle = acfData.sub_title || '';
    
    // Handle image - try different possible field names
    let imageUrl = '';
    const possibleImageFields = ['image', 'why_choose_us_image', 'featured_media'];
    
    for (const field of possibleImageFields) {
      if (!acfData[field]) continue;
      
      // Case 1: Direct URL string
      if (typeof acfData[field] === 'string') {
        if (acfData[field].match(/\.(jpg|jpeg|png|gif)$/i)) {
          imageUrl = acfData[field];
          console.log(`Found image URL in field '${field}':`, imageUrl);
          break;
        }
      }
      // Case 2: Media object with URL
      else if (acfData[field].url) {
        imageUrl = acfData[field].url;
        console.log(`Found image URL in field '${field}.url':`, imageUrl);
        break;
      }
      // Case 3: ACF image field with sizes
      else if (acfData[field].sizes) {
        if (acfData[field].sizes.large) {
          imageUrl = acfData[field].sizes.large;
        } else if (acfData[field].sizes.medium) {
          imageUrl = acfData[field].sizes.medium;
        } else if (acfData[field].sizes.full) {
          imageUrl = acfData[field].sizes.full;
        }
        if (imageUrl) {
          console.log(`Found image URL in field '${field}.sizes':`, imageUrl);
          break;
        }
      }
      // Case 4: Media ID (featured_media)
      else if (Number.isInteger(acfData[field])) {
        try {
          const mediaId = acfData[field];
          console.log(`Found media ID in field '${field}':`, mediaId);
          const mediaResponse = await axios.get(`${WORDPRESS_REST_API_URL}/media/${mediaId}`);
          if (mediaResponse.data?.source_url) {
            imageUrl = mediaResponse.data.source_url;
            console.log(`Found image URL from media ID ${mediaId}:`, imageUrl);
            break;
          }
        } catch (mediaError) {
          console.error('Error fetching media:', mediaError);
        }
      }
    }

    // Ensure image URL is absolute
    if (imageUrl && !imageUrl.startsWith('http') && !imageUrl.startsWith('//')) {
      const base = WORDPRESS_BASE_URL.endsWith('/') 
        ? WORDPRESS_BASE_URL.slice(0, -1) 
        : WORDPRESS_BASE_URL;
      imageUrl = `${base}${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`;
      console.log('Converted to absolute URL:', imageUrl);
    }

    // Handle items - could be an array or a string with newlines
    let items: string[] = [];
    if (Array.isArray(acfData.items)) {
      items = acfData.items;
    } else if (acfData.items && typeof acfData.items === 'string') {
      items = acfData.items.split('\n').filter(Boolean).map((s: string) => s.trim());
    }

    return {
      title,
      subtitle,
      imageUrl: imageUrl || '/asset/image/team.png',
      items
    };
  } catch (error) {
    console.error('Error fetching Why Choose Us data:', error);
    return null;
  }
}

export default wordpressApi;
