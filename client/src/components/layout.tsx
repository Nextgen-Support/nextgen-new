import { ReactNode } from 'react';
import Navigation from './Navigation';
import Footer from './footer';
import BackToTop from './back-to-top';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="fixed inset-0 -z-10">
        <img 
          src="/bg.png" 
          alt="Background"
          className="w-full h-full object-cover"
          style={{ zIndex: -1 }}
        />
        <div className="absolute inset-0 bg-black/30" style={{ zIndex: -1 }} />
      </div>
      <Navigation />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
      <BackToTop />
    </div>
  );
}
