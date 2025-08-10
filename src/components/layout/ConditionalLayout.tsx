'use client';

import { usePathname } from 'next/navigation';
import Header from './Header';
import SecondaryNav from './SecondaryNav';
import Footer from './Footer';

interface ConditionalLayoutProps {
  children: React.ReactNode;
}

export default function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith('/admin');

  if (isAdminRoute) {
    // Admin routes handle their own layout - just return children
    return <>{children}</>;
  }

  // Regular website layout with header and footer
  return (
    <div className="min-h-screen flex flex-col">
      <div className="sticky top-0 z-50">
        <Header />
        <SecondaryNav />
      </div>
      <main className="flex-grow" role="main" id="main-content">
        {children}
      </main>
      <Footer />
    </div>
  );
} 