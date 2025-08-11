import Link from 'next/link';
import { Phone, Mail, MapPin, Clock, ArrowRight } from 'lucide-react';
import { businessConfig } from '@/config/business';

export default function ContactMap() {
  return (
    <section className="bg-white">
      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[600px]">
        
        {/* Left Side - Map Placeholder */}
        <div className="relative bg-gray-300">
          {/* Map Placeholder - In real implementation, embed Google Maps */}
          <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
            <div className="text-center p-8">
              <MapPin className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-600 text-lg mb-4">Interactive Map Coming Soon</p>
              <p className="text-gray-500">Canterbury & Surrounding Areas Service Coverage</p>
            </div>
          </div>
          
          {/* Map would go here */}
          {/* 
          <iframe 
            src="https://www.google.com/maps/embed?..." 
            width="100%" 
            height="100%" 
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
          */}
        </div>
        
        {/* Right Side - Contact Information */}
        <div className="flex items-center p-8 lg:p-16" style={{ backgroundColor: '#050608' }}>
          <div className="w-full">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Find Us & Service Areas
            </h2>
            <div className="w-16 h-1 mb-8" style={{ backgroundColor: '#F3ED17' }}></div>

            <div className="space-y-8 mb-8">
              <div>
                <h3 className="text-2xl font-bold text-white mb-4">
                  Get In Touch
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-4">
                    <Phone className="w-6 h-6 mt-1 flex-shrink-0" style={{ color: '#F3ED17' }} />
                    <div>
                      <p className="text-sm text-gray-400 mb-1">Phone</p>
                      <Link
                        href={`tel:${businessConfig.contact.phone}`}
                        className="text-lg font-semibold text-white hover:text-yellow-400 transition-colors"
                      >
                        {businessConfig.contact.phone}
                      </Link>
                      <p className="text-sm text-gray-400 mt-1">Available 24/7 for emergencies</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <Mail className="w-6 h-6 mt-1 flex-shrink-0" style={{ color: '#F3ED17' }} />
                    <div>
                      <p className="text-sm text-gray-400 mb-1">Email</p>
                      <Link
                        href={`mailto:${businessConfig.contact.email}`}
                        className="text-lg font-semibold text-white hover:text-yellow-400 transition-colors break-all"
                      >
                        {businessConfig.contact.email}
                      </Link>
                      <p className="text-sm text-gray-400 mt-1">Response within 24 hours</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-bold text-white mb-4">
                  Service Coverage
                </h3>
                <div className="flex items-start space-x-4">
                  <MapPin className="w-6 h-6 mt-1 flex-shrink-0" style={{ color: '#F3ED17' }} />
                  <div>
                    <p className="text-lg font-semibold text-white mb-2">
                      Canterbury & Surrounding Areas
                    </p>
                    <p className="text-gray-400 text-sm leading-relaxed mb-4">
                      We service all of Canterbury from Christchurch city to rural high country stations. 
                      Including Selwyn District, Ashburton, Banks Peninsula, and surrounding areas.
                    </p>
                    <Link
                      href="/service-areas"
                      className="inline-flex items-center text-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 px-2 py-0.5 rounded relative group"
                      style={{ color: '#F3ED17' }}
                    >
                      View All Service Areas
                      <ArrowRight className="ml-1 h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                      <span 
                        className="absolute bottom-0 left-2 right-2 h-0.5 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left"
                        style={{ backgroundColor: '#F3ED17' }}
                      />
                    </Link>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-bold text-white mb-4">
                  Emergency Services
                </h3>
                <div className="flex items-start space-x-4">
                  <Clock className="w-6 h-6 mt-1 flex-shrink-0" style={{ color: '#F3ED17' }} />
                  <div>
                    <p className="text-lg font-semibold text-white mb-2">
                      24/7 Emergency Callouts
                    </p>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      Storm damage, fallen trees, blocked access - we&apos;re available around the clock 
                      for urgent tree service emergencies across Canterbury.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom CTA */}
            <div className="pt-8 border-t border-gray-700">
              <Link
                href={`tel:${businessConfig.contact.phone}`}
                className="inline-flex items-center px-8 py-4 font-semibold text-black transition-all duration-200 hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 group text-lg"
                style={{ backgroundColor: '#F3ED17' }}
              >
                <Phone className="mr-2 h-5 w-5" />
                Call for Emergency Support
                <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}