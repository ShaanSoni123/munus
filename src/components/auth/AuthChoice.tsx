import React from 'react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Chrome, Mail, ArrowLeft } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

interface AuthChoiceProps {
  onGoogleAuth: () => void;
  onManualAuth: () => void;
  onBack?: () => void;
}

export const AuthChoice: React.FC<AuthChoiceProps> = ({
  onGoogleAuth,
  onManualAuth,
  onBack,
}) => {
  const { theme } = useTheme();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 p-4">
      <Card className="w-full max-w-md p-8 shadow-2xl">
        {onBack && (
          <button
            onClick={onBack}
            className="mb-6 flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </button>
        )}

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Get Started
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Choose how you'd like to sign in
          </p>
        </div>

        <div className="space-y-4">
          {/* Google Sign In */}
          <Button
            variant="outline"
            size="lg"
            onClick={onGoogleAuth}
            className="w-full flex items-center justify-center gap-3 py-6 border-2 hover:border-blue-500 transition-all"
          >
            <Chrome className="w-6 h-6" />
            <span className="font-semibold">Continue with Google</span>
          </Button>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                OR
              </span>
            </div>
          </div>

          {/* Manual Sign In */}
          <Button
            variant="primary"
            size="lg"
            onClick={onManualAuth}
            className="w-full flex items-center justify-center gap-3 py-6"
          >
            <Mail className="w-6 h-6" />
            <span className="font-semibold">Continue with Email</span>
          </Button>
        </div>

        <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </Card>
    </div>
  );
};

