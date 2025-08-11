import Link from 'next/link';
import Image from 'next/image';
import { Facebook, Twitter, Linkedin, Instagram, Youtube, LucideIcon, Phone, Mail, MapPin } from 'lucide-react';
import { businessConfig, navigationConfig } from '@/config/business';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  // Build social media links from business config
  const socialLinks = [
    businessConfig.social.facebook && {
      name: 'Facebook',
      href: businessConfig.social.facebook,
      icon: Facebook,
    },
    businessConfig.social.twitter && {
      name: 'Twitter',
      href: businessConfig.social.twitter,
      icon: Twitter,
    },
    businessConfig.social.linkedin && {
      name: 'LinkedIn',
      href: businessConfig.social.linkedin,
      icon: Linkedin,
    },
    businessConfig.social.instagram && {
      name: 'Instagram',
      href: businessConfig.social.instagram,
      icon: Instagram,
    },
    businessConfig.social.youtube && {
      name: 'YouTube',
      href: businessConfig.social.youtube,
      icon: Youtube,
    },
  ].filter((item): item is { name: string; href: string; icon: LucideIcon } => Boolean(item));

  return (
    <footer style={{ backgroundColor: '#050608' }}>
      <div className="w-full px-6 lg:px-12 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            
            {/* Company Information */}
            <div className="lg:col-span-1">
              <div className="mb-6">
                <Link href="/" className="text-3xl font-bold text-white focus-visible-ring focus-ring-dark rounded-md">
                  {businessConfig.name}
                </Link>
                <div className="w-16 h-1 mt-3" style={{ backgroundColor: '#F3ED17' }}></div>
              </div>
              <p className="text-gray-300 text-base leading-relaxed mb-6">
                Professional tree services and land clearing across Canterbury. Qualified arborists with Gold SiteWise certification.
              </p>
              
              {/* SiteWise Gold Logo */}
              <div className="mb-6">
                <Image
                  src="/sistewiselogo.png"
                  alt="SiteWise Gold Certification 2024/25"
                  width={200}
                  height={60}
                  className="h-12 w-auto"
                />
              </div>
              
              {socialLinks.length > 0 && (
                <div className="flex space-x-4">
                  {socialLinks.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      className="w-10 h-10 rounded-full flex items-center justify-center text-black transition-all duration-200 hover:scale-110 focus-visible-ring focus-ring-yellow"
                      style={{ backgroundColor: '#F3ED17' }}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <span className="sr-only">{item.name}</span>
                      <item.icon className="h-5 w-5" />
                    </a>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-bold text-white mb-6">
                Quick Links
              </h3>
              <ul className="space-y-3">
                {navigationConfig.main.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="text-gray-300 hover:text-white transition-all duration-200 flex items-center group hover:translate-x-1 relative inline-block focus-visible-ring focus-ring-dark rounded-md"
                    >
                      <span className="w-2 h-2 rounded-full mr-3 group-hover:scale-125 transition-transform duration-200" style={{ backgroundColor: '#F3ED17' }}></span>
                      <span className="relative">
                        {item.name}
                        <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left" />
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Services */}
            <div>
              <h3 className="text-lg font-bold text-white mb-6">
                Our Services
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/tree-topping-vegetation-management-canterbury" className="text-gray-300 hover:text-white transition-all duration-200 flex items-center group hover:translate-x-1 relative inline-block focus-visible-ring focus-ring-dark rounded-md">
                    <span className="w-2 h-2 rounded-full mr-3 group-hover:scale-125 transition-transform duration-200" style={{ backgroundColor: '#F3ED17' }}></span>
                    <span className="relative">
                      Tree Topping / Vegetation Management
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left" />
                    </span>
                  </Link>
                </li>
                <li>
                  <Link href="/tree-services-canterbury" className="text-gray-300 hover:text-white transition-all duration-200 flex items-center group hover:translate-x-1 relative inline-block focus-visible-ring focus-ring-dark rounded-md">
                    <span className="w-2 h-2 rounded-full mr-3 group-hover:scale-125 transition-transform duration-200" style={{ backgroundColor: '#F3ED17' }}></span>
                    <span className="relative">
                      Tree Services
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left" />
                    </span>
                  </Link>
                </li>
                <li>
                  <Link href="/earthworks-canterbury" className="text-gray-300 hover:text-white transition-all duration-200 flex items-center group hover:translate-x-1 relative inline-block focus-visible-ring focus-ring-dark rounded-md">
                    <span className="w-2 h-2 rounded-full mr-3 group-hover:scale-125 transition-transform duration-200" style={{ backgroundColor: '#F3ED17' }}></span>
                    <span className="relative">
                      Earthworks
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left" />
                    </span>
                  </Link>
                </li>
                <li>
                  <Link href="/emergency-callouts-canterbury" className="text-gray-300 hover:text-white transition-all duration-200 flex items-center group hover:translate-x-1 relative inline-block focus-visible-ring focus-ring-dark rounded-md">
                    <span className="w-2 h-2 rounded-full mr-3 group-hover:scale-125 transition-transform duration-200" style={{ backgroundColor: '#F3ED17' }}></span>
                    <span className="relative">
                      Emergency Callouts
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left" />
                    </span>
                  </Link>
                </li>
                <li>
                  <Link href="/mulching-canterbury" className="text-gray-300 hover:text-white transition-all duration-200 flex items-center group hover:translate-x-1 relative inline-block focus-visible-ring focus-ring-dark rounded-md">
                    <span className="w-2 h-2 rounded-full mr-3 group-hover:scale-125 transition-transform duration-200" style={{ backgroundColor: '#F3ED17' }}></span>
                    <span className="relative">
                      Mulching
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left" />
                    </span>
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact Information */}
            <div>
              <h3 className="text-lg font-bold text-white mb-6">
                Get In Touch
              </h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Phone className="w-5 h-5 mt-1 flex-shrink-0" style={{ color: '#F3ED17' }} />
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Phone</p>
                    <Link
                      href={`tel:${businessConfig.contact.phone}`}
                      className="text-white hover:text-gray-300 transition-colors font-semibold focus-visible-ring focus-ring-dark rounded-md"
                    >
                      {businessConfig.contact.phone}
                    </Link>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Mail className="w-5 h-5 mt-1 flex-shrink-0" style={{ color: '#F3ED17' }} />
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Email</p>
                    <Link
                      href={`mailto:${businessConfig.contact.email}`}
                      className="text-white hover:text-gray-300 transition-colors font-semibold break-all focus-visible-ring focus-ring-dark rounded-md"
                    >
                      {businessConfig.contact.email}
                    </Link>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 mt-1 flex-shrink-0" style={{ color: '#F3ED17' }} />
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Service Area</p>
                    <p className="text-white font-semibold">
                      Canterbury &<br />Surrounding Areas
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="mt-12 pt-8 border-t border-gray-700">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 mb-4 md:mb-0">
                &copy; {currentYear} {businessConfig.name}. All rights reserved.
              </p>
              <div className="flex items-center space-x-6 text-sm text-gray-400">
                <span>Gold SiteWise Certified</span>
                <span>•</span>
                <span>Licensed & Insured</span>
                <span>•</span>
                <span>Free Quotes</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}