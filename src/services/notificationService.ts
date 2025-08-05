import { api } from './api';

export interface NotificationResponse {
  _id?: string;
  id?: string;
  user_id: string;
  title: string;
  message: string;
  notification_type: string;
  data?: any;
  action_url?: string;
  is_read: boolean;
  is_archived: boolean;
  created_at: string;
  read_at?: string;
}

class NotificationService {
  async getNotifications(): Promise<NotificationResponse[]> {
    try {
      // Get current user ID from localStorage
      const userStr = localStorage.getItem('skillglide-user');
      if (!userStr) {
        console.log('No user found in localStorage');
        return [];
      }
      
      const user = JSON.parse(userStr);
      const userId = user._id || user.id;
      
      if (!userId) {
        console.log('No user ID found');
        return [];
      }

      const response = await api.get<NotificationResponse[]>(`/notifications/?user_id=${userId}`);
      return Array.isArray(response.data) ? response.data : [];
    } catch (error: any) {
      console.error('Error fetching notifications:', error);
      return [];
    }
  }

  async markAsRead(notificationId: string): Promise<NotificationResponse> {
    try {
      const response = await api.put<NotificationResponse>(`/notifications/${notificationId}/read`);
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || 'Failed to mark notification as read';
      throw new Error(errorMessage);
    }
  }

  async markAllAsRead(): Promise<void> {
    try {
      await api.post('/notifications/mark-all-read');
    } catch (error: any) {
      console.error('Error marking all notifications as read:', error);
      // Don't throw error for this operation
    }
  }

  async deleteNotification(notificationId: string): Promise<void> {
    try {
      await api.put(`/notifications/${notificationId}/archive`);
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || 'Failed to archive notification';
      throw new Error(errorMessage);
    }
  }

  async getUnreadCount(): Promise<{ count: number }> {
    try {
      // Get current user ID from localStorage
      const userStr = localStorage.getItem('skillglide-user');
      if (!userStr) {
        return { count: 0 };
      }
      
      const user = JSON.parse(userStr);
      const userId = user._id || user.id;
      
      if (!userId) {
        return { count: 0 };
      }

      const response = await api.get<{ unread_count: number }>(`/notifications/unread-count?user_id=${userId}`);
      return { count: response.data.unread_count || 0 };
    } catch (error: any) {
      console.error('Error fetching unread count:', error);
      return { count: 0 };
    }
  }
}

export const notificationService = new NotificationService();