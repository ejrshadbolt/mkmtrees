'use client';

import { usePathname } from 'next/navigation';
import Header from './Header';

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

  // Regular website layout with header
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow" role="main" id="main-content">
        {children}
      </main>
    </div>
  );
} 