import Link from 'next/link';
import { ArrowRight, MapPin } from 'lucide-react';

const serviceAreas = [
  {
    title: "Christchurch",
    areas: ["Halswell", "Riccarton", "Marshland", "Fendalton"]
  },
  {
    title: "Selwyn District", 
    areas: ["Rolleston", "Lincoln", "Leeston", "Darfield"]
  },
  {
    title: "Banks Peninsula",
    areas: ["Lyttelton", "Akaroa", "Duvauchelle"]
  },
  {
    title: "Ashburton",
    areas: ["Methven", "Rakaia", "Geraldine"]
  },
  {
    title: "Rural Canterbury",
    areas: ["High Country", "Stations", "Lifestyle Blocks"]
  }
];

export default function ServiceAreasPreview() {
  return (
    <section className="py-16 bg-white">
      <div className="w-full px-6 lg:px-12">
        {/* Title */}
        <div className="mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
            Serving All of Canterbury
          </h2>
          <div className="w-16 h-1 mb-6" style={{ backgroundColor: '#F3ED17' }}></div>
          <p className="text-lg text-gray-600 max-w-3xl">
            Professional tree services and land clearing from Christchurch suburbs to rural high country stations. 
            We&apos;re already working in your area.
          </p>
        </div>

        {/* Service Areas Grid */}
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-12">
            {serviceAreas.map((area, index) => (
              <div 
                key={index}
                className="bg-gray-50 p-6 shadow-sm border-l-4 border-gray-200 hover:border-yellow-400 hover:scale-105 transition-all duration-200 group"
              >
                {/* Icon */}
                <div className="flex justify-start mb-4">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-200" style={{ backgroundColor: '#F3ED17' }}>
                    <MapPin className="w-6 h-6 text-black" />
                  </div>
                </div>

                {/* Area Title */}
                <h3 className="text-lg font-bold text-gray-900 mb-3 text-left">
                  {area.title}
                </h3>

                {/* Sub-areas */}
                <div className="text-sm text-gray-600 space-y-1">
                  {area.areas.map((subArea, subIndex) => (
                    <div key={subIndex} className="flex items-center justify-start">
                      <span className="w-1.5 h-1.5 rounded-full mr-2 flex-shrink-0" style={{ backgroundColor: '#F3ED17' }}></span>
                      {subArea}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Call-to-Action */}
          <div className="text-center">
            <Link
              href="/service-areas"
              className="inline-flex items-center px-8 py-3 font-semibold text-black transition-all duration-200 hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 group"
              style={{ backgroundColor: '#F3ED17' }}
            >
              View All Service Areas
              <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}