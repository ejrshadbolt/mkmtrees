import SimpleHero from '@/components/sections/SimpleHero';
import BlogTilesFull from '@/components/sections/BlogTilesFull';
import ContactSection from '@/components/sections/ContactSection';
import { getRequestContext } from '@cloudflare/next-on-pages';
import { createDbService } from '@/lib/db';
import { fallbackPosts } from '@/data/fallback-data';

export default async function TipsPage() {
  // Get all blog posts - try database first, fallback to static data
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
      const dbPosts = await dbService.getAllPublishedPosts(); // Get ALL posts
      
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

  // If no database posts, use all fallback data
  if (blogPosts.length === 0) {
    blogPosts = fallbackPosts.map(post => ({
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
      <SimpleHero
        title="Tips & Advice"
        subtitle="Expert guidance on tree care, land maintenance, and property management from Canterbury's trusted arborists."
        backgroundImage="/tipsandadvice.webp"
        backgroundAlt="Professional tree care tips and advice from MKM Trees experts"
        buttons={[
          { text: 'Contact Us', href: '/contact', variant: 'primary' }
        ]}
      />
      
      <BlogTilesFull
        title="Tips & Advice"
        posts={blogPosts}
      />
      
      <ContactSection 
        title="Got a Tree or Land Question?"
        subtitle="Want expert advice on a tricky tree, overgrown paddock, or storm damage prep? Send us your question — our Canterbury-based team is happy to help and might even feature it in a future MKM Tips & Advice article."
      />
    </main>
  );
}