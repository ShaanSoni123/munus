import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, Building, Globe, Camera, Save, Edit3, Plus, Trash2, Award, Briefcase, GraduationCap, Star, Settings, Shield, Bell, Eye, Download, Upload, CheckCircle, AlertCircle } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Badge } from '../ui/Badge';
import { PhotoUpload } from '../ui/PhotoUpload';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { userService } from '../../services/userService';
import { useApi } from '../../hooks/useApi';

interface ProfilePageProps {
  onNavigate?: (view: 'home' | 'jobs' | 'resume' | 'profile' | 'create-profile' | 'dashboard' | 'post-job' | 'candidates') => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ onNavigate }) => {
  const { user, isEmployer, isJobSeeker, refreshUser } = useAuth();
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState('personal');
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [selectedPhoto, setSelectedPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string>('');
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [profileData, setProfileData] = useState({
    // Personal Info
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    location: user?.location || '',
    bio: user?.bio || '',
    avatar: user?.avatar_url || '',
    
    // Professional Info (Job Seeker)
    experience_years: user?.experience_years || 0,
    expected_salary_min: user?.expected_salary_min || 0,
    expected_salary_max: user?.expected_salary_max || 0,
    preferred_job_type: user?.preferred_job_type || '',
    preferred_work_mode: user?.preferred_work_mode || '',
    linkedin_url: user?.linkedin_url || '',
    github_url: user?.github_url || '',
    portfolio_url: user?.portfolio_url || '',
    
    // Settings
    emailNotifications: true,
    jobAlerts: true,
    profileVisibility: 'public',
    twoFactorAuth: false,
  });

  const tabs = isJobSeeker ? [
    { id: 'personal', name: 'Personal Info', icon: User },
    { id: 'professional', name: 'Professional', icon: Briefcase },
    { id: 'preferences', name: 'Job Preferences', icon: Star },
    { id: 'privacy', name: 'Privacy & Settings', icon: Settings },
  ] : [
    { id: 'personal', name: 'Personal Info', icon: User },
    { id: 'company', name: 'Company Info', icon: Building },
    { id: 'privacy', name: 'Privacy & Settings', icon: Settings },
  ];

  const updateProfileData = (field: string, value: any) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
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
      console.log('ProfilePage: Starting photo upload for file:', file.name);
      const response = await userService.uploadAvatar(file);
      console.log('ProfilePage: Photo upload successful:', response);
      return response.avatar_url;
    } catch (error: any) {
      console.error('ProfilePage: Photo upload failed:', error);
      const errorMessage = error.message || 'Failed to upload photo. Please try again.';
      throw new Error(errorMessage);
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveMessage('');
    
    try {
      // Upload photo first if selected
      let avatarUrl = profileData.avatar;
      if (selectedPhoto) {
        try {
          console.log('ProfilePage: Uploading photo before profile update...');
          avatarUrl = await uploadPhoto(selectedPhoto);
          console.log('ProfilePage: Photo uploaded successfully:', avatarUrl);
          
          // Update the profile data with the new avatar URL immediately
          setProfileData(prev => ({ ...prev, avatar: avatarUrl }));
        } catch (error: any) {
          console.error('ProfilePage: Photo upload failed during profile update:', error);
          setSaveMessage(error.message || 'Failed to upload photo. Please try again.');
          setIsSaving(false);
          return;
        }
      }

      await userService.updateProfile({
        name: profileData.name,
        phone: profileData.phone,
        location: profileData.location,
        bio: profileData.bio,
        avatar_url: avatarUrl,
        experience_years: profileData.experience_years,
        expected_salary_min: profileData.expected_salary_min,
        expected_salary_max: profileData.expected_salary_max,
        preferred_job_type: profileData.preferred_job_type,
        preferred_work_mode: profileData.preferred_work_mode,
        linkedin_url: profileData.linkedin_url,
        github_url: profileData.github_url,
        portfolio_url: profileData.portfolio_url,
      });
      
      // Refresh user data to get the latest information from server
      await refreshUser();
      
      // Update profile data with the refreshed user data
      const refreshedUser = await userService.getCurrentUser();
      setProfileData(prev => ({
        ...prev,
        name: refreshedUser.name || prev.name,
        email: refreshedUser.email || prev.email,
        phone: refreshedUser.phone || prev.phone,
        location: refreshedUser.location || prev.location,
        bio: refreshedUser.bio || prev.bio,
        avatar: refreshedUser.avatar_url || prev.avatar,
        experience_years: refreshedUser.experience_years || prev.experience_years,
        expected_salary_min: refreshedUser.expected_salary_min || prev.expected_salary_min,
        expected_salary_max: refreshedUser.expected_salary_max || prev.expected_salary_max,
        preferred_job_type: refreshedUser.preferred_job_type || prev.preferred_job_type,
        preferred_work_mode: refreshedUser.preferred_work_mode || prev.preferred_work_mode,
        linkedin_url: refreshedUser.linkedin_url || prev.linkedin_url,
        github_url: refreshedUser.github_url || prev.github_url,
        portfolio_url: refreshedUser.portfolio_url || prev.portfolio_url,
      }));
      
      setIsEditing(false);
      setSaveMessage('Profile updated successfully!');
      
      // Clear photo state
      setSelectedPhoto(null);
      if (photoPreview) {
        URL.revokeObjectURL(photoPreview);
        setPhotoPreview('');
      }
      
      // Clear success message after 3 seconds
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (error: any) {
      console.error('Profile save error:', error);
      const errorMessage = error?.message || 'Failed to save profile. Please try again.';
      setSaveMessage(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setSaveMessage('');
    
    // Clear photo state
    setSelectedPhoto(null);
    if (photoPreview) {
      URL.revokeObjectURL(photoPreview);
      setPhotoPreview('');
    }
    
    // Reset form data
    setProfileData({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      location: user?.location || '',
      bio: user?.bio || '',
      avatar: user?.avatar_url || '',
      experience_years: user?.experience_years || 0,
      expected_salary_min: user?.expected_salary_min || 0,
      expected_salary_max: user?.expected_salary_max || 0,
      preferred_job_type: user?.preferred_job_type || '',
      preferred_work_mode: user?.preferred_work_mode || '',
      linkedin_url: user?.linkedin_url || '',
      github_url: user?.github_url || '',
      portfolio_url: user?.portfolio_url || '',
      emailNotifications: true,
      jobAlerts: true,
      profileVisibility: 'public',
      twoFactorAuth: false,
    });
  };

  const renderPersonalInfo = () => (
    <div className="space-y-6">
      {/* Profile Picture */}
      <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
        <PhotoUpload
          currentPhoto={photoPreview || profileData.avatar}
          onPhotoChange={handlePhotoChange}
          onPhotoRemove={handlePhotoRemove}
          disabled={!isEditing || isUploadingPhoto}
          size="lg"
          className="flex-shrink-0"
        />
        <div>
          <h3 className={`text-lg font-semibold ${
            theme === 'light' ? 'text-gray-900' : 'text-white'
          }`}>
            Profile Picture
          </h3>
          <p className={`text-sm ${
            theme === 'light' ? 'text-gray-600' : 'text-gray-400'
          }`}>
            Upload a professional photo to make a great first impression. 
            {isEditing && ' You can drag and drop an image, browse files, or use your camera.'}
          </p>
          {isUploadingPhoto && (
            <p className="text-sm text-blue-600 dark:text-blue-400 mt-2">
              Uploading photo...
            </p>
          )}
        </div>
      </div>

      {/* Basic Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Full Name"
          value={profileData.name}
          onChange={(e) => updateProfileData('name', e.target.value)}
          disabled={!isEditing}
          icon={<User className="w-4 h-4" />}
          fullWidth
        />
        
        <Input
          label="Email Address"
          type="email"
          value={profileData.email}
          onChange={(e) => updateProfileData('email', e.target.value)}
          disabled={true} // Email should not be editable
          icon={<Mail className="w-4 h-4" />}
          fullWidth
        />
        
        <Input
          label="Phone Number"
          value={profileData.phone}
          onChange={(e) => updateProfileData('phone', e.target.value)}
          disabled={!isEditing}
          icon={<Phone className="w-4 h-4" />}
          fullWidth
        />
        
        <Input
          label="Location"
          value={profileData.location}
          onChange={(e) => updateProfileData('location', e.target.value)}
          disabled={!isEditing}
          icon={<MapPin className="w-4 h-4" />}
          fullWidth
        />
      </div>

      {/* Bio */}
      <div>
        <label className={`block text-sm font-medium mb-2 ${
          theme === 'light' ? 'text-gray-700' : 'text-gray-300'
        }`}>
          Bio / About Me
        </label>
        <textarea
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent transition-colors ${
            theme === 'light'
              ? 'border-gray-300 bg-white text-gray-900 focus:ring-blue-500'
              : 'border-gray-600 bg-gray-800 text-white focus:ring-cyan-500'
          } ${!isEditing ? 'bg-gray-50 dark:bg-gray-700 cursor-not-allowed' : ''}`}
          rows={4}
          value={profileData.bio}
          onChange={(e) => updateProfileData('bio', e.target.value)}
          disabled={!isEditing}
          placeholder="Tell us about yourself, your interests, and what drives you..."
        />
      </div>
    </div>
  );

  const renderProfessionalInfo = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={`block text-sm font-medium mb-2 ${
            theme === 'light' ? 'text-gray-700' : 'text-gray-300'
          }`}>
            Years of Experience
          </label>
          <input
            type="number"
            className={`w-full px-4 py-2.5 rounded-lg border focus:ring-2 focus:border-transparent transition-colors ${
              theme === 'light'
                ? 'border-gray-300 bg-white text-gray-900 focus:ring-blue-500'
                : 'border-gray-600 bg-gray-800 text-white focus:ring-cyan-500'
            } ${!isEditing ? 'bg-gray-50 dark:bg-gray-700 cursor-not-allowed' : ''}`}
            value={profileData.experience_years}
            onChange={(e) => updateProfileData('experience_years', parseInt(e.target.value) || 0)}
            disabled={!isEditing}
            min="0"
            max="50"
          />
        </div>
        
        <div>
          <label className={`block text-sm font-medium mb-2 ${
            theme === 'light' ? 'text-gray-700' : 'text-gray-300'
          }`}>
            Preferred Work Mode
          </label>
          <select
            className={`w-full px-4 py-2.5 rounded-lg border focus:ring-2 focus:border-transparent transition-colors ${
              theme === 'light'
                ? 'border-gray-300 bg-white text-gray-900 focus:ring-blue-500'
                : 'border-gray-600 bg-gray-800 text-white focus:ring-cyan-500'
            } ${!isEditing ? 'bg-gray-50 dark:bg-gray-700 cursor-not-allowed' : ''}`}
            value={profileData.preferred_work_mode}
            onChange={(e) => updateProfileData('preferred_work_mode', e.target.value)}
            disabled={!isEditing}
          >
            <option value="">Select work mode</option>
            <option value="remote">Remote</option>
            <option value="hybrid">Hybrid</option>
            <option value="onsite">On-site</option>
          </select>
        </div>
        
        <div>
          <label className={`block text-sm font-medium mb-2 ${
            theme === 'light' ? 'text-gray-700' : 'text-gray-300'
          }`}>
            Preferred Job Type
          </label>
          <select
            className={`w-full px-4 py-2.5 rounded-lg border focus:ring-2 focus:border-transparent transition-colors ${
              theme === 'light'
                ? 'border-gray-300 bg-white text-gray-900 focus:ring-blue-500'
                : 'border-gray-600 bg-gray-800 text-white focus:ring-cyan-500'
            } ${!isEditing ? 'bg-gray-50 dark:bg-gray-700 cursor-not-allowed' : ''}`}
            value={profileData.preferred_job_type}
            onChange={(e) => updateProfileData('preferred_job_type', e.target.value)}
            disabled={!isEditing}
          >
            <option value="">Select job type</option>
            <option value="full-time">Full-time</option>
            <option value="part-time">Part-time</option>
            <option value="contract">Contract</option>
            <option value="freelance">Freelance</option>
            <option value="internship">Internship</option>
          </select>
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          <Input
            label="Expected Salary Min"
            type="number"
            value={profileData.expected_salary_min || ''}
            onChange={(e) => updateProfileData('expected_salary_min', parseInt(e.target.value) || 0)}
            disabled={!isEditing}
            fullWidth
          />
          <Input
            label="Expected Salary Max"
            type="number"
            value={profileData.expected_salary_max || ''}
            onChange={(e) => updateProfileData('expected_salary_max', parseInt(e.target.value) || 0)}
            disabled={!isEditing}
            fullWidth
          />
        </div>
      </div>

      {/* Social Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Input
          label="LinkedIn Profile"
          value={profileData.linkedin_url}
          onChange={(e) => updateProfileData('linkedin_url', e.target.value)}
          disabled={!isEditing}
          icon={<Globe className="w-4 h-4" />}
          fullWidth
        />
        
        <Input
          label="GitHub Profile"
          value={profileData.github_url}
          onChange={(e) => updateProfileData('github_url', e.target.value)}
          disabled={!isEditing}
          icon={<Globe className="w-4 h-4" />}
          fullWidth
        />
        
        <Input
          label="Portfolio Website"
          value={profileData.portfolio_url}
          onChange={(e) => updateProfileData('portfolio_url', e.target.value)}
          disabled={!isEditing}
          icon={<Globe className="w-4 h-4" />}
          fullWidth
        />
      </div>
    </div>
  );

  const renderJobPreferences = () => (
    <div className="space-y-6">
      <Card className={`${
        theme === 'light' 
          ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200' 
          : 'bg-gradient-to-br from-green-900/20 to-emerald-900/20 border-green-800'
      }`}>
        <h3 className={`text-lg font-semibold mb-4 ${
          theme === 'light' ? 'text-green-900' : 'text-green-300'
        }`}>
          Job Preferences
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className={`font-medium mb-2 ${
              theme === 'light' ? 'text-green-800' : 'text-green-400'
            }`}>
              Work Mode
            </h4>
            <p className={`text-sm ${
              theme === 'light' ? 'text-green-700' : 'text-green-300'
            }`}>
              {profileData.preferred_work_mode || 'Not specified'}
            </p>
          </div>
          <div>
            <h4 className={`font-medium mb-2 ${
              theme === 'light' ? 'text-green-800' : 'text-green-400'
            }`}>
              Job Type
            </h4>
            <p className={`text-sm ${
              theme === 'light' ? 'text-green-700' : 'text-green-300'
            }`}>
              {profileData.preferred_job_type || 'Not specified'}
            </p>
          </div>
          <div>
            <h4 className={`font-medium mb-2 ${
              theme === 'light' ? 'text-green-800' : 'text-green-400'
            }`}>
              Expected Salary
            </h4>
            <p className={`text-sm ${
              theme === 'light' ? 'text-green-700' : 'text-green-300'
            }`}>
              {profileData.expected_salary_min && profileData.expected_salary_max 
                ? `₹${profileData.expected_salary_min.toLocaleString()} - ₹${profileData.expected_salary_max.toLocaleString()}`
                : 'Not specified'
              }
            </p>
          </div>
          <div>
            <h4 className={`font-medium mb-2 ${
              theme === 'light' ? 'text-green-800' : 'text-green-400'
            }`}>
              Experience
            </h4>
            <p className={`text-sm ${
              theme === 'light' ? 'text-green-700' : 'text-green-300'
            }`}>
              {profileData.experience_years ? `${profileData.experience_years} years` : 'Not specified'}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );

  const renderPrivacySettings = () => (
    <div className="space-y-6">
      {/* Notification Settings */}
      <Card>
        <h3 className={`text-lg font-semibold mb-4 flex items-center ${
          theme === 'light' ? 'text-gray-900' : 'text-white'
        }`}>
          <Bell className="w-5 h-5 mr-2" />
          Notification Preferences
        </h3>
        
        <div className="space-y-4">
          {[
            { key: 'emailNotifications', label: 'Email Notifications', description: 'Receive important updates via email' },
            { key: 'jobAlerts', label: 'Job Alerts', description: 'Get notified about new job opportunities' },
          ].map((setting) => (
            <div key={setting.key} className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-700">
              <div>
                <h4 className={`font-medium ${
                  theme === 'light' ? 'text-gray-900' : 'text-white'
                }`}>
                  {setting.label}
                </h4>
                <p className={`text-sm ${
                  theme === 'light' ? 'text-gray-600' : 'text-gray-400'
                }`}>
                  {setting.description}
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={profileData[setting.key as keyof typeof profileData] as boolean}
                  onChange={(e) => updateProfileData(setting.key, e.target.checked)}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>
          ))}
        </div>
      </Card>

      {/* Privacy Settings */}
      <Card>
        <h3 className={`text-lg font-semibold mb-4 flex items-center ${
          theme === 'light' ? 'text-gray-900' : 'text-white'
        }`}>
          <Eye className="w-5 h-5 mr-2" />
          Privacy Settings
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className={`block text-sm font-medium mb-2 ${
              theme === 'light' ? 'text-gray-700' : 'text-gray-300'
            }`}>
              Profile Visibility
            </label>
            <select
              className={`w-full px-4 py-2.5 rounded-lg border focus:ring-2 focus:border-transparent transition-colors ${
                theme === 'light'
                  ? 'border-gray-300 bg-white text-gray-900 focus:ring-blue-500'
                  : 'border-gray-600 bg-gray-800 text-white focus:ring-cyan-500'
              }`}
              value={profileData.profileVisibility}
              onChange={(e) => updateProfileData('profileVisibility', e.target.value)}
            >
              <option value="public">Public - Visible to everyone</option>
              <option value="recruiters">Recruiters Only - Visible to verified recruiters</option>
              <option value="private">Private - Only visible to you</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Security Settings */}
      <Card>
        <h3 className={`text-lg font-semibold mb-4 flex items-center ${
          theme === 'light' ? 'text-gray-900' : 'text-white'
        }`}>
          <Shield className="w-5 h-5 mr-2" />
          Security Settings
        </h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-700">
            <div>
              <h4 className={`font-medium ${
                theme === 'light' ? 'text-gray-900' : 'text-white'
              }`}>
                Two-Factor Authentication
              </h4>
              <p className={`text-sm ${
                theme === 'light' ? 'text-gray-600' : 'text-gray-400'
              }`}>
                Add an extra layer of security to your account
              </p>
            </div>
            <Button
              variant={profileData.twoFactorAuth ? 'success' : 'outline'}
              size="sm"
              onClick={() => updateProfileData('twoFactorAuth', !profileData.twoFactorAuth)}
            >
              {profileData.twoFactorAuth ? 'Enabled' : 'Enable'}
            </Button>
          </div>
          
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm">
                Change Password
              </Button>
              <Button variant="outline" size="sm">
                Download My Data
              </Button>
              <Button variant="outline" size="sm">
                Delete Account
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'personal': return renderPersonalInfo();
      case 'professional': return renderProfessionalInfo();
      case 'preferences': return renderJobPreferences();
      case 'privacy': return renderPrivacySettings();
      default: return renderPersonalInfo();
    }
  };

  return (
    <div className={`max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 ${
      theme === 'light' ? 'min-h-screen' : ''
    }`}>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className={`text-4xl font-bold mb-2 ${
              theme === 'light' ? 'text-gray-900' : 'text-white'
            }`}>
              Profile Settings
            </h1>
            <p className={`text-xl ${
              theme === 'light' ? 'text-gray-600' : 'text-gray-400'
            }`}>
              Manage your profile information and account preferences
            </p>
          </div>
          
          <div className="flex space-x-3">
            {isEditing ? (
              <>
                <Button
                  variant="outline"
                  onClick={handleCancel}
                  disabled={isSaving}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={handleSave}
                  loading={isSaving}
                  icon={<Save className="w-4 h-4" />}
                  className="shadow-lg"
                >
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </Button>
              </>
            ) : (
              <Button
                variant="primary"
                onClick={() => setIsEditing(true)}
                icon={<Edit3 className="w-4 h-4" />}
                className="shadow-lg hover-lift"
              >
                Edit Profile
              </Button>
            )}
          </div>
        </div>

        {/* Save Message */}
        {saveMessage && (
          <div className={`mt-4 p-3 rounded-lg flex items-center space-x-2 ${
            saveMessage.includes('success') 
              ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
              : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
          }`}>
            {saveMessage.includes('success') ? (
              <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
            )}
            <p className={`text-sm ${
              saveMessage.includes('success') 
                ? 'text-green-700 dark:text-green-300'
                : 'text-red-700 dark:text-red-300'
            }`}>
              {saveMessage}
            </p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <nav className="space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-3 py-3 rounded-lg text-left transition-all duration-200 hover:scale-105 ${
                      isActive
                        ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 shadow-md'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{tab.name}</span>
                  </button>
                );
              })}
            </nav>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <Card className="min-h-[600px]">
            <div className="mb-6">
              <h2 className={`text-2xl font-bold ${
                theme === 'light' ? 'text-gray-900' : 'text-white'
              }`}>
                {tabs.find(tab => tab.id === activeTab)?.name}
              </h2>
            </div>
            
            {renderTabContent()}
          </Card>
        </div>
      </div>
    </div>
  );
};