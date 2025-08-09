"use client";

import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import { 
  Plus, 
  Search, 
  FileText, 
  Edit, 
  Trash2, 
  Eye,
  Calendar,
  User,
  CheckSquare,
  Square,
  MoreHorizontal
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import AdminPageContainer from "@/components/admin/AdminPageContainer";
import AdminPageHeader from "@/components/admin/AdminPageHeader";

interface Post {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  published: boolean;
  published_at?: number;
  created_at: number;
  updated_at: number;
  author_name: string;
}

interface PostsResponse {
  posts: Post[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export default function PostsPage() {
  const { status } = useSession();
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false,
  });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [publishedFilter, setPublishedFilter] = useState<string>("all");
  const [selectedPosts, setSelectedPosts] = useState<number[]>([]);
  const [bulkLoading, setBulkLoading] = useState(false);

  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
      });

      if (search) {
        params.append("search", search);
      }

      if (publishedFilter !== "all") {
        params.append("published", publishedFilter);
      }

      const response = await fetch(`/api/admin/posts?${params}`);
      if (response.ok) {
        const data: PostsResponse = await response.json();
        setPosts(data.posts);
        setPagination(data.pagination);
      } else {
        console.error("Failed to fetch posts");
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, search, publishedFilter]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/admin/login");
    } else if (status === "authenticated") {
      fetchPosts();
    }
  }, [status, router, pagination.page, search, publishedFilter, fetchPosts]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPagination(prev => ({ ...prev, page: 1 }));
    fetchPosts();
  };

  const handleFilterChange = (filter: string) => {
    setPublishedFilter(filter);
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleSelectPost = (postId: number, checked: boolean) => {
    if (checked) {
      setSelectedPosts(prev => [...prev, postId]);
    } else {
      setSelectedPosts(prev => prev.filter(id => id !== postId));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedPosts(posts.map(post => post.id));
    } else {
      setSelectedPosts([]);
    }
  };

  const handleBulkAction = async (action: "delete" | "publish" | "unpublish") => {
    if (selectedPosts.length === 0) return;

    const confirmed = window.confirm(
      `Are you sure you want to ${action} ${selectedPosts.length} selected post(s)?`
    );

    if (!confirmed) return;

    try {
      setBulkLoading(true);

      if (action === "delete") {
        // Delete posts one by one
        for (const postId of selectedPosts) {
          await fetch(`/api/admin/posts/${postId}`, {
            method: "DELETE",
          });
        }
      } else {
        // Update publish status
        const published = action === "publish";
        for (const postId of selectedPosts) {
          const post = posts.find(p => p.id === postId);
          if (post) {
            await fetch(`/api/admin/posts/${postId}`, {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                ...post,
                published,
              }),
            });
          }
        }
      }

      setSelectedPosts([]);
      fetchPosts();
    } catch (error) {
      console.error(`Error performing bulk ${action}:`, error);
    } finally {
      setBulkLoading(false);
    }
  };

  const formatDate = (timestamp: number) => {
    return format(new Date(timestamp * 1000), "MMM d, yyyy 'at' h:mm a");
  };

  if (loading && posts.length === 0) {
    return (
      <AdminPageContainer>
        <AdminPageHeader 
          title="Blog Posts"
          description="Create and manage your blog content"
        />
        
        <Card className="bg-white/70 backdrop-blur-sm border-white/20 shadow-lg">
          <CardContent className="p-6">
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4 p-4 border border-gray-200/50 rounded animate-pulse">
                  <div className="w-4 h-4 bg-gray-200 rounded"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                  </div>
                  <div className="h-3 bg-gray-200 rounded w-20"></div>
                  <div className="h-3 bg-gray-200 rounded w-24"></div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </AdminPageContainer>
    );
  }

  return (
    <AdminPageContainer>
      <AdminPageHeader 
        title="Blog Posts"
        description="Create and manage your blog content"
      >
        <Link href="/admin/posts/new">
          <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transition-all duration-200">
            <Plus className="w-4 h-4 mr-2" />
            New Post
          </Button>
        </Link>
      </AdminPageHeader>

      {/* Search and Filters */}
      <Card className="bg-white/70 backdrop-blur-sm border-white/20 shadow-lg">
        <CardContent className="p-6">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4 items-end">
            <div className="flex-1">
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                Search posts
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  id="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by title or content..."
                  className="pl-10"
                />
              </div>
            </div>
            <div className="min-w-[160px]">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <Select value={publishedFilter} onValueChange={handleFilterChange}>
                <SelectTrigger>
                  <SelectValue placeholder="All Posts" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Posts</SelectItem>
                  <SelectItem value="true">Published</SelectItem>
                  <SelectItem value="false">Draft</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" variant="outline">
              <Search className="w-4 h-4 mr-2" />
              Search
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      {selectedPosts.length > 0 && (
        <Card className="bg-blue-50/70 backdrop-blur-sm border-blue-200/50 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-blue-800">
                {selectedPosts.length} post(s) selected
              </span>
              <div className="flex gap-2">
                <Button
                  onClick={() => handleBulkAction("publish")}
                  disabled={bulkLoading}
                  size="sm"
                  className="bg-green-600 hover:bg-green-700"
                >
                  Publish
                </Button>
                <Button
                  onClick={() => handleBulkAction("unpublish")}
                  disabled={bulkLoading}
                  size="sm"
                  className="bg-yellow-600 hover:bg-yellow-700"
                >
                  Unpublish
                </Button>
                <Button
                  onClick={() => handleBulkAction("delete")}
                  disabled={bulkLoading}
                  size="sm"
                  variant="destructive"
                >
                  Delete
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Posts List */}
      <Card className="bg-white/70 backdrop-blur-sm border-white/20 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="w-5 h-5 mr-2" />
            Posts ({pagination.total})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {posts.length === 0 && !loading ? (
            <div className="text-center py-12 text-gray-500">
              <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No posts found</h3>
              <p className="text-gray-500 mb-6">
                {search || publishedFilter !== "all" 
                  ? "Try adjusting your search or filters."
                  : "Get started by creating your first blog post."
                }
              </p>
              <Link href="/admin/posts/new">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Create your first post
                </Button>
              </Link>
            </div>
          ) : (
            <div className="overflow-hidden">
              <div className="px-6 py-3 bg-gray-50/50 border-b border-gray-200/50 flex items-center">
                <div className="flex items-center">
                  <button
                    onClick={() => handleSelectAll(!selectedPosts.length || selectedPosts.length !== posts.length)}
                    className="mr-4"
                  >
                    {selectedPosts.length === posts.length && posts.length > 0 ? (
                      <CheckSquare className="w-5 h-5 text-blue-600" />
                    ) : (
                      <Square className="w-5 h-5 text-gray-400" />
                    )}
                  </button>
                  <span className="text-sm font-medium text-gray-700">
                    {selectedPosts.length > 0 ? `${selectedPosts.length} selected` : 'Select all'}
                  </span>
                </div>
              </div>
              
              <div className="divide-y divide-gray-200/50">
                {posts.map((post) => (
                  <div key={post.id} className="px-6 py-4 hover:bg-gray-50/50 transition-colors">
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={() => handleSelectPost(post.id, !selectedPosts.includes(post.id))}
                      >
                        {selectedPosts.includes(post.id) ? (
                          <CheckSquare className="w-5 h-5 text-blue-600" />
                        ) : (
                          <Square className="w-5 h-5 text-gray-400" />
                        )}
                      </button>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="text-lg font-medium text-gray-900 truncate">
                              {post.title}
                            </h3>
                            <p className="text-sm text-gray-500 mt-1">/{post.slug}</p>
                            <div className="flex items-center mt-2 space-x-4 text-sm text-gray-500">
                              <div className="flex items-center">
                                <User className="w-4 h-4 mr-1" />
                                {post.author_name}
                              </div>
                              <div className="flex items-center">
                                <Calendar className="w-4 h-4 mr-1" />
                                {post.published && post.published_at
                                  ? formatDate(post.published_at)
                                  : formatDate(post.created_at)}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-4 ml-4">
                            <Badge 
                              variant={post.published ? "default" : "secondary"}
                              className={post.published ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}
                            >
                              {post.published ? "Published" : "Draft"}
                            </Badge>
                            
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem asChild>
                                  <Link href={`/admin/posts/${post.id}/edit`} className="flex items-center">
                                    <Edit className="w-4 h-4 mr-2" />
                                    Edit
                                  </Link>
                                </DropdownMenuItem>
                                {post.published && (
                                  <DropdownMenuItem asChild>
                                    <a href={`/news/${post.slug}`} target="_blank" className="flex items-center">
                                      <Eye className="w-4 h-4 mr-2" />
                                      View
                                    </a>
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuItem 
                                  className="text-red-600"
                                  onClick={() => {
                                    if (window.confirm("Are you sure you want to delete this post?")) {
                                      handleBulkAction("delete");
                                      setSelectedPosts([post.id]);
                                    }
                                  }}
                                >
                                  <Trash2 className="w-4 h-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <Card className="bg-white/70 backdrop-blur-sm border-white/20 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing {((pagination.page - 1) * pagination.limit) + 1} to{" "}
                {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} posts
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!pagination.hasPrev}
                  onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!pagination.hasNext}
                  onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                >
                  Next
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </AdminPageContainer>
  );
} 