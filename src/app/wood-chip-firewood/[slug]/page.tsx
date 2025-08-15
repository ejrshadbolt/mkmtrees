import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, DollarSign, Truck, CheckCircle, Package, Phone, ArrowRight, Shield, Clock } from 'lucide-react';
import { getRequestContext } from '@cloudflare/next-on-pages';
import { createDbService } from '@/lib/db';
import { fallbackProducts } from '@/data/fallback-data';
import ContactSection from '@/components/sections/ContactSection';
import { businessConfig } from '@/config/business';

export const runtime = 'edge';

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  // Get the specific product - try database first, fallback to static data
  let product = null;
  
  try {
    const context = getRequestContext();
    if (context?.env?.DB) {
      const dbService = createDbService(context.env.DB);
      const dbProduct = await dbService.getProductBySlug(slug);
      
      if (dbProduct) {
        product = {
          ...dbProduct,
          featured_image: dbProduct.featured_image_id ? `/api/media/${dbProduct.featured_image_id}` : undefined,
          sizes: dbProduct.sizes ? JSON.parse(dbProduct.sizes) : []
        };
      }
    }
  } catch {
    console.log('Database not available, using fallback product data');
  }

  // If no database product, check fallback data
  if (!product) {
    const fallbackProduct = fallbackProducts.find(p => p.slug === slug);
    if (fallbackProduct) {
      product = {
        ...fallbackProduct,
        featured_image: fallbackProduct.featured_image,
        sizes: JSON.parse(fallbackProduct.sizes)
      };
    }
  }

  if (!product) {
    notFound();
  }

  return (
    <main>
      {/* Hero Section */}
      <section className="relative bg-white" style={{ minHeight: 'calc(100vh - 80px)' }}>
        <div className="grid lg:grid-cols-2" style={{ minHeight: 'calc(100vh - 80px)' }}>
          
          {/* Left Side - Content */}
          <div className="flex items-center p-8 lg:p-16 order-2 lg:order-1">
            <div className="w-full max-w-2xl">
              {/* Back Link */}
              <Link 
                href="/wood-chip-firewood-canterbury"
                className="inline-flex items-center text-gray-600 hover:text-gray-700 transition-colors mb-6 group relative"
              >
                <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
                <span className="relative">
                  Back to Products
                  <span 
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gray-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"
                  />
                </span>
              </Link>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-black leading-tight mb-6">
                {product.name}
              </h1>
              <div className="w-16 h-1 mb-8" style={{ backgroundColor: '#F3ED17' }}></div>
              
              {product.short_description && (
                <p className="text-xl text-gray-600 leading-relaxed mb-8">
                  {product.short_description}
                </p>
              )}

              {/* Price Display */}
              <div className="bg-gray-50 border-l-4 p-6 mb-8 hover:border-yellow-400 transition-colors duration-200" style={{ borderLeftColor: '#F3ED17' }}>
                <div className="flex items-center mb-2">
                  <DollarSign className="w-6 h-6 mr-2 text-black" />
                  <span className="text-lg font-semibold text-gray-900">Pricing</span>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {product.base_price > 0 ? `$${product.base_price}` : 'Quote Required'}
                </div>
                {product.price_unit && (
                  <p className="text-gray-600">{product.price_unit}</p>
                )}
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href={`tel:${businessConfig.contact.phone}`}
                  className="inline-flex items-center px-8 py-4 font-semibold text-black hover:scale-105 hover:shadow-lg focus-visible-ring focus-ring-yellow group text-lg relative rounded-sm"
                  style={{ 
                    backgroundColor: '#F3ED17',
                    transition: 'transform 300ms ease-in-out, box-shadow 300ms ease-in-out'
                  }}
                >
                  <Phone className="mr-2 h-5 w-5" />
                  <span className="relative">
                    Call to Order
                    <span 
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-black transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"
                    />
                  </span>
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" />
                </Link>
                
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center px-8 py-4 font-semibold text-gray-700 bg-white border-2 border-gray-300 hover:border-gray-400 hover:scale-105 focus-visible-ring focus-ring-gray-400 text-lg rounded-sm"
                  style={{ 
                    transition: 'transform 300ms ease-in-out, border-color 300ms ease-in-out'
                  }}
                >
                  Get Written Quote
                </Link>
              </div>
            </div>
          </div>

          {/* Right Side - Hero Image */}
          <div className="relative overflow-hidden order-1 lg:order-2 min-h-[400px] lg:min-h-0">
            {product.featured_image && (
              <Image
                src={product.featured_image}
                alt={product.name}
                fill
                className="object-cover"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-l from-transparent to-white/20"></div>
          </div>
        </div>
      </section>

      {/* Sizes & Details Section */}
      {product.sizes && product.sizes.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="w-full px-6 lg:px-12">
            <div className="max-w-7xl mx-auto">
              <div className="mb-12">
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                  Available Sizes
                </h2>
                <div className="w-16 h-1 mb-6" style={{ backgroundColor: '#F3ED17' }}></div>
                <p className="text-lg text-gray-600 max-w-3xl">
                  Choose from our range of sizes to suit your project needs. All sizes include delivery within Canterbury.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {product.sizes.map((size: string, index: number) => (
                  <div
                    key={index}
                    className="bg-white p-6 border-l-4 border-gray-200 hover:border-yellow-400 hover:shadow-lg transition-all duration-200 group cursor-pointer rounded-sm"
                  >
                    <div className="flex items-center">
                      <div className="w-12 h-12 rounded-full flex items-center justify-center mr-4" style={{ backgroundColor: '#F3ED17' }}>
                        <Package className="w-6 h-6 text-black" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 group-hover:text-gray-700">{size}</h3>
                        <p className="text-sm text-gray-600">Available now</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Product Description */}
      <section className="bg-white">
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[500px]">
          
          {/* Content Column */}
          <div className="bg-white flex items-center p-8 lg:p-16 order-1 lg:order-1">
            <div className="w-full space-y-6">
              <div className="mb-8">
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
                  Product Details
                </h2>
                <div className="w-16 h-1" style={{ backgroundColor: '#F3ED17' }}></div>
              </div>
              
              <div 
                className="text-gray-600 text-lg leading-relaxed prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: product.description.replace(/\n/g, '<br />') }}
              />
            </div>
          </div>

          {/* Image Column */}
          <div className="relative overflow-hidden bg-gray-200 order-2 lg:order-2 min-h-[400px] lg:min-h-0">
            {product.featured_image && (
              <Image
                src={product.featured_image}
                alt={`${product.name} details`}
                fill
                className="object-cover"
              />
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="w-full px-6 lg:px-12">
          <div className="max-w-7xl mx-auto">
            <div className="mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Why Choose Our {product.name}
              </h2>
              <div className="w-16 h-1 mb-6" style={{ backgroundColor: '#F3ED17' }}></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="text-center p-6 hover:bg-gray-50 transition-colors duration-200 rounded-lg">
                <div className="flex justify-center mb-6">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ backgroundColor: '#F3ED17' }}>
                    <CheckCircle className="w-8 h-8 text-black" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Canterbury Sourced
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Locally sourced and processed right here in Canterbury for consistent quality and freshness.
                </p>
              </div>

              <div className="text-center p-6 hover:bg-gray-50 transition-colors duration-200 rounded-lg">
                <div className="flex justify-center mb-6">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ backgroundColor: '#F3ED17' }}>
                    <Shield className="w-8 h-8 text-black" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Quality Tested
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Every batch tested and processed to ensure consistent quality and performance for your needs.
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
                  Professional delivery service across Canterbury with flexible scheduling to suit your timeline.
                </p>
              </div>
            </div>

            {/* Delivery Info Banner */}
            <div className="mt-12 text-black p-8 hover:shadow-lg transition-shadow duration-200 rounded-sm" style={{ backgroundColor: '#F3ED17' }}>
              <div className="max-w-4xl mx-auto text-center">
                <div className="flex justify-center mb-4">
                  <Truck className="w-8 h-8 text-black" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Free Delivery Available</h3>
                <p className="text-lg mb-4">
                  Free delivery within 20km of our West Melton base. Delivery charges may apply for remote Canterbury areas.
                </p>
                <Link
                  href="/contact"
                  className="inline-flex items-center font-semibold hover:underline text-lg"
                >
                  Check delivery to your area →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ContactSection 
        title="Ready to Order?"
        subtitle="Call us now or get in touch for bulk pricing, custom delivery scheduling, or to discuss your specific project needs."
      />
    </main>
  );
}