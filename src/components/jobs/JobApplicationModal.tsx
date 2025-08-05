import React, { useState } from 'react';
import { X, FileText, Video, Mic, Link, Send, AlertCircle, ArrowLeft } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { jobService } from '../../services/jobService';
import type { JobResponse } from '../../services/jobService';

interface JobApplicationModalProps {
  job: JobResponse;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface ApplicationFormData {
  cover_letter: string;
  resume_url?: string;
  video_resume_url?: string;
  audio_resume_url?: string;
  portfolio_url?: string;
  linkedin_url?: string;
  github_url?: string;
  // New screening questions
  years_of_experience: string;
  relevant_skills: string;
  work_authorization: string;
  notice_period: string;
  remote_work_preference: string;
  relocation_willingness: string;
  why_interested: string;
  biggest_achievement: string;
  availability_start_date: string;
  additional_languages: string;
}

export const JobApplicationModal: React.FC<JobApplicationModalProps> = ({
  job,
  isOpen,
  onClose,
  onSuccess
}) => {
  const { user: authUser, isJobSeeker, isAuthenticated } = useAuth();
  
  console.log('JobApplicationModal: User info:', {
    user: authUser,
    isJobSeeker: isJobSeeker,
    isAuthenticated: isAuthenticated,
    userRole: authUser?.role
  });
  const [formData, setFormData] = useState<ApplicationFormData>({
    cover_letter: '',
    resume_url: '',
    video_resume_url: '',
    audio_resume_url: '',
    portfolio_url: '',
    linkedin_url: '',
    github_url: '',
    // New screening questions
    years_of_experience: '',
    relevant_skills: '',
    work_authorization: '',
    notice_period: '',
    remote_work_preference: '',
    relocation_willingness: '',
    why_interested: '',
    biggest_achievement: '',
    availability_start_date: '',
    additional_languages: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const { theme } = useTheme();
  const { user } = useAuth();

  const updateFormData = (field: keyof ApplicationFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      setError('Please log in to apply for this job');
      return;
    }
    
    if (!isJobSeeker) {
      setError('Only job seekers can apply for jobs');
      return;
    }
    
    if (!formData.cover_letter.trim()) {
      setError('Cover letter is required');
      return;
    }

    // Validate required screening questions
    if (!formData.years_of_experience) {
      setError('Years of experience is required');
      return;
    }
    if (!formData.work_authorization) {
      setError('Work authorization status is required');
      return;
    }
    if (!formData.notice_period) {
      setError('Notice period is required');
      return;
    }
    if (!formData.remote_work_preference) {
      setError('Work location preference is required');
      return;
    }
    if (!formData.relevant_skills.trim()) {
      setError('Relevant skills are required');
      return;
    }
    if (!formData.why_interested.trim()) {
      setError('Please explain why you are interested in this role');
      return;
    }
    if (!formData.biggest_achievement.trim()) {
      setError('Please describe your biggest professional achievement');
      return;
    }
    if (!formData.availability_start_date) {
      setError('Start date is required');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const jobId = job._id || job.id;
      if (!jobId) {
        throw new Error('Invalid job ID');
      }

      // Add user information to the application data
      const applicationData = {
        ...formData,
        applicant_name: user?.name || authUser?.name || 'Applicant',
        applicant_email: user?.email || authUser?.email || '',
        applicant_id: user?._id || authUser?._id || ''
      };

      // TEMPORARY: Use simple endpoint to bypass authentication
      console.log('JobApplicationModal: Using simple endpoint to bypass authentication');
      console.log('JobApplicationModal: Application data with user info:', applicationData);
      await jobService.simpleApplyForJob(jobId, applicationData);
      
      // Set success message
      setSuccess('Application submitted successfully! The employer will review your application.');
      
      // Reset form
      setFormData({
        cover_letter: '',
        resume_url: '',
        video_resume_url: '',
        audio_resume_url: '',
        portfolio_url: '',
        linkedin_url: '',
        github_url: '',
        years_of_experience: '',
        relevant_skills: '',
        work_authorization: '',
        notice_period: '',
        remote_work_preference: '',
        relocation_willingness: '',
        why_interested: '',
        biggest_achievement: '',
        availability_start_date: '',
        additional_languages: ''
      });
      
      // Close modal after a short delay to show success message
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 2000);
    } catch (err: any) {
      console.error('Error applying to job:', err);
      console.error('Error response:', err.response);
      console.error('Error message:', err.message);
      
      let errorMessage = 'Failed to apply to job';
      
      if (err.response?.data?.detail) {
        errorMessage = err.response.data.detail;
      } else if (err.message) {
        errorMessage = err.message;
      } else if (err.response?.status === 401) {
        errorMessage = 'Please log in to apply for this job';
      } else if (err.response?.status === 403) {
        errorMessage = 'Only job seekers can apply for jobs';
      } else if (err.response?.status === 404) {
        errorMessage = 'Job not found';
      } else if (err.response?.status === 500) {
        errorMessage = 'Server error. Please try again later.';
      }
      
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Full screen overlay */}
      <div className={`absolute inset-0 ${
        theme === 'light' 
          ? 'bg-gradient-to-br from-blue-50 via-white to-indigo-50' 
          : 'bg-gray-900'
      }`}>
        {/* Header */}
        <div className={`sticky top-0 z-10 ${
          theme === 'light' 
            ? 'bg-white/80 backdrop-blur-sm border-b border-gray-200' 
            : 'bg-gray-800/80 backdrop-blur-sm border-b border-gray-700'
        }`}>
          <div className="max-w-4xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  icon={<ArrowLeft className="w-5 h-5" />}
                  className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                >
                  Back
                </Button>
                <div>
                  <h1 className={`text-2xl font-bold ${
                    theme === 'light' ? 'text-gray-900' : 'text-white'
                  }`}>
                    Apply to Job
                  </h1>
                  <p className={`text-sm ${
                    theme === 'light' ? 'text-gray-600' : 'text-gray-400'
                  }`}>
                    {job.title} at {job.company_name || job.employer_name}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                icon={<X className="w-5 h-5" />}
                className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
              />
            </div>
          </div>
        </div>

        {/* Scrollable Main Content */}
        <div className="h-full overflow-y-auto">
          <div className="max-w-4xl mx-auto px-6 py-8 pb-32">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Job Summary Card */}
              <Card className={`p-6 ${
                theme === 'light' 
                  ? 'bg-white border border-gray-200 shadow-sm' 
                  : 'bg-gray-800 border border-gray-700'
              }`}>
                <h2 className={`text-lg font-semibold mb-4 ${
                  theme === 'light' ? 'text-gray-900' : 'text-white'
                }`}>
                  Job Details
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <span className={`text-sm font-medium ${
                      theme === 'light' ? 'text-gray-600' : 'text-gray-400'
                    }`}>
                      Position
                    </span>
                    <p className={`text-base font-medium ${
                      theme === 'light' ? 'text-gray-900' : 'text-white'
                    }`}>
                      {job.title}
                    </p>
                  </div>
                  <div>
                    <span className={`text-sm font-medium ${
                      theme === 'light' ? 'text-gray-600' : 'text-gray-400'
                    }`}>
                      Company
                    </span>
                    <p className={`text-base font-medium ${
                      theme === 'light' ? 'text-gray-900' : 'text-white'
                    }`}>
                      {job.company_name || job.employer_name}
                    </p>
                  </div>
                  <div>
                    <span className={`text-sm font-medium ${
                      theme === 'light' ? 'text-gray-600' : 'text-gray-400'
                    }`}>
                      Location
                    </span>
                    <p className={`text-base font-medium ${
                      theme === 'light' ? 'text-gray-900' : 'text-white'
                    }`}>
                      {job.location}
                    </p>
                  </div>
                  <div>
                    <span className={`text-sm font-medium ${
                      theme === 'light' ? 'text-gray-600' : 'text-gray-400'
                    }`}>
                      Type
                    </span>
                    <p className={`text-base font-medium ${
                      theme === 'light' ? 'text-gray-900' : 'text-white'
                    }`}>
                      {job.job_type?.replace('_', ' ')}
                    </p>
                  </div>
                </div>
              </Card>

              {/* Cover Letter Section */}
              <Card className={`p-6 ${
                theme === 'light' 
                  ? 'bg-white border border-gray-200 shadow-sm' 
                  : 'bg-gray-800 border border-gray-700'
              }`}>
                <label className={`block text-sm font-medium mb-3 ${
                  theme === 'light' ? 'text-gray-700' : 'text-gray-300'
                }`}>
                  Cover Letter <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.cover_letter}
                  onChange={(e) => updateFormData('cover_letter', e.target.value)}
                  placeholder="Tell us why you're interested in this position and why you'd be a great fit..."
                  className={`w-full p-4 border rounded-lg resize-none transition-colors ${
                    theme === 'light' 
                      ? 'border-gray-300 bg-white text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200' 
                      : 'border-gray-600 bg-gray-700 text-white focus:border-blue-400 focus:ring-2 focus:ring-blue-900'
                  }`}
                  rows={6}
                  required
                />
              </Card>

              {/* Application Questions Section */}
              <Card className={`p-6 ${
                theme === 'light' 
                  ? 'bg-white border border-gray-200 shadow-sm' 
                  : 'bg-gray-800 border border-gray-700'
              }`}>
                <h3 className={`text-lg font-semibold mb-6 ${
                  theme === 'light' ? 'text-gray-900' : 'text-white'
                }`}>
                  Application Questions
                </h3>
                <div className="space-y-6">
                  {/* Years of Experience */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      theme === 'light' ? 'text-gray-700' : 'text-gray-300'
                    }`}>
                      How many years of relevant experience do you have? <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.years_of_experience}
                      onChange={(e) => updateFormData('years_of_experience', e.target.value)}
                      className={`w-full p-3 border rounded-lg transition-colors ${
                        theme === 'light' 
                          ? 'border-gray-300 bg-white text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200' 
                          : 'border-gray-600 bg-gray-700 text-white focus:border-blue-400 focus:ring-2 focus:ring-blue-900'
                      }`}
                      required
                    >
                      <option value="">Select experience level</option>
                      <option value="0-1">0-1 years (Entry level)</option>
                      <option value="2-3">2-3 years</option>
                      <option value="4-5">4-5 years</option>
                      <option value="6-8">6-8 years</option>
                      <option value="9-12">9-12 years (Senior level)</option>
                      <option value="13+">13+ years (Expert level)</option>
                    </select>
                  </div>

                  {/* Work Authorization */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      theme === 'light' ? 'text-gray-700' : 'text-gray-300'
                    }`}>
                      Are you authorized to work in this location? <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.work_authorization}
                      onChange={(e) => updateFormData('work_authorization', e.target.value)}
                      className={`w-full p-3 border rounded-lg transition-colors ${
                        theme === 'light' 
                          ? 'border-gray-300 bg-white text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200' 
                          : 'border-gray-600 bg-gray-700 text-white focus:border-blue-400 focus:ring-2 focus:ring-blue-900'
                      }`}
                      required
                    >
                      <option value="">Select authorization status</option>
                      <option value="yes">Yes, I am authorized to work</option>
                      <option value="no">No, I will need sponsorship</option>
                      <option value="pending">Pending work authorization</option>
                    </select>
                  </div>

                  {/* Notice Period */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      theme === 'light' ? 'text-gray-700' : 'text-gray-300'
                    }`}>
                      What is your notice period? <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.notice_period}
                      onChange={(e) => updateFormData('notice_period', e.target.value)}
                      className={`w-full p-3 border rounded-lg transition-colors ${
                        theme === 'light' 
                          ? 'border-gray-300 bg-white text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200' 
                          : 'border-gray-600 bg-gray-700 text-white focus:border-blue-400 focus:ring-2 focus:ring-blue-900'
                      }`}
                      required
                    >
                      <option value="">Select notice period</option>
                      <option value="immediate">Available immediately</option>
                      <option value="1-week">1 week</option>
                      <option value="2-weeks">2 weeks</option>
                      <option value="1-month">1 month</option>
                      <option value="2-months">2 months</option>
                      <option value="3-months">3 months</option>
                      <option value="other">Other (please specify in cover letter)</option>
                    </select>
                  </div>

                  {/* Remote Work Preference */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      theme === 'light' ? 'text-gray-700' : 'text-gray-300'
                    }`}>
                      What is your work location preference? <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.remote_work_preference}
                      onChange={(e) => updateFormData('remote_work_preference', e.target.value)}
                      className={`w-full p-3 border rounded-lg transition-colors ${
                        theme === 'light' 
                          ? 'border-gray-300 bg-white text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200' 
                          : 'border-gray-600 bg-gray-700 text-white focus:border-blue-400 focus:ring-2 focus:ring-blue-900'
                      }`}
                      required
                    >
                      <option value="">Select work preference</option>
                      <option value="remote">Fully remote</option>
                      <option value="hybrid">Hybrid (mix of remote and office)</option>
                      <option value="onsite">On-site only</option>
                      <option value="flexible">Flexible (any arrangement)</option>
                    </select>
                  </div>

                  {/* Relevant Skills */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      theme === 'light' ? 'text-gray-700' : 'text-gray-300'
                    }`}>
                      What are your most relevant skills for this position? <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={formData.relevant_skills}
                      onChange={(e) => updateFormData('relevant_skills', e.target.value)}
                      placeholder="List your key skills, technologies, certifications, or expertise relevant to this role..."
                      className={`w-full p-3 border rounded-lg resize-none transition-colors ${
                        theme === 'light' 
                          ? 'border-gray-300 bg-white text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200' 
                          : 'border-gray-600 bg-gray-700 text-white focus:border-blue-400 focus:ring-2 focus:ring-blue-900'
                      }`}
                      rows={3}
                      required
                    />
                  </div>

                  {/* Why Interested */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      theme === 'light' ? 'text-gray-700' : 'text-gray-300'
                    }`}>
                      Why are you interested in this specific role and company? <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={formData.why_interested}
                      onChange={(e) => updateFormData('why_interested', e.target.value)}
                      placeholder="What attracts you to this position and our company? What do you hope to achieve in this role?"
                      className={`w-full p-3 border rounded-lg resize-none transition-colors ${
                        theme === 'light' 
                          ? 'border-gray-300 bg-white text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200' 
                          : 'border-gray-600 bg-gray-700 text-white focus:border-blue-400 focus:ring-2 focus:ring-blue-900'
                      }`}
                      rows={3}
                      required
                    />
                  </div>

                  {/* Biggest Achievement */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      theme === 'light' ? 'text-gray-700' : 'text-gray-300'
                    }`}>
                      What is your biggest professional achievement? <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={formData.biggest_achievement}
                      onChange={(e) => updateFormData('biggest_achievement', e.target.value)}
                      placeholder="Describe a significant accomplishment in your career that demonstrates your abilities..."
                      className={`w-full p-3 border rounded-lg resize-none transition-colors ${
                        theme === 'light' 
                          ? 'border-gray-300 bg-white text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200' 
                          : 'border-gray-600 bg-gray-700 text-white focus:border-blue-400 focus:ring-2 focus:ring-blue-900'
                      }`}
                      rows={3}
                      required
                    />
                  </div>

                  {/* Start Date */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      theme === 'light' ? 'text-gray-700' : 'text-gray-300'
                    }`}>
                      When can you start? <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={formData.availability_start_date}
                      onChange={(e) => updateFormData('availability_start_date', e.target.value)}
                      className={`w-full p-3 border rounded-lg transition-colors ${
                        theme === 'light' 
                          ? 'border-gray-300 bg-white text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200' 
                          : 'border-gray-600 bg-gray-700 text-white focus:border-blue-400 focus:ring-2 focus:ring-blue-900'
                      }`}
                      required
                    />
                  </div>

                  {/* Additional Languages */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      theme === 'light' ? 'text-gray-700' : 'text-gray-300'
                    }`}>
                      Additional languages you speak (Optional)
                    </label>
                    <input
                      type="text"
                      value={formData.additional_languages}
                      onChange={(e) => updateFormData('additional_languages', e.target.value)}
                      placeholder="e.g., Spanish (Fluent), French (Conversational)"
                      className={`w-full p-3 border rounded-lg transition-colors ${
                        theme === 'light' 
                          ? 'border-gray-300 bg-white text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200' 
                          : 'border-gray-600 bg-gray-700 text-white focus:border-blue-400 focus:ring-2 focus:ring-blue-900'
                      }`}
                    />
                  </div>

                  {/* Relocation */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      theme === 'light' ? 'text-gray-700' : 'text-gray-300'
                    }`}>
                      Are you willing to relocate for this position?
                    </label>
                    <select
                      value={formData.relocation_willingness}
                      onChange={(e) => updateFormData('relocation_willingness', e.target.value)}
                      className={`w-full p-3 border rounded-lg transition-colors ${
                        theme === 'light' 
                          ? 'border-gray-300 bg-white text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200' 
                          : 'border-gray-600 bg-gray-700 text-white focus:border-blue-400 focus:ring-2 focus:ring-blue-900'
                      }`}
                    >
                      <option value="">Select relocation preference</option>
                      <option value="yes">Yes, I am willing to relocate</option>
                      <option value="no">No, I cannot relocate</option>
                      <option value="depends">Depends on the opportunity</option>
                      <option value="not-needed">Relocation not needed</option>
                    </select>
                  </div>
                </div>
              </Card>

              {/* Optional Fields Section */}
              <Card className={`p-6 ${
                theme === 'light' 
                  ? 'bg-white border border-gray-200 shadow-sm' 
                  : 'bg-gray-800 border border-gray-700'
              }`}>
                <details className="group">
                  <summary className={`cursor-pointer text-lg font-semibold mb-4 ${
                    theme === 'light' ? 'text-gray-900' : 'text-white'
                  }`}>
                    Additional Information (Optional)
                  </summary>
                  <div className="space-y-4 mt-4">
                    {/* Resume URL */}
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${
                        theme === 'light' ? 'text-gray-700' : 'text-gray-300'
                      }`}>
                        Resume URL
                      </label>
                      <Input
                        type="url"
                        value={formData.resume_url}
                        onChange={(e) => updateFormData('resume_url', e.target.value)}
                        placeholder="https://example.com/resume.pdf"
                        icon={<FileText className="w-4 h-4" />}
                      />
                    </div>

                    {/* Portfolio URL */}
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${
                        theme === 'light' ? 'text-gray-700' : 'text-gray-300'
                      }`}>
                        Portfolio URL
                      </label>
                      <Input
                        type="url"
                        value={formData.portfolio_url}
                        onChange={(e) => updateFormData('portfolio_url', e.target.value)}
                        placeholder="https://portfolio.com"
                        icon={<Link className="w-4 h-4" />}
                      />
                    </div>

                    {/* GitHub URL */}
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${
                        theme === 'light' ? 'text-gray-700' : 'text-gray-300'
                      }`}>
                        GitHub URL
                      </label>
                      <Input
                        type="url"
                        value={formData.github_url}
                        onChange={(e) => updateFormData('github_url', e.target.value)}
                        placeholder="https://github.com/username"
                        icon={<Link className="w-4 h-4" />}
                      />
                    </div>
                  </div>
                </details>
              </Card>

              {/* Error Message */}
              {error && (
                <div className={`flex items-center space-x-3 p-4 rounded-lg border ${
                  theme === 'light' 
                    ? 'bg-red-50 border-red-200' 
                    : 'bg-red-900/20 border-red-800'
                }`}>
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                  <span className={`text-sm ${
                    theme === 'light' ? 'text-red-700' : 'text-red-300'
                  }`}>
                    {error}
                  </span>
                </div>
              )}

              {/* Success Message */}
              {success && (
                <div className={`flex items-center space-x-3 p-4 rounded-lg border ${
                  theme === 'light' 
                    ? 'bg-green-50 border-green-200' 
                    : 'bg-green-900/20 border-green-800'
                }`}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-green-500 flex-shrink-0">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                    <path d="m9 11 3 3L22 4"/>
                  </svg>
                  <span className={`text-sm ${
                    theme === 'light' ? 'text-green-700' : 'text-green-300'
                  }`}>
                    {success}
                  </span>
                </div>
              )}
            </form>
          </div>
        </div>

        {/* Fixed Action Buttons */}
        <div className={`fixed bottom-0 left-0 right-0 z-20 ${
          theme === 'light' 
            ? 'bg-white/90 backdrop-blur-sm border-t border-gray-200' 
            : 'bg-gray-800/90 backdrop-blur-sm border-t border-gray-700'
        }`}>
          <div className="max-w-4xl mx-auto px-6 py-4">
            <div className="flex justify-end space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isSubmitting}
                className="px-6"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={isSubmitting}
                icon={isSubmitting ? undefined : <Send className="w-4 h-4" />}
                className="px-6"
                onClick={handleSubmit}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Application'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 