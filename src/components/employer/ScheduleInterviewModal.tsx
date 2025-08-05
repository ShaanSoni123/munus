import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, Check, AlertCircle } from 'lucide-react';
import { Button } from '../ui/Button';
import { interviewService, InterviewData } from '../../services/interviewService';

interface ScheduleInterviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSchedule: (interviewData: InterviewData) => void;
  applicantName?: string;
  applicantId?: string;
}

export const ScheduleInterviewModal: React.FC<ScheduleInterviewModalProps> = ({
  isOpen,
  onClose,
  onSchedule,
  applicantName = 'Applicant',
  applicantId = ''
}) => {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [errors, setErrors] = useState<{ date?: string; time?: string; general?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);



  const [timeSlots, setTimeSlots] = useState<string[]>([]);

  // Update time slots when date changes
  useEffect(() => {
    if (selectedDate) {
      const availableSlots = interviewService.getAvailableTimeSlots(selectedDate);
      setTimeSlots(availableSlots);
      
      // If current selected time is not available, reset it
      if (selectedTime && !availableSlots.includes(selectedTime)) {
        setSelectedTime(availableSlots[0] || '09:00');
      }
    }
  }, [selectedDate, selectedTime]);

  // Set default values when modal opens
  useEffect(() => {
    if (isOpen) {
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      setSelectedDate(tomorrow.toISOString().split('T')[0]);
      
      // Set to nearest 15-minute slot
      const currentHour = today.getHours();
      const currentMinute = today.getMinutes();
      const nearestSlot = Math.ceil(currentMinute / 15) * 15;
      const defaultHour = nearestSlot === 60 ? currentHour + 1 : currentHour;
      const defaultMinute = nearestSlot === 60 ? 0 : nearestSlot;
      
      if (defaultHour >= 9 && defaultHour <= 17) {
        setSelectedTime(`${defaultHour.toString().padStart(2, '0')}:${defaultMinute.toString().padStart(2, '0')}`);
      } else {
        setSelectedTime('09:00');
      }

      // Clear previous errors and success state
      setErrors({});
      setIsSuccess(false);
    }
  }, [isOpen]);

  // Validation functions
  const validateInputs = (): boolean => {
    const newErrors: { date?: string; time?: string; general?: string } = {};

    // Date validation
    if (!selectedDate) {
      newErrors.date = 'Please select an interview date';
    } else {
      const selectedDateObj = new Date(selectedDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDateObj < today) {
        newErrors.date = 'Interview date cannot be in the past';
      }
    }

    // Time validation
    if (!selectedTime) {
      newErrors.time = 'Please select an interview time';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle input changes with validation
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(e.target.value);
    if (errors.date) {
      setErrors(prev => ({ ...prev, date: undefined }));
    }
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedTime(e.target.value);
    if (errors.time) {
      setErrors(prev => ({ ...prev, time: undefined }));
    }
  };

  // Main scheduling function
  const handleConfirmSchedule = async () => {
    if (!validateInputs()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Use interview service to schedule interview
      const interviewData = await interviewService.scheduleInterview({
        applicantId: applicantId || 'unknown',
        date: selectedDate,
        time: selectedTime
      });

      // Call parent callback
      onSchedule(interviewData);

      // Show success state
      setIsSuccess(true);

      // Auto-close after success message
      setTimeout(() => {
        onClose();
        setIsSuccess(false);
      }, 2000);

    } catch (error: any) {
      console.error('Error scheduling interview:', error);
      setErrors({ general: error.message || 'Failed to schedule interview. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Format date for display
  const formatDisplayDate = (date: string) => {
    return interviewService.formatInterviewDate(date);
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={handleBackdropClick}
      onKeyDown={handleKeyDown}
    >
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Schedule Interview</h2>
              <p className="text-sm text-gray-500">with {applicantName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-full hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Success Message */}
          {isSuccess && (
            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <div className="flex items-center">
                <Check className="w-5 h-5 text-green-600 mr-2" />
                <p className="text-sm text-green-800 font-medium">
                  Interview scheduled successfully for {formatDisplayDate(selectedDate)} at {selectedTime}!
                </p>
              </div>
            </div>
          )}

          {/* General Error */}
          {errors.general && (
            <div className="bg-red-50 rounded-lg p-4 border border-red-200">
              <div className="flex items-center">
                <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
                <p className="text-sm text-red-800">{errors.general}</p>
              </div>
            </div>
          )}

          {/* Date Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Interview Date
            </label>
            <div className="relative">
              <input
                type="date"
                value={selectedDate}
                onChange={handleDateChange}
                min={new Date().toISOString().split('T')[0]}
                className={`w-full px-4 py-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 ${
                  errors.date ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>
            {errors.date && (
              <p className="mt-1 text-xs text-red-600 flex items-center">
                <AlertCircle className="w-3 h-3 mr-1" />
                {errors.date}
              </p>
            )}
            <p className="mt-1 text-xs text-gray-500">Choose an interview date</p>
          </div>

          {/* Time Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Interview Time
            </label>
            <div className="relative">
              <select
                value={selectedTime}
                onChange={handleTimeChange}
                className={`w-full px-4 py-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 appearance-none bg-white ${
                  errors.time ? 'border-red-300' : 'border-gray-300'
                }`}
              >
                {timeSlots.map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>
              <Clock className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>
            {errors.time && (
              <p className="mt-1 text-xs text-red-600 flex items-center">
                <AlertCircle className="w-3 h-3 mr-1" />
                {errors.time}
              </p>
            )}
            <p className="mt-1 text-xs text-gray-500">Select a time slot (15-minute intervals)</p>
          </div>

          {/* Summary */}
          {selectedDate && selectedTime && !errors.date && !errors.time &&
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <h3 className="text-sm font-medium text-blue-900 mb-2">Interview Summary</h3>
              <p className="text-sm text-blue-700">
                <span className="font-medium">Date:</span> {formatDisplayDate(selectedDate)}
              </p>
              <p className="text-sm text-blue-700">
                <span className="font-medium">Time:</span> {selectedTime}
              </p>
              <p className="text-sm text-blue-700">
                <span className="font-medium">Applicant:</span> {applicantName}
              </p>
            </div>
          }
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2"
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleConfirmSchedule}
            disabled={!selectedDate || !selectedTime || isSubmitting}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                Scheduling...
              </>
            ) : (
              <>
                <Check className="w-4 h-4 mr-2" />
                Confirm Schedule
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}; 