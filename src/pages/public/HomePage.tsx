import React from 'react';
import { HomePage as HomePageComponent } from '../../components/home/HomePage';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      navigate('/auth-choice');
    }
  };

  const handleSignIn = () => {
    navigate('/login');
  };

  const handleFindJobs = () => {
    navigate('/jobs');
  };

  const handleResumeBuilder = () => {
    navigate('/resume');
  };

  return (
    <HomePageComponent
      onGetStarted={handleGetStarted}
      onSignIn={handleSignIn}
      onFindJobs={handleFindJobs}
      onResumeBuilder={handleResumeBuilder}
    />
  );
};

export default HomePage;
