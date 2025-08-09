"use client";

export const runtime = 'edge';

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { 
  ImageIcon, 
  ExternalLink, 
  Eye, 
  EyeOff
} from "lucide-react";
import { PortfolioCategory } from "@/lib/types";
import MediaSelector from "@/components/admin/MediaSelector";
import AuthorSelector from "@/components/admin/AuthorSelector";

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
  mime_type?: string;
}

interface ProjectImage {
  media_id: number;
  media_item: MediaItem;
  caption?: string;
  sort_order: number;
  image_type?: 'before' | 'after' | 'general' | 'progress';
}

interface ProjectImageResponse {
  media_id: number;
  url: string;
  alt_text: string;
  original_filename: string;
  caption?: string;
  sort_order: number;
  image_type?: string;
}

interface ProjectData {
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
  category_id?: number;
  published: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
  author_id?: number;
}

interface EditProjectPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function EditProjectPage({ params }: EditProjectPageProps) {
  const { status } = useSession();
  const router = useRouter();
  const [projectId, setProjectId] = useState<string | null>(null);
  const [project, setProject] = useState<ProjectData | null>(null);
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
  const [showMediaSelector, setShowMediaSelector] = useState(false);
  const [showGallerySelector, setShowGallerySelector] = useState(false);
  const [projectImages, setProjectImages] = useState<ProjectImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  const fetchProject = useCallback(async () => {
    if (!projectId) return;
    
    try {
      const response = await fetch(`/api/admin/portfolio/projects/${projectId}`);
      if (response.ok) {
        const data = await response.json() as ProjectData;
        setProject(data);
        setFormData({
          title: data.title,
          slug: data.slug,
          description: data.description,
          short_description: data.short_description || "",
          client_name: data.client_name || "",
          project_url: data.project_url || "",
          project_date: data.project_date || "",
          technologies: data.technologies || "",
          featured_image_id: data.featured_image_id || null,
          category_id: data.category_id || null,
          published: data.published,
          sort_order: data.sort_order,
          author_id: data.author_id || null,
        });
      } else if (response.status === 404) {
        router.push("/admin/portfolio");
      } else {
        setError("Failed to load project");
      }
    } catch (error) {
      console.error("Error fetching project:", error);
      setError("Failed to load project");
    }
  }, [projectId, router]);

  const fetchProjectImages = useCallback(async () => {
    if (!projectId) return;
    
    try {
      const response = await fetch(`/api/admin/portfolio/projects/${projectId}/images`);
      if (response.ok) {
        const data = await response.json() as { images: ProjectImageResponse[] };
        const images = data.images.map(img => ({
          media_id: img.media_id,
          media_item: {
            id: img.media_id,
            url: img.url,
            alt_text: img.alt_text,
            original_filename: img.original_filename
          },
          caption: img.caption,
          sort_order: img.sort_order,
          image_type: (img.image_type as 'before' | 'after' | 'general' | 'progress') || 'general'
        }));
        setProjectImages(images);
      }
    } catch (error) {
      console.error("Error fetching project images:", error);
    }
  }, [projectId]);

  const fetchCategories = useCallback(async () => {
    try {
      const response = await fetch("/api/admin/portfolio/categories");
      if (response.ok) {
        const data = await response.json() as { categories: PortfolioCategory[] };
        setCategories(data.categories);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  }, []);

  useEffect(() => {
    params.then(resolvedParams => {
      setProjectId(resolvedParams.id);
    });
  }, [params]);

  useEffect(() => {
    if (status === "authenticated" && projectId) {
      Promise.all([
        fetchProject(),
        fetchProjectImages(),
        fetchCategories()
      ]).finally(() => setLoading(false));
    } else if (status === "unauthenticated") {
      router.push("/admin/login");
    }
  }, [status, router, projectId, fetchProject, fetchProjectImages, fetchCategories]);

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

  const handleReorderImages = (fromIndex: number, toIndex: number) => {
    setProjectImages(prev => {
      const newImages = [...prev];
      const [movedImage] = newImages.splice(fromIndex, 1);
      newImages.splice(toIndex, 0, movedImage);
      return newImages.map((img, index) => ({ ...img, sort_order: index }));
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description) {
      setError("Title and description are required");
      return;
    }

    setSaving(true);
    setError("");

    try {
      // Update the project
      const response = await fetch(`/api/admin/portfolio/projects/${projectId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        // Update gallery images
        try {
          const imagesData = projectImages.map(img => ({
            media_id: img.media_id,
            caption: img.caption || "",
            sort_order: img.sort_order,
            image_type: img.image_type || 'general'
          }));

          const imagesResponse = await fetch(`/api/admin/portfolio/projects/${projectId}/images`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ images: imagesData }),
          });

          if (!imagesResponse.ok) {
            console.error("Failed to update gallery images, but project was updated");
          }
        } catch (imageError) {
          console.error("Error updating gallery images:", imageError);
        }

        // Refresh project data
        await fetchProject();
        await fetchProjectImages();
        
        // Redirect back to portfolio admin
        router.push("/admin/portfolio");
      } else {
        const data = await response.json() as { error?: string };
        setError(data.error || "Failed to update project");
      }
    } catch (error) {
      console.error("Error updating project:", error);
      setError("Failed to update project");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this project? This action cannot be undone.")) {
      return;
    }

    setDeleting(true);
    setError("");

    try {
      const response = await fetch(`/api/admin/portfolio/projects/${projectId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        router.push("/admin/portfolio");
      } else {
        const data = await response.json() as { error?: string };
        setError(data.error || "Failed to delete project");
      }
    } catch (error) {
      console.error("Error deleting project:", error);
      setError("Failed to delete project");
    } finally {
      setDeleting(false);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">Project not found</div>
      </div>
    );
  }

  return (
    <div>
      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">Edit Portfolio Project</h1>
              <p className="mt-1 text-sm text-gray-500">Editing: {project.title}</p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
              <Link
                href="/admin/portfolio"
                className="rounded-md bg-gray-600 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700"
              >
                Back to Portfolio
              </Link>
            </div>
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
                </div>

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
                      Category
                    </label>
                    <select
                      id="category_id"
                      value={formData.category_id || ""}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        category_id: e.target.value ? parseInt(e.target.value) : null 
                      }))}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
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
                      placeholder="e.g., Solar Panels, Smart Home Systems, Three-Phase Wiring"
                    />
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
                          src={project?.featured_image_url || `/api/media/${formData.featured_image_id}`}
                          alt="Featured image"
                          width={80}
                          height={80}
                          className="w-full h-full object-cover"
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
                        onClick={() => setFormData(prev => ({ ...prev, featured_image_id: null }))}
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

                {/* Project Gallery Images */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Project Gallery Images
                  </label>
                  <p className="text-sm text-gray-600 mb-4">
                    Add multiple images to showcase project progress, before/after photos, or different angles.
                  </p>
                  
                  {projectImages.length > 0 ? (
                    <div className="mb-4 space-y-4">
                      {projectImages.map((projectImage, index) => (
                        <div key={projectImage.media_id} className="flex items-start gap-4 p-4 border border-gray-200 rounded-md bg-gray-50">
                          <Image
                            src={projectImage.media_item.url}
                            alt={projectImage.media_item.alt_text}
                            width={80}
                            height={80}
                            className="w-20 h-20 object-cover rounded-md flex-shrink-0"
                          />
                          <div className="flex-1 space-y-2">
                            <div>
                              <p className="font-medium text-sm">{projectImage.media_item.original_filename}</p>
                              <p className="text-xs text-gray-500">{projectImage.media_item.alt_text}</p>
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1">
                                Image Type
                              </label>
                              <select
                                value={projectImage.image_type || 'general'}
                                onChange={(e) => handleUpdateImageType(projectImage.media_id, e.target.value as 'before' | 'after' | 'general' | 'progress')}
                                className="w-full text-sm border border-gray-300 rounded px-2 py-1 focus:border-blue-500 focus:outline-none"
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
                                value={projectImage.caption || ""}
                                onChange={(e) => handleUpdateImageCaption(projectImage.media_id, e.target.value)}
                                placeholder="Describe this image or add context..."
                                className="w-full text-sm border border-gray-300 rounded px-2 py-1 focus:border-blue-500 focus:outline-none"
                              />
                            </div>
                          </div>
                          <div className="flex flex-col gap-2">
                            {index > 0 && (
                              <button
                                type="button"
                                onClick={() => handleReorderImages(index, index - 1)}
                                className="px-2 py-1 text-xs border border-gray-300 rounded hover:bg-gray-100"
                                title="Move up"
                              >
                                ↑
                              </button>
                            )}
                            {index < projectImages.length - 1 && (
                              <button
                                type="button"
                                onClick={() => handleReorderImages(index, index + 1)}
                                className="px-2 py-1 text-xs border border-gray-300 rounded hover:bg-gray-100"
                                title="Move down"
                              >
                                ↓
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => handleRemoveGalleryImage(projectImage.media_id)}
                              className="px-2 py-1 text-xs text-red-600 border border-red-300 rounded hover:bg-red-50"
                              title="Remove"
                            >
                              ×
                            </button>
                          </div>
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

                  <button
                    type="button"
                    onClick={() => setShowGallerySelector(true)}
                    className="flex items-center justify-center w-full h-20 border border-dashed border-gray-300 rounded-md hover:border-gray-400 transition-colors"
                  >
                    <div className="text-center">
                      <ImageIcon className="w-6 h-6 mx-auto text-gray-400" />
                      <p className="mt-1 text-sm text-gray-500">Add or upload gallery images</p>
                    </div>
                  </button>
                </div>

                {/* Author Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Author
                  </label>
                  <AuthorSelector
                    selectedAuthorId={formData.author_id}
                    onAuthorChange={(authorId) => setFormData(prev => ({ ...prev, author_id: authorId }))}
                  />
                </div>

                {/* Short Description */}
                <div>
                  <label htmlFor="short_description" className="block text-sm font-medium text-gray-700">
                    Short Description
                  </label>
                  <textarea
                    id="short_description"
                    rows={3}
                    value={formData.short_description}
                    onChange={(e) => setFormData(prev => ({ ...prev, short_description: e.target.value }))}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="Brief summary for project cards and previews..."
                  />
                </div>

                {/* Full Description */}
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Full Description *
                  </label>
                  <textarea
                    id="description"
                    rows={12}
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
                    placeholder="Detailed project description... (Supports Markdown)"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-lg">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="published"
                    checked={formData.published}
                    onChange={(e) => setFormData(prev => ({ ...prev, published: e.target.checked }))}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="published" className="ml-2 text-sm font-medium text-gray-700 flex items-center">
                    {formData.published ? (
                      <><Eye className="w-4 h-4 mr-1" /> Published</>
                    ) : (
                      <><EyeOff className="w-4 h-4 mr-1" /> Draft</>
                    )}
                  </label>
                </div>

                <div className="flex gap-3">
                  <Link href="/admin/portfolio">
                    <button
                      type="button"
                      className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                  </Link>
                  
                  <button
                    type="submit"
                    disabled={saving}
                    className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                  >
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>

        <MediaSelector
          isOpen={showMediaSelector}
          onClose={() => setShowMediaSelector(false)}
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