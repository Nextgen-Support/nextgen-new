import { useState, useEffect } from 'react';
import wordpressApi from "@/lib/wordpress/api";

export interface Solution {
  title: string;
  description: string;
  image: string;
  link: string;
}

export const useSolutionsData = () => {
  const [solutions, setSolutions] = useState<Solution[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSolutions = async () => {
      try {
        // console.log('Starting to fetch solutions from WordPress...');
        
        // First, try to get the page ID of the homepage
        // console.log('Fetching pages to find the home page...');
        const pagesResponse = await wordpressApi.get('/pages', {
          params: {
            _fields: 'id,slug',
            slug: 'home',
            _embed: true
          }
        });
        
        const homePage = pagesResponse.data?.[0];
        
        if (!homePage) {
          throw new Error('Home page not found. Make sure you have a page with slug "home" in WordPress.');
        }
        
        // console.log('Home page found with ID:', homePage.id);
        
        // Get the page with ACF data using the page_by_slug endpoint
        // console.log(`Fetching page with ACF data for ID: ${homePage.id}...`);
        
        // Try to get the 'our-solutions' page first, then fallback to home page
        let pageWithAcf = null;
        
        // First try the 'our-solutions' page
        try {
          const solutionsPageRes = await wordpressApi.get(`/pages`, {
            params: {
              slug: 'our-solutions',
              _embed: true,
              acf_format: 'standard'
            }
          });
          
          const solutionsPage = solutionsPageRes.data?.[0];
          // console.log('Our Solutions page data:', solutionsPage);
          
          if (solutionsPage?.acf) {
            pageWithAcf = solutionsPage;
          }
        } catch (error) {
          console.warn('Error fetching our-solutions page:', error);
        }
        
        // If 'our-solutions' page doesn't have ACF data, try the home page
        if (!pageWithAcf) {
          try {
            const homePageRes = await wordpressApi.get(`/pages`, {
              params: {
                slug: 'home',
                _embed: true,
                acf_format: 'standard'
              }
            });
            
            const homePage = homePageRes.data?.[0];
            console.log('Home page data:', homePage);
            
            if (homePage?.acf) {
              pageWithAcf = homePage;
            }
          } catch (error) {
            console.warn('Error fetching home page:', error);
          }
        }
        
        if (!pageWithAcf) {
          throw new Error('Could not find a page with the required ACF fields');
        }

        // console.log('Using page with ACF fields:', pageWithAcf.slug);
        const pageResponse = { data: pageWithAcf };
        
        const pageData = pageResponse.data;
        // console.log('Page data received:', pageData);
        
        // Get ACF data - check both possible locations
        let acfData = pageData.acf || (pageResponse.data?.acf_fields);
        
        // If we still don't have ACF data, try to get it from _embedded
        if (!acfData && pageData._embedded && pageData._embedded.self && pageData._embedded.self[0]?.acf) {
          acfData = pageData._embedded.self[0].acf;
        }
        
        if (!acfData) {
          console.error('No ACF data found in page response or _embedded');
          // console.log('Available page data keys:', Object.keys(pageData));
          setSolutions(getDefaultSolutions());
          return;
        }
        
        // console.log('ACF Fields:', acfData);
        
        const fetchedSolutions: Solution[] = [];
        
        // Process each solution (3 solutions as per your ACF fields)
        const solutionFields = [
          { title: 'title1', subtitle: 'sub_title1', image: 'image1' },
          { title: 'title2', subtitle: 'sub_title2', image: 'image2' },
          { title: 'title3', subtitle: 'sub_title3', image: 'image3' }
        ];

        solutionFields.forEach((fields, index) => {
          const title = acfData[fields.title];
          const subtitle = acfData[fields.subtitle];
          const imageUrl = acfData[fields.image];
          
          // console.log(`Solution ${index + 1} data:`, { 
          //   title, 
          //   subtitle, 
          //   imageUrl,
          //   'allFields': Object.keys(acfData).filter(k => k.includes('title') || k.includes('sub') || k.includes('image'))
          // });
          
          // Add solution if we have either a title or image
          if (title || imageUrl) {
            fetchedSolutions.push({
              title: title || `Solution ${index + 1}`,
              description: subtitle || '',
              image: imageUrl || '',
              link: title ? `/services/${title.toLowerCase().replace(/\s+/g, '-')}` : `#solution-${index + 1}`
            });
          }
        },); // Added a comma here
        
        // Fallback to default solutions if none found
        if (fetchedSolutions.length === 0) {
          console.warn('No solutions found in ACF data, using fallback content');
          setSolutions(getDefaultSolutions());
        } else {
          setSolutions(fetchedSolutions);
        }
        
      } catch (error) {
        console.error('Error fetching solutions:', error);
        setError('Failed to load solutions. Using default content.');
        setSolutions(getDefaultSolutions());
      } finally {
        setIsLoading(false);
      }
    };

    fetchSolutions();
  }, []);

  return { solutions, isLoading, error };
};

// Default solutions data
const getDefaultSolutions = (): Solution[] => [
  {
    title: 'Document Management',
    description: 'Efficient and secure document handling solutions',
    image: '/asset/image/dokmee.png',
    link: '/services/document-management',
  },
  {
    title: 'CCTV Solutions',
    description: 'Advanced surveillance and security camera systems',
    image: '/asset/image/cctv1.jpg',
    link: '/services/cctv',
  },
  {
    title: 'Web & Domain Hosting',
    description: 'Reliable web hosting and domain registration',
    image: '/asset/image/domain.png',
    link: '/services/web-hosting',
  }
];
