import React, { useState, useEffect } from 'react';
import { Bell, X, Check, CheckCheck, Trash2, Settings, Briefcase, Users, Star, MessageCircle, Calendar, TrendingUp, Filter, Search, ArrowLeft } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Input } from '../ui/Input';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { notificationService, type NotificationResponse } from '../../services/notificationService';
import { LoadingSpinner } from '../common/LoadingSpinner';

interface NotificationsPageProps {
  onNavigate?: (view: 'home' | 'jobs' | 'resume' | 'profile' | 'create-profile' | 'dashboard' | 'post-job' | 'candidates' | 'faqs' | 'contact' | 'settings' | 'notifications') => void;
}

export const NotificationsPage: React.FC<NotificationsPageProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const { theme } = useTheme();
  const [filter, setFilter] = useState<'all' | 'unread' | 'important'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications, setNotifications] = useState<NotificationResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const data = await notificationService.getNotifications();
      setNotifications(data || []);
    } catch (err) {
      setError('Failed to load notifications');
      console.error('Error fetching notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'job_match':
      case 'job_alert':
        return <Briefcase className="w-5 h-5" />;
      case 'application_update':
      case 'application_accepted':
      case 'application_rejected':
      case 'application_shortlisted':
      case 'application_status_change':
        return <Users className="w-5 h-5" />;
      case 'application_interview':
      case 'interview':
        return <Calendar className="w-5 h-5" />;
      case 'application_reviewing':
        return <Star className="w-5 h-5" />;
      case 'new_application':
        return <Briefcase className="w-5 h-5" />;
      case 'message':
        return <MessageCircle className="w-5 h-5" />;
      case 'profile_view':
        return <TrendingUp className="w-5 h-5" />;
      case 'system':
        return <Settings className="w-5 h-5" />;
      default:
        return <Bell className="w-5 h-5" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'job_match':
        return 'from-blue-500 to-cyan-500';
      case 'application_update':
      case 'application_status_change':
        return 'from-green-500 to-emerald-500';
      case 'application_accepted':
        return 'from-green-500 to-emerald-500';
      case 'application_rejected':
        return 'from-red-500 to-pink-500';
      case 'application_shortlisted':
        return 'from-yellow-500 to-orange-500';
      case 'application_interview':
      case 'interview':
        return 'from-orange-500 to-red-500';
      case 'application_reviewing':
        return 'from-blue-500 to-indigo-500';
      case 'new_application':
        return 'from-purple-500 to-pink-500';
      case 'message':
        return 'from-purple-500 to-pink-500';
      case 'profile_view':
        return 'from-indigo-500 to-purple-500';
      case 'job_alert':
        return 'from-teal-500 to-cyan-500';
      case 'system':
        return 'from-gray-500 to-gray-600';
      default:
        return 'from-blue-500 to-purple-500';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    try {
      const date = new Date(timestamp);
      const now = new Date();
      const diffInMs = now.getTime() - date.getTime();
      const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
      const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
      const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

      if (diffInMinutes < 1) return 'Just now';
      if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
      if (diffInHours < 24) return `${diffInHours}h ago`;
      if (diffInDays < 7) return `${diffInDays}d ago`;
      
      return date.toLocaleDateString();
    } catch {
      return 'Unknown time';
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications(prev => 
        prev.map(notification => 
          (notification.id || notification._id) === id 
            ? { ...notification, is_read: true }
            : notification
        )
      );
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };

  const markAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications(prev => 
        prev.map(notification => ({ ...notification, is_read: true }))
      );
    } catch (err) {
      console.error('Error marking all notifications as read:', err);
    }
  };

  const deleteNotification = async (id: number) => {
    try {
      await notificationService.deleteNotification(id);
      setNotifications(prev => prev.filter(notification => notification.id !== id));
    } catch (err) {
      console.error('Error deleting notification:', err);
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    const matchesFilter = filter === 'all' || 
      (filter === 'unread' && !notification.is_read) ||
      (filter === 'important' && notification.notification_type === 'important');
    
    const matchesSearch = searchQuery === '' || 
      notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" text="Loading notifications..." />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onNavigate?.('dashboard')}
            className="flex items-center"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
              <Bell className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
              Notifications
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Stay updated with your job applications and opportunities
            </p>
          </div>
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={markAllAsRead}
          className="flex items-center"
        >
          <CheckCheck className="w-4 h-4 mr-2" />
          Mark All Read
        </Button>
      </div>

      {error && (
        <Card className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
          <p className="text-red-600 dark:text-red-400">{error}</p>
        </Card>
      )}

      {/* Filters and Search */}
      <Card className="p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search notifications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              icon={<Search className="w-4 h-4" />}
            />
          </div>
          <div className="flex space-x-2">
            <Button
              variant={filter === 'all' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setFilter('all')}
            >
              All
            </Button>
            <Button
              variant={filter === 'unread' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setFilter('unread')}
            >
              Unread
            </Button>
            <Button
              variant={filter === 'important' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setFilter('important')}
            >
              Important
            </Button>
          </div>
        </div>
      </Card>

      {/* Notifications List */}
      <div className="space-y-4">
        {filteredNotifications.length === 0 ? (
          <Card className="p-12 text-center">
            <Bell className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No notifications
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {searchQuery || filter !== 'all' 
                ? 'No notifications match your current filters'
                : 'You\'re all caught up! New notifications will appear here.'
              }
            </p>
          </Card>
        ) : (
          filteredNotifications.map((notification) => (
            <Card 
              key={notification.id} 
              className={`p-4 transition-all duration-200 hover:shadow-md ${
                !notification.is_read ? 'border-l-4 border-l-blue-500 bg-blue-50 dark:bg-blue-900/10' : ''
              }`}
            >
              <div className="flex items-start space-x-4">
                <div className={`flex-shrink-0 p-2 rounded-full bg-gradient-to-r ${getNotificationColor(notification.notification_type)}`}>
                  {getNotificationIcon(notification.notification_type)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                        {notification.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                        {formatTimestamp(notification.created_at)}
                      </p>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      {!notification.is_read && (
                        <Button
                          variant="outline"
                          size="sm"
                                                      onClick={() => markAsRead(notification.id || notification._id || '')}
                          className="text-xs"
                        >
                          <Check className="w-3 h-3 mr-1" />
                          Mark Read
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteNotification(notification.id)}
                        className="text-xs text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}; 