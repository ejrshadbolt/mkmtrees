import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const portfolioImages = [
  {
    src: "https://placehold.co/400x300/2d5016/ffffff?text=Tree+Removal+Project",
    alt: "Professional tree removal in Canterbury",
    title: "Urban Tree Removal"
  },
  {
    src: "https://placehold.co/400x300/4a5568/ffffff?text=Land+Clearing+Project",
    alt: "Land clearing and earthworks in Selwyn",
    title: "Lifestyle Block Clearing"
  },
  {
    src: "https://placehold.co/400x300/8b4513/ffffff?text=Emergency+Callout",
    alt: "Emergency storm cleanup in Banks Peninsula",
    title: "Storm Damage Cleanup"
  }
];

export default function PortfolioPreview() {
  return (
    <section className="py-16 bg-white">
      <div className="w-full px-6 lg:px-12">
        {/* Title */}
        <div className="mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
            Recent Work
          </h2>
          <div className="w-16 h-1 mb-6" style={{ backgroundColor: '#F3ED17' }}></div>
          <p className="text-lg text-gray-600 max-w-3xl">
            See our latest tree services and land clearing projects across Canterbury.
          </p>
        </div>

        {/* Images Grid - Full Width */}
        <div className="w-full -mx-6 lg:-mx-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            {portfolioImages.map((image, index) => (
              <div 
                key={index}
                className="group relative overflow-hidden bg-gray-200 aspect-[16/9] hover:scale-[1.02] transition-all duration-300"
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-110"
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-40 transition-all duration-300"></div>
                
                {/* Title Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                  <h3 className="text-2xl font-bold transition-colors duration-300 group-hover:text-yellow-400">
                    {image.title}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* View Portfolio Button */}
        <div className="text-center mt-12">
          <Link
            href="/portfolio"
            className="inline-flex items-center px-8 py-3 font-semibold text-black transition-all duration-200 hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 group"
            style={{ backgroundColor: '#F3ED17' }}
          >
            View Portfolio
            <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}