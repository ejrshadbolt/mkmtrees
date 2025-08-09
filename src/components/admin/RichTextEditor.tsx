'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

// Dynamic import of the improved TipTap editor
const ImprovedTipTapEditor = dynamic(() => import('./ImprovedRichTextEditor'), {
  loading: () => (
    <div className="border border-gray-300 rounded-lg">
      <div className="border-b border-gray-200 p-3 bg-gray-50">
        <div className="flex gap-2">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="w-10 h-10 bg-gray-200 rounded animate-pulse"></div>
          ))}
        </div>
      </div>
      <div className="p-6">
        <div className="h-96 bg-gray-100 rounded animate-pulse"></div>
      </div>
    </div>
  ),
  ssr: false // Don't include in server bundle
});

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  className?: string;
}

export default function RichTextEditor(props: RichTextEditorProps) {
  return (
    <div className={props.className}>
      <Suspense fallback={
        <div className="border border-gray-300 rounded-lg">
          <div className="border-b border-gray-200 p-3 bg-gray-50">
            <div className="flex gap-2">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="w-10 h-10 bg-gray-200 rounded animate-pulse"></div>
              ))}
            </div>
          </div>
          <div className="p-6">
            <div className="h-96 bg-gray-100 rounded animate-pulse"></div>
          </div>
        </div>
      }>
        <ImprovedTipTapEditor {...props} />
      </Suspense>
    </div>
  );
} 