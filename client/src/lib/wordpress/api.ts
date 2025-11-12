import axios, { AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios';

// WordPress API configuration from environment variables
const WORDPRESS_BASE_URL = import.meta.env.VITE_WORDPRESS_API_URL || '';
const WORDPRESS_REST_API_URL = import.meta.env.VITE_WORDPRESS_REST_API_URL || '';
const WORDPRESS_API_URL = WORDPRESS_REST_API_URL.replace('/wp/v2', '') || '';
const WORDPRESS_ACF_API_URL = WORDPRESS_API_URL ? `${WORDPRESS_API_URL}/acf/v3` : '';

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

export interface TeamMemberACF {
  name: string;
  role: string;
  image: number; // WordPress media ID
  description: string;
}

interface WordPressACFFields {
  // General fields
  title?: string;
  sub_title?: string;
  background_video?: string;
  
  // Why Choose Us section
  why_choose_us_title?: string;
  why_choose_us_subtitle?: string;
  why_choose_us_image?: number;
  why_choose_us_items?: string[];
  
  // Team section
  team_members?: TeamMemberACF[];
  
  // Solutions section
  title1?: string;
  sub_title1?: string;
  image1?: string;
  title2?: string;
  sub_title2?: string;
  image2?: string;
  title3?: string;
  sub_title3?: string;
  image3?: string;
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

/**
 * Fetches a WordPress page by its slug with ACF fields
 * @param slug The page slug to fetch
 * @param includeAcf Whether to include ACF fields (default: true)
 */
export const fetchPageBySlug = async (slug: string, includeAcf: boolean = true): Promise<WordPressPage | null> => {
  try {
    // First try the regular WP REST API with ACF fields
    const response = await wordpressApi.get<WordPressPage[]>('/pages', {
      params: {
        slug,
        _embed: true, // Include featured media and author data
        ...(includeAcf && { acf_format: 'standard' }), // Include ACF fields
      },
    });

    const page = response.data?.[0];
    if (!page) return null;

    // If ACF data is missing, try fetching it separately
    if (includeAcf && !page.acf) {
      try {
        const acfResponse = await axios.get(`${WORDPRESS_ACF_API_URL}/pages/${page.id}`);
        page.acf = acfResponse.data?.acf;
      } catch (acfError) {
        console.warn('Could not fetch ACF data separately:', acfError);
      }
    }

    return page;
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

// Fetch team members from WordPress
interface TeamMemberResponse {
  id: number;
  acf: TeamMemberACF;
  _embedded?: {
    'wp:featuredmedia'?: Array<{
      source_url: string;
      alt_text: string;
    }>;
  };
}

interface TeamMember {
  name: string;
  role: string;
  image: string;
  description: string;
}

export interface TeamImageData {
  imageUrl: string;
  title?: string;
  description?: string;
}

export async function fetchTeamImage(): Promise<TeamImageData | null> {
  try {
    console.log('Fetching Team Image data...');
    
    // Define the specific ACF field we're looking for
    // The field is named 'team' in the 'Team' field group with return format as image URL
    const acfFieldName = 'team';
    
    // Define possible endpoints to try
    const endpoints = [
      // Try ACF options first - this is where the Team field group might be stored
      { 
        url: `${WORDPRESS_ACF_API_URL}/options/options`,
        type: 'acf_options' as const,
        processor: (data: any) => {
          // Try to get the team field directly
          if (data.acf?.[acfFieldName]) {
            return { 
              acf: { 
                [acfFieldName]: data.acf[acfFieldName] 
              } 
            };
          }
          return data.acf || data;
        }
      },
      // Try team page specifically
      { 
        url: `${WORDPRESS_REST_API_URL}/pages?slug=team&_fields=acf,title,content,featured_media,_links&_embed`,
        type: 'page_by_slug' as const,
        processor: (data: any) => {
          const page = Array.isArray(data) ? data[0] : data;
          // The team field is directly under acf.team (not nested)
          if (page?.acf?.[acfFieldName]) {
            return { 
              ...page, 
              acf: { 
                ...page.acf,
                [acfFieldName]: page.acf[acfFieldName]
              } 
            };
          }
          return page;
        }
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
            // The team image is directly in responseData.acf.team (not nested under image)
            const teamImage = responseData.acf?.[acfFieldName];
            console.log('Team image from ACF:', teamImage);
            
            acfData = {
              ...(responseData.acf || {}),
              title: responseData.title?.rendered || responseData.title,
              content: responseData.content?.rendered || responseData.content,
              image: teamImage || responseData.acf?.image || responseData.featured_media,
              _embedded: responseData._embedded
            };
            
            console.log('Processed ACF data:', acfData);
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
      console.error('No ACF data found in any endpoint for team image');
      return null;
    }

    console.log('Team Image ACF Data found:', acfData);

    // Handle image - try different possible field names and paths
    let imageUrl = '';
    
    // Debug: Log the full ACF data structure
    console.log('Full ACF Data Structure:', JSON.stringify(acfData, null, 2));
    
    // Try to get the image from various possible nested structures
    const possiblePaths = [
      // Try direct access first
      () => acfData.team?.image,
      () => acfData.acf?.team?.image,
      () => acfData.team_image,
      () => acfData.acf?.team_image,
      () => acfData.image,
      () => acfData.acf?.image,
      // Try embedded media
      () => acfData._embedded?.['wp:featuredmedia']?.[0]?.source_url,
      () => acfData.featured_media_url
    ];

    for (const getImage of possiblePaths) {
      try {
        const image = getImage();
        if (!image) continue;
        
        console.log('Checking image path:', getImage.toString(), 'Value:', image);
        
        // Handle different image formats
        if (typeof image === 'string') {
          if (image.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
            imageUrl = image;
            console.log('Found direct image URL:', imageUrl);
            break;
          }
        } 
        // Handle ACF image object
        else if (image.url) {
          imageUrl = image.url;
          console.log('Found image URL in object:', imageUrl);
          break;
        }
        // Handle ACF image with sizes
        else if (image.sizes) {
          if (image.sizes.large) {
            imageUrl = image.sizes.large;
          } else if (image.sizes.medium) {
            imageUrl = image.sizes.medium;
          } else if (image.sizes.full) {
            imageUrl = image.sizes.full;
          }
          if (imageUrl) {
            console.log('Found image in sizes:', imageUrl);
            break;
          }
        }
        // Handle media ID
        else if (Number.isInteger(image)) {
          try {
            const mediaId = image;
            console.log('Found media ID:', mediaId);
            const mediaResponse = await axios.get(`${WORDPRESS_REST_API_URL}/media/${mediaId}`);
            if (mediaResponse.data?.source_url) {
              imageUrl = mediaResponse.data.source_url;
              console.log('Resolved media ID to URL:', imageUrl);
              break;
            }
          } catch (mediaError) {
            console.error('Error fetching media:', mediaError);
          }
        }
      } catch (e) {
        console.error('Error checking image path:', e);
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

    // If no image found in ACF, try embedded media
    if (!imageUrl && acfData._embedded?.['wp:featuredmedia']?.[0]?.source_url) {
      imageUrl = acfData._embedded['wp:featuredmedia'][0].source_url;
      console.log('Using embedded featured media:', imageUrl);
    }

    return {
      imageUrl: imageUrl || '/asset/image/team2.png',
      title: acfData.title,
      description: acfData.content
    };
  } catch (error) {
    console.error('Error fetching Team Image data:', error);
    return null;
  }
}

export async function fetchTeamMembers(): Promise<TeamMember[]> {
  try {
    // First, fetch the page that contains the team members
    const response = await wordpressApi.get<WordPressPage[]>('/pages', {
      params: {
        slug: 'about', // Assuming team members are stored in the 'about' page
        _embed: true,
        acf_format: 'standard',
      },
    });

    const page = response.data[0];
    if (!page || !page.acf?.team_members) {
      console.warn('No team members found in the about page');
      return [];
    }

    // Process team members and fetch their media
    const teamMembers = await Promise.all(
      page.acf.team_members.map(async (member) => {
        let imageUrl = '';
        
        // If there's a featured image for the team member
        if (member.image) {
          try {
            const mediaResponse = await wordpressApi.get<WordPressMedia>(
              `/media/${member.image}`
            );
            imageUrl = mediaResponse.data.source_url;
          } catch (error) {
            console.error(`Error fetching media ${member.image}:`, error);
          }
        }

        return {
          name: member.name,
          role: member.role,
          image: imageUrl,
          description: member.description,
        };
      })
    );

    return teamMembers;
  } catch (error) {
    console.error('Error fetching team members:', error);
    return [];
  }
}

export default wordpressApi;
