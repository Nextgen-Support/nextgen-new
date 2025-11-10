import { Link } from "react-router-dom";
import { useHeroData } from "../hooks/useHeroData";

export default function HeroSection() {
  const { heroData, loading, error } = useHeroData();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-pulse text-center">
          <div className="h-8 bg-gray-300 rounded w-3/4 mx-auto mb-4"></div>
          <div className="h-4 bg-gray-300 rounded w-1/2 mx-auto"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50">
        <div className="text-center text-red-600">
          <p>Error loading hero section. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center text-white overflow-hidden"
      style={{
        marginTop: "0",
        paddingTop: "4rem",
        position: "relative",
        zIndex: 10,
      }}
    >
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        {heroData?.videoUrl && (
          <video
            autoPlay
            loop
            muted
            playsInline
            className="hidden md:block w-full h-full object-cover"
            preload="auto"
            disablePictureInPicture
            disableRemotePlayback
            onCanPlayThrough={(e) => {
              const video = e.target as HTMLVideoElement;
              video.play().catch((error) => {
                console.log("Video autoplay was prevented:", error);
              });
            }}
          >
            <source src={heroData.videoUrl} type="video/mp4" />
            <img
              src={heroData.fallbackImage}
              alt="Fallback banner"
              className="w-full h-full object-cover"
            />
            Your browser does not support the video tag.
          </video>
        )}
        {/* Mobile background image with fallback gradient */}
        <div className="md:hidden absolute inset-0">
          <img
            src={heroData?.fallbackImage || "/asset/image/bg-mobileview.png"}
            alt=""
            className="w-full h-full object-cover"
            aria-hidden="true"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.background =
                "linear-gradient(to bottom right, #1e3a8a, #4c1d95)";
              target.src = "";
            }}
          />
        </div>
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-black bg-opacity-15"></div>
      </div>
      
      {/* Main Hero Content */}
      <div className="flex-1 flex flex-col justify-center items-center relative z-10 px-4 sm:px-6 lg:px-12 py-12">
        <div className="w-full max-w-4xl text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
            {heroData?.title || 'POWERING YOUR BUSINESS THROUGH SMART ICT SOLUTIONS'}
          </h1>
          {heroData?.subtitle && (
            <p className="text-3xl md:text-4xl text-yellow-300 mb-8">
              {heroData.subtitle}
            </p>
          )}
          <div className="mt-20">
            <a
              href="#contact"
              className="inline-flex items-center px-7 py-3 border border-transparent text-base font-medium rounded-xl shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
              onClick={(e) => {
                e.preventDefault();
                document
                  .getElementById("contact")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Get In Touch
              <svg
                className="ml-2 -mr-1 h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"
                />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
