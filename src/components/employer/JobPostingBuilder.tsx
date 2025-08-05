import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, ArrowRight, Sparkles, Save, Eye, Send, Building, MapPin, DollarSign, Clock, Users, Briefcase, GraduationCap, Star, Zap, CheckCircle, ChevronDown } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Badge } from '../ui/Badge';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { jobService } from '../../services/jobService';
import { Toast } from '../common/Toast';

interface JobPostingBuilderProps {
  onBack: () => void;
  onJobPosted?: (job: any) => void;
}

interface JobData {
  title: string;
  department: string;
  location: string;
  workMode: 'remote' | 'onsite' | 'hybrid';
  jobType: 'full_time' | 'part_time' | 'contract' | 'internship' | 'freelance';
  experienceLevel: 'fresher' | '1-2' | '3-5' | '5+';
  salaryMin: string;
  salaryMax: string;
  currency: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  skills: string[];
  benefits: string[];
  applicationDeadline: string;
}

// Comprehensive job title suggestions
const jobTitleSuggestions = [
  // Software & Technology
  'Software Engineer', 'Frontend Developer', 'Backend Developer', 'Full Stack Developer',
  'DevOps Engineer', 'Data Scientist', 'Machine Learning Engineer', 'AI Engineer',
  'Data Engineer', 'Software Architect', 'System Administrator', 'Network Engineer',
  'Cloud Engineer', 'Security Engineer', 'QA Engineer', 'Test Engineer',
  'Mobile Developer', 'iOS Developer', 'Android Developer', 'React Developer',
  'Angular Developer', 'Vue.js Developer', 'Node.js Developer', 'Python Developer',
  'Java Developer', 'C++ Developer', 'C# Developer', '.NET Developer',
  'PHP Developer', 'Ruby Developer', 'Go Developer', 'Rust Developer',
  'Blockchain Developer', 'Game Developer', 'UI/UX Designer', 'Product Designer',
  'Technical Lead', 'Engineering Manager', 'CTO', 'VP of Engineering',
  
  // Business & Management
  'Project Manager', 'Product Manager', 'Program Manager', 'Scrum Master',
  'Business Analyst', 'Data Analyst', 'Business Intelligence Analyst',
  'Operations Manager', 'General Manager', 'CEO', 'CFO', 'COO',
  'HR Manager', 'Recruitment Manager', 'Talent Acquisition Specialist',
  'Marketing Manager', 'Digital Marketing Manager', 'Content Marketing Manager',
  'Sales Manager', 'Account Manager', 'Customer Success Manager',
  'Finance Manager', 'Financial Analyst', 'Accountant', 'Controller',
  
  // Creative & Design
  'Graphic Designer', 'Web Designer', 'Visual Designer', 'Brand Designer',
  'Creative Director', 'Art Director', 'Content Creator', 'Copywriter',
  'Video Editor', 'Motion Designer', '3D Artist', 'Illustrator',
  'Photographer', 'Videographer', 'Social Media Manager',
  
  // Healthcare & Science
  'Doctor', 'Nurse', 'Pharmacist', 'Medical Assistant', 'Lab Technician',
  'Research Scientist', 'Biologist', 'Chemist', 'Physicist',
  'Clinical Research Associate', 'Medical Writer',
  
  // Education & Training
  'Teacher', 'Professor', 'Instructor', 'Trainer', 'Curriculum Developer',
  'Educational Consultant', 'Academic Advisor', 'School Administrator',
  
  // Legal & Compliance
  'Lawyer', 'Attorney', 'Legal Assistant', 'Paralegal', 'Compliance Officer',
  'Legal Counsel', 'Contract Manager',
  
  // Sales & Customer Service
  'Sales Representative', 'Account Executive', 'Sales Director',
  'Customer Service Representative', 'Support Specialist', 'Help Desk Analyst',
  
  // Operations & Logistics
  'Operations Analyst', 'Supply Chain Manager', 'Logistics Coordinator',
  'Warehouse Manager', 'Inventory Manager', 'Procurement Specialist',
  
  // Finance & Banking
  'Investment Banker', 'Financial Advisor', 'Credit Analyst',
  'Risk Manager', 'Compliance Analyst', 'Treasury Analyst',
  
  // Consulting & Strategy
  'Management Consultant', 'Strategy Consultant', 'Business Consultant',
  'Technology Consultant', 'Process Improvement Specialist',
  
  // Research & Development
  'Research Analyst', 'Market Researcher', 'User Experience Researcher',
  'Product Researcher', 'Competitive Intelligence Analyst',
  
  // Manufacturing & Engineering
  'Mechanical Engineer', 'Electrical Engineer', 'Civil Engineer',
  'Chemical Engineer', 'Industrial Engineer', 'Manufacturing Engineer',
  'Quality Engineer', 'Process Engineer', 'Design Engineer',
  
  // Real Estate & Construction
  'Real Estate Agent', 'Property Manager', 'Construction Manager',
  'Architect', 'Interior Designer', 'Urban Planner',
  
  // Media & Communications
  'Journalist', 'Editor', 'Public Relations Manager', 'Communications Manager',
  'Content Strategist', 'SEO Specialist', 'Digital Marketing Specialist',
  
  // Hospitality & Tourism
  'Hotel Manager', 'Restaurant Manager', 'Event Planner', 'Tour Guide',
  'Chef', 'Sous Chef', 'Food Service Manager',
  
  // Retail & E-commerce
  'Store Manager', 'Retail Associate', 'E-commerce Manager',
  'Merchandiser', 'Buyer', 'Category Manager',
  
  // Transportation & Logistics
  'Logistics Manager', 'Transportation Manager', 'Fleet Manager',
  'Supply Chain Analyst', 'Import/Export Specialist',
  
  // Energy & Utilities
  'Energy Analyst', 'Environmental Engineer', 'Sustainability Manager',
  'Renewable Energy Specialist', 'Utility Manager',
  
  // Government & Non-profit
  'Policy Analyst', 'Grant Writer', 'Program Coordinator',
  'Community Manager', 'Advocacy Manager', 'Fundraising Manager'
];

// Popular Indian cities for location suggestions
const locationSuggestions = [
  'Mumbai, Maharashtra',
  'Delhi, Delhi',
  'Bangalore, Karnataka',
  'Hyderabad, Telangana',
  'Chennai, Tamil Nadu',
  'Kolkata, West Bengal',
  'Pune, Maharashtra',
  'Ahmedabad, Gujarat',
  'Jaipur, Rajasthan',
  'Surat, Gujarat',
  'Lucknow, Uttar Pradesh',
  'Kanpur, Uttar Pradesh',
  'Nagpur, Maharashtra',
  'Indore, Madhya Pradesh',
  'Thane, Maharashtra',
  'Bhopal, Madhya Pradesh',
  'Visakhapatnam, Andhra Pradesh',
  'Pimpri-Chinchwad, Maharashtra',
  'Patna, Bihar',
  'Vadodara, Gujarat',
  'Ghaziabad, Uttar Pradesh',
  'Ludhiana, Punjab',
  'Agra, Uttar Pradesh',
  'Nashik, Maharashtra',
  'Faridabad, Haryana',
  'Meerut, Uttar Pradesh',
  'Rajkot, Gujarat',
  'Kalyan-Dombivali, Maharashtra',
  'Vasai-Virar, Maharashtra',
  'Varanasi, Uttar Pradesh',
  'Srinagar, Jammu and Kashmir',
  'Aurangabad, Maharashtra',
  'Dhanbad, Jharkhand',
  'Amritsar, Punjab',
  'Allahabad, Uttar Pradesh',
  'Ranchi, Jharkhand',
  'Howrah, West Bengal',
  'Coimbatore, Tamil Nadu',
  'Jabalpur, Madhya Pradesh',
  'Gwalior, Madhya Pradesh',
  'Vijayawada, Andhra Pradesh',
  'Jodhpur, Rajasthan',
  'Madurai, Tamil Nadu',
  'Raipur, Chhattisgarh',
  'Kota, Rajasthan',
  'Guwahati, Assam',
  'Chandigarh, Chandigarh',
  'Solapur, Maharashtra',
  'Hubli-Dharwad, Karnataka',
  'Bareilly, Uttar Pradesh',
  'Moradabad, Uttar Pradesh',
  'Mysore, Karnataka',
  'Gurgaon, Haryana',
  'Aligarh, Uttar Pradesh',
  'Jalandhar, Punjab',
  'Tiruchirappalli, Tamil Nadu',
  'Bhubaneswar, Odisha',
  'Salem, Tamil Nadu',
  'Warangal, Telangana',
  'Guntur, Andhra Pradesh',
  'Bhiwandi, Maharashtra',
  'Saharanpur, Uttar Pradesh',
  'Gorakhpur, Uttar Pradesh',
  'Bikaner, Rajasthan',
  'Amravati, Maharashtra',
  'Noida, Uttar Pradesh',
  'Jamshedpur, Jharkhand',
  'Bhilai, Chhattisgarh',
  'Cuttack, Odisha',
  'Firozabad, Uttar Pradesh',
  'Kochi, Kerala',
  'Nellore, Andhra Pradesh',
  'Bhavnagar, Gujarat',
  'Dehradun, Uttarakhand',
  'Durgapur, West Bengal',
  'Asansol, West Bengal',
  'Rourkela, Odisha',
  'Nanded, Maharashtra',
  'Kolhapur, Maharashtra',
  'Ajmer, Rajasthan',
  'Akola, Maharashtra',
  'Gulbarga, Karnataka',
  'Jamnagar, Gujarat',
  'Ujjain, Madhya Pradesh',
  'Loni, Uttar Pradesh',
  'Siliguri, West Bengal',
  'Jhansi, Uttar Pradesh',
  'Ulhasnagar, Maharashtra',
  'Jammu, Jammu and Kashmir',
  'Sangli-Miraj & Kupwad, Maharashtra',
  'Mangalore, Karnataka',
  'Erode, Tamil Nadu',
  'Belgaum, Karnataka',
  'Ambattur, Tamil Nadu',
  'Tirunelveli, Tamil Nadu',
  'Malegaon, Maharashtra',
  'Gaya, Bihar',
  'Jalgaon, Maharashtra',
  'Udaipur, Rajasthan',
  'Maheshtala, West Bengal',
  'Tiruppur, Tamil Nadu',
  'Davanagere, Karnataka',
  'Kozhikode, Kerala',
  'Akbarpur, Uttar Pradesh',
  'Kurnool, Andhra Pradesh',
  'Bokaro Steel City, Jharkhand',
  'Rajpur Sonarpur, West Bengal',
  'South Dumdum, West Bengal',
  'Bellary, Karnataka',
  'Patiala, Punjab',
  'Gopalpur, West Bengal',
  'Agartala, Tripura',
  'Bhagalpur, Bihar',
  'Muzaffarnagar, Uttar Pradesh',
  'Bhatpara, West Bengal',
  'Panihati, West Bengal',
  'Latur, Maharashtra',
  'Dhule, Maharashtra',
  'Rohtak, Haryana',
  'Korba, Chhattisgarh',
  'Bhilwara, Rajasthan',
  'Berhampur, Odisha',
  'Muzaffarpur, Bihar',
  'Ahmednagar, Maharashtra',
  'Mathura, Uttar Pradesh',
  'Kollam, Kerala',
  'Avadi, Tamil Nadu',
  'Kadapa, Andhra Pradesh',
  'Kamarhati, West Bengal',
  'Bilaspur, Chhattisgarh',
  'Shahjahanpur, Uttar Pradesh',
  'Satara, Maharashtra',
  'Bijapur, Karnataka',
  'Rampur, Uttar Pradesh',
  'Shivamogga, Karnataka',
  'Chandrapur, Maharashtra',
  'Junagadh, Gujarat',
  'Thrissur, Kerala',
  'Alwar, Rajasthan',
  'Bardhaman, West Bengal',
  'Kulti, West Bengal',
  'Kakinada, Andhra Pradesh',
  'Nizamabad, Telangana',
  'Parbhani, Maharashtra',
  'Tumkur, Karnataka',
  'Hisar, Haryana',
  'Ozhukarai, Puducherry',
  'Bihar Sharif, Bihar',
  'Panipat, Haryana',
  'Darbhanga, Bihar',
  'Bally, West Bengal',
  'Aizawl, Mizoram',
  'Dewas, Madhya Pradesh',
  'Ichalkaranji, Maharashtra',
  'Karnal, Haryana',
  'Bathinda, Punjab',
  'Jalna, Maharashtra',
  'Eluru, Andhra Pradesh',
  'Kirari Suleman Nagar, Delhi',
  'Purnia, Bihar',
  'Satna, Madhya Pradesh',
  'Mau, Uttar Pradesh',
  'Sonipat, Haryana',
  'Farrukhabad, Uttar Pradesh',
  'Sagar, Madhya Pradesh',
  'Rourkela, Odisha',
  'Durg, Chhattisgarh',
  'Imphal, Manipur',
  'Ratlam, Madhya Pradesh',
  'Hapur, Uttar Pradesh',
  'Arrah, Bihar',
  'Anantapur, Andhra Pradesh',
  'Karimnagar, Telangana',
  'Etawah, Uttar Pradesh',
  'Ambernath, Maharashtra',
  'North Dumdum, West Bengal',
  'Bharatpur, Rajasthan',
  'Begusarai, Bihar',
  'New Delhi, Delhi',
  'Gandhidham, Gujarat',
  'Baranagar, West Bengal',
  'Tiruvottiyur, Tamil Nadu',
  'Puducherry, Puducherry',
  'Sikar, Rajasthan',
  'Thoothukkudi, Tamil Nadu',
  'Rewa, Madhya Pradesh',
  'Mirzapur, Uttar Pradesh',
  'Raichur, Karnataka',
  'Pali, Rajasthan',
  'Ramagundam, Telangana',
  'Haridwar, Uttarakhand',
  'Vijayanagaram, Andhra Pradesh',
  'Katihar, Bihar',
  'Nagercoil, Tamil Nadu',
  'Sri Ganganagar, Rajasthan',
  'Karawal Nagar, Delhi',
  'Mango, Jharkhand',
  'Thanjavur, Tamil Nadu',
  'Bulandshahr, Uttar Pradesh',
  'Uluberia, West Bengal',
  'Murwara, Madhya Pradesh',
  'Sambhal, Uttar Pradesh',
  'Singrauli, Madhya Pradesh',
  'Nadiad, Gujarat',
  'Secunderabad, Telangana',
  'Naihati, West Bengal',
  'Yamunanagar, Haryana',
  'Bidhan Nagar, West Bengal',
  'Pallavaram, Tamil Nadu',
  'Bidar, Karnataka',
  'Munger, Bihar',
  'Panchkula, Haryana',
  'Burhanpur, Madhya Pradesh',
  'Raurkela Industrial Township, Odisha',
  'Kharagpur, West Bengal',
  'Dindigul, Tamil Nadu',
  'Gandhinagar, Gujarat',
  'Hospet, Karnataka',
  'Nangloi Jat, Delhi',
  'Malda, West Bengal',
  'Ongole, Andhra Pradesh',
  'Deoghar, Jharkhand',
  'Chapra, Bihar',
  'Haldia, West Bengal',
  'Khandwa, Madhya Pradesh',
  'Nandyal, Andhra Pradesh',
  'Morena, Madhya Pradesh',
  'Amroha, Uttar Pradesh',
  'Anand, Gujarat',
  'Bhind, Madhya Pradesh',
  'Bhalswa Jahangir Pur, Delhi',
  'Madhyamgram, West Bengal',
  'Bhiwani, Haryana',
  'Berhampore, West Bengal',
  'Ambala, Haryana',
  'Mori Gate, Delhi',
  'South Extension, Delhi',
  'Vasant Vihar, Delhi',
  'Dwarka, Delhi',
  'Rohini, Delhi',
  'Pitampura, Delhi',
  'Janakpuri, Delhi',
  'Rajouri Garden, Delhi',
  'Hauz Khas, Delhi',
  'Green Park, Delhi',
  'Saket, Delhi',
  'Malviya Nagar, Delhi',
  'Kalkaji, Delhi',
  'Greater Kailash, Delhi',
  'Lajpat Nagar, Delhi',
  'Defence Colony, Delhi',
  'Sundar Nagar, Delhi',
  'Chanakyapuri, Delhi',
  'Shahdara, Delhi',
  'Seelampur, Delhi',
  'Gandhi Nagar, Delhi',
  'Shastri Nagar, Delhi',
  'Model Town, Delhi',
  'Civil Lines, Delhi',
  'Kingsway Camp, Delhi',
  'Mukherjee Nagar, Delhi',
  'Kamla Nagar, Delhi',
  'Hudson Lines, Delhi',
  'Kashmere Gate, Delhi',
  'Daryaganj, Delhi',
  'Chandni Chowk, Delhi',
  'Sadar Bazar, Delhi',
  'Paharganj, Delhi',
  'Karol Bagh, Delhi',
  'Rajinder Nagar, Delhi',
  'Patel Nagar, Delhi',
  'Rajendra Place, Delhi',
  'Naraina, Delhi',
  'Kirti Nagar, Delhi',
  'Moti Nagar, Delhi',
  'Ramesh Nagar, Delhi',
  'Rajouri Garden, Delhi',
  'Tagore Garden, Delhi',
  'Tilak Nagar, Delhi',
  'Subhash Nagar, Delhi',
  'Tilak Vihar, Delhi',
  'Mundka, Delhi',
  'Nangloi, Delhi',
  'Sultanpuri, Delhi',
  'Mangolpuri, Delhi',
  'Rohini, Delhi',
  'Shalimar Bagh, Delhi',
  'Ashok Vihar, Delhi',
  'Wazirpur, Delhi',
  'Adarsh Nagar, Delhi',
  'Azadpur, Delhi',
  'Model Town, Delhi',
  'Gulabi Bagh, Delhi',
  'Sadar Bazar, Delhi',
  'Pul Bangash, Delhi',
  'Teliwara, Delhi',
  'Sabzi Mandi, Delhi',
  'Roshanara Road, Delhi',
  'Shakti Nagar, Delhi',
  'Rohtas Nagar, Delhi',
  'Seelampur, Delhi',
  'Gandhi Nagar, Delhi',
  'Shahdara, Delhi',
  'Vivek Vihar, Delhi',
  'Dilshad Garden, Delhi',
  'Geeta Colony, Delhi',
  'Laxmi Nagar, Delhi',
  'Yamuna Vihar, Delhi',
  'Babarpur, Delhi',
  'Gokulpuri, Delhi',
  'Maujpur, Delhi',
  'Bhajanpura, Delhi',
  'Khajuri Khas, Delhi',
  'Mustafabad, Delhi',
  'Gokalpuri, Delhi',
  'Johri Enclave, Delhi',
  'Shahdara, Delhi',
  'Welcome, Delhi',
  'Seelampur, Delhi',
  'Jaffrabad, Delhi',
  'Maujpur, Delhi',
  'Gokulpuri, Delhi',
  'Babarpur, Delhi',
  'Yamuna Vihar, Delhi',
  'Laxmi Nagar, Delhi',
  'Geeta Colony, Delhi',
  'Dilshad Garden, Delhi',
  'Vivek Vihar, Delhi',
  'Shahdara, Delhi',
  'Gandhi Nagar, Delhi',
  'Seelampur, Delhi',
  'Rohtas Nagar, Delhi',
  'Shakti Nagar, Delhi',
  'Roshanara Road, Delhi',
  'Sabzi Mandi, Delhi',
  'Teliwara, Delhi',
  'Pul Bangash, Delhi',
  'Sadar Bazar, Delhi',
  'Gulabi Bagh, Delhi',
  'Model Town, Delhi',
  'Azadpur, Delhi',
  'Adarsh Nagar, Delhi',
  'Wazirpur, Delhi',
  'Ashok Vihar, Delhi',
  'Shalimar Bagh, Delhi',
  'Rohini, Delhi',
  'Mangolpuri, Delhi',
  'Sultanpuri, Delhi',
  'Nangloi, Delhi',
  'Mundka, Delhi',
  'Tilak Vihar, Delhi',
  'Subhash Nagar, Delhi',
  'Tilak Nagar, Delhi',
  'Tagore Garden, Delhi',
  'Rajouri Garden, Delhi',
  'Ramesh Nagar, Delhi',
  'Moti Nagar, Delhi',
  'Kirti Nagar, Delhi',
  'Naraina, Delhi',
  'Rajendra Place, Delhi',
  'Patel Nagar, Delhi',
  'Rajinder Nagar, Delhi',
  'Karol Bagh, Delhi',
  'Paharganj, Delhi',
  'Sadar Bazar, Delhi',
  'Chandni Chowk, Delhi',
  'Daryaganj, Delhi',
  'Kashmere Gate, Delhi',
  'Hudson Lines, Delhi',
  'Kamla Nagar, Delhi',
  'Mukherjee Nagar, Delhi',
  'Kingsway Camp, Delhi',
  'Civil Lines, Delhi',
  'Model Town, Delhi',
  'Shastri Nagar, Delhi',
  'Gandhi Nagar, Delhi',
  'Seelampur, Delhi',
  'Shahdara, Delhi',
  'Sundar Nagar, Delhi',
  'Defence Colony, Delhi',
  'Lajpat Nagar, Delhi',
  'Greater Kailash, Delhi',
  'Kalkaji, Delhi',
  'Malviya Nagar, Delhi',
  'Saket, Delhi',
  'Green Park, Delhi',
  'Hauz Khas, Delhi',
  'Rajouri Garden, Delhi',
  'Janakpuri, Delhi',
  'Pitampura, Delhi',
  'Rohini, Delhi',
  'Dwarka, Delhi',
  'Vasant Vihar, Delhi',
  'South Extension, Delhi',
  'Mori Gate, Delhi',
  'Ambala, Haryana',
  'Berhampore, West Bengal',
  'Bhiwani, Haryana',
  'Madhyamgram, West Bengal',
  'Bhalswa Jahangir Pur, Delhi',
  'Bhind, Madhya Pradesh',
  'Anand, Gujarat',
  'Amroha, Uttar Pradesh',
  'Morena, Madhya Pradesh',
  'Nandyal, Andhra Pradesh',
  'Khandwa, Madhya Pradesh',
  'Haldia, West Bengal',
  'Chapra, Bihar',
  'Deoghar, Jharkhand',
  'Ongole, Andhra Pradesh',
  'Malda, West Bengal',
  'Nangloi Jat, Delhi',
  'Hospet, Karnataka',
  'Gandhinagar, Gujarat',
  'Dindigul, Tamil Nadu',
  'Kharagpur, West Bengal',
  'Raurkela Industrial Township, Odisha',
  'Burhanpur, Madhya Pradesh',
  'Panchkula, Haryana',
  'Munger, Bihar',
  'Bidar, Karnataka',
  'Pallavaram, Tamil Nadu',
  'Bidhan Nagar, West Bengal',
  'Yamunanagar, Haryana',
  'Naihati, West Bengal',
  'Secunderabad, Telangana',
  'Nadiad, Gujarat',
  'Singrauli, Madhya Pradesh',
  'Sambhal, Uttar Pradesh',
  'Murwara, Madhya Pradesh',
  'Uluberia, West Bengal',
  'Bulandshahr, Uttar Pradesh',
  'Thanjavur, Tamil Nadu',
  'Mango, Jharkhand',
  'Karawal Nagar, Delhi',
  'Sri Ganganagar, Rajasthan',
  'Nagercoil, Tamil Nadu',
  'Katihar, Bihar',
  'Vijayanagaram, Andhra Pradesh',
  'Haridwar, Uttarakhand',
  'Ramagundam, Telangana',
  'Pali, Rajasthan',
  'Raichur, Karnataka',
  'Mirzapur, Uttar Pradesh',
  'Rewa, Madhya Pradesh',
  'Thoothukkudi, Tamil Nadu',
  'Sikar, Rajasthan',
  'Puducherry, Puducherry',
  'Tiruvottiyur, Tamil Nadu',
  'Baranagar, West Bengal',
  'Gandhidham, Gujarat',
  'New Delhi, Delhi',
  'Begusarai, Bihar',
  'Bharatpur, Rajasthan',
  'North Dumdum, West Bengal',
  'Ambernath, Maharashtra',
  'Etawah, Uttar Pradesh',
  'Karimnagar, Telangana',
  'Anantapur, Andhra Pradesh',
  'Arrah, Bihar',
  'Hapur, Uttar Pradesh',
  'Ratlam, Madhya Pradesh',
  'Imphal, Manipur',
  'Durg, Chhattisgarh',
  'Rourkela, Odisha',
  'Sagar, Madhya Pradesh',
  'Farrukhabad, Uttar Pradesh',
  'Sonipat, Haryana',
  'Mau, Uttar Pradesh',
  'Satna, Madhya Pradesh',
  'Purnia, Bihar',
  'Kirari Suleman Nagar, Delhi',
  'Eluru, Andhra Pradesh',
  'Jalna, Maharashtra',
  'Bathinda, Punjab',
  'Karnal, Haryana',
  'Ichalkaranji, Maharashtra',
  'Dewas, Madhya Pradesh',
  'Aizawl, Mizoram',
  'Bally, West Bengal',
  'Darbhanga, Bihar',
  'Panipat, Haryana',
  'Bihar Sharif, Bihar',
  'Ozhukarai, Puducherry',
  'Hisar, Haryana',
  'Tumkur, Karnataka',
  'Parbhani, Maharashtra',
  'Nizamabad, Telangana',
  'Kakinada, Andhra Pradesh',
  'Kulti, West Bengal',
  'Bardhaman, West Bengal',
  'Alwar, Rajasthan',
  'Thrissur, Kerala',
  'Junagadh, Gujarat',
  'Chandrapur, Maharashtra',
  'Shivamogga, Karnataka',
  'Rampur, Uttar Pradesh',
  'Bijapur, Karnataka',
  'Satara, Maharashtra',
  'Shahjahanpur, Uttar Pradesh',
  'Bilaspur, Chhattisgarh',
  'Kamarhati, West Bengal',
  'Kadapa, Andhra Pradesh',
  'Avadi, Tamil Nadu',
  'Kollam, Kerala',
  'Mathura, Uttar Pradesh',
  'Ahmednagar, Maharashtra',
  'Muzaffarpur, Bihar',
  'Berhampur, Odisha',
  'Bhilwara, Rajasthan',
  'Korba, Chhattisgarh',
  'Rohtak, Haryana',
  'Dhule, Maharashtra',
  'Latur, Maharashtra',
  'Panihati, West Bengal',
  'Bhatpara, West Bengal',
  'Muzaffarnagar, Uttar Pradesh',
  'Bhagalpur, Bihar',
  'Agartala, Tripura',
  'Gopalpur, West Bengal',
  'Patiala, Punjab',
  'Bellary, Karnataka',
  'South Dumdum, West Bengal',
  'Rajpur Sonarpur, West Bengal',
  'Bokaro Steel City, Jharkhand',
  'Kurnool, Andhra Pradesh',
  'Akbarpur, Uttar Pradesh',
  'Kozhikode, Kerala',
  'Davanagere, Karnataka',
  'Tiruppur, Tamil Nadu',
  'Maheshtala, West Bengal',
  'Udaipur, Rajasthan',
  'Jalgaon, Maharashtra',
  'Gaya, Bihar',
  'Malegaon, Maharashtra',
  'Tirunelveli, Tamil Nadu',
  'Ambattur, Tamil Nadu',
  'Belgaum, Karnataka',
  'Erode, Tamil Nadu',
  'Mangalore, Karnataka',
  'Sangli-Miraj & Kupwad, Maharashtra',
  'Jammu, Jammu and Kashmir',
  'Ulhasnagar, Maharashtra',
  'Jhansi, Uttar Pradesh',
  'Siliguri, West Bengal',
  'Loni, Uttar Pradesh',
  'Ujjain, Madhya Pradesh',
  'Jamnagar, Gujarat',
  'Gulbarga, Karnataka',
  'Akola, Maharashtra',
  'Ajmer, Rajasthan',
  'Kolhapur, Maharashtra',
  'Nanded, Maharashtra',
  'Asansol, West Bengal',
  'Durgapur, West Bengal',
  'Dehradun, Uttarakhand',
  'Bhavnagar, Gujarat',
  'Nellore, Andhra Pradesh',
  'Kochi, Kerala',
  'Firozabad, Uttar Pradesh',
  'Cuttack, Odisha',
  'Bhilai, Chhattisgarh',
  'Jamshedpur, Jharkhand',
  'Noida, Uttar Pradesh',
  'Amravati, Maharashtra',
  'Bikaner, Rajasthan',
  'Gorakhpur, Uttar Pradesh',
  'Saharanpur, Uttar Pradesh',
  'Bhiwandi, Maharashtra',
  'Guntur, Andhra Pradesh',
  'Warangal, Telangana',
  'Salem, Tamil Nadu',
  'Bhubaneswar, Odisha',
  'Tiruchirappalli, Tamil Nadu',
  'Jalandhar, Punjab',
  'Aligarh, Uttar Pradesh',
  'Gurgaon, Haryana',
  'Mysore, Karnataka',
  'Moradabad, Uttar Pradesh',
  'Bareilly, Uttar Pradesh',
  'Hubli-Dharwad, Karnataka',
  'Solapur, Maharashtra',
  'Chandigarh, Chandigarh',
  'Guwahati, Assam',
  'Kota, Rajasthan',
  'Raipur, Chhattisgarh',
  'Madurai, Tamil Nadu',
  'Jodhpur, Rajasthan',
  'Vijayawada, Andhra Pradesh',
  'Gwalior, Madhya Pradesh',
  'Jabalpur, Madhya Pradesh',
  'Coimbatore, Tamil Nadu',
  'Howrah, West Bengal',
  'Ranchi, Jharkhand',
  'Allahabad, Uttar Pradesh',
  'Amritsar, Punjab',
  'Dhanbad, Jharkhand',
  'Aurangabad, Maharashtra',
  'Srinagar, Jammu and Kashmir',
  'Varanasi, Uttar Pradesh',
  'Vasai-Virar, Maharashtra',
  'Kalyan-Dombivali, Maharashtra',
  'Rajkot, Gujarat',
  'Meerut, Uttar Pradesh',
  'Faridabad, Haryana',
  'Nashik, Maharashtra',
  'Agra, Uttar Pradesh',
  'Ludhiana, Punjab',
  'Ghaziabad, Uttar Pradesh',
  'Vadodara, Gujarat',
  'Patna, Bihar',
  'Pimpri-Chinchwad, Maharashtra',
  'Visakhapatnam, Andhra Pradesh',
  'Bhopal, Madhya Pradesh',
  'Indore, Madhya Pradesh',
  'Nagpur, Maharashtra',
  'Kanpur, Uttar Pradesh',
  'Lucknow, Uttar Pradesh',
  'Surat, Gujarat',
  'Jaipur, Rajasthan',
  'Ahmedabad, Gujarat',
  'Pune, Maharashtra',
  'Kolkata, West Bengal',
  'Chennai, Tamil Nadu',
  'Hyderabad, Telangana',
  'Bangalore, Karnataka',
  'Delhi, Delhi',
  'Mumbai, Maharashtra'
];

const steps = [
  { id: 'basic', name: 'Basic Info', icon: Building },
  { id: 'details', name: 'Job Details', icon: Briefcase },
  { id: 'requirements', name: 'Requirements', icon: GraduationCap },
  { id: 'description', name: 'Description', icon: Sparkles },
  { id: 'preview', name: 'Preview', icon: Eye },
];

export const JobPostingBuilder: React.FC<JobPostingBuilderProps> = ({ onBack, onJobPosted }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [jobData, setJobData] = useState<JobData>({
    title: '',
    department: '',
    location: '',
    workMode: 'hybrid',
    jobType: 'full_time', // fixed value
    experienceLevel: '3-5',
    salaryMin: '',
    salaryMax: '',
    currency: 'INR',
    description: '',
    responsibilities: [''],
    requirements: [''],
    skills: [],
    benefits: [''],
    applicationDeadline: '',
  });
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [locationSuggestionsVisible, setLocationSuggestionsVisible] = useState(false);
  const [filteredLocations, setFilteredLocations] = useState<string[]>([]);
  const [skillInputValue, setSkillInputValue] = useState('');
  const locationInputRef = useRef<HTMLInputElement>(null);
  const { theme } = useTheme();
  const { user } = useAuth();
  const [filteredJobTitles, setFilteredJobTitles] = useState<string[]>([]);
  const [jobTitleSuggestionsVisible, setJobTitleSuggestionsVisible] = useState(false);
  const jobTitleInputRef = useRef<HTMLInputElement>(null);
  const [isPublishing, setIsPublishing] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const updateJobData = (field: keyof JobData, value: any) => {
    setJobData(prev => ({ ...prev, [field]: value }));
  };

  // Location autocomplete functions
  const handleLocationChange = (value: string) => {
    updateJobData('location', value);
    
    if (value.trim()) {
      const filtered = locationSuggestions.filter(location =>
        location.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredLocations(filtered.slice(0, 10)); // Show max 10 suggestions
      setLocationSuggestionsVisible(true);
    } else {
      setFilteredLocations([]);
      setLocationSuggestionsVisible(false);
    }
  };

  const handleLocationSelect = (location: string) => {
    updateJobData('location', location);
    setLocationSuggestionsVisible(false);
    setFilteredLocations([]);
  };

  const handleLocationFocus = () => {
    if (jobData.location.trim()) {
      const filtered = locationSuggestions.filter(location =>
        location.toLowerCase().includes(jobData.location.toLowerCase())
      );
      setFilteredLocations(filtered.slice(0, 10));
      setLocationSuggestionsVisible(true);
    }
  };

  const handleLocationBlur = () => {
    // Delay hiding suggestions to allow for clicks
    setTimeout(() => {
      setLocationSuggestionsVisible(false);
    }, 200);
  };

  const addListItem = (field: 'responsibilities' | 'requirements' | 'benefits') => {
    setJobData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const updateListItem = (field: 'responsibilities' | 'requirements' | 'benefits', index: number, value: string) => {
    setJobData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const removeListItem = (field: 'responsibilities' | 'requirements' | 'benefits', index: number) => {
    setJobData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const addSkill = (skill: string) => {
    if (skill.trim() && !jobData.skills.includes(skill.trim())) {
      updateJobData('skills', [...jobData.skills, skill.trim()]);
    }
  };

  const removeSkill = (skillToRemove: string) => {
    updateJobData('skills', jobData.skills.filter(skill => skill !== skillToRemove));
  };

  const generateAIDescription = async () => {
    setIsGeneratingAI(true);
    
    // Simulate AI generation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const aiDescription = `We are seeking a talented ${jobData.title} to join our dynamic team at ${(user as any)?.company || 'our company'}. This is an exciting opportunity to work on cutting-edge projects and make a significant impact in a fast-growing organization.

As a ${jobData.title}, you will be responsible for driving innovation, collaborating with cross-functional teams, and delivering high-quality solutions that meet our business objectives. You'll have the opportunity to work with the latest technologies and methodologies while contributing to our mission of creating exceptional user experiences.

We offer a collaborative work environment, competitive compensation, and excellent growth opportunities. Join us in shaping the future of technology and making a meaningful difference in the industry.`;

    updateJobData('description', aiDescription);
    setIsGeneratingAI(false);
  };

  const generateAIResponsibilities = async () => {
    setIsGeneratingAI(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const aiResponsibilities = [
      `Lead and execute ${jobData.title.toLowerCase()} projects from conception to completion`,
      'Collaborate with cross-functional teams to define project requirements and deliverables',
      'Implement best practices and maintain high-quality standards',
      'Mentor junior team members and contribute to knowledge sharing',
      'Stay updated with industry trends and emerging technologies',
      'Participate in code reviews and technical discussions'
    ];
    
    updateJobData('responsibilities', aiResponsibilities);
    setIsGeneratingAI(false);
  };

  const generateAIRequirements = async () => {
    setIsGeneratingAI(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const aiRequirements = [
      `${jobData.experienceLevel === 'fresher' ? '0-1' : jobData.experienceLevel} years of experience in relevant field`,
      'Strong problem-solving and analytical skills',
      'Excellent communication and teamwork abilities',
      'Bachelor\'s degree in Computer Science or related field',
      'Experience with modern development tools and methodologies',
      'Passion for learning and staying updated with technology trends'
    ];
    
    updateJobData('requirements', aiRequirements);
    setIsGeneratingAI(false);
  };

  const handleJobTitleChange = (value: string) => {
    updateJobData('title', value);
    
    if (value.length >= 3) {
      const filtered = jobTitleSuggestions.filter(title =>
        title.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredJobTitles(filtered.slice(0, 8));
      setJobTitleSuggestionsVisible(true);
    } else {
      setFilteredJobTitles([]);
      setJobTitleSuggestionsVisible(false);
    }
  };

  const handleJobTitleSelect = (title: string) => {
    updateJobData('title', title);
    setJobTitleSuggestionsVisible(false);
    setFilteredJobTitles([]);
  };

  const handleJobTitleFocus = () => {
    if (jobData.title.length >= 3) {
      const filtered = jobTitleSuggestions.filter(title =>
        title.toLowerCase().includes(jobData.title.toLowerCase())
      );
      setFilteredJobTitles(filtered.slice(0, 8));
      setJobTitleSuggestionsVisible(true);
    }
  };

  const handleJobTitleBlur = () => {
    setTimeout(() => {
      setJobTitleSuggestionsVisible(false);
    }, 200);
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handlePublishJob = async () => {
    setIsPublishing(true);
    setToast(null);
    try {
      console.log('JobPostingBuilder: Starting job publication...');
      console.log('JobPostingBuilder: Current jobData:', jobData);
      
      // Send job data - employer information will be added by the backend from authenticated user
      const payload = {
        title: jobData.title || "Untitled Job",
        description: jobData.description || "No description",
        location: jobData.location || "Anywhere",
        job_type: (jobData.jobType || "full_time").replace(/-/g, "_"),
        work_mode: (jobData.workMode === 'onsite' ? 'on_site' : (jobData.workMode || "remote")),
        experience_level: jobData.experienceLevel || "Any",
        requirements: jobData.requirements,
        responsibilities: jobData.responsibilities,
        benefits: jobData.benefits,
        required_skills: jobData.skills,
        salary_min: jobData.salaryMin ? Number(jobData.salaryMin) : undefined,
        salary_max: jobData.salaryMax ? Number(jobData.salaryMax) : undefined,
        salary_currency: jobData.currency || "USD",
        // Optional company name - will use user's company name if not provided
        company_name: user?.company_name || user?.name
      };
      
      console.log('JobPostingBuilder: Payload to send:', payload);
      
      const newJob = await jobService.createJob(payload);
      console.log('JobPostingBuilder: Job created successfully:', newJob);
      
      setToast({ type: 'success', message: 'Job published successfully!' });
      if (onJobPosted) onJobPosted(newJob);
      setTimeout(() => {
        onBack();
      }, 1200);
    } catch (error: any) {
      console.error('JobPostingBuilder: Error publishing job:', error);
      console.error('JobPostingBuilder: Error details:', {
        message: error.message,
        response: error.response,
        stack: error.stack
      });
      
      const errorMessage = error.response?.data?.detail || error.message || 'Failed to publish job.';
      console.error('JobPostingBuilder: Setting error toast with message:', errorMessage);
      setToast({ type: 'error', message: errorMessage });
    } finally {
      setIsPublishing(false);
    }
  };

  // No validation - users can proceed with ANY data
  const isJobDetailsValid = () => {
    return true; // Always allow proceeding
  };

  // No validation - users can proceed with ANY data
  const isBasicInfoValid = () => {
    return true; // Always allow proceeding
  };

  // Add useEffect to load jobData from localStorage on mount
  useEffect(() => {
    const savedJobData = localStorage.getItem('jobPostingDraft');
    if (savedJobData) {
      setJobData(JSON.parse(savedJobData));
    }
  }, []);

  // Add useEffect to auto-save jobData to localStorage on change
  useEffect(() => {
    localStorage.setItem('jobPostingDraft', JSON.stringify(jobData));
  }, [jobData]);

  const renderBasicInfo = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative">
          <label className={`block text-sm font-medium mb-2 ${
            theme === 'light' ? 'text-gray-700' : 'text-gray-300'
          }`}>
            Job Title <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              ref={jobTitleInputRef}
              type="text"
              placeholder="Enter Job title"
              value={jobData.title}
              onChange={(e) => handleJobTitleChange(e.target.value)}
              onFocus={handleJobTitleFocus}
              onBlur={handleJobTitleBlur}
              className={`w-full px-4 py-2.5 pl-10 rounded-t-lg border focus:ring-2 focus:border-transparent ${
                theme === 'light'
                  ? 'border-gray-300 bg-white text-gray-900 focus:ring-blue-500'
                  : 'border-gray-600 bg-gray-800 text-white focus:ring-cyan-500'
              }`}
              autoComplete="off"
            />
            <Briefcase className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
              theme === 'light' ? 'text-gray-400' : 'text-gray-500'
            }`} />
            {/* Job Title Suggestions Dropdown */}
            {jobTitleSuggestionsVisible && filteredJobTitles.length > 0 && (
              <div className={`absolute z-50 w-full rounded-b-lg border-t-0 border shadow-lg top-full left-0 ${
                theme === 'light' 
                  ? 'bg-white border-gray-200 shadow-gray-200' 
                  : 'bg-gray-800 border-gray-600 shadow-gray-900'
              }`}
              style={{marginTop: 0}}>
                {filteredJobTitles.map((title, index) => (
                  <div
                    key={index}
                    onClick={() => handleJobTitleSelect(title)}
                    className={`px-4 py-2 cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors ${
                      theme === 'light' ? 'text-gray-700' : 'text-gray-300'
                    }`}
                  >
                    {title}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        <div className="relative">
          <label className={`block text-sm font-medium mb-2 ${
            theme === 'light' ? 'text-gray-700' : 'text-gray-300'
          }`}>
            Location <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              ref={locationInputRef}
              type="text"
              placeholder="Enter location"
              value={jobData.location}
              onChange={(e) => handleLocationChange(e.target.value)}
              onFocus={handleLocationFocus}
              onBlur={handleLocationBlur}
              className={`w-full px-4 py-2.5 pl-10 rounded-t-lg border focus:ring-2 focus:border-transparent ${
                theme === 'light'
                  ? 'border-gray-300 bg-white text-gray-900 focus:ring-blue-500'
                  : 'border-gray-600 bg-gray-800 text-white focus:ring-cyan-500'
              }`}
              autoComplete="off"
              required
            />
            <MapPin className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
              theme === 'light' ? 'text-gray-400' : 'text-gray-500'
            }`} />
            <ChevronDown className={`absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
              theme === 'light' ? 'text-gray-400' : 'text-gray-500'
            } ${locationSuggestionsVisible ? 'rotate-180' : ''}`} />
          </div>
          {/* Location Suggestions Dropdown */}
          {locationSuggestionsVisible && filteredLocations.length > 0 && (
            <div className={`absolute z-50 w-full rounded-b-lg border-t-0 border shadow-lg top-full left-0 ${
              theme === 'light' 
                ? 'bg-white border-gray-200 shadow-gray-200' 
                : 'bg-gray-800 border-gray-600 shadow-gray-900'
            }`}
            style={{marginTop: 0}}>
              {filteredLocations.map((location, index) => (
                <div
                  key={index}
                  onClick={() => handleLocationSelect(location)}
                  className={`px-4 py-2 cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors ${
                    theme === 'light' ? 'text-gray-700' : 'text-gray-300'
                  }`}
                >
                  {location}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={`block text-sm font-medium mb-2 ${
            theme === 'light' ? 'text-gray-700' : 'text-gray-300'
          }`}>
            Work Mode <span className="text-red-500">*</span>
          </label>
          <select
            className={`w-full px-4 py-2.5 rounded-lg border focus:ring-2 focus:border-transparent ${
              theme === 'light'
                ? 'border-gray-300 bg-white text-gray-900 focus:ring-blue-500'
                : 'border-gray-600 bg-gray-800 text-white focus:ring-cyan-500'
            }`}
            value={jobData.workMode}
            onChange={(e) => updateJobData('workMode', e.target.value)}
          >
            <option value="remote">Remote</option>
            <option value="onsite">On-site</option>
            <option value="hybrid">Hybrid</option>
          </select>
        </div>
      </div>

      {/* Required Skills Section */}
      <div className="space-y-4">
        <div>
          <label className={`block text-sm font-medium mb-3 ${
            theme === 'light' ? 'text-gray-700' : 'text-gray-300'
          }`}>
            What skills should the employee have?
          </label>
          <p className={`text-sm mb-4 ${
            theme === 'light' ? 'text-gray-600' : 'text-gray-400'
          }`}>
            Add the key skills and technologies required for this position
          </p>
          
          {jobData.skills.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {jobData.skills.map((skill, index) => (
                <Badge
                  key={index}
                  variant="primary"
                  className="flex items-center space-x-1 cursor-pointer"
                >
                  <span>{skill}</span>
                  <span className="ml-1 hover:bg-white/20 rounded-full" onClick={() => removeSkill(skill)} role="button" tabIndex={0} style={{cursor: 'pointer'}}>&times;</span>
                </Badge>
              ))}
            </div>
          )}
          
          <div className="flex space-x-2">
            <Input
              placeholder="Add a skill"
              value={skillInputValue}
              onChange={(e) => setSkillInputValue(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && skillInputValue.trim()) {
                  e.preventDefault();
                  addSkill(skillInputValue);
                  setSkillInputValue('');
                }
              }}
              fullWidth
            />
            <Button
              variant="outline"
              disabled={!skillInputValue.trim()}
              onClick={() => {
                if (skillInputValue.trim()) {
                  addSkill(skillInputValue);
                  setSkillInputValue('');
                }
              }}
              className={!skillInputValue.trim() ? 'opacity-50 cursor-not-allowed' : ''}
            >
              Add
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderJobDetails = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={`block text-sm font-medium mb-2 ${
            theme === 'light' ? 'text-gray-700' : 'text-gray-300'
          }`}>
            Job Type <span className="text-red-500">*</span>
          </label>
          <select
            required
            className={`w-full px-4 py-2.5 rounded-lg border focus:ring-2 focus:border-transparent ${
              theme === 'light'
                ? 'border-gray-300 bg-white text-gray-900 focus:ring-blue-500'
                : 'border-gray-600 bg-gray-800 text-white focus:ring-cyan-500'
            }`}
            value={jobData.jobType}
            onChange={(e) => updateJobData('jobType', e.target.value)}
          >
            <option value="">Select Job Type</option>
            <option value="full_time">Full Time</option>
            <option value="part_time">Part Time</option>
            <option value="contract">Contract</option>
            <option value="internship">Internship</option>
            <option value="freelance">Freelance</option>
          </select>
        </div>
        <div>
          <label className={`block text-sm font-medium mb-2 ${
            theme === 'light' ? 'text-gray-700' : 'text-gray-300'
          }`}>
            Experience Level <span className="text-red-500">*</span>
          </label>
          <select
            required
            className={`w-full px-4 py-2.5 rounded-lg border focus:ring-2 focus:border-transparent ${
              theme === 'light'
                ? 'border-gray-300 bg-white text-gray-900 focus:ring-blue-500'
                : 'border-gray-600 bg-gray-800 text-white focus:ring-cyan-500'
            }`}
            value={jobData.experienceLevel}
            onChange={(e) => updateJobData('experienceLevel', e.target.value)}
          >
            <option value="">Select Experience Level</option>
            <option value="fresher">Fresher (0-1 years)</option>
            <option value="1-2">1-2 years</option>
            <option value="3-5">3-5 years</option>
            <option value="5+">5+ years</option>
          </select>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <Input
            label="Min Salary"
            type="number"
            placeholder="50000"
            value={jobData.salaryMin}
            onChange={(e) => updateJobData('salaryMin', e.target.value)}
            required
            fullWidth
          />
          <Input
            label="Max Salary"
            type="number"
            placeholder="80000"
            value={jobData.salaryMax}
            onChange={(e) => updateJobData('salaryMax', e.target.value)}
            fullWidth
          />
          <div>
            <label className={`block text-sm font-medium mb-2 ${
              theme === 'light' ? 'text-gray-700' : 'text-gray-300'
            }`}>
              Currency <span className="text-red-500">*</span>
            </label>
            <select
              required
              className={`w-full px-4 py-2.5 rounded-lg border focus:ring-2 focus:border-transparent ${
                theme === 'light'
                  ? 'border-gray-300 bg-white text-gray-900 focus:ring-blue-500'
                  : 'border-gray-600 bg-gray-800 text-white focus:ring-cyan-500'
              }`}
              value={jobData.currency}
              onChange={(e) => updateJobData('currency', e.target.value)}
            >
              <option value="">Select Currency</option>
              <option value="INR">INR</option>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
            </select>
          </div>
        </div>
        <Input
          label="Application Deadline"
          type="date"
          value={jobData.applicationDeadline}
          onChange={(e) => updateJobData('applicationDeadline', e.target.value)}
          icon={<Clock className="w-4 h-4" />}
          fullWidth
        />
      </div>
    </div>
  );

  const renderRequirements = () => (
    <div className="space-y-6">
      {/* Skills */}
      <div>
        <label className={`block text-sm font-medium mb-3 ${
          theme === 'light' ? 'text-gray-700' : 'text-gray-300'
        }`}>
          Required Skills
        </label>
        
        {jobData.skills.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {jobData.skills.map((skill, index) => (
              <Badge
                key={index}
                variant="primary"
                className="flex items-center space-x-1 cursor-pointer"
              >
                <span>{skill}</span>
                <span className="ml-1 hover:bg-white/20 rounded-full" onClick={() => removeSkill(skill)} role="button" tabIndex={0} style={{cursor: 'pointer'}}>&times;</span>
              </Badge>
            ))}
          </div>
        )}
        
        <div className="flex space-x-2">
          <Input
            placeholder="Add a skill (e.g., React, Leadership)"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addSkill((e.target as HTMLInputElement).value);
                (e.target as HTMLInputElement).value = '';
              }
            }}
            fullWidth
          />
          <Button
            variant="outline"
            onClick={() => {
              const input = document.querySelector('input[placeholder*="Add a skill"]') as HTMLInputElement;
              if (input) {
                addSkill(input.value);
                input.value = '';
              }
            }}
          >
            Add
          </Button>
        </div>
      </div>

      {/* Requirements */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className={`block text-sm font-medium ${
            theme === 'light' ? 'text-gray-700' : 'text-gray-300'
          }`}>
            Requirements
          </label>
          <Button
            variant="outline"
            size="sm"
            onClick={generateAIRequirements}
            loading={isGeneratingAI}
            icon={<Sparkles className="w-4 h-4" />}
          >
            AI Generate
          </Button>
        </div>
        
        <div className="space-y-2">
          {jobData.requirements.map((requirement, index) => (
            <div key={index} className="flex items-center space-x-2">
              <Input
                placeholder="Enter a requirement..."
                value={requirement}
                onChange={(e) => updateListItem('requirements', index, e.target.value)}
                fullWidth
                autoComplete="off"
              />
              {jobData.requirements.length > 1 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeListItem('requirements', index)}
                >
                  ×
                </Button>
              )}
            </div>
          ))}
          <Button
            variant="outline"
            size="sm"
            onClick={() => addListItem('requirements')}
          >
            Add Requirement
          </Button>
        </div>
      </div>

      {/* Benefits */}
      <div>
        <label className={`block text-sm font-medium mb-3 ${
          theme === 'light' ? 'text-gray-700' : 'text-gray-300'
        }`}>
          Benefits & Perks
        </label>
        
        <div className="space-y-2">
          {jobData.benefits.map((benefit, index) => (
            <div key={index} className="flex items-center space-x-2">
              <Input
                placeholder="Enter a benefit..."
                value={benefit}
                onChange={(e) => updateListItem('benefits', index, e.target.value)}
                fullWidth
              />
              {jobData.benefits.length > 1 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeListItem('benefits', index)}
                >
                  ×
                </Button>
              )}
            </div>
          ))}
          <Button
            variant="outline"
            size="sm"
            onClick={() => addListItem('benefits')}
          >
            Add Benefit
          </Button>
        </div>
      </div>
    </div>
  );

  const renderDescription = () => (
    <div className="space-y-6">
      {/* Job Description */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className={`block text-sm font-medium ${
            theme === 'light' ? 'text-gray-700' : 'text-gray-300'
          }`}>
            Job Description
          </label>
          <Button
            variant="outline"
            size="sm"
            onClick={generateAIDescription}
            loading={isGeneratingAI}
            icon={<Sparkles className="w-4 h-4" />}
          >
            AI Generate
          </Button>
        </div>
        <textarea
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent ${
            theme === 'light'
              ? 'border-gray-300 bg-white text-gray-900 focus:ring-blue-500'
              : 'border-gray-600 bg-gray-800 text-white focus:ring-cyan-500'
          }`}
          rows={6}
          placeholder="Describe the role, company culture, and what makes this opportunity exciting..."
          value={jobData.description}
          onChange={(e) => updateJobData('description', e.target.value)}
        />
      </div>

      {/* Responsibilities */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className={`block text-sm font-medium ${
            theme === 'light' ? 'text-gray-700' : 'text-gray-300'
          }`}>
            Key Responsibilities
          </label>
          <Button
            variant="outline"
            size="sm"
            onClick={generateAIResponsibilities}
            loading={isGeneratingAI}
            icon={<Sparkles className="w-4 h-4" />}
          >
            AI Generate
          </Button>
        </div>
        
        <div className="space-y-2">
          {jobData.responsibilities.map((responsibility, index) => (
            <div key={index} className="flex items-center space-x-2">
              <Input
                placeholder="Enter a responsibility..."
                value={responsibility}
                onChange={(e) => updateListItem('responsibilities', index, e.target.value)}
                fullWidth
              />
              {jobData.responsibilities.length > 1 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeListItem('responsibilities', index)}
                >
                  ×
                </Button>
              )}
            </div>
          ))}
          <Button
            variant="outline"
            size="sm"
            onClick={() => addListItem('responsibilities')}
          >
            Add Responsibility
          </Button>
        </div>
      </div>
    </div>
  );

  const renderPreview = () => (
    <div className="space-y-6">
      <Card className="max-w-4xl mx-auto p-8">
        {/* Job Header */}
        <div className="border-b border-gray-200 dark:border-gray-700 pb-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className={`text-3xl font-bold mb-2 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                {jobData.title || 'Job Title'}
              </h1>
              <p className={`text-lg ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                {(user as any)?.company || 'Company Name'}{jobData.department ? ` • ${jobData.department}` : ''}
              </p>
            </div>
            <Badge variant="success" size="lg" gradient>
              Now Hiring
            </Badge>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-blue-500" />
              <span className="text-sm text-gray-700">{jobData.location || 'Location'}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Briefcase className="w-4 h-4 text-green-500" />
              <span className="text-sm text-gray-700 capitalize">{jobData.jobType.replace('_', ' ') || 'Job Type'}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4 text-purple-500" />
              <span className="text-sm text-gray-700 capitalize">{jobData.workMode || 'Work Mode'}</span>
            </div>
            <div className="flex items-center space-x-2">
              <GraduationCap className="w-4 h-4 text-yellow-500" />
              <span className="text-sm text-gray-700">{jobData.experienceLevel || 'Experience'}</span>
            </div>
          </div>
        </div>
        {/* Salary & Deadline */}
        <div className="flex flex-wrap gap-6 mb-6">
          <div className="flex items-center space-x-2">
            <DollarSign className="w-4 h-4 text-green-600" />
            <span className="text-sm text-gray-700">
              {jobData.salaryMin && jobData.salaryMax
                ? `${jobData.currency || 'INR'} ${jobData.salaryMin} - ${jobData.salaryMax}`
                : 'Salary not specified'}
            </span>
          </div>
          {jobData.applicationDeadline && (
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-blue-600" />
              <span className="text-sm text-gray-700">Apply by: {jobData.applicationDeadline}</span>
            </div>
          )}
        </div>
        {/* Description */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Job Description</h2>
          <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">{jobData.description || 'No description provided.'}</p>
        </div>
        {/* Responsibilities */}
        {jobData.responsibilities && jobData.responsibilities.filter(r => r.trim()).length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Key Responsibilities</h2>
            <ul className="list-disc pl-6 space-y-1">
              {jobData.responsibilities.filter(r => r.trim()).map((item, idx) => (
                <li key={idx} className="text-gray-700 dark:text-gray-300">{item}</li>
              ))}
            </ul>
          </div>
        )}
        {/* Requirements */}
        {jobData.requirements && jobData.requirements.filter(r => r.trim()).length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Requirements</h2>
            <ul className="list-disc pl-6 space-y-1">
              {jobData.requirements.filter(r => r.trim()).map((item, idx) => (
                <li key={idx} className="text-gray-700 dark:text-gray-300">{item}</li>
              ))}
            </ul>
          </div>
        )}
        {/* Skills */}
        {jobData.skills && jobData.skills.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Skills</h2>
            <div className="flex flex-wrap gap-2">
              {jobData.skills.map((skill, idx) => (
                <Badge key={idx} variant="primary">{skill}</Badge>
              ))}
            </div>
          </div>
        )}
        {/* Benefits */}
        {jobData.benefits && jobData.benefits.filter(b => b.trim()).length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Benefits & Perks</h2>
            <ul className="list-disc pl-6 space-y-1">
              {jobData.benefits.filter(b => b.trim()).map((item, idx) => (
                <li key={idx} className="text-gray-700 dark:text-gray-300">{item}</li>
              ))}
            </ul>
          </div>
        )}
      </Card>
    </div>
  );

  // Step rendering logic
  const stepComponents = [
    renderBasicInfo,
    renderJobDetails,
    renderRequirements,
    renderDescription,
    renderPreview
  ];

  return (
    <div className="max-w-4xl mx-auto py-8">
      {/* Stepper */}
      <div className="flex items-center justify-between mb-8">
        {steps.map((step, idx) => (
          <div key={step.id} className="flex-1 flex flex-col items-center">
            <div
              className={`w-10 h-10 flex items-center justify-center rounded-full border-2 transition-colors duration-200 ${
                idx === currentStep
                  ? 'border-blue-500 bg-blue-500 text-white'
                  : idx < currentStep
                  ? 'border-green-500 bg-green-500 text-white'
                  : 'border-gray-300 bg-white text-gray-400'
              }`}
            >
              <step.icon className="w-5 h-5" />
            </div>
            <span
              className={`mt-2 text-xs font-medium text-center ${
                idx === currentStep
                  ? 'text-blue-500'
                  : idx < currentStep
                  ? 'text-green-500'
                  : 'text-gray-400'
              }`}
            >
              {step.name}
            </span>
          </div>
        ))}
      </div>

      {/* Step Content */}
      <div className="mb-8">
        {stepComponents[currentStep]()}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between items-center">
        <Button
          variant="outline"
          onClick={currentStep === 0 ? onBack : prevStep}
          disabled={isPublishing}
        >
          {currentStep === 0 ? 'Cancel' : 'Back'}
        </Button>
        <div className="flex space-x-2">
          {currentStep < steps.length - 1 && (
            <Button
              variant="primary"
              onClick={nextStep}
              disabled={isPublishing}
            >
              Next
            </Button>
          )}
          {currentStep === steps.length - 1 && (
            <Button
              variant="success"
              onClick={handlePublishJob}
              loading={isPublishing}
            >
              Publish Job
            </Button>
          )}
        </div>
      </div>

      {/* Toast Notification */}
      {toast && (
        <Toast
          id="job-toast"
          type={toast.type}
          title={toast.type === 'success' ? 'Success' : 'Error'}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};    

