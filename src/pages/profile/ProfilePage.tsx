import React from 'react';
import { ProfilePage as ProfilePageComponent } from '../../components/profile/ProfilePage';
import { useNavigate } from 'react-router-dom';

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();

  const handleNavigate = (view: string) => {
    navigate(`/${view}`);
  };

  return <ProfilePageComponent onNavigate={handleNavigate} />;
};

export default ProfilePage;
