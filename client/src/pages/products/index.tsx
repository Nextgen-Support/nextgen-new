import React from "react";
import { Link } from "react-router-dom";

interface ProductCard {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  link: string;
}

const products: ProductCard[] = [
  {
    id: "cctv-systems",
    title: "CCTV Systems",
    description: "High-definition surveillance systems for comprehensive security monitoring.",
    icon: "🎥",
    color: "from-blue-600 to-blue-800",
    link: "/products/cctv-systems"
  },
  {
    id: "networking",
    title: "Networking Equipment",
    description: "Enterprise-grade networking solutions for reliable connectivity.",
    icon: "🌐",
    color: "from-green-600 to-green-800",
    link: "/products/networking"
  },
  {
    id: "security-systems",
    title: "Security Systems",
    description: "Advanced security solutions to protect your business assets.",
    icon: "🔒",
    color: "from-purple-600 to-purple-800",
    link: "/products/security-systems"
  },
  {
    id: "storage-solutions",
    title: "Storage Solutions",
    description: "Scalable storage solutions for all your business needs.",
    icon: "💾",
    color: "from-red-600 to-red-800",
    link: "/products/storage-solutions"
  }
];

const ProductsPage: React.FC = () => {
  return (
    <div className="min-h-screen pt-24 px-4 pb-12 relative">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Our Products
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Discover our range of high-quality IT products designed to meet your business needs.
          </p>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-xl font-medium text-white mb-2">No products found</h3>
            <p className="text-gray-300">We couldn't find any products at the moment. Please check back later.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <div 
                key={product.id}
                className="group relative bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-blue-500/30 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/10"
              >
                <Link to={product.link} className="block h-full">
                  <div className="flex flex-col h-full">
                    <div className={`w-16 h-16 rounded-xl ${product.color} flex items-center justify-center text-3xl mb-4`}>
                      {product.icon}
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors">
                      {product.title}
                    </h2>
                    <p className="text-gray-300 mb-6 flex-grow">
                      {product.description}
                    </p>
                    <div className="mt-auto pt-4 border-t border-white/10">
                      <Link to={product.link} className="inline-flex items-center text-blue-400 group-hover:underline">
                        Learn more
                        <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}

        {/* CTA Section */}
        <div className="mt-20 bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            Need Help Choosing?
          </h2>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            Our experts can help you find the perfect products for your specific
            requirements.
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center justify-center px-6 py-2.5 border border-transparent text-base font-medium rounded-md text-blue-700 bg-white hover:bg-gray-100 transition-colors"
          >
            Contact Us
          </Link>
        </div>
      </div>
      
      {/* Background Image with Overlay */}
      <div className="fixed inset-0 -z-10">
        <img
          src="/bg.png"
          alt="Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/70" />
      </div>
    </div>
  );
};

export default ProductsPage;
