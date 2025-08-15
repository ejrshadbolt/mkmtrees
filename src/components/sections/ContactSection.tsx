import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { businessConfig } from '@/config/business';

interface ContactSectionProps {
  title?: string;
  subtitle?: string;
  contactImage?: string;
}

export default function ContactSection({ 
  title = "Get In Touch", 
  subtitle = "Looking for dependable tree services in Canterbury and surrounding areas? Send us a message—we're here to help.",
  contactImage = "/contactussection.webp"
}: ContactSectionProps) {
  return (
    <section className="bg-white">
      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[600px]">
        {/* Left Side - Image */}
        <div className="relative overflow-hidden bg-gray-200">
          <Image
            src={contactImage}
            alt="Contact MKM Trees"
            fill
            className="object-cover object-bottom"
          />
        </div>
        
        {/* Right Side - Contact Information and Form */}
        <div className="bg-white flex items-center p-8 lg:p-16">
          <div className="w-full space-y-8">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
                {title}
              </h2>
              <div className="w-16 h-1 mb-6" style={{ backgroundColor: '#F3ED17' }}></div>
              <p className="text-lg text-gray-600 leading-relaxed mb-8">
                {subtitle}
              </p>
            </div>

            {/* Contact Details - Compact Horizontal Layout */}
            <div className="bg-gray-50 p-6 shadow-sm border-l-4 border-gray-200 hover:border-yellow-400 transition-colors duration-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Contact Details</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: '#F3ED17' }}>
                    <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-600">Phone</p>
                    <Link 
                      href={`tel:${businessConfig.contact.phone}`}
                      className="text-sm font-semibold text-gray-900 transition-colors duration-200 focus-visible-ring focus-ring-white px-1 py-0.5 rounded relative group"
                    >
                      {businessConfig.contact.phone}
                      <span 
                        className="absolute bottom-0 left-1 right-1 h-0.5 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left"
                        style={{ backgroundColor: '#F3ED17' }}
                      />
                    </Link>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: '#F3ED17' }}>
                    <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-600">Email</p>
                    <Link 
                      href={`mailto:${businessConfig.contact.email}`}
                      className="text-sm font-semibold text-gray-900 transition-colors duration-200 focus-visible-ring focus-ring-white px-1 py-0.5 rounded relative group"
                    >
                      {businessConfig.contact.email}
                      <span 
                        className="absolute bottom-0 left-1 right-1 h-0.5 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left"
                        style={{ backgroundColor: '#F3ED17' }}
                      />
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-gray-50 p-6 shadow-sm border-l-4 border-gray-200 hover:border-yellow-400 transition-colors duration-200">
              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Let&apos;s Talk About Your Job</h3>
                <p className="text-gray-600 text-sm">Tell us what you need help with — we&apos;ll be in touch shortly.</p>
              </div>

              <form className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      placeholder="Your full name"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus-visible-ring focus-ring-white focus:border-transparent transition-colors bg-white"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      placeholder="your.email@example.com"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus-visible-ring focus-ring-white focus:border-transparent transition-colors bg-white"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                      Phone <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      required
                      placeholder="027 123 4567"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus-visible-ring focus-ring-white focus:border-transparent transition-colors bg-white"
                    />
                  </div>
                  <div>
                    <label htmlFor="service" className="block text-sm font-medium text-gray-700 mb-2">
                      Service Needed
                    </label>
                    <select
                      id="service"
                      name="service"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus-visible-ring focus-ring-white focus:border-transparent transition-colors bg-white"
                    >
                      <option value="">Select a service</option>
                      <option value="tree-topping">Tree Topping / Vegetation Management</option>
                      <option value="tree-services">Tree Services</option>
                      <option value="earthworks">Earthworks</option>
                      <option value="emergency">Emergency Callouts</option>
                      <option value="wood-chips">Wood Chip & Fire Wood</option>
                      <option value="mulching">Mulching</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={3}
                    placeholder="Tell us about your project..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-colors resize-vertical bg-white"
                  />
                </div>

                <button
                  type="submit"
                  className="inline-flex items-center px-8 py-3 font-semibold text-black hover:scale-105 hover:shadow-lg focus-visible-ring focus-ring-yellow group relative"
                  style={{ 
                    backgroundColor: '#F3ED17',
                    transition: 'transform 300ms ease-in-out, box-shadow 300ms ease-in-out'
                  }}
                >
                  <span className="relative">
                    Submit Enquiry
                    <span 
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-black transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"
                    />
                  </span>
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}