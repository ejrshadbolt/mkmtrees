# Template Architecture & Development Patterns

This document preserves the essential knowledge and patterns for reliable development with this template.

## 🏗️ Core Architecture Principles

### Clean Slate Approach
- **No Pre-built Pages**: Template provides structure, not content
- **AI-Friendly Components**: Page type components designed for easy AI generation
- **Dynamic Configuration**: Scripts read from wrangler.jsonc for project-specific settings
- **Component-Based Structure**: Consistent patterns without rigid templates

### Key Files for Customization
```
src/config/business.ts         # Business info, contact, branding, navigation
src/components/page-types/     # Page type components for consistent structure
src/data/fallback-data.ts      # Sample content for development
wrangler.jsonc                 # Database and storage configuration
public/images/                 # Logo, photos, media assets
```

## 🔧 Essential Development Patterns

### Database Access Pattern (CRITICAL)
```typescript
// Always use this pattern for database access
import { getRequestContext } from '@cloudflare/next-on-pages';
import { DbService } from '@/lib/db';

export async function GET() {
  const { env } = getRequestContext() as { env: { DB: D1Database } };
  const dbService = new DbService(env.DB);
  // ... use dbService
}
```

### Authentication Pattern
- **No default admin users** - security by design
- **Edge-compatible auth** using bcrypt-ts and NextAuth.js
- **JWT sessions** with 7-day expiration
- **Protected routes** via middleware

### Page Type Component Architecture
- **Page type components** in `src/components/page-types/`
- **Prop-based customization** for AI-friendly development
- **Consistent structure** without rigid templates
- **Reusable UI components** using shadcn/ui
- **Fallback data** for development without database

### Page Type Components Available
```typescript
// ServicePage - For service offerings
<ServicePage 
  title="Service Name"
  description="Service description"
  features={["Feature 1", "Feature 2"]}
  pricing={{ basic: "$999", premium: "$1999" }}
/>

// AboutPage - For company information
<AboutPage
  title="About Us"
  description="Company story"
  team={teamMembers}
  values={companyValues}
/>

// ContactPage - For contact forms
<ContactPage
  title="Contact Us"
  showContactForm={true}
  showBusinessInfo={true}
/>

// BasicPage - For simple content
<BasicPage
  title="Privacy Policy"
  content="Page content here"
/>

// ListingPage - For service/portfolio listings
<ListingPage
  title="Our Services"
  items={serviceItems}
  displayMode="grid"
/>
```

## 🚀 Development Workflow

### 1. New Project Setup
```bash
# Clone template
git clone <template-repo> new-project
cd new-project

# Install and configure
npm install
cp .env.example .dev.vars
# Edit .dev.vars with Cloudflare credentials

# Initialize database
npm run db:schema
npm run db:create-admin

# Start development
npm run dev:local  # With database (recommended)
npm run dev        # Without database (limited)
```

### 2. Customization Process
1. **Edit business.ts** - Company info, contact, branding
2. **Update wrangler.jsonc** - Set database and storage names
3. **Build pages** - Use page type components for consistent structure
4. **Add assets** - Logo and images to `public/images/`
5. **Test locally** - Always use `npm run dev:local`
6. **Deploy** - `npm run deploy`

### 3. Content Management
- **Admin interface** at `/admin` route
- **Rich text editor** with TipTap for blog posts
- **Media management** with upload and optimization
- **SEO fields** for all content types

## 🛠️ Critical Cloudflare Integration

### Database Configuration
- **D1 Database** with typed interfaces in `src/lib/db.ts`
- **Edge runtime** compatibility required
- **Connection pattern** via `getRequestContext()`

### Build Configuration
- **Next.js on Pages** build: `npm run build:cf`
- **Static output** in `.vercel/output/static`
- **Environment variables** managed in Cloudflare dashboard

### wrangler.jsonc Structure (Dynamic Configuration)
```jsonc
{
  "name": "project-name",
  "compatibility_date": "2025-03-01",
  "d1_databases": [
    {
      "binding": "DB",
      "database_name": "project_cms",
      "database_id": "your-database-id"
    }
  ],
  "r2_buckets": [
    {
      "binding": "MEDIA_BUCKET",
      "bucket_name": "project-media"
    }
  ]
}
```

**Important**: All scripts now read from this file dynamically using `scripts/config-reader.js`

## 📝 Hard-Won Lessons Preserved

### 1. Database Patterns
- **Always check database availability** before queries
- **Use prepared statements** for all queries
- **Handle edge cases** where database is unavailable
- **Fallback data** ensures UI development can continue

### 2. Authentication Security
- **bcrypt-ts** for edge compatibility (not regular bcrypt)
- **JWT strategy** with NextAuth.js works reliably
- **Session management** with proper timeout
- **Route protection** via middleware

### 3. Media Management
- **Local development** with file system
- **Production** with Cloudflare R2
- **Image optimization** and responsive images
- **Upload handling** with proper error management

### 4. Admin Interface
- **Component architecture** that's maintainable
- **Form validation** with react-hook-form and zod
- **Rich text editing** with TipTap
- **Bulk operations** for content management

## 🎯 Template Best Practices

### Do's
- ✅ Use page type components for consistent structure
- ✅ Configure business details in `business.ts`
- ✅ Test with `npm run dev:local` for full functionality
- ✅ Follow the existing component patterns
- ✅ Use TypeScript interfaces for type safety
- ✅ Implement proper error handling
- ✅ Use the admin interface for content management
- ✅ Update wrangler.jsonc for project-specific settings

### Don'ts
- ❌ Hardcode business information in components
- ❌ Modify core lib files unless adding new features
- ❌ Skip database initialization steps
- ❌ Use regular bcrypt (edge incompatible)
- ❌ Bypass the authentication system
- ❌ Ignore TypeScript errors
- ❌ Hardcode database names in scripts (use config-reader.js)

## 🔍 Troubleshooting Common Issues

### Database Connection Issues
1. Check wrangler.jsonc database configuration
2. Verify database exists in Cloudflare dashboard
3. Ensure `npm run db:schema` was run
4. Check environment variables

### Build Failures
1. Run `npm run lint` to check for errors
2. Verify all TypeScript types are correct
3. Check that all imports are valid
4. Ensure no client-specific hardcoded content

### Authentication Problems
1. Verify admin user was created with `npm run db:create-admin`
2. Check NextAuth configuration in `src/lib/auth.ts`
3. Ensure JWT secret is set in environment
4. Clear browser cookies and try again

## 📚 Documentation Index

- **README.md** - Quick start and overview
- **CLAUDE.md** - AI assistant context and commands
- **TEMPLATE_ARCHITECTURE.md** - This file (architecture patterns)
- **src/app/admin/README.md** - Admin system documentation
- **scripts/** - Utility scripts with usage instructions

## 🎯 Template Philosophy

This template follows a **"clean slate with structure"** approach:
- No pre-built pages that need modification
- Page type components provide consistent structure
- AI-friendly prop-based customization
- Configuration-driven development
- Dynamic script configuration

This approach is faster for AI-assisted development while maintaining consistency and best practices.