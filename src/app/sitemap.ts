import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://macell.co.nz' // Replace with your actual domain
  
  // Static pages
  const staticRoutes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/services`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/portfolio`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/news`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/reviews`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms-of-service`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    },
  ]

  // Service pages - Main categories
  const serviceCategories = [
    {
      url: `${baseUrl}/services/residential`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/services/commercial`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/services/industrial`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/services/security`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/services/central-north-island`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
  ]

  // Detailed service pages
  const detailedServices = [
    // Residential services
    'services/residential/emergency',
    'services/residential/ev-chargers',
    'services/residential/heatpump',
    'services/residential/hot-water',
    'services/residential/lighting-design',
    'services/residential/maintenance',
    'services/residential/new-home-wiring',
    'services/residential/rewiring',
    'services/residential/solar',
    
    // Commercial services
    'services/commercial/dairy-farming',
    'services/commercial/emergency',
    'services/commercial/lighting-upgrades',
    'services/commercial/office-shop-fitout',
    'services/commercial/security-lighting',
    'services/commercial/workshop-fitouts',
    
    // Industrial services
    'services/industrial/emergency',
    'services/industrial/maintenance-upgrades',
    'services/industrial/motor-drive-systems',
    'services/industrial/plc-automation',
    'services/industrial/power-distribution',
    'services/industrial/safety-testing',
    
    // Security services
    'services/security/24-7-monitoring',
    'services/security/access-control',
    'services/security/cctv',
    'services/security/gate-automation',
    'services/security/monitoring',
    'services/security/smart-locks',
    
    // Central North Island services
    'services/central-north-island/commercial-domestic',
    'services/central-north-island/emergency-callouts',
    'services/central-north-island/farm-rural-electrical',
    'services/central-north-island/home-lifestyle-electrical',
    'services/central-north-island/solar-energy-solutions',
  ].map(path => ({
    url: `${baseUrl}/${path}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  return [
    ...staticRoutes,
    ...serviceCategories,
    ...detailedServices,
  ]
} 