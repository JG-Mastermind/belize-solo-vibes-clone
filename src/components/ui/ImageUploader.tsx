// 📁 ImageUploader Component for Supabase Storage
// 
// Features:
// - Drag & drop or click to upload
// - Image preview with remove option
// - Automatic Supabase Storage integration
// - File validation (type, size)
// - Error handling and user feedback
// - Mobile responsive design

import React, { useState } from 'react';
import { uploadImageToStorage } from '@/lib/storage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, Image as ImageIcon, Loader2, X } from 'lucide-react';
import { toast } from 'sonner';

interface ImageUploaderProps {
  onUpload: (filePath: string) => void;
  bucketName: string;
  currentImage?: string;
  onRemove?: () => void;
  label?: string;
  className?: string;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ 
  onUpload, 
  bucketName, 
  currentImage,
  onRemove,
  label = "Featured Image",
  className = ""
}) => {
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImage || null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.');
      }

      const file = event.target.files[0];
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        throw new Error('Please select a valid image file.');
      }

      // Validate file size (max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        throw new Error('Image must be smaller than 5MB.');
      }

      // Create a preview URL for immediate feedback
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);

      // Upload using utility function
      const { publicUrl, error: uploadError } = await uploadImageToStorage(
        bucketName, 
        file, 
        'adventures'
      );

      if (uploadError || !publicUrl) {
        throw new Error(uploadError || 'Failed to upload image');
      }

      onUpload(publicUrl);
      toast.success('Image uploaded successfully!');
      
      // Clean up the object URL
      URL.revokeObjectURL(objectUrl);
      
    } catch (error) {
      if (error instanceof Error) {
        toast.error('Error uploading file: ' + error.message);
        console.error('Upload error:', error);
      }
      setPreviewUrl(currentImage || null);
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setPreviewUrl(null);
    if (onRemove) {
      onRemove();
    }
    toast.info('Image removed');
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <Label className="text-sm font-medium">{label}</Label>
      
      {previewUrl ? (
        <div className="relative">
          <div className="relative w-full h-48 border-2 border-dashed border-gray-300 rounded-lg overflow-hidden">
            <img 
              src={previewUrl} 
              alt="Adventure preview" 
              className="w-full h-full object-cover"
            />
            {uploading && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-white animate-spin" />
              </div>
            )}
          </div>
          <Button
            type="button"
            variant="destructive"
            size="sm"
            className="absolute top-2 right-2"
            onClick={handleRemoveImage}
            disabled={uploading}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      ) : (
        <div className="space-y-2">
          <div className="flex items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors">
            <label 
              htmlFor="image-upload" 
              className="flex flex-col items-center justify-center w-full h-full cursor-pointer"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                {uploading ? (
                  <Loader2 className="w-10 h-10 text-gray-400 animate-spin" />
                ) : (
                  <ImageIcon className="w-10 h-10 text-gray-400" />
                )}
                <p className="mb-2 text-sm text-gray-500">
                  {uploading ? (
                    <span>Uploading...</span>
                  ) : (
                    <span>
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </span>
                  )}
                </p>
                <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
              </div>
            </label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              asChild
              disabled={uploading}
            >
              <label htmlFor="image-upload" className="cursor-pointer">
                <Upload className="w-4 h-4 mr-2" />
                {uploading ? 'Uploading...' : 'Choose Image'}
              </label>
            </Button>
          </div>
        </div>
      )}
      
      <Input
        className="sr-only"
        type="file"
        id="image-upload"
        accept="image/*"
        onChange={handleFileUpload}
        disabled={uploading}
      />
    </div>
  );
};

export default ImageUploader;