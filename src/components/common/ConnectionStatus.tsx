import React, { useState, useEffect } from 'react';
import { AlertCircle, RefreshCw, Bug, Wifi, WifiOff } from 'lucide-react';
import { Button } from '../ui/Button';
import { useAuth } from '../../contexts/AuthContext';

export const ConnectionStatus: React.FC = () => {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [showDebug, setShowDebug] = useState(false);
  const { user, isAuthenticated } = useAuth();

  const isEmployer = user?.role === 'employer';
  const isJobSeeker = user?.role === 'job_seeker';

  const checkConnection = async () => {
    setIsChecking(true);
    try {
      // Check if the backend is accessible
      const response = await fetch('/api/v1/health', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
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
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 shadow-lg dark:bg-amber-900/20 dark:border-amber-800">
        <div className="flex items-start space-x-3">
          <WifiOff className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <h3 className="text-sm font-medium text-amber-800 dark:text-amber-200">
              Service Temporarily Unavailable
            </h3>
            <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
              We're experiencing some technical difficulties. Our team is working to resolve this quickly.
            </p>
            <div className="mt-3">
              <Button
                size="sm"
                variant="outline"
                onClick={checkConnection}
                loading={isChecking}
                icon={<RefreshCw className="w-3 h-3" />}
                className="text-amber-700 border-amber-300 hover:bg-amber-100 dark:text-amber-300 dark:border-amber-600 dark:hover:bg-amber-800/50"
              >
                Try Again
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};