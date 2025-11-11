import { useState, useEffect } from 'react';
import wordpressApi from "@/lib/wordpress/api";

export interface WebHostingPlan {
  title: string;
  price: string;
  period: string;
  features: string[];
  popular: boolean;
}

export interface WebHostingData {
  page_title: string;
  page_description: string;
  plans: WebHostingPlan[];
  sub_title_1: string;
  sub_description_1: string;
  bullet_points_1: string[];
  sub_title_2: string;
  sub_description_2: string;
  bullet_points_2: string[];
  sub_title_3: string;
  sub_description_3: string;
  bullet_points_3: string[];
  sub_title_4: string;
  sub_description_4: string;
  bullet_points_4: string[];
  sub_title_5: string;
  sub_description_5: string;
  bullet_points_5: string[];
}

export const useWebHostingData = () => {
  const [data, setData] = useState<WebHostingData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Fetching Web Hosting Plans page data...');
        
        const pageResponse = await wordpressApi.get('/pages', {
          params: {
            slug: 'web-hosting-plans',
            _embed: true,
            acf_format: 'standard',
            _fields: 'acf,title,content,featured_media,_links'
          }
        });

        const pageData = pageResponse.data?.[0];
        console.log('Page data:', pageData);

        if (!pageData) {
          console.error('Web Hosting Plans page not found. Tried slug: web-hosting-plans');
          const allPages = await wordpressApi.get('/pages');
          console.log('Available pages:', allPages.data.map((p: any) => ({ id: p.id, slug: p.slug, title: p.title.rendered })));
          throw new Error('Web Hosting Plans page not found. Please check if the page with slug "web-hosting-plans" exists in WordPress.');
        }

        const acfData = pageData.acf || {};
        console.log('ACF data:', acfData);

        // Process bullet points from text area to array
        const processBulletPoints = (points: string): string[] => {
          if (!points) return [];
          return points.split('\n').filter(Boolean);
        };

        // Get plans from the numbered sections in ACF
        const wordpressPlans: WebHostingPlan[] = [];
        const planTitles = [
          'Basic',
          'Standard',
          'Value',
          'Premium',
          'Business'
        ];

        // Process each plan section (1-5)
        for (let i = 1; i <= 5; i++) {
          const title = planTitles[i - 1];
          const sectionTitle = acfData[`sub_title_${i}`];
          const description = acfData[`sub_description_${i}`] || '';
          const featuresText = acfData[`bullet_points_${i}`] || '';
          
          // Extract price from section title if it's in the format "Plan Name (K100)"
          let planTitle = sectionTitle || title;
          let price = '';
          const priceMatch = planTitle?.match(/\(K(\d+)\)/);
          
          if (priceMatch) {
            price = `K${priceMatch[1]}`;
            planTitle = planTitle.replace(/\(K\d+\)/, '').trim();
          } else if (i === 1) {
            // Default prices if not in title
            const defaultPrices = ['K55', 'K110', 'K220', 'K440', 'K880'];
            price = defaultPrices[i - 1];
          }
          
          const features = [
            ...processBulletPoints(description),
            ...processBulletPoints(featuresText)
          ];
          
          if (planTitle) {
            wordpressPlans.push({
              title: planTitle,
              price: price,
              period: '/month (excluding GST)',
              features: features,
              popular: i === 3 // Mark 'Value' plan as popular
            });
            
            console.log(`Added plan ${i}:`, { 
              title: planTitle, 
              price, 
              features 
            });
          }
        }
        
        console.log('All processed plans:', wordpressPlans);
        
        // Only use default plans if no WordPress plans are found
        const plans = wordpressPlans.length > 0 ? wordpressPlans : getDefaultPlans();

        const processedData: WebHostingData = {
          page_title: acfData.page_title || 'Web Hosting',
          page_description: acfData.page_description || 'Plans',
          plans: plans.length > 0 ? plans : getDefaultPlans(),
          
          // Additional content sections
          sub_title_1: acfData.sub_title_1 || '',
          sub_description_1: acfData.sub_description_1 || '',
          bullet_points_1: processBulletPoints(acfData.bullet_points_1 || ''),
          
          sub_title_2: acfData.sub_title_2 || '',
          sub_description_2: acfData.sub_description_2 || '',
          bullet_points_2: processBulletPoints(acfData.bullet_points_2 || ''),
          
          sub_title_3: acfData.sub_title_3 || '',
          sub_description_3: acfData.sub_description_3 || '',
          bullet_points_3: processBulletPoints(acfData.bullet_points_3 || ''),
          
          sub_title_4: acfData.sub_title_4 || '',
          sub_description_4: acfData.sub_description_4 || '',
          bullet_points_4: processBulletPoints(acfData.bullet_points_4 || ''),
          
          sub_title_5: acfData.sub_title_5 || '',
          sub_description_5: acfData.sub_description_5 || '',
          bullet_points_5: processBulletPoints(acfData.bullet_points_5 || '')
        };

        setData(processedData);
      } catch (err) {
        console.error('Error fetching web hosting plans data:', err);
        setError('Failed to load web hosting plans content. Please try again later.');
        // Fall back to default data
        setData({
          ...defaultWebHostingData,
          page_title: 'Web Hosting',
          page_description: 'Plans'
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, isLoading, error };
};

// Helper function to create default plans
const getDefaultPlans = (): WebHostingPlan[] => {
  return [
    {
      title: 'Basic',
      price: 'K55',
      period: '/month',
      features: [
        '1 domain / 1 website',
        '7 POP3 email accounts',
        '200MB disk space per mailbox',
        '2GB monthly traffic',
        '1 MySQL database',
        'No cPanel access'
      ],
      popular: false
    },
    {
      title: 'Standard',
      price: 'K110',
      period: '/month',
      features: [
        '3 domains / 3 websites',
        '15 POP3 email accounts',
        '400MB disk space per mailbox',
        '4GB monthly traffic',
        '2 MySQL databases',
        'No cPanel access'
      ],
      popular: false
    },
    {
      title: 'Value',
      price: 'K220',
      period: '/month',
      features: [
        '7 domains / 7 websites',
        '30 POP3 email accounts',
        '1GB disk space per mailbox',
        '10GB monthly traffic',
        '5 MySQL databases',
        'With cPanel access'
      ],
      popular: true
    },
    {
      title: 'Premium',
      price: 'K440',
      period: '/month',
      features: [
        'Unlimited domains/websites',
        'Unlimited email accounts',
        '2GB disk space per mailbox',
        '30GB monthly traffic',
        'Unlimited MySQL databases',
        'With cPanel access',
        'Free SSL certificate'
      ],
      popular: false
    },
    {
      title: 'Business',
      price: 'K880',
      period: '/month',
      features: [
        'Unlimited domains/websites',
        'Unlimited email accounts',
        '5GB disk space per mailbox',
        'Unmetered traffic',
        'Unlimited MySQL databases',
        'With cPanel access',
        'Free SSL certificate',
        'Dedicated IP',
        'Priority support'
      ],
      popular: false
    }
  ];
};

export const defaultWebHostingData: WebHostingData = {
  page_title: 'Web Hosting',
  page_description: 'Plans',
  plans: getDefaultPlans(),
  
  // Default empty sections
  sub_title_1: '',
  sub_description_1: '',
  bullet_points_1: [],
  
  sub_title_2: '',
  sub_description_2: '',
  bullet_points_2: [],
  
  sub_title_3: '',
  sub_description_3: '',
  bullet_points_3: [],
  
  sub_title_4: '',
  sub_description_4: '',
  bullet_points_4: [],
  
  sub_title_5: '',
  sub_description_5: '',
  bullet_points_5: []
};
