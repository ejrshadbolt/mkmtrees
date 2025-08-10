import Link from 'next/link';
import { Star, ExternalLink } from 'lucide-react';
import { FaGoogle } from 'react-icons/fa';

// Mock Google reviews data - in real implementation, this would come from Google Reviews API
const googleReviews = [
  {
    id: 1,
    reviewer_name: "Sarah Mitchell",
    rating: 5,
    content: "MKM Trees did an outstanding job removing a large oak tree from our Halswell property. Professional, tidy, and great value. Highly recommend!",
    date: "2 weeks ago",
    verified: true
  },
  {
    id: 2,
    reviewer_name: "David Thompson",
    rating: 5,
    content: "Called them for emergency storm cleanup in Rolleston. Quick response, fair pricing, and left our section spotless. Will definitely use again.",
    date: "1 month ago",
    verified: true
  },
  {
    id: 3,
    reviewer_name: "Lisa Chen",
    rating: 5,
    content: "Excellent service for our lifestyle block in Selwyn. Tree topping and land clearing done to perfection. Very professional team.",
    date: "1 month ago",
    verified: true
  },
  {
    id: 4,
    reviewer_name: "Mike Robertson",
    rating: 5,
    content: "These guys know their stuff! Handled a tricky tree removal on our Banks Peninsula property with skill and care. Impressed with their equipment too.",
    date: "2 months ago",
    verified: true
  },
  {
    id: 5,
    reviewer_name: "Jenny Williams",
    rating: 5,
    content: "Fast, reliable, and tidy. MKM cleared our paddock in Ashburton and the finish was perfect. Gold standard service!",
    date: "2 months ago",
    verified: true
  },
  {
    id: 6,
    reviewer_name: "Tom Parker",
    rating: 5,
    content: "Emergency callout for fallen trees after the storm. Arrived quickly and sorted everything professionally. Can't fault their service.",
    date: "3 months ago",
    verified: true
  }
];

const renderStars = (rating: number) => {
  return Array.from({ length: 5 }, (_, i) => (
    <Star
      key={i}
      className={`h-4 w-4 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
      fill="currentColor"
    />
  ));
};

export default function GoogleReviews() {
  return (
    <section className="py-16 bg-white">
      <div className="w-full px-6 lg:px-12">
        {/* Title */}
        <div className="mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
            What Our Customers Say
          </h2>
          <div className="w-16 h-1 mb-6" style={{ backgroundColor: '#F3ED17' }}></div>
          <p className="text-lg text-gray-600 max-w-3xl">
            Real reviews from Canterbury locals who trust MKM Trees for their tree services and land clearing needs.
          </p>
        </div>

        {/* Reviews Grid */}
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {googleReviews.map((review) => (
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
                  "{review.content}"
                </blockquote>

                {/* Reviewer Info */}
                <div className="border-t border-gray-200 pt-4 mt-auto">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-gray-900 mb-1">
                        {review.reviewer_name}
                      </div>
                      <div className="text-sm text-gray-500 capitalize">
                        via google
                      </div>
                    </div>
                    <div className="flex-shrink-0">
                      <FaGoogle className="h-5 w-5" style={{ color: '#050608' }} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* View All Reviews Button */}
        <div className="text-center mt-12">
          <Link
            href="https://www.google.com/search?q=MKM+Trees+reviews"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-8 py-3 font-semibold text-black transition-all duration-200 hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 group"
            style={{ backgroundColor: '#F3ED17' }}
          >
            <FaGoogle className="mr-2 h-5 w-5" />
            View All Google Reviews
            <ExternalLink className="ml-2 h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}