import Image from 'next/image';
import Link from 'next/link';

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
            <Link 
              href={`/portfolio/${project.slug}`}
              className={`${isEven ? 'lg:order-1' : 'lg:order-2'} order-1 relative overflow-hidden bg-gray-200 cursor-pointer focus-visible-ring focus-ring-yellow min-h-[400px] lg:min-h-0`}
            >
              <Image
                src={project.featured_image}
                alt={project.title}
                fill
                className="object-cover transition-transform duration-300 hover:scale-105"
              />
            </Link>
            
            {/* Content Column */}
            <div className={`${isEven ? 'lg:order-2' : 'lg:order-1'} order-2 bg-white flex items-center p-8 lg:p-16`}>
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
                    className="inline-flex items-center px-6 py-3 font-semibold text-black hover:scale-105 hover:shadow-lg focus-visible-ring focus-ring-yellow group relative rounded-sm"
                    style={{ 
                      backgroundColor: '#F3ED17',
                      transition: 'transform 300ms ease-in-out, box-shadow 300ms ease-in-out'
                    }}
                  >
                    <span className="relative">
                      View Project Details
                      <span 
                        className="absolute -bottom-1 left-0 right-0 h-0.5 bg-black transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"
                      />
                    </span>
                    <svg
                      className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
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
        
      {/* White section to break up the layout */}
      <section className="py-16 bg-white">
        <div className="w-full px-6 lg:px-12">
          <div className="max-w-4xl">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Every Project Tells a Story
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              From emergency tree removal to large-scale land clearing, each project showcases our commitment to safety, precision, and results. Browse our completed work across Canterbury to see the MKM Trees difference.
            </p>
          </div>
        </div>
      </section>
    </section>
  );
}