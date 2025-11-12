import { useQuery, useQueryClient } from "@tanstack/react-query";
import wordpressApi from "../lib/wordpress/api";

// Define types
interface ProductACFFields {
  price?: number;
  features?: string[];
  category?: string;
  link?: string;
}

interface WordPressPost {
  id: number;
  title: {
    rendered: string;
  };
  excerpt: {
    rendered: string;
  };
  slug: string;
  acf?: ProductACFFields;
  _embedded?: {
    "wp:featuredmedia"?: Array<{
      source_url: string;
      alt_text: string;
    }>;
  };
}

export interface Product {
  id: number;
  title: string | { rendered: string };
  excerpt: string | { rendered: string };
  slug: string;
  acf?: ProductACFFields;
  _embedded?: {
    "wp:featuredmedia"?: Array<{
      source_url: string;
      alt_text: string;
    }>;
  };
}

// In-memory cache for fallback
const memoryCache: { data: Product[] | null; timestamp: number | null } = {
  data: null,
  timestamp: null,
};

// Cache duration in milliseconds (5 minutes)
const CACHE_DURATION = 5 * 60 * 1000;

// Process WordPress post to our Product format
const processWordPressPost = (post: WordPressPost): Product => ({
  id: post.id,
  title: post.title.rendered,
  excerpt: post.excerpt.rendered,
  slug: post.slug,
  acf: post.acf,
  _embedded: post._embedded,
});

export function useProducts() {
  const queryClient = useQueryClient();

  return useQuery<Product[], Error>({
    queryKey: ["products"],
    queryFn: async (): Promise<Product[]> => {
      try {
        // Return in-memory cached data if available and not expired
        if (
          memoryCache.data &&
          memoryCache.timestamp &&
          Date.now() - memoryCache.timestamp < CACHE_DURATION
        ) {
          console.log("Using in-memory cached products data");
          return memoryCache.data;
        }

        // Use performance API to measure request time
        const startTime = performance.now();

        const response = await wordpressApi.get<WordPressPost[]>("/posts", {
          params: {
            _embed: "wp:featuredmedia",
            per_page: 12,
            categories: "products",
            _fields: ["id", "title", "slug", "excerpt", "acf"].join(","),
            _cacheBuster:
              process.env.NODE_ENV === "development" ? Date.now() : undefined,
          },
          timeout: 5000,
        });

        const endTime = performance.now();
        console.log(
          `Products fetched in ${(endTime - startTime).toFixed(2)}ms`
        );

        // Process the response data
        const products = response.data.map(processWordPressPost);

        // Update memory cache
        memoryCache.data = products;
        memoryCache.timestamp = Date.now();

        return products;
      } catch (error) {
        console.error("Error fetching products:", error);

        // Return in-memory cached data if available (even if expired)
        if (memoryCache.data) {
          console.log(
            "Using in-memory cached products data (possibly expired)"
          );
          return memoryCache.data;
        }

        // Fallback to query cache
        try {
          const queryCache = queryClient.getQueryCache();
          const cachedData = queryCache.find({ queryKey: ["products"] })?.state
            .data;
          if (cachedData) {
            console.log("Using query cache products data");
            // Update memory cache for next time
            memoryCache.data = Array.isArray(cachedData) ? cachedData : [];
            memoryCache.timestamp = Date.now();
            return memoryCache.data;
          }
        } catch (cacheError) {
          console.error("Error accessing query cache:", cacheError);
        }

        // If we get here, we have no data to return
        console.log("No cached data available");
        return [];
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
    retry: (failureCount, error: any) => {
      // Don't retry on 404s
      if (error?.response?.status === 404) return false;
      // Retry up to 1 time for other errors
      return failureCount < 1;
    },
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    networkMode: "online" as const,
  });
}
