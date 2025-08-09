import { Check, Phone, Mail } from 'lucide-react';
import { businessConfig } from '@/config/business';

interface ServicePageProps {
  title: string;
  description: string;
  features: string[];
  ctaText?: string;
  ctaLink?: string;
  pricing?: {
    title: string;
    price: string;
    description: string;
  };
  children?: React.ReactNode;
}

export default function ServicePage({ 
  title, 
  description, 
  features, 
  ctaText = "Get Free Quote",
  ctaLink = "/contact",
  pricing,
  children 
}: ServicePageProps) {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">{title}</h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
              {description}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={ctaLink}
                className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
              >
                {ctaText}
              </a>
              <a
                href={`tel:${businessConfig.contact.phone}`}
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors flex items-center justify-center gap-2"
              >
                <Phone size={20} />
                Call Now
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Features */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-8">What We Offer</h2>
              <ul className="space-y-4">
                {features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <Check className="text-green-600 mr-3 mt-1 flex-shrink-0" size={20} />
                    <span className="text-lg text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Custom Content or Pricing */}
            <div>
              {pricing && (
                <div className="bg-gray-50 p-8 rounded-lg">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{pricing.title}</h3>
                  <div className="text-4xl font-bold text-blue-600 mb-2">{pricing.price}</div>
                  <p className="text-gray-600 mb-6">{pricing.description}</p>
                  <a
                    href={ctaLink}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors inline-block"
                  >
                    {ctaText}
                  </a>
                </div>
              )}
              
              {children && (
                <div>{children}</div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl text-gray-300 mb-8">
            Contact us today for a free consultation and quote
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={`tel:${businessConfig.contact.phone}`}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            >
              <Phone size={20} />
              {businessConfig.contact.phone}
            </a>
            <a
              href={`mailto:${businessConfig.contact.email}`}
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-gray-900 transition-colors flex items-center justify-center gap-2"
            >
              <Mail size={20} />
              Email Us
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}