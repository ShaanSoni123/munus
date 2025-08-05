import React, { useState, useEffect } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { 
  Users, 
  TrendingUp,
  BarChart3,
  Calendar,
  Briefcase,
  X
} from 'lucide-react';

interface Application {
  _id: string;
  applicant_name: string;
  applicant_email: string;
  cover_letter: string;
  status: string;
  created_at: string;
  job_title?: string;
  job_id?: string;
  years_of_experience?: string;
  relevant_skills?: string;
  work_authorization?: string;
  notice_period?: string;
}

interface JobResponse {
  _id?: string;
  id?: string;
  title: string;
  applications_count?: number;
}

interface EmployerAnalyticsProps {
  onClose: () => void;
}

export const EmployerAnalytics: React.FC<EmployerAnalyticsProps> = ({ onClose }) => {
  const [jobs, setJobs] = useState<JobResponse[]>([]);
  const [allApplications, setAllApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { user } = useAuth();
  const { theme } = useTheme();

  // Fetch data with mock data for testing
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Mock data for testing
        const mockJobs: JobResponse[] = [
          {
            _id: '1',
            title: 'Software Engineer',
            applications_count: 5
          },
          {
            _id: '2', 
            title: 'Product Manager',
            applications_count: 3
          }
        ];
        
        const mockApplications: Application[] = [
          {
            _id: '1',
            applicant_name: 'John Doe',
            applicant_email: 'john@example.com',
            cover_letter: 'I am excited to apply for this position...',
            status: 'pending',
            created_at: '2024-01-15',
            job_title: 'Software Engineer',
            job_id: '1',
            years_of_experience: '3',
            relevant_skills: 'React, Node.js, TypeScript',
            work_authorization: 'Yes',
            notice_period: '2 weeks'
          },
          {
            _id: '2',
            applicant_name: 'Jane Smith',
            applicant_email: 'jane@example.com',
            cover_letter: 'I have 5 years of experience...',
            status: 'accepted',
            created_at: '2024-01-14',
            job_title: 'Software Engineer',
            job_id: '1',
            years_of_experience: '5',
            relevant_skills: 'Python, Django, AWS',
            work_authorization: 'Yes',
            notice_period: 'Immediate'
          },
          {
            _id: '3',
            applicant_name: 'Mike Johnson',
            applicant_email: 'mike@example.com',
            cover_letter: 'I am passionate about product management...',
            status: 'pending',
            created_at: '2024-01-13',
            job_title: 'Product Manager',
            job_id: '2',
            years_of_experience: '4',
            relevant_skills: 'Product Strategy, Agile, User Research',
            work_authorization: 'Yes',
            notice_period: '1 week'
          }
        ];
        
        setJobs(mockJobs);
        setAllApplications(mockApplications);
        
        console.log('Analytics loaded successfully');
        
      } catch (error: any) {
        console.error('Error in analytics:', error);
        setError('Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Calculate stats
  const totalApplications = allApplications.length;
  const pendingApplications = allApplications.filter(app => app.status === 'pending').length;
  const acceptedApplications = allApplications.filter(app => app.status === 'accepted').length;
  const acceptanceRate = totalApplications > 0 ? Math.round((acceptedApplications / totalApplications) * 100) : 0;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'rejected': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-white z-[60] flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" text="Loading analytics..." />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-white z-[60] flex items-center justify-center">
        <div className="text-center max-w-md mx-4">
          <h2 className="text-xl font-bold text-red-600 mb-4">Error Loading Analytics</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={onClose} className="bg-red-600 hover:bg-red-700 text-white">
            Close
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-white z-[60]">
      <div className="w-full h-full overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 z-10 shadow-sm">
          <div className="flex justify-between items-center">
            <div>
              <h1 className={`text-2xl font-bold ${
                theme === 'light' ? 'text-gray-900' : 'text-white'
              }`}>
                View Analytics
              </h1>
              <p className={`text-sm ${
                theme === 'light' ? 'text-gray-600' : 'text-gray-400'
              }`}>
                {totalApplications} applications across {jobs.length} jobs
              </p>
            </div>
            <Button
              variant="outline"
              onClick={onClose}
              className="flex items-center gap-2 hover:bg-gray-100 border-gray-300"
            >
              <X className="w-4 h-4" />
              Close Analytics
            </Button>
          </div>
        </div>

        <div className="p-8 space-y-8 max-w-7xl mx-auto">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="p-4 hover:shadow-md transition-all duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium ${
                    theme === 'light' ? 'text-gray-600' : 'text-gray-400'
                  }`}>
                    Total Applications
                  </p>
                  <p className={`text-2xl font-bold ${
                    theme === 'light' ? 'text-gray-900' : 'text-white'
                  }`}>
                    {totalApplications}
                  </p>
                </div>
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                  theme === 'light' ? 'bg-green-100' : 'bg-blue-900/20'
                }`}>
                  <Users className={`w-6 h-6 ${
                    theme === 'light' ? 'text-green-600' : 'text-blue-400'
                  }`} />
                </div>
              </div>
            </Card>

            <Card className="p-4 hover:shadow-md transition-all duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium ${
                    theme === 'light' ? 'text-gray-600' : 'text-gray-400'
                  }`}>
                    Acceptance Rate
                  </p>
                  <p className={`text-2xl font-bold ${
                    theme === 'light' ? 'text-gray-900' : 'text-white'
                  }`}>
                    {acceptanceRate}%
                  </p>
                </div>
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                  theme === 'light' ? 'bg-green-100' : 'bg-green-900/20'
                }`}>
                  <TrendingUp className={`w-6 h-6 ${
                    theme === 'light' ? 'text-green-600' : 'text-green-400'
                  }`} />
                </div>
              </div>
            </Card>

            <Card className="p-4 hover:shadow-md transition-all duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium ${
                    theme === 'light' ? 'text-gray-600' : 'text-gray-400'
                  }`}>
                    Pending Review
                  </p>
                  <p className={`text-2xl font-bold ${
                    theme === 'light' ? 'text-gray-900' : 'text-white'
                  }`}>
                    {pendingApplications}
                  </p>
                </div>
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                  theme === 'light' ? 'bg-yellow-100' : 'bg-yellow-900/20'
                }`}>
                  <Calendar className={`w-6 h-6 ${
                    theme === 'light' ? 'text-yellow-600' : 'text-yellow-400'
                  }`} />
                </div>
              </div>
            </Card>

            <Card className="p-4 hover:shadow-md transition-all duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium ${
                    theme === 'light' ? 'text-gray-600' : 'text-gray-400'
                  }`}>
                    Successful Hires
                  </p>
                  <p className={`text-2xl font-bold ${
                    theme === 'light' ? 'text-gray-900' : 'text-white'
                  }`}>
                    {acceptedApplications}
                  </p>
                </div>
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                  theme === 'light' ? 'bg-green-100' : 'bg-purple-900/20'
                }`}>
                  <Briefcase className={`w-6 h-6 ${
                    theme === 'light' ? 'text-green-600' : 'text-purple-400'
                  }`} />
                </div>
              </div>
            </Card>
          </div>

          {/* Candidates List */}
          <Card className="p-6">
            <h3 className={`text-lg font-semibold mb-4 ${
              theme === 'light' ? 'text-gray-900' : 'text-white'
            }`}>
              Recent Candidates ({allApplications.length})
            </h3>
            
                          <div className="space-y-4">
                {allApplications.map((application) => (
                  <Card key={application._id} className="p-4 hover:shadow-md transition-all duration-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className={`font-semibold ${
                          theme === 'light' ? 'text-gray-900' : 'text-white'
                        }`}>
                          {application.applicant_name}
                        </h4>
                        <p className={`text-sm ${
                          theme === 'light' ? 'text-gray-600' : 'text-gray-400'
                        }`}>
                          {application.applicant_email}
                        </p>
                        <p className={`text-sm ${
                          theme === 'light' ? 'text-gray-600' : 'text-gray-400'
                        }`}>
                          Applied for: {application.job_title}
                        </p>
                        {application.years_of_experience && (
                          <p className={`text-sm ${
                            theme === 'light' ? 'text-gray-600' : 'text-gray-400'
                          }`}>
                            Experience: {application.years_of_experience} years
                          </p>
                        )}
                      </div>
                      <Badge 
                        variant="outline" 
                        className={`${getStatusColor(application.status)} rounded-full px-3 py-1 text-xs font-medium`}
                      >
                        {application.status}
                      </Badge>
                    </div>
                  </Card>
                ))}
              </div>
          </Card>
        </div>
      </div>
    </div>
  );
}; 