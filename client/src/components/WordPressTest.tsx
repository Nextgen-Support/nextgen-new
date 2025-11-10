import { useEffect, useState } from 'react';

export default function WordPressTest() {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [endpoint, setEndpoint] = useState('pages');
  const [customEndpoint, setCustomEndpoint] = useState('');
  const [apiUrl, setApiUrl] = useState('');

  useEffect(() => {
    // Get the API URL from environment variables
    const baseUrl = import.meta.env.VITE_WORDPRESS_REST_API_URL || '';
    setApiUrl(baseUrl);
    
    // Test the connection on component mount
    testConnection(`${baseUrl}/pages?per_page=1&_embed`);
  }, []);

  const testConnection = async (url: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log(`Testing connection to: ${url}`);
      const response = await fetch(url);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || 
          `HTTP error! Status: ${response.status} ${response.statusText}`
        );
      }
      
      const result = await response.json();
      setData(result);
      console.log('API Response:', result);
    } catch (err) {
      console.error('Test connection error:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTest = (e: React.FormEvent) => {
    e.preventDefault();
    const endpointToTest = customEndpoint || endpoint;
    testConnection(`${apiUrl}/${endpointToTest}?per_page=1&_embed`);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">WordPress REST API Tester</h2>
      
      <div className="mb-6 p-4 bg-blue-50 rounded-lg">
        <p className="font-mono text-sm break-all">
          <span className="font-semibold">API Base URL:</span> {apiUrl}
        </p>
      </div>
      
      <form onSubmit={handleTest} className="mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Test Endpoint
            </label>
            <div className="flex">
              <select
                className="block w-full rounded-l-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={endpoint}
                onChange={(e) => setEndpoint(e.target.value)}
              >
                <option value="pages">Pages</option>
                <option value="posts">Posts</option>
                <option value="media">Media</option>
                <option value="categories">Categories</option>
                <option value="tags">Tags</option>
                <option value="custom">Custom</option>
              </select>
              {endpoint === 'custom' && (
                <input
                  type="text"
                  className="block w-full rounded-r-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="custom/endpoint"
                  value={customEndpoint}
                  onChange={(e) => setCustomEndpoint(e.target.value)}
                />
              )}
            </div>
          </div>
          <div className="flex items-end">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              disabled={isLoading}
            >
              {isLoading ? 'Testing...' : 'Test Connection'}
            </button>
          </div>
        </div>
      </form>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error connecting to WordPress</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
              <div className="mt-4">
                <div className="text-sm">
                  <p className="font-medium">Troubleshooting tips:</p>
                  <ul className="list-disc pl-5 mt-1 space-y-1">
                    <li>Verify the WordPress site URL is correct</li>
                    <li>Check if the REST API is enabled on your WordPress site</li>
                    <li>Ensure CORS is properly configured on the server</li>
                    <li>Check the browser's console for detailed error messages</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center items-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : data ? (
        <div className="mt-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">API Response</h3>
            <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
              Success
            </span>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg overflow-hidden">
            <pre className="text-xs overflow-auto max-h-96 p-4 bg-gray-800 text-green-300 rounded">
              {JSON.stringify(data, null, 2)}
            </pre>
          </div>
          <div className="mt-4 text-sm text-gray-500">
            <p>Found {Array.isArray(data) ? data.length : 1} items</p>
          </div>
        </div>
      ) : null}
    </div>
  );
}
