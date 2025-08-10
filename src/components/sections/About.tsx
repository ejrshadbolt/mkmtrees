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
                  className="inline-flex items-center px-8 py-3 font-semibold text-black transition-all duration-200 hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 group"
                  style={{ backgroundColor: '#F3ED17' }}
                >
                  Read More About Us
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
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