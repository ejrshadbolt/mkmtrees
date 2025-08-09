"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ImageIcon } from "lucide-react";
import RichTextEditor from "@/components/admin/RichTextEditor";
import SEOFields from "@/components/admin/SEOFields";
import AuthorSelector from "@/components/admin/AuthorSelector";
import MediaSelector from "@/components/admin/MediaSelector";

interface PostFormData {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  published: boolean;
  tags: string[];
  meta_description: string;
  og_title: string;
  og_description: string;
  og_image: string;
  featured_image_id: number | null;
  author_id: number | null;
}

interface MediaItem {
  id: number;
  url: string;
  alt_text: string;
  original_filename: string;
}

export default function NewPostPage() {
  const { status } = useSession();
  const router = useRouter();
  const [formData, setFormData] = useState<PostFormData>({
    title: "",
    slug: "",
    content: "",
    excerpt: "",
    published: false,
    tags: [],
    meta_description: "",
    og_title: "",
    og_description: "",
    og_image: "",
    featured_image_id: null,
    author_id: null,
  });
  const [tagInput, setTagInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showMediaSelector, setShowMediaSelector] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/admin/login");
    }
  }, [status, router]);

  // Generate slug from title
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setFormData(prev => ({
      ...prev,
      title,
      slug: generateSlug(title),
    }));
  };

  const [featuredImageUrl, setFeaturedImageUrl] = useState<string | null>(null);

  const handleFeaturedImageSelect = (mediaItem: MediaItem) => {
    setFormData(prev => ({ ...prev, featured_image_id: mediaItem.id }));
    setFeaturedImageUrl(mediaItem.url);
  };

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const tag = tagInput.trim();
      if (tag && !formData.tags.includes(tag)) {
        setFormData(prev => ({
          ...prev,
          tags: [...prev.tags, tag],
        }));
      }
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.content) {
      setError("Title and content are required");
      return;
    }

    if (!formData.author_id) {
      setError("Please select an author");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/admin/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          featured_image_id: formData.featured_image_id,
        }),
      });

      if (response.ok) {
        const newPost = await response.json() as { id: number };
        router.push(`/admin/posts/${newPost.id}/edit`);
      } else {
        const data = await response.json() as { error?: string };
        setError(data.error || "Failed to create post");
      }
    } catch (error) {
      console.error("Error creating post:", error);
      setError("Failed to create post");
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Create New Post</h1>
              <p className="mt-2 text-gray-600">
                Write and publish a new blog post.
              </p>
            </div>
            <div className="flex gap-4">
              <Link href="/admin/posts">
                <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                  Cancel
                </button>
              </Link>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 border border-red-300 rounded-md bg-red-50">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Main Content */}
          <div className="bg-white shadow rounded-lg">
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Title */}
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                    Title *
                  </label>
                  <input
                    type="text"
                    id="title"
                    value={formData.title}
                    onChange={handleTitleChange}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="Enter post title..."
                    required
                  />
                </div>

                {/* Slug */}
                <div>
                  <label htmlFor="slug" className="block text-sm font-medium text-gray-700">
                    Slug *
                  </label>
                  <input
                    type="text"
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="url-friendly-version"
                    required
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Leave blank to auto-generate from title. Must be unique and SEO-friendly (no spaces or special characters except hyphens).
                  </p>
                </div>
              </div>

              {/* Author Selection */}
              <AuthorSelector
                selectedAuthorId={formData.author_id}
                onAuthorChange={(authorId) => setFormData(prev => ({ ...prev, author_id: authorId }))}
              />

              {/* Featured Image */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Featured Image
                </label>
                
                {formData.featured_image_id && featuredImageUrl ? (
                  <div className="flex items-center gap-4 p-4 border border-gray-300 rounded-md">
                    <div className="w-20 h-20 rounded-md overflow-hidden">
                      <Image
                        src={featuredImageUrl}
                        alt="Featured image"
                        width={80}
                        height={80}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                        }}
                      />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">Featured image selected</p>
                      <p className="text-sm text-gray-500">Click &quot;Change&quot; to select a different image</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowMediaSelector(true)}
                      className="px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
                    >
                      Change
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setFormData(prev => ({ ...prev, featured_image_id: null }));
                        setFeaturedImageUrl(null);
                      }}
                      className="px-3 py-2 text-sm text-red-600 border border-red-300 rounded-md hover:bg-red-50"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowMediaSelector(true)}
                    className="flex items-center justify-center w-full h-32 border border-dashed border-gray-300 rounded-md hover:border-gray-400 transition-colors"
                  >
                    <div className="text-center">
                      <ImageIcon className="w-8 h-8 mx-auto text-gray-400" />
                      <p className="mt-2 text-sm text-gray-500">Click to select or upload featured image</p>
                    </div>
                  </button>
                )}
              </div>

              {/* Excerpt */}
              <div>
                <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700">
                  Excerpt
                </label>
                <textarea
                  id="excerpt"
                  rows={3}
                  value={formData.excerpt}
                  onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Brief summary of the post..."
                />
                <p className="mt-1 text-xs text-gray-500">
                  Brief summary that appears in post listings and previews.
                </p>
              </div>

              {/* Tags */}
              <div>
                <label htmlFor="tags" className="block text-sm font-medium text-gray-700">
                  Tags
                </label>
                <input
                  type="text"
                  id="tags"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleAddTag}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Add tags (press Enter or comma to add)"
                />
                {formData.tags.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {formData.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="ml-1 text-blue-600 hover:text-blue-800"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  Organize your post with relevant tags for better discoverability.
                </p>
              </div>

              {/* Content */}
              <div>
                <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                  Content *
                </label>
                <div className="mt-1">
                  <RichTextEditor
                    content={formData.content}
                    onChange={(content) => setFormData(prev => ({ ...prev, content }))}
                    placeholder="Write your post content here..."
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Rich text editor with formatting tools. You can add links, images, and more.
                </p>
              </div>
            </div>
          </div>

          {/* SEO Fields */}
          <SEOFields
            title={formData.title}
            excerpt={formData.excerpt}
            slug={formData.slug}
            metaDescription={formData.meta_description}
            ogTitle={formData.og_title}
            ogDescription={formData.og_description}
            ogImage={formData.og_image}
            onMetaDescriptionChange={(value) => setFormData(prev => ({ ...prev, meta_description: value }))}
            onOgTitleChange={(value) => setFormData(prev => ({ ...prev, og_title: value }))}
            onOgDescriptionChange={(value) => setFormData(prev => ({ ...prev, og_description: value }))}
            onOgImageChange={(value) => setFormData(prev => ({ ...prev, og_image: value }))}
          />

          {/* Publish Options */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Publishing Options</h3>
            
            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  id="published"
                  type="checkbox"
                  checked={formData.published}
                  onChange={(e) => setFormData(prev => ({ ...prev, published: e.target.checked }))}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="published" className="ml-2 block text-sm text-gray-900">
                  Publish immediately
                </label>
              </div>
              <p className="text-xs text-gray-500">
                If unchecked, the post will be saved as a draft.
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-between items-center">
            <Link href="/admin/posts">
              <button
                type="button"
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </Link>
            
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
            >
              {loading ? "Creating..." : "Create Post"}
            </button>
          </div>
        </form>

        {/* Media Selector Modal */}
        <MediaSelector
          isOpen={showMediaSelector}
          onClose={() => setShowMediaSelector(false)}
          onSelect={handleFeaturedImageSelect}
          selectedId={formData.featured_image_id}
          title="Select Featured Image"
        />
      </div>
    </div>
  );
} 