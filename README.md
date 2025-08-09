# Small Business CMS Template

A clean, configuration-driven template for creating small business websites with CMS functionality. Built with Next.js 15, Cloudflare Pages, and D1 database.

## 🚀 Quick Start

```bash
# 1. Clone and setup
git clone <this-repo> my-business-site
cd my-business-site
rm -rf .git && git init

# 2. Install and configure
npm install
cp .env.example .dev.vars
# Edit .dev.vars with your Cloudflare credentials

# 3. Initialize database
npm run db:schema
npm run db:create-admin

# 4. Start development
npm run dev:local
```

Visit `http://localhost:3000` for your site and `/admin` for the CMS.

## 📝 Customization

This template uses a **clean slate approach** - customize by:

- **`src/config/business.ts`** - Your business information, contact details, branding
- **`src/components/page-types/`** - Use page type components for consistent page structure
- **`wrangler.jsonc`** - Configure database and storage names for your project
- **`public/images/`** - Add your logo, photos, and media assets

## 🎯 Page Generation Strategy

Instead of pre-built pages, use **page type components** for AI-assisted development:

```typescript
// Example: Create a service page
<ServicePage 
  title="Web Development Services"
  description="Professional web development solutions"
  features={["Custom Design", "SEO Optimization", "Mobile Responsive"]}
  pricing={{ basic: "$999", premium: "$1999" }}
/>
```

Available page types:
- **ServicePage** - For service offerings with features and pricing
- **AboutPage** - For company information with team and values
- **ContactPage** - For contact forms with business info integration
- **BasicPage** - For simple content pages
- **ListingPage** - For service/portfolio listings

## 🛠️ Development Commands

```bash
npm run dev              # Next.js only (no database)
npm run dev:local        # Full stack with D1 database
npm run build:cf         # Build for Cloudflare Pages
npm run deploy           # Deploy to Cloudflare Pages
npm run lint             # Check code quality
```

## 📁 Template Structure

```
src/
├── app/                 # Next.js app router (build custom pages here)
├── components/
│   ├── page-types/      # 📝 PAGE TYPE COMPONENTS (use these!)
│   ├── ui/              # shadcn/ui components
│   └── sections/        # Reusable sections
├── config/             # 📝 MAIN CUSTOMIZATION FILES
├── lib/                # Core utilities (don't modify)
└── data/               # Fallback data for development

scripts/
├── create-admin.js     # Create admin users
├── create-project.js   # Create new projects from template
├── init-db.js         # Initialize database
└── config-reader.js   # Dynamic configuration reading
```

## 🔧 Key Features

- **Admin CMS** - Manage content, media, blog posts, portfolio
- **Responsive Design** - Mobile-first with Tailwind CSS
- **SEO Ready** - Meta tags, structured data, performance optimized
- **Contact Forms** - With Turnstile spam protection
- **Image Management** - Upload, optimize, and manage media
- **Blog & Portfolio** - Rich text editor with media support

## 🚀 Deployment

1. **Create Cloudflare Pages project**
2. **Configure build settings:**
   - Build command: `npm run build:cf`
   - Output directory: `.vercel/output/static`
3. **Set environment variables** (see `.env.example`)
4. **Deploy**

## 📖 What's Included

- **Clean slate foundation** - No pre-built pages, build exactly what you need
- **Page type components** - Consistent structure for common page types
- **Blog system** with rich text editor and SEO
- **Portfolio system** with categories and image galleries
- **Admin interface** for content management
- **Responsive layouts** that work on all devices
- **Dynamic configuration** - Scripts read from wrangler.jsonc

## 🎯 Perfect For

- Service businesses (consulting, agencies, contractors)
- Local businesses (restaurants, shops, professionals)  
- Creative professionals (designers, photographers)
- Small companies needing professional web presence

## 💡 Pro Tips

- **Start with business.ts** - Update company information first
- **Use page type components** - Consistent structure with AI-friendly props
- **Use the admin panel** - Content is easier to manage through `/admin`
- **Test locally** - Always use `npm run dev:local` for full functionality
- **Deploy early** - Get your site live quickly, then iterate

## 📄 License

MIT