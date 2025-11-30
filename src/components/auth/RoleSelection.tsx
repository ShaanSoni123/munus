import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Briefcase, User, Check } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

interface RoleSelectionProps {
  onSelectRole: (role: 'employer' | 'jobseeker') => void;
  loading?: boolean;
}

export const RoleSelection: React.FC<RoleSelectionProps> = ({
  onSelectRole,
  loading = false,
}) => {
  const { theme } = useTheme();
  const [selectedRole, setSelectedRole] = useState<'employer' | 'jobseeker' | null>(null);

  const handleContinue = () => {
    if (selectedRole) {
      onSelectRole(selectedRole);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 p-4">
      <Card className="w-full max-w-2xl p-8 shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Choose Your Role
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Select how you'll be using Munus
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Job Seeker Option */}
          <div
            onClick={() => setSelectedRole('jobseeker')}
            className={`relative p-6 rounded-lg border-2 cursor-pointer transition-all ${
              selectedRole === 'jobseeker'
                ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
                : 'border-gray-300 dark:border-gray-700 hover:border-emerald-300 dark:hover:border-emerald-700'
            }`}
          >
            {selectedRole === 'jobseeker' && (
              <div className="absolute top-4 right-4">
                <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                  <Check className="w-4 h-4 text-white" />
                </div>
              </div>
            )}
            <div className="flex flex-col items-center text-center">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
                selectedRole === 'jobseeker'
                  ? 'bg-emerald-500'
                  : 'bg-gray-200 dark:bg-gray-700'
              }`}>
                <User className={`w-8 h-8 ${
                  selectedRole === 'jobseeker' ? 'text-white' : 'text-gray-600 dark:text-gray-400'
                }`} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Job Seeker
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Find jobs, build your resume, and connect with employers
              </p>
            </div>
          </div>

          {/* Employer Option */}
          <div
            onClick={() => setSelectedRole('employer')}
            className={`relative p-6 rounded-lg border-2 cursor-pointer transition-all ${
              selectedRole === 'employer'
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                : 'border-gray-300 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700'
            }`}
          >
            {selectedRole === 'employer' && (
              <div className="absolute top-4 right-4">
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                  <Check className="w-4 h-4 text-white" />
                </div>
              </div>
            )}
            <div className="flex flex-col items-center text-center">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
                selectedRole === 'employer'
                  ? 'bg-blue-500'
                  : 'bg-gray-200 dark:bg-gray-700'
              }`}>
                <Briefcase className={`w-8 h-8 ${
                  selectedRole === 'employer' ? 'text-white' : 'text-gray-600 dark:text-gray-400'
                }`} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Employer
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Post jobs, find candidates, and manage your hiring process
              </p>
            </div>
          </div>
        </div>

        <Button
          variant="primary"
          size="lg"
          onClick={handleContinue}
          disabled={!selectedRole || loading}
          className="w-full py-6"
        >
          {loading ? 'Processing...' : 'Continue'}
        </Button>
      </Card>
    </div>
  );
};

