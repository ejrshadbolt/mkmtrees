'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { 
  Plus, 
  Search, 
  Image as ImageIcon, 
  Eye, 
  EyeOff, 
  Edit3, 
  Trash2,
  Folder,
  Settings
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import Link from 'next/link';
import Image from 'next/image';
import AdminPageContainer from '@/components/admin/AdminPageContainer';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import { toast } from 'sonner';

interface PortfolioProject {
  id: number;
  title: string;
  slug: string;
  description: string;
  short_description?: string;
  client_name?: string;
  project_url?: string;
  featured_image_url?: string;
  featured_image_alt?: string;
  category_name?: string;
  category_slug?: string;
  published: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

interface PortfolioCategory {
  id: number;
  name: string;
  slug: string;
  description?: string;
  project_count: number;
  created_at: string;
  updated_at: string;
}

interface ProjectsResponse {
  projects: PortfolioProject[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

interface CategoriesResponse {
  categories: PortfolioCategory[];
}

export default function PortfolioAdminPage() {
  const { status } = useSession();
  const router = useRouter();
  const [projects, setProjects] = useState<PortfolioProject[]>([]);
  const [categories, setCategories] = useState<PortfolioCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [publishedFilter, setPublishedFilter] = useState('all');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false,
  });
  const [isCreateCategoryOpen, setIsCreateCategoryOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryDescription, setNewCategoryDescription] = useState('');
  const [categorySubmitting, setCategorySubmitting] = useState(false);

  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
      });

      if (search) params.append('search', search);
      if (categoryFilter !== 'all') params.append('category', categoryFilter);
      if (publishedFilter !== 'all') params.append('published', publishedFilter);

      const response = await fetch(`/api/admin/portfolio/projects?${params}`);
      if (response.ok) {
        const data: ProjectsResponse = await response.json();
        setProjects(data.projects);
        setPagination(data.pagination);
      } else {
        console.error('Failed to fetch projects');
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, search, categoryFilter, publishedFilter]);

  const fetchCategories = useCallback(async () => {
    try {
      setCategoriesLoading(true);
      const response = await fetch('/api/admin/portfolio/categories');
      if (response.ok) {
        const data: CategoriesResponse = await response.json();
        setCategories(data.categories);
      } else {
        console.error('Failed to fetch categories');
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setCategoriesLoading(false);
    }
  }, []);

  const createCategory = async () => {
    if (!newCategoryName.trim()) {
      toast.error('Category name is required');
      return;
    }

    try {
      setCategorySubmitting(true);
      
      // Generate slug from name
      const slug = newCategoryName.trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      
      const response = await fetch('/api/admin/portfolio/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newCategoryName.trim(),
          slug: slug,
          description: newCategoryDescription.trim(),
        }),
      });

      if (response.ok) {
        toast.success('Category created successfully');
        setNewCategoryName('');
        setNewCategoryDescription('');
        setIsCreateCategoryOpen(false);
        fetchCategories();
      } else {
        const errorData = await response.json() as { error?: string };
        toast.error(errorData.error || 'Failed to create category');
      }
    } catch (error) {
      console.error('Error creating category:', error);
      toast.error('Failed to create category');
    } finally {
      setCategorySubmitting(false);
    }
  };

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    } else if (status === 'authenticated') {
      fetchProjects();
      fetchCategories();
    }
  }, [status, router, fetchProjects, fetchCategories]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
  };

  if (status === 'loading') {
    return (
      <AdminPageContainer>
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </AdminPageContainer>
    );
  }

  return (
    <AdminPageContainer>
      <AdminPageHeader 
        title="Portfolio Management"
        description="Manage your portfolio projects and categories"
      />

      <Tabs defaultValue="projects" className="space-y-6">
        <TabsList className="grid w-full max-w-md grid-cols-2 bg-white/70 backdrop-blur-sm border border-white/20">
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
        </TabsList>

        {/* Projects Tab */}
        <TabsContent value="projects" className="space-y-6">
          {/* Controls */}
          <Card className="bg-white/70 backdrop-blur-sm border-white/20 shadow-lg">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                <div className="flex flex-col sm:flex-row gap-4 flex-1">
                  <form onSubmit={handleSearch} className="flex gap-2">
                    <Input
                      type="text"
                      placeholder="Search projects..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="w-64"
                    />
                    <Button type="submit" variant="outline">
                      <Search className="w-4 h-4" />
                    </Button>
                  </form>

                  <div className="flex gap-2">
                    <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder="Filter by category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.slug}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Select value={publishedFilter} onValueChange={setPublishedFilter}>
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="true">Published</SelectItem>
                        <SelectItem value="false">Draft</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Link href="/admin/portfolio/projects/new">
                  <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transition-all duration-200">
                    <Plus className="w-4 h-4 mr-2" />
                    New Project
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Projects Grid */}
          <Card className="bg-white/70 backdrop-blur-sm border-white/20 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Folder className="w-5 h-5 mr-2" />
                Projects ({pagination.total})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-4 text-gray-600">Loading projects...</p>
                </div>
              ) : projects.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <ImageIcon className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No projects found</h3>
                  <p className="text-gray-500 mb-6">
                    {search || categoryFilter !== 'all' || publishedFilter !== 'all'
                      ? 'Try adjusting your search or filters.'
                      : 'Get started by creating your first portfolio project.'
                    }
                  </p>
                  <Link href="/admin/portfolio/projects/new">
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Create your first project
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {projects.map((project) => (
                    <Card key={project.id} className="group hover:shadow-lg transition-shadow">
                      <div className="relative">
                        {project.featured_image_url ? (
                          <div className="relative h-48 w-full">
                            <Image
                              src={project.featured_image_url}
                              alt={project.featured_image_alt || project.title}
                              fill
                              className="object-cover rounded-t-lg"
                            />
                          </div>
                        ) : (
                          <div className="h-48 bg-gray-100 rounded-t-lg flex items-center justify-center">
                            <ImageIcon className="w-12 h-12 text-gray-400" />
                          </div>
                        )}
                        
                        <div className="absolute top-2 right-2 flex gap-2">
                          <Badge variant={project.published ? 'default' : 'secondary'}>
                            {project.published ? (
                              <><Eye className="w-3 h-3 mr-1" /> Published</>
                            ) : (
                              <><EyeOff className="w-3 h-3 mr-1" /> Draft</>
                            )}
                          </Badge>
                        </div>
                      </div>

                      <CardContent className="p-4">
                        <div className="space-y-2">
                          <h3 className="font-semibold text-lg truncate">{project.title}</h3>
                          
                          {project.category_name && (
                            <Badge variant="outline" className="text-xs">
                              {project.category_name}
                            </Badge>
                          )}
                          
                          {project.client_name && (
                            <p className="text-sm text-gray-600">Client: {project.client_name}</p>
                          )}
                          
                          <p className="text-sm text-gray-600">
                            {truncateText(project.short_description || project.description, 100)}
                          </p>
                          
                          <div className="text-xs text-gray-500">
                            Created: {formatDate(project.created_at)}
                          </div>
                        </div>

                        <div className="flex justify-between items-center mt-4 pt-4 border-t">
                          <div className="text-sm text-gray-500">
                            Order: {project.sort_order}
                          </div>
                          <div className="flex gap-2">
                            <Link href={`/admin/portfolio/projects/${project.id}/edit`}>
                              <Button variant="outline" size="sm">
                                <Edit3 className="w-4 h-4" />
                              </Button>
                            </Link>
                            <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-8">
                  <Button
                    variant="outline"
                    disabled={!pagination.hasPrev}
                    onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                  >
                    Previous
                  </Button>
                  <span className="text-sm text-gray-600">
                    Page {pagination.page} of {pagination.totalPages}
                  </span>
                  <Button
                    variant="outline"
                    disabled={!pagination.hasNext}
                    onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                  >
                    Next
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Categories Tab */}
        <TabsContent value="categories" className="space-y-6">
          <Card className="bg-white/70 backdrop-blur-sm border-white/20 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center">
                <Settings className="w-5 h-5 mr-2" />
                Portfolio Categories
              </CardTitle>
              <Dialog open={isCreateCategoryOpen} onOpenChange={setIsCreateCategoryOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transition-all duration-200">
                    <Plus className="w-4 h-4 mr-2" />
                    New Category
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New Category</DialogTitle>
                    <DialogDescription>
                      Add a new category to organize your portfolio projects.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="categoryName">Category Name</Label>
                      <Input
                        id="categoryName"
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                        placeholder="Enter category name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="categoryDescription">Description (Optional)</Label>
                      <Textarea
                        id="categoryDescription"
                        value={newCategoryDescription}
                        onChange={(e) => setNewCategoryDescription(e.target.value)}
                        placeholder="Enter category description"
                        rows={3}
                      />
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setIsCreateCategoryOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={createCategory} disabled={categorySubmitting}>
                        {categorySubmitting ? 'Creating...' : 'Create Category'}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              {categoriesLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-4 text-gray-600">Loading categories...</p>
                </div>
              ) : categories.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">No categories found.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {categories.map((category) => (
                    <div
                      key={category.id}
                      className="flex items-center justify-between p-4 border border-white/20 rounded-lg hover:bg-gray-50/50 transition-colors"
                    >
                      <div>
                        <h3 className="font-medium">{category.name}</h3>
                        <p className="text-sm text-gray-600">{category.description}</p>
                        <div className="text-xs text-gray-500 mt-1">
                          {category.project_count} projects • Created {formatDate(category.created_at)}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Edit3 className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm" className="text-red-600">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </AdminPageContainer>
  );
} 