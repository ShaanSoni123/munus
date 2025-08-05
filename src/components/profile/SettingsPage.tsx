import React, { useState, useEffect } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { useAuth } from '../../contexts/AuthContext';
import { userService } from '../../services/userService';
import { 
  User, 
  Bell, 
  Shield, 
  Briefcase, 
  MapPin, 
  DollarSign, 
  Eye, 
  EyeOff,
  Save,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  HelpCircle,
  Lock,
  Eye as VisibilityIcon,
  Database,
  FileText,
  ChevronRight,
  Settings as SettingsIcon,
  Mail,
  Smartphone,
  Globe,
  Heart,
  Zap,
  Moon,
  Sun,
  Trash2,
  Download,
  LogOut
} from 'lucide-react';
import type { User as UserType } from '../../types';

interface SettingsSection {
  id: string;
  title: string;
  icon: React.ComponentType<any>;
  description: string;
  color: string;
}

interface SettingsPageProps {
  onNavigate?: (view: 'home' | 'jobs' | 'resume' | 'profile' | 'create-profile' | 'dashboard' | 'post-job' | 'candidates' | 'faqs' | 'contact' | 'settings' | 'notifications') => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ onNavigate }) => {
  const { user, updateUser, logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  
  // Profile Settings
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    location: user?.location || '',
    bio: user?.bio || '',
    linkedin_url: user?.linkedin_url || ''
  });

  // Job Preferences
  const [preferences, setPreferences] = useState({
    preferred_job_type: user?.preferred_job_type || 'full_time',
    preferred_work_mode: user?.preferred_work_mode || 'hybrid',
    salary_min: user?.salary_min || '',
    salary_max: user?.salary_max || '',
    preferred_locations: user?.preferred_locations || ''
  });

  // Notification Settings
  const [notifications, setNotifications] = useState({
    email_notifications: true,
    job_alerts: true,
    application_updates: true,
    marketing_emails: false,
    push_notifications: true,
    sms_notifications: false
  });

  // Security Settings
  const [security, setSecurity] = useState({
    current_password: '',
    new_password: '',
    confirm_password: '',
    show_password: false,
    two_factor_enabled: false
  });

  const [profileVisibility, setProfileVisibility] = useState(user?.profile_visibility || 'public');

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleProfileSave = async () => {
    setSaving(true);
    setMessage(null); // Clear any previous messages
    try {
      console.log('SettingsPage: Saving profile with data:', profileData);
      const updatedUser = await userService.updateProfile(profileData);
      console.log('SettingsPage: Profile save successful:', updatedUser);
      updateUser(updatedUser);
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (error: any) {
      console.error('SettingsPage: Profile save failed:', error);
      const errorMessage = error?.message || 'Failed to update profile';
      setMessage({ type: 'error', text: errorMessage });
    } finally {
      setSaving(false);
    }
  };

  const handlePreferencesSave = async () => {
    setSaving(true);
    try {
      const updatedUser = await userService.updateProfile({
        ...profileData,
        ...preferences
      });
      updateUser(updatedUser);
      setMessage({ type: 'success', text: 'Preferences updated successfully!' });
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Failed to update preferences' });
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async () => {
    if (security.new_password !== security.confirm_password) {
      setMessage({ type: 'error', text: 'New passwords do not match' });
      return;
    }
    if (security.new_password.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters' });
      return;
    }

    setSaving(true);
    try {
      await userService.changePassword(security.current_password, security.new_password);
      setSecurity({ ...security, current_password: '', new_password: '', confirm_password: '' });
      setMessage({ type: 'success', text: 'Password changed successfully!' });
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Failed to change password' });
    } finally {
      setSaving(false);
    }
  };

  const settingsSections: SettingsSection[] = [
    {
      id: 'account',
      title: 'Account Preferences',
      icon: User,
      description: 'Manage your profile information and personal details',
      color: 'text-blue-600'
    },
    {
      id: 'security',
      title: 'Sign in & Security',
      icon: Lock,
      description: 'Password, two-factor authentication, and account security',
      color: 'text-red-600'
    },
    {
      id: 'visibility',
      title: 'Visibility',
      icon: VisibilityIcon,
      description: 'Control who can see your profile and information',
      color: 'text-green-600'
    },
    {
      id: 'privacy',
      title: 'Data Privacy',
      icon: Shield,
      description: 'Manage your data and privacy settings',
      color: 'text-purple-600'
    },
    {
      id: 'notifications',
      title: 'Notifications',
      icon: Bell,
      description: 'Email, push, and SMS notification preferences',
      color: 'text-orange-600'
    },
    {
      id: 'preferences',
      title: 'Job Preferences',
      icon: Briefcase,
      description: 'Job type, location, and salary preferences',
      color: 'text-indigo-600'
    }
  ];

  const renderSectionContent = () => {
    switch (activeSection) {
      case 'account':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Account Preferences</h2>
              <Button
                onClick={handleProfileSave}
                disabled={saving}
                className="flex items-center"
              >
                {saving ? <LoadingSpinner size="sm" /> : <Save className="w-4 h-4 mr-2" />}
                Save
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Full Name"
                value={profileData.name}
                onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                placeholder="Enter your full name"
              />
              <Input
                label="Email"
                type="email"
                value={profileData.email}
                onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                placeholder="Enter your email"
              />
              <Input
                label="Phone"
                value={profileData.phone}
                onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                placeholder="Enter your phone number"
              />
              <Input
                label="Location"
                value={profileData.location}
                onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                placeholder="Enter your location"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Bio
              </label>
              <textarea
                value={profileData.bio}
                onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                placeholder="Tell us about yourself..."
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={4}
              />
            </div>
          </div>
        );

      case 'security':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Sign in & Security</h2>
              <Button
                onClick={handlePasswordChange}
                disabled={saving || !security.current_password || !security.new_password || !security.confirm_password}
                className="flex items-center"
              >
                {saving ? <LoadingSpinner size="sm" /> : <Shield className="w-4 h-4 mr-2" />}
                Change Password
              </Button>
            </div>
            
            <div className="space-y-4">
              <Input
                label="Current Password"
                type={security.show_password ? "text" : "password"}
                value={security.current_password}
                onChange={(e) => setSecurity({ ...security, current_password: e.target.value })}
                placeholder="Enter your current password"
              />
              
              <Input
                label="New Password"
                type={security.show_password ? "text" : "password"}
                value={security.new_password}
                onChange={(e) => setSecurity({ ...security, new_password: e.target.value })}
                placeholder="Enter your new password"
              />
              
              <Input
                label="Confirm New Password"
                type={security.show_password ? "text" : "password"}
                value={security.confirm_password}
                onChange={(e) => setSecurity({ ...security, confirm_password: e.target.value })}
                placeholder="Confirm your new password"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                checked={security.show_password}
                onChange={(e) => setSecurity({ ...security, show_password: e.target.checked })}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 mr-2"
              />
              <label className="text-sm text-gray-700 dark:text-gray-300">Show password</label>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">Two-Factor Authentication</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Add an extra layer of security</p>
                </div>
                <input
                  type="checkbox"
                  checked={security.two_factor_enabled}
                  onChange={(e) => setSecurity({ ...security, two_factor_enabled: e.target.checked })}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        );

      case 'visibility':
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Visibility Settings</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Profile Visibility
              </label>
              <select
                value={profileVisibility}
                onChange={(e) => setProfileVisibility(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="public">Public - Visible to all employers</option>
                <option value="private">Private - Only visible when you apply</option>
                <option value="employers_only">Employers Only - Visible to registered employers</option>
              </select>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">Show Profile to Employers</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Allow employers to view your profile</p>
                </div>
                <input
                  type="checkbox"
                  checked={profileVisibility !== 'private'}
                  onChange={(e) => setProfileVisibility(e.target.checked ? 'public' : 'private')}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">Show Contact Information</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Display phone and email to employers</p>
                </div>
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        );

      case 'privacy':
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Data Privacy</h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">Data Collection</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Allow us to collect usage data</p>
                </div>
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">Personalized Recommendations</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Get job recommendations based on your profile</p>
                </div>
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">Third-Party Analytics</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Allow analytics to improve our service</p>
                </div>
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <Download className="w-4 h-4 mr-2" />
                Download My Data
              </Button>
              <Button variant="outline" className="w-full justify-start text-red-600 hover:text-red-700">
                <Trash2 className="w-4 h-4 mr-2" />
                Delete My Account
              </Button>
            </div>
          </div>
        );

      case 'notifications':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Notifications</h2>
              <Button
                onClick={() => setMessage({ type: 'success', text: 'Notification preferences saved!' })}
                className="flex items-center"
              >
                <Save className="w-4 h-4 mr-2" />
                Save
              </Button>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div className="flex items-center">
                  <Mail className="w-5 h-5 text-blue-600 mr-3" />
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">Email Notifications</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Receive notifications via email</p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={notifications.email_notifications}
                  onChange={(e) => setNotifications({ ...notifications, email_notifications: e.target.checked })}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div className="flex items-center">
                  <Bell className="w-5 h-5 text-orange-600 mr-3" />
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">Push Notifications</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Get notifications on your device</p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={notifications.push_notifications}
                  onChange={(e) => setNotifications({ ...notifications, push_notifications: e.target.checked })}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div className="flex items-center">
                  <Smartphone className="w-5 h-5 text-green-600 mr-3" />
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">SMS Notifications</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Receive text message alerts</p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={notifications.sms_notifications}
                  onChange={(e) => setNotifications({ ...notifications, sms_notifications: e.target.checked })}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div className="flex items-center">
                  <Zap className="w-5 h-5 text-yellow-600 mr-3" />
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">Job Alerts</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Get notified about new job matches</p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={notifications.job_alerts}
                  onChange={(e) => setNotifications({ ...notifications, job_alerts: e.target.checked })}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div className="flex items-center">
                  <Briefcase className="w-5 h-5 text-purple-600 mr-3" />
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">Application Updates</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Updates on your job applications</p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={notifications.application_updates}
                  onChange={(e) => setNotifications({ ...notifications, application_updates: e.target.checked })}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div className="flex items-center">
                  <Heart className="w-5 h-5 text-pink-600 mr-3" />
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">Marketing Emails</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Receive promotional content and updates</p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={notifications.marketing_emails}
                  onChange={(e) => setNotifications({ ...notifications, marketing_emails: e.target.checked })}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        );

      case 'preferences':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Job Preferences</h2>
              <Button
                onClick={handlePreferencesSave}
                disabled={saving}
                className="flex items-center"
              >
                {saving ? <LoadingSpinner size="sm" /> : <Save className="w-4 h-4 mr-2" />}
                Save
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Preferred Job Type
                </label>
                <select
                  value={preferences.preferred_job_type}
                  onChange={(e) => setPreferences({ ...preferences, preferred_job_type: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="full_time">Full Time</option>
                  <option value="part_time">Part Time</option>
                  <option value="contract">Contract</option>
                  <option value="internship">Internship</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Work Mode
                </label>
                <select
                  value={preferences.preferred_work_mode}
                  onChange={(e) => setPreferences({ ...preferences, preferred_work_mode: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="remote">Remote</option>
                  <option value="on_site">On Site</option>
                  <option value="hybrid">Hybrid</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Minimum Salary (₹)"
                type="number"
                value={preferences.salary_min}
                onChange={(e) => setPreferences({ ...preferences, salary_min: e.target.value })}
                placeholder="e.g., 30000"
              />
              <Input
                label="Maximum Salary (₹)"
                type="number"
                value={preferences.salary_max}
                onChange={(e) => setPreferences({ ...preferences, salary_max: e.target.value })}
                placeholder="e.g., 80000"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Preferred Locations
              </label>
              <textarea
                value={preferences.preferred_locations}
                onChange={(e) => setPreferences({ ...preferences, preferred_locations: e.target.value })}
                placeholder="Enter preferred cities or locations (comma separated)"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Button
            variant="ghost"
            onClick={() => {
              if (activeSection) {
                setActiveSection(null);
              } else {
                onNavigate?.('dashboard');
              }
            }}
            className="mr-3"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center">
            <User className="w-6 h-6 text-gray-600 dark:text-gray-400 mr-3" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
          </div>
        </div>
        <Button variant="ghost" size="sm">
          <HelpCircle className="w-5 h-5" />
        </Button>
      </div>

      {message && (
        <Card className={`mb-6 p-4 ${
          message.type === 'success' 
            ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' 
            : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
        }`}>
          <div className="flex items-center">
            {message.type === 'success' ? (
              <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mr-2" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mr-2" />
            )}
            <p className={`text-sm ${message.type === 'success' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
              {message.text}
            </p>
          </div>
        </Card>
      )}

      {!activeSection ? (
        <div className="space-y-4">
          {/* Settings Categories */}
          {settingsSections.map((section) => {
            const IconComponent = section.icon;
            return (
              <Card
                key={section.id}
                className="p-4 cursor-pointer hover:shadow-md transition-all duration-200"
                onClick={() => setActiveSection(section.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`p-2 rounded-lg bg-gray-100 dark:bg-gray-800 mr-4`}>
                      <IconComponent className={`w-5 h-5 ${section.color}`} />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">{section.title}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{section.description}</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              </Card>
            );
          })}

          {/* Divider */}
          <div className="border-t border-gray-200 dark:border-gray-700 my-6"></div>

          {/* Help & Support Links */}
          <div className="space-y-2">
            <Button variant="ghost" className="w-full justify-start text-gray-700 dark:text-gray-300">
              <HelpCircle className="w-4 h-4 mr-3" />
              Help Center
            </Button>
            <Button variant="ghost" className="w-full justify-start text-gray-700 dark:text-gray-300">
              <FileText className="w-4 h-4 mr-3" />
              Professional Community Policies
            </Button>
            <Button variant="ghost" className="w-full justify-start text-gray-700 dark:text-gray-300">
              <Shield className="w-4 h-4 mr-3" />
              Privacy Policy
            </Button>
            <Button variant="ghost" className="w-full justify-start text-gray-700 dark:text-gray-300">
              <Globe className="w-4 h-4 mr-3" />
              Accessibility
            </Button>
          </div>

          {/* Account Actions */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-6">
            <Button 
              variant="ghost" 
              className="w-full justify-start text-red-600 hover:text-red-700"
              onClick={logout}
            >
              <LogOut className="w-4 h-4 mr-3" />
              Sign Out
            </Button>
          </div>
        </div>
      ) : (
        <Card className="p-6">
          {renderSectionContent()}
        </Card>
      )}
    </div>
  );
}; 