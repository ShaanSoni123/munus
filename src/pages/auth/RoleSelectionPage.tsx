import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RoleSelection } from '../../components/auth/RoleSelection';
import { useAuth } from '../../contexts/AuthContext';
import { api } from '../../services/api';

const RoleSelectionPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, refreshUser } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleSelectRole = async (role: 'employer' | 'jobseeker') => {
    setLoading(true);
    try {
      // Update user role in backend
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';
      const token = localStorage.getItem('skillglide-access-token');
      
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${apiBaseUrl}/api/v1/auth/update-role`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ role }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: 'Failed to update role' }));
        throw new Error(errorData.detail || 'Failed to update role');
      }

      const result = await response.json();
      
      // Update localStorage with new token and user data
      if (result.access_token) {
        localStorage.setItem('skillglide-access-token', result.access_token);
      }
      
      const updatedUser = {
        ...result.user,
        id: result.user._id || result.user.id,
        role: result.user.role
      };
      localStorage.setItem('skillglide-user', JSON.stringify(updatedUser));

      // Refresh auth context
      window.dispatchEvent(new CustomEvent('auth-state-changed'));

      // Redirect to dashboard
      setTimeout(() => {
        navigate('/dashboard');
      }, 100);
    } catch (error: any) {
      console.error('Error updating role:', error);
      alert(error.message || 'Failed to update role. Please try again.');
      setLoading(false);
    }
  };

  // If user already has a role, redirect to dashboard
  React.useEffect(() => {
    if (user?.role) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  return <RoleSelection onSelectRole={handleSelectRole} loading={loading} />;
};

export default RoleSelectionPage;

