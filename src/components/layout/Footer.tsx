import Link from 'next/link';
import { Facebook, Twitter, Linkedin, Instagram, Youtube, LucideIcon } from 'lucide-react';
import { businessConfig } from '@/config/business';

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
    <footer className="bg-gray-900">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="space-y-8 xl:col-span-1">
            <div>
              <Link href="/" className="text-2xl font-bold text-white">
                {businessConfig.name}
              </Link>
              <p className="mt-4 text-gray-300 text-base">
                {businessConfig.description}
              </p>
            </div>
            {socialLinks.length > 0 && (
              <div className="flex space-x-6">
                {socialLinks.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="text-gray-400 hover:text-gray-300 transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span className="sr-only">{item.name}</span>
                    <item.icon className="h-6 w-6" />
                  </a>
                ))}
              </div>
            )}
          </div>
          <div className="mt-12 grid grid-cols-2 gap-8 xl:mt-0 xl:col-span-2">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div className="mt-12 md:mt-0">
                <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
                  Contact
                </h3>
                <ul className="mt-4 space-y-4">
                  <li>
                    <span className="text-base text-gray-300">
                      {businessConfig.contact.address.street}<br />
                      {businessConfig.contact.address.city}, {businessConfig.contact.address.state} {businessConfig.contact.address.zip}
                    </span>
                  </li>
                  <li>
                    <a
                      href={`tel:${businessConfig.contact.phone.replace(/[^\d]/g, '')}`}
                      className="text-base text-gray-300 hover:text-white transition-colors"
                    >
                      {businessConfig.contact.phone}
                    </a>
                  </li>
                  <li>
                    <a
                      href={`mailto:${businessConfig.contact.email}`}
                      className="text-base text-gray-300 hover:text-white transition-colors"
                    >
                      {businessConfig.contact.email}
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t border-gray-700 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-base text-gray-400 mb-4 md:mb-0">
              &copy; {currentYear} {businessConfig.copyright}. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}