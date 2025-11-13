import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import ProductsSidebar from "../../components/products-sidebar";

interface ProductImage {
  id: number;
  url: string;
  alt: string;
}

interface ProductReview {
  id: number;
  author: string;
  rating: number;
  date: string;
  title: string;
  content: string;
}

interface ProductSpecs {
  [key: string]: string;
}

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  brand: string;
  rating: number;
  reviewCount: number;
  sku: string;
  inStock: boolean;
  images: string[];
  description: string;
  features: string[];
  specifications: ProductSpecs;
  reviews: ProductReview[];
}

// Mock product data - in a real app, this would come from an API
const mockProducts: Record<string, Product> = {
  'cctv-systems': {
    id: 'cctv-systems',
    name: '4K CCTV Camera System',
    category: 'Security',
    price: 899.99,
    brand: 'Hikvision',
    rating: 4.7,
    reviewCount: 156,
    sku: 'HIK-4K-8CH',
    inStock: true,
    images: [
      '/products/cctv-1.jpg',
      '/products/cctv-2.jpg',
      '/products/cctv-3.jpg',
    ],
    description:
      "The Enterprise Router X2000 delivers high-performance routing for medium to large businesses with advanced security features and 10Gbps throughput.",
    features: [
      "10 Gigabit Ethernet ports (24x 1G, 4x 10G SFP+)",
      "Advanced security with integrated firewall and VPN",
      "Dual power supply for high availability",
      "Cloud-managed with mobile app support",
      "Layer 3 routing with advanced QoS",
      "Energy efficient design with 80 PLUS Platinum certification",
    ],
    specifications: {
      Brand: "Hikvision",
      Model: "HIK-4K-8CH",
      Ports: "8 x 1G RJ45",
      Throughput: "4 Gbps",
      "VPN Throughput": "1 Gbps",
      "Power Supply": "1 x 12V DC",
      Dimensions: "17.3 x 17.3 x 1.7 in",
      Weight: "15.4 lbs",
      Warranty: "Lifetime limited hardware warranty",
    },
    reviews: [
      {
        id: 1,
        author: "Alex Johnson",
        rating: 5,
        date: "2023-10-15",
        title: "Excellent Performance",
        content:
          "This router has been rock solid for our office of 50+ users. The throughput is excellent and the management interface is intuitive.",
      },
      {
        id: 2,
        author: "Sam Wilson",
        rating: 4,
        date: "2023-09-28",
        title: "Great features, steep learning curve",
        content:
          "The router has all the features we need, but the initial setup was a bit complex. The support team was very helpful though.",
      },
    ],
  },
};

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simulate API fetch
    const fetchProduct = () => {
      try {
        if (id && mockProducts[id]) {
          setProduct(mockProducts[id]);
        } else {
          setError('Product not found');
          // Redirect to products page if product not found
          setTimeout(() => navigate('/products'), 2000);
        }
      } catch (err) {
        setError('Failed to load product');
        console.error('Error fetching product:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 text-lg">{error || 'Product not found'}</p>
          <p className="mt-2">Redirecting to products page...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 relative">
      {/* Background Image with Overlay */}
      <div className="fixed inset-0 -z-10">
        <img
          src="/bg.png"
          alt="Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/70" />
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8 relative">
        {/* Breadcrumb */}
        <nav className="flex mb-8" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-4">
            <li>
              <div>
                <Link to="/" className="text-gray-400 hover:text-white">
                  <svg
                    className="flex-shrink-0 h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                  </svg>
                  <span className="sr-only">Home</span>
                </Link>
              </div>
            </li>
            <li>
              <div className="flex items-center">
                <svg
                  className="flex-shrink-0 h-5 w-5 text-gray-500"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  aria-hidden="true"
                >
                  <path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
                </svg>
                <Link
                  to="/products"
                  className="ml-2 text-sm font-medium text-gray-300 hover:text-white"
                >
                  Products
                </Link>
              </div>
            </li>
            <li>
              <div className="flex items-center">
                <svg
                  className="flex-shrink-0 h-5 w-5 text-gray-500"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  aria-hidden="true"
                >
                  <path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
                </svg>
                <span className="ml-2 text-sm font-medium text-white">
                  {product.name}
                </span>
              </div>
            </li>
          </ol>
        </nav>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Main Content */}
          <div className="flex-1">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="md:flex">
                {/* Product Images */}
                <div className="md:w-1/2 p-4">
                  <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg">
                    <img
                      src={product.images[selectedImage]}
                      alt={product.name}
                      className="w-full h-full object-contain object-center"
                    />
                  </div>
                  <div className="grid grid-cols-4 gap-2 mt-4">
                    {product.images.map((image, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => setSelectedImage(index)}
                        className={`rounded-md overflow-hidden ${
                          selectedImage === index ? "ring-2 ring-blue-500" : ""
                        }`}
                      >
                        <img
                          src={image}
                          alt={`${product.name} view ${index + 1}`}
                          className="w-full h-20 object-cover object-center"
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Product Info */}
                <div className="md:w-1/2 p-6">
                  <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-gray-900">
                      {product.name}
                    </h1>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {product.category}
                    </span>
                  </div>

                  <div className="mt-2 flex items-center">
                    <div className="flex items-center">
                      {[0, 1, 2, 3, 4].map((rating) => (
                        <svg
                          key={rating}
                          className={`h-5 w-5 ${
                            rating < Math.floor(product.rating)
                              ? "text-yellow-400"
                              : "text-gray-300"
                          }`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <p className="ml-2 text-sm text-gray-500">
                      {product.rating} out of 5
                    </p>
                    <a
                      href="#reviews"
                      className="ml-2 text-sm font-medium text-blue-600 hover:text-blue-500"
                    >
                      {product.reviewCount} reviews
                    </a>
                  </div>

                  <div className="mt-6">
                    <p className="text-3xl font-bold text-gray-900">
                      ${product.price.toFixed(2)}
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                      SKU: {product.sku}
                    </p>
                    <p
                      className={`mt-2 text-sm ${
                        product.inStock ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {product.inStock ? "In Stock" : "Out of Stock"}
                    </p>
                  </div>

                  <div className="mt-6">
                    <p className="text-gray-700">{product.description}</p>
                  </div>

                  <div className="mt-6">
                    <h3 className="text-sm font-medium text-gray-900">
                      Key Features
                    </h3>
                    <ul className="mt-2 pl-4 list-disc text-sm text-gray-700 space-y-1">
                      {product.features.map((feature, index) => (
                        <li key={index}>{feature}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-6">
                    <div className="flex items-center">
                      <label
                        htmlFor="quantity"
                        className="mr-4 text-sm font-medium text-gray-700"
                      >
                        Quantity
                      </label>
                      <div className="flex items-center border border-gray-300 rounded-md">
                        <button
                          type="button"
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                          className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                        >
                          -
                        </button>
                        <span className="w-12 text-center">{quantity}</span>
                        <button
                          type="button"
                          onClick={() => setQuantity(quantity + 1)}
                          className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex space-x-4">
                    <button
                      type="button"
                      className="flex-1 bg-blue-600 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                      disabled={!product.inStock}
                    >
                      Add to cart
                    </button>
                    <button
                      type="button"
                      className="flex-1 bg-white border border-gray-300 rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Add to Quote
                    </button>
                  </div>

                  <div className="mt-6 text-center">
                    <p className="text-sm text-gray-500">
                      Need help?{" "}
                      <a
                        href="#"
                        className="font-medium text-blue-600 hover:text-blue-500"
                      >
                        Contact Sales
                      </a>
                    </p>
                  </div>
                </div>
              </div>

              {/* Product Tabs */}
              <div className="border-t border-gray-200 mt-8">
                <nav className="flex -mb-px">
                  <button
                    type="button"
                    className="w-1/3 py-4 px-1 text-center border-b-2 font-medium text-sm border-blue-500 text-blue-600"
                  >
                    Description
                  </button>
                  <button
                    type="button"
                    className="w-1/3 py-4 px-1 text-center border-b-2 font-medium text-sm border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  >
                    Specifications
                  </button>
                  <button
                    type="button"
                    className="w-1/3 py-4 px-1 text-center border-b-2 font-medium text-sm border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  >
                    Reviews ({product.reviews.length})
                  </button>
                </nav>

                <div className="p-6">
                  <h3 className="text-lg font-medium text-gray-900">
                    Product Description
                  </h3>
                  <div className="mt-4 prose prose-sm text-gray-500">
                    <p>{product.description}</p>
                    <p className="mt-4">
                      The {product.name} is designed for businesses that demand
                      high performance and reliability. With its advanced
                      features and robust construction, it's built to handle the
                      most demanding networking environments.
                    </p>
                    <h4 className="mt-6 font-medium text-gray-900">
                      Additional Information
                    </h4>
                    <ul
                      role="list"
                      className="mt-2 pl-4 list-disc text-sm space-y-2"
                    >
                      <li>Enterprise-grade reliability with 99.999% uptime</li>
                      <li>
                        Advanced security features including stateful packet
                        inspection
                      </li>
                      <li>Easy deployment with zero-touch provisioning</li>
                      <li>Comprehensive monitoring and reporting tools</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Reviews Section */}
            <div id="reviews" className="mt-12">
              <h2 className="text-2xl font-bold text-gray-900">
                Customer Reviews
              </h2>
              <div className="mt-6 space-y-10">
                {product.reviews.map((review) => (
                  <div key={review.id} className="flex">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                        {review.author.charAt(0)}
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="flex items-center">
                        {[0, 1, 2, 3, 4].map((rating) => (
                          <svg
                            key={rating}
                            className={`h-5 w-5 ${
                              rating < review.rating
                                ? "text-yellow-400"
                                : "text-gray-300"
                            }`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <p className="text-sm font-medium text-gray-900 mt-1">
                        {review.title}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        By {review.author} on{" "}
                        {new Date(review.date).toLocaleDateString()}
                      </p>
                      <p className="mt-2 text-sm text-gray-600">
                        {review.content}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-10 p-6 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-medium text-gray-900">
                  Have questions about this product?
                </h3>
                <p className="mt-2 text-sm text-gray-600">
                  Our team is here to help! Contact us for more information or
                  to request a quote.
                </p>
                <div className="mt-4">
                  <a
                    href="/contact"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Contact Us
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="md:w-80 flex-shrink-0">
            <ProductsSidebar />

            {/* Support Card */}
            <div className="mt-6 bg-white rounded-lg shadow-sm p-6">
              <div className="text-center">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  Need help?
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Our team is here to help with any questions about our
                  products.
                </p>
                <div className="mt-6">
                  <a
                    href="#"
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Contact Support
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
