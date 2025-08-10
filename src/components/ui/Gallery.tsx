'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Expand } from 'lucide-react';
import Lightbox from './Lightbox';

interface GalleryProps {
  images: string[];
  titles?: string[];
  className?: string;
}

export default function Gallery({ images, titles, className = '' }: GalleryProps) {
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

  return (
    <>
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 ${className}`}>
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => openLightbox(index)}
            className="relative aspect-[4/3] rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-200 group focus:outline-none focus:ring-4 focus:ring-yellow-400 focus:ring-offset-2"
          >
            <Image
              src={image}
              alt={titles?.[index] || `Gallery image ${index + 1}`}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-200"
            />
            
            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-200 flex items-center justify-center">
              <Expand className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 transform group-hover:scale-110" />
            </div>
          </button>
        ))}
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