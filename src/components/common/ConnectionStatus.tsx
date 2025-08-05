import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, RefreshCw, Bug } from 'lucide-react';
import { Button } from '../ui/Button';
import { useAuth } from '../../contexts/AuthContext';

export const ConnectionStatus: React.FC = () => {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [showDebug, setShowDebug] = useState(false);
  const { isAuthenticated, isEmployer, isJobSeeker, user, loading } = useAuth();

  const checkConnection = async () => {
    setIsChecking(true);
    try {
      const response = await fetch('http://localhost:8000/health', {
        method: 'GET',
      });
      setIsConnected(response.ok);
    } catch (error) {
      setIsConnected(false);
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    checkConnection();
    // Check connection every 30 seconds
    const interval = setInterval(checkConnection, 30000);
    return () => clearInterval(interval);
  }, []);

  // Debug panel for development
  const DebugPanel = () => (
    <div className="fixed top-4 left-4 z-50 max-w-sm">
      <div className="bg-gray-900 border border-gray-700 rounded-lg p-4 shadow-lg text-white text-xs">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-bold">🔧 Debug Info</h3>
          <button
            onClick={() => setShowDebug(false)}
            className="text-gray-400 hover:text-white"
          >
            ×
          </button>
        </div>
        <div className="space-y-1">
          <p><strong>Loading:</strong> {loading ? 'Yes' : 'No'}</p>
          <p><strong>Authenticated:</strong> {isAuthenticated ? 'Yes' : 'No'}</p>
          <p><strong>Role:</strong> {user?.role || 'None'}</p>
          <p><strong>Is Employer:</strong> {isEmployer ? 'Yes' : 'No'}</p>
          <p><strong>Is Job Seeker:</strong> {isJobSeeker ? 'Yes' : 'No'}</p>
          <p><strong>User ID:</strong> {user?.id || 'None'}</p>
          <p><strong>Email:</strong> {user?.email || 'None'}</p>
        </div>
      </div>
    </div>
  );

  if (isConnected === null) {
    return null; // Don't show anything while initial check is happening
  }

  if (isConnected) {
    return (
      <>
        {/* Debug button - only show in development */}
        {process.env.NODE_ENV === 'development' && (
          <div className="fixed top-4 left-4 z-50">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowDebug(!showDebug)}
              icon={<Bug className="w-3 h-3" />}
              className="bg-gray-900 text-white border-gray-700 hover:bg-gray-800"
            >
              Debug
            </Button>
          </div>
        )}
        {showDebug && <DebugPanel />}
      </>
    );
  }

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm">
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 shadow-lg dark:bg-red-900/20 dark:border-red-800">
        <div className="flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
              Backend Server Not Running
            </h3>
            <p className="text-sm text-red-700 dark:text-red-300 mt-1">
              Cannot connect to the backend server. Please start the backend by running:
            </p>
            <code className="block text-xs bg-red-100 dark:bg-red-800/50 p-2 rounded mt-2 text-red-800 dark:text-red-200">
              cd backend && python start_backend.py
            </code>
            <div className="mt-3">
              <Button
                size="sm"
                variant="outline"
                onClick={checkConnection}
                loading={isChecking}
                icon={<RefreshCw className="w-3 h-3" />}
                className="text-red-700 border-red-300 hover:bg-red-100 dark:text-red-300 dark:border-red-600 dark:hover:bg-red-800/50"
              >
                Check Again
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};