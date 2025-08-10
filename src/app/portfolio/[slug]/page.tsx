import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Calendar, MapPin, Tag } from 'lucide-react';
import { getRequestContext } from '@cloudflare/next-on-pages';
import { createDbService } from '@/lib/db';
import { fallbackProjects } from '@/data/fallback-data';
import ContactSection from '@/components/sections/ContactSection';

interface PortfolioProjectPageProps {
  params: {
    slug: string;
  };
}

export default async function PortfolioProjectPage({ params }: PortfolioProjectPageProps) {
  // Get the specific project - try database first, fallback to static data
  let project = null;
  
  try {
    const context = getRequestContext();
    if (context?.env?.DB) {
      const dbService = createDbService(context.env.DB);
      const dbProject = await dbService.getProjectBySlug(params.slug);
      
      if (dbProject) {
        project = {
          id: dbProject.id,
          title: dbProject.title,
          slug: dbProject.slug,
          description: dbProject.description || '',
          content: dbProject.content,
          location: dbProject.location || '',
          featured_image: dbProject.featured_image_id ? `/api/media/${dbProject.featured_image_id}` : undefined,
          published_at: dbProject.published_at,
          category: dbProject.category || '',
          gallery_images: [] // Would be populated from database relations
        };
      }
    }
  } catch (error) {
    console.log('Database not available, using fallback portfolio project data');
  }

  // If no database project, check fallback data
  if (!project) {
    const fallbackProject = fallbackProjects.find(p => p.slug === params.slug);
    if (fallbackProject) {
      project = {
        id: fallbackProject.id,
        title: fallbackProject.title,
        slug: fallbackProject.slug,
        description: fallbackProject.description || '',
        content: fallbackProject.content,
        location: fallbackProject.location || 'Canterbury',
        featured_image: fallbackProject.featured_image,
        published_at: fallbackProject.published_at,
        category: fallbackProject.category || 'Tree Services',
        // Generate some gallery images for demo
        gallery_images: [
          `https://placehold.co/800x600/2d5016/ffffff?text=Before+${fallbackProject.id}`,
          `https://placehold.co/800x600/8b4513/ffffff?text=During+${fallbackProject.id}`,
          `https://placehold.co/800x600/228b22/ffffff?text=After+${fallbackProject.id}`,
          `https://placehold.co/800x600/4a5568/ffffff?text=Equipment+${fallbackProject.id}`,
          `https://placehold.co/800x600/2d5016/ffffff?text=Details+${fallbackProject.id}`,
          `https://placehold.co/800x600/8b4513/ffffff?text=Results+${fallbackProject.id}`
        ]
      };
    }
  }

  if (!project) {
    notFound();
  }

  // Format the date
  const completedDate = new Date(project.published_at * 1000).toLocaleDateString('en-NZ', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <main>
      {/* Hero Section */}
      <section className="py-16 bg-white">
        <div className="w-full px-6 lg:px-12">
          <div className="max-w-7xl mx-auto">
            {/* Back Link */}
            <Link 
              href="/portfolio"
              className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors mb-8 group"
            >
              <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
              Back to Portfolio
            </Link>

            {/* Project Header */}
            <header className="mb-12">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                {project.title}
              </h1>
              <div className="w-16 h-1 mb-6" style={{ backgroundColor: '#F3ED17' }}></div>
              
              {/* Meta Information */}
              <div className="flex flex-wrap items-center gap-6 text-gray-600 mb-6">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>Completed {completedDate}</span>
                </div>
                {project.location && (
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span>{project.location}</span>
                  </div>
                )}
                {project.category && (
                  <div className="flex items-center">
                    <Tag className="w-4 h-4 mr-2" />
                    <span>{project.category}</span>
                  </div>
                )}
              </div>

              {/* Description */}
              <p className="text-xl text-gray-600 leading-relaxed max-w-4xl">
                {project.description}
              </p>
            </header>
          </div>
        </div>
      </section>

      {/* Image Gallery - Main Focus */}
      <section className="py-16 bg-gray-50">
        <div className="w-full px-6 lg:px-12">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
              Project Gallery
            </h2>
            
            {/* Featured Image */}
            {project.featured_image && (
              <div className="relative aspect-[16/9] mb-12 rounded-lg overflow-hidden shadow-xl">
                <Image
                  src={project.featured_image}
                  alt={`${project.title} - Main project image`}
                  fill
                  className="object-cover"
                />
              </div>
            )}

            {/* Gallery Grid */}
            {project.gallery_images && project.gallery_images.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {project.gallery_images.map((image, index) => (
                  <div 
                    key={index}
                    className="relative aspect-[4/3] rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-200 group"
                  >
                    <Image
                      src={image}
                      alt={`${project.title} - Gallery image ${index + 1}`}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Project Details */}
      <section className="py-16 bg-white">
        <div className="w-full px-6 lg:px-12">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              Project Details
            </h2>
            <div className="w-16 h-1 mb-8" style={{ backgroundColor: '#F3ED17' }}></div>

            {/* Project Content */}
            <article className="prose prose-lg max-w-none">
              <div 
                className="text-lg text-gray-700 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: project.content }}
              />
            </article>

          </div>
        </div>
      </section>

      <ContactSection 
        title="Ready to Start Your Project?"
        subtitle="Inspired by what you've seen? Our experienced team delivers professional results across all types of tree services and land clearing projects in Canterbury. Get in touch to discuss your project needs."
      />
    </main>
  );
}