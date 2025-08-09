'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Mail, 
  CheckCircle, 
  Clock, 
  Search, 
  Trash2, 
  User,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Archive,
  ExternalLink
} from 'lucide-react';
import { Input } from '@/components/ui/input';
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

interface SubmissionItem {
  id: number;
  name: string;
  email: string;
  subject?: string;
  message: string;
  created_at: number;
  processed: number;
  processed_at?: number;
}

interface SubmissionResponse {
  data: SubmissionItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export default function SubmissionsPage() {
  const [selectedTab, setSelectedTab] = useState('unprocessed');
  const [searchTerm, setSearchTerm] = useState('');
  const [submissions, setSubmissions] = useState<SubmissionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0
  });
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  // Fetch submissions data
  const fetchSubmissions = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '20',
        search: searchTerm,
        processed: selectedTab === 'all' ? '' : selectedTab === 'processed' ? 'true' : 'false'
      });

      const response = await fetch(`/api/admin/submissions?${params}`);
      if (!response.ok) throw new Error('Failed to fetch submissions');
      
      const result: SubmissionResponse = await response.json();
      setSubmissions(result.data);
      setPagination(result.pagination);
    } catch (error) {
      console.error('Error fetching submissions:', error);
      toast.error('Failed to load submissions');
    } finally {
      setLoading(false);
    }
  }, [page, searchTerm, selectedTab]);

  // Toggle processed status
  const toggleProcessed = async (id: number, currentProcessed: boolean) => {
    try {
      setActionLoading(id);
      const response = await fetch(`/api/admin/submissions/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ processed: !currentProcessed })
      });

      if (!response.ok) throw new Error('Failed to update submission');
      
      toast.success(`Submission marked as ${!currentProcessed ? 'processed' : 'unprocessed'}`);
      fetchSubmissions();
    } catch (error) {
      console.error('Error updating submission:', error);
      toast.error('Failed to update submission');
    } finally {
      setActionLoading(null);
    }
  };

  // Delete submission
  const deleteSubmission = async (id: number) => {
    try {
      setActionLoading(id);
      const response = await fetch(`/api/admin/submissions/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        const errorData = await response.json() as { error?: string };
        throw new Error(errorData.error || 'Delete failed');
      }

      toast.success('Submission deleted successfully');
      fetchSubmissions();
    } catch (error: unknown) {
      console.error('Error deleting submission:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete submission';
      toast.error(errorMessage);
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusBadge = (processed: number) => {
    return processed === 1 ? (
      <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
        <CheckCircle className="h-3 w-3 mr-1" />
        Processed
      </Badge>
    ) : (
      <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
        <Clock className="h-3 w-3 mr-1" />
        Unprocessed
      </Badge>
    );
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

  // Filter submissions by status
  const filteredSubmissions = submissions.filter(submission => {
    if (selectedTab === 'all') return true;
    if (selectedTab === 'processed') return submission.processed === 1;
    if (selectedTab === 'unprocessed') return submission.processed === 0;
    return true;
  });

  useEffect(() => {
    fetchSubmissions();
  }, [fetchSubmissions]);

  if (loading && submissions.length === 0) {
    return (
      <AdminPageContainer>
        <AdminPageHeader 
          title="Form Submissions"
          description="View and manage contact form submissions from your website"
        >
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Mail className="w-4 h-4" />
            <span>{pagination.total} total submissions</span>
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
        title="Form Submissions"
        description="View and manage contact form submissions from your website"
      >
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <Mail className="w-4 h-4" />
          <span>{pagination.total} total submissions</span>
        </div>
      </AdminPageHeader>

      {/* Search and Filter */}
      <Card className="bg-white/70 backdrop-blur-sm border-white/20 shadow-lg">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4 items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search submissions
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by name, email, subject, or message..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Button 
              variant="outline" 
              onClick={() => fetchSubmissions()}
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
          <TabsTrigger value="unprocessed" className="flex items-center space-x-2">
            <AlertCircle className="w-4 h-4" />
            <span>Unprocessed</span>
          </TabsTrigger>
          <TabsTrigger value="processed" className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>Processed</span>
          </TabsTrigger>
          <TabsTrigger value="all" className="flex items-center space-x-2">
            <Mail className="w-4 h-4" />
            <span>All</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value={selectedTab} className="space-y-4">
          {filteredSubmissions.length === 0 && !loading ? (
            <Card className="bg-white/70 backdrop-blur-sm border-white/20 shadow-lg">
              <CardContent className="p-12 text-center">
                <Mail className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No submissions found
                </h3>
                <p className="text-gray-500">
                  {searchTerm 
                    ? "Try adjusting your search terms."
                    : selectedTab === 'unprocessed' 
                      ? "All submissions have been processed."
                      : selectedTab === 'processed'
                        ? "No submissions have been processed yet."
                        : "No form submissions have been received yet."
                  }
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredSubmissions.map((submission) => (
                <Card key={submission.id} className="bg-white/70 backdrop-blur-sm border-white/20 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      {/* Avatar */}
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                          <User className="w-6 h-6 text-white" />
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h3 className="font-medium text-gray-900">
                                {submission.name}
                              </h3>
                              {getStatusBadge(submission.processed)}
                            </div>
                            
                            <div className="flex items-center space-x-4 mb-3 text-sm text-gray-500">
                              <div className="flex items-center">
                                <Mail className="w-4 h-4 mr-1" />
                                <a 
                                  href={`mailto:${submission.email}`}
                                  className="text-blue-600 hover:text-blue-800 hover:underline"
                                >
                                  {submission.email}
                                </a>
                              </div>
                              <div className="flex items-center">
                                <Calendar className="w-4 h-4 mr-1" />
                                {formatDate(submission.created_at)}
                              </div>
                            </div>

                            {submission.subject && (
                              <h4 className="font-medium text-gray-900 mb-2">
                                Subject: {submission.subject}
                              </h4>
                            )}

                            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                                {submission.message}
                              </p>
                            </div>

                            {submission.processed === 1 && submission.processed_at && (
                              <p className="text-xs text-gray-500 mt-2">
                                Processed on {formatDate(submission.processed_at)}
                              </p>
                            )}
                          </div>

                          {/* Actions */}
                          <div className="flex items-center space-x-2 ml-4">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => toggleProcessed(submission.id, submission.processed === 1)}
                              disabled={actionLoading === submission.id}
                              className={submission.processed === 0 
                                ? "text-green-600 hover:text-green-800 hover:bg-green-50" 
                                : "text-yellow-600 hover:text-yellow-800 hover:bg-yellow-50"
                              }
                            >
                              {submission.processed === 0 ? (
                                <>
                                  <CheckCircle2 className="w-4 h-4 mr-1" />
                                  Mark as Processed
                                </>
                              ) : (
                                <>
                                  <Archive className="w-4 h-4 mr-1" />
                                  Mark as Unprocessed
                                </>
                              )}
                            </Button>
                            
                            <Button
                              size="sm"
                              variant="outline"
                              asChild
                              className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                            >
                              <a href={`mailto:${submission.email}?subject=Re: ${submission.subject || 'Your message'}`}>
                                <ExternalLink className="w-4 h-4 mr-1" />
                                Reply
                              </a>
                            </Button>
                            
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
                                  <AlertDialogTitle>Delete Submission</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete this submission? This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => deleteSubmission(submission.id)}
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
                {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} submissions
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