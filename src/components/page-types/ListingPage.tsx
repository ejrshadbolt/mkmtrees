import { ArrowRight, ExternalLink } from 'lucide-react';
import Image from 'next/image';

interface ListingItem {
  id: string;
  title: string;
  description: string;
  image?: string;
  link?: string;
  category?: string;
  price?: string;
  features?: string[];
}

interface ListingPageProps {
  title: string;
  description: string;
  items: ListingItem[];
  layout?: 'grid' | 'list';
  showCategories?: boolean;
  categories?: string[];
  showPricing?: boolean;
  ctaText?: string;
  ctaLink?: string;
  children?: React.ReactNode;
}

export default function ListingPage({ 
  title, 
  description, 
  items, 
  layout = 'grid',
  showCategories = false,
  categories = [],
  showPricing = false,
  ctaText = "Learn More",
  ctaLink = "/contact",
  children 
}: ListingPageProps) {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">{title}</h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
              {description}
            </p>
          </div>
        </div>
      </section>

      {/* Categories Filter */}
      {showCategories && categories.length > 0 && (
        <section className="py-8 bg-gray-50 border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap gap-2 justify-center">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium">
                All
              </button>
              {categories.map((category) => (
                <button
                  key={category}
                  className="px-4 py-2 bg-white text-gray-700 rounded-lg font-medium hover:bg-gray-100 transition-colors"
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Listings */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {layout === 'grid' ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {items.map((item) => (
                <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  {item.image && (
                    <Image 
                      src={item.image} 
                      alt={item.title}
                      width={400}
                      height={192}
                      className="w-full h-48 object-cover"
                    />
                  )}
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-bold text-gray-900">{item.title}</h3>
                      {showPricing && item.price && (
                        <span className="text-lg font-bold text-blue-600">{item.price}</span>
                      )}
                    </div>
                    
                    {item.category && (
                      <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mb-3">
                        {item.category}
                      </span>
                    )}
                    
                    <p className="text-gray-600 mb-4">{item.description}</p>
                    
                    {item.features && (
                      <ul className="text-sm text-gray-500 mb-4 space-y-1">
                        {item.features.slice(0, 3).map((feature, index) => (
                          <li key={index}>• {feature}</li>
                        ))}
                      </ul>
                    )}
                    
                    <a
                      href={item.link || ctaLink}
                      className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
                    >
                      {ctaText}
                      <ArrowRight size={16} className="ml-1" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-8">
              {items.map((item) => (
                <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="md:flex">
                    {item.image && (
                      <div className="md:w-1/3">
                        <Image 
                          src={item.image} 
                          alt={item.title}
                          width={400}
                          height={192}
                          className="w-full h-48 md:h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="p-6 md:w-2/3">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-2xl font-bold text-gray-900">{item.title}</h3>
                        {showPricing && item.price && (
                          <span className="text-xl font-bold text-blue-600">{item.price}</span>
                        )}
                      </div>
                      
                      {item.category && (
                        <span className="inline-block bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full mb-3">
                          {item.category}
                        </span>
                      )}
                      
                      <p className="text-gray-600 mb-4">{item.description}</p>
                      
                      {item.features && (
                        <ul className="text-gray-500 mb-4 space-y-1">
                          {item.features.map((feature, index) => (
                            <li key={index}>• {feature}</li>
                          ))}
                        </ul>
                      )}
                      
                      <a
                        href={item.link || ctaLink}
                        className="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                      >
                        {ctaText}
                        <ExternalLink size={16} className="ml-2" />
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Custom Content */}
      {children && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Need Something Custom?</h2>
          <p className="text-xl text-gray-300 mb-8">
            Contact us to discuss your specific requirements
          </p>
          <a
            href={ctaLink}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors inline-block"
          >
            Get in Touch
          </a>
        </div>
      </section>
    </div>
  );
}