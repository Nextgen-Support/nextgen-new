import { Suspense, lazy, ComponentType } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import React from 'react';

// Loading component for Suspense fallback
const LoadingFallback = () => (
  <div className="w-full h-screen flex items-center justify-center">
    <Skeleton className="w-[300px] h-[200px]" />
  </div>
);

// Error boundary component
export class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error in lazy-loaded component:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 text-center">
          <h2 className="text-xl font-semibold mb-2">Something went wrong</h2>
          <p className="text-muted-foreground">Please refresh the page or try again later.</p>
        </div>
      );
    }

    return this.props.children;
  }
}

// Higher Order Component for lazy loading with error boundary
export function lazyLoad<T extends Record<string, any>>(
  importFunc: () => Promise<{ default: ComponentType<T> }>,
  fallback: React.ReactNode = <LoadingFallback />
) {
  const LazyComponent = lazy(() => 
    Promise.all([
      importFunc(),
      // Add a small delay to avoid flashing of loading state for very fast loads
      new Promise(resolve => setTimeout(resolve, 200))
    ])
    .then(([moduleExports]) => moduleExports)
  );
  
  return function LazyWrapper(props: T) {
    return (
      <ErrorBoundary>
        <Suspense fallback={fallback}>
          <LazyComponent {...props} />
        </Suspense>
      </ErrorBoundary>
    );
  };
}

// Optimized imports for frequently used components
export const lazyPage = (path: string) => 
  lazyLoad(() => import(/* @vite-ignore */ `@/pages/${path}`));

export const lazyComponent = (path: string) =>
  lazyLoad(() => import(/* @vite-ignore */ `@/components/${path}`));
