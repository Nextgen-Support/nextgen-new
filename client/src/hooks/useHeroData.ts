import { useEffect, useState } from 'react';
import { WordPressPage } from '../lib/wordpress/api';
import { fetchPageBySlug } from '../lib/wordpress/api';

export interface HeroData {
  title: string;
  subtitle: string;
  videoUrl: string;
  fallbackImage: string;
}

export const useHeroData = () => {
  const [heroData, setHeroData] = useState<HeroData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchHeroData = async () => {
      try {
        // console.log('Fetching hero data from:', import.meta.env.VITE_WORDPRESS_REST_API_URL);
        
        // First, let's verify the API is accessible
        const testResponse = await fetch(`${import.meta.env.VITE_WORDPRESS_REST_API_URL}/pages?slug=home&_fields=id,title,acf`);
        const testData = await testResponse.json();
        // console.log('Test API Response:', testData);
        
        // Fetch the actual page data
        const page = await fetchPageBySlug('home');
        // console.log('Full API Response:', JSON.stringify(page, null, 2));
        
        if (!page) {
          console.error('No page found with slug "home"');
          setError(new Error('Home page not found'));
          return;
        }
        
        if (page.acf) {
          // console.log('ACF Fields:', page.acf);
          setHeroData({
            title: page.acf.title || page.title?.rendered || 'Welcome to NextGen',
            subtitle: page.acf.sub_title || 'Innovative Solutions for Tomorrow',
            videoUrl: page.acf.background_video || '/asset/videos/banner.mp4',
            fallbackImage: '/asset/image/bg.png'
          });
        } else {
          console.warn('No ACF data found in the response. Available page data:', {
            id: page.id,
            title: page.title?.rendered,
            availableFields: Object.keys(page)
          });
          
          // Fallback to using page title if ACF is not available
          setHeroData({
            title: page.title?.rendered || 'Welcome to NextGen',
            subtitle: 'Innovative Solutions for Tomorrow',
            videoUrl: '/asset/videos/banner.mp4',
            fallbackImage: '/asset/image/bg.png'
          });
        }
      } catch (err) {
        console.error('Error fetching hero data:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch hero data'));
      } finally {
        setLoading(false);
      }
    };

    fetchHeroData();
  }, []);

  return { heroData, loading, error };
};
