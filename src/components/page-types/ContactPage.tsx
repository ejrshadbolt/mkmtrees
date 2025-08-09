import { Phone, Mail, MapPin, Clock } from 'lucide-react';
import { businessConfig } from '@/config/business';

interface ContactPageProps {
  title: string;
  description: string;
  showMap?: boolean;
  mapEmbedUrl?: string;
  showHours?: boolean;
  customFields?: Array<{
    name: string;
    type: 'text' | 'email' | 'tel' | 'textarea' | 'select';
    label: string;
    required?: boolean;
    options?: string[];
  }>;
  children?: React.ReactNode;
}

export default function ContactPage({ 
  title, 
  description, 
  showMap = false,
  mapEmbedUrl,
  showHours = true,
  customFields = [],
  children 
}: ContactPageProps) {
  const defaultFields = [
    { name: 'name', type: 'text' as const, label: 'Full Name', required: true },
    { name: 'email', type: 'email' as const, label: 'Email Address', required: true },
    { name: 'phone', type: 'tel' as const, label: 'Phone Number', required: false },
    { name: 'message', type: 'textarea' as const, label: 'Message', required: true },
  ];

  const allFields = [...defaultFields, ...customFields];

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
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Send Us a Message</h2>
              <form className="space-y-6">
                {allFields.map((field) => (
                  <div key={field.name}>
                    <label htmlFor={field.name} className="block text-sm font-medium text-gray-700 mb-2">
                      {field.label}
                      {field.required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                    {field.type === 'textarea' ? (
                      <textarea
                        id={field.name}
                        name={field.name}
                        rows={4}
                        required={field.required}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder={`Enter your ${field.label.toLowerCase()}`}
                      />
                    ) : field.type === 'select' ? (
                      <select
                        id={field.name}
                        name={field.name}
                        required={field.required}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Select {field.label}</option>
                        {field.options?.map((option) => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type={field.type}
                        id={field.name}
                        name={field.name}
                        required={field.required}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder={`Enter your ${field.label.toLowerCase()}`}
                      />
                    )}
                  </div>
                ))}
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Send Message
                </button>
              </form>
            </div>

            {/* Contact Info */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Get in Touch</h2>
              <div className="space-y-6">
                <div className="flex items-start">
                  <Phone className="text-blue-600 mr-4 mt-1" size={24} />
                  <div>
                    <h3 className="font-semibold text-gray-900">Phone</h3>
                    <a
                      href={`tel:${businessConfig.contact.phone}`}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      {businessConfig.contact.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start">
                  <Mail className="text-blue-600 mr-4 mt-1" size={24} />
                  <div>
                    <h3 className="font-semibold text-gray-900">Email</h3>
                    <a
                      href={`mailto:${businessConfig.contact.email}`}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      {businessConfig.contact.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start">
                  <MapPin className="text-blue-600 mr-4 mt-1" size={24} />
                  <div>
                    <h3 className="font-semibold text-gray-900">Address</h3>
                    <p className="text-gray-600">
                      {businessConfig.contact.address.street}<br />
                      {businessConfig.contact.address.city}, {businessConfig.contact.address.state} {businessConfig.contact.address.zip}
                    </p>
                  </div>
                </div>

                {showHours && (
                  <div className="flex items-start">
                    <Clock className="text-blue-600 mr-4 mt-1" size={24} />
                    <div>
                      <h3 className="font-semibold text-gray-900">Business Hours</h3>
                      <div className="text-gray-600 space-y-1">
                        <p>Monday - Friday: {businessConfig.hours.monday}</p>
                        <p>Saturday: {businessConfig.hours.saturday}</p>
                        <p>Sunday: {businessConfig.hours.sunday}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      {showMap && mapEmbedUrl && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Find Us</h2>
            <div className="aspect-video bg-gray-300 rounded-lg overflow-hidden">
              <iframe
                src={mapEmbedUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </section>
      )}

      {/* Custom Content */}
      {children && (
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </section>
      )}
    </div>
  );
}