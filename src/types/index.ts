// Core type definitions for the job portal
export interface User {
  id?: number | string;
  _id?: string;
  email: string;
  name: string;
  role: 'jobseeker' | 'employer' | 'admin';
  avatar_url?: string;
  phone?: string;
  location?: string;
  bio?: string;
  experience_years?: number;
  expected_salary_min?: number;
  expected_salary_max?: number;
  preferred_job_type?: string;
  preferred_work_mode?: string;
  linkedin_url?: string;
  github_url?: string;
  portfolio_url?: string;
  is_active: boolean;
  is_verified: boolean;
  email_verified: boolean;
  created_at: string;
  last_login?: string;
  company_id?: number;
  company_name?: string;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  companyLogo?: string;
  location: string;
  type: JobType;
  workMode: WorkMode;
  experience: ExperienceLevel;
  salary: SalaryRange;
  description: string;
  requirements: string[];
  benefits?: string[];
  skills: string[];
  postedAt: Date;
  deadline?: Date;
  employerId: string;
  isActive: boolean;
  applicationsCount: number;
}

export interface Resume {
  id: string;
  userId: string;
  personalInfo: PersonalInfo;
  experience: Experience[];
  education: Education[];
  skills: string[];
  projects?: Project[];
  certifications?: Certification[];
  videoUrl?: string;
  templateId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PersonalInfo {
  name: string;
  email: string;
  phone: string;
  location: string;
  summary?: string;
  linkedIn?: string;
  github?: string;
  portfolio?: string;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  startDate: Date;
  endDate?: Date;
  current: boolean;
  description: string;
  achievements: string[];
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: Date;
  endDate?: Date;
  gpa?: number;
  description?: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  url?: string;
  github?: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: Date;
  expiryDate?: Date;
  credentialId?: string;
  url?: string;
}

export type JobType = 'full-time' | 'part-time' | 'internship' | 'contract' | 'freelance';
export type WorkMode = 'remote' | 'onsite' | 'hybrid';
export type ExperienceLevel = 'fresher' | '1-2' | '3-5' | '5+';
export type Theme = 'light' | 'dark-neon';

export interface SalaryRange {
  min: number;
  max: number;
  currency: string;
  period: 'hour' | 'month' | 'year';
}

export interface JobFilters {
  search?: string;
  location?: string;
  radius?: number;
  jobType?: string[];
  workMode?: string[];
  experience?: string[];
  salaryRange?: SalaryRange;
  postedWithin?: number; // days
  skills?: string[];
  languages?: string[];
}

export interface JobPreferences {
  preferredLocations: string[];
  preferredJobTypes: JobType[];
  preferredWorkMode: WorkMode[];
  expectedSalary: SalaryRange;
  skills: string[];
}

export interface NotificationSettings {
  emailNotifications: boolean;
  jobAlerts: boolean;
  applicationUpdates: boolean;
  marketingEmails: boolean;
}