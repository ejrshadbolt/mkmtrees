# Authentication System Documentation

## Overview

This authentication system uses NextAuth.js with the Cloudflare D1 database to provide secure admin access to the CMS. The system implements:

- Username/password authentication
- JWT session handling
- Protected admin routes
- Login/logout functionality

## Setup

1. Make sure your D1 database is set up correctly with the schema from `/schema.sql`
2. Create an admin user using the secure admin creation script: `node scripts/create-admin.js`
3. Set the following environment variables:
   - `NEXTAUTH_URL`: The URL of your application
   - `NEXTAUTH_SECRET`: A secret string used to encrypt JWTs

## Admin User Creation

**SECURITY**: This system does not create default users. All admin users must be created explicitly using the secure admin creation script.

To create an admin user:
```bash
# Interactive mode (recommended)
node scripts/create-admin.js --local

# Command line mode
node scripts/create-admin.js --local --username admin --email admin@example.com --password SecurePassword123!
```

## Protected Routes

All routes under `/admin/*` are protected by the middleware except for:
- `/admin/login`

## Adding New Admin Users

To add a new admin user, use the admin creation script:

```bash
node scripts/create-admin.js --local --username new_admin --email admin@example.com
```

This script will:
- Validate username and email format
- Enforce password complexity requirements
- Hash passwords securely using bcrypt
- Store user data in the database

## Authentication Flow

1. User navigates to an admin page
2. Middleware checks if the user is authenticated
3. If not authenticated, redirects to login page
4. User submits credentials
5. Server verifies credentials against the D1 database
6. If valid, creates a JWT session
7. User is redirected to the admin dashboard

## Security Features

- **No Default Credentials**: System requires explicit admin user creation
- **Password Hashing**: All passwords are hashed using bcrypt with appropriate salt rounds
- **Database Validation**: Authentication fails gracefully if database is unavailable
- **No Fallback Authentication**: No dummy or default authentication mechanisms

## Files

- `src/lib/auth.ts` - Auth configuration and utility functions
- `src/app/api/auth/[...nextauth]/route.ts` - NextAuth API route
- `src/app/admin/login/page.tsx` - Login page
- `src/app/admin/dashboard/page.tsx` - Protected dashboard page
- `src/components/auth/AuthProvider.tsx` - Auth context provider
- `src/middleware.ts` - Route protection middleware 