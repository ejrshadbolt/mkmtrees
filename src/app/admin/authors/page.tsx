"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { 
  Plus, 
  Search, 
  User, 
  Edit, 
  Trash2, 
  Mail,
  Globe,
  Star
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import AdminPageContainer from "@/components/admin/AdminPageContainer";
import AdminPageHeader from "@/components/admin/AdminPageHeader";

interface Author {
  id: number;
  name: string;
  slug: string;
  bio?: string;
  email?: string;
  website?: string;
  social_links?: string;
  is_default: boolean;
  created_at: number;
  updated_at: number;
  avatar_id?: number;
}

interface AuthorFormData {
  name: string;
  slug: string;
  bio: string;
  email: string;
  website: string;
  social_links: string;
  is_default: boolean;
  avatar_id: number | null;
}

export default function AuthorsPage() {
  const { status } = useSession();
  const router = useRouter();
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingAuthor, setEditingAuthor] = useState<Author | null>(null);
  const [formData, setFormData] = useState<AuthorFormData>({
    name: "",
    slug: "",
    bio: "",
    email: "",
    website: "",
    social_links: "",
    is_default: false,
    avatar_id: null
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const fetchAuthors = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/authors");
      if (response.ok) {
        const data = await response.json() as { authors: Author[] };
        setAuthors(data.authors);
      } else {
        setError("Failed to load authors");
      }
    } catch (error) {
      console.error("Error fetching authors:", error);
      setError("Failed to load authors");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/admin/login");
    } else if (status === "authenticated") {
      fetchAuthors();
    }
  }, [status, router, fetchAuthors]);

  // Generate slug from name
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const handleNameChange = (name: string) => {
    setFormData(prev => ({
      ...prev,
      name,
      slug: generateSlug(name),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      setError("Name is required");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const url = editingAuthor 
        ? `/api/admin/authors/${editingAuthor.id}`
        : "/api/admin/authors";
      
      const method = editingAuthor ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        await fetchAuthors();
        handleCloseDialog();
      } else {
        const data = await response.json() as { error?: string };
        setError(data.error || "Failed to save author");
      }
    } catch (error) {
      console.error("Error saving author:", error);
      setError("Failed to save author");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (author: Author) => {
    setEditingAuthor(author);
    setFormData({
      name: author.name,
      slug: author.slug,
      bio: author.bio || "",
      email: author.email || "",
      website: author.website || "",
      social_links: author.social_links || "",
      is_default: author.is_default,
      avatar_id: author.avatar_id || null
    });
    setIsCreateOpen(true);
  };

  const handleDelete = async (author: Author) => {
    const confirmMessage = author.is_default 
      ? `Are you sure you want to delete "${author.name}" (default author)? Another author will be automatically set as default. This action cannot be undone.`
      : `Are you sure you want to delete "${author.name}"? This action cannot be undone.`;
      
    if (!confirm(confirmMessage)) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/authors/${author.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        await fetchAuthors();
      } else {
        const data = await response.json() as { error?: string };
        setError(data.error || "Failed to delete author");
      }
    } catch (error) {
      console.error("Error deleting author:", error);
      setError("Failed to delete author");
    }
  };

  const handleCloseDialog = () => {
    setIsCreateOpen(false);
    setEditingAuthor(null);
    setFormData({
      name: "",
      slug: "",
      bio: "",
      email: "",
      website: "",
      social_links: "",
      is_default: false,
      avatar_id: null
    });
    setError("");
  };

  const filteredAuthors = authors.filter(author =>
    author.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    author.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString();
  };

  return (
    <AdminPageContainer>
      <AdminPageHeader 
        title="Authors"
        description="Manage blog post and portfolio project authors"
      >
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transition-all duration-200">
              <Plus className="w-4 h-4 mr-2" />
              New Author
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>
                {editingAuthor ? "Edit Author" : "Create New Author"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-4 border border-red-300 rounded-md bg-red-50">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Name *
                  </label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="Author name"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="slug" className="block text-sm font-medium text-gray-700">
                    Slug *
                  </label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                    placeholder="url-friendly-name"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                  Bio
                </label>
                <textarea
                  id="bio"
                  rows={3}
                  value={formData.bio}
                  onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Brief biography or description"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="author@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="website" className="block text-sm font-medium text-gray-700">
                    Website
                  </label>
                  <Input
                    id="website"
                    type="url"
                    value={formData.website}
                    onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                    placeholder="https://authorsite.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="social_links" className="block text-sm font-medium text-gray-700">
                  Social Links (JSON)
                </label>
                <textarea
                  id="social_links"
                  rows={2}
                  value={formData.social_links}
                  onChange={(e) => setFormData(prev => ({ ...prev, social_links: e.target.value }))}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
                  placeholder='{"twitter": "https://twitter.com/username", "linkedin": "https://linkedin.com/in/username"}'
                />
                <p className="mt-1 text-xs text-gray-500">
                  Optional JSON object with social media links
                </p>
              </div>

              <div className="flex items-center">
                <input
                  id="is_default"
                  type="checkbox"
                  checked={formData.is_default}
                  onChange={(e) => setFormData(prev => ({ ...prev, is_default: e.target.checked }))}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="is_default" className="ml-2 text-sm text-gray-700">
                  Set as default author
                </label>
                <p className="ml-2 text-xs text-gray-500">
                  (Only one author can be default)
                </p>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCloseDialog}
                  disabled={saving}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={saving}>
                  {saving ? "Saving..." : (editingAuthor ? "Update" : "Create")}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </AdminPageHeader>

      {/* Error Display */}
      {error && (
        <Card className="bg-red-50 border-red-200 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                  <span className="text-red-600 text-sm font-bold">!</span>
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-800">{error}</p>
              </div>
              <div className="ml-auto pl-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setError("")}
                  className="text-red-600 hover:text-red-700"
                >
                  ×
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search */}
      <Card className="bg-white/70 backdrop-blur-sm border-white/20 shadow-lg">
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search authors..."
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Authors List */}
      <Card className="bg-white/70 backdrop-blur-sm border-white/20 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center">
            <User className="w-5 h-5 mr-2" />
            Authors ({filteredAuthors.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-500">Loading authors...</p>
            </div>
          ) : filteredAuthors.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <User className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No authors found</h3>
              <p className="text-gray-500 mb-6">
                {searchTerm 
                  ? "Try adjusting your search terms."
                  : "Get started by creating your first author."
                }
              </p>
              <Button onClick={() => setIsCreateOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Create your first author
              </Button>
            </div>
          ) : (
            <div className="divide-y divide-gray-200/50">
              {filteredAuthors.map((author) => (
                <div key={author.id} className="p-6 hover:bg-gray-50/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-medium text-gray-900">
                          {author.name}
                        </h3>
                        {author.is_default && (
                          <Badge className="bg-yellow-100 text-yellow-800">
                            <Star className="w-3 h-3 mr-1" />
                            Default
                          </Badge>
                        )}
                      </div>
                      
                      <p className="text-sm text-gray-500 mb-2">/{author.slug}</p>
                      
                      {author.bio && (
                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                          {author.bio}
                        </p>
                      )}
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        {author.email && (
                          <div className="flex items-center">
                            <Mail className="w-4 h-4 mr-1" />
                            {author.email}
                          </div>
                        )}
                        {author.website && (
                          <div className="flex items-center">
                            <Globe className="w-4 h-4 mr-1" />
                            <a 
                              href={author.website} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800"
                            >
                              Website
                            </a>
                          </div>
                        )}
                        <span>Created {formatDate(author.created_at)}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(author)}
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(author)}
                        className={filteredAuthors.length <= 1
                          ? "text-gray-400 cursor-not-allowed opacity-50" 
                          : "text-red-600 hover:text-red-700 hover:bg-red-50"
                        }
                        disabled={filteredAuthors.length <= 1}
                        title={filteredAuthors.length <= 1 
                          ? "Cannot delete the last remaining author" 
                          : author.is_default 
                            ? "Delete default author (another will be promoted to default)" 
                            : "Delete author"
                        }
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </AdminPageContainer>
  );
} 