import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface AboutProps {
  title?: string;
  content: string;
  image: string;
  imageAlt: string;
  showReadMore?: boolean;
}

export default function About({ title, content, image, imageAlt, showReadMore = false }: AboutProps) {
  return (
    <section className="bg-white">
      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[500px]">
        {/* Content Column - Left */}
        <div className="bg-white flex items-center p-8 lg:p-16">
          <div className="w-full space-y-6">
            {title && (
              <div className="mb-8">
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
                  {title}
                </h2>
                <div className="w-16 h-1" style={{ backgroundColor: '#F3ED17' }}></div>
              </div>
            )}
            
            <div 
              className="text-gray-600 text-lg leading-relaxed prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: content.replace(/\n/g, '<br />') }}
            />
            
            {showReadMore && (
              <div className="pt-6">
                <Link
                  href="/about"
                  className="inline-flex items-center px-8 py-3 font-semibold text-black hover:scale-105 hover:shadow-lg focus-visible-ring focus-ring-yellow group relative"
                  style={{ 
                    backgroundColor: '#F3ED17',
                    transition: 'transform 300ms ease-in-out, box-shadow 300ms ease-in-out'
                  }}
                >
                  <span className="relative">
                    Read More About Us
                    <span 
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-black transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"
                    />
                  </span>
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </div>
            )}
          </div>
        </div>
        
        {/* Image Column - Right */}
        <div className="relative overflow-hidden bg-gray-200">
          <Image
            src={image}
            alt={imageAlt}
            fill
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}