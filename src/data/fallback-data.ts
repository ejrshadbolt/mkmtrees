// Fallback data for when database is not available
// This provides sample content for development and testing

export const fallbackPosts = [
  {
    id: 1,
    title: "Welcome to Your New Website",
    slug: "welcome-to-your-new-website",
    excerpt: "Your website is now live and ready to be customized with your content.",
    content: `<p>Congratulations on your new website! This is your first blog post.</p>
              <p>You can edit this content in the admin panel at <a href="/admin">/admin</a>.</p>
              <p>Some things you can do:</p>
              <ul>
                <li>Add your business information</li>
                <li>Upload your logo and images</li>
                <li>Write blog posts</li>
                <li>Add portfolio items</li>
                <li>Customize your services</li>
              </ul>`,
    published: true,
    published_at: Math.floor(Date.now() / 1000) - 86400, // 1 day ago
    created_at: Math.floor(Date.now() / 1000) - 86400,
    updated_at: Math.floor(Date.now() / 1000) - 86400,
    author_id: 1,
    featured_image_id: null,
    tags: ["Getting Started", "Website"]
  },
  {
    id: 2,
    title: "How to Get Started",
    slug: "how-to-get-started",
    excerpt: "A quick guide to customizing your new website.",
    content: `<p>Here's how to get started with your new website:</p>
              <h3>1. Access the Admin Panel</h3>
              <p>Go to <a href="/admin">/admin</a> and log in with your admin credentials.</p>
              <h3>2. Update Your Business Information</h3>
              <p>Edit the business configuration files to add your contact information, services, and branding.</p>
              <h3>3. Add Your Content</h3>
              <p>Start adding your own blog posts, portfolio items, and media through the admin interface.</p>
              <h3>4. Customize Your Design</h3>
              <p>Upload your logo, choose your colors, and make the site your own.</p>`,
    published: true,
    published_at: Math.floor(Date.now() / 1000) - 172800, // 2 days ago
    created_at: Math.floor(Date.now() / 1000) - 172800,
    updated_at: Math.floor(Date.now() / 1000) - 172800,
    author_id: 1,
    featured_image_id: null,
    tags: ["Tutorial", "Getting Started"]
  }
];

export const fallbackProjects = [
  {
    id: 1,
    title: "Sample Project",
    slug: "sample-project",
    description: "This is a sample portfolio project. Replace with your own work.",
    content: `<p>This is a sample project to demonstrate the portfolio functionality.</p>
              <p>You can:</p>
              <ul>
                <li>Add project descriptions</li>
                <li>Upload project images</li>
                <li>Categorize your work</li>
                <li>Link to live projects</li>
              </ul>`,
    published: true,
    published_at: Math.floor(Date.now() / 1000) - 86400,
    created_at: Math.floor(Date.now() / 1000) - 86400,
    updated_at: Math.floor(Date.now() / 1000) - 86400,
    author_id: 1,
    featured_image_id: null,
    category_id: 1,
    project_url: "",
    client_name: "Sample Client"
  }
];

export const fallbackReviews = [
  {
    id: 1,
    reviewer_name: "John Doe",
    reviewer_email: "john@example.com",
    rating: 5,
    title: "Great Service",
    content: "Professional and reliable service. Would definitely recommend to others.",
    approved: true,
    created_at: Math.floor(Date.now() / 1000) - 86400,
    updated_at: Math.floor(Date.now() / 1000) - 86400,
    reviewer_image_id: null
  },
  {
    id: 2,
    reviewer_name: "Jane Smith",
    reviewer_email: "jane@example.com",
    rating: 5,
    title: "Excellent Work",
    content: "They exceeded my expectations. Quality work delivered on time.",
    approved: true,
    created_at: Math.floor(Date.now() / 1000) - 172800,
    updated_at: Math.floor(Date.now() / 1000) - 172800,
    reviewer_image_id: null
  }
];

export const fallbackAuthors = [
  {
    id: 1,
    name: "Admin User",
    email: "admin@example.com",
    bio: "Website administrator",
    avatar_id: null,
    created_at: Math.floor(Date.now() / 1000) - 86400,
    updated_at: Math.floor(Date.now() / 1000) - 86400
  }
];

export const fallbackPortfolioCategories = [
  {
    id: 1,
    name: "General",
    slug: "general",
    description: "General portfolio items"
  },
  {
    id: 2,
    name: "Featured",
    slug: "featured", 
    description: "Featured work"
  }
];

export const fallbackTags = [
  {
    id: 1,
    name: "Getting Started",
    slug: "getting-started"
  },
  {
    id: 2,
    name: "Tutorial",
    slug: "tutorial"
  },
  {
    id: 3,
    name: "Website",
    slug: "website"
  }
];