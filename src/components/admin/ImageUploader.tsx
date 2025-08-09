'use client';

import { useState, useRef, useCallback } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';

interface MediaItem {
  id: number;
  url: string;
  alt_text?: string;
  original_filename: string;
  mime_type: string;
  size: number;
}

interface ImageUploaderProps {
  onUpload?: (mediaItem: MediaItem) => void;
  onError?: (error: string) => void;
  accept?: string;
  maxSize?: number; // in MB
  className?: string;
}

export default function ImageUploader({ 
  onUpload, 
  onError, 
  accept = "image/*", 
  maxSize = 5,
  className = ""
}: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [altText, setAltText] = useState('');
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback((file: File) => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      const error = 'Please select an image file';
      toast.error(error);
      onError?.(error);
      return;
    }

    // Validate file size
    const maxSizeBytes = maxSize * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      const error = `File size must be less than ${maxSize}MB`;
      toast.error(error);
      onError?.(error);
      return;
    }

    setSelectedFile(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  }, [maxSize, onError]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, [handleFileSelect]);

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('altText', altText);

      const response = await fetch('/api/admin/media', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json() as { error?: string };
        throw new Error(errorData.error || 'Upload failed');
      }

      const result = await response.json() as { data: MediaItem };
      const mediaItem = result.data;
      
      toast.success('Image uploaded successfully');
      onUpload?.(mediaItem);
      
      // Reset form
      setSelectedFile(null);
      setPreview(null);
      setAltText('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Upload failed';
      toast.error(errorMessage);
      onError?.(errorMessage);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setPreview(null);
    setAltText('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {!selectedFile ? (
        <Card 
          className={`border-2 border-dashed transition-colors cursor-pointer ${
            isDragging 
              ? 'border-blue-500 bg-blue-50' 
              : 'border-gray-300 hover:border-gray-400'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <CardContent className="p-8 text-center">
            <div className="flex flex-col items-center space-y-4">
              <div className={`p-4 rounded-full ${isDragging ? 'bg-blue-100' : 'bg-gray-100'}`}>
                <Upload className={`w-8 h-8 ${isDragging ? 'text-blue-600' : 'text-gray-600'}`} />
              </div>
              <div>
                <p className="text-lg font-medium text-gray-900">
                  Drop your image here, or click to browse
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Supports: JPG, PNG, GIF, WebP (max {maxSize}MB)
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              {/* Preview */}
              <div className="relative">
                <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                  {preview && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img 
                      src={preview} 
                      alt="Preview" 
                      className="w-full h-full object-contain"
                    />
                  )}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="absolute top-2 right-2 bg-white/90 hover:bg-white"
                  onClick={handleRemoveFile}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {/* File info */}
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <ImageIcon className="w-4 h-4" />
                <span>{selectedFile.name}</span>
                <span>({Math.round(selectedFile.size / 1024)} KB)</span>
              </div>

              {/* Alt text input */}
              <div>
                <Label htmlFor="altText">Alt Text (for accessibility)</Label>
                <Input
                  id="altText"
                  value={altText}
                  onChange={(e) => setAltText(e.target.value)}
                  placeholder="Describe the image..."
                  className="mt-1"
                />
              </div>

              {/* Upload button */}
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={handleRemoveFile}>
                  Cancel
                </Button>
                <Button onClick={handleUpload} disabled={isUploading}>
                  {isUploading ? 'Uploading...' : 'Upload Image'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileInputChange}
        className="hidden"
      />
    </div>
  );
} 