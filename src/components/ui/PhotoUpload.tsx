import React, { useState, useRef, useCallback } from 'react';
import { Camera, Upload, X, User, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from './Button';

interface PhotoUploadProps {
  currentPhoto?: string;
  onPhotoChange: (file: File) => void;
  onPhotoRemove?: () => void;
  disabled?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

// Utility function to format image URL
const formatImageUrl = (url: string): string => {
  if (!url) return '';
  
  // If it's already a full URL, return as is
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  
  // If it's a relative path starting with /, prepend the backend URL
  if (url.startsWith('/')) {
    const backendUrl = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';
    return `${backendUrl}${url}`;
  }
  
  // If it's a blob URL (for preview), return as is
  if (url.startsWith('blob:')) {
    return url;
  }
  
  return url;
};

export const PhotoUpload: React.FC<PhotoUploadProps> = ({
  currentPhoto,
  onPhotoChange,
  onPhotoRemove,
  disabled = false,
  className = '',
  size = 'md'
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadError, setUploadError] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32'
  };

  const iconSizes = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  // Format the current photo URL for display
  const displayPhotoUrl = formatImageUrl(currentPhoto || '');

  const validateFile = (file: File): boolean => {
    setUploadError('');
    
    // Check file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setUploadError('Please select a valid image file (JPEG, PNG, or WebP)');
      return false;
    }
    
    // Check file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      setUploadError('File size must be less than 5MB');
      return false;
    }
    
    return true;
  };

  const handleFileSelect = useCallback((file: File) => {
    if (validateFile(file)) {
      setIsUploading(true);
      onPhotoChange(file);
      setIsUploading(false);
    }
  }, [onPhotoChange]);

  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
    // Reset input value to allow selecting the same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleCameraInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
    // Reset input value to allow selecting the same file again
    if (cameraInputRef.current) {
      cameraInputRef.current.value = '';
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) {
      setIsDragOver(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    if (disabled) return;
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleBrowseClick = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleCameraClick = () => {
    if (!disabled && cameraInputRef.current) {
      cameraInputRef.current.click();
    }
  };

  const handleRemovePhoto = () => {
    setUploadError('');
    if (onPhotoRemove) {
      onPhotoRemove();
    }
  };

  return (
    <div className={`relative ${className}`}>
      {/* Hidden file inputs */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileInputChange}
        className="hidden"
        disabled={disabled}
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleCameraInputChange}
        className="hidden"
        disabled={disabled}
      />

      {/* Photo Display */}
      <div
        className={`relative ${sizeClasses[size]} rounded-full overflow-hidden border-2 border-dashed transition-all duration-200 ${
          isDragOver 
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
            : 'border-gray-300 dark:border-gray-600'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleBrowseClick}
      >
        {displayPhotoUrl ? (
          <img
            src={displayPhotoUrl}
            alt="Profile"
            className="w-full h-full object-cover"
            onError={(e) => {
              console.error('Failed to load image:', displayPhotoUrl);
              // Fallback to default avatar if image fails to load
              e.currentTarget.style.display = 'none';
            }}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <User className={`${iconSizes[size]} text-white`} />
          </div>
        )}

        {/* Upload overlay */}
        {isDragOver && (
          <div className="absolute inset-0 bg-blue-500/20 flex items-center justify-center">
            <Upload className={`${iconSizes[size]} text-blue-600`} />
          </div>
        )}

        {/* Uploading indicator */}
        {isUploading && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
          </div>
        )}

        {/* Remove button */}
        {displayPhotoUrl && onPhotoRemove && !disabled && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleRemovePhoto();
            }}
            className="absolute top-1 right-1 w-6 h-6 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center text-white transition-colors"
          >
            <X className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* Upload buttons */}
      {!disabled && (
        <div className="flex space-x-2 mt-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleBrowseClick}
            className="flex items-center space-x-1"
          >
            <Upload className="w-3 h-3" />
            <span>Browse</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleCameraClick}
            className="flex items-center space-x-1"
          >
            <Camera className="w-3 h-3" />
            <span>Camera</span>
          </Button>
        </div>
      )}

      {/* Error message */}
      {uploadError && (
        <div className="mt-2 flex items-center space-x-1 text-red-600 dark:text-red-400 text-sm">
          <AlertCircle className="w-4 h-4" />
          <span>{uploadError}</span>
        </div>
      )}

      {/* Success message */}
      {displayPhotoUrl && !uploadError && (
        <div className="mt-2 flex items-center space-x-1 text-green-600 dark:text-green-400 text-sm">
          <CheckCircle className="w-4 h-4" />
          <span>Photo uploaded successfully</span>
        </div>
      )}

      {/* Drag and drop hint */}
      {!displayPhotoUrl && !disabled && (
        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 text-center">
          Drag and drop an image here, or click to browse
        </p>
      )}
    </div>
  );
}; 