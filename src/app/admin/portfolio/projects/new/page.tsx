"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { 
  ImageIcon, 
  ExternalLink, 
  Plus,
  X,
  GripVertical
} from "lucide-react";
import { PortfolioCategory } from "@/lib/types";
import AuthorSelector from "@/components/admin/AuthorSelector";
import MediaSelector from "@/components/admin/MediaSelector";

interface ProjectFormData {
  title: string;
  slug: string;
  description: string;
  short_description: string;
  client_name: string;
  project_url: string;
  project_date: string;
  technologies: string;
  featured_image_id: number | null;
  category_id: number | null;
  published: boolean;
  sort_order: number;
  author_id: number | null;
}

interface MediaItem {
  id: number;
  url: string;
  alt_text: string;
  original_filename: string;
}

interface ProjectImage {
  media_id: number;
  media_item: MediaItem;
  caption?: string;
  sort_order: number;
  image_type?: 'before' | 'after' | 'general' | 'progress';
}

export default function NewProjectPage() {
  const { status } = useSession();
  const router = useRouter();
  const [formData, setFormData] = useState<ProjectFormData>({
    title: "",
    slug: "",
    description: "",
    short_description: "",
    client_name: "",
    project_url: "",
    project_date: "",
    technologies: "",
    featured_image_id: null,
    category_id: null,
    published: false,
    sort_order: 0,
    author_id: null,
  });
  const [categories, setCategories] = useState<PortfolioCategory[]>([]);
  const [showFeaturedImageSelector, setShowFeaturedImageSelector] = useState(false);
  const [showGallerySelector, setShowGallerySelector] = useState(false);
  const [projectImages, setProjectImages] = useState<ProjectImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch categories on mount
  useEffect(() => {
    if (status === "authenticated") {
      fetchCategories();
    } else if (status === "unauthenticated") {
      router.push("/admin/login");
    }
  }, [status, router]);

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/admin/portfolio/categories");
      if (response.ok) {
        const data = await response.json() as { categories: PortfolioCategory[] };
        setCategories(data.categories);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

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

  const handleFeaturedImageSelect = (mediaItem: MediaItem) => {
    setFormData(prev => ({ ...prev, featured_image_id: mediaItem.id }));
  };

  const handleGalleryImageSelect = (mediaItem: MediaItem) => {
    const newImage: ProjectImage = {
      media_id: mediaItem.id,
      media_item: mediaItem,
      caption: "",
      sort_order: projectImages.length,
      image_type: 'general',
    };
    setProjectImages(prev => [...prev, newImage]);
  };

  const handleRemoveGalleryImage = (mediaId: number) => {
    setProjectImages(prev => prev.filter(img => img.media_id !== mediaId));
  };

  const handleUpdateImageCaption = (mediaId: number, caption: string) => {
    setProjectImages(prev => 
      prev.map(img => 
        img.media_id === mediaId ? { ...img, caption } : img
      )
    );
  };

  const handleUpdateImageType = (mediaId: number, imageType: 'before' | 'after' | 'general' | 'progress') => {
    setProjectImages(prev => 
      prev.map(img => 
        img.media_id === mediaId ? { ...img, image_type: imageType } : img
      )
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description) {
      setError("Title and description are required");
      return;
    }

    if (!formData.category_id) {
      setError("Please select a category");
      return;
    }

    if (!formData.author_id) {
      setError("Please select an author");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // First, create the project
      const response = await fetch("/api/admin/portfolio/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const newProject = await response.json() as { id: number };
        
        // If there are gallery images, save them
        if (projectImages.length > 0) {
          try {
            const imagesData = projectImages.map(img => ({
              media_id: img.media_id,
              caption: img.caption || "",
              sort_order: img.sort_order,
              image_type: img.image_type || 'general'
            }));

            const imagesResponse = await fetch(`/api/admin/portfolio/projects/${newProject.id}/images`, {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ images: imagesData }),
            });

            if (!imagesResponse.ok) {
              console.error("Failed to save gallery images, but project was created");
              // Continue anyway since the project was created successfully
            }
          } catch (imageError) {
            console.error("Error saving gallery images:", imageError);
            // Continue anyway since the project was created successfully
          }
        }

        // Redirect to edit page
        router.push(`/admin/portfolio/projects/${newProject.id}/edit`);
      } else {
        const data = await response.json() as { error?: string };
        setError(data.error || "Failed to create project");
      }
    } catch (error) {
      console.error("Error creating project:", error);
      setError("Failed to create project");
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
    <div>
      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">New Portfolio Project</h1>
              <p className="mt-1 text-sm text-gray-500">Create a new portfolio project</p>
            </div>
            <Link
              href="/admin/portfolio"
              className="rounded-md bg-gray-600 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700"
            >
              Back to Portfolio
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <div className="text-sm text-red-600">{error}</div>
            </div>
          )}

          <div className="bg-white shadow rounded-lg">
            <div className="p-6">
              <div className="grid grid-cols-1 gap-6">
                {/* Title */}
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                    Project Title *
                  </label>
                  <input
                    type="text"
                    id="title"
                    value={formData.title}
                    onChange={handleTitleChange}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="Enter project title..."
                    required
                  />
                </div>

                {/* Slug */}
                <div>
                  <label htmlFor="slug" className="block text-sm font-medium text-gray-700">
                    Slug *
                  </label>
                  <div className="mt-1 flex rounded-md shadow-sm">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                      /portfolio/
                    </span>
                    <input
                      type="text"
                      id="slug"
                      value={formData.slug}
                      onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                      className="flex-1 block w-full rounded-none rounded-r-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="project-slug"
                      required
                    />
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    The URL-friendly version of the title. Will be auto-generated from title.
                  </p>
                </div>

                {/* Author Selection */}
                <AuthorSelector
                  selectedAuthorId={formData.author_id}
                  onAuthorChange={(authorId) => setFormData(prev => ({ ...prev, author_id: authorId }))}
                />

                {/* Two-column layout for smaller fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Client Name */}
                  <div>
                    <label htmlFor="client_name" className="block text-sm font-medium text-gray-700">
                      Client Name
                    </label>
                    <input
                      type="text"
                      id="client_name"
                      value={formData.client_name}
                      onChange={(e) => setFormData(prev => ({ ...prev, client_name: e.target.value }))}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="Client or company name..."
                    />
                  </div>

                  {/* Category */}
                  <div>
                    <label htmlFor="category_id" className="block text-sm font-medium text-gray-700">
                      Category *
                    </label>
                    <select
                      id="category_id"
                      value={formData.category_id || ""}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        category_id: e.target.value ? parseInt(e.target.value) : null 
                      }))}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      required
                    >
                      <option value="">Select a category...</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Project URL and Sort Order */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Project URL */}
                  <div>
                    <label htmlFor="project_url" className="block text-sm font-medium text-gray-700">
                      Project URL
                    </label>
                    <div className="mt-1 flex rounded-md shadow-sm">
                      <input
                        type="url"
                        id="project_url"
                        value={formData.project_url}
                        onChange={(e) => setFormData(prev => ({ ...prev, project_url: e.target.value }))}
                        className="flex-1 block w-full rounded-l-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="https://example.com"
                      />
                      <span className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500">
                        <ExternalLink className="w-4 h-4" />
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                      Link to the live project (optional)
                    </p>
                  </div>

                  {/* Sort Order */}
                  <div>
                    <label htmlFor="sort_order" className="block text-sm font-medium text-gray-700">
                      Sort Order
                    </label>
                    <input
                      type="number"
                      id="sort_order"
                      value={formData.sort_order}
                      onChange={(e) => setFormData(prev => ({ ...prev, sort_order: parseInt(e.target.value) || 0 }))}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="0"
                      min="0"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Order in portfolio (0 = first)
                    </p>
                  </div>
                </div>

                {/* Project Date and Technologies */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Project Date */}
                  <div>
                    <label htmlFor="project_date" className="block text-sm font-medium text-gray-700">
                      Project Date
                    </label>
                    <input
                      type="date"
                      id="project_date"
                      value={formData.project_date}
                      onChange={(e) => setFormData(prev => ({ ...prev, project_date: e.target.value }))}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  {/* Technologies */}
                  <div>
                    <label htmlFor="technologies" className="block text-sm font-medium text-gray-700">
                      Technologies
                    </label>
                    <input
                      type="text"
                      id="technologies"
                      value={formData.technologies}
                      onChange={(e) => setFormData(prev => ({ ...prev, technologies: e.target.value }))}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="React, Node.js, PostgreSQL..."
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Comma-separated list of technologies used
                    </p>
                  </div>
                </div>

                {/* Featured Image */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Featured Image
                  </label>
                  
                  {formData.featured_image_id ? (
                    <div className="flex items-center gap-4 p-4 border border-gray-300 rounded-md">
                      <div className="w-20 h-20 rounded-md overflow-hidden">
                        <Image
                          src={`/api/media/${formData.featured_image_id}`}
                          alt="Featured image"
                          width={80}
                          height={80}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">Featured image selected</p>
                        <p className="text-sm text-gray-500">This will be the main image for the project</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowFeaturedImageSelector(true)}
                        className="px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
                      >
                        Change
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, featured_image_id: null }))}
                        className="px-3 py-2 text-sm text-red-600 border border-red-300 rounded-md hover:bg-red-50"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setShowFeaturedImageSelector(true)}
                      className="flex items-center justify-center w-full h-32 border border-dashed border-gray-300 rounded-md hover:border-gray-400 transition-colors"
                    >
                      <div className="text-center">
                        <ImageIcon className="w-8 h-8 mx-auto text-gray-400" />
                        <p className="mt-2 text-sm text-gray-500">Click to select or upload featured image</p>
                      </div>
                    </button>
                  )}
                </div>

                {/* Gallery Images */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Gallery Images
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowGallerySelector(true)}
                      className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Add Image
                    </button>
                  </div>
                  
                  {projectImages.length > 0 ? (
                    <div className="space-y-3">
                      {projectImages.map((image) => (
                        <div key={image.media_id} className="flex items-center gap-4 p-3 border border-gray-200 rounded-md">
                          <div className="cursor-move">
                            <GripVertical className="w-4 h-4 text-gray-400" />
                          </div>
                          <div className="w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
                            <Image
                              src={image.media_item.url}
                              alt={image.media_item.alt_text}
                              width={64}
                              height={64}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 space-y-2">
                            <p className="text-sm font-medium text-gray-900">{image.media_item.original_filename}</p>
                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1">
                                Image Type
                              </label>
                              <select
                                value={image.image_type || 'general'}
                                onChange={(e) => handleUpdateImageType(image.media_id, e.target.value as 'before' | 'after' | 'general' | 'progress')}
                                className="w-full text-sm border border-gray-300 rounded-md px-2 py-1 focus:border-blue-500 focus:outline-none"
                              >
                                <option value="general">General</option>
                                <option value="before">Before</option>
                                <option value="after">After</option>
                                <option value="progress">Progress</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1">
                                Caption (optional)
                              </label>
                              <input
                                type="text"
                                placeholder="Add a caption..."
                                value={image.caption || ""}
                                onChange={(e) => handleUpdateImageCaption(image.media_id, e.target.value)}
                                className="w-full text-sm border border-gray-300 rounded-md px-2 py-1 focus:border-blue-500 focus:outline-none"
                              />
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveGalleryImage(image.media_id)}
                            className="p-1 text-red-600 hover:text-red-800"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6 border border-dashed border-gray-300 rounded-md">
                      <ImageIcon className="w-8 h-8 mx-auto text-gray-400" />
                      <p className="mt-2 text-sm text-gray-500">No gallery images added yet</p>
                      <button
                        type="button"
                        onClick={() => setShowGallerySelector(true)}
                        className="mt-2 text-sm text-blue-600 hover:text-blue-800"
                      >
                        Add your first image
                      </button>
                    </div>
                  )}
                </div>

                {/* Short Description */}
                <div>
                  <label htmlFor="short_description" className="block text-sm font-medium text-gray-700">
                    Short Description
                  </label>
                  <textarea
                    id="short_description"
                    rows={2}
                    value={formData.short_description}
                    onChange={(e) => setFormData(prev => ({ ...prev, short_description: e.target.value }))}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="Brief description for project cards..."
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Brief description shown in project listings
                  </p>
                </div>

                {/* Full Description */}
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Full Description *
                  </label>
                  <textarea
                    id="description"
                    rows={6}
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="Detailed description of the project..."
                    required
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Detailed description shown on the project page
                  </p>
                </div>

                {/* Publishing Options */}
                <div className="border-t border-gray-200 pt-6">
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
                  <p className="mt-1 text-xs text-gray-500">
                    If unchecked, the project will be saved as a draft
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-between">
            <Link
              href="/admin/portfolio"
              className="rounded-md bg-gray-600 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create Project"}
            </button>
          </div>
        </form>

        {/* Media Selector Modals */}
        <MediaSelector
          isOpen={showFeaturedImageSelector}
          onClose={() => setShowFeaturedImageSelector(false)}
          onSelect={handleFeaturedImageSelect}
          selectedId={formData.featured_image_id}
          title="Select Featured Image"
        />

        <MediaSelector
          isOpen={showGallerySelector}
          onClose={() => setShowGallerySelector(false)}
          onSelect={handleGalleryImageSelect}
          title="Add Gallery Image"
        />
      </main>
    </div>
  );
} 