import React, { useState } from 'react';
import { FileText, User, Briefcase, GraduationCap, Award, Video, Mic, Download, Eye, Loader2 } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { PersonalInfoStep } from './steps/PersonalInfoStep';
import { ExperienceStep } from './steps/ExperienceStep';
import { EducationStep } from './steps/EducationStep';
import { SkillsStep } from './steps/SkillsStep';
import { VideoResumeStep } from './steps/VideoResumeStep';
import { PreviewStep } from './steps/PreviewStep';
import { resumeService } from '../../services/resumeService';
import { Toast } from '../common/Toast';
import type { Resume } from '../../types';

const steps = [
  { id: 'personal', name: 'Personal Info', icon: User },
  { id: 'experience', name: 'Experience', icon: Briefcase },
  { id: 'education', name: 'Education', icon: GraduationCap },
  { id: 'skills', name: 'Skills', icon: Award },
  { id: 'video', name: 'Video Resume', icon: Video },
  { id: 'preview', name: 'Preview', icon: Eye },
];

export const ResumeBuilder: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');
  
  const [resumeData, setResumeData] = useState<Partial<Resume>>({
    personalInfo: {
      name: '',
      email: '',
      phone: '',
      location: '',
      summary: '',
    },
    experience: [],
    education: [],
    skills: [],
    projects: [],
    certifications: [],
  });

  const updateResumeData = (section: keyof Resume, data: any) => {
    setResumeData(prev => ({
      ...prev,
      [section]: data,
    }));
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleDownloadPDF = async () => {
    setIsGeneratingPDF(true);
    try {
      console.log('Starting PDF generation with data:', resumeData);
      
      // Generate PDF using the resume service
      const result = await resumeService.generatePDF(resumeData);
      
      console.log('PDF generation result:', result);
      
      if (!result.pdfContent) {
        throw new Error('No PDF content received from server');
      }
      
      // Convert hex string back to bytes
      const pdfBytes = new Uint8Array(
        result.pdfContent.match(/.{1,2}/g)?.map(byte => parseInt(byte, 16)) || []
      );
      
      if (pdfBytes.length === 0) {
        throw new Error('Invalid PDF content received');
      }
      
      // Create blob and download
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = result.filename || 'resume.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      setToastMessage('PDF downloaded successfully!');
      setToastType('success');
      setShowToast(true);
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      setToastMessage(error instanceof Error ? error.message : 'Failed to generate PDF');
      setToastType('error');
      setShowToast(true);
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const renderStepContent = () => {
    switch (steps[currentStep].id) {
      case 'personal':
        return (
          <PersonalInfoStep
            data={resumeData.personalInfo || {}}
            onChange={(data) => updateResumeData('personalInfo', data)}
          />
        );
      case 'experience':
        return (
          <ExperienceStep
            data={resumeData.experience || []}
            onChange={(data) => updateResumeData('experience', data)}
          />
        );
      case 'education':
        return (
          <EducationStep
            data={resumeData.education || []}
            onChange={(data) => updateResumeData('education', data)}
          />
        );
      case 'skills':
        return (
          <SkillsStep
            data={resumeData.skills || []}
            onChange={(data) => updateResumeData('skills', data)}
          />
        );
      case 'video':
        return (
          <VideoResumeStep
            videoUrl={resumeData.videoUrl}
            onVideoChange={(url) => updateResumeData('videoUrl', url)}
          />
        );
      case 'preview':
        return <PreviewStep resumeData={resumeData} />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Munus Resume Builder
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Create your professional resume with our AI-powered builder and stand out from the crowd
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Progress Sidebar */}
        <div className="lg:col-span-1">
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Progress
            </h3>
            <div className="space-y-2">
              {steps.map((step, index) => {
                const Icon = step.icon;
                const isActive = index === currentStep;
                const isComplete = index < currentStep;
                
                return (
                  <button
                    key={step.id}
                    onClick={() => setCurrentStep(index)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                      isActive
                        ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                        : isComplete
                        ? 'text-green-600 dark:text-green-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    <div className={`p-1 rounded ${
                      isActive ? 'bg-blue-200 dark:bg-blue-800' : 
                      isComplete ? 'bg-green-200 dark:bg-green-800' : 
                      'bg-gray-200 dark:bg-gray-700'
                    }`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-medium">{step.name}</span>
                  </button>
                );
              })}
            </div>

            {/* Progress Bar */}
            <div className="mt-6">
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                <span>Progress</span>
                <span>{Math.round(((currentStep + 1) / steps.length) * 100)}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-blue-500 to-teal-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                />
              </div>
            </div>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <Card className="min-h-[600px]">
            <div className="mb-6">
              <div className="flex items-center space-x-2 mb-2">
                {React.createElement(steps[currentStep].icon, { className: "w-5 h-5 text-blue-600" })}
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {steps[currentStep].name}
                </h2>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1">
                <div
                  className="bg-gradient-to-r from-blue-500 to-teal-500 h-1 rounded-full transition-all duration-300"
                  style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Step Content */}
            <div className="mb-8">
              {renderStepContent()}
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center pt-6 border-t border-gray-200 dark:border-gray-700">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 0}
              >
                Previous
              </Button>

              <div className="flex space-x-2">
                {currentStep === steps.length - 1 ? (
                  <>
                    <Button
                      variant="secondary"
                      icon={isGeneratingPDF ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                      onClick={handleDownloadPDF}
                      disabled={isGeneratingPDF}
                    >
                      {isGeneratingPDF ? 'Generating PDF...' : 'Download PDF'}
                    </Button>
                    <Button
                      variant="primary"
                      icon={<FileText className="w-4 h-4" />}
                    >
                      Save Resume
                    </Button>
                  </>
                ) : (
                  <Button variant="primary" onClick={nextStep}>
                    Next Step
                  </Button>
                )}
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Toast Notification */}
      {showToast && (
        <Toast
          message={toastMessage}
          type={toastType}
          onClose={() => setShowToast(false)}
        />
      )}
    </div>
  );
};