import React, { useState, useEffect } from 'react';
import { Upload, FileText, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { Toast } from '../common/Toast';
import googleDriveService, { GoogleDriveFile } from '../../services/googleDriveService';

interface GoogleDriveImportProps {
  onFileSelected: (file: File, metadata: GoogleDriveFile) => void;
  onError: (error: string) => void;
  disabled?: boolean;
}

export const GoogleDriveImport: React.FC<GoogleDriveImportProps> = ({
  onFileSelected,
  onError,
  disabled = false,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedFile, setSelectedFile] = useState<GoogleDriveFile | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');

  useEffect(() => {
    initializeGoogleDrive();
  }, []);

  const initializeGoogleDrive = async () => {
    try {
      await googleDriveService.initialize();
      setIsInitialized(true);
      setIsAuthenticated(googleDriveService.isAuthenticated());
    } catch (error) {
      console.error('Failed to initialize Google Drive:', error);
      onError('Failed to initialize Google Drive service');
    }
  };

  const handleImportClick = async () => {
    if (!isInitialized) {
      setToastMessage('Google Drive service is still initializing. Please try again.');
      setToastType('error');
      setShowToast(true);
      return;
    }

    setIsLoading(true);
    try {
      // Request authentication if not already authenticated
      if (!isAuthenticated) {
        await googleDriveService.requestToken();
        setIsAuthenticated(true);
      }

      // Open Google Picker
      const file = await googleDriveService.openPicker();
      
      if (file) {
        // Validate file type
        const allowedTypes = [
          'application/pdf',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ];
        
        if (!allowedTypes.includes(file.mimeType)) {
          throw new Error('Please select a PDF or DOCX file only.');
        }

        // Validate file size (10MB limit)
        if (file.size && parseInt(file.size) > 10 * 1024 * 1024) {
          throw new Error('File size must be less than 10MB.');
        }

        setSelectedFile(file);
        
        // Download file content
        const fileContent = await googleDriveService.downloadFile(file.id);
        
        // Create File object from ArrayBuffer
        const blob = new Blob([fileContent], { type: file.mimeType });
        const fileObject = new File([blob], file.name, { type: file.mimeType });
        
        // Call parent callback
        onFileSelected(fileObject, file);
        
        setToastMessage(`Successfully imported "${file.name}"`);
        setToastType('success');
        setShowToast(true);
      }
    } catch (error) {
      console.error('Google Drive import error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to import file from Google Drive';
      onError(errorMessage);
      setToastMessage(errorMessage);
      setToastType('error');
      setShowToast(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisconnect = () => {
    googleDriveService.clearAuth();
    setIsAuthenticated(false);
    setSelectedFile(null);
    setToastMessage('Disconnected from Google Drive');
    setToastType('success');
    setShowToast(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-3">
        <Button
          variant="outline"
          onClick={handleImportClick}
          disabled={disabled || isLoading || !isInitialized}
          className="flex items-center space-x-2 bg-white dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400 transition-all duration-200"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Upload className="w-4 h-4" />
          )}
          <span>
            {isLoading ? 'Connecting...' : 'Import Resume from Google Drive'}
          </span>
        </Button>

        {isAuthenticated && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDisconnect}
            className="text-gray-500 hover:text-red-500"
          >
            Disconnect
          </Button>
        )}
      </div>

      {/* Status Indicators */}
      <div className="flex items-center space-x-4 text-sm">
        {!isInitialized && (
          <div className="flex items-center space-x-2 text-yellow-600 dark:text-yellow-400">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Initializing Google Drive...</span>
          </div>
        )}

        {isInitialized && !isAuthenticated && (
          <div className="flex items-center space-x-2 text-blue-600 dark:text-blue-400">
            <AlertCircle className="w-4 h-4" />
            <span>Click to authenticate with Google Drive</span>
          </div>
        )}

        {isAuthenticated && (
          <div className="flex items-center space-x-2 text-green-600 dark:text-green-400">
            <CheckCircle className="w-4 h-4" />
            <span>Connected to Google Drive</span>
          </div>
        )}
      </div>

      {/* Selected File Info */}
      {selectedFile && (
        <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <div className="flex items-center space-x-3">
            <FileText className="w-5 h-5 text-green-600 dark:text-green-400" />
            <div className="flex-1">
              <h4 className="font-medium text-green-800 dark:text-green-200">
                {selectedFile.name}
              </h4>
              <p className="text-sm text-green-600 dark:text-green-400">
                {selectedFile.mimeType === 'application/pdf' ? 'PDF Document' : 'Word Document'}
                {selectedFile.size && ` • ${(parseInt(selectedFile.size) / 1024 / 1024).toFixed(1)} MB`}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Help Text */}
      <div className="text-sm text-gray-600 dark:text-gray-400">
        <p>Supported formats: PDF, DOCX (max 10MB)</p>
        <p>Your file will be securely processed and parsed to extract resume information.</p>
      </div>

      {/* Toast Notification */}
      {showToast && (
        <Toast
          message={toastMessage}
          type={toastType}
          onClose={() => setShowToast(false)}
        />
      )}
    </div>
  );
}; 