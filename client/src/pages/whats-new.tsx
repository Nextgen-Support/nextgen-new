import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, Calendar, Tag, ArrowRight, Share2, Clock, Zap, Bell } from "lucide-react";

const categories = ["All", "Features", "Announcements", "Updates", "Releases"];
const updates = [
  {
    id: 1,
    title: "Fujitsu's 256-Qubit Quantum Breakthrough",
    description: "Fujitsu and RIKEN's new 256-qubit quantum computer marks a significant leap in quantum computing, enabling complex simulations and optimizations.",
    date: "2025-05-05",
    category: "Quantum Computing",
    isFeatured: true,
    image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
  },
  {
    id: 2,
    title: "Abridge AI Medical Scribe Hits $5.3B Valuation",
    description: "Abridge's AI medical documentation platform sees rapid adoption, securing $300M in Series E funding and integrating with Epic Systems.",
    date: "2025-06-24",
    category: "Healthcare AI",
    isFeatured: true,
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
  },
  {
    id: 3,
    title: "Microsoft & Atom Computing's Quantum Milestone",
    description: "Partnership announces commercial quantum computer launch, bringing practical quantum computing solutions to enterprise clients.",
    date: "2025-02-19",
    category: "Quantum Computing",
    isFeatured: true,
    image: "https://images.unsplash.com/photo-1551288049-beb86e5e03e2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
  },
  {
    id: 4,
    title: "Hippocratic AI Secures $141M for Patient Agents",
    description: "Startup develops AI healthcare agents that provide personalized patient support and monitoring, backed by major VCs.",
    date: "2025-01-09",
    category: "Healthcare AI",
    isFeatured: true,
    image: "https://images.unsplash.com/photo-1505751172876-faee399930e5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
  },
  {
    id: 5,
    title: "Quantum Machines Raises $170M Series D",
    description: "Quantum control systems provider expands operations, now working with over 50% of quantum computing companies worldwide.",
    date: "2025-02-25",
    category: "Quantum Computing",
    isFeatured: true,
    image: "https://images.unsplash.com/photo-1551288049-5a5c9ef8f323?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80"
  },
  {
    id: 6,
    title: "Amazon Debuts Ocelot Quantum Chip",
    description: "AWS introduces its first quantum computing processor, marking a major step in cloud-based quantum services.",
    date: "2025-02-27",
    category: "Quantum Computing",
    isFeatured: true,
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
  }
];

export default function WhatsNew() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredUpdates = updates.filter(update => {
    const matchesCategory = selectedCategory === "All" || update.category === selectedCategory;
    const matchesSearch = update.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         update.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredUpdates = updates.filter(update => update.isFeatured);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-gray-700 to-gray-900 text-white pt-32 pb-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">What's New</h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto">
            Stay updated with our latest news, features, and announcements
          </p>
        </div>
      </div>

      {/* Category Filter */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 overflow-x-auto">
          <div className="flex space-x-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Updates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredUpdates.map((update) => (
            <div key={update.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="h-48 overflow-hidden">
                <img 
                  src={update.image} 
                  alt={update.title}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-blue-600 font-medium">{update.category}</span>
                  <span className="text-sm text-gray-500">{update.date}</span>
                </div>
                <h3 className="text-xl font-bold mb-2 text-gray-800">{update.title}</h3>
                <p className="text-gray-600 mb-4 line-clamp-3">{update.description}</p>
                <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                  <div className="flex space-x-2">
                    <button className="p-2 text-gray-400 hover:text-blue-500 transition-colors">
                      <Share2 size={16} />
                    </button>
                  </div>
                  <a 
                    href={
                      update.id === 1 ? 'https://www.theverge.com/2025/10/15/dark-mode-design-trends' :
                      update.id === 2 ? 'https://techcrunch.com/2025/09/20/mobile-app-updates-october-2025' :
                      update.id === 3 ? 'https://www.cnet.com/tech/holiday-tech-deals-2025' :
                      update.id === 4 ? 'https://developer-tech.com/news/2025/sep/15/top-10-api-integrations-2025/' :
                      update.id === 5 ? 'https://www.digitaltrends.com/computing/performance-optimization-tips-2025/' :
                      update.id === 6 ? 'https://www.wired.com/story/security-features-2025' :
                      update.id === 7 ? 'https://www.smashingmagazine.com/2025/09/ui-ux-trends-fall-2025' :
                      update.id === 8 ? 'https://dev.to/bestpractices/api-versioning-best-practices-2025' :
                      update.id === 9 ? 'https://techcrunch.com/2025/05/05/meet-the-companies-racing-to-build-quantum-chips/' :
                      update.id === 10 ? 'https://techcrunch.com/2025/03/15/ai-healthcare-predictive-analytics-breakthrough/' :
                      update.id === 11 ? 'https://www.energy.gov/articles/doe-national-laboratory-makes-fusion-energy-breakthrough' :
                      update.id === 12 ? 'https://www.nature.com/articles/s41586-025-00000-1' :
                      '#'
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 font-medium inline-flex items-center group"
                  >
                    Read more
                    <ArrowRight className="ml-1 group-hover:translate-x-1 transition-transform" size={16} />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Changelog Section */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-6">Changelog</h2>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">v2.1.0 – November 10, 2025</h3>
              <ul className="mt-2 space-y-2 text-gray-600">
                <li className="flex">
                  <span className="text-green-500 mr-2">•</span>
                  Added support for multiple payment gateways
                </li>
                <li className="flex">
                  <span className="text-green-500 mr-2">•</span>
                  Improved site loading speed by 25%
                </li>
                <li className="flex">
                  <span className="text-green-500 mr-2">•</span>
                  Enhanced mobile responsiveness
                </li>
                <li className="flex">
                  <span className="text-red-500 mr-2">•</span>
                  Fixed minor UI bugs and glitches
                </li>
              </ul>
            </div>
            <div className="p-6 bg-gray-50">
              <h3 className="text-lg font-semibold text-gray-900">v2.0.0 – October 25, 2025</h3>
              <ul className="mt-2 space-y-2 text-gray-600">
                <li className="flex">
                  <span className="text-green-500 mr-2">•</span>
                  Completely redesigned user interface
                </li>
                <li className="flex">
                  <span className="text-green-500 mr-2">•</span>
                  Added new analytics dashboard
                </li>
                <li className="flex">
                  <span className="text-yellow-500 mr-2">•</span>
                  Updated API endpoints (see documentation)
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="mt-12 bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 text-blue-600 mb-4">
              <Bell size={32} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Stay Updated</h2>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Get the latest news, updates, and special offers delivered straight to your inbox.
            </p>
            <div className="max-w-md mx-auto flex flex-col sm:flex-row gap-3">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
              <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200">
                Subscribe
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-3">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
