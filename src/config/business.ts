// Business Configuration Template
// Customize this file for each project

export const businessConfig = {
  // Basic Business Information
  name: "MKM Trees",
  tagline: "Professional Tree Services",
  description: "Expert tree care and landscaping services",
  
  // Contact Information
  contact: {
    email: "mkmcontracting@outlook.co.nz",
    phone: "021 040 8099",
    address: {
      street: "123 Business Street",
      city: "Your City",
      state: "Your State",
      zip: "12345",
      country: "Your Country"
    }
  },
  
  // Social Media
  social: {
    facebook: "",
    instagram: "",
    twitter: "",
    linkedin: "",
    youtube: ""
  },
  
  // Business Hours
  hours: {
    monday: "9:00 AM - 5:00 PM",
    tuesday: "9:00 AM - 5:00 PM",
    wednesday: "9:00 AM - 5:00 PM",
    thursday: "9:00 AM - 5:00 PM",
    friday: "9:00 AM - 5:00 PM",
    saturday: "Closed",
    sunday: "Closed"
  },
  
  // SEO Settings
  seo: {
    title: "Your Business Name - Your Industry",
    description: "Professional [your industry] services in [your location]",
    keywords: ["your industry", "your location", "your services"],
    ogImage: "/images/og-image.jpg"
  },
  
  // Logo and Branding
  branding: {
    logo: "/logo.png",
    logoAlt: "MKM Trees Logo",
    favicon: "/favicon.ico",
    primaryColor: "#0066cc",
    secondaryColor: "#333333"
  },
  
  // Copyright
  copyright: "Your Business Name"
};

// Navigation Configuration (configure as needed for each project)
export const navigationConfig = {
  main: [
    { name: "Home", href: "/" },
    { name: "About Us", href: "/about" },
    { name: "Reviews", href: "/reviews" },
    { name: "Portfolio", href: "/portfolio" },
    { name: "Tips & Advice", href: "/tips" },
    { name: "Service Areas", href: "/service-areas" },
    { name: "Contact Us", href: "/contact" }
  ],
  
  footer: [
    // Add footer links as needed per project
  ]
};

// Function to get business config (used throughout the app)
export const getBusinessConfig = () => businessConfig;