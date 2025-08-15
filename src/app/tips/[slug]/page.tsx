import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Calendar, User } from 'lucide-react';
import { getRequestContext } from '@cloudflare/next-on-pages';
import { createDbService } from '@/lib/db';
import { fallbackPosts } from '@/data/fallback-data';
import ContactSection from '@/components/sections/ContactSection';

export const runtime = 'edge';

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  // Get the specific blog post - try database first, fallback to static data
  let post = null;
  
  try {
    const context = getRequestContext();
    if (context?.env?.DB) {
      const dbService = createDbService(context.env.DB);
      const dbPost = await dbService.getPostBySlug(slug);
      
      if (dbPost) {
        post = {
          id: dbPost.id,
          title: dbPost.title,
          slug: dbPost.slug,
          excerpt: dbPost.excerpt || '',
          content: dbPost.content,
          featured_image: dbPost.featured_image_id ? `/api/media/${dbPost.featured_image_id}` : undefined,
          published_at: dbPost.published_at,
          tags: [] // Tags would be fetched separately
        };
      }
    }
  } catch {
    console.log('Database not available, using fallback blog post data');
  }

  // If no database post, check fallback data
  if (!post) {
    const fallbackPost = fallbackPosts.find(p => p.slug === slug);
    if (fallbackPost) {
      post = {
        id: fallbackPost.id,
        title: fallbackPost.title,
        slug: fallbackPost.slug,
        excerpt: fallbackPost.excerpt || '',
        content: fallbackPost.content,
        featured_image: fallbackPost.featured_image,
        published_at: fallbackPost.published_at,
        tags: fallbackPost.tags || []
      };
    }
  }

  if (!post) {
    notFound();
  }

  // Format the date
  const publishDate = new Date((post.published_at || Date.now()) * 1000).toLocaleDateString('en-NZ', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <main>
      {/* Hero Section */}
      <section className="py-16 bg-white">
        <div className="w-full px-6 lg:px-12">
          <div className="max-w-4xl mx-auto">
            {/* Back Link */}
            <Link 
              href="/tips"
              className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors mb-8 group"
            >
              <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
              Back to Tips & Advice
            </Link>

            {/* Featured Image */}
            {post.featured_image && (
              <div className="relative aspect-[16/9] mb-8 rounded-sm overflow-hidden shadow-lg">
                <Image
                  src={post.featured_image}
                  alt={post.title}
                  fill
                  className="object-cover"
                />
              </div>
            )}

            {/* Article Header */}
            <header className="mb-12">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                {post.title}
              </h1>
              <div className="w-16 h-1 mb-6" style={{ backgroundColor: '#F3ED17' }}></div>
              
              {/* Meta Information */}
              <div className="flex flex-wrap items-center gap-6 text-gray-600 mb-6">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  <time>{publishDate}</time>
                </div>
                <div className="flex items-center">
                  <User className="w-4 h-4 mr-2" />
                  <span>MKM Trees Team</span>
                </div>
              </div>

              {/* Tags - Hidden but present for SEO */}
              {post.tags && post.tags.length > 0 && (
                <div className="hidden">
                  {post.tags.map((tag, index) => (
                    <span key={index}>{tag}</span>
                  ))}
                </div>
              )}
            </header>

            {/* Article Content */}
            <article className="prose prose-lg max-w-none">
              <div 
                className="text-lg text-gray-700 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            </article>

          </div>
        </div>
      </section>

      <ContactSection 
        title="Got a Tree or Land Question?"
        subtitle="Want expert advice on a tricky tree, overgrown paddock, or storm damage prep? Send us your question — our Canterbury-based team of qualified arborists is ready to help with all your tree care and land maintenance needs across Canterbury, and we might even feature it in a future MKM Tips & Advice article."
      />
    </main>
  );
}