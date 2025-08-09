"use client";

import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import AdminPageContainer from '@/components/admin/AdminPageContainer';
import AdminPageHeader from '@/components/admin/AdminPageHeader';

// Dynamic import of AnalyticsDashboard to reduce main bundle size
const AnalyticsDashboard = dynamic(() => import("@/components/admin/AnalyticsDashboard"), {
  loading: () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white/70 backdrop-blur-sm p-6 rounded-lg shadow-sm border border-white/20 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          </div>
        ))}
      </div>
    </div>
  ),
  ssr: false // Disable SSR for admin components to reduce server bundle
});

export default function DashboardPage() {
  return (
    <AdminPageContainer>
      <AdminPageHeader 
        title="Dashboard"
        description="Welcome back! Here's what's happening with your content."
      />

      {/* Analytics Dashboard */}
      <Suspense fallback={
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white/70 backdrop-blur-sm p-6 rounded-lg shadow-sm border border-white/20 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/3"></div>
              </div>
            ))}
          </div>
        </div>
      }>
        <AnalyticsDashboard />
      </Suspense>
    </AdminPageContainer>
  );
} 