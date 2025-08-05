import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Input } from '../../ui/Input';
import { Button } from '../../ui/Button';
import { Card } from '../../ui/Card';
import type { Education } from '../../../types';

interface EducationStepProps {
  data: Education[];
  onChange: (data: Education[]) => void;
}

export const EducationStep: React.FC<EducationStepProps> = ({
  data,
  onChange,
}) => {
  const addEducation = () => {
    const newEducation: Education = {
      id: Date.now().toString(),
      institution: '',
      degree: '',
      field: '',
      startDate: new Date(),
      endDate: new Date(),
    };
    
    onChange([...data, newEducation]);
  };

  const updateEducation = (index: number, field: keyof Education, value: any) => {
    const updated = [...data];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  const removeEducation = (index: number) => {
    const updated = data.filter((_, i) => i !== index);
    onChange(updated);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Education
        </h3>
        <Button
          variant="primary"
          onClick={addEducation}
          icon={<Plus className="w-4 h-4" />}
        >
          Add Education
        </Button>
      </div>

      {data.length === 0 ? (
        <Card className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            No education added yet
          </p>
          <Button
            variant="outline"
            onClick={addEducation}
            icon={<Plus className="w-4 h-4" />}
          >
            Add Your Education
          </Button>
        </Card>
      ) : (
        <div className="space-y-4">
          {data.map((education, index) => (
            <Card key={education.id} className="relative">
              <div className="absolute top-4 right-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeEducation(index)}
                  icon={<Trash2 className="w-4 h-4" />}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <Input
                  label="Institution"
                  placeholder="University of Technology"
                  value={education.institution}
                  onChange={(e) => updateEducation(index, 'institution', e.target.value)}
                  fullWidth
                />
                
                <Input
                  label="Degree"
                  placeholder="Bachelor of Technology"
                  value={education.degree}
                  onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                  fullWidth
                />
                
                <Input
                  label="Field of Study"
                  placeholder="Computer Science"
                  value={education.field}
                  onChange={(e) => updateEducation(index, 'field', e.target.value)}
                  fullWidth
                />
                
                <Input
                  label="GPA (Optional)"
                  type="number"
                  step="0.01"
                  max="10"
                  placeholder="8.5"
                  value={education.gpa || ''}
                  onChange={(e) => updateEducation(index, 'gpa', parseFloat(e.target.value) || undefined)}
                  fullWidth
                />
                
                <Input
                  label="Start Date"
                  type="date"
                  value={education.startDate.toISOString().split('T')[0]}
                  onChange={(e) => updateEducation(index, 'startDate', new Date(e.target.value))}
                  fullWidth
                />
                
                <Input
                  label="End Date"
                  type="date"
                  value={education.endDate?.toISOString().split('T')[0] || ''}
                  onChange={(e) => updateEducation(index, 'endDate', e.target.value ? new Date(e.target.value) : undefined)}
                  fullWidth
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description (Optional)
                </label>
                <textarea
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-cyan-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                  rows={3}
                  placeholder="Relevant coursework, projects, achievements..."
                  value={education.description || ''}
                  onChange={(e) => updateEducation(index, 'description', e.target.value)}
                />
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};