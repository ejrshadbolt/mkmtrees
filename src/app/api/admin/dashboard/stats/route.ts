import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getRequestContext } from '@cloudflare/next-on-pages';

// Configure for Cloudflare Pages edge runtime
export const runtime = 'edge';

interface CloudflareEnv {
  DB: D1Database;
}

// Fallback stats when database is not available
const getFallbackStats = () => ({
  totalPosts: 0,
  publishedPosts: 0,
  draftPosts: 0,
  totalReviews: 0,
  approvedReviews: 0,
  pendingReviews: 0,
  totalSubmissions: 0,
  unprocessedSubmissions: 0,
  totalMedia: 0,
  totalNewsletterSubscribers: 0,
  activeNewsletterSubscribers: 0,
  recentActivity: [],
  isDemo: true,
  message: 'Database not available - showing demo data'
});

// GET /api/admin/dashboard/stats - Get dashboard statistics
export async function GET() {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get the database from the Cloudflare context using next-on-pages
    const { env } = getRequestContext() as { env: CloudflareEnv };
    const db = env.DB;
    
    if (!db) {
      console.log('Database not available, returning fallback stats');
      return NextResponse.json(getFallbackStats());
    }

    // Get posts statistics
    const postsStats = await db.prepare(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN published = 1 THEN 1 ELSE 0 END) as published,
        SUM(CASE WHEN published = 0 THEN 1 ELSE 0 END) as drafts
      FROM posts
    `).first();

    // Get reviews statistics
    const reviewsStats = await db.prepare(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN approved = 1 THEN 1 ELSE 0 END) as approved,
        SUM(CASE WHEN approved = 0 THEN 1 ELSE 0 END) as pending
      FROM reviews
    `).first();

    // Get form submissions statistics
    const submissionsStats = await db.prepare(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN processed = 0 THEN 1 ELSE 0 END) as unprocessed
      FROM submissions
    `).first();

    // Get media statistics
    const mediaStats = await db.prepare(`
      SELECT COUNT(*) as total
      FROM media
    `).first();

    // Get newsletter subscriber statistics
    const newsletterStats = await db.prepare(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) as active
      FROM newsletter_subscribers
    `).first();

    // Get recent activity (last 10 items)
    const recentPosts = await db.prepare(`
      SELECT 
        'post' as type,
        p.id,
        p.title,
        CASE WHEN p.published = 1 THEN 'Published' ELSE 'Saved as draft' END as action,
        p.updated_at as timestamp,
        u.username as author
      FROM posts p
      JOIN users u ON p.author_id_new = u.id
      ORDER BY p.updated_at DESC
      LIMIT 5
    `).all();

    const recentReviews = await db.prepare(`
      SELECT 
        'review' as type,
        r.id,
        'Review from ' || r.reviewer_name as title,
        CASE WHEN r.approved = 1 THEN 'Approved' ELSE 'Pending approval' END as action,
        r.created_at as timestamp,
        NULL as author
      FROM reviews r
      ORDER BY r.created_at DESC
      LIMIT 3
    `).all();

    const recentSubmissions = await db.prepare(`
      SELECT 
        'submission' as type,
        s.id,
        'Contact form from ' || s.name as title,
        CASE WHEN s.processed = 1 THEN 'Processed' ELSE 'New submission' END as action,
        s.created_at as timestamp,
        NULL as author
      FROM submissions s
      ORDER BY s.created_at DESC
      LIMIT 2
    `).all();

    // Combine and sort recent activity
    const allActivity = [
      ...(recentPosts.results || []),
      ...(recentReviews.results || []),
      ...(recentSubmissions.results || [])
    ];
    
    const sortedActivity = allActivity
      .sort((a: Record<string, unknown>, b: Record<string, unknown>) => 
        (b.timestamp as number) - (a.timestamp as number)
      )
      .slice(0, 10);

    // Format activity items
    const recentActivity = sortedActivity.map((item: Record<string, unknown>, index) => ({
      id: `${item.type}-${item.id}-${index}`,
      type: item.type as string,
      title: item.title as string,
      action: item.action as string,
      timestamp: new Date((item.timestamp as number) * 1000).toISOString(),
      author: (item.author as string) || undefined,
    }));

    const stats = {
      totalPosts: Number(postsStats?.total) || 0,
      publishedPosts: Number(postsStats?.published) || 0,
      draftPosts: Number(postsStats?.drafts) || 0,
      totalReviews: Number(reviewsStats?.total) || 0,
      approvedReviews: Number(reviewsStats?.approved) || 0,
      pendingReviews: Number(reviewsStats?.pending) || 0,
      totalSubmissions: Number(submissionsStats?.total) || 0,
      unprocessedSubmissions: Number(submissionsStats?.unprocessed) || 0,
      totalMedia: Number(mediaStats?.total) || 0,
      totalNewsletterSubscribers: Number(newsletterStats?.total) || 0,
      activeNewsletterSubscribers: Number(newsletterStats?.active) || 0,
      recentActivity,
      isDemo: false,
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    // Return fallback stats instead of error to prevent admin dashboard from breaking
    return NextResponse.json({
      ...getFallbackStats(),
      error: 'Failed to fetch from database'
    });
  }
} 