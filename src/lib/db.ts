import { D1Database, D1Result } from '@cloudflare/workers-types';

// Type definitions for our database tables
export interface User {
  id: number;
  username: string;
  email: string;
  password_hash: string;
  created_at: number;
  updated_at: number;
  last_login?: number;
}

export interface Post {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  featured_image_id?: number;
  published: boolean;
  published_at?: number;
  created_at: number;
  updated_at: number;
  author_id: number;
}

export interface Media {
  id: number;
  filename: string;
  original_filename: string;
  mime_type: string;
  size: number;
  width?: number;
  height?: number;
  url: string;
  r2_key?: string;
  alt_text?: string;
  created_at: number;
  updated_at: number;
  uploaded_by: number;
}

export interface Tag {
  id: number;
  name: string;
  slug: string;
}

export interface Review {
  id: number;
  reviewer_name: string;
  reviewer_email?: string;
  reviewer_image_id?: number;
  rating?: number;
  title?: string;
  content: string;
  approved: boolean;
  created_at: number;
  updated_at: number;
}

export interface FormSubmission {
  id: number;
  name: string;
  email: string;
  subject?: string;
  message: string;
  created_at: number;
  processed: boolean;
  processed_at?: number;
}

// Database service class
export class DbService {
  constructor(private db: D1Database) {}

  // Users
  async getUserById(id: number): Promise<User | null> {
    return await this.db.prepare('SELECT * FROM users WHERE id = ?')
      .bind(id)
      .first<User | null>();
  }

  async getUserByUsername(username: string): Promise<User | null> {
    return await this.db.prepare('SELECT * FROM users WHERE username = ?')
      .bind(username)
      .first<User | null>();
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return await this.db.prepare('SELECT * FROM users WHERE email = ?')
      .bind(email)
      .first<User | null>();
  }

  // Posts
  async getPublishedPosts(limit = 10, offset = 0): Promise<Post[]> {
    return await this.db.prepare('SELECT * FROM posts WHERE published = 1 ORDER BY published_at DESC LIMIT ? OFFSET ?')
      .bind(limit, offset)
      .all<Post>()
      .then((result: D1Result<Post>) => result.results);
  }

  async getPostBySlug(slug: string): Promise<Post | null> {
    return await this.db.prepare('SELECT * FROM posts WHERE slug = ?')
      .bind(slug)
      .first<Post | null>();
  }

  async getPostById(id: number): Promise<Post | null> {
    return await this.db.prepare('SELECT * FROM posts WHERE id = ?')
      .bind(id)
      .first<Post | null>();
  }

  async createPost(post: Omit<Post, 'id' | 'created_at' | 'updated_at'>): Promise<number> {
    const now = Math.floor(Date.now() / 1000);
    const result = await this.db.prepare(`
      INSERT INTO posts (
        title, slug, content, excerpt, featured_image_id, 
        published, published_at, created_at, updated_at, author_id
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `)
      .bind(
        post.title,
        post.slug,
        post.content,
        post.excerpt,
        post.featured_image_id,
        post.published ? 1 : 0,
        post.published_at,
        now,
        now,
        post.author_id
      )
      .run();
    
    return result.meta.last_row_id!;
  }

  async updatePost(id: number, post: Partial<Omit<Post, 'id' | 'created_at'>>): Promise<void> {
    const now = Math.floor(Date.now() / 1000);
    await this.db.prepare(`
      UPDATE posts 
      SET title = ?, slug = ?, content = ?, excerpt = ?, 
          featured_image_id = ?, published = ?, published_at = ?, updated_at = ?
      WHERE id = ?
    `)
      .bind(
        post.title,
        post.slug,
        post.content,
        post.excerpt,
        post.featured_image_id,
        post.published ? 1 : 0,
        post.published_at,
        now,
        id
      )
      .run();
  }

  async deletePost(id: number): Promise<void> {
    await this.db.prepare('DELETE FROM posts WHERE id = ?')
      .bind(id)
      .run();
  }

  // Media
  async getMediaById(id: number): Promise<Media | null> {
    return await this.db.prepare('SELECT * FROM media WHERE id = ?')
      .bind(id)
      .first<Media | null>();
  }

  // Reviews
  async getApprovedReviews(limit = 10, offset = 0): Promise<Review[]> {
    return await this.db.prepare('SELECT * FROM reviews WHERE approved = 1 ORDER BY created_at DESC LIMIT ? OFFSET ?')
      .bind(limit, offset)
      .all<Review>()
      .then((result: D1Result<Review>) => result.results);
  }

  // Form submissions
  async createFormSubmission(submission: Omit<FormSubmission, 'id' | 'created_at' | 'processed' | 'processed_at'>): Promise<number> {
    const now = Math.floor(Date.now() / 1000);
    const result = await this.db.prepare(`
      INSERT INTO submissions (name, email, subject, message, created_at, processed)
      VALUES (?, ?, ?, ?, ?, 0)
    `)
      .bind(submission.name, submission.email, submission.subject, submission.message, now)
      .run();
    
    return result.meta.last_row_id!;
  }
}

// Helper function to create a DbService instance
export function createDbService(db: D1Database): DbService {
  return new DbService(db);
} 