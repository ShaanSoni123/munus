import React, { useState, useEffect } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { ConfirmDialog } from '../common/ConfirmDialog';
import { ToastContainer, useToast } from '../common/Toast';
import { ApplicationDetailModal } from './ApplicationDetailModal';
import { EmployerAnalytics } from './EmployerAnalytics';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { jobService } from '../../services/jobService';
import { 
  Users, 
  Eye, 
  Trash2, 
  MapPin, 
  DollarSign, 
  AlertTriangle, 
  Briefcase, 
  Plus,
  TrendingUp,
  Star,
  BarChart3,
  PieChart,
  Activity,
  Clock,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  SettingsIcon
} from 'lucide-react';
import type { JobResponse } from '../../services/jobService';

interface Application {
  _id: string;
  applicant_name: string;
  applicant_email: string;
  cover_letter: string;
  status: string;
  created_at: string;
  updated_at: string;
  // Enhanced application data
  years_of_experience?: string;
  relevant_skills?: string;
  work_authorization?: string;
  notice_period?: string;
  remote_work_preference?: string;
  relocation_willingness?: string;
  why_interested?: string;
  biggest_achievement?: string;
  availability_start_date?: string;
  additional_languages?: string;
  resume_url?: string;
  portfolio_url?: string;
  linkedin_url?: string;
  github_url?: string;
}

interface DeleteJobDialog {
  isOpen: boolean;
  jobId: string | null;
  jobTitle: string;
  applicationsCount: number;
}

interface EmployerDashboardProps {
  onNavigate?: (view: 'home' | 'jobs' | 'resume' | 'profile' | 'create-profile' | 'dashboard' | 'post-job' | 'candidates' | 'faqs' | 'contact' | 'settings') => void;
}

export const EmployerDashboard: React.FC<EmployerDashboardProps> = ({ onNavigate }) => {
  const [jobs, setJobs] = useState<JobResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedJob, setSelectedJob] = useState<string | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loadingApplications, setLoadingApplications] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState<DeleteJobDialog>({
    isOpen: false,
    jobId: null,
    jobTitle: '',
    applicationsCount: 0
  });
  const [deletingJob, setDeletingJob] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [updatingApplicationId, setUpdatingApplicationId] = useState<string | null>(null);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [isApplicationDetailOpen, setIsApplicationDetailOpen] = useState(false);
  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(false);
  
  // New state for tracking statistics
  const [acceptedApplications, setAcceptedApplications] = useState<Application[]>([]);
  const [allApplications, setAllApplications] = useState<Application[]>([]);
  
  const { user } = useAuth();
  const { theme } = useTheme();
  const { toasts, removeToast, success, error: showError } = useToast();

  // Helper function for date formatting
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (error) {
      return 'Invalid Date';
    }
  };

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const fetchedJobs = await jobService.getEmployerJobs();
      setJobs(fetchedJobs);
      setError(null);
    } catch (error: any) {
      console.error('Error fetching jobs:', error);
      setError(error.message || 'Failed to fetch jobs');
    } finally {
      setLoading(false);
    }
  };

  const fetchApplications = async (jobId: string) => {
    try {
      setLoadingApplications(true);
      setSelectedJob(jobId);
      const fetchedApplications = await jobService.getJobApplications(jobId);
      
      // Store all applications for statistics
      setAllApplications(fetchedApplications);
      
      // Filter out rejected applications for display
      const activeApplications = fetchedApplications.filter((app: Application) => app.status !== 'rejected');
      setApplications(activeApplications);
      
      // Track accepted applications for "Hired This Month" counter
      const accepted = fetchedApplications.filter((app: Application) => app.status === 'accepted');
      setAcceptedApplications(accepted);
      
      setLastUpdated(new Date());
    } catch (error: any) {
      console.error('Error fetching applications:', error);
      showError('Fetch Failed', error.message || 'Failed to fetch applications');
    } finally {
      setLoadingApplications(false);
    }
  };

  const openDeleteDialog = (job: JobResponse) => {
    setDeleteDialog({
      isOpen: true,
      jobId: job._id || job.id || '',
      jobTitle: job.title,
      applicationsCount: job.applications_count || 0
    });
  };

  const closeDeleteDialog = () => {
    setDeleteDialog({
      isOpen: false,
      jobId: null,
      jobTitle: '',
      applicationsCount: 0
    });
  };

  const handleApplicationStatusUpdate = async (applicationId: string, status: string, notes?: string) => {
    try {
      setUpdatingApplicationId(applicationId);
      await jobService.updateApplicationStatus(applicationId, status, notes);
      
      // Update applications locally instead of refetching
      const updatedApplications = applications.map(app => 
        app._id === applicationId ? { ...app, status } : app
      );
      
      // Filter out rejected applications from display
      const activeApplications = updatedApplications.filter(app => app.status !== 'rejected');
      setApplications(activeApplications);
      
      // Update all applications for statistics
      const updatedAllApplications = allApplications.map(app => 
        app._id === applicationId ? { ...app, status } : app
      );
      setAllApplications(updatedAllApplications);
      
      // Update accepted applications count
      const accepted = updatedAllApplications.filter(app => app.status === 'accepted');
      setAcceptedApplications(accepted);
      
      // Update job applications count
      const updatedJobs = jobs.map(job => {
        if (job._id === selectedJob || job.id === selectedJob) {
          return {
            ...job,
            applications_count: activeApplications.length
          };
        }
        return job;
      });
      setJobs(updatedJobs);
      
      success(
        'Status Updated', 
        `Application ${status === 'accepted' ? 'accepted' : 'rejected'} successfully!`
      );
    } catch (error: any) {
      console.error('Error updating application status:', error);
      showError('Update Failed', error.message || 'Failed to update application status');
    } finally {
      setUpdatingApplicationId(null);
    }
  };

  const openApplicationDetail = (application: Application) => {
    setSelectedApplication(application);
    setIsApplicationDetailOpen(true);
  };

  const handleDeleteJob = async () => {
    if (!deleteDialog.jobId) return;

    try {
      setDeletingJob(true);
      await jobService.deleteJob(deleteDialog.jobId);
      
      // Close dialog and refresh jobs
      closeDeleteDialog();
      await fetchJobs();
      
      // Show success toast
      success('Job Deleted Successfully', `"${deleteDialog.jobTitle}" has been permanently deleted.`);
    } catch (err: any) {
      console.error('Error deleting job:', err);
      const errorMessage = err.message || 'Failed to delete job. Please try again.';
      setError(errorMessage);
      showError('Delete Failed', errorMessage);
    } finally {
      setDeletingJob(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const getDeleteMessage = () => {
    const { jobTitle, applicationsCount } = deleteDialog;
    
    if (applicationsCount > 0) {
      return `Are you sure you want to delete "${jobTitle}"? This job has ${applicationsCount} application${applicationsCount > 1 ? 's' : ''} and this action cannot be undone.`;
    }
    
    return `Are you sure you want to delete "${jobTitle}"? This action cannot be undone.`;
  };

  // Calculate statistics dynamically
  const activeJobsCount = jobs.length;
  const totalApplications = allApplications.length; // Use all applications for total count
  const activeApplicationsCount = applications.length; // Use filtered applications for display
  const profileViews = 0; // TODO: Implement profile views tracking
  const hiredThisMonth = acceptedApplications.length; // Count accepted applications

  // Stats array for the beautiful cards
  const stats = [
    {
      title: 'Active Jobs',
      value: activeJobsCount.toString(),
      change: `${activeJobsCount} posted`,
      icon: <Briefcase className="w-6 h-6" />,
      color: 'from-blue-500 to-cyan-500',
      trend: 'neutral'
    },
    {
      title: 'Total Applications',
      value: totalApplications.toString(),
      change: `${activeApplicationsCount} active`,
      icon: <Users className="w-6 h-6" />,
      color: 'from-green-500 to-emerald-500',
      trend: 'neutral'
    },
    {
      title: 'Profile Views',
      value: profileViews.toString(),
      change: '0% vs last month',
      icon: <Eye className="w-6 h-6" />,
      color: 'from-purple-500 to-pink-500',
      trend: 'neutral'
    },
    {
      title: 'Hired This Month',
      value: hiredThisMonth.toString(),
      change: `${hiredThisMonth} accepted`,
      icon: <TrendingUp className="w-6 h-6" />,
      color: 'from-orange-500 to-red-500',
      trend: 'neutral'
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" text="Loading your dashboard..." />
      </div>
    );
  }

  return (
    <>
      <ToastContainer toasts={toasts} onRemove={removeToast} />
      <div className="max-w-7xl mx-auto px-3 py-4 sm:px-4 sm:py-6 lg:px-8 lg:py-8">
      {/* Mobile-Optimized Header */}
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <div className="flex-1">
            <h1 className={`text-2xl sm:text-3xl font-bold mb-2 ${
              theme === 'light' ? 'text-gray-900' : 'text-white'
            }`}>
              Welcome back, {user?.name}! 👋
            </h1>
            <p className={`text-base sm:text-lg ${
              theme === 'light' ? 'text-gray-600' : 'text-gray-400'
            }`}>
              Here's what's happening with your hiring
            </p>
          </div>
          <Button
            variant="primary"
            size="lg"
            onClick={() => onNavigate?.('post-job')}
            icon={<Plus className="w-4 h-4 sm:w-5 sm:h-5" />}
            className="w-full sm:w-auto shadow-lg hover-lift text-sm sm:text-base"
          >
            Post New Job
          </Button>
        </div>
      </div>

        {error && (
          <Card className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-red-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-red-600 dark:text-red-400 font-medium text-sm sm:text-base">Error</p>
                <p className="text-red-600 dark:text-red-400 text-xs sm:text-sm">{error}</p>
              </div>
            </div>
          </Card>
        )}

      {/* Mobile-Optimized Stats Grid */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
        {stats.map((stat, index) => (
          <Card key={index} className="relative overflow-hidden p-3 sm:p-4 lg:p-6">
            <div className={`absolute top-0 right-0 w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-gradient-to-br ${stat.color} opacity-10 rounded-full -mr-6 -mt-6 sm:-mr-8 sm:-mt-8 lg:-mr-10 lg:-mt-10`} />
            <div className="relative">
              <div className="flex items-center justify-between mb-2 sm:mb-3 lg:mb-4">
                <div className={`w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-gradient-to-br ${stat.color} rounded-lg sm:rounded-xl lg:rounded-xl flex items-center justify-center text-white shadow-lg`}>
                  {stat.icon}
                </div>
                <Badge variant="outline" size="sm" className="text-xs">
                  New
                </Badge>
              </div>
              <h3 className={`text-lg sm:text-xl lg:text-2xl font-bold mb-1 ${
                theme === 'light' ? 'text-gray-900' : 'text-white'
              }`}>
                {stat.value}
              </h3>
              <p className={`text-xs sm:text-sm lg:text-sm font-medium ${
                theme === 'light' ? 'text-gray-600' : 'text-gray-400'
              }`}>
                {stat.title}
              </p>
              <p className={`text-xs mt-1 ${
                theme === 'light' ? 'text-gray-500' : 'text-gray-500'
              }`}>
                {stat.change}
              </p>
            </div>
          </Card>
        ))}
      </div>

      {/* Desktop Layout - Restored with Mobile Optimizations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
        {/* Recent Jobs - Mobile Optimized but Desktop Layout */}
        <div className="lg:col-span-2">
          <Card className="p-4 sm:p-6 lg:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 space-y-3 sm:space-y-0">
              <div>
                <h2 className={`text-lg sm:text-xl lg:text-xl font-bold ${
                  theme === 'light' ? 'text-gray-900' : 'text-white'
                }`}>
                  Your Job Postings ({jobs.length})
                </h2>
                {lastUpdated && (
                  <p className={`text-xs sm:text-sm ${
                    theme === 'light' ? 'text-gray-500' : 'text-gray-400'
                  }`}>
                    Last updated: {lastUpdated.toLocaleTimeString()}
                  </p>
                )}
              </div>
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={fetchJobs}
                  disabled={loading}
                  icon={loading ? <RefreshCw className="w-3 h-3 sm:w-4 sm:h-4 animate-spin" /> : undefined}
                  className="text-xs sm:text-sm"
                >
                  {loading ? 'Refreshing...' : 'Refresh'}
                </Button>
                <Button variant="outline" size="sm" className="text-xs sm:text-sm">
                  View All
                </Button>
              </div>
            </div>
            
            {jobs.length === 0 ? (
              <div className="text-center py-8 sm:py-12 lg:py-12 border border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
                <Briefcase className="w-8 h-8 sm:w-12 sm:h-12 lg:w-12 lg:h-12 mx-auto text-gray-400 mb-3 sm:mb-4" />
                <h3 className="text-base sm:text-lg lg:text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No job postings yet
                </h3>
                <p className="text-xs sm:text-sm lg:text-sm text-gray-600 dark:text-gray-400 mb-4 sm:mb-6 max-w-md mx-auto">
                  Start attracting top talent by posting your first job opening.
                </p>
                <Button
                  variant="primary"
                  onClick={() => onNavigate?.('post-job')}
                  icon={<Plus className="w-3 h-3 sm:w-4 sm:h-4" />}
                  className="text-xs sm:text-sm"
                >
                  Post Your First Job
                </Button>
              </div>
            ) : (
              <div className="space-y-3 sm:space-y-4 lg:space-y-4">
                {jobs.map(job => (
                  <div key={job._id || job.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-3 sm:p-4 lg:p-4 hover:shadow-md transition-shadow">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between space-y-3 lg:space-y-0 lg:space-x-4">
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 mb-2">
                          <h3 className="text-base sm:text-lg lg:text-lg font-semibold text-gray-900 dark:text-white">
                            {job.title}
                          </h3>
                          <div className="flex space-x-2">
                            <Badge variant="success" className="text-xs">
                              {job.status || 'Published'}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {job.applications_count || 0} applications
                            </Badge>
                          </div>
                        </div>
                        
                        {/* Mobile-optimized job details */}
                        <div className="space-y-2 sm:space-y-0 sm:flex sm:flex-wrap sm:gap-4 text-xs sm:text-sm lg:text-sm text-gray-600 dark:text-gray-400 mb-2">
                          <div className="flex items-center space-x-1">
                            <MapPin className="w-3 h-3 sm:w-4 sm:h-4" />
                            <span>{job.location}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                            <span>{job.job_type?.replace('_', ' ')}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <DollarSign className="w-3 h-3 sm:w-4 sm:h-4" />
                            <span>
                              {job.salary_min && job.salary_max 
                                  ? `₹${job.salary_min.toLocaleString()} - ₹${job.salary_max.toLocaleString()}`
                                : 'Salary not disclosed'
                              }
                            </span>
                          </div>
                        </div>
                        
                        <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                          <span>Employer: {job.employer_name}</span>
                          <span className="mx-2">•</span>
                          <span>Company: {job.company_name}</span>
                          <span className="mx-2">•</span>
                          <span>Created: {job.created_at ? new Date(job.created_at).toLocaleDateString() : 'Unknown'}</span>
                        </div>
                        
                        <p className="text-xs sm:text-sm lg:text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                          {job.description}
                        </p>
                      </div>
                      
                      {/* Mobile-optimized action buttons */}
                      <div className="flex flex-col sm:flex-row lg:flex-col space-y-2 sm:space-y-0 sm:space-x-2 lg:space-y-2 lg:space-x-0">
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => fetchApplications(job._id || job.id || '')}
                          disabled={loadingApplications && selectedJob === (job._id || job.id)}
                          className="w-full sm:w-auto lg:w-full text-xs"
                        >
                          <Eye className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                          {loadingApplications && selectedJob === (job._id || job.id) ? 'Loading...' : 'View Applications'}
                        </Button>
                        <Button 
                          variant="outline"
                          size="sm" 
                          onClick={() => openDeleteDialog(job)}
                          className="w-full sm:w-auto lg:w-full text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 border-red-300 hover:border-red-400 text-xs"
                        >
                          <Trash2 className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Recent Applications - Mobile Optimized but Desktop Layout */}
        <div className="lg:col-span-1">
          <Card className="p-4 sm:p-6 lg:p-6">
            <div className="flex flex-col sm:flex-row lg:flex-col sm:items-center sm:justify-between lg:items-start lg:justify-start mb-4 sm:mb-6 space-y-3 sm:space-y-0 lg:space-y-3">
              <h2 className={`text-lg sm:text-xl lg:text-xl font-bold ${
                theme === 'light' ? 'text-gray-900' : 'text-white'
              }`}>
                Recent Applications ({totalApplications})
              </h2>
              <Button variant="outline" size="sm" className="w-full sm:w-auto lg:w-full text-xs sm:text-sm">
                View All
              </Button>
            </div>
            
            {totalApplications === 0 ? (
              <div className="text-center py-6 sm:py-8 lg:py-8 border border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
                <Users className="w-8 h-8 sm:w-12 sm:h-12 lg:w-12 lg:h-12 mx-auto text-gray-400 mb-3 sm:mb-4" />
                <h3 className="text-base sm:text-lg lg:text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No applications yet
                </h3>
                <p className="text-xs sm:text-sm lg:text-sm text-gray-600 dark:text-gray-400 mb-4 max-w-md mx-auto">
                  Post a job to start receiving applications from qualified candidates.
                </p>
              </div>
            ) : (
              <div className="space-y-3 sm:space-y-4 lg:space-y-4">
                <div className="grid grid-cols-3 gap-2 sm:gap-4 lg:gap-3 mb-4">
                  <div className="text-center p-2 sm:p-3 lg:p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="text-lg sm:text-xl lg:text-xl font-bold text-blue-600 dark:text-blue-400">
                      {allApplications.filter(app => app.status === 'pending').length}
                    </div>
                    <div className="text-xs text-blue-600 dark:text-blue-400">Pending</div>
                  </div>
                  <div className="text-center p-2 sm:p-3 lg:p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div className="text-lg sm:text-xl lg:text-xl font-bold text-green-600 dark:text-green-400">
                      {allApplications.filter(app => app.status === 'accepted').length}
                    </div>
                    <div className="text-xs text-green-600 dark:text-green-400">Accepted</div>
                  </div>
                  <div className="text-center p-2 sm:p-3 lg:p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                    <div className="text-lg sm:text-xl lg:text-xl font-bold text-red-600 dark:text-red-400">
                      {allApplications.filter(app => app.status === 'rejected').length}
                    </div>
                    <div className="text-xs text-red-600 dark:text-red-400">Rejected</div>
                  </div>
                </div>
                <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <p className="text-xs sm:text-sm lg:text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Note:</span> Rejected applications are automatically hidden from the main view to keep your dashboard clean.
                  </p>
                </div>
              </div>
            )}
          </Card>

          {/* Quick Actions - Mobile Optimized but Desktop Layout */}
          <Card className="p-4 sm:p-6 lg:p-6 mt-4 sm:mt-6 lg:mt-6">
            <h3 className={`text-lg font-semibold mb-4 ${
              theme === 'light' ? 'text-gray-900' : 'text-white'
            }`}>
              Quick Actions
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3 sm:gap-4 lg:gap-3">
              <Button
                variant="outline"
                fullWidth
                icon={<Users className="w-3 h-3 sm:w-4 sm:h-4" />}
                className="justify-start text-xs sm:text-sm"
              >
                Browse Candidates
              </Button>
              <Button
                variant="outline"
                fullWidth
                icon={<BarChart3 className="w-3 h-3 sm:w-4 sm:h-4" />}
                className="justify-start text-xs sm:text-sm"
                onClick={() => {
                  // Close applications modal if open
                  if (selectedJob) {
                    setSelectedJob(null);
                    setApplications([]);
                    setAllApplications([]);
                  }
                  setIsAnalyticsOpen(true);
                }}
              >
                View Analytics
              </Button>
              <Button
                variant="outline"
                fullWidth
                icon={<Star className="w-3 h-3 sm:w-4 sm:h-4" />}
                className="justify-start text-xs sm:text-sm"
              >
                Upgrade Plan
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {/* Analytics Section - Mobile Optimized but Desktop Layout */}
      <div className="mt-4 sm:mt-6 lg:mt-8">
        <Card className="p-4 sm:p-6 lg:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 space-y-3 sm:space-y-0">
            <h2 className={`text-lg sm:text-xl lg:text-xl font-bold ${
              theme === 'light' ? 'text-gray-900' : 'text-white'
            }`}>
              Hiring Analytics
            </h2>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" className="text-xs sm:text-sm">
                Last 7 days
              </Button>
              <Button variant="outline" size="sm" className="text-xs sm:text-sm">
                Last 30 days
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 lg:gap-6">
            <div className="text-center">
              <div className={`w-12 h-12 sm:w-16 sm:h-16 lg:w-16 lg:h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3 lg:mb-3 ${
                theme === 'dark-neon' ? 'shadow-lg shadow-blue-500/25' : 'shadow-lg'
              }`}>
                <Activity className="w-6 h-6 sm:w-8 sm:h-8 lg:w-8 lg:h-8 text-white" />
              </div>
              <h3 className={`text-xl sm:text-2xl lg:text-2xl font-bold ${
                theme === 'light' ? 'text-gray-900' : 'text-white'
              }`}>
                {totalApplications > 0 ? Math.round((acceptedApplications.length / totalApplications) * 100) : 0}%
              </h3>
              <p className={`text-xs sm:text-sm lg:text-sm ${
                theme === 'light' ? 'text-gray-600' : 'text-gray-400'
              }`}>
                Application Acceptance Rate
              </p>
            </div>
            
            <div className="text-center">
              <div className={`w-12 h-12 sm:w-16 sm:h-16 lg:w-16 lg:h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3 lg:mb-3 ${
                theme === 'dark-neon' ? 'shadow-lg shadow-green-500/25' : 'shadow-lg'
              }`}>
                <PieChart className="w-6 h-6 sm:w-8 sm:h-8 lg:w-8 lg:h-8 text-white" />
              </div>
              <h3 className={`text-xl sm:text-2xl lg:text-2xl font-bold ${
                theme === 'light' ? 'text-gray-900' : 'text-white'
              }`}>
                {acceptedApplications.length}
              </h3>
              <p className={`text-xs sm:text-sm lg:text-sm ${
                theme === 'light' ? 'text-gray-600' : 'text-gray-400'
              }`}>
                Total Hires This Month
              </p>
            </div>
            
            <div className="text-center">
              <div className={`w-12 h-12 sm:w-16 sm:h-16 lg:w-16 lg:h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3 lg:mb-3 ${
                theme === 'dark-neon' ? 'shadow-lg shadow-purple-500/25' : 'shadow-lg'
              }`}>
                <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 lg:w-8 lg:h-8 text-white" />
              </div>
              <h3 className={`text-xl sm:text-2xl lg:text-2xl font-bold ${
                theme === 'light' ? 'text-gray-900' : 'text-white'
              }`}>
                {allApplications.filter(app => app.status === 'pending').length}
              </h3>
              <p className={`text-xs sm:text-sm lg:text-sm ${
                theme === 'light' ? 'text-gray-600' : 'text-gray-400'
              }`}>
                Pending Applications
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Skills in Demand - Mobile Optimized but Desktop Layout */}
      <div className="mb-6 sm:mb-8 lg:mb-8 mt-4 sm:mt-6 lg:mt-8">
        <h2 className={`text-xl sm:text-2xl lg:text-2xl font-bold mb-4 sm:mb-6 lg:mb-6 ${
          theme === 'light' ? 'text-gray-900' : 'text-white'
        }`}>
          Skills in Demand
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4 lg:gap-4">
          {['React', 'Python', 'AWS', 'Docker', 'Kubernetes', 'Machine Learning'].map((skill) => (
            <Card key={skill} className="p-3 sm:p-4 lg:p-4 text-center hover:shadow-md transition-shadow cursor-pointer">
              <div className={`text-xs sm:text-sm lg:text-sm font-medium ${
                theme === 'light' ? 'text-gray-900' : 'text-white'
              }`}>
                {skill}
              </div>
              <div className="text-xs text-green-600 mt-1">+15% demand</div>
            </Card>
          ))}
        </div>
      </div>

        {/* Delete Confirmation Dialog */}
      <ConfirmDialog
          isOpen={deleteDialog.isOpen}
          onClose={closeDeleteDialog}
          onConfirm={handleDeleteJob}
          title="Delete Job Posting"
          message={getDeleteMessage()}
        confirmText="Delete Job"
        cancelText="Cancel"
        variant="danger"
          loading={deletingJob}
        />

        {/* Applications Modal - Mobile Optimized */}
        {selectedJob && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-full sm:max-w-4xl max-h-[90vh] sm:max-h-[80vh] overflow-y-auto">
              <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                    Applications ({applications.length} active)
                  </h2>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setSelectedJob(null);
                      setApplications([]);
                      setAllApplications([]);
                    }}
                    className="p-2"
                  >
                    ×
                  </Button>
                </div>
                
                {/* Application Statistics - Mobile Optimized */}
                <div className="mt-4 grid grid-cols-3 gap-2 sm:gap-4">
                  <div className="text-center p-2 sm:p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="text-lg sm:text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {allApplications.filter(app => app.status === 'pending').length}
                    </div>
                    <div className="text-xs sm:text-sm text-blue-600 dark:text-blue-400">Pending</div>
                  </div>
                  <div className="text-center p-2 sm:p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div className="text-lg sm:text-2xl font-bold text-green-600 dark:text-green-400">
                      {allApplications.filter(app => app.status === 'accepted').length}
                    </div>
                    <div className="text-xs sm:text-sm text-green-600 dark:text-green-400">Accepted</div>
                  </div>
                  <div className="text-center p-2 sm:p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                    <div className="text-lg sm:text-2xl font-bold text-red-600 dark:text-red-400">
                      {allApplications.filter(app => app.status === 'rejected').length}
                    </div>
                    <div className="text-xs sm:text-sm text-red-600 dark:text-red-400">Rejected</div>
                  </div>
                </div>
              </div>
              
              <div className="p-4 sm:p-6">
                {applications.length === 0 ? (
                  <div className="text-center py-6 sm:py-8">
                    <Users className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-3 sm:mb-4" />
                    <h3 className="text-base sm:text-lg font-medium text-gray-900 dark:text-white mb-2">
                      {allApplications.length === 0 ? 'No applications yet' : 'No active applications'}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                      {allApplications.length === 0 
                        ? 'Applications will appear here when candidates apply to your job.'
                        : 'All applications have been processed. Rejected applications are hidden from this view.'
                      }
                    </p>
                    {allApplications.length > 0 && (
                      <div className="mt-4 p-3 sm:p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                          Total applications: {allApplications.length} | 
                          Active: {applications.length} | 
                          Rejected: {allApplications.filter(app => app.status === 'rejected').length}
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4 sm:space-y-6">
                    {applications.map((app) => (
                      <Card key={app._id} className="p-4 sm:p-6 hover-lift transition-all duration-300 border-l-4 border-l-blue-500 application-card">
                        <div className="flex flex-col space-y-3 sm:space-y-4">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h4 className="font-semibold text-base sm:text-lg text-gray-900 dark:text-white">
                                {app.applicant_name}
                              </h4>
                              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-1 sm:mb-2">
                                {app.applicant_email}
                              </p>
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                Applied: {formatDate(app.created_at)}
                              </div>
                            </div>
                            <div className="flex items-center space-x-2 sm:space-x-3">
                              <Badge 
                                variant={
                                  app.status === 'accepted' ? 'success' : 
                                  app.status === 'rejected' ? 'error' : 
                                  'outline'
                                }
                                className={
                                  app.status === 'accepted' ? 'status-accepted' : 
                                  app.status === 'rejected' ? 'status-rejected' : 
                                  'status-pending'
                                }
                              >
                                {app.status}
                              </Badge>
                            </div>
                          </div>

                          {/* Quick Info Grid - Mobile Optimized */}
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 p-3 sm:p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                            {app.years_of_experience && (
                              <div>
                                <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Experience</p>
                                <p className="text-xs sm:text-sm text-gray-900 dark:text-white">{app.years_of_experience}</p>
                              </div>
                            )}
                            {app.work_authorization && (
                              <div>
                                <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Work Auth</p>
                                <p className="text-xs sm:text-sm text-gray-900 dark:text-white">{app.work_authorization}</p>
                              </div>
                            )}
                            {app.notice_period && (
                              <div>
                                <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Notice Period</p>
                                <p className="text-xs sm:text-sm text-gray-900 dark:text-white">{app.notice_period}</p>
                              </div>
                            )}
                            {app.availability_start_date && (
                              <div>
                                <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Available From</p>
                                <p className="text-xs sm:text-sm text-gray-900 dark:text-white">{app.availability_start_date}</p>
                              </div>
                            )}
                          </div>

                          {/* Cover Letter Preview */}
                          {app.cover_letter && (
                            <div className="mb-3 sm:mb-4">
                              <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 mb-1 sm:mb-2">Cover Letter:</p>
                              <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 line-clamp-3">
                                {app.cover_letter}
                              </p>
                            </div>
                          )}

                          {/* Skills */}
                          {app.relevant_skills && (
                            <div className="mb-3 sm:mb-4">
                              <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 mb-1 sm:mb-2">Relevant Skills:</p>
                              <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                                {app.relevant_skills}
                              </p>
                            </div>
                          )}

                          {/* Action Buttons - Mobile Optimized */}
                          <div className="flex flex-col sm:flex-row items-center justify-between pt-3 sm:pt-4 border-t border-gray-200 dark:border-gray-700 space-y-2 sm:space-y-0 sm:space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openApplicationDetail(app)}
                              className="w-full sm:w-auto text-blue-600 hover:text-blue-700 text-xs"
                            >
                              <Eye className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                              View Details
                            </Button>
                            
                            {app.status === 'pending' && (
                              <div className="flex flex-col sm:flex-row w-full sm:w-auto space-y-2 sm:space-y-0 sm:space-x-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleApplicationStatusUpdate(app._id, 'rejected')}
                                  disabled={updatingApplicationId === app._id}
                                  className="w-full sm:w-auto text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 border-red-300 text-xs"
                                >
                                  {updatingApplicationId === app._id ? (
                                    <LoadingSpinner size="sm" />
                                  ) : (
                                    <>
                                      <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                                      Reject
                                    </>
                                  )}
                                </Button>
                                <Button
                                  variant="primary"
                                  size="sm"
                                  onClick={() => handleApplicationStatusUpdate(app._id, 'accepted')}
                                  disabled={updatingApplicationId === app._id}
                                  className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-xs"
                                >
                                  {updatingApplicationId === app._id ? (
                                    <LoadingSpinner size="sm" />
                                  ) : (
                                    <>
                                      <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                                      Accept
                                    </>
                                  )}
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Application Detail Modal */}
        <ApplicationDetailModal
          isOpen={isApplicationDetailOpen}
          onClose={() => setIsApplicationDetailOpen(false)}
          application={selectedApplication}
          onStatusUpdate={handleApplicationStatusUpdate}
          isUpdating={updatingApplicationId === selectedApplication?._id}
        />

        {/* Analytics Modal */}
        {isAnalyticsOpen && (
          <EmployerAnalytics onClose={() => setIsAnalyticsOpen(false)} />
        )}
      </div>
    </>
  );
};