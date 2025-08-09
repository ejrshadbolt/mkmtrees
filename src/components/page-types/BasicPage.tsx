// Basic page component for simple content pages

interface BasicPageProps {
  title: string;
  description?: string;
  heroBackground?: 'blue' | 'gray' | 'white';
  showCTA?: boolean;
  ctaText?: string;
  ctaLink?: string;
  children: React.ReactNode;
}

export default function BasicPage({ 
  title, 
  description,
  heroBackground = 'blue',
  showCTA = true,
  ctaText = "Contact Us",
  ctaLink = "/contact",
  children 
}: BasicPageProps) {
  const bgClasses = {
    blue: 'bg-gradient-to-r from-blue-600 to-blue-800 text-white',
    gray: 'bg-gradient-to-r from-gray-900 to-gray-700 text-white',
    white: 'bg-white border-b border-gray-200 text-gray-900'
  };

  const textClasses = {
    blue: 'text-blue-100',
    gray: 'text-gray-300',
    white: 'text-gray-600'
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className={`${bgClasses[heroBackground]} py-20`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">{title}</h1>
            {description && (
              <p className={`text-xl md:text-2xl ${textClasses[heroBackground]} mb-8 max-w-3xl mx-auto`}>
                {description}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg max-w-none">
            {children}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {showCTA && (
        <section className="bg-gray-900 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold mb-4">Have Questions?</h2>
            <p className="text-xl text-gray-300 mb-8">
              Get in touch with us for more information
            </p>
            <a
              href={ctaLink}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors inline-block"
            >
              {ctaText}
            </a>
          </div>
        </section>
      )}
    </div>
  );
}