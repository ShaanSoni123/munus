import React, { useState } from 'react';
import { Plus, Trash2, Sparkles, Calendar } from 'lucide-react';
import { Input } from '../../ui/Input';
import { Button } from '../../ui/Button';
import { Card } from '../../ui/Card';
import type { Experience } from '../../../types';

interface ExperienceStepProps {
  data: Experience[];
  onChange: (data: Experience[]) => void;
}

export const ExperienceStep: React.FC<ExperienceStepProps> = ({
  data,
  onChange,
}) => {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const addExperience = () => {
    const newExperience: Experience = {
      id: Date.now().toString(),
      company: '',
      position: '',
      startDate: new Date(),
      current: false,
      description: '',
      achievements: [''],
    };
    
    onChange([...data, newExperience]);
    setEditingIndex(data.length);
  };

  const updateExperience = (index: number, field: keyof Experience, value: any) => {
    const updated = [...data];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  const removeExperience = (index: number) => {
    const updated = data.filter((_, i) => i !== index);
    onChange(updated);
    setEditingIndex(null);
  };

  const addAchievement = (experienceIndex: number) => {
    const updated = [...data];
    updated[experienceIndex].achievements.push('');
    onChange(updated);
  };

  const updateAchievement = (experienceIndex: number, achievementIndex: number, value: string) => {
    const updated = [...data];
    updated[experienceIndex].achievements[achievementIndex] = value;
    onChange(updated);
  };

  const removeAchievement = (experienceIndex: number, achievementIndex: number) => {
    const updated = [...data];
    updated[experienceIndex].achievements = updated[experienceIndex].achievements.filter((_, i) => i !== achievementIndex);
    onChange(updated);
  };

  const generateAIAchievements = async (experienceIndex: number) => {
    // Simulate AI achievement generation
    const aiAchievements = [
      "Led a team of 5 developers to deliver project 2 weeks ahead of schedule",
      "Implemented automated testing that reduced bugs by 40%",
      "Optimized database queries resulting in 30% faster page load times"
    ];
    
    updateExperience(experienceIndex, 'achievements', aiAchievements);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Work Experience
        </h3>
        <Button
          variant="primary"
          onClick={addExperience}
          icon={<Plus className="w-4 h-4" />}
        >
          Add Experience
        </Button>
      </div>

      {data.length === 0 ? (
        <Card className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            No work experience added yet
          </p>
          <Button
            variant="outline"
            onClick={addExperience}
            icon={<Plus className="w-4 h-4" />}
          >
            Add Your First Experience
          </Button>
        </Card>
      ) : (
        <div className="space-y-4">
          {data.map((experience, index) => (
            <Card key={experience.id} className="relative">
              <div className="absolute top-4 right-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeExperience(index)}
                  icon={<Trash2 className="w-4 h-4" />}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <Input
                  label="Job Title"
                  placeholder="Software Engineer"
                  value={experience.position}
                  onChange={(e) => updateExperience(index, 'position', e.target.value)}
                  fullWidth
                />
                
                <Input
                  label="Company"
                  placeholder="Tech Corp"
                  value={experience.company}
                  onChange={(e) => updateExperience(index, 'company', e.target.value)}
                  fullWidth
                />
                
                <Input
                  label="Start Date"
                  type="date"
                  value={experience.startDate.toISOString().split('T')[0]}
                  onChange={(e) => updateExperience(index, 'startDate', new Date(e.target.value))}
                  fullWidth
                />
                
                <div>
                  <Input
                    label="End Date"
                    type="date"
                    value={experience.endDate?.toISOString().split('T')[0] || ''}
                    onChange={(e) => updateExperience(index, 'endDate', e.target.value ? new Date(e.target.value) : undefined)}
                    disabled={experience.current}
                    fullWidth
                  />
                  <label className="flex items-center mt-2">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      checked={experience.current}
                      onChange={(e) => updateExperience(index, 'current', e.target.checked)}
                    />
                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                      I currently work here
                    </span>
                  </label>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Job Description
                </label>
                <textarea
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-cyan-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                  rows={3}
                  placeholder="Describe your role and responsibilities..."
                  value={experience.description}
                  onChange={(e) => updateExperience(index, 'description', e.target.value)}
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Key Achievements
                  </label>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => generateAIAchievements(index)}
                      icon={<Sparkles className="w-4 h-4" />}
                    >
                      AI Generate
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => addAchievement(index)}
                      icon={<Plus className="w-4 h-4" />}
                    >
                      Add Achievement
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  {experience.achievements.map((achievement, achievementIndex) => (
                    <div key={achievementIndex} className="flex items-center space-x-2">
                      <div className="flex-1">
                        <Input
                          placeholder="Increased team productivity by 25%..."
                          value={achievement}
                          onChange={(e) => updateAchievement(index, achievementIndex, e.target.value)}
                          fullWidth
                        />
                      </div>
                      {experience.achievements.length > 1 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeAchievement(index, achievementIndex)}
                          icon={<Trash2 className="w-4 h-4" />}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};