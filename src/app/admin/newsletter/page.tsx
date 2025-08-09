'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Mail, 
  CheckCircle, 
  Search, 
  Trash2, 
  User,
  Calendar,
  Download,
  AlertCircle,
  UserCheck,
  UserX,
  Filter
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

interface NewsletterSubscriber {
  id: number;
  email: string;
  status: 'active' | 'unsubscribed' | 'bounced';
  subscribed_at: number;
  unsubscribed_at?: number;
  source: string;
}

interface SubscriberResponse {
  data: NewsletterSubscriber[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export default function NewsletterPage() {
  const [selectedTab, setSelectedTab] = useState('active');
  const [searchTerm, setSearchTerm] = useState('');
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0
  });
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [exporting, setExporting] = useState(false);

  // Fetch subscribers data
  const fetchSubscribers = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '20',
        search: searchTerm,
        status: selectedTab === 'all' ? 'all' : selectedTab
      });

      const response = await fetch(`/api/admin/newsletter?${params}`);
      if (!response.ok) throw new Error('Failed to fetch subscribers');
      
      const result: SubscriberResponse = await response.json();
      setSubscribers(result.data);
      setPagination(result.pagination);
    } catch (error) {
      console.error('Error fetching subscribers:', error);
      toast.error('Failed to load subscribers');
    } finally {
      setLoading(false);
    }
  }, [page, searchTerm, selectedTab]);

  // Update subscriber status
  const updateSubscriberStatus = async (id: number, newStatus: string) => {
    try {
      setActionLoading(id);
      const response = await fetch(`/api/admin/newsletter/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });

      if (!response.ok) throw new Error('Failed to update subscriber');
      
      toast.success(`Subscriber marked as ${newStatus}`);
      fetchSubscribers();
    } catch (error) {
      console.error('Error updating subscriber:', error);
      toast.error('Failed to update subscriber');
    } finally {
      setActionLoading(null);
    }
  };

  // Delete subscriber
  const deleteSubscriber = async (id: number) => {
    try {
      setActionLoading(id);
      const response = await fetch(`/api/admin/newsletter/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        const errorData = await response.json() as { error?: string };
        throw new Error(errorData.error || 'Delete failed');
      }

      toast.success('Subscriber deleted successfully');
      fetchSubscribers();
    } catch (error: unknown) {
      console.error('Error deleting subscriber:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete subscriber';
      toast.error(errorMessage);
    } finally {
      setActionLoading(null);
    }
  };

  // Export to CSV
  const exportToCSV = async () => {
    try {
      setExporting(true);
      const params = new URLSearchParams({
        export: 'csv',
        status: selectedTab === 'all' ? 'all' : selectedTab,
        search: searchTerm
      });

      const response = await fetch(`/api/admin/newsletter?${params}`);
      if (!response.ok) throw new Error('Failed to export data');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `newsletter-subscribers-${selectedTab}-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast.success('Subscribers exported successfully');
    } catch (error) {
      console.error('Error exporting subscribers:', error);
      toast.error('Failed to export subscribers');
    } finally {
      setExporting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            <CheckCircle className="h-3 w-3 mr-1" />
            Active
          </Badge>
        );
      case 'unsubscribed':
        return (
          <Badge variant="secondary" className="bg-gray-100 text-gray-800 hover:bg-gray-100">
            <UserX className="h-3 w-3 mr-1" />
            Unsubscribed
          </Badge>
        );
      case 'bounced':
        return (
          <Badge variant="destructive" className="bg-red-100 text-red-800 hover:bg-red-100">
            <AlertCircle className="h-3 w-3 mr-1" />
            Bounced
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary">
            {status}
          </Badge>
        );
    }
  };

  // Format date
  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  useEffect(() => {
    fetchSubscribers();
  }, [fetchSubscribers]);

  useEffect(() => {
    setPage(1);
  }, [selectedTab, searchTerm]);

  if (loading && subscribers.length === 0) {
    return (
      <AdminPageContainer>
        <AdminPageHeader 
          title="Newsletter Subscribers"
          description="Manage newsletter subscriptions and export subscriber lists"
        >
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Mail className="w-4 h-4" />
            <span>{pagination.total} total subscribers</span>
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
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
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
        title="Newsletter Subscribers"
        description="Manage newsletter subscriptions and export subscriber lists"
      >
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Mail className="w-4 h-4" />
            <span>{pagination.total} total subscribers</span>
          </div>
          <Button 
            onClick={exportToCSV}
            disabled={exporting}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Download className="w-4 h-4 mr-2" />
            {exporting ? 'Exporting...' : 'Export CSV'}
          </Button>
        </div>
      </AdminPageHeader>

      {/* Filters */}
      <Card className="bg-white/70 backdrop-blur-sm border-white/20 shadow-lg">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search by email address..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Card className="bg-white/70 backdrop-blur-sm border-white/20 shadow-lg">
        <CardContent className="p-6">
          <Tabs value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="unsubscribed">Unsubscribed</TabsTrigger>
              <TabsTrigger value="bounced">Bounced</TabsTrigger>
              <TabsTrigger value="all">All</TabsTrigger>
            </TabsList>

            <TabsContent value={selectedTab} className="mt-6">
              {loading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="p-4 border border-gray-200/50 rounded-lg animate-pulse">
                      <div className="flex items-start space-x-4">
                        <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                        <div className="flex-1">
                          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : subscribers.length === 0 ? (
                <div className="text-center py-12">
                  <Mail className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No subscribers found</h3>
                  <p className="text-gray-500">
                    {searchTerm ? 'Try adjusting your search terms.' : 'No newsletter subscriptions yet.'}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {subscribers.map((subscriber) => (
                    <div
                      key={subscriber.id}
                      className="p-4 border border-gray-200/50 rounded-lg hover:border-gray-300/50 transition-all duration-200 bg-white/50"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4 flex-1">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                            <User className="w-5 h-5 text-white" />
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-3 mb-2">
                              <h3 className="font-medium text-gray-900 truncate">
                                {subscriber.email}
                              </h3>
                              {getStatusBadge(subscriber.status)}
                            </div>
                            
                            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                              <div className="flex items-center">
                                <Calendar className="w-4 h-4 mr-1" />
                                Subscribed {formatDate(subscriber.subscribed_at)}
                              </div>
                              {subscriber.source && (
                                <div className="flex items-center">
                                  <Filter className="w-4 h-4 mr-1" />
                                  {subscriber.source}
                                </div>
                              )}
                            </div>

                            {subscriber.status === 'unsubscribed' && subscriber.unsubscribed_at && (
                              <p className="text-xs text-gray-500 mt-2">
                                Unsubscribed on {formatDate(subscriber.unsubscribed_at)}
                              </p>
                            )}
                          </div>

                          {/* Actions */}
                          <div className="flex items-center space-x-2 ml-4">
                            {subscriber.status === 'active' ? (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => updateSubscriberStatus(subscriber.id, 'unsubscribed')}
                                disabled={actionLoading === subscriber.id}
                                className="text-yellow-600 hover:text-yellow-800 hover:bg-yellow-50"
                              >
                                <UserX className="w-4 h-4 mr-1" />
                                Unsubscribe
                              </Button>
                            ) : (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => updateSubscriberStatus(subscriber.id, 'active')}
                                disabled={actionLoading === subscriber.id}
                                className="text-green-600 hover:text-green-800 hover:bg-green-50"
                              >
                                <UserCheck className="w-4 h-4 mr-1" />
                                Resubscribe
                              </Button>
                            )}
                            
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  disabled={actionLoading === subscriber.id}
                                  className="text-red-600 hover:text-red-800 hover:bg-red-50"
                                >
                                  <Trash2 className="w-4 h-4 mr-1" />
                                  Delete
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete Subscriber</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to permanently delete this subscriber? This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => deleteSubscriber(subscriber.id)}
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
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <Card className="bg-white/70 backdrop-blur-sm border-white/20 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing {((pagination.page - 1) * pagination.limit) + 1} to{" "}
                {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} subscribers
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