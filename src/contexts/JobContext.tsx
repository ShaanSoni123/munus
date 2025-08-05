import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { jobService, type JobResponse } from '../services/jobService';
import { useAuth } from './AuthContext';
import type { JobFilters } from '../types';

interface JobContextValue {
  jobs: JobResponse[];
  filteredJobs: JobResponse[];
  filters: JobFilters;
  updateFilters: (filters: Partial<JobFilters>) => void;
  clearFilters: () => void;
  searchJobs: (query: string) => void;
  loading: boolean;
  error: string | null;
  totalJobs: number;
  refetchJobs: () => Promise<void>;
}

const JobContext = createContext<JobContextValue | undefined>(undefined);

export const useJobs = () => {
  const context = useContext(JobContext);
  if (!context) {
    throw new Error('useJobs must be used within a JobProvider');
  }
  return context;
};

interface JobProviderProps {
  children: React.ReactNode;
}

export const JobProvider: React.FC<JobProviderProps> = ({ children }) => {
  const [filters, setFilters] = useState<JobFilters>({});
  const [filteredJobs, setFilteredJobs] = useState<JobResponse[]>([]);
  const [jobs, setJobs] = useState<JobResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();

  // Direct API call without useApi hook
  const fetchJobs = useCallback(async () => {
    try {
      console.log('JobContext: Starting direct fetch...');
      setLoading(true);
      setError(null);
      
      const result = await jobService.getJobs();
      console.log('JobContext: Direct fetch result:', result);
      console.log('JobContext: Jobs count:', Array.isArray(result) ? result.length : 'Not an array');
      
      if (Array.isArray(result)) {
        setJobs(result);
        console.log('JobContext: Successfully set jobs:', result.length);
      } else {
        console.error('JobContext: Result is not an array:', result);
        setJobs([]);
        setError('Invalid response format');
      }
    } catch (err: any) {
      console.error('JobContext: Error fetching jobs:', err);
      setError(err.message || 'Failed to fetch jobs');
      setJobs([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch jobs on mount
  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  // Apply filters whenever jobs or filters change
  useEffect(() => {
    console.log('JobContext: Applying filters. Jobs:', jobs?.length || 0, 'Filters:', filters);
    
    if (!jobs || !Array.isArray(jobs)) {
      console.log('JobContext: No jobs or not array, setting empty filtered jobs');
      setFilteredJobs([]);
      return;
    }

    try {
      let filtered = [...jobs];

      // Apply search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        filtered = filtered.filter(job =>
          job.title.toLowerCase().includes(searchLower) ||
          job.description.toLowerCase().includes(searchLower) ||
          job.location.toLowerCase().includes(searchLower) ||
          (job.required_skills && job.required_skills.some((skill: string) => skill.toLowerCase().includes(searchLower)))
        );
      }

      // Apply location filter
      if (filters.location) {
        filtered = filtered.filter(job =>
          job.location.toLowerCase().includes(filters.location!.toLowerCase())
        );
      }

      // Apply job type filter
      if (filters.jobType && filters.jobType.length > 0) {
        filtered = filtered.filter(job => filters.jobType!.includes(job.job_type as any));
      }

      // Apply work mode filter
      if (filters.workMode && filters.workMode.length > 0) {
        filtered = filtered.filter(job => filters.workMode!.includes(job.work_mode as any));
      }

      // Apply experience filter
      if (filters.experience && filters.experience.length > 0) {
        filtered = filtered.filter(job => filters.experience!.includes(job.experience_level as any));
      }

      // Apply salary filter
      if (filters.salaryRange) {
        filtered = filtered.filter(job => {
          if (!job.salary_min && !job.salary_max) return true;
          
          const minSalary = filters.salaryRange!.min || 0;
          const maxSalary = filters.salaryRange!.max || Infinity;
          
          // Check if job salary range overlaps with filter range
          if (job.salary_min && job.salary_max) {
            return job.salary_max >= minSalary && job.salary_min <= maxSalary;
          } else if (job.salary_min) {
            return job.salary_min <= maxSalary;
          } else if (job.salary_max) {
            return job.salary_max >= minSalary;
          }
          
          return true;
        });
      }

      // Apply posted within filter
      if (filters.postedWithin) {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - filters.postedWithin);
        
        filtered = filtered.filter(job => {
          try {
            if (!job.created_at) return true; // Include jobs without dates
            const jobDate = new Date(job.created_at);
            return jobDate >= cutoffDate;
          } catch (e) {
            console.error('Invalid date format:', job.created_at);
            return true; // Include jobs with invalid dates
          }
        });
      }

      // Apply skills filter
      if (filters.skills && filters.skills.length > 0) {
        filtered = filtered.filter(job =>
          filters.skills!.some(skill =>
            job.required_skills && job.required_skills.some((jobSkill: string) => 
              jobSkill.toLowerCase().includes(skill.toLowerCase())
            )
          )
        );
      }

      console.log('JobContext: Filtered jobs result:', filtered.length);
      setFilteredJobs(filtered);
    } catch (error) {
      console.error('JobContext: Error applying filters:', error);
      setFilteredJobs(jobs || []);
    }
  }, [jobs, filters]);

  const updateFilters = useCallback((newFilters: Partial<JobFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({});
  }, []);

  const searchJobs = useCallback((query: string) => {
    updateFilters({ search: query });
  }, [updateFilters]);

  const refetchJobsAsync = useCallback(async () => {
    console.log('JobContext: Manually refetching jobs...');
    await fetchJobs();
  }, [fetchJobs]);

  // Refetch jobs when authentication state changes
  useEffect(() => {
    if (isAuthenticated) {
      fetchJobs();
    }
  }, [isAuthenticated, fetchJobs]);

  // Debug the values being provided
  console.log('JobContext Provider values:', {
    jobs: Array.isArray(jobs) ? jobs.length : 'not array',
    filteredJobs: filteredJobs.length,
    loading,
    error,
    totalJobs: Array.isArray(jobs) ? jobs.length : 0
  });

  return (
    <JobContext.Provider
      value={{
        jobs: Array.isArray(jobs) ? jobs : [],
        filteredJobs,
        filters,
        updateFilters,
        clearFilters,
        searchJobs,
        loading,
        error,
        totalJobs: Array.isArray(jobs) ? jobs.length : 0,
        refetchJobs: refetchJobsAsync,
      }}
    >
      {children}
    </JobContext.Provider>
  );
};