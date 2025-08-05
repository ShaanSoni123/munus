import React, { useState } from 'react';
import { Download, Loader2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { resumeService } from '../../services/resumeService';
import { Toast } from '../common/Toast';

export const PDFTest: React.FC = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');

  const sampleResumeData = {
    personalInfo: {
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '+1 (555) 123-4567',
      location: 'San Francisco, CA',
      summary: 'Experienced software developer with 5+ years of expertise in full-stack development, specializing in React, Node.js, and cloud technologies. Proven track record of delivering scalable web applications and leading cross-functional teams to achieve project goals.',
      linkedIn: 'https://linkedin.com/in/johndoe',
      github: 'https://github.com/johndoe',
      portfolio: 'https://johndoe.dev'
    },
    experience: [
      {
        id: '1',
        company: 'TechCorp Inc.',
        position: 'Senior Software Engineer',
        startDate: '2022-01-01',
        endDate: null,
        current: true,
        description: 'Lead development of enterprise web applications using React, Node.js, and AWS.',
        achievements: [
          'Reduced application load time by 40% through optimization',
          'Mentored 5 junior developers',
          'Implemented CI/CD pipeline reducing deployment time by 60%'
        ]
      },
      {
        id: '2',
        company: 'StartupXYZ',
        position: 'Full Stack Developer',
        startDate: '2020-03-01',
        endDate: '2021-12-31',
        current: false,
        description: 'Developed and maintained multiple web applications using modern technologies.',
        achievements: [
          'Built 3 production applications from scratch',
          'Improved code quality by implementing automated testing',
          'Collaborated with design team to improve user experience'
        ]
      }
    ],
    education: [
      {
        id: '1',
        institution: 'University of Technology',
        degree: 'Bachelor of Science',
        field: 'Computer Science',
        startDate: '2016-09-01',
        endDate: '2020-05-01',
        gpa: 3.8,
        description: 'Graduated with honors. Completed capstone project on machine learning algorithms.'
      }
    ],
    skills: [
      'JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'AWS',
      'Docker', 'Kubernetes', 'MongoDB', 'PostgreSQL', 'Git', 'CI/CD'
    ],
    projects: [
      {
        id: '1',
        name: 'E-commerce Platform',
        description: 'A full-stack e-commerce platform built with React, Node.js, and MongoDB.',
        technologies: ['React', 'Node.js', 'MongoDB', 'Stripe'],
        url: 'https://ecommerce-demo.com',
        github: 'https://github.com/johndoe/ecommerce'
      },
      {
        id: '2',
        name: 'Task Management App',
        description: 'A collaborative task management application with real-time updates.',
        technologies: ['React', 'Socket.io', 'Express', 'PostgreSQL'],
        url: 'https://task-app-demo.com',
        github: 'https://github.com/johndoe/task-app'
      }
    ],
    certifications: [
      {
        id: '1',
        name: 'AWS Certified Solutions Architect',
        issuer: 'Amazon Web Services',
        date: '2023-06-01',
        credentialId: 'AWS-123456',
        url: 'https://aws.amazon.com/verification'
      },
      {
        id: '2',
        name: 'Google Cloud Professional Developer',
        issuer: 'Google Cloud',
        date: '2022-12-01',
        credentialId: 'GCP-789012',
        url: 'https://cloud.google.com/certification'
      }
    ]
  };

  const handleGeneratePDF = async () => {
    setIsGenerating(true);
    try {
      const result = await resumeService.generatePDF(sampleResumeData);
      
      // Convert hex string back to bytes
      const pdfBytes = new Uint8Array(
        result.pdfContent.match(/.{1,2}/g)?.map(byte => parseInt(byte, 16)) || []
      );
      
      // Create blob and download
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = result.filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      setToastMessage('PDF generated and downloaded successfully!');
      setToastType('success');
      setShowToast(true);
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      setToastMessage(error instanceof Error ? error.message : 'Failed to generate PDF');
      setToastType('error');
      setShowToast(true);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">PDF Generation Test</h1>
      
      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="text-blue-800 font-semibold mb-2">Sample Resume Data:</h3>
        <p className="text-blue-600 text-sm">
          This test will generate a PDF using sample resume data including personal information, 
          experience, education, skills, projects, and certifications.
        </p>
      </div>

      <div className="mb-6">
        <Button
          variant="primary"
          icon={isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
          onClick={handleGeneratePDF}
          disabled={isGenerating}
        >
          {isGenerating ? 'Generating PDF...' : 'Generate Sample PDF'}
        </Button>
      </div>

      <div className="text-sm text-gray-600">
        <h3 className="font-semibold mb-2">What this test does:</h3>
        <ul className="list-disc list-inside space-y-1">
          <li>Sends sample resume data to the backend</li>
          <li>Generates a professional PDF resume</li>
          <li>Downloads the PDF file automatically</li>
          <li>Shows success/error notifications</li>
        </ul>
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