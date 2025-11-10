import React from 'react';
import { useHeroContent } from '@/hooks/useHeroContent';

interface HeroSectionProps {
  pageSlug?: string;
  className?: string;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ 
  pageSlug = 'home',
  className = ''
}) => {
  const { title, subtitle, backgroundVideoUrl, isLoading, error } = useHeroContent(pageSlug);

  if (error) {
    console.error('Error in HeroSection:', error);
    return (
      <div className={`bg-gray-100 p-8 text-center ${className}`}>
        <p className="text-red-600">Error loading hero content. Please try again later.</p>
      </div>
    );
  }

  return (
    <section className={`relative h-[80vh] flex items-center justify-center overflow-hidden ${className}`}>
      {/* Background Video */}
      {backgroundVideoUrl && (
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
          >
            <source src={backgroundVideoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        </div>
      )}

      {/* Content */}
      <div className="container mx-auto px-4 z-10 text-center text-white">
        {isLoading ? (
          <div className="space-y-4">
            <div className="h-12 bg-gray-300 rounded w-3/4 mx-auto animate-pulse"></div>
            <div className="h-6 bg-gray-300 rounded w-1/2 mx-auto animate-pulse"></div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto">
            <h1 
              className="text-4xl md:text-6xl font-bold mb-4 animate-fade-in"
              dangerouslySetInnerHTML={{ __html: title }}
            />
            {subtitle && (
              <p 
                className="text-xl md:text-2xl mb-8 animate-fade-in-up"
                style={{ animationDelay: '200ms' }}
                dangerouslySetInnerHTML={{ __html: subtitle }}
              />
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default HeroSection;
