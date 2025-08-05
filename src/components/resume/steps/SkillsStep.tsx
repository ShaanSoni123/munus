import React, { useState } from 'react';
import { Plus, X, Sparkles } from 'lucide-react';
import { Input } from '../../ui/Input';
import { Button } from '../../ui/Button';
import { Badge } from '../../ui/Badge';
import { Card } from '../../ui/Card';

interface SkillsStepProps {
  data: string[];
  onChange: (data: string[]) => void;
}

export const SkillsStep: React.FC<SkillsStepProps> = ({
  data,
  onChange,
}) => {
  const [newSkill, setNewSkill] = useState('');

  const popularSkills = [
    'JavaScript', 'Python', 'React', 'Node.js', 'TypeScript', 'Java', 'SQL',
    'AWS', 'Docker', 'Git', 'CSS', 'HTML', 'MongoDB', 'Express.js', 'Vue.js',
    'Angular', 'PHP', 'C++', 'Machine Learning', 'Data Analysis', 'Leadership',
    'Communication', 'Problem Solving', 'Project Management', 'Team Collaboration'
  ];

  const addSkill = (skill: string) => {
    if (skill.trim() && !data.includes(skill.trim())) {
      onChange([...data, skill.trim()]);
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    onChange(data.filter(skill => skill !== skillToRemove));
  };

  const generateAISkills = async () => {
    // Simulate AI skill suggestions based on common tech skills
    const aiSkills = ['React', 'TypeScript', 'Node.js', 'AWS', 'Python', 'SQL'];
    const newSkills = aiSkills.filter(skill => !data.includes(skill));
    onChange([...data, ...newSkills]);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSkill(newSkill);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Skills & Technologies
        </h3>
        <Button
          variant="outline"
          onClick={generateAISkills}
          icon={<Sparkles className="w-4 h-4" />}
        >
          AI Suggest
        </Button>
      </div>

      {/* Add New Skill */}
      <Card>
        <div className="flex space-x-2">
          <div className="flex-1">
            <Input
              placeholder="Add a skill (e.g., JavaScript, Leadership)"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyPress={handleKeyPress}
              fullWidth
            />
          </div>
          <Button
            variant="primary"
            onClick={() => addSkill(newSkill)}
            disabled={!newSkill.trim()}
            icon={<Plus className="w-4 h-4" />}
          >
            Add
          </Button>
        </div>
      </Card>

      {/* Current Skills */}
      {data.length > 0 && (
        <Card>
          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
            Your Skills ({data.length})
          </h4>
          <div className="flex flex-wrap gap-2">
            {data.map((skill, index) => (
              <Badge
                key={index}
                variant="primary"
                className="flex items-center space-x-1"
              >
                <span>{skill}</span>
                <button
                  onClick={() => removeSkill(skill)}
                  className="hover:bg-white/20 rounded-full p-0.5 ml-1"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
          </div>
        </Card>
      )}

      {/* Popular Skills */}
      <Card>
        <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
          Popular Skills
        </h4>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
          Click to add skills that are commonly sought after by employers
        </p>
        <div className="flex flex-wrap gap-2">
          {popularSkills
            .filter(skill => !data.includes(skill))
            .map((skill, index) => (
              <button
                key={index}
                onClick={() => addSkill(skill)}
                className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                {skill}
              </button>
            ))}
        </div>
      </Card>

      {/* Skills Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
            Technical Skills
          </h4>
          <div className="space-y-2">
            {data
              .filter(skill => 
                ['JavaScript', 'Python', 'React', 'Node.js', 'TypeScript', 'Java', 'SQL', 'AWS', 'Docker', 'Git', 'CSS', 'HTML', 'MongoDB'].some(tech => 
                  skill.toLowerCase().includes(tech.toLowerCase())
                )
              )
              .map((skill, index) => (
                <Badge key={index} variant="secondary" size="sm">
                  {skill}
                </Badge>
              ))}
          </div>
        </Card>

        <Card>
          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
            Soft Skills
          </h4>
          <div className="space-y-2">
            {data
              .filter(skill => 
                ['Leadership', 'Communication', 'Problem Solving', 'Project Management', 'Team Collaboration', 'Analytics'].some(soft => 
                  skill.toLowerCase().includes(soft.toLowerCase())
                )
              )
              .map((skill, index) => (
                <Badge key={index} variant="success" size="sm">
                  {skill}
                </Badge>
              ))}
          </div>
        </Card>
      </div>
    </div>
  );
};