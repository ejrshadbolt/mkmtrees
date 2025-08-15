import Image from 'next/image';
import Link from 'next/link';
import { 
  ArrowRight, 
  CheckCircle, 
  Phone, 
  Star, 
  Truck,
  Zap,
  Eye,
  Flame,
  Wind,
  Shield,
  TreePine,
  Wrench,
  Clock,
  Settings,
  Home,
  Mountain,
  Scissors,
  Navigation,
  Droplets,
  FileCheck,
  Leaf,
  Sun
} from 'lucide-react';
import { FaGoogle, FaFacebook } from 'react-icons/fa';
import { businessConfig } from '@/config/business';
import ContactSection from '@/components/sections/ContactSection';

interface SubService {
  title: string;
  description: string;
  href: string;
  image: string;
  imageAlt: string;
}

interface ServiceFeature {
  icon: React.ReactNode;
  title: string;
  description: string;
}

interface ParentServicePageProps {
  title: string;
  subtitle: string;
  description: string;
  problemTitle: string;
  problemDescription: string;
  solutionTitle: string;
  solutionDescription: string;
  heroImage: string;
  heroImageAlt: string;
  subServices: SubService[];
  features: ServiceFeature[];
  bulletPoints: string[];
}

// Function to get appropriate icon for bullet point text
function getIconForBulletPoint(text: string) {
  const lowerText = text.toLowerCase();
  
  // Tree services related
  if (lowerText.includes('free') && (lowerText.includes('quote') || lowerText.includes('estimate'))) return <Phone className="w-5 h-5" />;
  if (lowerText.includes('insurance') || lowerText.includes('certified') || lowerText.includes('sitewise')) return <Shield className="w-5 h-5" />;
  if (lowerText.includes('cleanup') || lowerText.includes('disposal') || lowerText.includes('waste')) return <CheckCircle className="w-5 h-5" />;
  if (lowerText.includes('assessment') || lowerText.includes('health') || lowerText.includes('expert')) return <Eye className="w-5 h-5" />;
  if (lowerText.includes('council') || lowerText.includes('regulation') || lowerText.includes('compliance')) return <FileCheck className="w-5 h-5" />;
  if (lowerText.includes('emergency') || lowerText.includes('24/7') || lowerText.includes('callout')) return <Clock className="w-5 h-5" />;
  if (lowerText.includes('equipment') || lowerText.includes('specialized') || lowerText.includes('machinery')) return <Wrench className="w-5 h-5" />;
  if (lowerText.includes('access') || lowerText.includes('difficult')) return <Mountain className="w-5 h-5" />;
  
  // Tree topping/vegetation specific
  if (lowerText.includes('tree topping') || lowerText.includes('height control')) return <Scissors className="w-5 h-5" />;
  if (lowerText.includes('vegetation') || lowerText.includes('shelterbelt') || lowerText.includes('overgrown')) return <Leaf className="w-5 h-5" />;
  if (lowerText.includes('powerline') || lowerText.includes('power line') || lowerText.includes('electrical')) return <Zap className="w-5 h-5" />;
  if (lowerText.includes('view') || lowerText.includes('light') || lowerText.includes('restoration')) return <Sun className="w-5 h-5" />;
  if (lowerText.includes('wind') || lowerText.includes('pruning')) return <Wind className="w-5 h-5" />;
  if (lowerText.includes('fire') || lowerText.includes('hazard')) return <Flame className="w-5 h-5" />;
  
  // Earthworks specific
  if (lowerText.includes('heavy') && (lowerText.includes('machinery') || lowerText.includes('equipment'))) return <Truck className="w-5 h-5" />;
  if (lowerText.includes('station') || lowerText.includes('high country') || lowerText.includes('rural')) return <Mountain className="w-5 h-5" />;
  if (lowerText.includes('land clearing') || lowerText.includes('clearing')) return <TreePine className="w-5 h-5" />;
  if (lowerText.includes('soil') || lowerText.includes('compacted') || lowerText.includes('tilling')) return <Settings className="w-5 h-5" />;
  if (lowerText.includes('track') || lowerText.includes('access') || lowerText.includes('maintenance')) return <Navigation className="w-5 h-5" />;
  if (lowerText.includes('drainage') || lowerText.includes('water')) return <Droplets className="w-5 h-5" />;
  if (lowerText.includes('stock') || lowerText.includes('farm') || lowerText.includes('operations')) return <Home className="w-5 h-5" />;
  
  // Default icon for any other cases
  return <CheckCircle className="w-5 h-5" />;
}

export default function ParentServicePage({
  title,
  subtitle,
  description,
  problemTitle,
  problemDescription,
  solutionTitle,
  solutionDescription,
  heroImage,
  heroImageAlt,
  subServices,
  features,
  bulletPoints
}: ParentServicePageProps) {
  return (
    <main>
      {/* Hero Section */}
      <section className="relative bg-white" style={{ minHeight: 'calc(100vh - 80px)' }}>
        <div className="grid lg:grid-cols-2" style={{ minHeight: 'calc(100vh - 80px)' }}>
          
          {/* Left Side - Content */}
          <div className="flex items-center p-8 lg:p-16 order-2 lg:order-1">
            <div className="w-full max-w-2xl">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-black leading-tight mb-6">
                {title}
              </h1>
              <div className="w-16 h-1 mb-8" style={{ backgroundColor: '#F3ED17' }}></div>
              
              <p className="text-xl text-gray-600 leading-relaxed mb-8">
                {subtitle}
              </p>

              <p className="text-lg text-gray-700 leading-relaxed mb-12">
                {description}
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href={`tel:${businessConfig.contact.phone}`}
                  className="inline-flex items-center px-8 py-4 font-semibold text-black transition-all duration-200 hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 group text-lg relative rounded-sm"
                  style={{ backgroundColor: '#F3ED17' }}
                >
                  <Phone className="mr-2 h-5 w-5" />
                  <span className="relative">
                    Call for Free Quote
                    <span 
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-black transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"
                    />
                  </span>
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" />
                </Link>
                
                <Link
                  href="/contact"
                  className="inline-flex items-center px-8 py-4 font-semibold text-black bg-transparent border-2 border-black hover:bg-black hover:text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 text-lg rounded-sm"
                >
                  Get Written Quote
                </Link>
              </div>
            </div>
          </div>

          {/* Right Side - Hero Image */}
          <div className="relative overflow-hidden order-1 lg:order-2">
            <Image
              src={heroImage}
              alt={heroImageAlt}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-l from-transparent to-white/20"></div>
          </div>
        </div>
      </section>

      {/* Problem & Solution Section */}
      <section className="py-16 bg-white">
        <div className="w-full px-6 lg:px-12">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
              
              {/* The Problem */}
              <div className="p-12 lg:p-16">
                <h2 className="text-4xl md:text-5xl font-bold text-black mb-8">
                  {problemTitle}
                </h2>
                <div className="w-16 h-1 mb-8" style={{ backgroundColor: '#F3ED17' }}></div>
                <div className="text-lg text-black leading-relaxed space-y-4">
                  {problemDescription.split('\n').map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>
              </div>

              {/* The Solution */}
              <div className="p-12 lg:p-16" style={{ backgroundColor: '#050608' }}>
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">
                  {solutionTitle}
                </h2>
                <div className="w-16 h-1 mb-8" style={{ backgroundColor: '#F3ED17' }}></div>
                <div className="text-lg text-white leading-relaxed space-y-4">
                  {solutionDescription.split('\n').map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Sub-Services Navigation Section */}
      <section className="py-16 bg-white">
        <div className="w-full px-6 lg:px-12">
          <div className="mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Our Specialized Services
            </h2>
            <div className="w-16 h-1 mb-6" style={{ backgroundColor: '#F3ED17' }}></div>
            <p className="text-lg text-gray-600 max-w-3xl">
              Choose the specialized service that matches your needs. Each service is delivered by our qualified team with professional equipment and safety standards.
            </p>
          </div>
        </div>
        
        {/* Services Container - 80% width, responsive grid */}
        <div className="w-4/5 mx-auto px-6">
          <div className={`grid gap-6 ${
            subServices.length === 2 
              ? 'grid-cols-1 lg:grid-cols-2 max-w-full mx-auto' 
              : subServices.length === 3 
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
              : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
          }`}>
            {subServices.map((service, index) => (
              <Link
                key={index}
                href={service.href}
                className="group relative overflow-hidden bg-black aspect-[4/3] transition-transform duration-300 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-yellow-400 focus:ring-offset-2"
              >
                {/* Background Image */}
                <div className="absolute inset-0">
                  <Image
                    src={service.image}
                    alt={service.imageAlt}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  {/* Dark Overlay */}
                  <div className="absolute inset-0 bg-black bg-opacity-25 group-hover:bg-opacity-15 transition-all duration-300"></div>
                </div>

                {/* Content */}
                <div className="absolute inset-0 p-6 flex flex-col justify-end">
                  <h3 className="text-xl font-bold text-white transition-colors duration-300 group-hover:text-[#F3ED17] mb-2" style={{ textShadow: '1px 1px 2px rgba(0, 0, 0, 0.7)' }}>
                    {service.title}
                  </h3>
                  <p className="text-sm text-gray-200 transition-opacity duration-300" style={{ textShadow: '1px 1px 2px rgba(0, 0, 0, 0.6)' }}>
                    {service.description}
                  </p>
                </div>

                {/* Hover Effect Border */}
                <div className="absolute inset-0 border-2 border-transparent group-hover:border-[#F3ED17] transition-colors duration-300"></div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="w-full px-6 lg:px-12">
          <div className="max-w-7xl mx-auto">
            <div className="mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Why Choose MKM Trees
              </h2>
              <div className="w-16 h-1 mb-6" style={{ backgroundColor: '#F3ED17' }}></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div 
                  key={index}
                  className="bg-gray-50 p-8 shadow-sm border-l-4 border-gray-200 hover:border-yellow-400 hover:scale-105 transition-all duration-200 text-center group h-full flex flex-col"
                >
                  {/* Icon */}
                  <div className="flex justify-center mb-6">
                    <div className="w-16 h-16 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-200" style={{ backgroundColor: '#F3ED17' }}>
                      {feature.icon}
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    {feature.title}
                  </h3>
                  
                  <p className="text-gray-600 leading-relaxed flex-grow">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* What's Included Section */}
      <section className="py-16 bg-white">
        <div className="w-full px-6 lg:px-12">
          <div className="max-w-7xl mx-auto">
            <div className="mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                What&apos;s Included in Our Service
              </h2>
              <div className="w-16 h-1 mb-6" style={{ backgroundColor: '#F3ED17' }}></div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {bulletPoints.map((point, index) => (
                <div 
                  key={index}
                  className="bg-gray-50 p-4 shadow-sm border-l-4 border-gray-200 hover:border-yellow-400 hover:scale-105 transition-all duration-200 group flex items-center space-x-4"
                >
                  {/* Icon */}
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-200" style={{ backgroundColor: '#F3ED17' }}>
                      <div className="text-black">
                        {getIconForBulletPoint(point)}
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <p className="text-gray-700 leading-relaxed flex-grow text-left">
                    {point}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* What Our Clients Say */}
      <section className="py-16 bg-white">
        <div className="w-full px-6 lg:px-12">
          <div className="max-w-7xl mx-auto">
            <div className="mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                What Our Clients Say
              </h2>
              <div className="w-16 h-1 mb-6" style={{ backgroundColor: '#F3ED17' }}></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  id: 1,
                  reviewer_name: "Sarah Mitchell",
                  rating: 5,
                  content: "MKM Trees cleared 20 hectares on our lifestyle block perfectly. Professional crew, amazing equipment, and they left everything tidy. Couldn't be happier with the result!",
                  source: "google"
                },
                {
                  id: 2,
                  reviewer_name: "David Thompson",
                  rating: 5,
                  content: "Had a massive tree come down in the storm blocking our driveway. MKM Trees had it cleared within hours of calling. Brilliant service, fair pricing, and genuinely helpful team.",
                  source: "facebook"
                },
                {
                  id: 3,
                  reviewer_name: "Lisa Chen",
                  rating: 5,
                  content: "Needed some delicate tree work near power lines. The MKM Trees team handled it expertly with all the right safety gear. Quality work and excellent communication throughout.",
                  source: "google"
                }
              ].map((review) => (
                <div
                  key={review.id}
                  className="bg-gray-50 p-6 shadow-sm border-l-4 border-gray-200 hover:border-yellow-400 hover:scale-105 transition-all duration-200 h-full flex flex-col"
                >
                  {/* Stars */}
                  <div className="flex items-center mb-4">
                    {Array.from({ length: 5 }, (_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                        fill="currentColor"
                      />
                    ))}
                  </div>

                  {/* Review Content */}
                  <blockquote className="text-gray-600 text-base leading-relaxed mb-6 flex-grow">
                    &ldquo;{review.content}&rdquo;
                  </blockquote>

                  {/* Reviewer Info */}
                  <div className="border-t border-gray-200 pt-4 mt-auto">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-gray-900 mb-1">
                          {review.reviewer_name}
                        </div>
                        {review.source && (
                          <div className="text-sm text-gray-500 capitalize">
                            via {review.source}
                          </div>
                        )}
                      </div>
                      {review.source && (
                        <div className="flex-shrink-0">
                          {review.source === 'google' && (
                            <FaGoogle className="h-5 w-5" style={{ color: '#050608' }} />
                          )}
                          {review.source === 'facebook' && (
                            <FaFacebook className="h-5 w-5" style={{ color: '#050608' }} />
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Read All Reviews Button */}
          <div className="text-center mt-12">
            <Link
              href="/reviews"
              className="inline-flex items-center px-8 py-3 font-semibold text-black hover:scale-105 hover:shadow-lg focus-visible-ring focus-ring-yellow group relative rounded-sm"
              style={{ 
                backgroundColor: '#F3ED17',
                transition: 'transform 300ms ease-in-out, box-shadow 300ms ease-in-out'
              }}
            >
              <span className="relative">
                Read All Reviews
                <span 
                  className="absolute -bottom-1 left-0 right-0 h-0.5 bg-black transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"
                />
              </span>
              <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>

      <ContactSection />
    </main>
  );
}