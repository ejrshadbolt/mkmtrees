import { NextRequest, NextResponse } from 'next/server';
import { getRequestContext } from '@cloudflare/next-on-pages';

// Configure for Cloudflare Pages edge runtime
export const runtime = 'edge';

interface ContactSimpleSubmission {
  name: string;
  email: string;
  phone: string;
  serviceType: string;
  message: string;
  turnstileToken?: string;
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
    const body = await request.json() as ContactSimpleSubmission;
    const { name, email, phone, serviceType, message, turnstileToken } = body;

    // Validate required fields
    if (!name || !email || !phone || !serviceType || !message) {
      return NextResponse.json({
        error: 'All fields are required'
      }, { status: 400 });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({
        error: 'Invalid email format'
      }, { status: 400 });
    }

    // Validate Turnstile token if provided
    if (turnstileToken && env.TURNSTILE_SECRET_KEY) {
      const turnstileResponse = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `secret=${env.TURNSTILE_SECRET_KEY}&response=${turnstileToken}`,
      });

      const turnstileResult = await turnstileResponse.json() as { success: boolean };
      if (!turnstileResult.success) {
        return NextResponse.json({
          error: 'Verification failed. Please try again.'
        }, { status: 400 });
      }
    }

    // Insert the contact submission into the submissions table
    // Using the subject field to store service type
    const result = await db
      .prepare(`
        INSERT INTO submissions (name, email, phone, subject, message, created_at)
        VALUES (?, ?, ?, ?, ?, datetime('now'))
      `)
      .bind(name, email, phone, `Service Inquiry: ${serviceType}`, message)
      .run();

    if (!result.success) {
      throw new Error('Failed to save submission');
    }

    return NextResponse.json({
      message: 'Thank you for your message! We\'ll get back to you within 2 hours.'
    }, { status: 200 });

  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json({
      error: 'Something went wrong. Please try again later.'
    }, { status: 500 });
  }
} 