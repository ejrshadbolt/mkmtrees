import React from 'react';

interface AdminPageHeaderProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
}

export default function AdminPageHeader({ title, description, children }: AdminPageHeaderProps) {
  return (
    <div className="bg-white/70 backdrop-blur-sm shadow-lg rounded-2xl border border-white/20 mb-6">
      <div className="px-6 py-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              {title}
            </h1>
            {description && (
              <p className="mt-2 text-gray-600">
                {description}
              </p>
            )}
          </div>
          {children && (
            <div className="flex items-center gap-3">
              {children}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 