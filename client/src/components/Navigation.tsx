import { useState, useEffect, useRef } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [isMobileServicesOpen, setIsMobileServicesOpen] = useState(false);
  const [isSupportOpen, setIsSupportOpen] = useState(false);
  const [isMobileSupportOpen, setIsMobileSupportOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isMobileCategoryOpen, setIsMobileCategoryOpen] = useState(false);
  const [isGuidesOpen, setIsGuidesOpen] = useState(false);
  const [isMobileGuidesOpen, setIsMobileGuidesOpen] = useState(false);

  const lastScrollY = useRef(0);
  const servicesRef = useRef<HTMLDivElement>(null);
  const categoryRef = useRef<HTMLDivElement>(null);

  // Scroll handling
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const bannerHeight = 600;
      const isHomePage = window.location.pathname === "/";

      if (currentScrollY <= 100 || (isHomePage && currentScrollY < bannerHeight)) {
        setIsVisible(true);
      } else {
        const scrollingDown = currentScrollY > lastScrollY.current && currentScrollY > bannerHeight;
        setIsVisible(!scrollingDown);
      }

      setIsScrolled(currentScrollY > 50);
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (servicesRef.current && !servicesRef.current.contains(event.target as Node)) {
        setIsServicesOpen(false);
      }
      if (categoryRef.current && !categoryRef.current.contains(event.target as Node)) {
        setIsCategoryOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleServices = () => setIsServicesOpen(!isServicesOpen);
  const toggleMobileServices = () => setIsMobileServicesOpen(!isMobileServicesOpen);
  const toggleCategory = () => setIsCategoryOpen(!isCategoryOpen);
  const toggleMobileCategory = () => setIsMobileCategoryOpen(!isMobileCategoryOpen);
  const toggleGuides = () => setIsGuidesOpen(!isGuidesOpen);
  const toggleMobileGuides = () => setIsMobileGuidesOpen(!isMobileGuidesOpen);
  
  const toggleSupport = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsSupportOpen(!isSupportOpen);
    if (isGuidesOpen) setIsGuidesOpen(false);
  };
  
  const toggleMobileSupport = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMobileSupportOpen(!isMobileSupportOpen);
    if (isMobileGuidesOpen) setIsMobileGuidesOpen(false);
  };

  const navClasses = `fixed top-0 left-0 right-0 z-50 transition-transform duration-300 transform ${
    isVisible ? "translate-y-0" : "-translate-y-full"
  } ${isScrolled ? "py-2 bg-black/90 backdrop-blur-sm" : "py-4"}`;

  const navStyle: React.CSSProperties = {
    backgroundImage: "url('/bg.png')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    color: "white",
    boxShadow: "none",
    transition: "all 0.3s ease-in-out",
    backdropFilter: "blur(2px)",
    WebkitBackdropFilter: "blur(2px)",
    boxSizing: "border-box" as const,
    textShadow: "0 0 0 transparent !important",
    textRendering: "optimizeLegibility",
    WebkitFontSmoothing: "antialiased",
    MozOsxFontSmoothing: "grayscale",
    filter: "none",
    WebkitFilter: "none",
    WebkitTextStroke: "0",
    outline: "none",
    paddingLeft: "1rem",
    paddingRight: "1rem",
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      {/* Top contact bar */}
      <div className="w-full bg-black/90 py-1">
        <div className="container mx-auto flex justify-end px-4">
          <div className="flex items-center space-x-4 text-yellow-400 text-xs font-medium">
            <a href="tel:+6753252023" className="hover:text-yellow-300 transition-colors">
              <span className="whitespace-nowrap">
                <i className="mr-1">📞</i> +675 325 2023
              </span>
            </a>
            <span className="text-gray-400">|</span>
            <a href="mailto:enquiry@nextgenpng.net" className="hover:text-yellow-300 transition-colors">
              <span className="whitespace-nowrap">
                <i className="mr-1">✉️</i> enquiry@nextgenpng.net
              </span>
            </a>
          </div>
        </div>
      </div>
      
      {/* Main navigation */}
      <div className={navClasses} style={navStyle}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link
                to="/"
                className="flex-shrink-0 no-underline"
                style={{
                  textDecoration: "none",
                  textShadow: "none !important",
                  WebkitTextStroke: "0 !important",
                }}
                onClick={() => {
                  setIsMenuOpen(false);
                  setIsVisible(true);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              >
                <img
                  className="h-14 w-auto"
                  src="/asset/image/logo.png"
                  alt="Nextgen Technology Limited"
                />
              </Link>
            </div>

            <div className="flex-1"></div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              {/* Home */}
              <Link
                to="/"
                className="px-3 py-2 rounded-md text-sm font-medium hover:bg-white/20 no-underline"
                onClick={() => {
                  setIsMenuOpen(false);
                  setIsVisible(true);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              >
                Home
              </Link>

              {/* What's New */}
              <Link
                to="/whats-new"
                className="px-3 py-2 rounded-md text-sm font-medium hover:bg-white/20 no-underline"
                onClick={() => {
                  setIsMenuOpen(false);
                  setIsVisible(true);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              >
                What's New
              </Link>

              {/* Services dropdown */}
              <div className="relative" ref={servicesRef}>
                <button
                  onClick={toggleServices}
                  className="px-3 py-2 rounded-md text-sm font-medium hover:bg-white/20 flex items-center no-underline"
                >
                  Services
                  <ChevronDown
                    className={`ml-1 h-4 w-4 transition-transform ${
                      isServicesOpen ? "transform rotate-180" : ""
                    }`}
                  />
                </button>
                {isServicesOpen && (
                  <div className="absolute left-0 mt-2 w-56 rounded-md shadow-lg bg-black/80 backdrop-blur-sm border border-white/10">
                    <div className="py-1">
                      <Link
                        to="/services/document-management"
                        className="block px-4 py-2 text-sm text-green-400 hover:bg-white/10"
                        onClick={() => setIsServicesOpen(false)}
                      >
                        Document Management
                      </Link>
                      <Link
                        to="/services/cctv"
                        className="block px-4 py-2 text-sm text-green-400 hover:bg-white/10"
                        onClick={() => setIsServicesOpen(false)}
                      >
                        CCTV Solutions
                      </Link>
                      <Link
                        to="/services/web-hosting"
                        className="block px-4 py-2 text-sm text-green-400 hover:bg-white/10"
                        onClick={() => {
                          setIsServicesOpen(false);
                          setIsSupportOpen(false);
                        }}
                      >
                        Web and Domain Hosting
                      </Link>
                      <div className="relative group">
                        <button
                          onClick={toggleSupport}
                          className="w-full text-left px-4 py-2 text-green-400 hover:bg-white/10 flex justify-between items-center text-sm font-medium"
                        >
                          Support
                          <ChevronDown
                            className={`ml-1 h-4 w-4 transition-transform ${
                              isSupportOpen ? 'transform rotate-180' : ''
                            }`}
                          />
                        </button>
                        {isSupportOpen && (
                          <div className="absolute left-0 mt-1 ml-4 w-56 rounded-md shadow-lg bg-black/80 backdrop-blur-sm border border-white/10 z-10">
                            <div className="py-1">
                              <Link
                                to="/support/guides"
                                className="block px-4 py-2 text-sm text-green-400 hover:bg-white/10 font-medium"
                                onClick={() => {
                                  setIsServicesOpen(false);
                                  setIsSupportOpen(false);
                                }}
                              >
                                Guides
                              </Link>
                              <div className="border-t border-white/10 mt-1">
                                <Link
                                  to="/support/request"
                                  className="block px-4 py-2 text-sm text-green-400 hover:bg-white/10 font-medium"
                                  onClick={() => {
                                    setIsServicesOpen(false);
                                    setIsSupportOpen(false);
                                  }}
                                >
                                  Submit Request
                                </Link>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Category dropdown */}
              <div className="relative" ref={categoryRef}>
                <button
                  onClick={toggleCategory}
                  className="px-3 py-2 rounded-md text-sm font-medium hover:bg-white/20 flex items-center no-underline"
                >
                  Category
                  <ChevronDown
                    className={`ml-1 h-4 w-4 transition-transform ${
                      isCategoryOpen ? "transform rotate-180" : ""
                    }`}
                  />
                </button>
                {isCategoryOpen && (
                  <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-black/80 backdrop-blur-sm border border-white/10">
                    <div className="py-1">
                      <Link
                        to="/products"
                        className="block px-4 py-2 text-sm text-green-400 hover:bg-white/10"
                        onClick={() => {
                          setIsCategoryOpen(false);
                          setIsMenuOpen(false);
                        }}
                      >
                        Products
                      </Link>
                      <Link
                        to="/projects"
                        className="block px-4 py-2 text-sm text-green-400 hover:bg-white/10"
                        onClick={() => {
                          setIsCategoryOpen(false);
                          setIsMenuOpen(false);
                        }}
                      >
                        Projects
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* About & Contact */}
              <Link
                to="/#about"
                className="px-3 py-2 rounded-md text-sm font-medium hover:bg-white/20 no-underline"
                onClick={(e) => {
                  if (window.location.pathname === "/") {
                    e.preventDefault();
                    const aboutSection = document.getElementById('about');
                    if (aboutSection) {
                      aboutSection.scrollIntoView({ behavior: 'smooth' });
                    }
                  }
                  setIsMenuOpen(false);
                }}
              >
                About Us
              </Link>
              <Link
                to="/#contact"
                className="px-3 py-2 rounded-md text-sm font-medium hover:bg-white/20 no-underline"
                onClick={(e) => {
                  if (window.location.pathname === "/") {
                    e.preventDefault();
                    document
                      .getElementById("contact")
                      ?.scrollIntoView({ behavior: "smooth" });
                  }
                  setIsMenuOpen(false);
                }}
              >
                Contact
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-white/20"
              >
                {isMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-black/95 backdrop-blur-sm rounded-b-2xl overflow-hidden">
            <div className="px-3 pt-3 pb-6 space-y-2 max-h-[90vh] overflow-y-auto">
              <Link
                to="/"
                className="block px-3 py-2 rounded-md text-base font-medium hover:bg-white/20 no-underline"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/whats-new"
                className="block px-3 py-2 rounded-md text-base font-medium hover:bg-white/20 no-underline"
                onClick={() => setIsMenuOpen(false)}
              >
                What's New
              </Link>

              <div>
                <button
                  onClick={toggleMobileServices}
                  className="w-full flex justify-between items-center px-4 py-3 rounded-xl text-base font-medium text-white hover:bg-white/20 pr-6"
                >
                  <span>Services</span>
                  <ChevronDown
                    className={`h-5 w-5 transition-transform ${
                      isMobileServicesOpen ? "transform rotate-180" : ""
                    }`}
                  />
                </button>
                {isMobileServicesOpen && (
                  <div className="pl-4 space-y-1">
                    <Link
                      to="/services/document-management"
                      className="block w-full px-4 py-2.5 rounded-xl text-base font-medium text-green-400 hover:bg-white/20"
                      onClick={() => {
                        setIsMobileServicesOpen(false);
                        setIsMenuOpen(false);
                      }}
                    >
                      Document Management
                    </Link>
                    <Link
                      to="/services/cctv"
                      className="block w-full px-4 py-2.5 rounded-xl text-base font-medium text-green-400 hover:bg-white/20"
                      onClick={() => {
                        setIsMobileServicesOpen(false);
                        setIsMenuOpen(false);
                      }}
                    >
                      CCTV Solutions
                    </Link>
                    <Link
                      to="/services/web-hosting"
                      className="block w-full px-4 py-2.5 rounded-xl text-base font-medium text-green-400 hover:bg-white/20"
                      onClick={() => {
                        setIsMobileServicesOpen(false);
                        setIsMenuOpen(false);
                      }}
                    >
                      Web and Domain Hosting
                    </Link>
                    <button
                      onClick={toggleMobileSupport}
                      className="w-full text-left px-4 py-2.5 rounded-xl text-base font-medium text-green-400 hover:bg-white/20 flex justify-between items-center"
                    >
                      <span>Support</span>
                      <ChevronDown
                        className={`h-5 w-5 transition-transform ${
                          isMobileSupportOpen ? "transform rotate-180" : ""
                        }`}
                      />
                    </button>
                    {isMobileSupportOpen && (
                      <div className="pl-4 space-y-1">
                        <Link
                          to="/support/guides"
                          className="block w-full px-4 py-2 text-sm text-green-400 hover:bg-white/10 rounded-lg"
                          onClick={() => {
                            setIsMobileSupportOpen(false);
                            setIsMenuOpen(false);
                          }}
                        >
                          Guides
                        </Link>
                        <Link
                          to="/support/request"
                          className="block w-full px-4 py-2 text-sm text-green-400 hover:bg-white/10 rounded-lg"
                          onClick={() => {
                            setIsMobileSupportOpen(false);
                            setIsMenuOpen(false);
                          }}
                        >
                          Submit Request
                        </Link>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div>
                <button
                  onClick={toggleMobileCategory}
                  className="w-full flex justify-between items-center px-4 py-3 rounded-xl text-base font-medium text-white hover:bg-white/20 pr-6"
                >
                  <span>Category</span>
                  <ChevronDown
                    className={`h-5 w-5 transition-transform ${
                      isMobileCategoryOpen ? "transform rotate-180" : ""
                    }`}
                  />
                </button>
                {isMobileCategoryOpen && (
                  <div className="pl-4 space-y-1">
                    <Link
                      to="/products"
                      className="block w-full px-4 py-2.5 rounded-xl text-base font-medium text-green-400 hover:bg-white/20"
                      onClick={() => {
                        setIsMobileCategoryOpen(false);
                        setIsMenuOpen(false);
                      }}
                    >
                      Products
                    </Link>
                    <Link
                      to="/projects"
                      className="block w-full px-4 py-2.5 rounded-xl text-base font-medium text-green-400 hover:bg-white/20"
                      onClick={() => {
                        setIsMobileCategoryOpen(false);
                        setIsMenuOpen(false);
                      }}
                    >
                      Projects
                    </Link>
                  </div>
                )}
              </div>

              <Link
                to="/#about"
                className="block px-4 py-3 rounded-xl text-base font-medium text-white hover:bg-white/20"
                onClick={(e) => {
                  if (window.location.pathname === "/") {
                    e.preventDefault();
                    document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
                  }
                  setIsMenuOpen(false);
                }}
              >
                About Us
              </Link>
              <Link
                to="/#contact"
                className="block px-4 py-3 rounded-xl text-base font-medium text-white hover:bg-white/20"
                onClick={(e) => {
                  if (window.location.pathname === "/") {
                    e.preventDefault();
                    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                  }
                  setIsMenuOpen(false);
                }}
              >
                Contact
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
