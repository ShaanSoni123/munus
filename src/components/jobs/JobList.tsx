import React, { useState } from 'react';
import { Briefcase, AlertCircle, Filter, X } from 'lucide-react';
import { JobCard } from './JobCard';
import { JobApplicationModal } from './JobApplicationModal';
import { JobFilters } from './JobFilters';
import { useAuth } from '../../contexts/AuthContext';
import { useJobs } from '../../contexts/JobContext';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { useTheme } from '../../contexts/ThemeContext';
import { useToast } from '../common/Toast';

export const JobList: React.FC = () => {
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('newest');

  const { isAuthenticated } = useAuth();
  const { theme } = useTheme();
  const { success, error: showError } = useToast();
  
  const {
    filteredJobs,
    filters,
    updateFilters,
    clearFilters,
    loading,
    error,
    refetchJobs
  } = useJobs();

  // Debug logging
  console.log('JobList: filteredJobs count:', filteredJobs?.length || 0, 'loading:', loading, 'error:', error);

  // Use jobs from JobContext
  const jobsToDisplay = filteredJobs || [];
  const isLoading = loading;
  const hasError = error;

  // Use the filtered jobs from JobContext directly
  const finalJobs = jobsToDisplay;

  const handleApply = (jobId: string) => {
    if (!isAuthenticated) {
      showError('Login Required', 'Please login to apply for jobs');
      return;
    }
    
    const job = finalJobs.find(j => (j.id || j._id) === jobId);
    if (!job) {
      showError('Error', 'Job not found');
      return;
    }
    
    setSelectedJob(job);
    setIsApplicationModalOpen(true);
  };

  const handleApplicationSuccess = () => {
    refetchJobs();
    success('Application Submitted', 'Your application has been submitted successfully!');
  };

  const handleSave = (jobId: string) => {
    if (!isAuthenticated) {
      console.log('Please login to save jobs');
      return;
    }
    
    console.log('Saving job:', jobId);
    // TODO: Implement save logic
  };

  const handleSortChange = (sortValue: string) => {
    setSortBy(sortValue);
  };

  const getSortedJobs = () => {
    const jobs = [...finalJobs];
    
    switch (sortBy) {
      case 'newest':
        return jobs.sort((a, b) => {
          const dateA = new Date(a.created_at || 0);
          const dateB = new Date(b.created_at || 0);
          return dateB.getTime() - dateA.getTime();
        });
      case 'oldest':
        return jobs.sort((a, b) => {
          const dateA = new Date(a.created_at || 0);
          const dateB = new Date(b.created_at || 0);
          return dateA.getTime() - dateB.getTime();
        });
      case 'salary-high':
        return jobs.sort((a, b) => {
          const salaryA = a.salary_max || a.salary_min || 0;
          const salaryB = b.salary_max || b.salary_min || 0;
          return salaryB - salaryA;
        });
      case 'salary-low':
        return jobs.sort((a, b) => {
          const salaryA = a.salary_min || a.salary_max || 0;
          const salaryB = b.salary_min || b.salary_max || 0;
          return salaryA - salaryB;
        });
      case 'relevance':
        // Sort by relevance (applications count, featured status, etc.)
        return jobs.sort((a, b) => {
          const relevanceA = (a.is_featured ? 1000 : 0) + (a.applications_count || 0);
          const relevanceB = (b.is_featured ? 1000 : 0) + (b.applications_count || 0);
          return relevanceB - relevanceA;
        });
      default:
        return jobs;
    }
  };

  const sortedJobs = getSortedJobs();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" text="Loading amazing job opportunities..." />
      </div>
    );
  }

  if (hasError) {
    return (
      <Card className="text-center py-12">
        <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          Failed to Load Jobs
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4 max-w-md mx-auto">
          {hasError}
        </p>
        <Button
          variant="primary"
          onClick={() => {
            refetchJobs();
          }}
          className="mx-auto"
        >
          Try Again
        </Button>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Find Your Dream Job
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            {sortedJobs.length} {sortedJobs.length === 1 ? 'job' : 'jobs'} found
            {filters.search && ` for "${filters.search}"`}
            {filters.location && ` in ${filters.location}`}
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            icon={showFilters ? <X className="w-4 h-4" /> : <Filter className="w-4 h-4" />}
          >
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </Button>
          
          <select 
            value={sortBy}
            onChange={(e) => handleSortChange(e.target.value)}
            className={`px-3 py-2 border rounded-lg text-sm ${
              theme === 'light' 
                ? 'border-gray-300 bg-white text-gray-900' 
                : 'border-gray-600 bg-gray-800 text-white'
            }`}
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="salary-high">Highest Salary</option>
            <option value="salary-low">Lowest Salary</option>
            <option value="relevance">Most Relevant</option>
          </select>
        </div>
      </div>

      {/* Search and Filters */}
      <JobFilters />

      {/* Active Filters Display */}
      {(filters.search || filters.location || filters.jobType?.length || filters.workMode?.length || filters.experience?.length) && (
        <div className="flex flex-wrap gap-2 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300 mr-2">Active filters:</span>
          {filters.search && (
            <Badge variant="primary" className="flex items-center">
              Search: {filters.search}
              <button
                onClick={() => updateFilters({ search: '' })}
                className="ml-1 hover:bg-white/20 rounded-full p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}
          {filters.location && (
            <Badge variant="primary" className="flex items-center">
              Location: {filters.location}
              <button
                onClick={() => updateFilters({ location: '' })}
                className="ml-1 hover:bg-white/20 rounded-full p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}
          {filters.jobType?.map((type) => (
            <Badge key={type} variant="secondary" className="flex items-center">
              {type.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              <button
                onClick={() => {
                  const newTypes = filters.jobType?.filter(t => t !== type) || [];
                  updateFilters({ jobType: newTypes });
                }}
                className="ml-1 hover:bg-white/20 rounded-full p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
          {filters.workMode?.map((mode) => (
            <Badge key={mode} variant="success" className="flex items-center">
              {mode.replace(/\b\w/g, l => l.toUpperCase())}
              <button
                onClick={() => {
                  const newModes = filters.workMode?.filter(m => m !== mode) || [];
                  updateFilters({ workMode: newModes });
                }}
                className="ml-1 hover:bg-white/20 rounded-full p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
          {filters.experience?.map((level) => (
            <Badge key={level} variant="warning" className="flex items-center">
              {level} years
              <button
                onClick={() => {
                  const newLevels = filters.experience?.filter(l => l !== level) || [];
                  updateFilters({ experience: newLevels });
                }}
                className="ml-1 hover:bg-white/20 rounded-full p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            Clear All
          </Button>
        </div>
      )}

      {/* Jobs List */}
      {sortedJobs.length === 0 ? (
        <Card className="text-center py-12">
          <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            {filters.search || filters.location ? 'No jobs match your criteria' : 'No jobs available'}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto mb-6">
            {filters.search || filters.location 
              ? 'Try adjusting your search terms or filters to find more opportunities.'
              : 'There are currently no job postings available. Check back later for new opportunities.'
            }
          </p>
          {(filters.search || filters.location) && (
            <Button
              variant="primary"
              onClick={clearFilters}
              className="mx-auto"
            >
              Clear Filters
            </Button>
          )}
        </Card>
      ) : (
        <div className="grid gap-6">
          {sortedJobs.map((job) => (
            <JobCard
              key={job.id || job._id}
              job={job}
              onApply={handleApply}
              onSave={handleSave}
              isSaved={false} // TODO: Implement saved jobs logic
            />
          ))}
        </div>
      )}

      {/* Load More Button */}
      {sortedJobs.length >= 20 && (
        <div className="text-center pt-8">
          <Button
            variant="outline"
            size="lg"
            onClick={() => {
              // TODO: Implement pagination
              console.log('Load more jobs');
            }}
          >
            Load More Jobs
          </Button>
        </div>
      )}

      {/* Job Application Modal */}
      {selectedJob && (
        <JobApplicationModal
          job={selectedJob}
          isOpen={isApplicationModalOpen}
          onClose={() => {
            setIsApplicationModalOpen(false);
            setSelectedJob(null);
          }}
          onSuccess={handleApplicationSuccess}
        />
      )}
    </div>
  );
};