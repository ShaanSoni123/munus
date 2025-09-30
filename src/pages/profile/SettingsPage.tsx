import React from 'react';
import { SettingsPage as SettingsPageComponent } from '../../components/profile/SettingsPage';
import { useNavigate } from 'react-router-dom';

const SettingsPage: React.FC = () => {
  const navigate = useNavigate();

  const handleNavigate = (view: string) => {
    navigate(`/${view}`);
  };

  return <SettingsPageComponent onNavigate={handleNavigate} />;
};

export default SettingsPage;
