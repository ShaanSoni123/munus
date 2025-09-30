import React from 'react';
import { JobList } from '../../components/jobs/JobList';
import { useTheme } from '../../contexts/ThemeContext';

const SavedJobsPage: React.FC = () => {
  const { theme } = useTheme();

  return (
    <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 ${
      theme === 'light' ? 'bg-light-pattern' : ''
    }`}>
      <div className="space-y-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Saved Jobs
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            View and manage your saved job opportunities
          </p>
        </div>
        <JobList />
      </div>
    </div>
  );
};

export default SavedJobsPage;
