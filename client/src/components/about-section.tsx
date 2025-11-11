import React, { useEffect, useState } from "react";
import { fetchTeamImage } from "@/lib/wordpress/api";

// Custom Image component using standard HTML img
type ImageProps = {
  src: string;
  alt: string;
  width?: number | string;
  height?: number | string;
  className?: string;
  [key: string]: any;
};

const Image = ({
  src,
  alt,
  width,
  height,
  className,
  ...props
}: ImageProps) => (
  <img
    src={src}
    alt={alt}
    width={width}
    height={height}
    className={className}
    {...props}
  />
);

export default function AboutSection() {
  const [teamImage, setTeamImage] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Function to prevent caching by adding a timestamp
  const getImageUrl = (url: string) => {
    if (!url) return '';
    // Add timestamp to prevent caching
    return `${url}${url.includes('?') ? '&' : '?'}t=${Date.now()}`;
  };

  useEffect(() => {
    const loadTeamImage = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        console.log('Fetching team image data...');
        // Use the new fetchTeamImage function which handles multiple endpoints and image formats
        const teamData = await fetchTeamImage();
        
        if (teamData?.imageUrl) {
          console.log('Setting team image URL from WordPress:', teamData.imageUrl);
          setTeamImage(teamData.imageUrl);
        } else {
          console.log('No team image found in WordPress, using fallback image');
          setTeamImage('/asset/image/team2.png'); // Fallback to default image
          setError('No team image found. Using default image.');
        }
      } catch (err) {
        console.error('Failed to load team image:', err);
        setError('Failed to load team image. Using default image.');
        setTeamImage('/asset/image/team2.png'); // Fallback to default image on error
      } finally {
        setIsLoading(false);
      }
    };

    loadTeamImage();
  }, []);

  // Accreditations data
  const accreditations = [
    { 
      name: "Holowits", 
      logo: "/asset/image/holowits.png",
      description: "Certified Partner"
    },
    { 
      name: "Dokmee", 
      logo: "/asset/image/dokmee.png",
      description: "Authorized Reseller"
    },
  ];

  return (
    <div>
      <div
        id="about"
        className="relative py-20 md:py-32 overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%)",
        }}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div
            className="absolute inset-0 w-full h-full"
            style={{
              backgroundImage:
                "url(https://img.freepik.com/free-vector/cyber-circuit-background_52683-40259.jpg)",
              backgroundSize: "cover",
              backgroundPosition: "center",
              opacity: 0.15,
              backgroundRepeat: "no-repeat",
              filter: "grayscale(100%) brightness(1.2)",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white/80 via-white/90 to-white/80"></div>
        </div>

        {/* Who We Are Section - Full Width Background */}
        <div
          className="w-full bg-cover bg-center bg-no-repeat py-8 md:py-12"
          style={{ backgroundImage: "url('/asset/image/who-we-are.jpg')" }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* All items in who we are section*/}
            <div className="w-full p-2 md:p-6 bg-black/70 border border-white/30 rounded-lg">
              <div className="text-center mb-6 md:mb-8">
                <span className="inline-block px-10 py-2 text-sm font-semibold text-blue-700 bg-white/90 rounded mb-4 shadow-md border border-blue-100">
                  Who We Are
                </span>
                <div className="w-20 h-1 bg-blue-400 mx-auto mb-4"></div>
                <p className="text-white leading-relaxed max-w-4xl mx-auto">
                  NextGen Technology Limited (PNG) is a locally owned company.
                  It is one of the few ICT companies in Papua New Guinea.
                </p>
              </div>

              <div className="w-full p-4 md:p-6">
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Left Column - Our Story */}
                  <div className="space-y-6">
                    <h3 className="text-2xl font-bold text-white">Our Story</h3>
                    <div className="space-y-4">
                      <p className="text-white leading-relaxed">
                        Established in 2020, NextGen Technology Limited has
                        rapidly grown to become a leading ICT provider in Papua
                        New Guinea. From our headquarters in Port Moresby, we've
                        built a reputation for delivering innovative technology
                        solutions tailored to the unique needs of the local
                        market.
                      </p>
                      <p className="text-white leading-relaxed">
                        Our journey has been marked by continuous growth and
                        expansion of our service portfolio, allowing us to meet
                        the evolving technological demands of businesses across
                        various sectors.
                      </p>
                    </div>
                  </div>

                  {/* Right Column - Mission & Vision */}
                  <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl p-8 h-full">
                    <h3 className="text-2xl font-bold text-white mb-6">Our Mission & Vision</h3>
                    <div className="space-y-4">
                      <p className="text-white leading-relaxed">
                        Our mission is to empower businesses in Papua New Guinea through innovative technology solutions that drive growth and efficiency.
                      </p>
                      <p className="text-white leading-relaxed">
                        We envision being the leading ICT partner, transforming the digital landscape of Papua New Guinea and the Pacific region.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Meet Our Team Section */}
        <div className="py-16 md:py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
              <div className="w-20 h-1 bg-blue-600 mx-auto"></div>
            </div>
            
            {isLoading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
                <p className="text-gray-600">Loading team image...</p>
              </div>
            ) : error ? (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8 max-w-3xl mx-auto">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex justify-center">
                <div className="w-full max-w-5xl rounded-xl overflow-hidden shadow-2xl">
                  <div>
                    <div className="hidden">
                      {/* Debug info - will be hidden but visible in the DOM */}
                      <p>Image Source: {teamImage || 'No image set'}</p>
                      <p>Rendered at: {new Date().toISOString()}</p>
                    </div>
                    <Image
                      src={getImageUrl(teamImage)}
                      alt="Our Team"
                      width={1400}
                      height={800}
                      className="w-full h-auto object-cover"
                      onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                        const target = e.target as HTMLImageElement;
                        console.error('Failed to load image, falling back to default:', target.src);
                        target.src = '/asset/image/team2.png';
                      }}
                      onLoad={(e: React.SyntheticEvent<HTMLImageElement>) => {
                        const target = e.target as HTMLImageElement;
                        console.log('Image loaded successfully:', target.src);
                      }}
                      key={`team-image-${Date.now()}`} // Force re-render with new image
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
