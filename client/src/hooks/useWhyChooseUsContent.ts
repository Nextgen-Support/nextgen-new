import { useEffect, useState, useCallback } from 'react';
import { WordPressPage, fetchPageBySlug } from '@/lib/wordpress/api';

interface ACFImage {
  url: string;
  alt: string;
  width?: number;
  height?: number;
  [key: string]: any;
}

interface ACFFields {
  // Main content fields
  why_choose_us_title?: string;
  why_choose_us_subtitle?: string;
  
  // Alternative field names for flexibility
  title?: string;
  subtitle?: string;
  sub_title?: string;
  
  // Image fields
  why_choose_us_image?: ACFImage;
  image?: ACFImage;
  featured_image?: ACFImage;
  
  // Additional fields that might be used in the future
  [key: string]: any;
}

interface WhyChooseUsContent {
  title: string;
  subtitle: string;
  imageUrl: string;
  imageAlt: string;
  isLoading: boolean;
  error: Error | null;
  lastUpdated: Date | null;
}

const DEFAULT_IMAGE = '/asset/image/team.png';
const DEFAULT_TITLE = 'Why Choose Us';

export const useWhyChooseUsContent = (pageSlug = 'why-choose-us'): WhyChooseUsContent => {
  const [state, setState] = useState<Omit<WhyChooseUsContent, 'isLoading' | 'error' | 'lastUpdated'>>({ 
    title: DEFAULT_TITLE,
    subtitle: '',
    imageUrl: DEFAULT_IMAGE,
    imageAlt: DEFAULT_TITLE
  });
  
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const processContent = useCallback((page: WordPressPage) => {
    if (!page) {
      throw new Error('No page data received');
    }

    const acf: ACFFields = (page.acf || {}) as ACFFields;
    
    // Get title with fallbacks
    const title = acf.why_choose_us_title || 
                 acf.title || 
                 page.title?.rendered || 
                 DEFAULT_TITLE;
    
    // Get subtitle with fallbacks
    const subtitle = acf.why_choose_us_subtitle || 
                    acf.subtitle || 
                    acf.sub_title || 
                    '';
    
    // Get image with fallbacks
    const image = acf.why_choose_us_image || 
                 acf.image || 
                 acf.featured_image || 
                 { url: DEFAULT_IMAGE, alt: DEFAULT_TITLE };
    
    // Ensure HTTPS for the image URL
    const imageUrl = image?.url ? 
                    image.url.replace(/^http:/, 'https:') : 
                    DEFAULT_IMAGE;
    
    return {
      title: title.trim(),
      subtitle: subtitle.trim(),
      imageUrl,
      imageAlt: image?.alt || title.trim() || DEFAULT_TITLE,
    };
  }, []);

  useEffect(() => {
    const fetchContent = async () => {
      if (!pageSlug) return;
      
      try {
        setIsLoading(true);
        setError(null);
        
        const page = await fetchPageBySlug(pageSlug);
        
        if (!page) {
          throw new Error(`Page with slug "${pageSlug}" not found`);
        }
        
        const newState = processContent(page);
        setState(newState);
        setLastUpdated(new Date());
        
      } catch (err) {
        console.error('Error in useWhyChooseUsContent:', err);
        setError(err instanceof Error ? err : new Error('Failed to load content'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchContent();
  }, [pageSlug, processContent]);

  return { 
    ...state, 
    isLoading, 
    error,
    lastUpdated
  };
};

export default useWhyChooseUsContent;
