import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://yourdomain.com' // Replace with your actual domain
  
  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/about',
          '/contact',
          '/services',
          '/services/*',
          '/portfolio',
          '/portfolio/*',
          '/news',
          '/news/*',
          '/reviews',
          '/faq',
          '/privacy-policy',
          '/terms-of-service',
        ],
        disallow: [
          '/admin',
          '/admin/*',
          '/api',
          '/api/*',
          '/_next',
          '/_next/*',
          '/debug-turnstile',
          '/debug-turnstile/*',
          '*.json',
          '/client-assets/team/*', // Exclude team photos for privacy
        ],
      },
      // Specifically block admin area for all crawlers
      {
        userAgent: '*',
        disallow: ['/admin/', '/api/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
} 