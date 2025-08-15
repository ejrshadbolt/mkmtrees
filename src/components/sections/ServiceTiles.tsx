import Image from 'next/image';
import Link from 'next/link';

interface ServiceTile {
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  href: string;
}

interface ServiceTilesProps {
  title?: string;
  subtitle?: string;
  services: ServiceTile[];
}

export default function ServiceTiles({ title, subtitle, services }: ServiceTilesProps) {
  return (
    <section className="py-16 bg-white">
      <div className="w-full px-6 lg:px-12">
        {title && (
          <div className="mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
              {title}
            </h2>
            <div className="w-16 h-1 mb-6" style={{ backgroundColor: '#F3ED17' }}></div>
            {subtitle && (
              <p className="text-lg text-gray-600 max-w-3xl">
                {subtitle}
              </p>
            )}
          </div>
        )}
      </div>
      
      {/* Tiles Container - 80% width */}
      <div className="w-4/5 mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <Link
              key={index}
              href={service.href}
              className="group relative overflow-hidden bg-black aspect-[4/3] transition-transform duration-300 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-yellow-400 focus:ring-offset-2"
            >
              {/* Background Image */}
              <div className="absolute inset-0">
                <Image
                  src={service.image}
                  alt={service.imageAlt}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-110"
                />
                {/* Dark Overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-25 group-hover:bg-opacity-15 transition-all duration-300"></div>
              </div>

              {/* Content */}
              <div className="absolute inset-0 p-6 flex flex-col justify-end">
                <h3 className="text-xl font-bold text-white mb-2 transition-colors duration-300 group-hover:text-[#F3ED17]" style={{ textShadow: '1px 1px 2px rgba(0, 0, 0, 0.7)' }}>
                  {service.title}
                </h3>
                <p className="text-sm text-gray-200 leading-relaxed" style={{ textShadow: '1px 1px 2px rgba(0, 0, 0, 0.6)' }}>
                  {service.description}
                </p>
              </div>

              {/* Hover Effect Border */}
              <div className="absolute inset-0 border-2 border-transparent group-hover:border-[#F3ED17] transition-colors duration-300"></div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}