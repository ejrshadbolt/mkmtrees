// Cloudflare Environment
export interface CloudflareEnv {
  DB: D1Database;
}

// Blog Post Types
export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  published_at: string;
  created_at: string;
  author_name: string;
  featured_image_url?: string;
  featured_image_alt?: string;
  meta_description?: string;
  og_title?: string;
  og_description?: string;
  og_image?: string;
  tags: string[];
  related_posts?: RelatedPost[];
}

export interface RelatedPost {
  id: number;
  title: string;
  slug: string;
  excerpt?: string;
  published_at: string;
  featured_image_url?: string;
  featured_image_alt?: string;
}

export interface BlogTag {
  id: number;
  name: string;
  slug: string;
  post_count: number;
}

export interface BlogPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface BlogPostsResponse {
  posts: BlogPost[];
  pagination: BlogPagination;
}

export interface BlogTagsResponse {
  tags: BlogTag[];
}

// Portfolio Types
export interface PortfolioCategory {
  id: number;
  name: string;
  slug: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface PortfolioProject {
  id: number;
  title: string;
  slug: string;
  description: string;
  short_description?: string;
  client_name?: string;
  project_url?: string;
  project_date?: string;
  technologies?: string;
  featured_image_id?: number;
  featured_image_url?: string;
  featured_image_alt?: string;
  category_id?: number;
  category_name?: string;
  category_slug?: string;
  published: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
  created_by: number;
  images?: PortfolioProjectImage[];
}

export interface PortfolioProjectImage {
  id: number;
  project_id: number;
  media_id: number;
  url: string;
  alt_text?: string;
  caption?: string;
  sort_order: number;
  image_type?: 'before' | 'after' | 'general' | 'progress';
}

export interface PortfolioProjectsResponse {
  projects: PortfolioProject[];
  pagination: BlogPagination;
  categories: PortfolioCategory[];
}

export interface PortfolioCategoriesResponse {
  categories: PortfolioCategory[];
}

// Review Types (enhanced)
export interface Review {
  id: number;
  reviewer_name: string;
  reviewer_email?: string;
  reviewer_image_id?: number;
  reviewer_image_url?: string;
  reviewer_image_alt?: string;
  rating?: number;
  title?: string;
  content: string;
  approved: boolean;
  created_at: string;
  updated_at: string;
}

export interface ReviewsResponse {
  reviews: Review[];
  pagination: BlogPagination;
}

export interface ReviewSubmission {
  reviewer_name: string;
  reviewer_email?: string;
  rating: number;
  title?: string;
  content: string;
} 