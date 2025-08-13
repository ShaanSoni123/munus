import React from 'react';
import { Download, Edit, Loader2 } from 'lucide-react';
import { Button } from '../../ui/Button';
import { Card } from '../../ui/Card';
import { Badge } from '../../ui/Badge';
import type { Resume } from '../../../types';

interface PreviewStepProps {
  resumeData: Partial<Resume>;
  onDownloadPDF?: () => void;
  isGeneratingPDF?: boolean;
}

export const PreviewStep: React.FC<PreviewStepProps> = ({ resumeData, onDownloadPDF, isGeneratingPDF }) => {
  const { personalInfo, experience, education, skills, videoUrl } = resumeData;

  const formatDate = (date: Date | undefined) => {
    if (!date) return '';
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Resume Preview
        </h3>
        {/* Buttons removed from header - only in bottom section now */}
      </div>

      {/* Resume Content */}
      <Card className="max-w-4xl mx-auto bg-white dark:bg-gray-900 shadow-lg">
        {/* Header */}
        <div className="border-b border-gray-200 dark:border-gray-700 pb-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {personalInfo?.name || 'Your Name'}
          </h1>
          <div className="flex flex-wrap gap-4 text-gray-600 dark:text-gray-400 mb-4">
            {personalInfo?.email && <span>{personalInfo.email}</span>}
            {personalInfo?.phone && <span>{personalInfo.phone}</span>}
            {personalInfo?.location && <span>{personalInfo.location}</span>}
          </div>
          <div className="flex flex-wrap gap-4">
            {personalInfo?.linkedIn && (
              <a href={personalInfo.linkedIn} className="text-blue-600 hover:underline">
                LinkedIn
              </a>
            )}
            {personalInfo?.github && (
              <a href={personalInfo.github} className="text-blue-600 hover:underline">
                GitHub
              </a>
            )}
            {personalInfo?.portfolio && (
              <a href={personalInfo.portfolio} className="text-blue-600 hover:underline">
                Portfolio
              </a>
            )}
          </div>
        </div>

        {/* Summary */}
        {personalInfo?.summary && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              Professional Summary
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {personalInfo.summary}
            </p>
          </div>
        )}

        {/* Video Resume */}
        {videoUrl && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              Video Resume
            </h2>
            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Video Introduction
              </h3>
              <video
                src={videoUrl}
                controls
                className="w-full max-w-md rounded-lg"
              />
            </div>
          </div>
        )}

        {/* Skills */}
        {skills && skills.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              Skills & Technologies
            </h2>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, index) => (
                <Badge key={index} variant="outline">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Experience */}
        {experience && experience.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Work Experience
            </h2>
            <div className="space-y-6">
              {experience.map((exp, index) => (
                <div key={exp.id} className="border-l-2 border-blue-200 dark:border-blue-800 pl-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {exp.position}
                      </h3>
                      <p className="text-blue-600 dark:text-blue-400 font-medium">
                        {exp.company}
                      </p>
                    </div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)}
                    </span>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 mb-3">
                    {exp.description}
                  </p>
                  {exp.achievements.length > 0 && (
                    <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-1">
                      {exp.achievements.map((achievement, achIndex) => (
                        <li key={achIndex}>{achievement}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {education && education.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Education
            </h2>
            <div className="space-y-4">
              {education.map((edu, index) => (
                <div key={edu.id} className="border-l-2 border-green-200 dark:border-green-800 pl-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {edu.degree} in {edu.field}
                      </h3>
                      <p className="text-green-600 dark:text-green-400 font-medium">
                        {edu.institution}
                      </p>
                    </div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                    </span>
                  </div>
                  {edu.gpa && (
                    <p className="text-gray-600 dark:text-gray-400">
                      GPA: {edu.gpa}
                    </p>
                  )}
                  {edu.description && (
                    <p className="text-gray-700 dark:text-gray-300 mt-2">
                      {edu.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>

      {/* Action Buttons - Mobile Friendly */}
      <div className="flex flex-col sm:flex-row justify-center items-center gap-4 py-6 px-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 rounded-xl border border-blue-100 dark:border-gray-600">
        <Button
          variant="primary"
          size="lg"
          icon={isGeneratingPDF ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
          onClick={onDownloadPDF}
          disabled={isGeneratingPDF}
          className="w-full sm:w-auto px-6 py-3 font-semibold shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
        >
          {isGeneratingPDF ? 'Generating...' : 'Download PDF'}
        </Button>
        <Button
          variant="secondary"
          size="lg"
          icon={<Edit className="w-4 h-4" />}
          className="w-full sm:w-auto px-6 py-3 font-semibold shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
        >
          Save Resume
        </Button>
      </div>
    </div>
  );
};