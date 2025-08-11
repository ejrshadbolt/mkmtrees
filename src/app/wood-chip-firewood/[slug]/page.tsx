import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, DollarSign, Truck, CheckCircle, Package, Phone } from 'lucide-react';
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
      <section className="py-16 bg-white">
        <div className="w-full px-6 lg:px-12">
          <div className="max-w-7xl mx-auto">
            {/* Back Link */}
            <Link 
              href="/wood-chip-firewood-canterbury"
              className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors mb-8 group"
            >
              <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
              Back to Wood Chip & Firewood
            </Link>

            <div className="grid lg:grid-cols-2 gap-12 items-start">
              {/* Product Image */}
              <div className="relative">
                {product.featured_image && (
                  <div className="relative aspect-[4/3] rounded-lg overflow-hidden shadow-xl">
                    <Image
                      src={product.featured_image}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
              </div>

              {/* Product Details */}
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                  {product.name}
                </h1>
                <div className="w-16 h-1 mb-6" style={{ backgroundColor: '#F3ED17' }}></div>
                
                {product.short_description && (
                  <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                    {product.short_description}
                  </p>
                )}

                {/* Price */}
                <div className="mb-8 p-6 bg-gray-50 rounded-lg border-l-4" style={{ borderColor: '#F3ED17' }}>
                  <div className="flex items-center mb-2">
                    <DollarSign className="w-6 h-6 mr-2" style={{ color: '#F3ED17' }} />
                    <span className="text-lg font-semibold text-gray-900">Pricing</span>
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-2">
                    {product.base_price > 0 ? `$${product.base_price}` : 'Quote Required'}
                  </div>
                  {product.price_unit && (
                    <p className="text-gray-600">{product.price_unit}</p>
                  )}
                </div>

                {/* Sizes Available */}
                {product.sizes && product.sizes.length > 0 && (
                  <div className="mb-8">
                    <div className="flex items-center mb-4">
                      <Package className="w-6 h-6 mr-2" style={{ color: '#F3ED17' }} />
                      <h3 className="text-lg font-semibold text-gray-900">Available Sizes</h3>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {product.sizes.map((size: string, index: number) => (
                        <div
                          key={index}
                          className="flex items-center p-3 bg-white border border-gray-200 rounded-lg hover:border-yellow-400 transition-colors"
                        >
                          <CheckCircle className="w-5 h-5 mr-3" style={{ color: '#F3ED17' }} />
                          <span className="text-gray-700">{size}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                  <Link
                    href={`tel:${businessConfig.contact.phone}`}
                    className="inline-flex items-center px-8 py-4 font-semibold text-black transition-all duration-200 hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 group text-lg"
                    style={{ backgroundColor: '#F3ED17' }}
                  >
                    <Phone className="mr-2 h-5 w-5" />
                    Call to Order
                  </Link>
                  
                  <Link
                    href="/contact"
                    className="inline-flex items-center px-8 py-4 font-semibold text-black bg-transparent border-2 border-black hover:bg-black hover:text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 text-lg"
                  >
                    Get Written Quote
                  </Link>
                </div>

                {/* Delivery Info */}
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center mb-2">
                    <Truck className="w-5 h-5 mr-2 text-blue-600" />
                    <span className="font-semibold text-blue-900">Canterbury Wide Delivery</span>
                  </div>
                  <p className="text-blue-700 text-sm">
                    Free delivery within 20km of Christchurch. Delivery charges may apply for remote areas.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Description */}
      <section className="py-16 bg-gray-50">
        <div className="w-full px-6 lg:px-12">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              Product Details
            </h2>
            <div className="w-16 h-1 mb-8" style={{ backgroundColor: '#F3ED17' }}></div>

            {/* Product Content */}
            <div className="prose prose-lg max-w-none">
              <div 
                className="text-lg text-gray-700 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: product.description }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="w-full px-6 lg:px-12">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Quality Guarantee
              </h2>
              <div className="w-16 h-1 mx-auto mb-6" style={{ backgroundColor: '#F3ED17' }}></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center p-6 hover:bg-gray-50 transition-colors duration-200 rounded-lg">
                <div className="flex justify-center mb-6">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ backgroundColor: '#F3ED17' }}>
                    <CheckCircle className="w-8 h-8 text-black" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Quality Tested
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  All products tested and processed to ensure consistent quality and performance.
                </p>
              </div>

              <div className="text-center p-6 hover:bg-gray-50 transition-colors duration-200 rounded-lg">
                <div className="flex justify-center mb-6">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ backgroundColor: '#F3ED17' }}>
                    <Truck className="w-8 h-8 text-black" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Reliable Delivery
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Professional delivery service across Canterbury with flexible scheduling.
                </p>
              </div>

              <div className="text-center p-6 hover:bg-gray-50 transition-colors duration-200 rounded-lg">
                <div className="flex justify-center mb-6">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ backgroundColor: '#F3ED17' }}>
                    <Phone className="w-8 h-8 text-black" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Local Support
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Canterbury-based team ready to help with product selection and ordering.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ContactSection 
        title="Ready to Order?"
        subtitle="Call us now or get in touch for bulk pricing, custom mixes, or to arrange delivery to your Canterbury property."
      />
    </main>
  );
}