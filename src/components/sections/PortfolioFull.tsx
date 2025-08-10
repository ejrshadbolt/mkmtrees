import Image from 'next/image';
import Link from 'next/link';
import { getRequestContext } from '@cloudflare/next-on-pages';
import { createDbService } from '@/lib/db';
import { fallbackProjects } from '@/data/fallback-data';

interface PortfolioProject {
  id: number;
  title: string;
  slug: string;
  description: string;
  client_name: string;
  featured_image: string;
}

interface PortfolioFullProps {
  title?: string;
  projects: PortfolioProject[];
}

export default function PortfolioFull({ 
  title = "Our Recent Projects",
  projects 
}: PortfolioFullProps) {
  return (
    <section className="bg-white">
        
      {projects.map((project, index) => {
        const isEven = index % 2 === 0;
        
        return (
          <div
            key={project.id}
            className="grid grid-cols-1 lg:grid-cols-2 min-h-[500px]"
          >
            {/* Image Column */}
            <div className={`${isEven ? 'order-1' : 'order-2'} relative overflow-hidden bg-gray-200`}>
              <Image
                src={project.featured_image}
                alt={project.title}
                fill
                className="object-cover transition-transform duration-300 hover:scale-105"
              />
            </div>
            
            {/* Content Column */}
            <div className={`${isEven ? 'order-2' : 'order-1'} bg-white flex items-center p-8 lg:p-16`}>
              <div className="w-full space-y-6">
                <div className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                  {project.client_name}
                </div>
                
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
                  {project.title}
                </h3>
                
                <p className="text-gray-600 text-lg leading-relaxed">
                  {project.description}
                </p>
                
                <div className="pt-4">
                  <Link
                    href={`/portfolio/${project.slug}`}
                    className="inline-flex items-center px-6 py-3 font-semibold text-black transition-all duration-200 hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 group"
                    style={{ backgroundColor: '#F3ED17' }}
                  >
                    View Project Details
                    <svg
                      className="ml-2 h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        );
      })}
        
      {/* Bottom strip */}
      <div className="text-center py-6 px-6 lg:px-12" style={{ backgroundColor: '#050608' }}>
        <p className="text-white text-lg">
          Need expert tree services or land clearing? We're ready to tackle your next project.
        </p>
      </div>
    </section>
  );
}