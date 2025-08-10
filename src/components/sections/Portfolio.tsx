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

interface PortfolioProps {
  title?: string;
  projects: PortfolioProject[];
}

export default function Portfolio({ title, projects }: PortfolioProps) {
  return (
    <section className="bg-white">
      {/* Black title strip */}
      <div className="w-full py-6 px-6 lg:px-12" style={{ backgroundColor: '#050608' }}>
        {title && (
          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-3">
              {title}
            </h2>
            <div className="w-16 h-1" style={{ backgroundColor: '#F3ED17' }}></div>
          </div>
        )}
      </div>
        
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
                    View Project
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
        
      {/* View All Portfolio Link */}
      <div className="text-center py-6 px-6 lg:px-12" style={{ backgroundColor: '#050608' }}>
        <Link
          href="/portfolio"
          className="inline-flex items-center text-white font-semibold text-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 px-2 py-0.5 rounded relative group"
        >
          View All Projects
          <svg
            className="ml-2 h-5 w-5 transition-transform duration-200 group-hover:translate-x-1"
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
          <span 
            className="absolute bottom-0 left-2 right-2 h-0.5 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left"
            style={{ backgroundColor: '#F3ED17' }}
          />
        </Link>
      </div>
    </section>
  );
}