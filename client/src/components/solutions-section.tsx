import React, { useEffect } from "react";
import { motion, Variants, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useNavigate } from "react-router-dom";
import { useSolutionsData } from "../hooks/useSolutionsData";

const scrollbarStyles = `
  .solutions-scroll-container::-webkit-scrollbar {
    display: none;
  }
  .solutions-scroll-container {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
`;

// Check if device is mobile
const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

const cardVariants: Variants = isMobile ? {
  hidden: { opacity: 1, x: 0, y: 0, rotate: 0 },
  visible: { opacity: 1, x: 0, y: 0, rotate: 0 }
} : {
  hidden: (i: number) => ({
    opacity: 0,
    x: i % 2 === 0 ? 50 : -50,
    y: 30,
    rotate: i % 2 === 0 ? 5 : -5,
  }),
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    y: 0,
    rotate: 0,
    transition: {
      type: "spring",
      damping: 15,
      stiffness: 100,
      mass: 0.5,
      delay: i * 0.1,
    },
  }),
};

const staggerContainer: Variants = isMobile ? {
  hidden: { opacity: 1 },
  visible: { opacity: 1 }
} : {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.2,
    },
  },
};

export interface Solution {
  title: string;
  description: string;
  image: string;
  link: string;
}

export function SolutionsSection() {
  const { solutions, isLoading, error } = useSolutionsData();
  const controls = useAnimation();
  const [ref, inView] = useInView({
    rootMargin: window.innerWidth > 768 ? "0px" : "0px 0px -25% 0px",
    triggerOnce: true,
    threshold: 0.2,
  });

  useEffect(() => {
    console.log('Solutions data:', solutions); // Debug log
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView, solutions]); // Added solutions to dependency array

  return (
    <section ref={ref} id="solutions" className="py-16 bg-gray-50 w-full">
      <style>{scrollbarStyles}</style>
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">{error}</p>
            </div>
          </div>
        </div>
      ) : (
      <div className="w-full">
        <motion.div
          className="mx-auto px-4 sm:px-6 lg:px-8 w-full"
          initial="hidden"
          animate={controls}
          variants={staggerContainer}
        >
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={controls}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: {
                opacity: 1,
                y: 0,
                transition: {
                  duration: 0.6,
                  ease: [0.16, 1, 0.3, 1],
                },
              },
            }}
          >
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Our Solutions
            </h2>
          </motion.div>

          <div className="w-full px-4 sm:px-6 lg:px-8 flex justify-center">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl">
              {solutions && solutions.length > 0 ? (
                solutions.map((solution: Solution, index: number) => (
                <motion.div
                  key={index}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl h-full flex flex-col"
                  onClick={(e) => {
                    e.preventDefault();
                    window.location.href = solution.link;
                  }}
                  custom={index}
                  variants={cardVariants}
                  whileHover={{
                    y: -5,
                    scale: 1.05,
                    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
                    transition: {
                      y: { type: "spring", stiffness: 300 },
                      scale: { duration: 0.3, ease: "easeOut" },
                      boxShadow: { duration: 0.3 }
                    },
                  }}
                  initial="hidden"
                  animate={controls}
                >
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={solution.image}
                      alt={solution.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.onerror = null;
                        target.src = "/placeholder-image.jpg";
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                      <h3 className="text-white font-semibold text-lg">
                        {solution.title}
                      </h3>
                    </div>
                  </div>
                  <div className="p-8 flex-1 flex flex-col">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                      {solution.title}
                    </h3>
                    <p className="text-gray-600 mb-4 flex-1">
                      {solution.description}
                    </p>
                    <a
                      href="#contact"
                      className="mt-auto w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                      }}
                    >
                      Contact Us
                      <svg
                        className="w-4 h-4 ml-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                        />
                      </svg>
                    </a>
                  </div>
                </motion.div>
              ))
              ) : (
                <div className="col-span-3 text-center py-8">
                  <p className="text-gray-500">No solutions found. Please check your WordPress ACF setup.</p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
      )}
    </section>
  );
}
