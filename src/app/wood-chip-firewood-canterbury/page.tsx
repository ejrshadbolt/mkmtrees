import Image from 'next/image';
import Link from 'next/link';
import { DollarSign, Truck, CheckCircle2, Clock } from 'lucide-react';
import { getRequestContext } from '@cloudflare/next-on-pages';
import { createDbService } from '@/lib/db';
import { fallbackProducts } from '@/data/fallback-data';
import ContactSection from '@/components/sections/ContactSection';

export default async function WoodChipFirewoodPage() {
  // Get products - try database first, fallback to static data
  let products: Array<{
    id: number;
    name: string;
    slug: string;
    description: string;
    short_description?: string;
    category: string;
    sizes: string[];
    base_price: number;
    price_unit: string;
    available: boolean;
    featured_image?: string;
  }> = [];
  
  try {
    const context = getRequestContext();
    if (context?.env?.DB) {
      const dbService = createDbService(context.env.DB);
      const dbProducts = await dbService.getAvailableProducts();
      
      if (dbProducts && dbProducts.length > 0) {
        products = dbProducts.map(product => ({
          ...product,
          featured_image: product.featured_image_id ? `/api/media/${product.featured_image_id}` : undefined,
          sizes: product.sizes ? JSON.parse(product.sizes) : []
        }));
      }
    }
  } catch {
    console.log('Database not available, using fallback product data');
  }

  // If no database products, use fallback data
  if (products.length === 0) {
    products = fallbackProducts.map(product => ({
      ...product,
      featured_image: product.featured_image,
      sizes: JSON.parse(product.sizes)
    }));
  }

  return (
    <main>
      {/* Hero Section */}
      <section className="relative bg-white" style={{ minHeight: 'calc(100vh - 80px)' }}>
        <div className="grid lg:grid-cols-2" style={{ minHeight: 'calc(100vh - 80px)' }}>
          
          {/* Left Side - Content */}
          <div className="flex items-center p-8 lg:p-16 order-2 lg:order-1">
            <div className="w-full max-w-2xl">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-black leading-tight mb-6">
                Wood Chip & Firewood Canterbury
              </h1>
              <div className="w-16 h-1 mb-8" style={{ backgroundColor: '#F3ED17' }}></div>
              
              <p className="text-xl text-gray-600 leading-relaxed mb-8">
                Quality Wood Products for Canterbury Properties
              </p>

              <p className="text-lg text-gray-700 leading-relaxed mb-12">
                From seasoned firewood to premium mulch and calf bedding, we supply quality wood products across Christchurch and Canterbury. All materials are locally sourced and processed to ensure consistent quality for your home, garden, or farm needs.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="#products"
                  className="inline-flex items-center px-8 py-4 font-semibold text-black hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 group text-lg rounded-sm"
                  style={{ 
                    backgroundColor: '#F3ED17',
                    transition: 'transform 300ms ease-in-out, box-shadow 300ms ease-in-out'
                  }}
                >
                  <DollarSign className="mr-2 h-5 w-5" />
                  View Products & Prices
                </Link>
                
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center px-8 py-4 font-semibold text-gray-700 bg-white border-2 border-gray-300 hover:border-gray-400 hover:scale-105 focus-visible-ring focus-ring-gray-400 text-lg rounded-sm"
                  style={{ 
                    transition: 'transform 300ms ease-in-out, border-color 300ms ease-in-out'
                  }}
                >
                  Get Custom Quote
                </Link>
              </div>
            </div>
          </div>

          {/* Right Side - Hero Image */}
          <div className="relative overflow-hidden order-1 lg:order-2 min-h-[400px] lg:min-h-0">
            <Image
              src="/woodchipandfirewood.webp"
              alt="Wood chip and firewood products for Canterbury properties"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-l from-transparent to-white/20"></div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="w-full px-6 lg:px-12">
          <div className="max-w-7xl mx-auto">
            <div className="mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Why Choose Our Wood Products
              </h2>
              <div className="w-16 h-1 mb-6" style={{ backgroundColor: '#F3ED17' }}></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center p-6 hover:bg-gray-50 transition-colors duration-200 rounded-lg">
                <div className="flex justify-center mb-6">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ backgroundColor: '#F3ED17' }}>
                    <CheckCircle2 className="w-8 h-8 text-black" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Local Canterbury Sourced
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  All materials sourced from Canterbury tree services and local suppliers for consistent quality.
                </p>
              </div>

              <div className="text-center p-6 hover:bg-gray-50 transition-colors duration-200 rounded-lg">
                <div className="flex justify-center mb-6">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ backgroundColor: '#F3ED17' }}>
                    <Clock className="w-8 h-8 text-black" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Properly Seasoned & Processed
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Firewood seasoned for 12+ months, mulch properly composted for optimal garden benefits.
                </p>
              </div>

              <div className="text-center p-6 hover:bg-gray-50 transition-colors duration-200 rounded-lg">
                <div className="flex justify-center mb-6">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ backgroundColor: '#F3ED17' }}>
                    <Truck className="w-8 h-8 text-black" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Canterbury Wide Delivery
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Reliable delivery across Christchurch, Selwyn, and wider Canterbury region.
                </p>
              </div>

              <div className="text-center p-6 hover:bg-gray-50 transition-colors duration-200 rounded-lg">
                <div className="flex justify-center mb-6">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ backgroundColor: '#F3ED17' }}>
                    <DollarSign className="w-8 h-8 text-black" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Competitive Pricing
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Fair, transparent pricing with bulk discounts available for larger orders.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="products" className="py-16 bg-gray-50">
        <div className="w-full px-6 lg:px-12">
          <div className="max-w-7xl mx-auto">
            <div className="mb-12">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Our Products
              </h2>
              <div className="w-16 h-1 mb-6" style={{ backgroundColor: '#F3ED17' }}></div>
              <p className="text-lg text-gray-600 max-w-3xl">
                Browse our range of quality wood products. All prices include delivery within the Canterbury region.
              </p>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
              {products.map((product) => (
                <Link
                  key={product.id}
                  href={`/wood-chip-firewood/${product.slug}`}
                  className="group bg-white rounded-sm shadow-md hover:shadow-lg hover:scale-[1.03] focus:outline-none focus:ring-4 focus:ring-yellow-400 focus:ring-offset-2 overflow-hidden"
                  style={{
                    transition: 'transform 300ms ease-in-out, box-shadow 300ms ease-in-out'
                  }}
                >
                  {/* Product Image */}
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={product.featured_image || '/images/placeholder-product.jpg'}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>

                  {/* Product Content */}
                  <div className="p-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-gray-700 transition-colors">
                      {product.name}
                    </h3>
                    
                    {product.short_description && (
                      <p className="text-gray-600 mb-4 leading-relaxed">
                        {product.short_description}
                      </p>
                    )}

                    {/* Price */}
                    <div className="mb-4">
                      <span className="text-3xl font-bold text-gray-900">
                        {product.base_price > 0 ? `$${product.base_price}` : 'Quote'}
                      </span>
                      {product.price_unit && (
                        <span className="text-gray-600 ml-2">{product.price_unit}</span>
                      )}
                    </div>

                    {/* Sizes Available */}
                    {product.sizes && product.sizes.length > 0 && (
                      <div className="mb-4">
                        <p className="text-sm text-gray-500 mb-2">Available sizes:</p>
                        <div className="flex flex-wrap gap-2">
                          {product.sizes.slice(0, 3).map((size, index) => (
                            <span
                              key={index}
                              className="inline-block px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                            >
                              {size}
                            </span>
                          ))}
                          {product.sizes.length > 3 && (
                            <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                              +{product.sizes.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* View Details Button */}
                    <div className="pt-2">
                      <span className="inline-flex items-center text-sm font-semibold text-black px-2 py-0.5 rounded relative group/readmore">
                        View Details & Order →
                        <span 
                          className="absolute bottom-0 left-2 right-2 h-0.5 transform scale-x-0 group-hover/readmore:scale-x-100 transition-transform duration-200 origin-left"
                          style={{ backgroundColor: '#F3ED17' }}
                        />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <ContactSection 
        title="Need a Custom Quote?"
        subtitle="Looking for specific sizes, custom mixes, or bulk orders? Get in touch and we'll provide a tailored quote for your Canterbury property needs."
      />
    </main>
  );
}