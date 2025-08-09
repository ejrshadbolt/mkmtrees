import React from 'react';

interface AdminPageContainerProps {
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl' | '5xl' | '6xl' | '7xl' | 'full';
}

export default function AdminPageContainer({ children, maxWidth = '7xl' }: AdminPageContainerProps) {
  const maxWidthClass = `max-w-${maxWidth}`;
  
  return (
    <div className="space-y-6">
      <div className={`${maxWidthClass} mx-auto px-4 sm:px-6 lg:px-8 py-6`}>
        {children}
      </div>
    </div>
  );
} 