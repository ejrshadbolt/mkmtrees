import Link from 'next/link';
import { Star, ArrowRight } from 'lucide-react';
import { FaGoogle, FaFacebook } from 'react-icons/fa';

interface Review {
  id: number;
  reviewer_name: string;
  rating: number;
  title?: string;
  content: string;
  source?: string;
}

interface ReviewsProps {
  title?: string;
  subtitle?: string;
  reviews: Review[];
}

export default function Reviews({ title, subtitle, reviews }: ReviewsProps) {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-5 w-5 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
        fill="currentColor"
      />
    ));
  };

  return (
    <section className="py-16 bg-white">
      <div className="w-full px-6 lg:px-12">
        {/* Title and Subtitle */}
        <div className="mb-16">
          {title && (
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
              {title}
            </h2>
          )}
          <div className="w-16 h-1 mb-6" style={{ backgroundColor: '#F3ED17' }}></div>
          {subtitle && (
            <p className="text-lg text-gray-600 max-w-3xl">
              {subtitle}
            </p>
          )}
        </div>

        {/* Reviews Grid */}
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="bg-gray-50 p-6 shadow-sm border-l-4 border-gray-200 hover:border-yellow-400 hover:scale-105 transition-all duration-200 h-full flex flex-col"
              >
                {/* Stars */}
                <div className="flex items-center mb-4">
                  {renderStars(review.rating)}
                </div>

                {/* Review Content */}
                <blockquote className="text-gray-600 text-base leading-relaxed mb-6 flex-grow">
                  &ldquo;{review.content}&rdquo;
                </blockquote>

                {/* Reviewer Info */}
                <div className="border-t border-gray-200 pt-4 mt-auto">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-gray-900 mb-1">
                        {review.reviewer_name}
                      </div>
                      {review.source && (
                        <div className="text-sm text-gray-500 capitalize">
                          via {review.source}
                        </div>
                      )}
                    </div>
                    {review.source && (
                      <div className="flex-shrink-0">
                        {review.source === 'google' && (
                          <FaGoogle className="h-5 w-5" style={{ color: '#050608' }} />
                        )}
                        {review.source === 'facebook' && (
                          <FaFacebook className="h-5 w-5" style={{ color: '#050608' }} />
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Read All Reviews Button */}
        <div className="text-center mt-12">
          <Link
            href="/reviews"
            className="inline-flex items-center px-8 py-3 font-semibold text-black hover:scale-105 hover:shadow-lg focus-visible-ring focus-ring-yellow group relative"
            style={{ 
              backgroundColor: '#F3ED17',
              transition: 'transform 300ms ease-in-out, box-shadow 300ms ease-in-out'
            }}
          >
            <span className="relative">
              Read All Reviews
              <span 
                className="absolute -bottom-1 left-0 right-0 h-0.5 bg-black transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"
              />
            </span>
            <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}