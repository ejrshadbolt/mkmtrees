import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Calendar, MapPin, Tag } from 'lucide-react';
import { getRequestContext } from '@cloudflare/next-on-pages';
import { createDbService } from '@/lib/db';
import { fallbackProjects } from '@/data/fallback-data';
import ContactSection from '@/components/sections/ContactSection';
import PortfolioGallery from '@/components/ui/PortfolioGallery';

export const runtime = 'edge';

interface PortfolioProjectPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function PortfolioProjectPage({ params }: PortfolioProjectPageProps) {
  const { slug } = await params;
  // Get the specific project - try database first, fallback to static data
  let project = null;
  
  try {
    const context = getRequestContext();
    if (context?.env?.DB) {
      const dbService = createDbService(context.env.DB);
      const dbProject = await dbService.getProjectBySlug(slug);
      
      if (dbProject) {
        project = {
          id: dbProject.id,
          title: dbProject.title,
          slug: dbProject.slug,
          description: dbProject.description || '',
          content: dbProject.description || '', // Use description as content
          location: dbProject.client_name || '',
          featured_image: dbProject.featured_image_id ? `/api/media/${dbProject.featured_image_id}` : undefined,
          published_at: dbProject.published_at,
          category: dbProject.category_id?.toString() || '',
          gallery_images: [] // Would be populated from database relations
        };
      }
    }
  } catch {
    console.log('Database not available, using fallback portfolio project data');
  }

  // If no database project, check fallback data
  if (!project) {
    const fallbackProject = fallbackProjects.find(p => p.slug === slug);
    if (fallbackProject) {
      project = {
        id: fallbackProject.id,
        title: fallbackProject.title,
        slug: fallbackProject.slug,
        description: fallbackProject.description || '',
        content: fallbackProject.content,
        location: 'Canterbury', // Use hardcoded location for fallback
        featured_image: fallbackProject.featured_image,
        published_at: fallbackProject.published_at,
        category: 'Tree Services', // Use hardcoded category for fallback
        // Generate some gallery images for demo
        gallery_images: [
          "/landclearing.webp",
          "/earthworks.webp", 
          "/mulching.webp",
          "/heavydutytilling.webp",
          "/stationwork.webp",
          "/review.webp"
        ]
      };
    }
  }

  if (!project) {
    notFound();
  }

  // Format the date
  const completedDate = new Date((project.published_at || Date.now()) * 1000).toLocaleDateString('en-NZ', {
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
      <section className="py-16 bg-white">
        <div className="w-full px-6 lg:px-12">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Project Gallery
            </h2>
            <div className="w-16 h-1 mb-12" style={{ backgroundColor: '#F3ED17' }}></div>
            
            {(() => {
              // Combine featured image with gallery images
              const allImages = [];
              const allTitles = [];
              
              if (project.featured_image) {
                allImages.push(project.featured_image);
                allTitles.push(`${project.title} - Featured image`);
              }
              
              if (project.gallery_images && project.gallery_images.length > 0) {
                allImages.push(...project.gallery_images);
                allTitles.push(...project.gallery_images.map((_, index) => `${project.title} - Gallery image ${index + 1}`));
              }
              
              if (allImages.length === 0) return null;
              
              return (
                <PortfolioGallery 
                  images={allImages}
                  titles={allTitles}
                  projectTitle={project.title}
                />
              );
            })()}
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