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
        backgroundImage="https://placehold.co/1920x1080/2d5016/ffffff?text=MKM+Trees+Portfolio+Projects"
        backgroundAlt="MKM Trees completed tree service and land clearing projects across Canterbury"
      />
      
      <PortfolioFull
        title="Recent Projects"
        projects={portfolioProjects}
      />
      
      <ContactSection />
    </main>
  );
}