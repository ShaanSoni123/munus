// Interview Service for handling interview scheduling
// This service is designed to be modular and easily extensible for future integrations

export interface InterviewData {
  applicantId: string;
  date: string;
  time: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
  notes?: string;
  location?: string;
  type?: 'phone' | 'video' | 'in-person';
}

export interface InterviewScheduleRequest {
  applicantId: string;
  date: string;
  time: string;
  notes?: string;
  location?: string;
  type?: 'phone' | 'video' | 'in-person';
}

class InterviewService {
  // In-memory store (replace with API calls in production)
  private interviews: InterviewData[] = [];

  /**
   * Schedule a new interview
   */
  async scheduleInterview(request: InterviewScheduleRequest): Promise<InterviewData> {
    try {
      // Validate inputs
      this.validateScheduleRequest(request);

      // Check for double booking
      await this.checkDoubleBooking(request.date, request.time);

      // Create interview object
      const interview: InterviewData = {
        applicantId: request.applicantId,
        date: request.date,
        time: request.time,
        status: 'scheduled',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        notes: request.notes,
        location: request.location,
        type: request.type || 'in-person'
      };

      // Store interview (replace with API call)
      this.interviews.push(interview);

      // Future integrations can be added here:
      // await this.addToCalendar(interview);
      // await this.sendConfirmationEmail(interview);
      // await this.sendNotification(interview);

      return interview;
    } catch (error) {
      console.error('Error scheduling interview:', error);
      throw error;
    }
  }

  /**
   * Get all interviews for an applicant
   */
  async getInterviewsByApplicant(applicantId: string): Promise<InterviewData[]> {
    return this.interviews.filter(interview => interview.applicantId === applicantId);
  }

  /**
   * Get all scheduled interviews
   */
  async getScheduledInterviews(): Promise<InterviewData[]> {
    return this.interviews.filter(interview => interview.status === 'scheduled');
  }

  /**
   * Update interview status
   */
  async updateInterviewStatus(interviewId: string, status: InterviewData['status']): Promise<InterviewData | null> {
    const interview = this.interviews.find(i => i.applicantId === interviewId);
    if (interview) {
      interview.status = status;
      interview.updatedAt = new Date().toISOString();
      return interview;
    }
    return null;
  }

  /**
   * Cancel an interview
   */
  async cancelInterview(interviewId: string): Promise<boolean> {
    const interview = this.interviews.find(i => i.applicantId === interviewId);
    if (interview) {
      interview.status = 'cancelled';
      interview.updatedAt = new Date().toISOString();
      
      // Future: Send cancellation email
      // await this.sendCancellationEmail(interview);
      
      return true;
    }
    return false;
  }

  /**
   * Validate schedule request
   */
  private validateScheduleRequest(request: InterviewScheduleRequest): void {
    if (!request.applicantId) {
      throw new Error('Applicant ID is required');
    }

    if (!request.date) {
      throw new Error('Interview date is required');
    }

    if (!request.time) {
      throw new Error('Interview time is required');
    }

    // Validate date format (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(request.date)) {
      throw new Error('Invalid date format. Use YYYY-MM-DD');
    }

    // Validate time format (HH:MM)
    const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timeRegex.test(request.time)) {
      throw new Error('Invalid time format. Use HH:MM');
    }

    // Check if date is in the past
    const selectedDate = new Date(request.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
      throw new Error('Interview date cannot be in the past');
    }
  }

  /**
   * Check for double booking
   */
  private async checkDoubleBooking(date: string, time: string): Promise<void> {
    const conflictingInterview = this.interviews.find(interview => 
      interview.date === date && 
      interview.time === time && 
      interview.status === 'scheduled'
    );

    if (conflictingInterview) {
      throw new Error('This time slot is already booked. Please select a different time.');
    }
  }

  /**
   * Get available time slots for a given date
   */
  getAvailableTimeSlots(date: string): string[] {
    const allTimeSlots = this.generateTimeSlots();
    const bookedSlots = this.interviews
      .filter(interview => interview.date === date && interview.status === 'scheduled')
      .map(interview => interview.time);

    return allTimeSlots.filter(slot => !bookedSlots.includes(slot));
  }

  /**
   * Generate time slots with 15-minute intervals
   */
  private generateTimeSlots(): string[] {
    const slots = [];
    for (let hour = 9; hour <= 17; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        slots.push(time);
      }
    }
    return slots;
  }

  /**
   * Format interview date for display
   */
  formatInterviewDate(date: string): string {
    return new Date(date).toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  }

  /**
   * Get interview summary for display
   */
  getInterviewSummary(interview: InterviewData): string {
    const formattedDate = this.formatInterviewDate(interview.date);
    return `Interview scheduled for ${formattedDate} at ${interview.time}`;
  }

  // Future integration methods (to be implemented)

  /**
   * Add interview to calendar (Google Calendar, Outlook, etc.)
   */
  private async addToCalendar(interview: InterviewData): Promise<void> {
    // TODO: Implement calendar integration
    console.log('Adding to calendar:', interview);
  }

  /**
   * Send confirmation email to applicant
   */
  private async sendConfirmationEmail(interview: InterviewData): Promise<void> {
    // TODO: Implement email service
    console.log('Sending confirmation email for:', interview);
  }

  /**
   * Send notification to relevant parties
   */
  private async sendNotification(interview: InterviewData): Promise<void> {
    // TODO: Implement notification service
    console.log('Sending notification for:', interview);
  }

  /**
   * Send cancellation email
   */
  private async sendCancellationEmail(interview: InterviewData): Promise<void> {
    // TODO: Implement cancellation email
    console.log('Sending cancellation email for:', interview);
  }
}

export const interviewService = new InterviewService(); 