'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown } from 'lucide-react';

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

export default function SecondaryNav() {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [closeTimeout, setCloseTimeout] = useState<NodeJS.Timeout | null>(null);
  const pathname = usePathname();

  const handleMouseEnter = (categoryName: string) => {
    // Clear any pending close timeout
    if (closeTimeout) {
      clearTimeout(closeTimeout);
      setCloseTimeout(null);
    }
    setOpenDropdown(categoryName);
  };

  const handleMouseLeave = () => {
    // Add a delay before closing to allow navigation to dropdown
    const timeout = setTimeout(() => {
      setOpenDropdown(null);
    }, 150); // 150ms delay
    setCloseTimeout(timeout);
  };

  const handleDropdownMouseEnter = () => {
    // Clear close timeout when entering dropdown
    if (closeTimeout) {
      clearTimeout(closeTimeout);
      setCloseTimeout(null);
    }
  };

  const handleDropdownMouseLeave = () => {
    // Close immediately when leaving dropdown area
    setOpenDropdown(null);
    if (closeTimeout) {
      clearTimeout(closeTimeout);
      setCloseTimeout(null);
    }
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (closeTimeout) {
        clearTimeout(closeTimeout);
      }
    };
  }, [closeTimeout]);

  return (
    <nav 
      className="w-full border-b-2 border-black"
      style={{ backgroundColor: '#F3ED17' }}
      role="navigation"
      aria-label="Services navigation"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center space-x-8 py-2">
          {/* Services with dropdowns */}
          {serviceCategories.map((category) => (
            <div
              key={category.name}
              className="relative"
              onMouseEnter={() => handleMouseEnter(category.name)}
              onMouseLeave={handleMouseLeave}
            >
              <Link
                href={category.href}
                className="flex items-center space-x-1 text-black font-semibold text-sm transition-all duration-200 focus-visible-ring focus-ring-yellow px-2 py-0.5 rounded relative group"
              >
                <span>{category.name}</span>
                <ChevronDown className="h-3 w-3" />
                <span 
                  className={`absolute bottom-0 left-2 right-2 h-0.5 bg-black transform transition-transform duration-200 origin-left ${
                    pathname === category.href || category.children.some(child => pathname === child.href) 
                      ? 'scale-x-100' 
                      : 'scale-x-0 group-hover:scale-x-100'
                  }`}
                />
              </Link>

              {/* Dropdown */}
              {openDropdown === category.name && (
                <div 
                  className="absolute left-1/2 transform -translate-x-1/2 shadow-lg z-50"
                  style={{ 
                    backgroundColor: '#F3ED17',
                    width: 'max-content',
                    minWidth: '100%',
                    top: 'calc(100% + 2px)'
                  }}
                  onMouseEnter={handleDropdownMouseEnter}
                  onMouseLeave={handleDropdownMouseLeave}
                >
                  <div className="py-1">
                    {category.children.map((child) => (
                      <Link
                        key={child.name}
                        href={child.href}
                        className="block px-4 py-2 text-sm font-semibold text-black transition-all duration-200 whitespace-nowrap relative group focus-visible-ring focus-ring-yellow rounded-sm"
                      >
                        {child.name}
                        <span 
                          className={`absolute bottom-1 left-4 right-4 h-0.5 bg-black transform transition-transform duration-200 origin-left ${
                            pathname === child.href ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                          }`}
                        />
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Single services without dropdowns */}
          {singleServices.map((service) => (
            <Link
              key={service.name}
              href={service.href}
              className="text-black font-semibold text-sm transition-all duration-200 focus-visible-ring focus-ring-yellow px-2 py-0.5 rounded relative group"
            >
              {service.name}
              <span 
                className={`absolute bottom-0 left-2 right-2 h-0.5 bg-black transform transition-transform duration-200 origin-left ${
                  pathname === service.href ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                }`}
              />
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}