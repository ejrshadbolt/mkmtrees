import Link from 'next/link';
import { Phone } from 'lucide-react';
import { businessConfig } from '@/config/business';

interface ServiceArea {
  title: string;
  description: string;
}

const serviceAreas: ServiceArea[] = [
  {
    title: "Christchurch Tree Services",
    description: "We service all Christchurch suburbs, including Halswell, Riccarton, Marshland, Fendalton, Sumner, and Hornby. Whether you need storm damage cleanup, tree removals, or stump grinding — we've got Christchurch covered."
  },
  {
    title: "Selwyn District – Rolleston, Lincoln, Leeston",
    description: "Our crew regularly works on lifestyle blocks and farms throughout Selwyn. From tree topping to firebreak creation and land clearing, we've built long-term relationships across the district."
  },
  {
    title: "Ashburton & Mid-Canterbury",
    description: "We provide reliable arborist and land services in Ashburton, Methven, Rakaia, and nearby towns. If you need tree work, paddock mulching or post-storm emergency clearing — we're here fast."
  },
  {
    title: "Banks Peninsula – Lyttelton, Akaroa, Duvauchelle",
    description: "We're equipped for steep, sloped, and tight-access work across the peninsula. Tree removals, reduction, or storm prep — we handle it safely and cleanly."
  },
  {
    title: "Rural Canterbury & High Country Stations",
    description: "From hill country blocks to large stations, we've got the gear and experience for heavy-duty land clearing, emergency callouts, and seasonal prep. Based locally and used in remote terrain."
  },
  {
    title: "Need a Service in Your Area?",
    description: "We're based in Canterbury — and we work everywhere from town to paddock. If you're outside these towns but nearby, reach out — chances are we're already doing jobs in your area."
  }
];

export default function ServiceAreasGrid() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="w-full px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          {/* Section Title */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
              Our Core Service Areas
            </h2>
            <div className="w-16 h-1 mx-auto" style={{ backgroundColor: '#F3ED17' }}></div>
          </div>

          {/* Service Areas Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {serviceAreas.map((area, index) => (
              <div 
                key={index}
                className="bg-white p-8 shadow-sm border-l-4 border-gray-200 hover:border-yellow-400 hover:scale-105 transition-all duration-200 group"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-4 leading-tight">
                  {area.title}
                </h3>
                
                <p className="text-gray-600 text-sm leading-relaxed mb-6">
                  {area.description}
                </p>
                
                {/* Call Now Button */}
                <div className="flex justify-center">
                  <Link
                    href={`tel:${businessConfig.contact.phone}`}
                    className="inline-flex items-center px-6 py-3 font-semibold text-black transition-all duration-200 hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 group/button"
                    style={{ backgroundColor: '#F3ED17' }}
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    Call Now
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}