import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { DbService } from "./db";
import type { NextAuthConfig } from "next-auth";
import { getRequestContext } from '@cloudflare/next-on-pages';
import { D1Database } from '@cloudflare/workers-types';
import { compare } from "bcrypt-ts";

// Extend the JWT and Session types
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    }
  }
  
  interface JWT {
    id: string;
  }
}



// Edge-compatible password verification using bcrypt-ts
async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  try {
    // Use bcrypt-ts which is compatible with edge runtime
    return await compare(password, hashedPassword);
  } catch (error) {
    console.error('Password verification error:', error);
    return false;
  }
}

// Base auth configuration that works with edge runtime
export const authConfig: NextAuthConfig = {
  trustHost: true, // This fixes the UntrustedHost error in development
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          console.log("Missing credentials");
          return null;
        }

        try {
          // Get the database directly from Cloudflare context (same as other API routes)
          const { env } = getRequestContext() as { env: { DB: D1Database } };
          const db = env.DB;
          
          // CRITICAL: Always check if database is available
          if (!db) {
            console.error('Database not available in auth context');
            return null;
          }

          const dbService = new DbService(db);
          
          console.log("Looking up user:", credentials.username);
          const user = await dbService.getUserByUsername(credentials.username as string);

          if (!user) {
            console.log("User not found");
            return null;
          }

          console.log("User found, verifying password");
          const passwordValid = await verifyPassword(credentials.password as string, user.password_hash);

          if (!passwordValid) {
            console.log("Invalid password");
            return null;
          }

          // Update last login timestamp
          const now = Math.floor(Date.now() / 1000);
          try {
            await db.prepare("UPDATE users SET last_login = ? WHERE id = ?")
              .bind(now, user.id)
              .run();
            console.log("Updated last login timestamp");
          } catch (updateError) {
            console.error("Failed to update last login:", updateError);
          }

          console.log("Authentication successful");
          return {
            id: user.id.toString(),
            name: user.username,
            email: user.email,
          };
        } catch (error) {
          console.error("Authentication error:", error);
          return null;
        }
      }
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  },
  pages: {
    signIn: "/admin/login",
    signOut: "/admin/logout",
    error: "/admin/error",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  debug: process.env.NODE_ENV === "development",
};

// Create the NextAuth instance
export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);

// Helper function to check if a user is authenticated
export function isAuthenticated(session: { user?: { id?: string } } | null): boolean {
  return !!session?.user?.id;
} 