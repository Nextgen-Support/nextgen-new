import { useState, useEffect } from 'react';
import axios from 'axios';

// Create axios instance with base URL from environment variables
const wpApi = axios.create({
  baseURL: import.meta.env.VITE_WORDPRESS_REST_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a response interceptor for error handling
wpApi.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('WordPress API Error:', error);
    return Promise.reject(error);
  }
);

// Helper function to fetch page by slug
async function fetchPageBySlug(slug: string) {
  try {
    const response = await wpApi.get(`/pages?slug=${slug}&_embed`);
    return response.data?.[0] || null;
  } catch (error) {
    console.error('Error fetching page:', error);
    return null;
  }
}

interface HeroContent {
  title: string;
  subtitle: string;
  backgroundVideoUrl: string;
  isLoading: boolean;
  error: Error | null;
}

/**
 * Custom hook to fetch hero section content from WordPress with ACF support
 * @param pageSlug - The slug of the page to fetch content from (default: 'home')
 * @returns Object containing hero content, loading state, and error state
 */
export const useHeroContent = (pageSlug = 'home'): HeroContent => {
  const [state, setState] = useState<Omit<HeroContent, 'isLoading' | 'error'>>({ 
    title: 'NextGen Technology Limited',
    subtitle: 'Innovative IT Solutions for Your Business Growth',
    backgroundVideoUrl: ''
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchHeroContent = async () => {
      try {
        setIsLoading(true);
        
        // Fetch page data including ACF fields and featured media
        const page = await fetchPageBySlug(pageSlug);
        
        if (!page) {
          throw new Error(`Page with slug "${pageSlug}" not found`);
        }

        // Extract ACF fields with proper type checking
        const acf = page.acf || {};
        const heroTitle = typeof acf.hero_title === 'string' ? acf.hero_title : page.title.rendered;
        const heroSubtitle = typeof acf.hero_subtitle === 'string' ? acf.hero_subtitle : '';
        
        // Get background video URL from ACF or featured media
        let backgroundVideoUrl = '';
        
        // Check ACF video field first
        if (acf.background_video) {
          backgroundVideoUrl = typeof acf.background_video === 'string' 
            ? acf.background_video 
            : (acf.background_video as any)?.url || '';
        } 
        // Fallback to featured media if no ACF video
        else if (page._embedded?.['wp:featuredmedia']?.[0]?.source_url) {
          const media = page._embedded['wp:featuredmedia'][0];
          if (media.media_type === 'video' || media.mime_type?.startsWith('video/')) {
            backgroundVideoUrl = media.source_url;
          }
        }

        setState({
          title: heroTitle,
          subtitle: heroSubtitle,
          backgroundVideoUrl
        });
        
      } catch (err) {
        console.error('Error in useHeroContent:', err);
        setError(err instanceof Error ? err : new Error('Failed to load hero content'));
        
        // Fallback to default content on error
        if (pageSlug === 'home') {
          setState({
            title: 'NextGen Technology Limited',
            subtitle: 'Innovative IT Solutions for Your Business Growth',
            backgroundVideoUrl: ''
          });
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchHeroContent();
  }, [pageSlug]);

  return { 
    ...state,
    isLoading,
    error 
  };
};
