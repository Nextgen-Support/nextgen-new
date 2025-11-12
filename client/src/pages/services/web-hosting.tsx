import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useWebHostingData, defaultWebHostingData } from '@/hooks/useWebHostingData';


interface PlanProps {
  plan: {
    title: string;
    price: string;
    period?: string;
    subDescription?: string;
    bulletPoints?: string[];
    popular?: boolean;
  };
}

const PlanCard: React.FC<PlanProps> = ({ 
  plan: {
    title = 'Plan',
    price = 'K0',
    period = '/month',
    subDescription = '',
    bulletPoints = [],
    popular = false
  } 
}) => (
  <div 
    className={`flex-1 flex flex-col rounded-2xl shadow-md overflow-hidden bg-blue-600 text-white ${
      popular ? 'ring-2 ring-blue-300 transform scale-[1.02]' : 'border border-blue-700'
    }`}
  >
    <div className="px-4 py-5 sm:px-5 sm:py-6">
      <div className="flex items-center justify-between">
        <h3 className="inline-flex px-3 py-0.5 rounded-full text-xs font-semibold tracking-wide uppercase bg-blue-700 text-white">
          {title}
        </h3>
        {popular && (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-blue-300 text-blue-900">
            Most Popular
          </span>
        )}
      </div>
      
      <div className="mt-3">
        {/* Price and Period */}
        <div className="flex items-baseline text-3xl font-bold">
          {price}
          <span className="ml-1 text-base font-normal text-blue-100">
            {period}
          </span>
        </div>
        
        {/* Sub Description - Show complete description */}
        {subDescription && (
          <div className="mt-2">
            <p className="text-sm text-blue-100 whitespace-pre-line">
              {subDescription}
            </p>
          </div>
        )}
      </div>
      
      {/* Bullet Points */}
      {bulletPoints.length > 0 && (
        <ul className="mt-4 space-y-2">
          {bulletPoints.map((point, i) => (
            <li key={i} className="flex items-start">
              <svg className="flex-shrink-0 h-4 w-4 text-green-400 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
              </svg>
              <span className="ml-2 text-sm text-white">{point}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
    <div className="flex-1 flex flex-col justify-end px-6 pt-6 pb-8 bg-blue-700 sm:p-10 sm:pt-6">
      <div className="px-4 sm:px-5">
        <button 
          onClick={() => window.location.href = '/contact'}
          className="w-full bg-green-600 border border-transparent rounded-[10px] py-2 text-sm font-medium text-white text-center hover:bg-green-700 transition-colors cursor-pointer"
        >
          Get started
        </button>
      </div>
    </div>
  </div>
);

const WebHostingPage: React.FC = () => {
  const { data, isLoading, error } = useWebHostingData();
  const pageData = data || defaultWebHostingData;
  // Log the data for debugging
  useEffect(() => {
    console.log('Page Data:', pageData);
    if (pageData?.plans) {
      console.log('Plans:', pageData.plans);
    }
  }, [pageData]);

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
    <div className="min-h-screen bg-gray-100 pt-32 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-green-600 sm:text-5xl md:text-6xl">
            {pageData.page_title}
          </h1>
          {pageData.page_description && (
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              {pageData.page_description}
            </p>
          )}
        </div>

        <div className="grid gap-6 max-w-7xl mx-auto grid-cols-1 sm:grid-cols-2 lg:grid-cols-5">
          {pageData.plans?.map((plan, index) => {
            // Safely access plan properties with defaults
            const planData = {
              title: plan?.title || `Plan ${index + 1}`,
              price: plan?.price || '',
              period: plan?.period || '/month',
              subDescription: plan?.subDescription || '',
              bulletPoints: Array.isArray(plan?.features) ? plan.features : [],
              popular: plan?.popular || index === 2 // Default to 3rd plan being popular
            };
            
            return (
              <PlanCard 
                key={`plan-${index}`} 
                plan={planData}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default WebHostingPage;
