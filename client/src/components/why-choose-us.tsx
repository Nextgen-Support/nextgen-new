import { CheckCircle } from "lucide-react";
import { motion, type Variants } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useEffect, useState } from "react";
import { fetchWhyChooseUsData } from "@/lib/wordpress/api";

interface WhyChooseUsData {
  title: string;
  subtitle: string;
  imageUrl: string;
  items: string[];
}

export function WhyChooseUsSection() {
  const [whyChooseUsData, setWhyChooseUsData] = useState<WhyChooseUsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await fetchWhyChooseUsData();
        if (data) {
          setWhyChooseUsData(data);
        } else {
          console.warn('No data returned from fetchWhyChooseUsData');
        }
      } catch (err: any) {
        console.error('Failed to fetch Why Choose Us data:', err);
        setError(err.message || 'Failed to load content. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Check if device is mobile
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  // Animation variants with mobile/desktop support
  const containerVariants: Variants = isMobile ? {
    hidden: { opacity: 1 },
    visible: { opacity: 1 }
  } : {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.5,
        ease: [0.16, 1, 0.3, 1]
      },
    },
  };

  const itemVariants: Variants = isMobile ? {
    hidden: { opacity: 1, x: 0 },
    visible: { opacity: 1, x: 0 }
  } : {
    hidden: { opacity: 0, x: -50 },
    visible: (i: number = 0) => ({
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.9,
        ease: [0.16, 1, 0.3, 1],
        delay: i * 0.15
      },
    }),
  };

  const imageVariants: Variants = isMobile ? {
    hidden: { opacity: 1, x: 0 },
    visible: { opacity: 1, x: 0 }
  } : {
    hidden: { opacity: 0, x: 100 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 1.2,
        ease: [0.16, 1, 0.3, 1],
        delay: 0.3
      },
    },
  };

  if (isLoading) {
    return (
      <section className="py-16 bg-white overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center h-64">
            <div className="animate-pulse text-gray-600">Loading content...</div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <div className="py-20 text-center">
        <div className="bg-red-50 p-4 rounded-lg inline-block">
          <h3 className="text-red-600 font-medium">Error loading content</h3>
          <p className="text-sm text-red-500 mt-1">{error}</p>
          <p className="text-sm text-gray-500 mt-2">Using default content instead.</p>
        </div>
      </div>
    );
  }


  // Fallback data in case API fails but no error is thrown
  const defaultData: WhyChooseUsData = {
    title: 'Why Choose Us',
    subtitle: 'Our commitment to excellence sets us apart',
    imageUrl: 'https://placehold.co/600x400/2563eb/white?text=Team',
    items: [
      'Innovation at core - stay ahead with future-ready solutions',
      'Tailored just for you - tech that fits your business',
      'Customer-first approach - we support you every step of the way',
      'Reliable & quality products - trusted by industry leaders',
    ]
  };

  // Use WordPress data if available, otherwise use default data
  const data = whyChooseUsData || defaultData;

  return (
    <section className="py-16 bg-white overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div 
          ref={ref}
          className="flex flex-col md:flex-row items-center gap-12"
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={containerVariants}
        >
          {/* Left side - Text content */}
          <motion.div 
            className="md:w-1/2"
            variants={containerVariants}
          >
            <motion.h2 
              className="text-3xl md:text-6xl font-bold text-gray-900 mb-4 md:mb-6"
              variants={itemVariants}
            >
              {data.title}
            </motion.h2>
            {data.subtitle && (
              <motion.p 
                className="text-lg text-gray-600 mb-6"
                variants={itemVariants}
              >
                {data.subtitle}
              </motion.p>
            )}
            <motion.div 
              className="w-16 md:w-20 h-1 bg-blue-600 mb-6 md:mb-8"
              variants={itemVariants}
            ></motion.div>

            <motion.ul 
              className="space-y-3 md:space-y-4 text-base md:text-2xl"
              variants={containerVariants}
            >
              {data.items.map((item, index) => (
                <motion.li 
                  key={index} 
                  className="flex items-start"
                  variants={itemVariants}
                  custom={index}
                >
                  <CheckCircle className="text-green-500 mt-1 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">{item}</span>
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>

          {/* Right side - Image */}
          <motion.div 
            className="md:w-1/2"
            variants={imageVariants}
          >
            <motion.div className="relative w-full h-full">
              <motion.div className="relative w-full h-full overflow-hidden rounded-lg bg-gray-100">
                <motion.img
                  src={data.imageUrl}
                  alt={data.title}
                  className="w-full h-auto object-cover rounded-lg"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  onError={(e) => {
                    console.error('Error loading image:', data.imageUrl);
                    e.currentTarget.src = 'https://placehold.co/600x400/2563eb/white?text=Team';
                    e.currentTarget.alt = 'Placeholder image';
                  }}
                  onLoad={() => console.log('Image loaded successfully:', data.imageUrl)}
                />
                {process.env.NODE_ENV === 'development' && (
                  <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                    {data.imageUrl.includes('http') ? 'Remote' : 'Local'} image
                  </div>
                )}
              </motion.div>
              {process.env.NODE_ENV === 'development' && (
                <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs p-1 rounded">
                  {data.imageUrl.includes('http') ? 'Remote' : 'Local'} image
                </div>
              )}
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

export default WhyChooseUsSection;
