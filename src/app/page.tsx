import Hero from '@/components/sections/Hero';
import ServiceTiles from '@/components/sections/ServiceTiles';
import Portfolio from '@/components/sections/Portfolio';
import About from '@/components/sections/About';
import Reviews from '@/components/sections/Reviews';
import BlogTiles from '@/components/sections/BlogTiles';
import ServiceAreasPreview from '@/components/sections/ServiceAreasPreview';
import ContactSection from '@/components/sections/ContactSection';
import { getRequestContext } from '@cloudflare/next-on-pages';
import { createDbService } from '@/lib/db';
import { fallbackProjects, fallbackReviews, fallbackPosts } from '@/data/fallback-data';

export default async function HomePage() {
  const services = [
    {
      title: 'Tree Topping / Vegetation Management',
      description: 'Tall tree topping and vegetation control for rural properties and lifestyle blocks',
      image: 'https://placehold.co/600x400/2d5016/ffffff?text=Tree+Topping',
      imageAlt: 'Tree topping and vegetation management services',
      href: '/tree-topping-vegetation-management-canterbury'
    },
    {
      title: 'Tree Services',
      description: 'Qualified arborists providing stump grinding, tree reductions, and expert tree care',
      image: 'https://placehold.co/600x400/4a5568/ffffff?text=Tree+Services',
      imageAlt: 'Professional tree services and arborist work',
      href: '/tree-services-canterbury'
    },
    {
      title: 'Earthworks',
      description: 'Land clearing, station work, and heavy-duty tilling for Canterbury properties',
      image: 'https://placehold.co/600x400/8b4513/ffffff?text=Earthworks',
      imageAlt: 'Earthworks and land clearing equipment',
      href: '/earthworks-canterbury'
    },
    {
      title: 'Emergency Callouts',
      description: 'Rapid response for urgent tree and earthworks situations across Canterbury',
      image: 'https://placehold.co/600x400/dc2626/ffffff?text=Emergency',
      imageAlt: 'Emergency tree services and callouts',
      href: '/emergency-callouts-canterbury'
    },
    {
      title: 'Wood Chip & Fire Wood',
      description: 'Premium wood chips, seasoned firewood, mulch, and calf bedding delivered',
      image: 'https://placehold.co/600x400/92400e/ffffff?text=Wood+Chips',
      imageAlt: 'Wood chips and firewood products',
      href: '/wood-chip-firewood-canterbury'
    },
    {
      title: 'Mulching',
      description: 'Heavy-duty paddock mulching, gorse clearing, and slash processing services',
      image: 'https://placehold.co/600x400/365314/ffffff?text=Mulching',
      imageAlt: 'Mulching services and equipment',
      href: '/mulching-canterbury'
    }
  ];

  // Get portfolio projects - try database first, fallback to static data
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
      const dbProjects = await dbService.getRecentPortfolioProjects(3);
      
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

  // If no database projects, use fallback data
  if (portfolioProjects.length === 0) {
    portfolioProjects = fallbackProjects.slice(0, 3).map(project => ({
      id: project.id,
      title: project.title,
      slug: project.slug,
      description: project.description,
      client_name: project.client_name || 'Client',
      featured_image: project.featured_image || '/images/placeholder-project.jpg'
    }));
  }

  // Get reviews - try database first, fallback to static data
  let reviews: Array<{
    id: number;
    reviewer_name: string;
    rating: number;
    content: string;
    source: string;
  }> = [];
  try {
    const context = getRequestContext();
    if (context?.env?.DB) {
      const dbService = createDbService(context.env.DB);
      const dbReviews = await dbService.getApprovedReviews(3);
      reviews = dbReviews.map(review => ({
        id: review.id,
        reviewer_name: review.reviewer_name,
        rating: review.rating || 5,
        content: review.content,
        source: 'google'
      }));
    }
  } catch {
    console.log('Database not available, using fallback reviews data');
  }

  // If no database reviews, use fallback data
  if (reviews.length === 0) {
    reviews = fallbackReviews.slice(0, 3);
  }

  // Get blog posts - try database first, fallback to static data
  let blogPosts: Array<{
    id: number;
    title: string;
    slug: string;
    excerpt: string;
    featured_image?: string;
    published_at?: number;
  }> = [];
  try {
    const context = getRequestContext();
    if (context?.env?.DB) {
      const dbService = createDbService(context.env.DB);
      const dbPosts = await dbService.getPublishedPosts(3);
      
      // Transform database posts to match component interface
      blogPosts = dbPosts.map(post => ({
        id: post.id,
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt || '',
        featured_image: post.featured_image_id ? `/api/media/${post.featured_image_id}` : undefined,
        published_at: post.published_at
      }));
    }
  } catch {
    console.log('Database not available, using fallback blog posts data');
  }

  // If no database posts, use fallback data
  if (blogPosts.length === 0) {
    blogPosts = fallbackPosts.slice(0, 3).map(post => ({
      id: post.id,
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt || '',
      featured_image: post.featured_image,
      published_at: post.published_at
    }));
  }

  return (
    <main>
      <Hero
        title="Canterbury's Tree Topping & Land Clearing Experts"
        subtitle="Serving lifestyle blocks, farms, and rural properties with precision and power"
        backgroundImage="https://placehold.co/1920x1080/4a5568/ffffff?text=Tree+Service+Landscape"
        backgroundAlt="Professional tree service equipment and landscape"
        buttons={[
          { text: 'About Us', href: '/about', variant: 'primary' },
          { text: 'Contact Us', href: '/contact', variant: 'primary' }
        ]}
      />
      
      <ServiceTiles
        title="Our Services"
        subtitle="From precise tree topping to full-scale land clearing, we've got Canterbury covered with professional equipment and qualified expertise for every job."
        services={services}
      />
      
      <Portfolio
        title="Recent Projects"
        projects={portfolioProjects}
      />
      
      <About
        title="A Bit More About MKM Trees"
        content="MKM Trees is a locally owned business serving Christchurch and Canterbury. We specialise in tree topping, vegetation management, land clearing, earthworks, and emergency callouts — delivered by a reliable local crew who know the land.

With qualified arborists and a brand-new fleet of specialised gear, we handle everything from suburban jobs to full-scale clearing on lifestyle blocks and farms. We regularly work on remote properties where access, safety, and fast turnaround matter most.

Our team is known for being hardworking, honest, and easy to deal with. Every job is completed to a high standard with care and respect for your property. We're proud to hold Gold SiteWise certification, backing our commitment to top-tier safety.

If you're after a team with real experience, serious gear, and a reputation for quality, MKM Trees is ready when you are."
        image="https://placehold.co/800x600/4a5568/ffffff?text=MKM+Trees+Team"
        imageAlt="MKM Trees team and equipment"
        showReadMore={true}
      />
      
      <Reviews
        title="What Our Clients Say"
        subtitle="Real feedback from customers across Canterbury who trust MKM Trees with their land clearing and tree service needs"
        reviews={reviews}
      />
      
      <BlogTiles
        title="Tips & Advice"
        posts={blogPosts}
      />
      
      <ServiceAreasPreview />
      
      <ContactSection />
    </main>
  );
}