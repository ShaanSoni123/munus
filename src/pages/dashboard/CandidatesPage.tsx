import React from 'react';
import { JobFilters } from '../../components/jobs/JobFilters';
import { JobList } from '../../components/jobs/JobList';
import { useTheme } from '../../contexts/ThemeContext';

const CandidatesPage: React.FC = () => {
  const { theme } = useTheme();

  return (
    <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 ${
      theme === 'light' ? 'bg-light-pattern' : ''
    }`}>
      <div className="space-y-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Find Top Candidates
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Browse through talented professionals and find the perfect match for your team
          </p>
        </div>
        <JobFilters />
        <JobList />
      </div>
    </div>
  );
};

export default CandidatesPage;
