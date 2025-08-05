import React, { useState } from 'react';
import { Sparkles, Upload } from 'lucide-react';
import { Input } from '../../ui/Input';
import { Button } from '../../ui/Button';
import { GoogleDriveImport } from '../GoogleDriveImport';
import { resumeService } from '../../../services/resumeService';
import type { PersonalInfo } from '../../../types';

interface PersonalInfoStepProps {
  data: Partial<PersonalInfo>;
  onChange: (data: Partial<PersonalInfo>) => void;
}

export const PersonalInfoStep: React.FC<PersonalInfoStepProps> = ({
  data,
  onChange,
}) => {
  const [isImporting, setIsImporting] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);

  const updateField = (field: keyof PersonalInfo, value: string) => {
    onChange({ ...data, [field]: value });
  };

  const generateAISummary = async () => {
    // Simulate AI summary generation
    const aiSummary = "Experienced software developer with 5+ years of expertise in full-stack development, specializing in React, Node.js, and cloud technologies. Proven track record of delivering scalable web applications and leading cross-functional teams to achieve project goals.";
    
    updateField('summary', aiSummary);
  };

  const handleGoogleDriveImport = async (file: File, metadata: any) => {
    setIsImporting(true);
    setImportError(null);
    
    try {
      // Use resume service to parse the file
      const parsedData = await resumeService.parseGoogleDriveResume(file, metadata);
      
      // Update form fields with parsed data
      if (parsedData.data && parsedData.data.personalInfo) {
        onChange({
          ...data,
          ...parsedData.data.personalInfo,
        });
      }
      
    } catch (error) {
      console.error('Resume import error:', error);
      setImportError(error instanceof Error ? error.message : 'Failed to import resume');
    } finally {
      setIsImporting(false);
    }
  };

  const handleImportError = (error: string) => {
    setImportError(error);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Full Name"
          placeholder="John Doe"
          value={data.name || ''}
          onChange={(e) => updateField('name', e.target.value)}
          fullWidth
        />
        
        <Input
          label="Email Address"
          type="email"
          placeholder="john@example.com"
          value={data.email || ''}
          onChange={(e) => updateField('email', e.target.value)}
          fullWidth
        />
        
        <Input
          label="Phone Number"
          type="tel"
          placeholder="+91 98765 43210"
          value={data.phone || ''}
          onChange={(e) => updateField('phone', e.target.value)}
          fullWidth
        />
        
        <Input
          label="Location"
          placeholder="Bangalore, India"
          value={data.location || ''}
          onChange={(e) => updateField('location', e.target.value)}
          fullWidth
        />
        
        <Input
          label="LinkedIn Profile"
          placeholder="https://linkedin.com/in/johndoe"
          value={data.linkedIn || ''}
          onChange={(e) => updateField('linkedIn', e.target.value)}
          fullWidth
        />
        
        <Input
          label="GitHub Profile"
          placeholder="https://github.com/johndoe"
          value={data.github || ''}
          onChange={(e) => updateField('github', e.target.value)}
          fullWidth
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Professional Summary
          </label>
          <Button
            variant="outline"
            size="sm"
            onClick={generateAISummary}
            icon={<Sparkles className="w-4 h-4" />}
          >
            AI Generate
          </Button>
        </div>
        <textarea
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-cyan-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
          rows={4}
          placeholder="Write a brief professional summary..."
          value={data.summary || ''}
          onChange={(e) => updateField('summary', e.target.value)}
        />
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          2-3 sentences highlighting your key skills and experience
        </p>
      </div>

      <div>
        <Input
          label="Portfolio Website"
          placeholder="https://johndoe.dev"
          value={data.portfolio || ''}
          onChange={(e) => updateField('portfolio', e.target.value)}
          fullWidth
        />
      </div>

      {/* Google Drive Import Section */}
      <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <div className="flex items-center space-x-3 mb-4">
          <Upload className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Import from Google Drive
          </h3>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Import your existing resume from Google Drive to automatically fill in your information
        </p>
        
        <GoogleDriveImport
          onFileSelected={handleGoogleDriveImport}
          onError={handleImportError}
          disabled={isImporting}
        />
        
        {importError && (
          <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-sm text-red-600 dark:text-red-400">{importError}</p>
          </div>
        )}
      </div>
    </div>
  );
};