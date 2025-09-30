import React from 'react';
import { ApplicationDetailPage as ApplicationDetailComponent } from '../../components/employer/ApplicationDetailPage';
import { useNavigate, useLocation } from 'react-router-dom';

const ApplicationDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const application = location.state?.application;

  const handleBack = () => {
    navigate('/dashboard');
  };

  const handleStatusUpdate = (applicationId: string, status: string, notes?: string) => {
    console.log('Status update:', { applicationId, status, notes });
    // Handle status update logic here
  };

  if (!application) {
    // Redirect to dashboard if no application data
    navigate('/dashboard');
    return null;
  }

  return (
    <ApplicationDetailComponent
      application={application}
      onBack={handleBack}
      onStatusUpdate={handleStatusUpdate}
    />
  );
};

export default ApplicationDetailPage;
