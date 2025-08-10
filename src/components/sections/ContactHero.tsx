import Link from 'next/link';
import { ArrowRight, Phone, Mail, MapPin, Clock } from 'lucide-react';
import { businessConfig } from '@/config/business';

export default function ContactHero() {
  return (
    <section className="relative min-h-screen" style={{ backgroundColor: '#050608' }}>
      <div className="grid lg:grid-cols-3 min-h-screen">
        
        {/* Left Side - Content (2/3 width) */}
        <div className="lg:col-span-2 flex items-center p-8 lg:p-16">
          <div className="w-full max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              Get In Touch With Our Experts
            </h1>
            
            <p className="text-xl text-gray-300 leading-relaxed mb-8 max-w-2xl">
              Ready to tackle your tree services or land clearing project? Our qualified arborists and experienced operators are here to help with professional, safe, and efficient solutions across Canterbury.
            </p>

            {/* Quick Contact Info */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#F3ED17' }}>
                  <Phone className="w-6 h-6 text-black" />
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">Call Us Direct</p>
                  <Link 
                    href={`tel:${businessConfig.contact.phone}`}
                    className="text-lg font-semibold text-white hover:text-yellow-400 transition-colors"
                  >
                    {businessConfig.contact.phone}
                  </Link>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#F3ED17' }}>
                  <Mail className="w-6 h-6 text-black" />
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">Email Us</p>
                  <Link 
                    href={`mailto:${businessConfig.contact.email}`}
                    className="text-lg font-semibold text-white hover:text-yellow-400 transition-colors break-all"
                  >
                    {businessConfig.contact.email}
                  </Link>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#F3ED17' }}>
                  <MapPin className="w-6 h-6 text-black" />
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">Service Area</p>
                  <p className="text-lg font-semibold text-white">Canterbury & Surrounding Areas</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#F3ED17' }}>
                  <Clock className="w-6 h-6 text-black" />
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">Emergency Callouts</p>
                  <p className="text-lg font-semibold text-white">24/7 Available</p>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href={`tel:${businessConfig.contact.phone}`}
                className="inline-flex items-center px-8 py-4 font-semibold text-black transition-all duration-200 hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 group text-lg"
                style={{ backgroundColor: '#F3ED17' }}
              >
                <Phone className="mr-2 h-5 w-5" />
                Call Now for Quote
                <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
              
              <Link
                href="/service-areas"
                className="inline-flex items-center px-8 py-4 font-semibold text-white bg-transparent border-2 border-white hover:bg-white hover:text-black transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 text-lg"
              >
                View Service Areas
              </Link>
            </div>
          </div>
        </div>

        {/* Right Side - Contact Form (1/3 width) */}
        <div className="bg-white p-8 lg:p-12 flex items-center">
          <div className="w-full">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-3">Start Your Project</h2>
              <div className="w-16 h-1 mb-4" style={{ backgroundColor: '#F3ED17' }}></div>
              <p className="text-gray-600">Fill out the form and we'll get back to you with a free quote within 24 hours.</p>
            </div>

            <form className="space-y-6">
              <div>
                <label htmlFor="contact-name" className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="contact-name"
                  name="name"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-colors bg-white"
                  placeholder="Your full name"
                />
              </div>

              <div>
                <label htmlFor="contact-phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  id="contact-phone"
                  name="phone"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-colors bg-white"
                  placeholder="(03) 123-4567"
                />
              </div>

              <div>
                <label htmlFor="contact-email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="contact-email"
                  name="email"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-colors bg-white"
                  placeholder="your.email@example.com"
                />
              </div>

              <div>
                <label htmlFor="contact-service" className="block text-sm font-medium text-gray-700 mb-2">
                  Service Required
                </label>
                <select
                  id="contact-service"
                  name="service"
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-colors bg-white"
                >
                  <option value="">Select a service</option>
                  <option value="tree-topping">Tree Topping / Vegetation Management</option>
                  <option value="tree-services">Tree Services & Removals</option>
                  <option value="earthworks">Earthworks & Land Clearing</option>
                  <option value="emergency">Emergency Callouts</option>
                  <option value="wood-chips">Wood Chip & Fire Wood</option>
                  <option value="mulching">Mulching Services</option>
                  <option value="other">Other / Multiple Services</option>
                </select>
              </div>

              <div>
                <label htmlFor="contact-message" className="block text-sm font-medium text-gray-700 mb-2">
                  Project Details <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  required
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-colors resize-vertical bg-white"
                  placeholder="Tell us about your project, property size, access, timeline, etc..."
                />
              </div>

              <button
                type="submit"
                className="w-full inline-flex items-center justify-center px-8 py-4 font-semibold text-black transition-all duration-200 hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 group text-lg"
                style={{ backgroundColor: '#F3ED17' }}
              >
                Submit Enquiry
                <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}