'use client';

import { useState } from 'react';
import { Search, Globe, Image as ImageIcon, Calendar, Upload, Link } from 'lucide-react';
import Image from 'next/image';
import MediaSelector from './MediaSelector';

interface SEOFieldsProps {
  title: string;
  excerpt: string;
  slug: string;
  metaDescription?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  publishedAt?: string;
  onMetaDescriptionChange: (value: string) => void;
  onOgTitleChange: (value: string) => void;
  onOgDescriptionChange: (value: string) => void;
  onOgImageChange: (value: string) => void;
}

interface MediaItem {
  id: number;
  url: string;
  alt_text: string;
  original_filename: string;
}

export default function SEOFields({
  title,
  excerpt,
  slug,
  metaDescription = '',
  ogTitle = '',
  ogDescription = '',
  ogImage = '',
  publishedAt,
  onMetaDescriptionChange,
  onOgTitleChange,
  onOgDescriptionChange,
  onOgImageChange,
}: SEOFieldsProps) {
  const [showMediaSelector, setShowMediaSelector] = useState(false);
  const [imageInputMode, setImageInputMode] = useState<'url' | 'media'>('url');
  
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://yourdomain.com';
  const fullUrl = `${baseUrl}/news/${slug}`;
  
  // Auto-generate values if not set
  const effectiveMetaDescription = metaDescription || excerpt || '';
  const effectiveOgTitle = ogTitle || title || '';
  const effectiveOgDescription = ogDescription || metaDescription || excerpt || '';

  const previewLength = (text: string, maxLength: number) => {
    return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
  };

  const handleMediaSelect = (mediaItem: MediaItem) => {
    onOgImageChange(mediaItem.url);
    setShowMediaSelector(false);
  };

  return (
    <>
      <div className="bg-white border rounded-lg shadow-sm">
        <div className="p-4 border-b bg-gray-50">
          <h3 className="text-lg font-medium text-gray-900 flex items-center">
            <Search className="h-5 w-5 mr-2" />
            SEO & Social Media Preview
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Optimize how your post appears in search engines and social media
          </p>
        </div>

        <div className="p-6 space-y-6">
          {/* Meta Description */}
          <div>
            <label htmlFor="meta-description" className="block text-sm font-medium text-gray-700">
              Meta Description
            </label>
            <textarea
              id="meta-description"
              rows={3}
              value={metaDescription}
              onChange={(e) => onMetaDescriptionChange(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Brief description for search engines (150-160 characters recommended)"
              maxLength={160}
            />
            <div className="mt-1 flex justify-between text-xs text-gray-500">
              <span>Used in search engine results and social media previews</span>
              <span className={`${metaDescription.length > 160 ? 'text-red-500' : ''}`}>
                {metaDescription.length}/160
              </span>
            </div>
          </div>

          {/* Open Graph Title */}
          <div>
            <label htmlFor="og-title" className="block text-sm font-medium text-gray-700">
              Social Media Title (Open Graph)
            </label>
            <input
              type="text"
              id="og-title"
              value={ogTitle}
              onChange={(e) => onOgTitleChange(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Title for social media shares (defaults to post title)"
              maxLength={60}
            />
            <div className="mt-1 flex justify-between text-xs text-gray-500">
              <span>How the title appears when shared on social media</span>
              <span className={`${ogTitle.length > 60 ? 'text-red-500' : ''}`}>
                {ogTitle.length}/60
              </span>
            </div>
          </div>

          {/* Open Graph Description */}
          <div>
            <label htmlFor="og-description" className="block text-sm font-medium text-gray-700">
              Social Media Description
            </label>
            <textarea
              id="og-description"
              rows={3}
              value={ogDescription}
              onChange={(e) => onOgDescriptionChange(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Description for social media shares (defaults to meta description)"
              maxLength={200}
            />
            <div className="mt-1 flex justify-between text-xs text-gray-500">
              <span>How the description appears when shared on social media</span>
              <span className={`${ogDescription.length > 200 ? 'text-red-500' : ''}`}>
                {ogDescription.length}/200
              </span>
            </div>
          </div>

          {/* Open Graph Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Social Media Image
            </label>
            
            {/* Image Input Mode Toggle */}
            <div className="flex mb-3 bg-gray-100 rounded-lg p-1 max-w-xs">
              <button
                type="button"
                onClick={() => setImageInputMode('url')}
                className={`flex-1 flex items-center justify-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  imageInputMode === 'url'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Link className="h-4 w-4 mr-2" />
                External URL
              </button>
              <button
                type="button"
                onClick={() => setImageInputMode('media')}
                className={`flex-1 flex items-center justify-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  imageInputMode === 'media'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Upload className="h-4 w-4 mr-2" />
                Media Library
              </button>
            </div>

            {imageInputMode === 'url' ? (
              <div>
                <input
                  type="url"
                  id="og-image"
                  value={ogImage}
                  onChange={(e) => onOgImageChange(e.target.value)}
                  className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="https://example.com/image.jpg"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Enter an external image URL (1200x630px recommended)
                </p>
              </div>
            ) : (
              <div>
                {ogImage ? (
                  <div className="flex items-center gap-4 p-4 border border-gray-300 rounded-md">
                    <div className="w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
                      <Image
                        src={ogImage}
                        alt="Social media image"
                        width={64}
                        height={64}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                        }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        Social media image selected
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {ogImage}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setShowMediaSelector(true)}
                        className="px-3 py-2 text-xs border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                      >
                        Change
                      </button>
                      <button
                        type="button"
                        onClick={() => onOgImageChange('')}
                        className="px-3 py-2 text-xs text-red-600 border border-red-300 rounded-md hover:bg-red-50 transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowMediaSelector(true)}
                    className="flex items-center justify-center w-full h-32 border border-dashed border-gray-300 rounded-md hover:border-gray-400 transition-colors"
                  >
                    <div className="text-center">
                      <ImageIcon className="w-8 h-8 mx-auto text-gray-400" />
                      <p className="mt-2 text-sm text-gray-500">
                        Click to select or upload image
                      </p>
                    </div>
                  </button>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  Select from media library or upload new image (1200x630px recommended)
                </p>
              </div>
            )}
          </div>

          {/* SEO Preview */}
          <div className="border-t pt-6">
            <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
              <Globe className="h-4 w-4 mr-2" />
              Search Engine Preview
            </h4>
            <div className="bg-gray-50 p-4 rounded-md">
              <div className="text-blue-600 text-lg hover:underline cursor-pointer">
                {previewLength(effectiveOgTitle, 60)}
              </div>
              <div className="text-green-600 text-sm mt-1">
                {fullUrl}
              </div>
              <div className="text-gray-600 text-sm mt-1">
                {publishedAt && (
                  <span className="inline-flex items-center mr-2">
                    <Calendar className="h-3 w-3 mr-1" />
                    {new Date(publishedAt).toLocaleDateString()}
                  </span>
                )}
                {previewLength(effectiveMetaDescription, 160)}
              </div>
            </div>
          </div>

          {/* Social Media Preview */}
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-3">
              Social Media Preview
            </h4>
            <div className="border rounded-md overflow-hidden bg-white shadow-sm">
              {ogImage && (
                <div className="aspect-[1.91/1] bg-gray-100 relative">
                  <Image
                    src={ogImage}
                    alt="Social media preview"
                    fill
                    className="object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                </div>
              )}
              <div className="p-3">
                <div className="text-sm font-medium text-gray-900 line-clamp-2">
                  {previewLength(effectiveOgTitle, 60)}
                </div>
                <div className="text-xs text-gray-500 mt-1 line-clamp-2">
                  {previewLength(effectiveOgDescription, 200)}
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  {new URL(fullUrl).hostname}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Media Selector Modal */}
      <MediaSelector
        isOpen={showMediaSelector}
        onClose={() => setShowMediaSelector(false)}
        onSelect={handleMediaSelect}
        title="Select Social Media Image"
      />
    </>
  );
} 