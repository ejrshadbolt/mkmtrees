'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';

const serviceCategories = [
  {
    name: 'Tree Topping / Vegetation Management',
    href: '/services/tree-topping-vegetation-management',
    children: [
      { name: 'Tree Topping', href: '/services/tree-topping' },
      { name: 'Tall Tree Topping', href: '/services/tall-tree-topping' }
    ]
  },
  {
    name: 'Tree Services',
    href: '/services/tree-services',
    children: [
      { name: 'Qualified Arborists', href: '/services/qualified-arborists' },
      { name: 'Stump Grinding', href: '/services/stump-grinding' },
      { name: 'Tree Reductions', href: '/services/tree-reductions' }
    ]
  },
  {
    name: 'Earthworks',
    href: '/services/earthworks',
    children: [
      { name: 'Station Work', href: '/services/station-work' },
      { name: 'Land Clearing', href: '/services/land-clearing' },
      { name: 'Heavy-Duty Tilling', href: '/services/heavy-duty-tilling' }
    ]
  },
  {
    name: 'Emergency Callouts',
    href: '/services/emergency-callouts',
    children: [
      { name: 'Emergency Tree Services', href: '/services/emergency-tree-services' },
      { name: 'Emergency Earthworks', href: '/services/emergency-earthworks' }
    ]
  },
  {
    name: 'Mulching',
    href: '/services/mulching',
    children: [
      { name: 'Heavy-Duty Mulching', href: '/services/heavy-duty-mulching' },
      { name: 'Gorse & Slash Mulching', href: '/services/gorse-slash-mulching' },
      { name: 'Paddock Mulching', href: '/services/paddock-mulching' }
    ]
  }
];

const singleServices = [
  { name: 'Wood Chip & Fire Wood', href: '/services/wood-chip-fire-wood' }
];

export default function SecondaryNav() {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const handleMouseEnter = (categoryName: string) => {
    setOpenDropdown(categoryName);
  };

  const handleMouseLeave = () => {
    setOpenDropdown(null);
  };

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
                className="flex items-center space-x-1 text-black font-semibold text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 px-2 py-0.5 rounded relative group"
              >
                <span>{category.name}</span>
                <ChevronDown className="h-3 w-3" />
                <span 
                  className="absolute bottom-0 left-2 right-2 h-0.5 bg-black transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left"
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
                >
                  <div>
                    {category.children.map((child) => (
                      <Link
                        key={child.name}
                        href={child.href}
                        className="block px-4 py-2 text-sm font-semibold text-black transition-all duration-200 whitespace-nowrap relative group"
                      >
                        {child.name}
                        <span 
                          className="absolute bottom-1 left-4 right-4 h-0.5 bg-black transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left"
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
              className="text-black font-semibold text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 px-2 py-0.5 rounded relative group"
            >
              {service.name}
              <span 
                className="absolute bottom-0 left-2 right-2 h-0.5 bg-black transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left"
              />
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}