import { useState, useEffect } from 'react';
import wordpressApi from '../lib/wordpress/api';

export interface ProductCard {
  title: string;
  description: string;
  feature: string;
  bullets: string[];
  link: string;
  icon: string;
  color: string;
}

export interface OurProductsData {
  page_title: string;
  cards: ProductCard[];
  [key: string]: any;
}

// Default data in case the API fails
const defaultProductsData: OurProductsData = {
  page_title: 'Our Products',
  cards: [
    {
      title: 'CCTV Systems',
      description: 'High-definition surveillance systems for comprehensive security monitoring.',
      feature: '24/7 Monitoring',
      bullets: [
        'High-definition cameras',
        'Night vision',
        'Motion detection',
        'Remote access',
      ],
      link: '/products/cctv-systems',
      icon: '🎥',
      color: 'from-blue-600 to-blue-800',
    },
    {
      title: 'Networking',
      description: 'Enterprise-grade networking solutions for reliable connectivity.',
      feature: 'High-Speed',
      bullets: [
        'Enterprise routers',
        'Switches',
        'WiFi solutions',
        'Network security',
      ],
      link: '/products/networking',
      icon: '🌐',
      color: 'from-green-600 to-green-800',
    },
    {
      title: 'Security Systems',
      description: 'Advanced security solutions to protect your business assets.',
      feature: 'Complete Protection',
      bullets: [
        'Access control',
        'Alarm systems',
        'Video surveillance',
        '24/7 monitoring',
      ],
      link: '/products/security-systems',
      icon: '🔒',
      color: 'from-purple-600 to-purple-800',
    },
    {
      title: 'Storage Solutions',
      description: 'Scalable storage solutions for all your business needs.',
      feature: 'High Capacity',
      bullets: [
        'NAS systems',
        'SAN solutions',
        'Cloud storage',
        'Backup solutions',
      ],
      link: '/products/storage-solutions',
      icon: '💾',
      color: 'from-red-600 to-red-800',
    },
  ],
};

/**
 * Fetches and manages Our Products page data from WordPress
 * @returns {Object} An object containing products data, loading state, and error state
 */
export const useProducts = () => {
  const [data, setData] = useState<OurProductsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Fetching Our Products page data...');

        // Fetch the page by slug
        const pageResponse = await wordpressApi.get('/pages', {
          params: {
            slug: 'our-products',
            _embed: true,
            acf_format: 'standard',
            _fields: 'id,title,acf,content',
          },
        });

        const pageData = pageResponse.data?.[0];
        console.log('Page data:', pageData);

        if (!pageData) {
          console.warn('Our Products page not found, using default data');
          setData(defaultProductsData);
          setIsLoading(false);
          return;
        }

        const acfData = pageData.acf || {};
        console.log('ACF data:', acfData);

        // Process bullet points from text area to array
        const processBulletPoints = (points: string): string[] => {
          if (!points) return [];
          return points.split('\n').filter(Boolean);
        };

        // Process each card
        const cards: ProductCard[] = [];
        const cardConfigs = [
          { 
            prefix: 'card_1', 
            link: '/products/cctv-systems', 
            icon: '🎥', 
            color: 'from-blue-600 to-blue-800' 
          },
          { 
            prefix: 'card_2', 
            link: '/products/networking', 
            icon: '🌐', 
            color: 'from-green-600 to-green-800' 
          },
          { 
            prefix: 'card_3', 
            link: '/products/security-systems', 
            icon: '🔒', 
            color: 'from-purple-600 to-purple-800' 
          },
          { 
            prefix: 'card_4', 
            link: '/products/storage-solutions', 
            icon: '💾', 
            color: 'from-red-600 to-red-800' 
          },
        ];

        cardConfigs.forEach(({ prefix, link, icon, color }) => {
          const title = acfData[`${prefix}_title`];
          const description = acfData[`${prefix}_description`] || acfData[`${prefix}_decsription`]; // Handle typo
          const feature = acfData[`${prefix}_feature`];
          const bullets = acfData[`${prefix}_bullets`];

          if (title && description && feature && bullets) {
            cards.push({
              title,
              description,
              feature,
              bullets: processBulletPoints(bullets),
              link,
              icon,
              color,
            });
          } else {
            console.warn(`Incomplete data for ${prefix}. Missing fields:`, {
              title: !!title,
              description: !!description,
              feature: !!feature,
              bullets: !!bullets
            });
          }
        });

        console.log('Processed cards:', cards);

        // Create the final data object with fallbacks
        const processedData: OurProductsData = {
          page_title: acfData.page_title || 'Our Products',
          cards: cards.length > 0 ? cards : defaultProductsData.cards,
          ...acfData, // Include all ACF data for potential future use
        };

        setData(processedData);
      } catch (err) {
        console.error('Error fetching products data:', err);
        setError('Failed to load products. Please try again later.');
        setData(defaultProductsData);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return { 
    data: data || defaultProductsData, 
    isLoading, 
    error 
  };
};

export default useProducts;
