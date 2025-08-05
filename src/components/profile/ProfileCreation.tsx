import React, { useState, useEffect } from 'react';
import { ArrowRight, ArrowLeft, User, Mail, Phone, MapPin, Briefcase, GraduationCap, Upload, Camera, CheckCircle, Star, Zap, Building, Users, Globe, Award, XCircle } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { PasswordInput } from '../ui/PasswordInput';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { PhotoUpload } from '../ui/PhotoUpload';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/material.css';
import { Country, State, City } from 'country-state-city';
import { api } from '../../services/api';

interface ProfileCreationProps {
  onComplete: () => void;
  onBack: () => void;
}

interface ProfileData {
  // Role Selection
  userType: 'jobseeker' | 'employer' | '';
  
  // Personal Information (Common)
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  location: string;
  
  // Job Seeker Specific
  dateOfBirth?: string;
  currentRole?: string;
  experience?: string;
  industry?: string;
  educationLevel?: string;
  fieldOfStudy?: string;
  careerGoal?: string;
  skills?: string[];
  jobType?: string[];
  workMode?: string[];
  expectedSalary?: string;
  linkedIn?: string;
  portfolio?: string;
  
  // Employer Specific
  companyName?: string;
  companyWebsite?: string;
  companySize?: string;
  companyIndustry?: string;
  companyDescription?: string;
  jobsToPost?: string;
  hiringBudget?: string;
  companyLinkedIn?: string;
  
  // Additional
  profilePicture?: string;
  resume?: File;
  password: string;
}

const jobSeekerSteps = [
  { id: 'role', name: 'Role Selection', icon: User },
  { id: 'personal', name: 'Personal Info', icon: User },
  { id: 'professional', name: 'Professional', icon: Briefcase },
  { id: 'preferences', name: 'Preferences', icon: Star },
  { id: 'complete', name: 'Complete', icon: CheckCircle },
];

const employerSteps = [
  { id: 'role', name: 'Role Selection', icon: User },
  { id: 'personal', name: 'Personal Info', icon: User },
  { id: 'company', name: 'Company Info', icon: Building },
  { id: 'hiring', name: 'Hiring Details', icon: Users },
  { id: 'complete', name: 'Complete', icon: CheckCircle },
];

export const ProfileCreation: React.FC<ProfileCreationProps> = ({ onComplete, onBack }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [profileData, setProfileData] = useState<ProfileData>({
    userType: '' as 'jobseeker' | 'employer',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    location: '',
    skills: [],
    jobType: [],
    workMode: [],
    password: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register } = useAuth();
  const { theme } = useTheme();
  const [country, setCountry] = useState('');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [states, setStates] = useState<ReturnType<typeof State.getStatesOfCountry>>([]);
  const [cities, setCities] = useState<ReturnType<typeof City.getCitiesOfState>>([]);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  const [otpVerified, setOtpVerified] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string>('');
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);

  const steps = profileData.userType === 'jobseeker' ? jobSeekerSteps : 
                profileData.userType === 'employer' ? employerSteps : 
                jobSeekerSteps; // Default to jobseeker steps when no selection made yet

  // Initialize component state when mounted (but don't reset if already has data)
  useEffect(() => {
    // Only reset if we don't have any data yet
    if (!profileData.firstName && !profileData.email) {
      setCurrentStep(0);
      setProfileData({
        userType: '' as 'jobseeker' | 'employer',
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        location: '',
        skills: [],
        jobType: [],
        workMode: [],
        password: '',
      });
      setErrors({});
      setIsSubmitting(false);
      setOtpSent(false);
      setOtpVerified(false);
      setOtp('');
      setOtpError('');
      setOtpLoading(false);
    }
  }, []);

  const updateProfileData = (field: keyof ProfileData, value: any) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handlePhotoChange = (file: File) => {
    setSelectedPhoto(file);
    // Create preview URL
    const previewUrl = URL.createObjectURL(file);
    setPhotoPreview(previewUrl);
  };

  const handlePhotoRemove = () => {
    setSelectedPhoto(null);
    setPhotoPreview('');
    // If there was a preview URL, revoke it to free memory
    if (photoPreview) {
      URL.revokeObjectURL(photoPreview);
    }
  };

  const uploadPhoto = async (file: File): Promise<string> => {
    setIsUploadingPhoto(true);
    try {
      console.log('ProfileCreation: Starting photo upload for file:', file.name);
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await api.upload('/upload/avatar', formData);
      console.log('ProfileCreation: Photo upload successful:', response.data);
      return response.data.avatar_url;
    } catch (error: any) {
      console.error('ProfileCreation: Photo upload failed:', error);
      const errorMessage = error.message || 'Failed to upload photo. Please try again.';
      throw new Error(errorMessage);
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};
    const currentStepId = steps[step].id;

    try {
      switch (currentStepId) {
        case 'role':
          if (!profileData.userType) newErrors.userType = 'Please select your role';
          break;
          
        case 'personal':
          if (!profileData.firstName.trim()) newErrors.firstName = 'First name is required';
          if (!profileData.lastName.trim()) newErrors.lastName = 'Last name is required';
          if (!profileData.email.trim()) newErrors.email = 'Email is required';
          else if (!/\S+@\S+\.\S+/.test(profileData.email)) newErrors.email = 'Please enter a valid email';
          if (!country) newErrors.country = 'Country is required';
          if (!state) newErrors.state = 'State is required';
          if (!city) newErrors.city = 'City is required';
          if (!profileData.password.trim()) newErrors.password = 'Password is required';
          else if (profileData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
          break;
        
        case 'professional':
          if (profileData.userType === 'jobseeker') {
            // Removed required validation for currentRole and skills
            if (!profileData.experience) newErrors.experience = 'Experience level is required';
            // if (!profileData.skills || profileData.skills.length === 0) newErrors.skills = 'At least one skill is required';
          }
          break;
          
        case 'company':
          if (profileData.userType === 'employer') {
            if (!profileData.companyName?.trim()) newErrors.companyName = 'Company name is required';
            if (!profileData.companySize) newErrors.companySize = 'Company size is required';
            if (!profileData.companyDescription?.trim()) newErrors.companyDescription = 'Company description is required';
          }
          break;
          
        case 'hiring':
          if (profileData.userType === 'employer') {
            if (!profileData.jobsToPost) newErrors.jobsToPost = 'Please specify how many jobs you plan to post';
            if (!profileData.hiringBudget) newErrors.hiringBudget = 'Please specify your hiring budget';
          }
          break;
        
        case 'preferences':
          if (profileData.userType === 'jobseeker') {
            if (!profileData.jobType || profileData.jobType.length === 0) newErrors.jobType = 'Select at least one job type';
            if (!profileData.workMode || profileData.workMode.length === 0) newErrors.workMode = 'Select at least one work mode';
          }
          break;
          
        case 'complete':
          // On the complete step, we don't need to validate anything
          // Just ensure we have the basic required fields
          if (!profileData.firstName.trim()) newErrors.firstName = 'First name is required';
          if (!profileData.lastName.trim()) newErrors.lastName = 'Last name is required';
          if (!profileData.email.trim()) newErrors.email = 'Email is required';
          if (!profileData.password.trim()) newErrors.password = 'Password is required';
          break;
      }

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    } catch (error) {
      console.error('Validation error:', error);
      setErrors({ general: 'Validation failed. Please check your inputs.' });
      return false;
    }
  };

  const nextStep = () => {
    const valid = validateStep(currentStep);
    if (valid) {
      setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };

  const handleSkillAdd = (skill: string) => {
    if (skill.trim() && profileData.skills && !profileData.skills.includes(skill.trim())) {
      updateProfileData('skills', [...profileData.skills, skill.trim()]);
    }
  };

  const handleSkillRemove = (skillToRemove: string) => {
    if (profileData.skills) {
      updateProfileData('skills', profileData.skills.filter(skill => skill !== skillToRemove));
    }
  };

  const handleArrayToggle = (field: 'jobType' | 'workMode', value: string) => {
    const currentArray = profileData[field] || [];
    const newArray = currentArray.includes(value)
      ? currentArray.filter(item => item !== value)
      : [...currentArray, value];
    updateProfileData(field, newArray);
  };

  function generateUserId() {
    return 'user_' + Date.now() + '_' + Math.floor(Math.random() * 10000);
  }

  const handleSubmit = async () => {
    console.log('🚀 Starting registration process...');
    setIsSubmitting(true);
    setErrors({}); // Clear any previous errors
    
    try {
      // Upload photo first if selected
      let avatarUrl = '';
      if (selectedPhoto) {
        try {
          console.log('ProfileCreation: Uploading photo before registration...');
          avatarUrl = await uploadPhoto(selectedPhoto);
          console.log('ProfileCreation: Photo uploaded successfully:', avatarUrl);
          
          // Update the profile data with the new avatar URL
          setProfileData(prev => ({ ...prev, profilePicture: avatarUrl }));
        } catch (error: any) {
          console.error('ProfileCreation: Photo upload failed during registration:', error);
          setErrors({ general: error.message || 'Failed to upload photo. Please try again.' });
          setIsSubmitting(false);
          return;
        }
      }

      // Prepare the registration payload
      const payload = {
        name: `${profileData.firstName} ${profileData.lastName}`,
        email: profileData.email,
        password: profileData.password,
        role: profileData.userType,
        phone: profileData.phone,
        location: profileData.location,
        ...(avatarUrl && { avatar_url: avatarUrl }),
        ...(profileData.userType === 'employer' && { 
          company: profileData.companyName 
        }),
        ...(profileData.userType === 'jobseeker' && {
          skills: profileData.skills || [],
          experience_years: profileData.experience ? parseInt(profileData.experience) : undefined,
          preferred_job_types: profileData.jobType || [],
          preferred_locations: [profileData.location],
          salary_expectations: profileData.expectedSalary ? {
            min: parseInt(profileData.expectedSalary) * 1000,
            max: parseInt(profileData.expectedSalary) * 1500,
            currency: 'USD'
          } : undefined,
        }),
      };
      
      console.log('📋 Registration payload:', payload);
      console.log('📞 About to call register function...');

      const result = await register(payload);
      console.log('✅ Registration successful:', result);
      
      // Wait a moment to ensure AuthContext state is updated
      await new Promise(resolve => setTimeout(resolve, 300));
      
      console.log('🎯 Calling onComplete to redirect...');
      onComplete();
    } catch (error: any) {
      console.error('❌ Registration error details:', error);
      
      // Handle specific error cases
      if (error.message?.includes('Cannot connect to server')) {
        setErrors({ general: 'Cannot connect to server. Please make sure the backend is running and try again.' });
      } else if (error.message?.includes('Email already registered')) {
        setErrors({ email: 'This email is already registered. Please use a different email address.' });
        // Clear the email field to make it easy to try again
        setProfileData(prev => ({ ...prev, email: '' }));
      } else {
        setErrors({ general: error.message || 'Failed to create profile. Please check your connection and try again.' });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSendOtp = async () => {
    setOtpLoading(true);
    setOtpError('');
    try {
      await api.sendOtp('+91' + profileData.phone);
      setOtpSent(true);
      setOtp('');
    } catch (err: any) {
      setOtpSent(true); // Still show OTP box so user can retry
      setOtpError(err?.response?.data?.detail || err.message || 'Failed to send OTP');
      console.log('OTP send error:', err);
    } finally {
      setOtpLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    setOtpLoading(true);
    setOtpError('');
    try {
      await api.verifyOtp('+91' + profileData.phone, otp);
      setOtpVerified(true);
      setOtpError('');
    } catch (err: any) {
      setOtpError(err.message || 'Invalid OTP. Please try again.');
    } finally {
      setOtpLoading(false);
    }
  };

  const handlePhoneChange = (value: string) => {
    updateProfileData('phone', value);
    setOtpSent(false);
    setOtpVerified(false);
    setOtp('');
    setOtpError('');
  };

  useEffect(() => {
    if (country) {
      const stateList = State.getStatesOfCountry(country);
      setStates(stateList);
      setState('');
      setCity('');
      setCities([]);
      // Clear country error when country is selected
      if (errors.country) {
        setErrors(prev => ({ ...prev, country: '' }));
      }
    }
  }, [country, errors.country]);

  useEffect(() => {
    if (state) {
      const cityList = City.getCitiesOfState(country, state);
      setCities(cityList);
      setCity('');
      // Clear state error when state is selected
      if (errors.state) {
        setErrors(prev => ({ ...prev, state: '' }));
      }
    } else {
      setCities([]);
      setCity('');
    }
  }, [state, country, errors.state]);

  // Update location in profileData when state or city changes for both jobseeker and employer
  useEffect(() => {
    if ((profileData.userType === 'employer' || profileData.userType === 'jobseeker')) {
      if (state && city) {
        updateProfileData('location', `${city}, ${state}`);
      } else {
        updateProfileData('location', '');
      }
    }
    // Clear city error when city is selected
    if (city && errors.city) {
      setErrors(prev => ({ ...prev, city: '' }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, city, profileData.userType, errors.city]);

  // Cleanup photo preview on unmount
  useEffect(() => {
    return () => {
      if (photoPreview) {
        URL.revokeObjectURL(photoPreview);
      }
    };
  }, [photoPreview]);

  const renderRoleSelection = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h3 className={`text-2xl font-bold mb-4 ${
          theme === 'light' ? 'text-gray-900' : 'text-white'
        }`}>
          Welcome to Munus!
        </h3>
        <p className={`text-lg ${
          theme === 'light' ? 'text-gray-600' : 'text-gray-400'
        }`}>
          Let's get started by understanding how you'd like to use our platform
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <button
          onClick={() => updateProfileData('userType', 'jobseeker')}
          className={`p-8 rounded-2xl border-2 transition-all duration-300 text-left hover:scale-105 ${
            profileData.userType === 'jobseeker'
              ? `border-blue-500 ${
                  theme === 'light' 
                    ? 'bg-blue-50 shadow-lg' 
                    : 'bg-blue-900/20 shadow-lg shadow-blue-500/20'
                }`
              : `border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 ${
                  theme === 'light' ? 'hover:bg-gray-50' : 'hover:bg-gray-800'
                }`
          }`}
        >
          <div className={`w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mb-4 ${
            theme === 'dark-neon' ? 'shadow-lg shadow-blue-500/25' : 'shadow-lg'
          }`}>
            <User className="w-8 h-8 text-white" />
          </div>
          <h4 className={`text-xl font-bold mb-2 ${
            theme === 'light' ? 'text-gray-900' : 'text-white'
          }`}>
            I'm a Job Seeker
          </h4>
          <p className={`${
            theme === 'light' ? 'text-gray-600' : 'text-gray-400'
          }`}>
            Looking for my next career opportunity. I want to find jobs, build my resume, and connect with employers.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Badge variant="primary" size="sm">Find Jobs</Badge>
            <Badge variant="secondary" size="sm">Build Resume</Badge>
            <Badge variant="success" size="sm">Career Growth</Badge>
          </div>
        </button>

        <button
          onClick={() => updateProfileData('userType', 'employer')}
          className={`p-8 rounded-2xl border-2 transition-all duration-300 text-left hover:scale-105 ${
            profileData.userType === 'employer'
              ? `border-purple-500 ${
                  theme === 'light' 
                    ? 'bg-purple-50 shadow-lg' 
                    : 'bg-purple-900/20 shadow-lg shadow-purple-500/20'
                }`
              : `border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 ${
                  theme === 'light' ? 'hover:bg-gray-50' : 'hover:bg-gray-800'
                }`
          }`}
        >
          <div className={`w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mb-4 ${
            theme === 'dark-neon' ? 'shadow-lg shadow-purple-500/25' : 'shadow-lg'
          }`}>
            <Building className="w-8 h-8 text-white" />
          </div>
          <h4 className={`text-xl font-bold mb-2 ${
            theme === 'light' ? 'text-gray-900' : 'text-white'
          }`}>
            I'm an Employer
          </h4>
          <p className={`${
            theme === 'light' ? 'text-gray-600' : 'text-gray-400'
          }`}>
            Looking to hire talented professionals. I want to post jobs, review applications, and find the right candidates.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Badge variant="primary" size="sm">Post Jobs</Badge>
            <Badge variant="secondary" size="sm">Find Talent</Badge>
            <Badge variant="success" size="sm">Hire Fast</Badge>
          </div>
        </button>
      </div>

      {errors.userType && (
        <p className="text-sm text-red-600 text-center">{errors.userType}</p>
      )}
    </div>
  );

  const renderPersonalInfo = () => (
    <div className="space-y-8">
      {/* Profile Picture Section */}
      <div className="text-center">
        <PhotoUpload
          currentPhoto={photoPreview}
          onPhotoChange={handlePhotoChange}
          onPhotoRemove={handlePhotoRemove}
          disabled={isUploadingPhoto}
          size="lg"
          className="mx-auto"
        />
        <p className={`text-sm mt-2 ${
          theme === 'light' ? 'text-gray-600' : 'text-gray-400'
        }`}>
          Upload profile picture (optional)
        </p>
        {isUploadingPhoto && (
          <p className="text-sm text-blue-600 dark:text-blue-400 mt-2">
            Uploading photo...
          </p>
        )}
      </div>

      {/* Personal Information Section */}
      <div className="space-y-6">
        <div className="border-b border-gray-200 dark:border-gray-700 pb-2">
          <h3 className={`text-lg font-semibold ${
            theme === 'light' ? 'text-gray-900' : 'text-white'
          }`}>
            Personal Information
          </h3>
          <p className={`text-sm ${
            theme === 'light' ? 'text-gray-600' : 'text-gray-400'
          }`}>
            Please provide your basic personal details
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="First Name"
          placeholder="John"
          value={profileData.firstName}
          onChange={(e) => updateProfileData('firstName', e.target.value)}
          error={errors.firstName}
          icon={<User className="w-4 h-4" />}
          fullWidth
          required
        />
        
        <Input
          label="Last Name"
          placeholder="Doe"
          value={profileData.lastName}
          onChange={(e) => updateProfileData('lastName', e.target.value)}
          error={errors.lastName}
          icon={<User className="w-4 h-4" />}
          fullWidth
          required
        />
        
        </div>
      </div>

      {/* Contact Information Section */}
      <div className="space-y-6">
        <div className="border-b border-gray-200 dark:border-gray-700 pb-2">
          <h3 className={`text-lg font-semibold ${
            theme === 'light' ? 'text-gray-900' : 'text-white'
          }`}>
            Contact Information
          </h3>
          <p className={`text-sm ${
            theme === 'light' ? 'text-gray-600' : 'text-gray-400'
          }`}>
            How can we reach you?
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Email Address"
            type="email"
            placeholder="john.doe@example.com"
            value={profileData.email}
            onChange={(e) => updateProfileData('email', e.target.value)}
            error={errors.email}
            icon={<Mail className="w-4 h-4" />}
            fullWidth
            required
          />
          
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Phone Number
            </label>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <span
                  className={`inline-flex items-center px-3 py-2 border border-r-0 rounded-l-md select-none
                    ${theme === 'light' ? 'bg-gray-100 border-gray-300 text-gray-700' : 'bg-gray-800 border-gray-600 text-gray-200'}`}
                >
                  +91
                </span>
                <input
                  type="tel"
                  maxLength={10}
                  pattern="[0-9]{10}"
                  value={profileData.phone}
                  onChange={e => {
                    // Only allow digits, max 10
                    const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                    handlePhoneChange(val);
                  }}
                  className={`w-full px-4 py-2 border rounded-r-md focus:ring-2 focus:border-blue-500 ${theme === 'light' ? 'bg-white border-gray-300 text-gray-900' : 'dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100'}`}
                  placeholder="Enter 10 digit mobile number"
                  disabled={otpVerified}
                />
                {otpVerified && <CheckCircle className="w-6 h-6 text-green-500 ml-2" />}
              </div>
              {/* Show Verify button if 10 digit phone and not verified and not otpSent */}
              {!otpVerified && profileData.phone.length === 10 && !otpSent && (
                <button
                  type="button"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 w-fit"
                  onClick={handleSendOtp}
                  disabled={otpLoading || profileData.phone.length !== 10}
                >
                  {otpLoading ? 'Sending...' : 'Verify'}
                </button>
              )}
              {/* OTP input and verify button, shown only after clicking Verify */}
              {otpSent && !otpVerified && (
                <div className="flex items-center gap-2 mt-1">
                  <input
                    type="text"
                    maxLength={6}
                    value={otp}
                    onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
                    className="w-24 px-2 py-1 border rounded focus:ring-2 focus:border-blue-500 dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100"
                    placeholder="Enter OTP"
                    disabled={otpLoading}
                  />
                  <button
                    type="button"
                    className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
                    onClick={handleVerifyOtp}
                    disabled={otpLoading}
                  >
                    {otpLoading ? 'Verifying...' : 'Verify OTP'}
                  </button>
                  {otpError && <span className="text-red-500 text-sm ml-2 flex items-center"><XCircle className="w-4 h-4 mr-1" />{otpError}</span>}
                </div>
              )}
              {errors.phone && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
                  <span className="mr-1">⚠</span>
                  {errors.phone}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Location Information Section */}
      <div className="space-y-6">
        <div className="border-b border-gray-200 dark:border-gray-700 pb-2">
          <h3 className={`text-lg font-semibold ${
            theme === 'light' ? 'text-gray-900' : 'text-white'
          }`}>
            Location Information
          </h3>
          <p className={`text-sm ${
            theme === 'light' ? 'text-gray-600' : 'text-gray-400'
          }`}>
            Where are you located?
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Country <span className="text-red-500">*</span>
            </label>
            <select
              className={`w-full px-4 py-2.5 rounded-lg border focus:ring-2 focus:border-transparent ${
                errors.country ? 'border-red-500' : ''
              }`}
              value={country}
              onChange={e => setCountry(e.target.value)}
            >
              <option value="">Select Country</option>
              {Country.getAllCountries().map(c => (
                <option key={c.isoCode} value={c.isoCode}>
                  {c.flag} {c.name}
                </option>
              ))}
            </select>
            {errors.country && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
                <span className="mr-1">⚠</span>
                {errors.country}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              State <span className="text-red-500">*</span>
            </label>
            <select
              className={`w-full px-4 py-2.5 rounded-lg border focus:ring-2 focus:border-transparent ${
                errors.state ? 'border-red-500' : ''
              }`}
              value={state}
              onChange={e => setState(e.target.value)}
            >
              <option value="">Select State</option>
              {states.map(s => (
                <option key={s.isoCode} value={s.isoCode}>{s.name}</option>
              ))}
            </select>
            {errors.state && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
                <span className="mr-1">⚠</span>
                {errors.state}
              </p>
            )}
          </div>
          {state && (
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                City <span className="text-red-500">*</span>
              </label>
              <select
                className={`w-full px-4 py-2.5 rounded-lg border focus:ring-2 focus:border-transparent ${
                  errors.city ? 'border-red-500' : ''
                }`}
                value={city}
                onChange={e => setCity(e.target.value)}
              >
                <option value="">Select City</option>
                {cities.map(c => (
                  <option key={c.name} value={c.name}>{c.name}</option>
                ))}
              </select>
              {errors.city && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
                  <span className="mr-1">⚠</span>
                  {errors.city}
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Account Security Section */}
      <div className="space-y-6">
        <div className="border-b border-gray-200 dark:border-gray-700 pb-2">
          <h3 className={`text-lg font-semibold ${
            theme === 'light' ? 'text-gray-900' : 'text-white'
          }`}>
            Account Security
          </h3>
          <p className={`text-sm ${
            theme === 'light' ? 'text-gray-600' : 'text-gray-400'
          }`}>
            Set up your account password
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <PasswordInput
            label="Password"
            placeholder="Enter a strong password"
            value={profileData.password}
            onChange={(e) => updateProfileData('password', e.target.value)}
            error={errors.password}
            fullWidth
            required
          />

          {profileData.userType === 'jobseeker' && (
            <Input
              label="Date of Birth"
              type="date"
              value={profileData.dateOfBirth || ''}
              onChange={(e) => updateProfileData('dateOfBirth', e.target.value)}
              fullWidth
            />
          )}
        </div>
      </div>
    </div>
  );

  const renderJobSeekerProfessional = () => {
    const skillSuggestions = [
      'JavaScript', 'Python', 'React', 'Node.js', 'TypeScript', 'Java', 'SQL',
      'AWS', 'Docker', 'Git', 'CSS', 'HTML', 'MongoDB', 'Express.js', 'Vue.js',
      'Angular', 'PHP', 'C++', 'Machine Learning', 'Data Analysis', 'Leadership',
      'Communication', 'Problem Solving', 'Project Management', 'Team Collaboration'
    ];

    const educationLevels = [
      'High School',
      'Associate Degree',
      'Bachelor\'s Degree',
      'Master\'s Degree',
      'PhD',
      'Diploma',
      'Certification',
      'Self-taught',
      'Bootcamp Graduate',
      'Other'
    ];

    const industries = [
      'Technology',
      'Healthcare',
      'Finance',
      'Education',
      'Marketing',
      'Sales',
      'Design',
      'Engineering',
      'Consulting',
      'Non-profit',
      'Government',
      'Retail',
      'Manufacturing',
      'Media & Entertainment',
      'Real Estate',
      'Other'
    ];

    return (
      <div className="space-y-12">
        {/* Current Position & Experience */}
        <div className="space-y-6">
          <div className="border-b border-gray-200 dark:border-gray-700 pb-3 mb-6">
            <h3 className={`text-lg font-semibold ${
              theme === 'light' ? 'text-gray-900' : 'text-white'
            }`}>
              Current Position & Experience
            </h3>
            <p className={`text-sm ${
              theme === 'light' ? 'text-gray-600' : 'text-gray-400'
            }`}>
              Tell us about your current role and experience level
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Current Role (Optional)"
              placeholder="Software Engineer, Student, etc."
              value={profileData.currentRole || ''}
              onChange={(e) => updateProfileData('currentRole', e.target.value)}
              error={errors.currentRole}
              icon={<Briefcase className="w-4 h-4" />}
              fullWidth
            />
            
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                theme === 'light' ? 'text-gray-700' : 'text-gray-300'
              }`}>
                Experience Level <span className="text-red-500">*</span>
              </label>
              <select
                className={`w-full px-4 py-2.5 rounded-lg border focus:ring-2 focus:border-transparent ${
                  theme === 'light'
                    ? 'border-gray-300 bg-white text-gray-900 focus:ring-blue-500'
                    : 'border-gray-600 bg-gray-800 text-white focus:ring-cyan-500'
                } ${errors.experience ? 'border-red-500' : ''}`}
                value={profileData.experience || ''}
                onChange={(e) => updateProfileData('experience', e.target.value)}
              >
                <option value="">Select experience level</option>
                <option value="student">Student/Intern</option>
                <option value="fresher">Fresher (0-1 years)</option>
                <option value="1-2">1-2 years</option>
                <option value="3-5">3-5 years</option>
                <option value="5+">5+ years</option>
              </select>
              {errors.experience && <p className="mt-1 text-sm text-red-600">{errors.experience}</p>}
            </div>
          </div>
        </div>

        {/* Education & Background */}
        <div className="space-y-6">
          <div className="border-b border-gray-200 dark:border-gray-700 pb-3 mb-6">
            <h3 className={`text-lg font-semibold ${
              theme === 'light' ? 'text-gray-900' : 'text-white'
            }`}>
              Education & Background
            </h3>
            <p className={`text-sm ${
              theme === 'light' ? 'text-gray-600' : 'text-gray-400'
            }`}>
              Help us understand your educational background
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                theme === 'light' ? 'text-gray-700' : 'text-gray-300'
              }`}>
                Highest Education Level
              </label>
              <select
                className={`w-full px-4 py-2.5 rounded-lg border focus:ring-2 focus:border-transparent ${
                  theme === 'light'
                    ? 'border-gray-300 bg-white text-gray-900 focus:ring-blue-500'
                    : 'border-gray-600 bg-gray-800 text-white focus:ring-cyan-500'
                }`}
                value={profileData.educationLevel || ''}
                onChange={(e) => updateProfileData('educationLevel', e.target.value)}
              >
                <option value="">Select education level</option>
                {educationLevels.map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>

            <Input
              label="Field of Study (Optional)"
              placeholder="Computer Science, Business, etc."
              value={profileData.fieldOfStudy || ''}
              onChange={(e) => updateProfileData('fieldOfStudy', e.target.value)}
              icon={<GraduationCap className="w-4 h-4" />}
              fullWidth
            />
          </div>
        </div>

        {/* Industry & Career Goals */}
        <div className="space-y-6">
          <div className="border-b border-gray-200 dark:border-gray-700 pb-3 mb-6">
            <h3 className={`text-lg font-semibold ${
              theme === 'light' ? 'text-gray-900' : 'text-white'
            }`}>
              Industry & Career Goals
            </h3>
            <p className={`text-sm ${
              theme === 'light' ? 'text-gray-600' : 'text-gray-400'
            }`}>
              What industry interests you and what are your career goals?
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                theme === 'light' ? 'text-gray-700' : 'text-gray-300'
              }`}>
                Preferred Industry
              </label>
              <select
                className={`w-full px-4 py-2.5 rounded-lg border focus:ring-2 focus:border-transparent ${
                  theme === 'light'
                    ? 'border-gray-300 bg-white text-gray-900 focus:ring-blue-500'
                    : 'border-gray-600 bg-gray-800 text-white focus:ring-cyan-500'
                }`}
                value={profileData.industry || ''}
                onChange={(e) => updateProfileData('industry', e.target.value)}
              >
                <option value="">Select preferred industry</option>
                {industries.map(industry => (
                  <option key={industry} value={industry}>{industry}</option>
                ))}
              </select>
            </div>

            <Input
              label="Career Goal (Optional)"
              placeholder="e.g., Senior Developer, Team Lead, etc."
              value={profileData.careerGoal || ''}
              onChange={(e) => updateProfileData('careerGoal', e.target.value)}
              icon={<Star className="w-4 h-4" />}
              fullWidth
            />
          </div>
        </div>

        {/* Online Presence */}
        <div className="space-y-6">
          <div className="border-b border-gray-200 dark:border-gray-700 pb-3 mb-6">
            <h3 className={`text-lg font-semibold ${
              theme === 'light' ? 'text-gray-900' : 'text-white'
            }`}>
              Online Presence
            </h3>
            <p className={`text-sm ${
              theme === 'light' ? 'text-gray-600' : 'text-gray-400'
            }`}>
              Share your professional online profiles (optional)
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6">
            <Input
              label="Portfolio Website (Optional)"
              placeholder="https://johndoe.dev"
              value={profileData.portfolio || ''}
              onChange={(e) => updateProfileData('portfolio', e.target.value)}
              icon={<Globe className="w-4 h-4" />}
              fullWidth
            />
          </div>
        </div>
      </div>
    );
  };

  const renderCompanyInfo = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Company Name"
          placeholder="TechCorp Inc."
          value={profileData.companyName || ''}
          onChange={(e) => updateProfileData('companyName', e.target.value)}
          error={errors.companyName}
          icon={<Building className="w-4 h-4" />}
          fullWidth
          required
        />
        
        <Input
          label="Company Website"
          placeholder="https://techcorp.com"
          value={profileData.companyWebsite || ''}
          onChange={(e) => updateProfileData('companyWebsite', e.target.value)}
          icon={<Globe className="w-4 h-4" />}
          fullWidth
        />
        
        <div>
          <label className={`block text-sm font-medium mb-2 ${
            theme === 'light' ? 'text-gray-700' : 'text-gray-300'
          }`}>
            Company Size <span className="text-red-500">*</span>
          </label>
          <select
            className={`w-full px-4 py-2.5 rounded-lg border focus:ring-2 focus:border-transparent ${
              theme === 'light'
                ? 'border-gray-300 bg-white text-gray-900 focus:ring-blue-500'
                : 'border-gray-600 bg-gray-800 text-white focus:ring-cyan-500'
            } ${errors.companySize ? 'border-red-500' : ''}`}
            value={profileData.companySize || ''}
            onChange={(e) => updateProfileData('companySize', e.target.value)}
          >
            <option value="">Select company size</option>
            <option value="1-10">1-10 employees</option>
            <option value="11-50">11-50 employees</option>
            <option value="51-200">51-200 employees</option>
            <option value="201-500">201-500 employees</option>
            <option value="501-1000">501-1000 employees</option>
            <option value="1000+">1000+ employees</option>
          </select>
          {errors.companySize && <p className="mt-1 text-sm text-red-600">{errors.companySize}</p>}
        </div>
      </div>

      <div>
        <label className={`block text-sm font-medium mb-2 ${
          theme === 'light' ? 'text-gray-700' : 'text-gray-300'
        }`}>
          Company Description <span className="text-red-500">*</span>
        </label>
        <textarea
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent ${
            theme === 'light'
              ? 'border-gray-300 bg-white text-gray-900 focus:ring-blue-500'
              : 'border-gray-600 bg-gray-800 text-white focus:ring-cyan-500'
          } ${errors.companyDescription ? 'border-red-500' : ''}`}
          rows={4}
          placeholder="Tell us about your company, its mission, and what makes it special..."
          value={profileData.companyDescription || ''}
          onChange={(e) => updateProfileData('companyDescription', e.target.value)}
        />
        {errors.companyDescription && <p className="mt-1 text-sm text-red-600">{errors.companyDescription}</p>}
      </div>
    </div>
  );

  const renderHiringDetails = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={`block text-sm font-medium mb-2 ${
            theme === 'light' ? 'text-gray-700' : 'text-gray-300'
          }`}>
            How many jobs do you plan to post? <span className="text-red-500">*</span>
          </label>
          <select
            className={`w-full px-4 py-2.5 rounded-lg border focus:ring-2 focus:border-transparent ${
              theme === 'light'
                ? 'border-gray-300 bg-white text-gray-900 focus:ring-blue-500'
                : 'border-gray-600 bg-gray-800 text-white focus:ring-cyan-500'
            } ${errors.jobsToPost ? 'border-red-500' : ''}`}
            value={profileData.jobsToPost || ''}
            onChange={(e) => updateProfileData('jobsToPost', e.target.value)}
          >
            <option value="">Select number of jobs</option>
            <option value="1">1 job</option>
            <option value="2-5">2-5 jobs</option>
            <option value="6-10">6-10 jobs</option>
            <option value="11-20">11-20 jobs</option>
            <option value="20+">20+ jobs</option>
          </select>
          {errors.jobsToPost && <p className="mt-1 text-sm text-red-600">{errors.jobsToPost}</p>}
        </div>
        
        <div>
          <label className={`block text-sm font-medium mb-2 ${
            theme === 'light' ? 'text-gray-700' : 'text-gray-300'
          }`}>
            Monthly Hiring Budget <span className="text-red-500">*</span>
          </label>
          <select
            className={`w-full px-4 py-2.5 rounded-lg border focus:ring-2 focus:border-transparent ${
              theme === 'light'
                ? 'border-gray-300 bg-white text-gray-900 focus:ring-blue-500'
                : 'border-gray-600 bg-gray-800 text-white focus:ring-cyan-500'
            } ${errors.hiringBudget ? 'border-red-500' : ''}`}
            value={profileData.hiringBudget || ''}
            onChange={(e) => updateProfileData('hiringBudget', e.target.value)}
          >
            <option value="">Select budget range</option>
            <option value="under-50k">Under ₹50,000</option>
            <option value="50k-100k">₹50,000 - ₹1,00,000</option>
            <option value="100k-300k">₹1,00,000 - ₹3,00,000</option>
            <option value="300k-500k">₹3,00,000 - ₹5,00,000</option>
            <option value="500k+">₹5,00,000+</option>
          </select>
          {errors.hiringBudget && <p className="mt-1 text-sm text-red-600">{errors.hiringBudget}</p>}
        </div>
      </div>

      <Card className={`${
        theme === 'light' 
          ? 'bg-blue-50 border-blue-200' 
          : 'bg-blue-900/20 border-blue-800'
      }`}>
        <h4 className={`text-md font-medium mb-2 ${
          theme === 'light' ? 'text-blue-900' : 'text-blue-300'
        }`}>
          What you'll get with Munus:
        </h4>
        <ul className={`text-sm space-y-1 ${
          theme === 'light' ? 'text-blue-800' : 'text-blue-400'
        }`}>
          <li>• AI-powered candidate matching</li>
          <li>• Advanced filtering and search tools</li>
          <li>• Video resume reviews</li>
          <li>• Streamlined application management</li>
          <li>• Analytics and hiring insights</li>
          <li>• Priority customer support</li>
        </ul>
      </Card>
    </div>
  );

  const renderJobSeekerPreferences = () => {
    const jobTypes = [
      { value: 'full-time', label: 'Full-time' },
      { value: 'part-time', label: 'Part-time' },
      { value: 'internship', label: 'Internship' },
      { value: 'contract', label: 'Contract' },
      { value: 'freelance', label: 'Freelance' },
    ];

    const workModes = [
      { value: 'remote', label: 'Remote' },
      { value: 'onsite', label: 'On-site' },
      { value: 'hybrid', label: 'Hybrid' },
    ];

    return (
      <div className="space-y-6">
        <div>
          <label className={`block text-sm font-medium mb-3 ${
            theme === 'light' ? 'text-gray-700' : 'text-gray-300'
          }`}>
            Preferred Job Types <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {jobTypes.map((type) => (
              <button
                key={type.value}
                onClick={() => handleArrayToggle('jobType', type.value)}
                className={`p-3 rounded-lg border-2 transition-all ${
                  profileData.jobType?.includes(type.value)
                    ? `border-blue-500 ${
                        theme === 'light' 
                          ? 'bg-blue-50 text-blue-700' 
                          : 'bg-blue-900/20 text-blue-300'
                      }`
                    : `border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500`
                }`}
              >
                <span className="text-sm font-medium">{type.label}</span>
              </button>
            ))}
          </div>
          {errors.jobType && <p className="mt-1 text-sm text-red-600">{errors.jobType}</p>}
        </div>

        <div>
          <label className={`block text-sm font-medium mb-3 ${
            theme === 'light' ? 'text-gray-700' : 'text-gray-300'
          }`}>
            Preferred Work Mode <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {workModes.map((mode) => (
              <button
                key={mode.value}
                onClick={() => handleArrayToggle('workMode', mode.value)}
                className={`p-4 rounded-lg border-2 transition-all ${
                  profileData.workMode?.includes(mode.value)
                    ? `border-blue-500 ${
                        theme === 'light' 
                          ? 'bg-blue-50 text-blue-700' 
                          : 'bg-blue-900/20 text-blue-300'
                      }`
                    : `border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500`
                }`}
              >
                <span className="text-sm font-medium">{mode.label}</span>
              </button>
            ))}
          </div>
          {errors.workMode && <p className="mt-1 text-sm text-red-600">{errors.workMode}</p>}
        </div>

        <div>
          <label className={`block text-sm font-medium mb-2 ${
            theme === 'light' ? 'text-gray-700' : 'text-gray-300'
          }`}>
            Expected Salary Range (Monthly)
          </label>
          <select
            className={`w-full px-4 py-2.5 rounded-lg border focus:ring-2 focus:border-transparent ${
              theme === 'light'
                ? 'border-gray-300 bg-white text-gray-900 focus:ring-blue-500'
                : 'border-gray-600 bg-gray-800 text-white focus:ring-cyan-500'
            }`}
            value={profileData.expectedSalary || ''}
            onChange={(e) => updateProfileData('expectedSalary', e.target.value)}
          >
            <option value="">Select salary range</option>
            <option value="0-25000">₹0 - ₹25,000</option>
            <option value="25000-50000">₹25,000 - ₹50,000</option>
            <option value="50000-100000">₹50,000 - ₹1,00,000</option>
            <option value="100000-200000">₹1,00,000 - ₹2,00,000</option>
            <option value="200000+">₹2,00,000+</option>
          </select>
        </div>
      </div>
    );
  };

  const renderComplete = () => (
    <div className="text-center space-y-6">
      <div className={`w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto ${
        theme === 'dark-neon' ? 'shadow-lg shadow-green-500/25' : 'shadow-lg'
      }`}>
        <CheckCircle className="w-10 h-10 text-white" />
      </div>
      
      <div>
        <h3 className={`text-2xl font-bold mb-2 ${
          theme === 'light' ? 'text-gray-900' : 'text-white'
        }`}>
          Profile Almost Complete!
        </h3>
        <p className={`${
          theme === 'light' ? 'text-gray-600' : 'text-gray-400'
        }`}>
          Review your information and create your Munus account
        </p>
      </div>

      <Card className="text-left max-w-md mx-auto">
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className={`text-sm ${
              theme === 'light' ? 'text-gray-600' : 'text-gray-400'
            }`}>Name:</span>
            <span className="text-sm font-medium">{profileData.firstName} {profileData.lastName}</span>
          </div>
          <div className="flex justify-between">
            <span className={`text-sm ${
              theme === 'light' ? 'text-gray-600' : 'text-gray-400'
            }`}>Email:</span>
            <span className="text-sm font-medium">{profileData.email}</span>
          </div>
          <div className="flex justify-between">
            <span className={`text-sm ${
              theme === 'light' ? 'text-gray-600' : 'text-gray-400'
            }`}>Role:</span>
            <span className="text-sm font-medium">
              {profileData.userType === 'jobseeker' ? 'Job Seeker' : 'Employer'}
            </span>
          </div>
          {profileData.userType === 'jobseeker' ? (
            <>
              <div className="flex justify-between">
                <span className={`text-sm ${
                  theme === 'light' ? 'text-gray-600' : 'text-gray-400'
                }`}>Current Role:</span>
                <span className="text-sm font-medium">{profileData.currentRole}</span>
              </div>
              <div className="flex justify-between">
                <span className={`text-sm ${
                  theme === 'light' ? 'text-gray-600' : 'text-gray-400'
                }`}>Experience:</span>
                <span className="text-sm font-medium">{profileData.experience}</span>
              </div>
              <div className="flex justify-between">
                <span className={`text-sm ${
                  theme === 'light' ? 'text-gray-600' : 'text-gray-400'
                }`}>Skills:</span>
                <span className="text-sm font-medium">{profileData.skills?.length || 0} skills</span>
              </div>
            </>
          ) : (
            <>
              <div className="flex justify-between">
                <span className={`text-sm ${
                  theme === 'light' ? 'text-gray-600' : 'text-gray-400'
                }`}>Company:</span>
                <span className="text-sm font-medium">{profileData.companyName}</span>
              </div>
              <div className="flex justify-between">
                <span className={`text-sm ${
                  theme === 'light' ? 'text-gray-600' : 'text-gray-400'
                }`}>Industry:</span>
                <span className="text-sm font-medium">{profileData.companyIndustry}</span>
              </div>
              <div className="flex justify-between">
                <span className={`text-sm ${
                  theme === 'light' ? 'text-gray-600' : 'text-gray-400'
                }`}>Company Size:</span>
                <span className="text-sm font-medium">{profileData.companySize}</span>
              </div>
            </>
          )}
        </div>
      </Card>

      {errors.general && (
        <p className="text-sm text-red-600">{errors.general}</p>
      )}
    </div>
  );

  const renderStepContent = () => {
    const currentStepId = steps[currentStep].id;
    
    try {
      switch (currentStepId) {
        case 'role': return renderRoleSelection();
        case 'personal': return renderPersonalInfo();
        case 'professional': return renderJobSeekerProfessional();
        case 'company': return renderCompanyInfo();
        case 'hiring': return renderHiringDetails();
        case 'preferences': return renderJobSeekerPreferences();
        case 'complete': return renderComplete();
        default: return renderRoleSelection();
      }
    } catch (error) {
      console.error('Error rendering step content:', error);
      return (
        <div className="text-center py-8">
          <p className="text-red-600">Error loading step content. Please try again.</p>
        </div>
      );
    }
  };

  return (
    <div className={`min-h-screen py-12 ${
      theme === 'light' 
        ? 'bg-gradient-to-br from-blue-50 via-white to-purple-50' 
        : 'bg-gradient-to-br from-gray-900 via-gray-900 to-blue-900'
    }`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className={`w-8 h-8 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-lg flex items-center justify-center ${
              theme === 'dark-neon' ? 'shadow-lg shadow-blue-500/25' : 'shadow-lg'
            }`}>
              <Zap className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-500 bg-clip-text text-transparent">
              SkillGlide
            </h1>
          </div>
          <h2 className={`text-3xl font-bold mb-2 ${
            theme === 'light' ? 'text-gray-900' : 'text-white'
          }`}>
            Create Your Profile
          </h2>
          <p className={`${
            theme === 'light' ? 'text-gray-600' : 'text-gray-400'
          }`}>
            {profileData.userType === 'jobseeker' 
              ? "Let's set up your profile to find the perfect job opportunities"
              : profileData.userType === 'employer'
              ? "Let's set up your company profile to find the best talent"
              : "Let's get started by understanding how you'd like to use our platform"
            }
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4 mb-4">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = index === currentStep;
              const isComplete = index < currentStep;
              
              return (
                <div key={step.id} className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                    isActive
                      ? `bg-blue-600 text-white ${theme === 'dark-neon' ? 'shadow-lg shadow-blue-500/25' : 'shadow-lg'}`
                      : isComplete
                      ? 'bg-green-500 text-white'
                      : `${theme === 'light' ? 'bg-gray-200 text-gray-500' : 'bg-gray-700 text-gray-500'}`
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-16 h-1 mx-2 ${
                      isComplete 
                        ? 'bg-green-500' 
                        : theme === 'light' ? 'bg-gray-200' : 'bg-gray-700'
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
          
          <div className="text-center">
            <h3 className={`text-lg font-semibold ${
              theme === 'light' ? 'text-gray-900' : 'text-white'
            }`}>
              {steps[currentStep].name}
            </h3>
            <p className={`text-sm ${
              theme === 'light' ? 'text-gray-600' : 'text-gray-400'
            }`}>
              Step {currentStep + 1} of {steps.length}
            </p>
          </div>
        </div>

        {/* General Error Display */}
        {errors.general && (
          <div className="max-w-3xl mx-auto mb-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 dark:bg-red-900/20 dark:border-red-800">
              <div className="flex items-center">
                <XCircle className="w-5 h-5 text-red-500 mr-2" />
                <p className="text-red-700 dark:text-red-400 font-medium">{errors.general}</p>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <Card className="max-w-3xl mx-auto">
          <div className="min-h-[500px]">
            {renderStepContent()}
          </div>

          {/* Navigation Buttons */}
          <div className={`flex justify-between items-center pt-8 border-t ${
            theme === 'light' ? 'border-gray-200' : 'border-gray-700'
          }`}>
            <Button
              variant="outline"
              onClick={currentStep === 0 ? onBack : prevStep}
              disabled={isSubmitting}
              icon={<ArrowLeft className="w-4 h-4" />}
            >
              {currentStep === 0 ? 'Back to Home' : 'Previous'}
            </Button>

            <div className="flex space-x-3">
              {currentStep === steps.length - 1 ? (
                <Button
                  variant="primary"
                  onClick={handleSubmit}
                  loading={isSubmitting}
                  icon={<CheckCircle className="w-4 h-4" />}
                  iconPosition="right"
                  className="shadow-lg"
                  disabled={isSubmitting}
                >
                  Create Account
                </Button>
              ) : (
                <Button 
                  variant="primary" 
                  onClick={nextStep}
                  icon={<ArrowRight className="w-4 h-4" />}
                  iconPosition="right"
                  disabled={isSubmitting}
                >
                  Continue
                </Button>
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};