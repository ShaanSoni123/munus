import { api } from './api';
import type { Resume, Experience, Education } from '../types';

export interface ResumeResponse {
  id: number;
  title: string;
  summary?: string;
  video_url?: string;
  voice_url?: string;
  pdf_url?: string;
  template_id: string;
  is_public: boolean;
  is_default: boolean;
  user_id: number;
  created_at: string;
  updated_at?: string;
  experiences: ExperienceResponse[];
  educations: EducationResponse[];
  skills: SkillResponse[];
  projects: ProjectResponse[];
  certifications: CertificationResponse[];
}

export interface ExperienceResponse {
  id: number;
  company: string;
  position: string;
  description?: string;
  achievements: string[];
  start_date: string;
  end_date?: string;
  is_current: boolean;
  created_at: string;
}

export interface EducationResponse {
  id: number;
  institution: string;
  degree: string;
  field_of_study?: string;
  description?: string;
  gpa?: number;
  start_date: string;
  end_date?: string;
  created_at: string;
}

export interface SkillResponse {
  id: number;
  name: string;
  category?: string;
  proficiency_level: number;
  created_at: string;
}

export interface ProjectResponse {
  id: number;
  name: string;
  description?: string;
  technologies: string[];
  url?: string;
  github_url?: string;
  start_date?: string;
  end_date?: string;
  created_at: string;
}

export interface CertificationResponse {
  id: number;
  name: string;
  issuer: string;
  credential_id?: string;
  url?: string;
  issue_date: string;
  expiry_date?: string;
  created_at: string;
}

export interface ResumeCreateRequest {
  title: string;
  summary?: string;
  template_id?: string;
  is_public?: boolean;
  experiences?: Omit<ExperienceResponse, 'id' | 'created_at'>[];
  educations?: Omit<EducationResponse, 'id' | 'created_at'>[];
  skills?: Omit<SkillResponse, 'id' | 'created_at'>[];
  projects?: Omit<ProjectResponse, 'id' | 'created_at'>[];
  certifications?: Omit<CertificationResponse, 'id' | 'created_at'>[];
}

export interface ResumeUpdateRequest {
  title?: string;
  summary?: string;
  video_url?: string;
  voice_url?: string;
  template_id?: string;
  is_public?: boolean;
}

class ResumeService {
  async getResumes(): Promise<ResumeResponse[]> {
    try {
      const response = await api.get<ResumeResponse[]>('/resumes/');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Failed to fetch resumes');
    }
  }

  async getResume(resumeId: number): Promise<ResumeResponse> {
    try {
      const response = await api.get<ResumeResponse>(`/resumes/${resumeId}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Failed to fetch resume');
    }
  }

  async createResume(resumeData: ResumeCreateRequest): Promise<ResumeResponse> {
    try {
      const response = await api.post<ResumeResponse>('/resumes/', resumeData);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Failed to create resume');
    }
  }

  async updateResume(resumeId: number, resumeData: ResumeUpdateRequest): Promise<ResumeResponse> {
    try {
      const response = await api.put<ResumeResponse>(`/resumes/${resumeId}`, resumeData);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Failed to update resume');
    }
  }

  async deleteResume(resumeId: number): Promise<void> {
    try {
      await api.delete(`/resumes/${resumeId}`);
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Failed to delete resume');
    }
  }

  async uploadVideo(resumeId: number, file: File): Promise<{ video_url: string }> {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await api.upload<{ video_url: string }>(`/resumes/${resumeId}/upload-video`, formData);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Failed to upload video');
    }
  }

  async uploadAudio(resumeId: number, file: File): Promise<{ voice_url: string }> {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await api.upload<{ voice_url: string }>(`/resumes/${resumeId}/upload-audio`, formData);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Failed to upload audio');
    }
  }

  async uploadResumePDF(file: File): Promise<{ resume_url: string }> {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await api.upload<{ resume_url: string }>('/upload/resume', formData);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Failed to upload resume');
    }
  }

  async generatePDF(resumeId: number): Promise<{ pdf_url: string }> {
    try {
      const response = await api.post<{ pdf_url: string }>(`/resumes/${resumeId}/generate-pdf`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Failed to generate PDF');
    }
  }

  async setDefaultResume(resumeId: number): Promise<void> {
    try {
      await api.post(`/resumes/${resumeId}/set-default`);
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Failed to set default resume');
    }
  }

  async parseGoogleDriveResume(file: File, metadata: any): Promise<any> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('metadata', JSON.stringify(metadata));

      const response = await api.upload<any>('/resumes/parse-google-drive', formData);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Failed to parse Google Drive resume');
    }
  }

  async generatePDFFromData(resumeData: any): Promise<{ filename: string; pdfContent: string }> {
    try {
      const response = await api.post<any>('/resumes/generate-pdf', resumeData);
      
      if (response.data.success) {
        return {
          filename: response.data.filename,
          pdfContent: response.data.pdf_content
        };
      } else {
        throw new Error('Failed to generate PDF');
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Failed to generate PDF');
    }
  }
}

export const resumeService = new ResumeService();