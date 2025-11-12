import React from 'react';
import { Link } from 'react-router-dom';
import { useDocumentManagementData, defaultDocumentManagementData } from '@/hooks/useDocumentManagementData';

const DocumentManagementPage = () => {
  const { data, isLoading, error } = useDocumentManagementData();
  const pageData = data || defaultDocumentManagementData;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 pt-28 pb-12 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
            <div className="block">Document</div>
            <div className="block text-green-600">Management Solutions</div>
          </h1>
          {pageData.page_description && (
            <p className="mt-3 max-w-3xl mx-auto text-base text-gray-600 sm:text-lg md:mt-5 md:text-xl">
              {pageData.page_description}
            </p>
          )}
        </div>

        {/* Two Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Card - Sub Section 1 */}
          <div className="group">
            <div 
              className="relative rounded-t-xl overflow-hidden h-64"
              style={{
                backgroundImage: pageData.sub_image_1?.url ? `url(${pageData.sub_image_1.url})` : 'none',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
              }}
            >
              <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-10 transition-all duration-500" />
            </div>
            {/* Content Below Image */}
            <div className="bg-white p-6 rounded-b-xl shadow-lg">
              {pageData.sub_title_1 && (
                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                  {pageData.sub_title_1}
                </h2>
              )}
              {pageData.sub_description_1 && (
                <p className="text-gray-600 mb-4">
                  {pageData.sub_description_1}
                </p>
              )}
              {pageData.sub_points_1 && pageData.sub_points_1.length > 0 && (
                <ul className="space-y-2">
                  {pageData.sub_points_1.map((point, index) => (
                    <li key={index} className="flex items-start">
                      <svg className="h-5 w-5 text-green-500 mr-2 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700">{point}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Right Card - Sub Section 2 */}
          <div className="group">
            <div 
              className="relative rounded-t-xl overflow-hidden h-64"
              style={{
                backgroundImage: pageData.sub_image_2?.url ? `url(${pageData.sub_image_2.url})` : 'none',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
              }}
            >
              <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-10 transition-all duration-500" />
            </div>
            {/* Content Below Image */}
            <div className="bg-white p-6 rounded-b-xl shadow-lg">
              {pageData.sub_title_2 && (
                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                  {pageData.sub_title_2}
                </h2>
              )}
              {pageData.sub_description_2 && (
                <p className="text-gray-600 mb-4">
                  {pageData.sub_description_2}
                </p>
              )}
              {pageData.sub_points_2 && pageData.sub_points_2.length > 0 && (
                <ul className="space-y-2">
                  {pageData.sub_points_2.map((point, index) => (
                    <li key={index} className="flex items-start">
                      <svg className="h-5 w-5 text-green-500 mr-2 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700">{point}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 bg-white rounded-lg shadow-md p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Need a Custom Document Solution?</h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            We can design a customized document management system tailored to your specific business needs.
          </p>
          <Link 
            to="/contact" 
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 transition-colors"
          >
            Contact Us Today
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DocumentManagementPage;
