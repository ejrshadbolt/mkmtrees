'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X, Phone, ChevronDown, ChevronRight } from 'lucide-react';
import { navigationConfig, businessConfig } from '@/config/business';

// Service categories for mobile menu
const serviceCategories = [
  {
    name: 'Tree Services',
    href: '/tree-services-canterbury',
    children: [
      { name: 'Qualified Arborists', href: '/tree-services/qualified-arborists-canterbury' },
      { name: 'Stump Grinding', href: '/tree-services/stump-grinding-canterbury' },
      { name: 'Tree Reductions', href: '/tree-services/tree-reductions-canterbury' }
    ]
  },
  {
    name: 'Tree Topping / Vegetation Management',
    href: '/tree-topping-vegetation-management-canterbury',
    children: [
      { name: 'Tree Topping', href: '/tree-topping/tree-topping-canterbury' },
      { name: 'Tall Tree Topping', href: '/tree-topping/tall-tree-topping-canterbury' }
    ]
  },
  {
    name: 'Earthworks',
    href: '/earthworks-canterbury',
    children: [
      { name: 'Station Work & Rural Earthworks', href: '/earthworks/station-work-canterbury' },
      { name: 'Land Clearing', href: '/earthworks/land-clearing-canterbury' },
      { name: 'Heavy-Duty Tilling', href: '/earthworks/heavy-duty-tilling-canterbury' }
    ]
  },
  {
    name: 'Emergency Callouts',
    href: '/emergency-callouts-canterbury',
    children: [
      { name: 'Emergency Tree Services', href: '/emergency-callouts/tree-services-canterbury' },
      { name: 'Emergency Earthworks', href: '/emergency-callouts/earthworks-canterbury' }
    ]
  },
  {
    name: 'Mulching',
    href: '/mulching-canterbury',
    children: [
      { name: 'Heavy-Duty Mulching', href: '/mulching/heavy-duty-canterbury' },
      { name: 'Gorse & Slash Mulching', href: '/mulching/gorse-slash-canterbury' },
      { name: 'Paddock Mulching', href: '/mulching/paddock-canterbury' }
    ]
  }
];

const singleServices = [
  { name: 'Wood Chip & Fire Wood', href: '/wood-chip-firewood-canterbury' }
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedService, setExpandedService] = useState<string | null>(null);
  const pathname = usePathname();
  
  const navigation = navigationConfig.main;

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
    setExpandedService(null);
  };

  const toggleServiceExpansion = (serviceName: string) => {
    setExpandedService(expandedService === serviceName ? null : serviceName);
  };

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
                className="flex items-center text-xl font-bold text-white hover:opacity-80 focus-visible-ring focus-ring-dark rounded-md"
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
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-300 hover:text-white hover:bg-gray-800 focus-visible-ring focus-ring-dark"
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
                className="flex items-center text-xl font-bold text-white hover:opacity-80 focus-visible-ring focus-ring-dark rounded-md"
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
                  className="text-white px-3 py-2 text-sm font-medium transition-all duration-200 focus-visible-ring focus-ring-dark rounded-md relative group text-center"
                  style={{ 
                    color: pathname === item.href ? '#F3ED17' : '#FFFFFF'
                  } as React.CSSProperties}
                  aria-current={pathname === item.href ? 'page' : undefined}
                >
                  {item.name}
                  <span 
                    className={`absolute bottom-0 left-3 right-3 h-0.5 bg-current transform transition-transform duration-200 origin-left ${
                      pathname === item.href ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                    }`}
                    style={{ backgroundColor: '#F3ED17' }}
                  />
                </Link>
              ))}
            </div>

            {/* Desktop Contact */}
            <div className="hidden lg:flex items-center ml-6">
              <Link
                href={`tel:${businessConfig.contact.phone.replace(/\s/g, '')}`}
                className="flex items-center space-x-2 text-white font-medium transition-all duration-200 focus-visible-ring focus-ring-dark rounded-md px-3 py-2 relative group hover-yellow text-center"
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

      {/* Mobile Navigation Overlay */}
      {mobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={closeMobileMenu}
            aria-hidden="true"
          />
          
          {/* Slide-out Menu */}
          <div 
            className="lg:hidden fixed top-0 right-0 h-full w-80 max-w-sm z-50 transform transition-transform duration-300 ease-in-out"
            style={{ backgroundColor: '#050608' }}
            id="mobile-menu"
          >
            {/* Menu Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-700">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: '#F3ED17' }}>
                  <Menu className="w-4 h-4 text-black" />
                </div>
                <span className="text-white font-semibold text-lg">Menu</span>
              </div>
              <button
                onClick={closeMobileMenu}
                className="p-2 rounded-full text-gray-300 hover:text-white hover:bg-gray-800 transition-colors duration-200"
                aria-label="Close menu"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto">
              <div className="p-6 space-y-6">
                
                {/* Main Navigation */}
                <nav className="space-y-2">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={closeMobileMenu}
                      className="flex items-center justify-between p-4 rounded-xl text-white font-medium transition-all duration-200 hover:bg-gray-800 active:scale-95 group relative"
                    >
                      <span style={{ color: pathname === item.href ? '#F3ED17' : '#FFFFFF' }}>
                        {item.name}
                        <span 
                          className={`absolute -bottom-1 left-0 right-0 h-0.5 transform transition-transform duration-300 origin-left ${
                            pathname === item.href ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                          }`}
                          style={{ backgroundColor: '#F3ED17' }}
                        />
                      </span>
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </Link>
                  ))}
                </nav>

                {/* Services Section */}
                <div>
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: '#F3ED17' }}>
                      <div className="w-2 h-2 rounded-full bg-black" />
                    </div>
                    <h3 className="text-white font-semibold text-lg">Our Services</h3>
                  </div>
                  
                  <div className="space-y-2">
                    {serviceCategories.map((category) => {
                      const isActive = pathname === category.href || category.children.some(child => pathname === child.href);
                      const isExpanded = expandedService === category.name;
                      
                      return (
                        <div key={category.name} className="space-y-1">
                          <div className="flex items-center">
                            <Link
                              href={category.href}
                              onClick={closeMobileMenu}
                              className="flex-1 flex items-center justify-between p-3 rounded-lg text-white font-medium transition-all duration-200 hover:bg-gray-800 active:scale-95 group relative"
                            >
                              <span 
                                className="text-sm relative"
                                style={{ color: isActive ? '#F3ED17' : '#FFFFFF' }}
                              >
                                {category.name}
                                <span 
                                  className={`absolute -bottom-1 left-0 right-0 h-0.5 transform transition-transform duration-300 origin-left ${
                                    isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                                  }`}
                                  style={{ backgroundColor: '#F3ED17' }}
                                />
                              </span>
                            </Link>
                            <button
                              onClick={() => toggleServiceExpansion(category.name)}
                              className="p-3 ml-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-all duration-200 active:scale-95"
                              aria-label={`${isExpanded ? 'Collapse' : 'Expand'} ${category.name} services`}
                            >
                              <ChevronDown 
                                className={`w-4 h-4 transition-transform duration-200 ${
                                  isExpanded ? 'rotate-180' : ''
                                }`} 
                              />
                            </button>
                          </div>
                          
                          {/* Animated Children */}
                          <div 
                            className={`overflow-hidden transition-all duration-300 ease-in-out ${
                              isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                            }`}
                          >
                            <div className="ml-6 space-y-1 pt-1">
                              {category.children.map((child) => {
                                const isChildActive = pathname === child.href;
                                return (
                                  <Link
                                    key={child.name}
                                    href={child.href}
                                    onClick={closeMobileMenu}
                                    className="flex items-center justify-between p-3 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-gray-800 active:scale-95 group relative"
                                    style={{ 
                                      color: isChildActive ? '#F3ED17' : '#CCCCCC'
                                    }}
                                  >
                                    <span className="relative">
                                      {child.name}
                                      <span 
                                        className={`absolute -bottom-1 left-0 right-0 h-0.5 transform transition-transform duration-300 origin-left ${
                                          isChildActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                                        }`}
                                        style={{ backgroundColor: '#F3ED17' }}
                                      />
                                    </span>
                                    <ChevronRight className="w-4 h-4 text-gray-500" />
                                  </Link>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      );
                    })}

                    {/* Single Services */}
                    {singleServices.map((service) => {
                      const isActive = pathname === service.href;
                      return (
                        <Link
                          key={service.name}
                          href={service.href}
                          onClick={closeMobileMenu}
                          className="flex items-center justify-between p-3 rounded-lg text-white font-medium transition-all duration-200 hover:bg-gray-800 active:scale-95 group relative"
                        >
                          <span 
                            className="text-sm relative"
                            style={{ color: isActive ? '#F3ED17' : '#FFFFFF' }}
                          >
                            {service.name}
                            <span 
                              className={`absolute -bottom-1 left-0 right-0 h-0.5 transform transition-transform duration-300 origin-left ${
                                isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                              }`}
                              style={{ backgroundColor: '#F3ED17' }}
                            />
                          </span>
                          <ChevronRight className="w-4 h-4 text-gray-400" />
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Sticky Contact Section */}
              <div className="sticky bottom-0 p-6 border-t border-gray-700" style={{ backgroundColor: '#050608' }}>
                <Link
                  href={`tel:${businessConfig.contact.phone.replace(/\s/g, '')}`}
                  onClick={closeMobileMenu}
                  className="flex items-center justify-center space-x-3 w-full p-4 rounded-xl font-semibold text-black transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg"
                  style={{ backgroundColor: '#F3ED17' }}
                >
                  <Phone className="w-5 h-5" />
                  <span>Call {businessConfig.contact.phone}</span>
                </Link>
                <p className="text-center text-gray-400 text-xs mt-3">
                  24/7 Emergency Service Available
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </header>
  );
}