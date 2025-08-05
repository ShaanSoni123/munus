import React, { useState } from 'react';
import { X, User, Mail, Phone, MapPin, Clock, Calendar, Globe, Github, Linkedin, FileText, Star, Award, Languages, Briefcase, CheckCircle, XCircle, Clock3, AlertCircle, CalendarDays, Users } from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { useTheme } from '../../contexts/ThemeContext';
import { ScheduleInterviewModal } from './ScheduleInterviewModal';

interface Application {
  _id: string;
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
  applicant_name?: string;
  applicant_email?: string;
  employer_notes?: string;
}

interface ApplicationDetailModalProps {
  application: Application | null;
  isOpen: boolean;
  onClose: () => void;
  onStatusUpdate: (applicationId: string, status: string, notes?: string) => void;
  isUpdating?: boolean;
}

export const ApplicationDetailModal: React.FC<ApplicationDetailModalProps> = ({
  application,
  isOpen,
  onClose,
  onStatusUpdate,
  isUpdating = false
}) => {
  const { theme } = useTheme();
  const [notes, setNotes] = useState('');
  const [showNotesInput, setShowNotesInput] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);

  if (!isOpen || !application) return null;

  const handleStatusUpdate = (status: string) => {
    onStatusUpdate(application._id, status, notes || undefined);
    setNotes('');
    setShowNotesInput(false);
  };

  const handleScheduleInterview = () => {
    setShowScheduleModal(true);
  };

  const handleScheduleConfirm = (interviewData: any) => {
    console.log('Interview scheduled:', interviewData);
    
    // Update application status to indicate interview is scheduled
    onStatusUpdate(application._id, 'interview_scheduled', `Interview scheduled for ${interviewData.date} at ${interviewData.time}`);
    
    // Here you can add additional logic like:
    // - Send confirmation email to applicant
    // - Add to calendar
    // - Update application status in database
    // - Send notifications
  };

  const handleShortlistForInterview = () => {
    // Update status to shortlisted and add notes
    onStatusUpdate(application._id, 'shortlisted', notes || 'Shortlisted for interview');
    setNotes('');
    setShowNotesInput(false);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'accepted': return 'bg-green-100 text-green-800 border-green-300 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-300 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800';
      case 'waiting': return 'bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800';
      case 'under_review': return 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800';
      case 'shortlisted': return 'bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800';
      case 'interview_scheduled': return 'bg-indigo-100 text-indigo-800 border-indigo-300 dark:bg-indigo-900/20 dark:text-indigo-400 dark:border-indigo-800';
      default: return 'bg-gray-100 text-gray-800 border-gray-300 dark:bg-gray-900/20 dark:text-gray-400 dark:border-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'accepted': return <CheckCircle className="w-4 h-4" />;
      case 'rejected': return <XCircle className="w-4 h-4" />;
      case 'waiting': return <Clock3 className="w-4 h-4" />;
      case 'under_review': return <AlertCircle className="w-4 h-4" />;
      case 'shortlisted': return <Users className="w-4 h-4" />;
      case 'interview_scheduled': return <Calendar className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl max-h-[95vh] overflow-hidden flex flex-col">
        {/* Header - Light Theme */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {application.applicant_name || 'Job Applicant'}
                </h2>
                <p className="text-gray-500 text-sm">
                  Applied {new Date(application.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Badge className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(application.status)}`}>
                {getStatusIcon(application.status)}
                <span className="ml-1 capitalize">{application.status.replace('_', ' ')}</span>
              </Badge>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-full hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Left Column - Contact & Professional Info */}
            <div className="xl:col-span-1 space-y-4">
              {/* Contact Information */}
              {(application.applicant_email || application.linkedin_url || application.github_url || application.portfolio_url) && (
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                    <Mail className="w-5 h-5 mr-2 text-blue-600" />
                    Contact Information
                  </h3>
                  <div className="space-y-2">
                    {application.applicant_email && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Mail className="w-4 h-4 mr-2 text-gray-400" />
                        <a href={`mailto:${application.applicant_email}`} className="hover:text-blue-600 hover:underline">
                          {application.applicant_email}
                        </a>
                      </div>
                    )}
                    {application.linkedin_url && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Linkedin className="w-4 h-4 mr-2 text-gray-400" />
                        <a href={application.linkedin_url} target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 hover:underline">
                          LinkedIn Profile
                        </a>
                      </div>
                    )}
                    {application.github_url && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Github className="w-4 h-4 mr-2 text-gray-400" />
                        <a href={application.github_url} target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 hover:underline">
                          GitHub Profile
                        </a>
                      </div>
                    )}
                    {application.portfolio_url && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Globe className="w-4 h-4 mr-2 text-gray-400" />
                        <a href={application.portfolio_url} target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 hover:underline">
                          Portfolio Website
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Professional Details - Only show if has content */}
              {(application.years_of_experience || application.relevant_skills || application.work_authorization || application.notice_period) && (
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                    <Briefcase className="w-5 h-5 mr-2 text-blue-600" />
                    Professional Details
                  </h3>
                  <div className="space-y-3">
                    {application.years_of_experience && (
                      <div>
                        <span className="text-sm font-medium text-gray-700">Experience:</span>
                        <p className="text-sm text-gray-600">{application.years_of_experience} years</p>
                      </div>
                    )}
                    {application.relevant_skills && (
                      <div>
                        <span className="text-sm font-medium text-gray-700">Skills:</span>
                        <p className="text-sm text-gray-600">{application.relevant_skills}</p>
                      </div>
                    )}
                    {application.work_authorization && (
                      <div>
                        <span className="text-sm font-medium text-gray-700">Work Authorization:</span>
                        <p className="text-sm text-gray-600">{application.work_authorization}</p>
                      </div>
                    )}
                    {application.notice_period && (
                      <div>
                        <span className="text-sm font-medium text-gray-700">Notice Period:</span>
                        <p className="text-sm text-gray-600">{application.notice_period}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Work Preferences - Only show if has content */}
              {(application.remote_work_preference || application.relocation_willingness || application.availability_start_date || application.additional_languages) && (
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                    <MapPin className="w-5 h-5 mr-2 text-blue-600" />
                    Work Preferences
                  </h3>
                  <div className="space-y-3">
                    {application.remote_work_preference && (
                      <div>
                        <span className="text-sm font-medium text-gray-700">Remote Work:</span>
                        <p className="text-sm text-gray-600">{application.remote_work_preference}</p>
                      </div>
                    )}
                    {application.relocation_willingness && (
                      <div>
                        <span className="text-sm font-medium text-gray-700">Relocation:</span>
                        <p className="text-sm text-gray-600">{application.relocation_willingness}</p>
                      </div>
                    )}
                    {application.availability_start_date && (
                      <div>
                        <span className="text-sm font-medium text-gray-700">Available From:</span>
                        <p className="text-sm text-gray-600">{new Date(application.availability_start_date).toLocaleDateString()}</p>
                      </div>
                    )}
                    {application.additional_languages && (
                      <div>
                        <span className="text-sm font-medium text-gray-700">Languages:</span>
                        <p className="text-sm text-gray-600">{application.additional_languages}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Application Details */}
            <div className="xl:col-span-2 space-y-4">
              {/* Cover Letter */}
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <FileText className="w-5 h-5 mr-2 text-blue-600" />
                  Cover Letter
                </h3>
                <div className="text-sm text-gray-600 whitespace-pre-wrap leading-relaxed">
                  {application.cover_letter || 'No cover letter provided.'}
                </div>
              </div>

              {/* Why Interested */}
              {application.why_interested && (
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                    <Star className="w-5 h-5 mr-2 text-blue-600" />
                    Why Interested
                  </h3>
                  <div className="text-sm text-gray-600 whitespace-pre-wrap leading-relaxed">
                    {application.why_interested}
                  </div>
                </div>
              )}

              {/* Biggest Achievement */}
              {application.biggest_achievement && (
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                    <Award className="w-5 h-5 mr-2 text-blue-600" />
                    Key Achievement
                  </h3>
                  <div className="text-sm text-gray-600 whitespace-pre-wrap leading-relaxed">
                    {application.biggest_achievement}
                  </div>
                </div>
              )}

              {/* Resume */}
              {application.resume_url && (
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                    <FileText className="w-5 h-5 mr-2 text-blue-600" />
                    Resume
                  </h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(application.resume_url, '_blank')}
                    className="w-full"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    View Resume
                  </Button>
                </div>
              )}

              {/* Employer Notes */}
              {application.employer_notes && (
                <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Internal Notes
                  </h3>
                  <div className="text-sm text-gray-600 whitespace-pre-wrap leading-relaxed">
                    {application.employer_notes}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer - Action Buttons */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
          <div className="flex flex-col space-y-4">
            {/* Notes Input */}
            {showNotesInput && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Add Notes (Optional)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add internal notes about this application..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm resize-none"
                  rows={3}
                />
              </div>
            )}

            {/* Action Buttons - Better organized */}
            <div className="flex flex-col space-y-3">
              {/* Primary Actions */}
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleScheduleInterview}
                  disabled={isUpdating}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <CalendarDays className="w-4 h-4 mr-2" />
                  Schedule Interview
                </Button>

                {application.status !== 'shortlisted' && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleShortlistForInterview}
                    disabled={isUpdating}
                    className="border-purple-300 text-purple-600 hover:bg-purple-50"
                  >
                    {isUpdating ? (
                      <div className="animate-spin w-4 h-4 border-2 border-purple-600 border-t-transparent rounded-full mr-2" />
                    ) : (
                      <Users className="w-4 h-4 mr-2" />
                    )}
                    Shortlisted for Interview
                  </Button>
                )}

                {application.status !== 'accepted' && (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleStatusUpdate('accepted')}
                    disabled={isUpdating}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    {isUpdating ? (
                      <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                    ) : (
                      <CheckCircle className="w-4 h-4 mr-2" />
                    )}
                    Accept
                  </Button>
                )}
              </div>

              {/* Secondary Actions */}
              <div className="flex flex-wrap gap-2">
                {application.status !== 'rejected' && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleStatusUpdate('rejected')}
                    disabled={isUpdating}
                    className="border-red-300 text-red-600 hover:bg-red-50"
                  >
                    {isUpdating ? (
                      <div className="animate-spin w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full mr-2" />
                    ) : (
                      <XCircle className="w-4 h-4 mr-2" />
                    )}
                    Reject
                  </Button>
                )}

                {application.status !== 'waiting' && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleStatusUpdate('waiting')}
                    disabled={isUpdating}
                    className="border-yellow-300 text-yellow-600 hover:bg-yellow-50"
                  >
                    {isUpdating ? (
                      <div className="animate-spin w-4 h-4 border-2 border-yellow-600 border-t-transparent rounded-full mr-2" />
                    ) : (
                      <Clock3 className="w-4 h-4 mr-2" />
                    )}
                    Waiting List
                  </Button>
                )}

                {application.status !== 'under_review' && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleStatusUpdate('under_review')}
                    disabled={isUpdating}
                    className="border-blue-300 text-blue-600 hover:bg-blue-50"
                  >
                    {isUpdating ? (
                      <div className="animate-spin w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full mr-2" />
                    ) : (
                      <AlertCircle className="w-4 h-4 mr-2" />
                    )}
                    Under Review
                  </Button>
                )}
              </div>

              {/* Utility Actions */}
              <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowNotesInput(!showNotesInput)}
                  className="text-gray-600 hover:text-gray-800"
                >
                  {showNotesInput ? 'Hide Notes' : 'Add Notes'}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onClose}
                  className="text-gray-600 hover:text-gray-800"
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

      {/* Schedule Interview Modal */}
      <ScheduleInterviewModal
        isOpen={showScheduleModal}
        onClose={() => setShowScheduleModal(false)}
        onSchedule={handleScheduleConfirm}
        applicantName={application.applicant_name || 'Applicant'}
        applicantId={application._id}
      />
    </>
  );
};