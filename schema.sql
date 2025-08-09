-- D1 Database Schema for Small Business Website CMS

-- Users table for admin accounts
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at INTEGER NOT NULL DEFAULT (unixepoch()),
  updated_at INTEGER NOT NULL DEFAULT (unixepoch()),
  last_login INTEGER
);

-- Posts table for blog content
CREATE TABLE posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  content TEXT NOT NULL,
  excerpt TEXT,
  featured_image_id INTEGER,
  published BOOLEAN NOT NULL DEFAULT 0,
  published_at INTEGER,
  created_at INTEGER NOT NULL DEFAULT (unixepoch()),
  updated_at INTEGER NOT NULL DEFAULT (unixepoch()),
  author_id INTEGER NOT NULL,
  meta_description TEXT,
  og_title TEXT,
  og_description TEXT,
  og_image TEXT,
  FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (featured_image_id) REFERENCES media(id) ON DELETE SET NULL
);

-- Media table for images and files
CREATE TABLE media (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  filename TEXT NOT NULL,
  original_filename TEXT NOT NULL,
  mime_type TEXT NOT NULL,
  size INTEGER NOT NULL,
  width INTEGER,
  height INTEGER,
  url TEXT NOT NULL,
  alt_text TEXT,
  created_at INTEGER NOT NULL DEFAULT (unixepoch()),
  updated_at INTEGER NOT NULL DEFAULT (unixepoch()),
  uploaded_by INTEGER NOT NULL,
  FOREIGN KEY (uploaded_by) REFERENCES users(id) ON DELETE CASCADE
);

-- Tags for posts
CREATE TABLE tags (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE
);

-- Many-to-many relationship between posts and tags
CREATE TABLE post_tags (
  post_id INTEGER NOT NULL,
  tag_id INTEGER NOT NULL,
  PRIMARY KEY (post_id, tag_id),
  FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
  FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
);

-- Reviews/Testimonials table
CREATE TABLE reviews (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  reviewer_name TEXT NOT NULL,
  reviewer_email TEXT,
  reviewer_image_id INTEGER,
  rating INTEGER CHECK (rating BETWEEN 1 AND 5),
  title TEXT,
  content TEXT NOT NULL,
  approved BOOLEAN NOT NULL DEFAULT 0,
  created_at INTEGER NOT NULL DEFAULT (unixepoch()),
  updated_at INTEGER NOT NULL DEFAULT (unixepoch()),
  FOREIGN KEY (reviewer_image_id) REFERENCES media(id) ON DELETE SET NULL
);

-- Form submissions table
CREATE TABLE submissions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  address TEXT,
  subject TEXT,
  message TEXT NOT NULL,
  created_at INTEGER NOT NULL DEFAULT (unixepoch()),
  processed BOOLEAN NOT NULL DEFAULT 0,
  processed_at INTEGER
);

-- Newsletter subscribers table
CREATE TABLE newsletter_subscribers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'unsubscribed', 'bounced')),
  subscribed_at INTEGER NOT NULL DEFAULT (unixepoch()),
  unsubscribed_at INTEGER,
  source TEXT DEFAULT 'website'
);

-- Portfolio categories table
CREATE TABLE portfolio_categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at INTEGER NOT NULL DEFAULT (unixepoch()),
  updated_at INTEGER NOT NULL DEFAULT (unixepoch())
);

-- Portfolio projects table
CREATE TABLE portfolio_projects (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  short_description TEXT,
  featured_image_id INTEGER,
  category_id INTEGER NOT NULL,
  client_name TEXT,
  project_url TEXT,
  project_date TEXT,
  technologies TEXT, -- JSON array of technologies
  published BOOLEAN NOT NULL DEFAULT 0,
  published_at INTEGER,
  created_at INTEGER NOT NULL DEFAULT (unixepoch()),
  updated_at INTEGER NOT NULL DEFAULT (unixepoch()),
  created_by INTEGER,
  sort_order INTEGER DEFAULT 0,
  FOREIGN KEY (category_id) REFERENCES portfolio_categories(id) ON DELETE CASCADE,
  FOREIGN KEY (featured_image_id) REFERENCES media(id) ON DELETE SET NULL,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);

-- Portfolio project images table (for additional images)
CREATE TABLE portfolio_project_images (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  project_id INTEGER NOT NULL,
  media_id INTEGER NOT NULL,
  sort_order INTEGER DEFAULT 0,
  created_at INTEGER NOT NULL DEFAULT (unixepoch()),
  FOREIGN KEY (project_id) REFERENCES portfolio_projects(id) ON DELETE CASCADE,
  FOREIGN KEY (media_id) REFERENCES media(id) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX idx_posts_slug ON posts(slug);
CREATE INDEX idx_posts_published ON posts(published, published_at);
CREATE INDEX idx_posts_author ON posts(author_id);
CREATE INDEX idx_media_uploaded_by ON media(uploaded_by);
CREATE INDEX idx_reviews_approved ON reviews(approved);
CREATE INDEX idx_submissions_processed ON submissions(processed);
CREATE INDEX idx_newsletter_email ON newsletter_subscribers(email);
CREATE INDEX idx_newsletter_status ON newsletter_subscribers(status);
CREATE INDEX idx_portfolio_categories_slug ON portfolio_categories(slug);
CREATE INDEX idx_portfolio_projects_slug ON portfolio_projects(slug);
CREATE INDEX idx_portfolio_projects_published ON portfolio_projects(published, published_at);
CREATE INDEX idx_portfolio_projects_category ON portfolio_projects(category_id); 