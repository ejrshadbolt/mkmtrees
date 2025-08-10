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
    <header className="shadow-sm" style={{ backgroundColor: '#050608' }} role="banner">
      {/* Mobile Header */}
      <div className="lg:hidden">
        <div className="border-b border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex justify-between items-center py-4">
              {/* Logo */}
              <Link 
                href="/" 
                className="flex items-center text-xl font-bold text-white hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-md"
                style={{ '--tw-ring-color': '#F3ED17' } as React.CSSProperties}
                aria-label={`${businessConfig.name} - Home`}
              >
                {businessConfig.branding.logo && (
                  <Image 
                    src={businessConfig.branding.logo} 
                    alt={businessConfig.branding.logoAlt}
                    width={160}
                    height={64}
                    className="h-12 w-auto"
                    priority
                  />
                )}
              </Link>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-300 hover:text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-inset"
                style={{ '--tw-ring-color': '#F3ED17' } as React.CSSProperties}
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
      <nav className="hidden lg:block border-b border-gray-800" role="navigation" aria-label="Main navigation">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <Link 
                href="/" 
                className="flex items-center text-xl font-bold text-white hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-md"
                style={{ '--tw-ring-color': '#F3ED17' } as React.CSSProperties}
                aria-label={`${businessConfig.name} - Home`}
              >
                {businessConfig.branding.logo && (
                  <Image 
                    src={businessConfig.branding.logo} 
                    alt={businessConfig.branding.logoAlt}
                    width={200}
                    height={80}
                    className="h-16 w-auto"
                    priority
                  />
                )}
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-6">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-white px-3 py-2 text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-md relative group"
                  style={{ 
                    '--tw-ring-color': '#F3ED17',
                    color: pathname === item.href ? '#F3ED17' : '#FFFFFF'
                  } as React.CSSProperties}
                  aria-current={pathname === item.href ? 'page' : undefined}
                >
                  {item.name}
                  <span 
                    className="absolute bottom-0 left-3 right-3 h-0.5 bg-current transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left"
                    style={{ backgroundColor: '#F3ED17' }}
                  />
                </Link>
              ))}
            </div>

            {/* Desktop Contact */}
            <div className="hidden lg:flex items-center ml-6">
              <Link
                href={`tel:${businessConfig.contact.phone.replace(/\s/g, '')}`}
                className="flex items-center space-x-2 text-white font-medium transition-all duration-200 focus:outline-none focus:ring-2 rounded-md px-3 py-2 relative group hover-yellow"
                style={{
                  '--tw-ring-color': '#F3ED17'
                } as React.CSSProperties}
              >
                <Phone 
                  className="h-4 w-4 fill-current transition-colors duration-200" 
                  style={{ 
                    color: 'inherit',
                  }}
                />
                <span className="transition-colors duration-200">{businessConfig.contact.phone}</span>
                <span 
                  className="absolute bottom-0 left-3 right-3 h-0.5 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left"
                  style={{ backgroundColor: '#F3ED17' }}
                />
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-gray-800" style={{ backgroundColor: '#050608' }} id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={closeMobileMenu}
                className="block px-3 py-2 rounded-md text-base font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 relative group"
                style={{ 
                  '--tw-ring-color': '#F3ED17',
                  color: pathname === item.href ? '#F3ED17' : '#FFFFFF'
                } as React.CSSProperties}
                aria-current={pathname === item.href ? 'page' : undefined}
              >
                {item.name}
                <span 
                  className="absolute bottom-1 left-3 right-3 h-0.5 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left"
                  style={{ backgroundColor: '#F3ED17' }}
                />
              </Link>
            ))}
            
            {/* Mobile Contact */}
            <div className="border-t border-gray-800 mt-4 pt-4">
              <Link
                href={`tel:${businessConfig.contact.phone.replace(/\s/g, '')}`}
                onClick={closeMobileMenu}
                className="flex items-center space-x-2 font-medium px-3 py-2 rounded-md transition-all duration-200 text-white focus:outline-none focus:ring-2 relative group hover-yellow"
                style={{
                  '--tw-ring-color': '#F3ED17'
                } as React.CSSProperties}
              >
                <Phone className="h-4 w-4 fill-current transition-colors duration-200" style={{ color: 'inherit' }} />
                <span className="transition-colors duration-200">{businessConfig.contact.phone}</span>
                <span 
                  className="absolute bottom-1 left-3 right-3 h-0.5 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left"
                  style={{ backgroundColor: '#F3ED17' }}
                />
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}