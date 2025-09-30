import React from 'react';
import { EmployerDashboard } from '../../components/employer/EmployerDashboard';
import { JobSeekerDashboard } from '../../components/jobs/JobSeekerDashboard';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const DashboardPage: React.FC = () => {
  const { user, isEmployer } = useAuth();
  const navigate = useNavigate();

  const handleNavigate = (view: string) => {
    navigate(`/${view}`);
  };

  const handleApplicationSelect = (application: any) => {
    navigate('/application-detail', { state: { application } });
  };

  // Primary check: use user.role directly from database
  if (user?.role === 'employer' || isEmployer) {
    return (
      <EmployerDashboard
        onNavigate={handleNavigate}
        onApplicationSelect={handleApplicationSelect}
      />
    );
  } else {
    // Default to job seeker dashboard
    return <JobSeekerDashboard onNavigate={handleNavigate} />;
  }
};

export default DashboardPage;
