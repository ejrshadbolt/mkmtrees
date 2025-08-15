import Link from 'next/link';
import { MapPin, Phone } from 'lucide-react';
import { businessConfig } from '@/config/business';

const serviceAreas = [
  { name: "West Melton", distance: "Base", responseTime: "Same day" },
  { name: "Christchurch", distance: "20km", responseTime: "Same day" },
  { name: "Rolleston", distance: "10km", responseTime: "Same day" },
  { name: "Selwyn District", distance: "15km", responseTime: "Same day" },
  { name: "Lincoln", distance: "25km", responseTime: "Same day" },
  { name: "Halswell", distance: "25km", responseTime: "Same day" },
  { name: "Riccarton", distance: "20km", responseTime: "Same day" },
  { name: "Marshland", distance: "35km", responseTime: "1 hour" },
  { name: "Sumner", distance: "30km", responseTime: "1 hour" },
  { name: "Lyttelton", distance: "35km", responseTime: "1 hour" },
  { name: "Darfield", distance: "25km", responseTime: "Same day" },
  { name: "Banks Peninsula", distance: "50km", responseTime: "1-2 hours" },
  { name: "Leeston", distance: "35km", responseTime: "1 hour" },
  { name: "Ashburton", distance: "75km", responseTime: "1-2 hours" },
  { name: "Rakaia", distance: "65km", responseTime: "1-2 hours" },
  { name: "Methven", distance: "85km", responseTime: "2-3 hours" },
  { name: "Duvauchelle", distance: "70km", responseTime: "1-2 hours" },
  { name: "Akaroa", distance: "90km", responseTime: "2-3 hours" },
  { name: "Geraldine", distance: "130km", responseTime: "On request" },
  { name: "Waimate", distance: "150km", responseTime: "On request" },
  { name: "Rural Canterbury", distance: "Varies", responseTime: "Same day" },
  { name: "High Country Stations", distance: "Varies", responseTime: "On request" }
];


export default function ServiceAreasCore() {
  return (
    <section className="py-16 bg-white">
      <div className="w-full px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          
          {/* Header */}
          <div className="mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Where We Operate
            </h2>
            <div className="w-16 h-1 mb-8" style={{ backgroundColor: '#F3ED17' }}></div>
            <p className="text-lg text-gray-600 max-w-4xl">
              Based in Canterbury, we serve tree and land clearing operations across the Canterbury region with rapid response times.
            </p>
          </div>

          {/* Main Layout - Left sidebar + Right content */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            
            {/* Left Sidebar - Business Info */}
            <div className="lg:col-span-1">
              <div className="sticky top-40">
                <div className="bg-gray-50 border-l-4 p-8 shadow-sm hover:shadow-lg transition-shadow duration-200" style={{ borderLeftColor: '#F3ED17' }}>
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 flex items-center justify-center mr-4" style={{ backgroundColor: '#F3ED17' }}>
                      <MapPin className="w-6 h-6 text-black" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">Main Base</h3>
                      <p className="text-gray-600 text-sm">Canterbury</p>
                    </div>
                  </div>

                  <div className="space-y-4 mb-6">
                    <div>
                      <p className="font-semibold mb-2 text-gray-900">Address:</p>
                      <p className="text-sm text-gray-600">
                        Weedons Ross Road<br />
                        West Melton 7671<br />
                        New Zealand
                      </p>
                    </div>

                    <div>
                      <p className="font-semibold mb-2 text-gray-900">Service Hours:</p>
                      <p className="text-sm text-gray-600">
                        Monday - Friday: 7:00 AM - 5:00 PM<br />
                        Saturday: 8:00 AM - 12:00 PM<br />
                        24/7 Emergency Service
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Link
                      href={`tel:${businessConfig.contact.phone}`}
                      className="w-full text-black font-semibold py-3 px-4 flex items-center justify-center hover:shadow-lg hover:scale-105 focus-visible-ring focus-ring-yellow group relative rounded-sm"
                      style={{ 
                        backgroundColor: '#F3ED17',
                        transition: 'transform 300ms ease-in-out, box-shadow 300ms ease-in-out'
                      }}
                    >
                      <Phone className="w-4 h-4 mr-2" />
                      <span className="relative">
                        {businessConfig.contact.phone}
                        <span 
                          className="absolute -bottom-1 left-0 right-0 h-0.5 bg-black transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"
                        />
                      </span>
                    </Link>
                    
                    <Link
                      href="/contact"
                      className="w-full border-2 border-gray-300 text-gray-700 bg-white font-semibold py-3 px-4 text-center hover:border-gray-400 hover:scale-105 focus-visible-ring focus-ring-gray-400 block rounded-sm"
                      style={{ 
                        transition: 'transform 300ms ease-in-out, border-color 300ms ease-in-out'
                      }}
                    >
                      Get Quote
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Content - Map and Service Areas */}
            <div className="lg:col-span-3">
              <div className="bg-white p-8 shadow-sm">
                <h3 className="text-2xl font-bold mb-6 text-gray-900">We Service All Canterbury</h3>
                
                {/* Service Area Map */}
                <div className="mb-8 aspect-[2/1] border-4 border-gray-200 hover:border-yellow-400 transition-colors duration-200 overflow-hidden">
                  <iframe 
                    src="https://www.google.com/maps/d/u/0/embed?mid=1AXHdgB0QVARvBWqs_EQ9WwiuJUNuxm8&ehbc=2E312F" 
                    width="100%" 
                    height="100%" 
                    style={{ border: 0, marginTop: '-70px', height: 'calc(100% + 70px)' }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="MKM Trees Service Areas Map - Canterbury Coverage"
                  />
                </div>

                {/* Service Areas Grid */}
                <div className="mb-8">
                  <h4 className="text-lg font-semibold mb-4 text-gray-900">We proudly service these areas:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {serviceAreas.map((area, index) => (
                      <div 
                        key={index}
                        className="bg-gray-50 p-4 border-l-4 border-gray-200 hover:border-yellow-400 hover:scale-105 hover:shadow-lg transition-all duration-200 group cursor-pointer"
                      >
                        <h5 className="font-bold text-gray-900 mb-2 group-hover:text-gray-700">{area.name}</h5>
                        <div className="text-sm text-gray-600 space-y-1">
                          <p>{area.distance}</p>
                          <p className="font-medium text-black relative inline-block">
                            {area.responseTime}
                            <span className="absolute bottom-0 left-0 right-0 h-0.5" style={{ backgroundColor: '#F3ED17' }}></span>
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>


                {/* Bottom CTA */}
                <div className="text-black p-6 hover:shadow-lg transition-shadow duration-200" style={{ backgroundColor: '#F3ED17' }}>
                  <h4 className="font-bold text-lg mb-2">Need service outside these areas?</h4>
                  <p className="text-sm mb-4">
                    Contact us to discuss your requirements. We regularly service special projects throughout Canterbury and beyond.
                  </p>
                  <Link
                    href="/contact"
                    className="inline-flex items-center font-semibold hover:underline"
                  >
                    Contact us about your area →
                  </Link>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}