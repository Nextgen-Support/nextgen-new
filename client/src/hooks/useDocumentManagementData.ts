import { useState, useEffect } from 'react';
import wordpressApi from "@/lib/wordpress/api";

export interface DocumentManagementData {
  page_title: string;
  page_description: string;
  sub_title_1: string;
  sub_description_1: string;
  sub_points_1: string[];
  sub_image_1: {
    url: string;
    alt: string;
  };
  sub_title_2: string;
  sub_description_2: string;
  sub_points_2: string[];
  sub_image_2: {
    url: string;
    alt: string;
  };
}

export const useDocumentManagementData = () => {
  const [data, setData] = useState<DocumentManagementData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Fetching document management page data...');
        
        console.log('Fetching document management page...');
        
        // First try to get the document management page by slug
        const pageResponse = await wordpressApi.get('/pages', {
          params: {
            slug: 'document-management-solutions',
            _embed: true,
            acf_format: 'standard',
            _fields: 'acf,title,content,featured_media,_links'
          }
        });

        const pageData = pageResponse.data?.[0];
        console.log('Page data:', pageData);

        if (!pageData) {
          console.error('Document Management page not found. Tried slug: document-management-solutions');
          // List all pages to help with debugging
          const allPages = await wordpressApi.get('/pages');
          console.log('Available pages:', allPages.data.map((p: any) => ({ id: p.id, slug: p.slug, title: p.title.rendered })));
          throw new Error('Document Management page not found. Please check if the page with slug "document-management-solutions" exists in WordPress.');
        }

        // Get ACF data from the page
        const acfData = pageData.acf || {};
        console.log('ACF data:', acfData);

        // Helper function to get image URL from ACF field
        const getImageUrl = (imageField: any) => {
          if (!imageField) return '';
          // Check different possible ACF image field structures
          if (typeof imageField === 'string') return imageField; // Direct URL string
          if (imageField.url) return imageField.url; // ACF Image Object with url property
          if (imageField.sizes && imageField.sizes.large) return imageField.sizes.large; // ACF Image with sizes
          if (imageField.guid) return imageField.guid; // WordPress media object
          return '';
        };

        // Process the data to match our interface
        const processedData: DocumentManagementData = {
          page_title: acfData.page_title || 'Document',
          page_description: acfData.page_description || 'Management Solutions',
          sub_title_1: acfData.sub_title_1 || '',
          sub_description_1: acfData.sub_description_1 || '',
          sub_points_1: acfData.sub_points_1 ? acfData.sub_points_1.split('\n').filter(Boolean) : [],
          sub_image_1: {
            url: getImageUrl(acfData.sub_image_1) || '',
            alt: acfData.sub_image_1?.alt || acfData.sub_title_1 || 'Document Management Solution'
          },
          sub_title_2: acfData.sub_title_2 || '',
          sub_description_2: acfData.sub_description_2 || '',
          sub_points_2: acfData.sub_points_2 ? acfData.sub_points_2.split('\n').filter(Boolean) : [],
          sub_image_2: {
            url: getImageUrl(acfData.sub_image_2) || '',
            alt: acfData.sub_image_2?.alt || acfData.sub_title_2 || 'Document Management Solution'
          }
        };

        console.log('Processed data with images:', {
          sub_image_1: processedData.sub_image_1,
          sub_image_2: processedData.sub_image_2
        });

        setData(processedData);
      } catch (err) {
        console.error('Error fetching document management data:', err);
        setError('Failed to load document management content. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, isLoading, error };
};

// Default data in case of error
export const defaultDocumentManagementData: DocumentManagementData = {
  page_title: 'Document',
  page_description: 'Management Solutions',
  sub_title_1: 'Dokmee Document Management',
  sub_description_1: 'Enterprise-class document management solution designed to help businesses of all sizes efficiently capture, manage, and store documents while maintaining security and compliance.',
  sub_points_1: [
    'Secure cloud-based document storage',
    'Advanced OCR (Optical Character Recognition)',
    'Automated document capture and indexing',
    'Version control and audit trails'
  ],
  sub_image_1: {
    url: '/asset/image/dokmee.png',
    alt: 'Dokmee Document Management'
  },
  sub_title_2: 'Microsoft 365 Office',
  sub_description_2: 'Comprehensive productivity suite with powerful document management capabilities, seamlessly integrated with familiar Office applications.',
  sub_points_2: [
    'Cloud storage with OneDrive/SharePoint',
    'Real-time co-authoring',
    'Advanced security features',
    'Seamless Office integration'
  ],
  sub_image_2: {
    url: '/asset/image/office365.jpg',
    alt: 'Microsoft 365 Office'
  }
};
