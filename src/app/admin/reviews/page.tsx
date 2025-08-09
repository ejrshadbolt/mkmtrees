'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { 
  Star, 
  MessageSquare, 
  CheckCircle, 
  Clock, 
  Search, 
  Trash2, 
  Check,
  X,
  User,
  Calendar
} from 'lucide-react';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import AdminPageContainer from '@/components/admin/AdminPageContainer';
import AdminPageHeader from '@/components/admin/AdminPageHeader';

interface ReviewItem {
  id: number;
  reviewer_name: string;
  reviewer_email?: string;
  reviewer_image_id?: number;
  reviewer_image_url?: string;
  rating: number;
  title?: string;
  content: string;
  approved: number;
  created_at: number;
  updated_at: number;
}

interface ReviewResponse {
  data: ReviewItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export default function ReviewsPage() {
  const [selectedTab, setSelectedTab] = useState('pending');
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0
  });
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  // Fetch reviews data
  const fetchReviews = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '20',
        search: searchTerm,
        status: selectedTab === 'all' ? '' : selectedTab
      });

      const response = await fetch(`/api/admin/reviews?${params}`);
      if (!response.ok) throw new Error('Failed to fetch reviews');
      
      const result: ReviewResponse = await response.json();
      setReviews(result.data);
      setPagination(result.pagination);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      toast.error('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  }, [page, searchTerm, selectedTab]);

  // Approve review
  const approveReview = async (id: number) => {
    try {
      setActionLoading(id);
      const response = await fetch(`/api/admin/reviews/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'approve' })
      });

      if (!response.ok) throw new Error('Failed to approve review');
      
      toast.success('Review approved successfully');
      fetchReviews();
    } catch (error) {
      console.error('Error approving review:', error);
      toast.error('Failed to approve review');
    } finally {
      setActionLoading(null);
    }
  };

  // Reject review
  const rejectReview = async (id: number) => {
    try {
      setActionLoading(id);
      const response = await fetch(`/api/admin/reviews/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'reject' })
      });

      if (!response.ok) throw new Error('Failed to reject review');
      
      toast.success('Review rejected successfully');
      fetchReviews();
    } catch (error) {
      console.error('Error rejecting review:', error);
      toast.error('Failed to reject review');
    } finally {
      setActionLoading(null);
    }
  };

  // Delete review
  const deleteReview = async (id: number) => {
    try {
      setActionLoading(id);
      const response = await fetch(`/api/admin/reviews/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        const errorData = await response.json() as { error?: string };
        throw new Error(errorData.error || 'Delete failed');
      }

      toast.success('Review deleted successfully');
      fetchReviews();
    } catch (error: unknown) {
      console.error('Error deleting review:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete review';
      toast.error(errorMessage);
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusBadge = (approved: number) => {
    if (approved === 1) {
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
        <CheckCircle className="w-3 h-3 mr-1" />
        Approved
      </Badge>;
    } else {
      return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
        <Clock className="w-3 h-3 mr-1" />
        Pending
      </Badge>;
    }
  };

  // Format date
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center space-x-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
          />
        ))}
        <span className="text-sm text-gray-600 ml-1">({rating})</span>
      </div>
    );
  };

  // Filter reviews by status
  const filteredReviews = reviews.filter(review => {
    if (selectedTab === 'all') return true;
    if (selectedTab === 'approved') return review.approved === 1;
    if (selectedTab === 'pending') return review.approved === 0;
    return true;
  });

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  if (loading && reviews.length === 0) {
    return (
      <AdminPageContainer>
        <AdminPageHeader 
          title="Reviews Management"
          description="Moderate and manage customer reviews and testimonials"
        >
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <MessageSquare className="w-4 h-4" />
            <span>{pagination.total} total reviews</span>
          </div>
        </AdminPageHeader>
        
        <Card className="bg-white/70 backdrop-blur-sm border-white/20 shadow-lg">
          <CardContent className="p-6">
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="p-4 border border-gray-200/50 rounded-lg animate-pulse">
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/6 mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    </div>
                  </div>
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
        title="Reviews Management"
        description="Moderate and manage customer reviews and testimonials"
      >
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <MessageSquare className="w-4 h-4" />
          <span>{pagination.total} total reviews</span>
        </div>
      </AdminPageHeader>

      {/* Search and Filter */}
      <Card className="bg-white/70 backdrop-blur-sm border-white/20 shadow-lg">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4 items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search reviews
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by reviewer name or content..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Button 
              variant="outline" 
              onClick={() => fetchReviews()}
              disabled={loading}
            >
              <Search className="w-4 h-4 mr-2" />
              Search
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
        <TabsList className="grid w-full max-w-md grid-cols-3 bg-white/70 backdrop-blur-sm border border-white/20">
          <TabsTrigger value="pending" className="flex items-center space-x-2">
            <Clock className="w-4 h-4" />
            <span>Pending</span>
          </TabsTrigger>
          <TabsTrigger value="approved" className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4" />
            <span>Approved</span>
          </TabsTrigger>
          <TabsTrigger value="all" className="flex items-center space-x-2">
            <MessageSquare className="w-4 h-4" />
            <span>All</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value={selectedTab} className="space-y-4">
          {filteredReviews.length === 0 && !loading ? (
            <Card className="bg-white/70 backdrop-blur-sm border-white/20 shadow-lg">
              <CardContent className="p-12 text-center">
                <MessageSquare className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No reviews found
                </h3>
                <p className="text-gray-500">
                  {searchTerm 
                    ? "Try adjusting your search terms."
                    : selectedTab === 'pending' 
                      ? "All reviews have been moderated."
                      : selectedTab === 'approved'
                        ? "No reviews have been approved yet."
                        : "No reviews have been submitted yet."
                  }
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredReviews.map((review) => (
                <Card key={review.id} className="bg-white/70 backdrop-blur-sm border-white/20 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      {/* Avatar */}
                      <div className="flex-shrink-0">
                        {review.reviewer_image_url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={review.reviewer_image_url}
                            alt={review.reviewer_name}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                            <User className="w-6 h-6 text-white" />
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h3 className="font-medium text-gray-900">
                                {review.reviewer_name}
                              </h3>
                              {getStatusBadge(review.approved)}
                            </div>
                            
                            <div className="flex items-center space-x-4 mb-3 text-sm text-gray-500">
                              {renderStars(review.rating)}
                              <div className="flex items-center">
                                <Calendar className="w-4 h-4 mr-1" />
                                {formatDate(review.created_at)}
                              </div>
                            </div>

                            {review.title && (
                              <h4 className="font-medium text-gray-900 mb-2">
                                {review.title}
                              </h4>
                            )}

                            <p className="text-gray-700 leading-relaxed">
                              {review.content}
                            </p>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center space-x-2 ml-4">
                            {review.approved === 0 && (
                              <>
                                <Button
                                  size="sm"
                                  onClick={() => approveReview(review.id)}
                                  disabled={actionLoading === review.id}
                                  className="bg-green-600 hover:bg-green-700"
                                >
                                  <Check className="w-4 h-4 mr-1" />
                                  Approve
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => rejectReview(review.id)}
                                  disabled={actionLoading === review.id}
                                >
                                  <X className="w-4 h-4 mr-1" />
                                  Reject
                                </Button>
                              </>
                            )}
                            
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="text-red-600 hover:text-red-800 hover:bg-red-50"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete Review</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete this review? This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => deleteReview(review.id)}
                                    className="bg-red-600 hover:bg-red-700"
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <Card className="bg-white/70 backdrop-blur-sm border-white/20 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing {((pagination.page - 1) * pagination.limit) + 1} to{" "}
                {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} reviews
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={pagination.page <= 1}
                  onClick={() => setPage(prev => Math.max(1, prev - 1))}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={pagination.page >= pagination.totalPages}
                  onClick={() => setPage(prev => Math.min(pagination.totalPages, prev + 1))}
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