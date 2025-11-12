import React from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';

// Define the Product type based on WordPress REST API response
interface Product {
  id: number;
  title: {
    rendered: string;
  };
  excerpt: {
    rendered: string;
  };
  slug: string;
  acf?: {
    features?: string[];
    category?: string;
    link?: string;
  };
  _embedded?: {
    'wp:featuredmedia'?: Array<{
      source_url: string;
      alt_text: string;
    }>;
  };
}

// Simple Skeleton component for loading state
const Skeleton = ({ className = '', ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div 
    className={`animate-pulse bg-gray-200 rounded-md ${className}`} 
    {...props} 
  />
);

const ProductsPage = () => {
  const { data: products = [], isLoading, error } = useProducts() as {
    data: Product[];
    isLoading: boolean;
    error: Error | null;
  };
  if (isLoading) {
    return (
      <div className="min-h-screen pt-24 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold text-center my-12 text-green-500">Our Products</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-blue-600 text-white rounded-lg shadow-lg overflow-hidden">
                <div className="p-6 h-full flex flex-col">
                  <Skeleton className="h-6 w-24 mb-4" />
                  <Skeleton className="h-8 w-3/4 mb-4" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-5/6 mb-4" />
                  <div className="space-y-2 mb-4">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                    <Skeleton className="h-4 w-4/5" />
                  </div>
                  <Skeleton className="mt-auto h-10 w-full rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen pt-24 px-4">
        <div className="max-w-6xl mx-auto text-center py-12">
          <h1 className="text-4xl font-bold text-red-500 mb-4">Error Loading Products</h1>
          <p className="text-lg mb-6">We're having trouble loading our products. Please try again later.</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center my-12 text-green-500">Our Products</h1>
        
        {Array.isArray(products) && products.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product: Product) => {
              const title = typeof product.title === 'string' ? product.title : product.title?.rendered || 'Untitled Product';
              const excerpt = typeof product.excerpt === 'string' 
                ? product.excerpt 
                : product.excerpt?.rendered 
                  ? product.excerpt.rendered
                      .replace(/<[^>]*>?/gm, '')
                      .replace(/\[.*?\]/g, '')
                      .trim()
                      .substring(0, 150) + '...'
                  : 'No description available.';
              
              const features = product.acf?.features || [];
              const category = product.acf?.category || 'Uncategorized';
              const productLink = product.acf?.link || `#`;

              return (
                <div key={product.id} className="bg-blue-600 text-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                  <div className="p-6 h-full flex flex-col">
                    <div className="flex justify-between items-start mb-3">
                      <span className="px-3 py-1 bg-white bg-opacity-20 text-white text-xs font-medium rounded-full">
                        {category}
                      </span>
                    </div>
                    <h2 className="text-2xl font-bold text-green-500 mb-2">
                      {title}
                    </h2>
                    <div 
                      className="text-white text-opacity-90 mb-4 flex-grow"
                      dangerouslySetInnerHTML={{ __html: excerpt }}
                    />
                    
                    {features.length > 0 && (
                      <>
                        <h3 className="text-lg font-semibold mb-2 text-white">Features:</h3>
                        <ul className="list-disc pl-5 space-y-1 mb-4 text-white text-opacity-90">
                          {features.map((feature: string, i: number) => (
                            <li key={i}>{feature}</li>
                          ))}
                        </ul>
                      </>
                    )}

                    <Link 
                      to={productLink}
                      className="mt-auto block w-full text-center bg-white text-blue-600 hover:bg-gray-100 font-medium py-2 px-4 rounded transition-colors duration-200"
                    >
                      Learn More
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-lg">No products found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsPage;
