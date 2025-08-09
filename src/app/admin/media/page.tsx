'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { 
  Upload, 
  Image as ImageIcon, 
  FileText, 
  Video, 
  Search, 
  Trash2, 
  Edit3,
  FolderOpen,
  Calendar,
  HardDrive,
  Eye,
  RefreshCw
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
import ImageUploader from '@/components/admin/ImageUploader';

interface MediaItem {
  id: number;
  filename: string;
  original_filename: string;
  mime_type: string;
  size: number;
  width?: number;
  height?: number;
  url: string;
  alt_text?: string;
  created_at: number;
  updated_at: number;
  uploaded_by: number;
  uploaded_by_name?: string;
}

interface MediaResponse {
  data: MediaItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export default function MediaPage() {
  const [selectedTab, setSelectedTab] = useState('all');
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0
  });
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  // Auto-sync media with R2 bucket (silent operation)
  const autoSyncMedia = useCallback(async () => {
    try {
      const response = await fetch('/api/admin/media/sync', {
        method: 'POST'
      });

      if (response.ok) {
        const result = await response.json() as { 
          message: string; 
          checked: number; 
          removed: number; 
          errors: number 
        };
        
        // Only show notification if records were actually removed
        if (result.removed > 0) {
          toast.info(`Auto-sync: Removed ${result.removed} orphaned media record(s)`);
          return true; // Indicates that data changed
        }
      }
      return false; // No changes
    } catch (error) {
      console.error('Auto-sync failed (silent):', error);
      return false;
    }
  }, []);

  // Fetch media data
  const fetchMedia = useCallback(async (skipAutoSync = false) => {
    try {
      setLoading(true);
      
      // Run auto-sync first if not skipped
      if (!skipAutoSync) {
        await autoSyncMedia();
      }

      const params = new URLSearchParams({
        page: page.toString(),
        limit: '20',
        search: searchTerm,
        type: selectedTab === 'all' ? '' : selectedTab === 'images' ? 'image' : selectedTab
      });

      const response = await fetch(`/api/admin/media?${params}`);
      if (!response.ok) throw new Error('Failed to fetch media');
      
      const result: MediaResponse = await response.json();
      setMedia(result.data);
      setPagination(result.pagination);
    } catch (error) {
      console.error('Error fetching media:', error);
      toast.error('Failed to load media');
    } finally {
      setLoading(false);
    }
  }, [page, searchTerm, selectedTab, autoSyncMedia]);



  // Update media
  const updateMedia = async (id: number, altText: string) => {
    try {
      const response = await fetch(`/api/admin/media/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ alt_text: altText })
      });

      if (!response.ok) throw new Error('Failed to update media');
      
      toast.success('Media updated successfully');
      setIsEditDialogOpen(false);
      setSelectedMedia(null);
      fetchMedia();
    } catch (error) {
      console.error('Error updating media:', error);
      toast.error('Failed to update media');
    }
  };

  // Delete media
  const deleteMedia = async (id: number) => {
    try {
      const response = await fetch(`/api/admin/media/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        const errorData = await response.json() as { error?: string };
        throw new Error(errorData.error || 'Delete failed');
      }

      toast.success('Media deleted successfully');
      // Auto-sync after delete to check for any other orphaned records
      fetchMedia(); // This will trigger auto-sync
    } catch (error: unknown) {
      console.error('Error deleting media:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete media';
      toast.error(errorMessage);
    }
  };

  // Manual sync media with R2 bucket
  const syncMedia = async () => {
    try {
      toast.loading('Syncing media with R2 bucket...');
      const response = await fetch('/api/admin/media/sync', {
        method: 'POST'
      });

      if (!response.ok) {
        const errorData = await response.json() as { error?: string };
        throw new Error(errorData.error || 'Sync failed');
      }

      const result = await response.json() as { 
        message: string; 
        checked: number; 
        removed: number; 
        errors: number 
      };
      
      toast.success(result.message);
      
      // Refresh the media list if any records were removed, skip auto-sync since we just did manual sync
      if (result.removed > 0) {
        fetchMedia(true); // Skip auto-sync
      }
    } catch (error: unknown) {
      console.error('Error syncing media:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to sync media';
      toast.error(errorMessage);
    }
  };

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Get media type icon
  const getMediaIcon = (mimeType: string) => {
    if (mimeType.startsWith('image/')) return <ImageIcon className="h-6 w-6" />;
    if (mimeType.startsWith('video/')) return <Video className="h-6 w-6" />;
    return <FileText className="h-6 w-6" />;
  };

  // Get media type badge
  const getMediaTypeBadge = (mimeType: string) => {
    if (mimeType.startsWith('image/')) return <Badge variant="secondary" className="bg-blue-100 text-blue-800">Image</Badge>;
    if (mimeType.startsWith('video/')) return <Badge variant="secondary" className="bg-purple-100 text-purple-800">Video</Badge>;
    return <Badge variant="secondary" className="bg-gray-100 text-gray-800">Document</Badge>;
  };

  // Format date
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Filter media by type
  const filteredMedia = media.filter(item => {
    if (selectedTab === 'all') return true;
    if (selectedTab === 'images') return item.mime_type.startsWith('image/');
    if (selectedTab === 'videos') return item.mime_type.startsWith('video/');
    if (selectedTab === 'documents') return !item.mime_type.startsWith('image/') && !item.mime_type.startsWith('video/');
    return true;
  });

  useEffect(() => {
    fetchMedia();
  }, [fetchMedia]);

  // Set up periodic background sync (every 5 minutes)
  useEffect(() => {
    const interval = setInterval(async () => {
      // Only run background sync if user is active and page is visible
      if (!document.hidden) {
        try {
          const dataChanged = await autoSyncMedia();
          // If data changed, refresh the view silently
          if (dataChanged) {
            fetchMedia(true); // Skip auto-sync since we just did it
          }
        } catch (error) {
          // Silent fail for background sync
          console.warn('Background sync failed:', error);
        }
      }
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(interval);
  }, [autoSyncMedia, fetchMedia]);

  if (loading && media.length === 0) {
    return (
      <AdminPageContainer>
        <AdminPageHeader 
          title="Media Library"
          description="Manage your images, documents, and other media files"
        />
        
        <Card className="bg-white/70 backdrop-blur-sm border-white/20 shadow-lg">
          <CardContent className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="aspect-square bg-gray-200 rounded-lg animate-pulse"></div>
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
        title="Media Library"
        description="Manage your images, documents, and other media files"
      >
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <HardDrive className="w-4 h-4" />
            <span>{pagination.total} files</span>
          </div>
          <Button 
            variant="outline"
            onClick={syncMedia}
            className="flex items-center space-x-2"
            title="Manual sync: Auto-sync runs on page load, after uploads/deletes, and every 5 minutes in background"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Sync</span>
          </Button>
          <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 shadow-lg hover:shadow-xl transition-all duration-200">
                <Upload className="h-4 w-4 mr-2" />
                Upload Media
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Upload Media</DialogTitle>
                <DialogDescription>
                  Select an image file to upload to your media library.
                </DialogDescription>
              </DialogHeader>
              <UploadForm onUploadComplete={() => {
                setIsUploadDialogOpen(false);
                fetchMedia(); // This will trigger auto-sync
              }} />
            </DialogContent>
          </Dialog>
        </div>
      </AdminPageHeader>

      {/* Search and Filter */}
      <Card className="bg-white/70 backdrop-blur-sm border-white/20 shadow-lg">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4 items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search media
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by filename or alt text..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              {[
                { id: 'all', label: 'All Files', icon: FolderOpen },
                { id: 'images', label: 'Images', icon: ImageIcon },
                { id: 'videos', label: 'Videos', icon: Video },
                { id: 'documents', label: 'Documents', icon: FileText }
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <Button
                    key={tab.id}
                    variant={selectedTab === tab.id ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedTab(tab.id)}
                    className="flex items-center space-x-2"
                  >
                    <Icon className="w-4 h-4" />
                    <span className="hidden sm:inline">{tab.label}</span>
                  </Button>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Media Grid */}
      <Card className="bg-white/70 backdrop-blur-sm border-white/20 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center">
            <FolderOpen className="w-5 h-5 mr-2" />
            Media Files ({filteredMedia.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredMedia.length === 0 && !loading ? (
            <div className="text-center py-12 text-gray-500">
              <ImageIcon className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No media files found</h3>
              <p className="text-gray-500 mb-6">
                {searchTerm 
                  ? "Try adjusting your search terms."
                  : "Upload your first media file to get started."
                }
              </p>
              <Button onClick={() => setIsUploadDialogOpen(true)} className="gap-2">
                <Upload className="h-4 w-4" />
                Upload Media
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {filteredMedia.map((item) => (
                <Card key={item.id} className="group hover:shadow-lg transition-all duration-300 border-gray-200/50">
                  <CardContent className="p-0">
                    <div className="aspect-square relative overflow-hidden rounded-t-lg bg-gray-50">
                      {item.mime_type.startsWith('image/') ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img 
                          src={item.url} 
                          alt={item.alt_text || item.original_filename}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                          {getMediaIcon(item.mime_type)}
                        </div>
                      )}
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                        <Button
                          size="sm"
                          variant="secondary"
                          className="h-8 w-8 p-0 shadow-lg bg-white/90 hover:bg-white"
                          onClick={() => window.open(item.url, '_blank')}
                        >
                          <Eye className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="secondary"
                          className="h-8 w-8 p-0 shadow-lg bg-white/90 hover:bg-white"
                          onClick={() => {
                            setSelectedMedia(item);
                            setIsEditDialogOpen(true);
                          }}
                        >
                          <Edit3 className="h-3 w-3" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="destructive"
                              className="h-8 w-8 p-0 shadow-lg"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Media File</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete &quot;{item.original_filename}&quot;? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => deleteMedia(item.id)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                    <div className="p-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium truncate flex-1" title={item.original_filename}>
                          {item.original_filename}
                        </p>
                        {getMediaTypeBadge(item.mime_type)}
                      </div>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{formatFileSize(item.size)}</span>
                        <div className="flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          {formatDate(item.created_at)}
                        </div>
                      </div>
                      {item.width && item.height && (
                        <p className="text-xs text-gray-500">
                          {item.width} × {item.height}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
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
                {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} files
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

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Media</DialogTitle>
            <DialogDescription>
              Update the alt text for this media item.
            </DialogDescription>
          </DialogHeader>
          {selectedMedia && (
            <EditMediaForm
              media={selectedMedia}
              onUpdate={updateMedia}
              onCancel={() => {
                setIsEditDialogOpen(false);
                setSelectedMedia(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </AdminPageContainer>
  );
}

// Upload Form Component  
function UploadForm({ onUploadComplete }: { onUploadComplete: () => void }) {
  const handleUploadComplete = async () => {
    // Trigger parent refresh which will include auto-sync
    onUploadComplete();
  };

  return (
    <div className="space-y-4">
      <ImageUploader 
        onUpload={handleUploadComplete}
        onError={(error) => toast.error(error)}
        maxSize={5}
        className="w-full"
      />
    </div>
  );
}

// Edit Media Form Component
function EditMediaForm({ 
  media, 
  onUpdate, 
  onCancel 
}: { 
  media: MediaItem; 
  onUpdate: (id: number, altText: string) => Promise<void>; 
  onCancel: () => void;
}) {
  const [altText, setAltText] = useState(media.alt_text || '');
  const [updating, setUpdating] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);
    try {
      await onUpdate(media.id, altText);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex gap-4">
        <div className="w-24 h-24 rounded-lg overflow-hidden bg-muted flex-shrink-0">
          {media.mime_type.startsWith('image/') ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img 
              src={media.url} 
              alt={media.alt_text || media.original_filename}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <FileText className="h-6 w-6 text-muted-foreground" />
            </div>
          )}
        </div>
        <div className="flex-1">
          <h4 className="font-medium">{media.original_filename}</h4>
          <p className="text-sm text-muted-foreground">
            {media.mime_type} • {Math.round(media.size / 1024)} KB
          </p>
        </div>
      </div>

      <div>
        <Label htmlFor="editAltText">Alt Text</Label>
        <Input
          id="editAltText"
          value={altText}
          onChange={(e) => setAltText(e.target.value)}
          placeholder="Describe the image for accessibility..."
        />
      </div>

      <div className="flex gap-2 justify-end">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={updating}>
          {updating ? 'Updating...' : 'Update'}
        </Button>
      </div>
    </form>
  );
}