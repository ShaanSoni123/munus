import React from 'react';
import { JobPostingBuilder } from '../../components/employer/JobPostingBuilder';
import { useNavigate } from 'react-router-dom';

const PostJobPage: React.FC = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/dashboard');
  };

  const handleJobPosted = (newJob: any) => {
    console.log('Job posted successfully:', newJob);
    navigate('/dashboard');
  };

  return (
    <JobPostingBuilder
      onBack={handleBack}
      onJobPosted={handleJobPosted}
    />
  );
};

export default PostJobPage;
