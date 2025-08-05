import React, { useState, useEffect, useCallback } from 'react';
import { Bell, X, Check, CheckCheck, Trash2, Settings, Briefcase, Users, Star, MessageCircle, Calendar, TrendingUp, Filter, Search, MoreVertical } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Input } from '../ui/Input';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { notificationService, type NotificationResponse } from '../../services/notificationService';
import { useApi } from '../../hooks/useApi';

interface NotificationsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationsPanel: React.FC<NotificationsPanelProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const { theme } = useTheme();
  const [filter, setFilter] = useState<'all' | 'unread' | 'important'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications, setNotifications] = useState<NotificationResponse[]>([]);

  // Fetch notifications when panel opens
  const { loading, error, refetch } = useApi(
    () => notificationService.getNotifications(),
    {
      immediate: isOpen,
      onSuccess: (data) => setNotifications(data || []),
      onError: () => setNotifications([]),
    }
  );

  // Memoize refetch to avoid unnecessary interval resets
  const stableRefetch = useCallback(() => {
    refetch();
  }, [refetch]);

  // Refresh unread count when notifications are updated
  useEffect(() => {
    if (!isOpen) return;
    
    const refreshInterval = setInterval(() => {
      stableRefetch();
    }, 30000); // Refresh every 30 seconds
    
    return () => clearInterval(refreshInterval);
  }, [isOpen, stableRefetch]);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'job_match':
      case 'job_alert':
        return <Briefcase className="w-5 h-5" />;
      case 'application_update':
        return <Users className="w-5 h-5" />;
      case 'message':
        return <MessageCircle className="w-5 h-5" />;
      case 'interview':
        return <Calendar className="w-5 h-5" />;
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
        return 'from-green-500 to-emerald-500';
      case 'message':
        return 'from-purple-500 to-pink-500';
      case 'interview':
        return 'from-orange-500 to-red-500';
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
    } catch (error) {
      console.error('Error formatting timestamp:', error);
      return 'Unknown date';
    }
  };

  const markAsRead = async (id: number) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications(prev =>
        prev.map(notification =>
          notification.id === id ? { ...notification, is_read: true } : notification
        )
      );
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications(prev =>
        prev.map(notification => ({ ...notification, is_read: true }))
      );
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    }
  };

  const deleteNotification = async (id: number) => {
    try {
      await notificationService.deleteNotification(id);
      setNotifications(prev => prev.filter(notification => notification.id !== id));
    } catch (error) {
      console.error('Failed to delete notification:', error);
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    // Filter by type
    const matchesFilter = 
      filter === 'all' || 
      (filter === 'unread' && !notification.is_read) ||
      (filter === 'important' && notification.is_important);
    
    // Filter by search query
    const matchesSearch = 
      !searchQuery || searchQuery === '' ||
      notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const unreadCount = notifications.filter(n => !n.is_read).length;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-start justify-center z-50 pt-16 backdrop-blur-sm">
      <Card className={`w-full max-w-2xl mx-4 max-h-[80vh] overflow-hidden animate-scale-in ${
        theme === 'dark-neon' ? 'shadow-2xl shadow-cyan-500/10' : 'shadow-2xl'
      }`}>
        {/* Header */}
        <div className={`flex items-center justify-between p-6 border-b ${
          theme === 'light' ? 'border-gray-200' : 'border-gray-700'
        }`}>
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center ${
              theme === 'dark-neon' ? 'shadow-lg shadow-blue-500/25' : 'shadow-lg'
            }`}>
              <Bell className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className={`text-xl font-bold ${
                theme === 'light' ? 'text-gray-900' : 'text-white'
              }`}>
                Notifications
              </h2>
              {unreadCount > 0 && (
                <p className={`text-sm ${
                  theme === 'light' ? 'text-gray-600' : 'text-gray-400'
                }`}>
                  {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
                </p>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={markAllAsRead}
                icon={<CheckCheck className="w-4 h-4" />}
              >
                Mark all read
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              icon={<X className="w-4 h-4" />}
              aria-label="Close notifications"
            />
          </div>
        </div>

        {/* Filters and Search */}
        <div className={`p-4 border-b space-y-4 ${
          theme === 'light' ? 'border-gray-200 bg-gray-50' : 'border-gray-700 bg-gray-800'
        }`}>
          <div className="flex items-center space-x-2">
            <Input
              placeholder="Search notifications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              icon={<Search className="w-4 h-4" />}
              fullWidth
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <div className="flex space-x-1">
              {[
                { key: 'all', label: 'All' },
                { key: 'unread', label: 'Unread' },
                { key: 'important', label: 'Important' }
              ].map((filterOption) => (
                <button
                  key={filterOption.key}
                  onClick={() => setFilter(filterOption.key as any)}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                    filter === filterOption.key
                      ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  {filterOption.label}
                  {filterOption.key === 'unread' && unreadCount > 0 && (
                    <Badge variant="primary" size="sm" className="ml-1">
                      {unreadCount}
                    </Badge>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Notifications List */}
        <div className="max-h-96 overflow-y-auto custom-scrollbar">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent mx-auto mb-4"></div>
              <p className={`${
                theme === 'light' ? 'text-gray-600' : 'text-gray-400'
              }`}>
                Loading notifications...
              </p>
            </div>
          ) : error ? (
            <div className="p-8 text-center">
              <Bell className={`w-12 h-12 mx-auto mb-4 ${
                theme === 'light' ? 'text-red-400' : 'text-red-600'
              }`} />
              <h3 className={`text-lg font-medium mb-2 ${
                theme === 'light' ? 'text-gray-900' : 'text-white'
              }`}>
                Failed to load notifications
              </h3>
              <p className={`${
                theme === 'light' ? 'text-gray-600' : 'text-gray-400'
              } mb-4`}>
                {error}
              </p>
              <Button variant="primary" size="sm" onClick={refetch}>
                Try Again
              </Button>
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="p-8 text-center">
              <Bell className={`w-12 h-12 mx-auto mb-4 ${
                theme === 'light' ? 'text-gray-400' : 'text-gray-600'
              }`} />
              <h3 className={`text-lg font-medium mb-2 ${
                theme === 'light' ? 'text-gray-900' : 'text-white'
              }`}>
                No notifications found
              </h3>
              <p className={`${
                theme === 'light' ? 'text-gray-600' : 'text-gray-400'
              }`}>
                {searchQuery ? 'Try adjusting your search terms' : 'You\'re all caught up!'}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer group ${
                    !notification.is_read ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''
                  }`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex items-start space-x-3">
                    {/* Icon */}
                    <div className={`w-10 h-10 bg-gradient-to-br ${getNotificationColor(notification.notification_type)} rounded-xl flex items-center justify-center flex-shrink-0 ${
                      theme === 'dark-neon' ? 'shadow-lg shadow-blue-500/25' : 'shadow-md'
                    }`}>
                      <div className="text-white">
                        {getNotificationIcon(notification.notification_type)}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className={`font-semibold text-sm ${
                              theme === 'light' ? 'text-gray-900' : 'text-white'
                            }`}>
                              {notification.title}
                            </h3>
                            {!notification.is_read && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full" />
                            )}
                            {notification.is_important && (
                              <Star className="w-4 h-4 text-yellow-500 fill-current" />
                            )}
                          </div>
                          <p className={`text-sm leading-relaxed ${
                            theme === 'light' ? 'text-gray-600' : 'text-gray-400'
                          }`}>
                            {notification.message}
                          </p>
                        </div>
                        
                        <div className="flex items-center space-x-2 ml-4">
                          <span className={`text-xs ${
                            theme === 'light' ? 'text-gray-500' : 'text-gray-500'
                          }`}>
                            {formatTimestamp(notification.created_at)}
                          </span>
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteNotification(notification.id);
                              }}
                              icon={<Trash2 className="w-4 h-4" />}
                              aria-label="Delete notification"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={`p-4 border-t ${
          theme === 'light' ? 'border-gray-200 bg-gray-50' : 'border-gray-700 bg-gray-800'
        }`}>
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              icon={<Settings className="w-4 h-4" />}
            >
              Notification Settings
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onClose}
            >
              Close
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};