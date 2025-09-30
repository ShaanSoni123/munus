import React from 'react';
import { JobFilters } from '../../components/jobs/JobFilters';
import { JobList } from '../../components/jobs/JobList';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';

const JobsPage: React.FC = () => {
  const { isEmployer } = useAuth();
  const { theme } = useTheme();

  return (
    <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 ${
      theme === 'light' ? 'bg-light-pattern' : ''
    }`}>
      <div className="space-y-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            {isEmployer ? 'Find Top Candidates' : 'Discover Your Perfect Job'}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            {isEmployer 
              ? 'Browse through talented professionals and find the perfect match for your team'
              : 'Browse through thousands of opportunities from top companies worldwide'
            }
          </p>
        </div>
        <JobFilters />
        <JobList />
      </div>
    </div>
  );
};

export default JobsPage;
