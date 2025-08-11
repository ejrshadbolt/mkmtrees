import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, CheckCircle, Phone, Star } from 'lucide-react';
import { FaGoogle, FaFacebook } from 'react-icons/fa';
import { businessConfig } from '@/config/business';
import ContactSection from '@/components/sections/ContactSection';

interface ServiceFeature {
  icon: React.ReactNode;
  title: string;
  description: string;
}

interface ChildServicePageProps {
  title: string;
  subtitle: string;
  description: string;
  problemTitle: string;
  problemDescription: string;
  solutionTitle: string;
  solutionDescription: string;
  heroImage: string;
  heroImageAlt: string;
  features: ServiceFeature[];
  bulletPoints: string[];
}

export default function ChildServicePage({
  title,
  subtitle,
  description,
  problemTitle,
  problemDescription,
  solutionTitle,
  solutionDescription,
  heroImage,
  heroImageAlt,
  features,
  bulletPoints
}: ChildServicePageProps) {
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
                  className="inline-flex items-center px-8 py-4 font-semibold text-black transition-all duration-200 hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 group text-lg"
                  style={{ backgroundColor: '#F3ED17' }}
                >
                  <Phone className="mr-2 h-5 w-5" />
                  Call for Free Quote
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" />
                </Link>
                
                <Link
                  href="/contact"
                  className="inline-flex items-center px-8 py-4 font-semibold text-black bg-transparent border-2 border-black hover:bg-black hover:text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 text-lg"
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
                  className="text-center p-6 hover:bg-gray-50 transition-colors duration-200 rounded-lg"
                >
                  <div className="flex justify-center mb-6">
                    <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ backgroundColor: '#F3ED17' }}>
                      {feature.icon}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Bullet Points Section */}
      <section className="py-16 bg-white">
        <div className="w-full px-6 lg:px-12">
          <div className="max-w-7xl mx-auto">
            <div className="mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                What&apos;s Included in Our Service
              </h2>
              <div className="w-16 h-1 mb-6" style={{ backgroundColor: '#F3ED17' }}></div>
            </div>
            
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {bulletPoints.map((point, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <CheckCircle className="w-6 h-6 mt-1 flex-shrink-0" style={{ color: '#F3ED17' }} />
                    <span className="text-lg text-gray-700">{point}</span>
                  </div>
                ))}
              </div>
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
        </div>
      </section>

      <ContactSection />
    </main>
  );
}