# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Type

This is a **TEMPLATE REPOSITORY** for creating small business websites with CMS functionality. It's designed to be:
- Cloned/copied for new client projects
- Customized per project via configuration files
- Used to contribute improvements back to the template

## Key Template Files to Customize

**Business Configuration** (`src/config/business.ts`):
- Company name, contact info, branding
- Navigation structure
- SEO settings

**Fallback Data** (`src/data/fallback-data.ts`):
- Sample blog posts and portfolio items
- Used when database is empty or unavailable

## Development Commands

```bash
# Development (Next.js only - no D1 database)
npm run dev

# Development with D1 database (recommended for full functionality)
npm run dev:local

# Build for production
npm run build

# Build for Cloudflare Pages
npm run build:cf

# Deploy to Cloudflare Pages
npm run deploy

# Lint code
npm run lint

# Generate Cloudflare types
npm run cf-typegen

# Initialize database schema
npm run db:schema

# Create admin user (interactive)
npm run db:create-admin
```

## Template Workflow Scripts

```bash
# Create new project from template
node scripts/create-project.js project-name --business-name="Business Name"
```

## Architecture Overview

**Platform**: Next.js 15 on Cloudflare Pages with Workers and D1 database

**Template Structure**:
- Configuration-driven business variables
- Clean template with only admin CMS functionality
- No pre-built user-facing pages (built from scratch per project)
- Reusable UI components and admin interface

**Database Access Pattern**:
- Database context accessed via `getRequestContext()` from `@cloudflare/next-on-pages`
- Database service class in `src/lib/db.ts` with typed interfaces
- Authentication logic in `src/lib/auth.ts`

**Admin System**:
- Admin interface at `/admin` route with protected layout
- No default admin users - must be created via `scripts/create-admin.js`
- JWT sessions with 7-day expiration

## Technology Stack

**Frontend**: Next.js 15 with React 19, TypeScript, Tailwind CSS
**UI Components**: Radix UI primitives with custom components in `src/components/ui/`
**Rich Text**: TipTap editor with custom toolbar and extensions
**Authentication**: NextAuth.js with credentials provider and JWT sessions
**Database**: Cloudflare D1 (SQLite) with typed service layer
**File Storage**: Cloudflare R2 for media uploads
**Hosting**: Cloudflare Pages with Workers
**Forms**: React Hook Form with Zod validation
**Styling**: Tailwind CSS with custom design system

## Key Architecture Patterns

**Configuration-Driven Business Variables**:
- Business details in `src/config/business.ts`
- Reusable across all pages for consistent branding
- Navigation structure and contact information

**Database Service Layer**:
- Typed interfaces for all database tables
- Service class `DbService` in `src/lib/db.ts`
- Database context from `getRequestContext()`

**Component Structure**:
- Reusable UI components in `src/components/ui/`
- Layout components (Header, Footer) in `src/components/layout/`
- Admin-specific components in `src/components/admin/`

**Authentication Flow**:
- Credentials-based auth via NextAuth.js
- Password hashing with bcrypt-ts (edge-compatible)
- Session management with JWT tokens
- Protected admin routes with middleware

## Database Schema

Core tables:
- `users` - Admin accounts
- `posts` - Blog content with SEO fields
- `media` - File uploads with metadata
- `reviews` - Customer testimonials
- `submissions` - Contact form submissions
- `newsletter_subscribers` - Email signups
- `portfolio_projects` - Portfolio items
- `portfolio_categories` - Portfolio organization

## Template Workflow

**Creating New Projects**:
1. Use `scripts/create-project.js` to copy template
2. Updates package.json, business config, and environment files
3. Initializes new git repository

**Customization Process**:
1. Edit `src/config/business.ts` with business details
2. Build custom pages from scratch using Claude Code
3. Replace placeholder images in `public/images/`
4. Customize color scheme and branding

**Admin Setup**:
1. Run `npm run db:schema` to create database tables
2. Use `npm run db:create-admin` to create admin user
3. Access admin interface at `/admin` with credentials

## Page Generation Strategy

**Page Type Components Approach**:
- Create reusable page type components for common page structures
- Components handle layout and structure, not content
- AI generates pages using these components with custom content
- Consistent structure across similar pages without template complexity

**Common Page Types**:
- `ServicePage` - For individual service pages
- `AboutPage` - For about us pages
- `ContactPage` - For contact pages
- `BasicPage` - For simple content pages
- `ListingPage` - For service listings, portfolio grids

**AI-Friendly Workflow**:
1. Identify page type needed (service, about, contact, etc.)
2. Create page type component if it doesn't exist (templates provided)
3. Generate specific page using component with custom props
4. Add custom content via children prop for unique elements

**Page Type Component Examples**:

```typescript
// Service Page Example
import { ServicePage } from '@/components/page-types';

export default function PlumbingPage() {
  return (
    <ServicePage
      title="Professional Plumbing Services"
      description="Expert plumbing solutions for residential and commercial properties"
      features={[
        "24/7 Emergency Service",
        "Licensed & Insured",
        "Free Estimates"
      ]}
      ctaText="Get Free Quote"
      ctaLink="/contact"
    >
      {/* Custom content specific to this service */}
      <div className="bg-blue-50 p-6 rounded-lg">
        <h3 className="font-semibold mb-2">Emergency Hotline</h3>
        <p className="text-2xl font-bold text-blue-600">1-800-PLUMBER</p>
      </div>
    </ServicePage>
  );
}

// About Page Example
import { AboutPage } from '@/components/page-types';

export default function About() {
  return (
    <AboutPage
      title="About Our Company"
      description="Leading experts in our field since 2010"
      story="Our company was founded with a simple mission..."
      values={[
        {
          title: "Quality",
          description: "We never compromise on quality",
          icon: "award"
        }
      ]}
      stats={[
        { number: "500+", label: "Happy Clients" },
        { number: "10", label: "Years Experience" }
      ]}
    />
  );
}

// Contact Page Example
import { ContactPage } from '@/components/page-types';

export default function Contact() {
  return (
    <ContactPage
      title="Get In Touch"
      description="Ready to work with us? Contact us today"
      showMap={true}
      mapEmbedUrl="https://maps.google.com/embed?..."
      customFields={[
        {
          name: "service",
          type: "select",
          label: "Service Needed",
          options: ["Plumbing", "Electrical", "HVAC"]
        }
      ]}
    />
  );
}
```

**Available Page Types**:
- `ServicePage` - Individual service pages with features, pricing, CTA
- `AboutPage` - About pages with story, values, team, stats
- `ContactPage` - Contact forms with business info, map, custom fields
- `BasicPage` - Simple content pages with hero and CTA
- `ListingPage` - Service listings, portfolios, product catalogs

**Development Approach**:
- Template provides only admin CMS and business configuration
- Each project builds custom user-facing pages from scratch
- Use page type components for consistent structure
- AI generates pages based on specific requirements
- Maintain clean separation between template infrastructure and custom content