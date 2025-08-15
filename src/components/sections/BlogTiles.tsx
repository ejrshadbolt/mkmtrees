import Image from 'next/image';
import Link from 'next/link';

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  featured_image?: string;
  published_at?: number;
}

interface BlogTilesProps {
  title?: string;
  posts: BlogPost[];
}

export default function BlogTiles({ title, posts }: BlogTilesProps) {
  // const formatDate = (timestamp?: number) => {
  //   if (!timestamp) return '';
  //   const date = new Date(timestamp * 1000);
  //   return date.toLocaleDateString('en-NZ', { 
  //     year: 'numeric', 
  //     month: 'long', 
  //     day: 'numeric' 
  //   });
  // };

  return (
    <section className="py-16 bg-white">
      <div className="w-full px-6 lg:px-12">
        {title && (
          <div className="mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
              {title}
            </h2>
            <div className="w-16 h-1" style={{ backgroundColor: '#F3ED17' }}></div>
          </div>
        )}
        
        {/* Tiles Container - 80% width */}
        <div className="w-4/5 mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <Link
                key={post.id}
                href={`/tips/${post.slug}`}
                className="group relative overflow-hidden bg-gray-50 shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-yellow-400 focus:ring-offset-2"
              >
                {/* Background Image */}
                <div className="relative aspect-[4/3] overflow-hidden bg-gray-200">
                  <Image
                    src={post.featured_image || '/images/placeholder-blog.jpg'}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                </div>

                {/* Content */}
                <div className="p-6 space-y-3">
                  <h3 className="text-xl font-bold text-gray-900 leading-tight group-hover:text-gray-700 transition-colors duration-300">
                    {post.title}
                  </h3>
                  
                  <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                    {post.excerpt}
                  </p>
                  
                  <div className="pt-2">
                    <span className="inline-flex items-center text-sm font-semibold text-black px-2 py-0.5 rounded relative group/readmore">
                      Read More →
                      <span 
                        className="absolute bottom-0 left-2 right-2 h-0.5 transform scale-x-0 group-hover/readmore:scale-x-100 transition-transform duration-200 origin-left"
                        style={{ backgroundColor: '#F3ED17' }}
                      />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
        
        {/* View All Tips Link */}
        <div className="text-center mt-16">
          <Link
            href="/tips"
            className="inline-flex items-center px-8 py-3 font-semibold text-black hover:scale-105 hover:shadow-lg focus-visible-ring focus-ring-yellow group relative rounded-sm"
            style={{ 
              backgroundColor: '#F3ED17',
              transition: 'transform 300ms ease-in-out, box-shadow 300ms ease-in-out'
            }}
          >
            <span className="relative">
              View All Tips & Advice
              <span 
                className="absolute -bottom-1 left-0 right-0 h-0.5 bg-black transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"
              />
            </span>
            <svg
              className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1"
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
    </section>
  );
}