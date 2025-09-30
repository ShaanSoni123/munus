import React from 'react';
import { NotificationsPage as NotificationsPageComponent } from '../../components/notifications/NotificationsPage';
import { useNavigate } from 'react-router-dom';

const NotificationsPage: React.FC = () => {
  const navigate = useNavigate();

  const handleNavigate = (view: string) => {
    navigate(`/${view}`);
  };

  return <NotificationsPageComponent onNavigate={handleNavigate} />;
};

export default NotificationsPage;
