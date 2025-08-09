import { NextRequest, NextResponse } from 'next/server';
import { getRequestContext } from '@cloudflare/next-on-pages';

// Configure for Cloudflare Pages edge runtime
export const runtime = 'edge';

interface NewsletterSubscription {
  email: string;
  source?: string;
}

interface CloudflareEnv {
  DB: D1Database;
  TURNSTILE_SECRET_KEY?: string;
}

export async function POST(request: NextRequest) {
  try {
    // Get the database from the Cloudflare context using next-on-pages
    const { env } = getRequestContext() as { env: CloudflareEnv };
    const db = env.DB;
    
    if (!db) {
      return NextResponse.json({ 
        error: 'Database not available',
        message: 'D1 database binding not found'
      }, { status: 500 });
    }

    // Parse request body
    const body = await request.json() as NewsletterSubscription;
    const { email, source = 'website' } = body;

    // Validate required fields
    if (!email) {
      return NextResponse.json({
        error: 'Email address is required'
      }, { status: 400 });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({
        error: 'Invalid email format'
      }, { status: 400 });
    }

    // Check if email already exists
    const existingSubscriber = await db
      .prepare('SELECT id, status FROM newsletter_subscribers WHERE email = ?')
      .bind(email)
      .first();

    if (existingSubscriber) {
      // If already subscribed and active
      if (existingSubscriber.status === 'active') {
        return NextResponse.json({
          message: 'You are already subscribed to our newsletter!'
        }, { status: 200 });
      }
      
      // If previously unsubscribed, reactivate
      await db
        .prepare(`
          UPDATE newsletter_subscribers 
          SET status = 'active', subscribed_at = unixepoch(), unsubscribed_at = NULL
          WHERE email = ?
        `)
        .bind(email)
        .run();
      
      return NextResponse.json({
        message: 'Welcome back! You have been resubscribed to our newsletter.'
      }, { status: 200 });
    }

    // Insert new subscription
    const result = await db
      .prepare(`
        INSERT INTO newsletter_subscribers (email, status, subscribed_at, source)
        VALUES (?, 'active', unixepoch(), ?)
      `)
      .bind(email, source)
      .run();

    if (!result.success) {
      throw new Error('Failed to save subscription');
    }

    return NextResponse.json({
      message: 'Thank you for subscribing! You\'ll receive our latest updates and offers.'
    }, { status: 200 });

  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return NextResponse.json({
      error: 'Something went wrong. Please try again later.'
    }, { status: 500 });
  }
} 