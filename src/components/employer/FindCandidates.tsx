import React, { useState, useEffect } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { ToastContainer, useToast } from '../common/Toast';
import { useTheme } from '../../contexts/ThemeContext';
import { api } from '../../services/api';
import { 
  Users, 
  Search, 
  Filter,
  MapPin, 
  Briefcase, 
  Star,
  Mail,
  ExternalLink,
  Calendar,
  DollarSign,
  Eye,
  Send,
  X,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface Candidate {
  _id: string;
  user_id: string;
  name: string;
  email: string;
  role: string;
  skills: string[];
  experience_years?: number;
  preferred_job_types: string[];
  preferred_locations: string[];
  salary_expectations?: {
    min?: number;
    max?: number;
  };
  profile_views: number;
  created_at: string;
  updated_at: string;
  last_active: string;
  // Profile visibility setting
  profile_visible?: boolean;
}

interface JobOffer {
  candidate_id: string;
  candidate_name: string;
  candidate_email: string;
  job_title: string;
  job_description: string;
  salary_range: {
    min: number;
    max: number;
  };
  location: string;
  job_type: string;
  message: string;
}

interface FindCandidatesProps {
  onNavigate?: (view: 'home' | 'jobs' | 'resume' | 'profile' | 'create-profile' | 'dashboard' | 'post-job' | 'candidates' | 'faqs' | 'contact' | 'settings') => void;
}

export const FindCandidates: React.FC<FindCandidatesProps> = ({ onNavigate }) => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [filteredCandidates, setFilteredCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedExperience, setSelectedExperience] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [showJobOfferModal, setShowJobOfferModal] = useState(false);
  const [jobOffer, setJobOffer] = useState<JobOffer>({
    candidate_id: '',
    candidate_name: '',
    candidate_email: '',
    job_title: '',
    job_description: '',
    salary_range: { min: 0, max: 0 },
    location: '',
    job_type: '',
    message: ''
  });
  const [sendingOffer, setSendingOffer] = useState(false);
  
  const { theme } = useTheme();
  const { toasts, removeToast, success, error: showError } = useToast();

  // Fetch all job seekers
  const fetchCandidates = async () => {
    try {
      setLoading(true);
      const response = await api.get('/users/');
      const allUsers = response.data;
      
      // Filter only job seekers who have made their profile visible
      const jobSeekers = allUsers.filter((user: Candidate) => 
        user.role === 'jobseeker' && 
        (user.profile_visible !== false) // Default to visible if not specified
      );
      
      setCandidates(jobSeekers);
      setFilteredCandidates(jobSeekers);
      setError(null);
    } catch (error: any) {
      console.error('Error fetching candidates:', error);
      setError(error.message || 'Failed to fetch candidates');
    } finally {
      setLoading(false);
    }
  };

  // Filter candidates based on search and filters
  useEffect(() => {
    let filtered = candidates;

    // Search by name, skills, or location
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(candidate =>
        candidate.name.toLowerCase().includes(term) ||
        candidate.skills.some(skill => skill.toLowerCase().includes(term)) ||
        candidate.preferred_locations.some(location => location.toLowerCase().includes(term))
      );
    }

    // Filter by skills
    if (selectedSkills.length > 0) {
      filtered = filtered.filter(candidate =>
        selectedSkills.every(skill => 
          candidate.skills.some(candidateSkill => 
            candidateSkill.toLowerCase().includes(skill.toLowerCase())
          )
        )
      );
    }

    // Filter by location
    if (selectedLocation) {
      filtered = filtered.filter(candidate =>
        candidate.preferred_locations.some(location =>
          location.toLowerCase().includes(selectedLocation.toLowerCase())
        )
      );
    }

    // Filter by experience
    if (selectedExperience) {
      const experienceRange = selectedExperience.split('-');
      const minExp = parseInt(experienceRange[0]);
      const maxExp = experienceRange[1] ? parseInt(experienceRange[1]) : 999;
      
      filtered = filtered.filter(candidate =>
        candidate.experience_years && 
        candidate.experience_years >= minExp && 
        candidate.experience_years <= maxExp
      );
    }

    setFilteredCandidates(filtered);
  }, [candidates, searchTerm, selectedSkills, selectedLocation, selectedExperience]);

  // Get unique skills from all candidates
  const getAllSkills = () => {
    const skillsSet = new Set<string>();
    candidates.forEach(candidate => {
      candidate.skills.forEach(skill => skillsSet.add(skill));
    });
    return Array.from(skillsSet).sort();
  };

  // Get unique locations from all candidates
  const getAllLocations = () => {
    const locationsSet = new Set<string>();
    candidates.forEach(candidate => {
      candidate.preferred_locations.forEach(location => locationsSet.add(location));
    });
    return Array.from(locationsSet).sort();
  };

  const handleOfferJob = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
    setJobOffer({
      candidate_id: candidate._id,
      candidate_name: candidate.name,
      candidate_email: candidate.email,
      job_title: '',
      job_description: '',
      salary_range: { min: 0, max: 0 },
      location: '',
      job_type: '',
      message: ''
    });
    setShowJobOfferModal(true);
  };

  const handleSendOffer = async () => {
    if (!jobOffer.job_title || !jobOffer.job_description || !jobOffer.location || !jobOffer.job_type) {
      showError('Missing Information', 'Please fill in all required fields');
      return;
    }

    try {
      setSendingOffer(true);
      
      // Send job offer notification (you can implement this as a notification or email)
      // For now, we'll just show a success message
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      success(
        'Job Offer Sent!', 
        `Your job offer has been sent to ${jobOffer.candidate_name}. They will be notified and can respond to your offer.`
      );
      
      setShowJobOfferModal(false);
      setJobOffer({
        candidate_id: '',
        candidate_name: '',
        candidate_email: '',
        job_title: '',
        job_description: '',
        salary_range: { min: 0, max: 0 },
        location: '',
        job_type: '',
        message: ''
      });
    } catch (error: any) {
      showError('Failed to Send Offer', error.message || 'Failed to send job offer');
    } finally {
      setSendingOffer(false);
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" text="Loading candidates..." />
      </div>
    );
  }

  return (
    <>
      <ToastContainer toasts={toasts} onRemove={removeToast} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className={`text-3xl font-bold mb-4 ${
            theme === 'light' ? 'text-gray-900' : 'text-white'
          }`}>
            Find Top Candidates
          </h1>
          <p className={`text-lg ${
            theme === 'light' ? 'text-gray-600' : 'text-gray-400'
          }`}>
            Browse through talented professionals and find the perfect match for your team
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, skills, or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Filter Toggle */}
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              icon={showFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            >
              Filters
            </Button>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Skills Filter */}
                <div>
                  <label className="block text-sm font-medium mb-2">Skills</label>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {getAllSkills().map(skill => (
                      <label key={skill} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedSkills.includes(skill)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedSkills([...selectedSkills, skill]);
                            } else {
                              setSelectedSkills(selectedSkills.filter(s => s !== skill));
                            }
                          }}
                          className="mr-2"
                        />
                        <span className="text-sm">{skill}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Location Filter */}
                <div>
                  <label className="block text-sm font-medium mb-2">Location</label>
                  <select
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="">All Locations</option>
                    {getAllLocations().map(location => (
                      <option key={location} value={location}>{location}</option>
                    ))}
                  </select>
                </div>

                {/* Experience Filter */}
                <div>
                  <label className="block text-sm font-medium mb-2">Experience</label>
                  <select
                    value={selectedExperience}
                    onChange={(e) => setSelectedExperience(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="">All Experience Levels</option>
                    <option value="0-2">0-2 years</option>
                    <option value="3-5">3-5 years</option>
                    <option value="6-10">6-10 years</option>
                    <option value="11-999">10+ years</option>
                  </select>
                </div>
              </div>

              {/* Clear Filters */}
              {(selectedSkills.length > 0 || selectedLocation || selectedExperience) && (
                <div className="mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedSkills([]);
                      setSelectedLocation('');
                      setSelectedExperience('');
                    }}
                  >
                    Clear All Filters
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className={`text-sm ${
            theme === 'light' ? 'text-gray-600' : 'text-gray-400'
          }`}>
            Showing {filteredCandidates.length} of {candidates.length} candidates
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <Card className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
            <div className="flex items-center space-x-3">
              <X className="w-5 h-5 text-red-500" />
              <div>
                <p className="text-red-600 dark:text-red-400 font-medium">Error</p>
                <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
              </div>
            </div>
          </Card>
        )}

        {/* Candidates Grid */}
        {filteredCandidates.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className={`text-xl font-medium mb-2 ${
              theme === 'light' ? 'text-gray-900' : 'text-white'
            }`}>
              No candidates found
            </h3>
            <p className={`text-gray-600 dark:text-gray-400 mb-4`}>
              Try adjusting your search criteria or filters
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm('');
                setSelectedSkills([]);
                setSelectedLocation('');
                setSelectedExperience('');
              }}
            >
              Clear All Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCandidates.map((candidate) => (
              <Card key={candidate._id} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className={`text-lg font-semibold mb-1 ${
                      theme === 'light' ? 'text-gray-900' : 'text-white'
                    }`}>
                      {candidate.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      {candidate.email}
                    </p>
                    <div className="flex items-center space-x-2 text-xs text-gray-500">
                      <Eye className="w-3 h-3" />
                      <span>{candidate.profile_views} profile views</span>
                    </div>
                  </div>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleOfferJob(candidate)}
                    icon={<Send className="w-4 h-4" />}
                  >
                    Offer Job
                  </Button>
                </div>

                {/* Skills */}
                {candidate.skills.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium mb-2">Skills</h4>
                    <div className="flex flex-wrap gap-1">
                      {candidate.skills.slice(0, 5).map((skill, index) => (
                        <Badge key={index} variant="outline" size="sm">
                          {skill}
                        </Badge>
                      ))}
                      {candidate.skills.length > 5 && (
                        <Badge variant="outline" size="sm">
                          +{candidate.skills.length - 5} more
                        </Badge>
                      )}
                    </div>
                  </div>
                )}

                {/* Experience and Preferences */}
                <div className="space-y-2 text-sm">
                  {candidate.experience_years && (
                    <div className="flex items-center space-x-2">
                      <Briefcase className="w-4 h-4 text-gray-400" />
                      <span>{candidate.experience_years} years experience</span>
                    </div>
                  )}
                  
                  {candidate.preferred_locations.length > 0 && (
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span>{candidate.preferred_locations.join(', ')}</span>
                    </div>
                  )}

                  {candidate.preferred_job_types.length > 0 && (
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span>{candidate.preferred_job_types.join(', ')}</span>
                    </div>
                  )}

                  {candidate.salary_expectations && (
                    <div className="flex items-center space-x-2">
                      <DollarSign className="w-4 h-4 text-gray-400" />
                      <span>
                        ₹{candidate.salary_expectations.min?.toLocaleString()} - 
                        ₹{candidate.salary_expectations.max?.toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>

                {/* Last Active */}
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-xs text-gray-500">
                    Last active: {new Date(candidate.last_active).toLocaleDateString()}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Job Offer Modal */}
      {showJobOfferModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Offer Job to {jobOffer.candidate_name}
                </h2>
                <button
                  onClick={() => setShowJobOfferModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Job Title *</label>
                <input
                  type="text"
                  value={jobOffer.job_title}
                  onChange={(e) => setJobOffer({...jobOffer, job_title: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Senior Software Engineer"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Job Description *</label>
                <textarea
                  value={jobOffer.job_description}
                  onChange={(e) => setJobOffer({...jobOffer, job_description: e.target.value})}
                  rows={4}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Describe the role, responsibilities, and requirements..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Location *</label>
                  <input
                    type="text"
                    value={jobOffer.location}
                    onChange={(e) => setJobOffer({...jobOffer, location: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., Mumbai, India"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Job Type *</label>
                  <select
                    value={jobOffer.job_type}
                    onChange={(e) => setJobOffer({...jobOffer, job_type: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select job type</option>
                    <option value="full_time">Full Time</option>
                    <option value="part_time">Part Time</option>
                    <option value="contract">Contract</option>
                    <option value="internship">Internship</option>
                    <option value="remote">Remote</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Salary Range (Min)</label>
                  <input
                    type="number"
                    value={jobOffer.salary_range.min || ''}
                    onChange={(e) => setJobOffer({
                      ...jobOffer, 
                      salary_range: {...jobOffer.salary_range, min: parseInt(e.target.value) || 0}
                    })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Salary Range (Max)</label>
                  <input
                    type="number"
                    value={jobOffer.salary_range.max || ''}
                    onChange={(e) => setJobOffer({
                      ...jobOffer, 
                      salary_range: {...jobOffer.salary_range, max: parseInt(e.target.value) || 0}
                    })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="0"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Personal Message (Optional)</label>
                <textarea
                  value={jobOffer.message}
                  onChange={(e) => setJobOffer({...jobOffer, message: e.target.value})}
                  rows={3}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Add a personal message to make your offer more appealing..."
                />
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => setShowJobOfferModal(false)}
                disabled={sendingOffer}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleSendOffer}
                disabled={sendingOffer}
                icon={sendingOffer ? <LoadingSpinner size="sm" /> : <Send className="w-4 h-4" />}
              >
                {sendingOffer ? 'Sending...' : 'Send Job Offer'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}; 