import Link from 'next/link';
import { Phone, Mail, MapPin, Clock, ArrowRight } from 'lucide-react';
import { businessConfig } from '@/config/business';

export default function ContactMap() {
  return (
    <section className="bg-white">
      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[600px]">
        
        {/* Left Side - Service Area Map */}
        <div className="relative bg-gray-300">
          <iframe 
            src="https://www.google.com/maps/d/u/0/embed?mid=1AXHdgB0QVARvBWqs_EQ9WwiuJUNuxm8" 
            width="100%" 
            height="100%" 
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="MKM Trees Service Areas Map"
          />
        </div>
        
        {/* Right Side - Contact Information */}
        <div className="flex items-center p-8 lg:p-16 bg-white">
          <div className="w-full">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Find Us & Service Areas
            </h2>
            <div className="w-16 h-1 mb-8" style={{ backgroundColor: '#F3ED17' }}></div>

            <div className="space-y-8 mb-8">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Get In Touch
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#F3ED17' }}>
                      <Phone className="w-6 h-6 text-black" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Phone</p>
                      <Link
                        href={`tel:${businessConfig.contact.phone}`}
                        className="text-lg font-semibold text-gray-900 hover:text-gray-700 transition-colors"
                      >
                        {businessConfig.contact.phone}
                      </Link>
                      <p className="text-sm text-gray-500 mt-1">Available 24/7 for emergencies</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#F3ED17' }}>
                      <Mail className="w-6 h-6 text-black" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Email</p>
                      <Link
                        href={`mailto:${businessConfig.contact.email}`}
                        className="text-lg font-semibold text-gray-900 hover:text-gray-700 transition-colors break-all"
                      >
                        {businessConfig.contact.email}
                      </Link>
                      <p className="text-sm text-gray-500 mt-1">Response within 24 hours</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Service Coverage
                </h3>
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#F3ED17' }}>
                    <MapPin className="w-6 h-6 text-black" />
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-gray-900 mb-2">
                      Canterbury & Surrounding Areas
                    </p>
                    <p className="text-gray-600 text-sm leading-relaxed mb-4">
                      We service all of Canterbury from Christchurch city to rural high country stations. 
                      Including Selwyn District, Ashburton, Banks Peninsula, and surrounding areas.
                    </p>
                    <Link
                      href="/service-areas"
                      className="inline-flex items-center px-6 py-3 font-semibold text-black hover:scale-105 hover:shadow-lg focus-visible-ring focus-ring-yellow transition-all duration-200 group relative rounded-sm"
                      style={{ backgroundColor: '#F3ED17' }}
                    >
                      <span className="relative">
                        View All Service Areas
                        <span 
                          className="absolute -bottom-1 left-0 right-0 h-0.5 bg-black transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"
                        />
                      </span>
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                    </Link>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Emergency Services
                </h3>
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#F3ED17' }}>
                    <Clock className="w-6 h-6 text-black" />
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-gray-900 mb-2">
                      24/7 Emergency Callouts
                    </p>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      Storm damage, fallen trees, blocked access - we&apos;re available around the clock 
                      for urgent tree service emergencies across Canterbury.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom CTA */}
            <div className="pt-8 border-t border-gray-200">
              <Link
                href={`tel:${businessConfig.contact.phone}`}
                className="inline-flex items-center px-8 py-4 font-semibold text-black hover:scale-105 hover:shadow-lg focus-visible-ring focus-ring-yellow transition-all duration-200 group text-lg relative rounded-sm"
                style={{ backgroundColor: '#F3ED17' }}
              >
                <Phone className="mr-2 h-5 w-5" />
                <span className="relative">
                  Call for Emergency Support
                  <span 
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-black transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"
                  />
                </span>
                <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}