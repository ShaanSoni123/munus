import React from 'react';
import { Download, Share2, Edit, Eye } from 'lucide-react';
import { Button } from '../../ui/Button';
import { Card } from '../../ui/Card';
import { Badge } from '../../ui/Badge';
import type { Resume } from '../../../types';

interface PreviewStepProps {
  resumeData: Partial<Resume>;
}

export const PreviewStep: React.FC<PreviewStepProps> = ({ resumeData }) => {
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
        <div className="flex space-x-2">
          <Button
            variant="outline"
            icon={<Edit className="w-4 h-4" />}
          >
            Edit
          </Button>
          <Button
            variant="outline"
            icon={<Share2 className="w-4 h-4" />}
          >
            Share
          </Button>
          <Button
            variant="primary"
            icon={<Download className="w-4 h-4" />}
          >
            Download PDF
          </Button>
        </div>
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

      {/* Action Buttons */}
      <div className="flex justify-center space-x-4">
        <Button
          variant="outline"
          size="lg"
          icon={<Eye className="w-5 h-5" />}
        >
          Preview in New Tab
        </Button>
        <Button
          variant="secondary"
          size="lg"
          icon={<Share2 className="w-5 h-5" />}
        >
          Share Resume
        </Button>
        <Button
          variant="primary"
          size="lg"
          icon={<Download className="w-5 h-5" />}
        >
          Download PDF
        </Button>
      </div>
    </div>
  );
};