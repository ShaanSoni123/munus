import { api } from './api';
import type { User } from '../types';

export interface LoginRequest {
  email: string;
  password: string;
  role: 'jobseeker' | 'employer';
}

export interface RegisterRequest {
  name: string;
  email: string;
  password?: string;
  role: 'jobseeker' | 'employer';
  phone?: string;
  location?: string;
  company?: string;
  skills?: string[];
  experience_years?: number;
  preferred_job_types?: string[];
  preferred_locations?: string[];
  salary_expectations?: { min: number; max: number; currency: string };
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  user: User;
}

class AuthService {
  async login(email: string, password: string, role?: 'jobseeker' | 'employer'): Promise<any> {
    try {
      console.log('🔐 AuthService: Attempting login', { email, role });
      // Don't send role to backend - it will be retrieved from the user's stored data
      const response = await api.post('/auth/login', { email, password });
      console.log('✅ AuthService: Login response received', response.data);
      
      const { access_token, user } = response.data;
      
      // Transform user data to match frontend expectations
      const transformedUser = {
        ...user,
        id: user._id || user.id, // Map MongoDB _id to frontend id
        role: user.role // Ensure role is properly set
      };
      
      console.log('🔄 AuthService: Transformed user', transformedUser);
      
      // Store user data and token
      localStorage.setItem('skillglide-access-token', access_token);
      localStorage.setItem('skillglide-user', JSON.stringify(transformedUser));
      
      console.log('💾 AuthService: Stored in localStorage');
      
      // Dispatch custom event to notify app of auth state change
      window.dispatchEvent(new CustomEvent('auth-state-changed'));
      
      return { ...response.data, user: transformedUser };
    } catch (error: any) {
      console.error('❌ AuthService: Login failed', error);
      const errorMessage = error.response?.data?.detail || 'Login failed. Please check your credentials.';
      throw new Error(errorMessage);
    }
  }

  async register(userData: RegisterRequest): Promise<any> {
    try {
      console.log('📝 AuthService: Attempting registration', userData);
      
      // Prepare payload - role will be selected after registration
      const payload = {
        email: userData.email,
        password: userData.password,
        name: userData.name,
        phone: userData.phone,
        location: userData.location,
      };

      console.log('📤 AuthService: Sending registration payload', payload);
      const response = await api.post('/auth/register/', payload);
      console.log('✅ AuthService: Registration response received', response.data);
      
      // Transform user data to match frontend expectations
      const transformedUser = {
        ...response.data.user,
        id: response.data.user._id || response.data.user.id, // Map MongoDB _id to frontend id
        role: response.data.user.role // Ensure role is properly set
      };
      
      console.log('🔄 AuthService: Transformed user', transformedUser);
      
      // Store user data and token
      localStorage.setItem('skillglide-user', JSON.stringify(transformedUser));
      localStorage.setItem('skillglide-access-token', response.data.access_token);
      
      console.log('💾 AuthService: Stored in localStorage');
      
      // Dispatch custom event to notify app of auth state change
      window.dispatchEvent(new CustomEvent('auth-state-changed'));
      
      return { ...response.data, user: transformedUser };
    } catch (error: any) {
      console.error('❌ AuthService: Registration failed', error);
      const errorMessage = error.response?.data?.detail || 'Registration failed. Please try again.';
      throw new Error(errorMessage);
    }
  }

  logout(): void {
    try {
      localStorage.removeItem('skillglide-access-token');
      localStorage.removeItem('skillglide-refresh-token');
      localStorage.removeItem('skillglide-user');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  }

  getCurrentUser(): User | null {
    try {
      const userStr = localStorage.getItem('skillglide-user');
      if (!userStr) return null;
      
      const user = JSON.parse(userStr);
      
      // Ensure the user object has the correct structure
      return {
        ...user,
        id: user.id || user._id, // Handle both id and _id
        role: user.role // Ensure role is present
      };
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }

  setCurrentUser(user: User): void {
    try {
      localStorage.setItem('skillglide-user', JSON.stringify(user));
    } catch (error) {
      console.error('Error setting current user:', error);
    }
  }

  getAccessToken(): string | null {
    try {
      return localStorage.getItem('skillglide-access-token');
    } catch (error) {
      console.error('Error getting access token:', error);
      return null;
    }
  }

  isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }

  // Helper method to check if user is an employer
  isEmployer(): boolean {
    const user = this.getCurrentUser();
    return user?.role === 'employer';
  }

  // Helper method to check if user is a job seeker
  isJobSeeker(): boolean {
    const user = this.getCurrentUser();
    return user?.role === 'jobseeker';
  }
}

export const authService = new AuthService();