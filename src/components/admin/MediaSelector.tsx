"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { 
  X, 
  Search, 
  Grid3X3, 
  List, 
  ImageIcon,
  Download,
  Calendar,
  FileText,
  RefreshCw
} from "lucide-react";
import ImageUploader from "@/components/admin/ImageUploader";

interface MediaItem {
  id: number;
  url: string;
  alt_text: string;
  original_filename: string;
  created_at: string;
  file_size?: number;
  mime_type?: string;
}

interface MediaSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (media: MediaItem) => void;
  selectedId?: number | null;
  title?: string;
}

export default function MediaSelector({ 
  isOpen, 
  onClose, 
  onSelect, 
  selectedId,
  title = "Select Media" 
}: MediaSelectorProps) {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [activeTab, setActiveTab] = useState<"browse" | "upload">("browse");
  const [syncing, setSyncing] = useState(false);

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
        
        // Only log if records were actually removed
        if (result.removed > 0) {
          console.log(`MediaSelector auto-sync: Removed ${result.removed} orphaned media record(s)`);
          return true; // Indicates that data changed
        }
      }
      return false; // No changes
    } catch (error) {
      console.error('MediaSelector auto-sync failed (silent):', error);
      return false;
    }
  }, []);

  const fetchMediaItems = useCallback(async (skipAutoSync = false) => {
    try {
      setLoading(true);
      setError("");
      
      // Run auto-sync first if not skipped
      if (!skipAutoSync) {
        await autoSyncMedia();
      }
      
      const response = await fetch("/api/admin/media");
      
      if (response.ok) {
        const data = await response.json() as { media?: MediaItem[], data?: MediaItem[] };
        // Handle both response formats - newer API returns 'data', legacy returns 'media'
        const mediaArray = data.data || data.media || [];
        setMediaItems(mediaArray);
      } else {
        const errorData = await response.json() as { error?: string };
        setError(errorData.error || "Failed to load media");
      }
    } catch (error) {
      console.error("Error fetching media:", error);
      setError("Failed to load media");
    } finally {
      setLoading(false);
    }
  }, [autoSyncMedia]);

  useEffect(() => {
    if (isOpen) {
      fetchMediaItems();
    }
  }, [isOpen, fetchMediaItems]);

  const handleUploadSuccess = async (result: { id: number; url: string; alt_text?: string; original_filename: string; mime_type: string; size: number }) => {
    // Refresh media list to ensure we have the latest data
    await fetchMediaItems(true); // Skip auto-sync since we just uploaded
    
    // Switch to browse tab and select the uploaded media
    setActiveTab("browse");
    
    // Create media item for immediate selection
    const newMedia: MediaItem = {
      id: result.id,
      url: result.url,
      alt_text: result.alt_text || '',
      original_filename: result.original_filename,
      created_at: new Date().toISOString(),
      file_size: result.size,
      mime_type: result.mime_type
    };
    
    onSelect(newMedia);
  };

  // Manual sync media with R2 bucket
  const syncMedia = async () => {
    try {
      setSyncing(true);
      const response = await fetch('/api/admin/media/sync', {
        method: 'POST'
      });

      if (!response.ok) {
        throw new Error('Sync failed');
      }

      const result = await response.json() as { 
        message: string; 
        checked: number; 
        removed: number; 
        errors: number 
      };
      
      console.log(`Manual sync: ${result.message}`);
      
      // Refresh the media list if any records were removed
      if (result.removed > 0) {
        await fetchMediaItems(true); // Skip auto-sync since we just did manual sync
      }
    } catch (error) {
      console.error('Error syncing media:', error);
    } finally {
      setSyncing(false);
    }
  };

  const filteredMedia = mediaItems.filter(item =>
    item.original_filename.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.alt_text.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return "Unknown size";
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(1)} MB`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab("browse")}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "browse"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Browse Media
            </button>
            <button
              onClick={() => setActiveTab("upload")}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "upload"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Upload New
            </button>
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          {activeTab === "browse" ? (
            <>
              {/* Browse Tab Controls */}
              <div className="p-6 border-b bg-gray-50">
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                  {/* Search and Sync */}
                  <div className="flex gap-3 flex-1 max-w-2xl">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="text"
                        placeholder="Search media..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    
                    <button
                      onClick={syncMedia}
                      disabled={syncing}
                      className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors"
                      title="Sync with storage bucket"
                    >
                      <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
                      <span className="hidden sm:inline">{syncing ? 'Syncing...' : 'Sync'}</span>
                    </button>
                  </div>

                  {/* View Controls */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setViewMode("grid")}
                      className={`p-2 rounded-lg transition-colors ${
                        viewMode === "grid"
                          ? "bg-blue-100 text-blue-600"
                          : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      <Grid3X3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setViewMode("list")}
                      className={`p-2 rounded-lg transition-colors ${
                        viewMode === "list"
                          ? "bg-blue-100 text-blue-600"
                          : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      <List className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Media Grid/List */}
              <div className="flex-1 overflow-y-auto p-6">
                {loading ? (
                  <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                      <p className="text-gray-500">Loading media...</p>
                    </div>
                  </div>
                ) : error ? (
                  <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                      <p className="text-red-600 mb-2">{error}</p>
                      <button
                        onClick={() => fetchMediaItems()}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        Try again
                      </button>
                    </div>
                  </div>
                ) : filteredMedia.length === 0 ? (
                  <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                      <ImageIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500 mb-2">
                        {searchTerm ? "No media found matching your search" : "No media found"}
                      </p>
                      <button
                        onClick={() => setActiveTab("upload")}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        Upload your first image
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    className={
                      viewMode === "grid"
                        ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
                        : "space-y-3"
                    }
                  >
                    {filteredMedia.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => onSelect(item)}
                        className={`group cursor-pointer rounded-lg border-2 transition-all ${
                          selectedId === item.id
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200 hover:border-gray-300 hover:shadow-md"
                        } ${viewMode === "grid" ? "p-2" : "p-3"}`}
                      >
                        {viewMode === "grid" ? (
                          <>
                            <div className="aspect-square rounded-md overflow-hidden bg-gray-100 mb-2">
                              <Image
                                src={item.url}
                                alt={item.alt_text || item.original_filename}
                                width={200}
                                height={200}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                              />
                            </div>
                            <div className="space-y-1">
                              <p className="text-xs font-medium text-gray-900 truncate">
                                {item.original_filename}
                              </p>
                              <p className="text-xs text-gray-500">
                                {formatFileSize(item.file_size)}
                              </p>
                            </div>
                          </>
                        ) : (
                          <div className="flex items-center space-x-4">
                            <div className="w-16 h-16 rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
                              <Image
                                src={item.url}
                                alt={item.alt_text || item.original_filename}
                                width={64}
                                height={64}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {item.original_filename}
                              </p>
                              <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
                                <span className="flex items-center space-x-1">
                                  <Download className="w-3 h-3" />
                                  <span>{formatFileSize(item.file_size)}</span>
                                </span>
                                <span className="flex items-center space-x-1">
                                  <Calendar className="w-3 h-3" />
                                  <span>{formatDate(item.created_at)}</span>
                                </span>
                                {item.mime_type && (
                                  <span className="flex items-center space-x-1">
                                    <FileText className="w-3 h-3" />
                                    <span>{item.mime_type.split("/")[1]?.toUpperCase()}</span>
                                  </span>
                                )}
                              </div>
                              {item.alt_text && (
                                <p className="text-xs text-gray-500 mt-1 truncate">
                                  {item.alt_text}
                                </p>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          ) : (
            /* Upload Tab */
            <div className="flex-1 overflow-y-auto p-6">
                                           <ImageUploader
                onUpload={handleUploadSuccess}
                onError={(error) => setError(error)}
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t bg-gray-50">
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 