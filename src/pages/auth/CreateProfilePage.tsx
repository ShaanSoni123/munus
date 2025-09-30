import React from 'react';
import { ProfileCreation } from '../../components/profile/ProfileCreation';
import { useNavigate } from 'react-router-dom';

const CreateProfilePage: React.FC = () => {
  const navigate = useNavigate();

  const handleComplete = () => {
    navigate('/dashboard');
  };

  const handleBack = () => {
    navigate('/');
  };

  const handleNavigate = (view: string) => {
    navigate(`/${view}`);
  };

  return (
    <ProfileCreation
      onComplete={handleComplete}
      onBack={handleBack}
      onNavigate={handleNavigate}
    />
  );
};

export default CreateProfilePage;
