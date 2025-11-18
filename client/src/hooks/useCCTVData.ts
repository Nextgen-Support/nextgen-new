import { useState, useEffect } from 'react';
import wordpressApi from "@/lib/wordpress/api";

export interface CCTVData {
  page_title: string;
  page_description: string;
  sub_title_1: string;
  sub_description_1: string;
  bullet_points_1: string[];
  image_1: {
    url: string;
    alt: string;
  };
  sub_title_2: string;
  sub_description_2: string;
  bullet_points_2: string[];
  image_2: {
    url: string;
    alt: string;
  };
  sub_title_3: string;
  sub_description_3: string;
  bullet_points_3: string[];
  image_3: {
    url: string;
    alt: string;
  };
}

export const useCCTVData = () => {
  const [data, setData] = useState<CCTVData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // console.log('Fetching CCTV Solutions page data...');
        
        const pageResponse = await wordpressApi.get('/pages', {
          params: {
            slug: 'advanced-cctv-security-solutions',
            _embed: true,
            acf_format: 'standard',
            _fields: 'acf,title,content,featured_media,_links'
          }
        });

        const pageData = pageResponse.data?.[0];
        // console.log('Page data:', pageData);

        if (!pageData) {
          console.error('CCTV Solutions page not found. Tried slug: advanced-cctv-security-solutions');
          const allPages = await wordpressApi.get('/pages');
          // console.log('Available pages:', allPages.data.map((p: any) => ({ id: p.id, slug: p.slug, title: p.title.rendered })));
          throw new Error('CCTV Solutions page not found. Please check if the page with slug "advanced-cctv-security-solutions" exists in WordPress.');
        }

        const acfData = pageData.acf || {};
        // console.log('ACF data:', acfData);

        const getImageUrl = (imageField: any) => {
          if (!imageField) return '';
          if (typeof imageField === 'string') return imageField;
          if (imageField.url) return imageField.url;
          if (imageField.sizes && imageField.sizes.large) return imageField.sizes.large;
          if (imageField.guid) return imageField.guid;
          return '';
        };

        const processedData: CCTVData = {
          page_title: acfData.page_title || 'Advanced CCTV',
          page_description: acfData.page_description || 'Security Solutions',
          
          sub_title_1: acfData.sub_title_1 || 'Holowits X Series HWT-X6741',
          sub_description_1: acfData.sub_description_1 || '4MP Super-low Light Full Control Dual Lens AI PTZ Dome Camera for 24/7 surveillance in any lighting condition.',
          bullet_points_1: acfData.bullet_points_1 ? acfData.bullet_points_1.split('\n').filter(Boolean) : [
            '4MP Ultra HD resolution',
            'Super-low light technology',
            'Dual lens AI PTZ control',
            'Weatherproof IP67 rated design'
          ],
          image_1: {
            url: getImageUrl(acfData.image_1) || '/asset/image/cctv1.jpg',
            alt: acfData.image_1?.alt || acfData.sub_title_1 || 'CCTV Camera 1'
          },
          
          sub_title_2: acfData.sub_title_2 || 'Smart Motion Detection',
          sub_description_2: acfData.sub_description_2 || 'Advanced algorithms that distinguish between relevant motion events and false alarms.',
          bullet_points_2: acfData.bullet_points_2 ? acfData.bullet_points_2.split('\n').filter(Boolean) : [
            'AI-powered detection',
            'Real-time alerts',
            'Customizable zones',
            'Reduced false alarms'
          ],
          image_2: {
            url: getImageUrl(acfData.image_2) || '/asset/image/cctv2.png',
            alt: acfData.image_2?.alt || acfData.sub_title_2 || 'CCTV Camera 2'
          },
          
          sub_title_3: acfData.sub_title_3 || 'Remote Monitoring',
          sub_description_3: acfData.sub_description_3 || 'Access your camera feeds from anywhere using your smartphone or computer.',
          bullet_points_3: acfData.bullet_points_3 ? acfData.bullet_points_3.split('\n').filter(Boolean) : [
            'Mobile app access',
            'Cloud storage options',
            'Multi-user access',
            'Secure encryption'
          ],
          image_3: {
            url: getImageUrl(acfData.image_3) || '/asset/image/cctv3.png',
            alt: acfData.image_3?.alt || acfData.sub_title_3 || 'CCTV Camera 3'
          }
        };

        setData(processedData);
      } catch (err) {
        console.error('Error fetching CCTV solutions data:', err);
        setError('Failed to load CCTV solutions content. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, isLoading, error };
};

export const defaultCCTVData: CCTVData = {
  page_title: 'Advanced CCTV',
  page_description: 'Security Solutions',
  
  sub_title_1: 'Holowits X Series HWT-X6741',
  sub_description_1: '4MP Super-low Light Full Control Dual Lens AI PTZ Dome Camera for 24/7 surveillance in any lighting condition.',
  bullet_points_1: [
    '4MP Ultra HD resolution',
    'Super-low light technology',
    'Dual lens AI PTZ control',
    'Weatherproof IP67 rated design'
  ],
  image_1: {
    url: '/asset/image/cctv1.jpg',
    alt: 'Holowits X Series HWT-X6741'
  },
  
  sub_title_2: 'Smart Motion Detection',
  sub_description_2: 'Advanced algorithms that distinguish between relevant motion events and false alarms.',
  bullet_points_2: [
    'AI-powered detection',
    'Real-time alerts',
    'Customizable zones',
    'Reduced false alarms'
  ],
  image_2: {
    url: '/asset/image/cctv2.png',
    alt: 'Smart Motion Detection'
  },
  
  sub_title_3: 'Remote Monitoring',
  sub_description_3: 'Access your camera feeds from anywhere using your smartphone or computer.',
  bullet_points_3: [
    'Mobile app access',
    'Cloud storage options',
    'Multi-user access',
    'Secure encryption'
  ],
  image_3: {
    url: '/asset/image/cctv3.png',
    alt: 'Remote Monitoring'
  }
};
