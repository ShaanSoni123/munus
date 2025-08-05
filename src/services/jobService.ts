import { api } from './api';
import type { JobFilters } from '../types';

export interface JobResponse {
  id?: string;
  _id?: string;
  title: string;
  description: string;
  location: string;
  job_type: string;
  work_mode: string;
  experience_level?: string;
  requirements?: string[];
  responsibilities?: string[];
  benefits?: string[];
  required_skills?: string[];
  skills?: string[];
  salary_min?: number;
  salary_max?: number;
  salary_currency?: string;
  salary_period?: string;
  status?: string;
  is_featured?: boolean;
  employer_id?: string;
  employer_name?: string;
  company_id?: string;
  company_name?: string;
  created_at?: string;
  updated_at?: string;
  applications_count?: number;
}

class JobService {
  async getJobs(filters?: Partial<JobFilters>): Promise<JobResponse[]> {
    try {
      // Log the API base URL being used
      console.log('JobService: API Base URL:', import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000');
      console.log('JobService: Making request to /mongodb-jobs/');
      
      // Try the MongoDB jobs endpoint first (where our sample jobs are)
      const response = await api.get<any>('/mongodb-jobs/', filters);
      console.log('JobService: Fetched jobs from MongoDB endpoint:', response.data);
      
      // Handle paginated response structure
      if (response.data && response.data.jobs && Array.isArray(response.data.jobs)) {
        console.log('JobService: Found jobs in paginated response:', response.data.jobs.length);
        return response.data.jobs;
      } else if (Array.isArray(response.data)) {
        console.log('JobService: Found jobs in direct array response:', response.data.length);
        return response.data;
      } else {
        console.log('JobService: No jobs found in response');
        return [];
      }
    } catch (error: any) {
      console.error('JobService: Error fetching jobs from MongoDB endpoint:', error);
      
      // Fallback to regular jobs endpoint
      try {
        const fallbackResponse = await api.get<any>('/jobs/', filters);
        console.log('JobService: Fetched jobs from fallback endpoint:', fallbackResponse.data);
        
        // Handle paginated response structure for fallback too
        if (fallbackResponse.data && fallbackResponse.data.jobs && Array.isArray(fallbackResponse.data.jobs)) {
          return fallbackResponse.data.jobs;
        } else if (Array.isArray(fallbackResponse.data)) {
          return fallbackResponse.data;
        } else {
          return [];
        }
      } catch (fallbackError: any) {
        console.error('JobService: Error fetching jobs from fallback endpoint:', fallbackError);
        return []; // Return empty array instead of throwing
      }
    }
  }

  async getJob(jobId: number): Promise<JobResponse> {
    try {
      const response = await api.get<JobResponse>(`/jobs/${jobId}/`);
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || 'Failed to fetch job details';
      throw new Error(errorMessage);
    }
  }

  async applyForJob(jobId: number, data: any): Promise<any> {
    try {
      console.log('JobService: Applying to job:', jobId);
      const response = await api.post(`/jobs/${jobId}/apply`, data);
      console.log('JobService: Application submitted successfully:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('JobService: Error applying to job:', error);
      throw error;
    }
  }

  async getMyApplications(): Promise<any[]> {
    try {
      console.log('JobService: Fetching my applications...');
      
      // Get current user from localStorage
      const userStr = localStorage.getItem('skillglide-user');
      if (!userStr) {
        console.log('JobService: No user found in localStorage');
        return [];
      }
      
      const user = JSON.parse(userStr);
      const userEmail = user.email || user.email_address;
      
      if (!userEmail) {
        console.log('JobService: No user email found');
        return [];
      }
      
      console.log('JobService: Fetching applications for email:', userEmail);
      
      // Try the simple endpoint first (no authentication required)
      try {
        const response = await api.get(`/mongodb-jobs/applications/by-email/${encodeURIComponent(userEmail)}`);
        const applications = Array.isArray(response.data) ? response.data : [];
        console.log('JobService: Found applications via email:', applications.length);
        return applications;
      } catch (emailError: any) {
        console.log('JobService: Email endpoint failed, trying my-applications:', emailError.message);
        
        // Fallback to the authenticated endpoint
        const response = await api.get('/jobs/applications/my-applications');
        const applications = Array.isArray(response.data) ? response.data : [];
        console.log('JobService: Found my applications:', applications.length);
        return applications;
      }
    } catch (error: any) {
      console.error('JobService: Error fetching my applications:', error);
      return [];
    }
  }

  async getSuggestions(query: string, topK: number = 5): Promise<{ skills: string[]; jobs: string[]; candidates: string[] }> {
    try {
      const response = await api.get('/jobs/suggestions/', { query, top_k: topK });
      return response.data;
    } catch (error: any) {
      console.error('Error fetching suggestions:', error);
      return { skills: [], jobs: [], candidates: [] };
    }
  }

  async createJob(jobData: any): Promise<JobResponse> {
    try {
      console.log('JobService: Creating job with data:', jobData);
      
      // Check if user is authenticated
      const userStr = localStorage.getItem('skillglide-user');
      const token = localStorage.getItem('skillglide-access-token');
      
      console.log('JobService: User from localStorage:', userStr);
      console.log('JobService: Token exists:', !!token);
      
      const response = await api.post<JobResponse>('/jobs/', jobData);
      console.log('JobService: Job created successfully:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('JobService: Error creating job:', error);
      console.error('JobService: Error response:', error.response);
      throw error;
    }
  }

  async getEmployerJobs(): Promise<JobResponse[]> {
    try {
      console.log('JobService: Fetching employer jobs...');
      
      // Check if user is authenticated
      const userStr = localStorage.getItem('skillglide-user');
      const token = localStorage.getItem('skillglide-access-token');
      
      console.log('JobService: User from localStorage:', userStr);
      console.log('JobService: Token exists:', !!token);
      
      if (!userStr || !token) {
        console.log('JobService: No user or token found');
        return [];
      }
      
      const user = JSON.parse(userStr);
      console.log('JobService: Current user:', user);
      
      // Use the new employer-specific endpoint
      const response = await api.get<JobResponse[]>('/jobs/employer-jobs');
      const employerJobs = Array.isArray(response.data) ? response.data : [];
      
      console.log('JobService: Response from API:', response);
      console.log(`JobService: Found ${employerJobs.length} jobs for current employer`);
        
      // Log each job for debugging
      employerJobs.forEach((job: JobResponse, index: number) => {
        console.log(`JobService: Job ${index + 1}:`, {
          id: job._id || job.id,
          title: job.title,
          employer_name: job.employer_name,
          company_name: job.company_name,
          created_at: job.created_at
        });
      });
      
      return employerJobs;
    } catch (error: any) {
      console.error('JobService: Error fetching employer jobs:', error);
      console.error('JobService: Error response:', error.response);
      return [];
    }
  }

  async deleteJob(jobId: string): Promise<void> {
    try {
      console.log('Deleting job:', jobId);
      const response = await api.delete(`/jobs/${jobId}`);
      console.log('Job deleted successfully:', response.data);
    } catch (error: any) {
      console.error('Error deleting job:', error);
      throw error;
    }
  }

  async testEmployerEndpoint(): Promise<any> {
    try {
      console.log('JobService: Testing employer endpoint...');
      const response = await api.get('/jobs/employer-jobs');
      console.log('JobService: Test endpoint response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('JobService: Test endpoint error:', error);
      throw error;
    }
  }

  async getJobApplications(jobId: string): Promise<any[]> {
    try {
      console.log('JobService: Fetching applications for job:', jobId);
      // Use the correct endpoint for simple MongoDB jobs
      const response = await api.get(`/mongodb-jobs/${jobId}/applications`);
      const applications = Array.isArray(response.data) ? response.data : [];
      console.log('JobService: Found applications:', applications.length);
      return applications;
    } catch (error: any) {
      console.error('JobService: Error fetching job applications:', error);
      return [];
    }
  }

  async updateApplicationStatus(applicationId: string, status: string, notes?: string): Promise<any> {
    try {
      console.log('JobService: Updating application status:', { applicationId, status, notes });
      console.log('JobService: Making request to:', `/mongodb-jobs/applications/${applicationId}/status`);
      
      const requestData = {
        status,
        notes
      };
      console.log('JobService: Request data:', requestData);
      
      // Use the correct endpoint for simple MongoDB jobs
      const response = await api.put(`/mongodb-jobs/applications/${applicationId}/status`, requestData);
      console.log('JobService: Application status updated successfully:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('JobService: Error updating application status:', error);
      console.error('JobService: Error response:', error.response?.data);
      console.error('JobService: Error status:', error.response?.status);
      throw error;
    }
  }

  async simpleApplyForJob(jobId: string, data: any): Promise<any> {
    try {
      console.log('JobService: Applying to job (simple):', jobId);
      const response = await api.post(`/mongodb-jobs/${jobId}/apply`, data);
      console.log('JobService: Simple application submitted successfully:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('JobService: Error applying to job (simple):', error);
      throw error;
    }
  }
}

export const jobService = new JobService();