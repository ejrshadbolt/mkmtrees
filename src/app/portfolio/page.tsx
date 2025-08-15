import SimpleHero from '@/components/sections/SimpleHero';
import PortfolioFull from '@/components/sections/PortfolioFull';
import ContactSection from '@/components/sections/ContactSection';
import { getRequestContext } from '@cloudflare/next-on-pages';
import { createDbService } from '@/lib/db';
import { fallbackProjects } from '@/data/fallback-data';

export default async function PortfolioPage() {
  // Get all portfolio projects - try database first, fallback to static data
  let portfolioProjects: Array<{
    id: number;
    title: string;
    slug: string;
    description: string;
    client_name: string;
    featured_image: string;
  }> = [];
  try {
    const context = getRequestContext();
    if (context?.env?.DB) {
      const dbService = createDbService(context.env.DB);
      const dbProjects = await dbService.getAllPortfolioProjects(); // Get ALL projects
      
      // Transform database projects to match component interface
      portfolioProjects = dbProjects.map(project => ({
        id: project.id,
        title: project.title,
        slug: project.slug,
        description: project.description,
        client_name: project.client_name || 'Client',
        featured_image: project.featured_image_id ? `/api/media/${project.featured_image_id}` : '/images/placeholder-project.jpg'
      }));
    }
  } catch {
    console.log('Database not available, using fallback portfolio data');
  }

  // If no database projects, use all fallback data
  if (portfolioProjects.length === 0) {
    portfolioProjects = fallbackProjects.map(project => ({
      id: project.id,
      title: project.title,
      slug: project.slug,
      description: project.description,
      client_name: project.client_name || 'Client',
      featured_image: project.featured_image || '/images/placeholder-project.jpg'
    }));
  }

  return (
    <main>
      <SimpleHero
        title="Our Portfolio"
        subtitle="Professional tree services and land clearing projects completed across Canterbury."
        backgroundImage="/portfolio.webp"
        backgroundAlt="MKM Trees completed tree service and land clearing projects across Canterbury"
        buttons={[
          { text: 'Contact Us', href: '/contact', variant: 'primary' }
        ]}
      />
      
      {/* Recent Projects Banner */}
      <section className="bg-white">
        <div className="w-full py-6 px-6 lg:px-12 bg-white">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
              Recent Projects
            </h2>
            <div className="w-16 h-1" style={{ backgroundColor: '#F3ED17' }}></div>
          </div>
        </div>
      </section>
      
      <PortfolioFull
        projects={portfolioProjects}
      />
      
      <ContactSection />
    </main>
  );
}