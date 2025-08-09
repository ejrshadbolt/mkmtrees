'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X, Phone } from 'lucide-react';
import { navigationConfig, businessConfig } from '@/config/business';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  
  const navigation = navigationConfig.main;

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm" role="banner">
      {/* Mobile Header */}
      <div className="lg:hidden">
        <div className="border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex justify-between items-center py-4">
              {/* Logo */}
              <Link 
                href="/" 
                className="flex items-center text-xl font-bold text-gray-900 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                aria-label={`${businessConfig.name} - Home`}
              >
                {businessConfig.branding.logo && (
                  <Image 
                    src={businessConfig.branding.logo} 
                    alt={businessConfig.branding.logoAlt}
                    width={160}
                    height={64}
                    className="h-12 w-auto"
                  />
                )}
                <span className="ml-2">{businessConfig.name}</span>
              </Link>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                aria-expanded={mobileMenuOpen}
                aria-controls="mobile-menu"
                aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              >
                {mobileMenuOpen ? (
                  <X className="block h-6 w-6" aria-hidden="true" />
                ) : (
                  <Menu className="block h-6 w-6" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Header */}
      <nav className="hidden lg:block border-b border-gray-200" role="navigation" aria-label="Main navigation">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <Link 
                href="/" 
                className="flex items-center text-xl font-bold text-gray-900 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                aria-label={`${businessConfig.name} - Home`}
              >
                {businessConfig.branding.logo && (
                  <Image 
                    src={businessConfig.branding.logo} 
                    alt={businessConfig.branding.logoAlt}
                    width={160}
                    height={64}
                    className="h-16 w-auto"
                  />
                )}
                <span className="ml-2">{businessConfig.name}</span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-6">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  aria-current={pathname === item.href ? 'page' : undefined}
                >
                  {item.name}
                </Link>
              ))}
            </div>

            {/* Desktop Contact */}
            <div className="hidden lg:flex items-center">
              <Link
                href={`tel:${businessConfig.contact.phone}`}
                className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 border-2 border-blue-600 px-4 py-2 rounded-md transition-colors duration-200"
              >
                <Phone className="h-4 w-4" />
                <span>{businessConfig.contact.phone}</span>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-200" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={closeMobileMenu}
                className="text-gray-700 hover:text-gray-900 block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                aria-current={pathname === item.href ? 'page' : undefined}
              >
                {item.name}
              </Link>
            ))}
            
            {/* Mobile Contact */}
            <div className="border-t border-gray-200 mt-4 pt-4">
              <Link
                href={`tel:${businessConfig.contact.phone}`}
                onClick={closeMobileMenu}
                className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-semibold px-3 py-2 rounded-md transition-colors duration-200"
              >
                <Phone className="h-4 w-4" />
                <span>{businessConfig.contact.phone}</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}