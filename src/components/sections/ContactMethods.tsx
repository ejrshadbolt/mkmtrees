import Link from 'next/link';
import { Phone, Mail, MapPin, MessageCircle } from 'lucide-react';
import { businessConfig } from '@/config/business';

const contactMethods = [
  {
    icon: Phone,
    title: "Phone",
    subtitle: "Call for immediate assistance",
    content: businessConfig.contact.phone,
    action: "Call Now",
    href: `tel:${businessConfig.contact.phone}`,
    description: "Speak directly with our team for quotes, bookings, or emergency callouts. Available 24/7 for urgent tree services."
  },
  {
    icon: Mail,
    title: "Email",
    subtitle: "Send us your project details",
    content: businessConfig.contact.email,
    action: "Send Email",
    href: `mailto:${businessConfig.contact.email}`,
    description: "Email us your project requirements, photos, and questions. We'll respond with a detailed quote within 24 hours."
  },
  {
    icon: MapPin,
    title: "Service Areas", 
    subtitle: "Canterbury wide coverage",
    content: "Canterbury & Surrounding Areas",
    action: "View Areas",
    href: "/service-areas",
    description: "We service all of Canterbury from Christchurch suburbs to rural high country stations. Check if we cover your area."
  },
  {
    icon: MessageCircle,
    title: "Get Quote",
    subtitle: "Free project assessment",
    content: "Online enquiry form",
    action: "Start Quote",
    href: "#contact-form",
    description: "Fill out our detailed form for an accurate quote. Include photos and property details for the best estimate."
  }
];

export default function ContactMethods() {
  return (
    <section className="py-16 bg-white">
      <div className="w-full px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          {/* Title */}
          <div className="mb-16 text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Multiple Ways to Reach Us
            </h2>
            <div className="w-16 h-1 mx-auto mb-6" style={{ backgroundColor: '#F3ED17' }}></div>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Choose the contact method that works best for you. We&apos;re here to help with all your tree service and land clearing needs.
            </p>
          </div>

          {/* Contact Methods Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {contactMethods.map((method, index) => {
              const IconComponent = method.icon;
              return (
                <div 
                  key={index}
                  className="bg-gray-50 p-8 shadow-sm border-l-4 border-gray-200 hover:border-yellow-400 hover:scale-105 transition-all duration-200 text-center group h-full flex flex-col"
                >
                  {/* Icon */}
                  <div className="flex justify-center mb-6">
                    <div className="w-16 h-16 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-200" style={{ backgroundColor: '#F3ED17' }}>
                      <IconComponent className="w-8 h-8 text-black" />
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {method.title}
                  </h3>
                  
                  <p className="text-sm text-gray-500 mb-4">
                    {method.subtitle}
                  </p>

                  <div className="text-lg font-semibold text-gray-900 mb-4">
                    {method.content}
                  </div>

                  <p className="text-sm text-gray-600 leading-relaxed mb-6 flex-grow">
                    {method.description}
                  </p>

                  {/* Action Button */}
                  <div className="mt-auto">
                    <Link
                      href={method.href}
                      className="inline-flex items-center px-6 py-3 font-semibold text-black transition-all duration-200 hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 group/button"
                      style={{ backgroundColor: '#F3ED17' }}
                    >
                      {method.action}
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}