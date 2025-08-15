'use client';

import { useState } from 'react';
import Image from 'next/image';
import Lightbox from './Lightbox';

interface PortfolioGalleryProps {
  images: string[];
  titles?: string[];
  projectTitle: string;
}

export default function PortfolioGallery({ images, titles, projectTitle }: PortfolioGalleryProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const openLightbox = (index: number) => {
    setCurrentIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const goToIndex = (index: number) => {
    setCurrentIndex(index);
  };

  if (images.length === 0) return null;

  return (
    <>
      <div className="space-y-8">
        {/* Main Featured Image - Large and Clickable */}
        <div className="relative">
          <button
            onClick={() => openLightbox(0)}
            className="relative w-full aspect-[16/9] rounded-sm overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 group focus:outline-none focus:ring-4 focus:ring-yellow-400 focus:ring-offset-2"
          >
            <Image
              src={images[0]}
              alt={titles?.[0] || `${projectTitle} - Featured image`}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
            
            {/* Overlay with Gallery Indicator */}
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300"></div>
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="bg-black bg-opacity-70 text-white px-6 py-3 rounded-lg flex items-center space-x-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
                <span className="font-semibold">View Gallery ({images.length} photos)</span>
              </div>
            </div>
          </button>
        </div>
        
        {/* Thumbnail Strip - Only show if more than 1 image */}
        {images.length > 1 && (
          <div>
            <p className="text-gray-600 text-center mb-4">Click any image to view full gallery</p>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {images.slice(1, 7).map((image, index) => (
                <button
                  key={index + 1}
                  onClick={() => openLightbox(index + 1)}
                  className="relative aspect-square rounded-sm overflow-hidden shadow-md hover:shadow-lg transition-all duration-200 group focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2"
                >
                  <Image
                    src={image}
                    alt={titles?.[index + 1] || `${projectTitle} - Gallery image ${index + 1}`}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-200"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200"></div>
                </button>
              ))}
              {/* Show "+X more" if there are more than 6 additional images */}
              {images.length > 7 && (
                <button
                  onClick={() => openLightbox(7)}
                  className="relative aspect-square rounded-sm overflow-hidden shadow-md hover:shadow-lg transition-all duration-200 group bg-gray-900 text-white flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2"
                >
                  <div className="text-center">
                    <span className="text-xl font-bold">+{images.length - 7}</span>
                    <p className="text-xs">more</p>
                  </div>
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      <Lightbox
        images={images}
        titles={titles}
        isOpen={lightboxOpen}
        currentIndex={currentIndex}
        onClose={closeLightbox}
        onPrevious={goToPrevious}
        onNext={goToNext}
        onGoToIndex={goToIndex}
      />
    </>
  );
}