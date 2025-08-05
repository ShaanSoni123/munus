import React, { useState } from 'react';
import { Search, MapPin, Filter, X, DollarSign, Clock, Briefcase, Monitor, Users, Languages, ChevronDown } from 'lucide-react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Card } from '../ui/Card';
import { useJobs } from '../../contexts/JobContext';
import { useTheme } from '../../contexts/ThemeContext';
import { jobService } from '../../services/jobService';

// Indian city suggestions for location autocomplete
const locationSuggestions = [
  'Mumbai, Maharashtra', 'Delhi, Delhi', 'Bangalore, Karnataka', 'Hyderabad, Telangana', 'Chennai, Tamil Nadu',
  'Kolkata, West Bengal', 'Pune, Maharashtra', 'Ahmedabad, Gujarat', 'Jaipur, Rajasthan', 'Surat, Gujarat',
  'Lucknow, Uttar Pradesh', 'Kanpur, Uttar Pradesh', 'Nagpur, Maharashtra', 'Indore, Madhya Pradesh',
  'Thane, Maharashtra', 'Bhopal, Madhya Pradesh', 'Visakhapatnam, Andhra Pradesh', 'Pimpri-Chinchwad, Maharashtra',
  'Patna, Bihar', 'Vadodara, Gujarat', 'Ghaziabad, Uttar Pradesh', 'Ludhiana, Punjab', 'Agra, Uttar Pradesh',
  'Nashik, Maharashtra', 'Faridabad, Haryana', 'Meerut, Uttar Pradesh', 'Rajkot, Gujarat', 'Kalyan-Dombivali, Maharashtra',
  'Vasai-Virar, Maharashtra', 'Varanasi, Uttar Pradesh', 'Srinagar, Jammu and Kashmir', 'Aurangabad, Maharashtra',
  'Dhanbad, Jharkhand', 'Amritsar, Punjab', 'Allahabad, Uttar Pradesh', 'Ranchi, Jharkhand', 'Howrah, West Bengal',
  'Coimbatore, Tamil Nadu', 'Jabalpur, Madhya Pradesh', 'Gwalior, Madhya Pradesh', 'Vijayawada, Andhra Pradesh',
  'Jodhpur, Rajasthan', 'Madurai, Tamil Nadu', 'Raipur, Chhattisgarh', 'Kota, Rajasthan', 'Guwahati, Assam',
  'Chandigarh, Chandigarh', 'Solapur, Maharashtra', 'Hubli-Dharwad, Karnataka', 'Bareilly, Uttar Pradesh',
  'Moradabad, Uttar Pradesh', 'Mysore, Karnataka', 'Gurgaon, Haryana', 'Aligarh, Uttar Pradesh', 'Jalandhar, Punjab',
  'Tiruchirappalli, Tamil Nadu', 'Bhubaneswar, Odisha', 'Salem, Tamil Nadu', 'Warangal, Telangana', 'Guntur, Andhra Pradesh',
  'Bhiwandi, Maharashtra', 'Saharanpur, Uttar Pradesh', 'Gorakhpur, Uttar Pradesh', 'Bikaner, Rajasthan', 'Amravati, Maharashtra',
  'Noida, Uttar Pradesh', 'Jamshedpur, Jharkhand', 'Bhilai, Chhattisgarh', 'Cuttack, Odisha', 'Firozabad, Uttar Pradesh',
  'Kochi, Kerala', 'Nellore, Andhra Pradesh', 'Bhavnagar, Gujarat', 'Dehradun, Uttarakhand', 'Durgapur, West Bengal',
  'Asansol, West Bengal', 'Rourkela, Odisha', 'Nanded, Maharashtra', 'Kolhapur, Maharashtra', 'Ajmer, Rajasthan',
  'Akola, Maharashtra', 'Gulbarga, Karnataka', 'Jamnagar, Gujarat', 'Ujjain, Madhya Pradesh', 'Loni, Uttar Pradesh',
  'Siliguri, West Bengal', 'Jhansi, Uttar Pradesh', 'Ulhasnagar, Maharashtra', 'Jammu, Jammu and Kashmir',
  'Sangli-Miraj & Kupwad, Maharashtra', 'Mangalore, Karnataka', 'Erode, Tamil Nadu', 'Belgaum, Karnataka',
  'Ambattur, Tamil Nadu', 'Tirunelveli, Tamil Nadu', 'Malegaon, Maharashtra', 'Gaya, Bihar', 'Jalgaon, Maharashtra',
  'Udaipur, Rajasthan', 'Maheshtala, West Bengal', 'Tiruppur, Tamil Nadu', 'Davanagere, Karnataka', 'Kozhikode, Kerala',
  'Akbarpur, Uttar Pradesh', 'Kurnool, Andhra Pradesh', 'Bokaro Steel City, Jharkhand', 'Rajpur Sonarpur, West Bengal',
  'South Dumdum, West Bengal', 'Bellary, Karnataka', 'Patiala, Punjab', 'Gopalpur, West Bengal', 'Agartala, Tripura',
  'Bhagalpur, Bihar', 'Muzaffarnagar, Uttar Pradesh', 'Bhatpara, West Bengal', 'Panihati, West Bengal', 'Latur, Maharashtra',
  'Dhule, Maharashtra', 'Rohtak, Haryana', 'Korba, Chhattisgarh', 'Bhilwara, Rajasthan', 'Berhampur, Odisha',
  'Muzaffarpur, Bihar', 'Ahmednagar, Maharashtra', 'Mathura, Uttar Pradesh', 'Kollam, Kerala', 'Avadi, Tamil Nadu',
  'Kadapa, Andhra Pradesh', 'Kamarhati, West Bengal', 'Bilaspur, Chhattisgarh', 'Shahjahanpur, Uttar Pradesh',
  'Satara, Maharashtra', 'Bijapur, Karnataka', 'Rampur, Uttar Pradesh', 'Shivamogga, Karnataka', 'Chandrapur, Maharashtra',
  'Junagadh, Gujarat', 'Thrissur, Kerala', 'Alwar, Rajasthan', 'Bardhaman, West Bengal', 'Kulti, West Bengal',
  'Kakinada, Andhra Pradesh', 'Nizamabad, Telangana', 'Parbhani, Maharashtra', 'Tumkur, Karnataka', 'Hisar, Haryana',
  'Ozhukarai, Puducherry', 'Bihar Sharif, Bihar', 'Panipat, Haryana', 'Darbhanga, Bihar', 'Bally, West Bengal',
  'Aizawl, Mizoram', 'Dewas, Madhya Pradesh', 'Ichalkaranji, Maharashtra', 'Karnal, Haryana', 'Bathinda, Punjab',
  'Jalna, Maharashtra', 'Eluru, Andhra Pradesh', 'Kirari Suleman Nagar, Delhi', 'Purnia, Bihar', 'Satna, Madhya Pradesh',
  'Mau, Uttar Pradesh', 'Sonipat, Haryana', 'Farrukhabad, Uttar Pradesh', 'Sagar, Madhya Pradesh', 'Rourkela, Odisha',
  'Durg, Chhattisgarh', 'Imphal, Manipur', 'Ratlam, Madhya Pradesh', 'Hapur, Uttar Pradesh', 'Arrah, Bihar',
  'Anantapur, Andhra Pradesh', 'Karimnagar, Telangana', 'Etawah, Uttar Pradesh', 'Ambernath, Maharashtra',
  'North Dumdum, West Bengal', 'Bharatpur, Rajasthan', 'Begusarai, Bihar', 'New Delhi, Delhi', 'Gandhidham, Gujarat',
  'Baranagar, West Bengal', 'Tiruvottiyur, Tamil Nadu', 'Puducherry, Puducherry', 'Sikar, Rajasthan',
  'Thoothukkudi, Tamil Nadu', 'Rewa, Madhya Pradesh', 'Mirzapur, Uttar Pradesh', 'Raichur, Karnataka',
  'Pali, Rajasthan', 'Ramagundam, Telangana', 'Haridwar, Uttarakhand', 'Vijayanagaram, Andhra Pradesh',
  'Katihar, Bihar', 'Nagercoil, Tamil Nadu', 'Sri Ganganagar, Rajasthan', 'Karawal Nagar, Delhi', 'Mango, Jharkhand',
  'Thanjavur, Tamil Nadu', 'Bulandshahr, Uttar Pradesh', 'Uluberia, West Bengal', 'Murwara, Madhya Pradesh',
  'Sambhal, Uttar Pradesh', 'Singrauli, Madhya Pradesh', 'Nadiad, Gujarat', 'Secunderabad, Telangana',
  'Naihati, West Bengal', 'Yamunanagar, Haryana', 'Bidhan Nagar, West Bengal', 'Pallavaram, Tamil Nadu',
  'Bidar, Karnataka', 'Munger, Bihar', 'Panchkula, Haryana', 'Burhanpur, Madhya Pradesh',
  'Raurkela Industrial Township, Odisha', 'Kharagpur, West Bengal', 'Dindigul, Tamil Nadu', 'Gandhinagar, Gujarat',
  'Hospet, Karnataka', 'Nangloi Jat, Delhi', 'Malda, West Bengal', 'Ongole, Andhra Pradesh', 'Deoghar, Jharkhand',
  'Chapra, Bihar', 'Haldia, West Bengal', 'Khandwa, Madhya Pradesh', 'Nandyal, Andhra Pradesh', 'Morena, Madhya Pradesh',
  'Amroha, Uttar Pradesh', 'Anand, Gujarat', 'Bhind, Madhya Pradesh', 'Bhalswa Jahangir Pur, Delhi',
  'Madhyamgram, West Bengal', 'Bhiwani, Haryana', 'Berhampore, West Bengal', 'Ambala, Haryana', 'Mori Gate, Delhi',
  'South Extension, Delhi', 'Vasant Vihar, Delhi', 'Dwarka, Delhi', 'Rohini, Delhi', 'Pitampura, Delhi',
  'Janakpuri, Delhi', 'Rajouri Garden, Delhi', 'Hauz Khas, Delhi', 'Green Park, Delhi', 'Saket, Delhi',
  'Malviya Nagar, Delhi', 'Kalkaji, Delhi', 'Greater Kailash, Delhi', 'Lajpat Nagar, Delhi', 'Defence Colony, Delhi',
  'Sundar Nagar, Delhi', 'Chanakyapuri, Delhi', 'Shahdara, Delhi', 'Seelampur, Delhi', 'Gandhi Nagar, Delhi',
  'Shastri Nagar, Delhi', 'Model Town, Delhi', 'Civil Lines, Delhi', 'Kingsway Camp, Delhi', 'Mukherjee Nagar, Delhi',
  'Kamla Nagar, Delhi', 'Hudson Lines, Delhi', 'Kashmere Gate, Delhi', 'Daryaganj, Delhi', 'Chandni Chowk, Delhi',
  'Sadar Bazar, Delhi', 'Paharganj, Delhi', 'Karol Bagh, Delhi', 'Rajinder Nagar, Delhi', 'Patel Nagar, Delhi',
  'Rajendra Place, Delhi', 'Naraina, Delhi', 'Kirti Nagar, Delhi', 'Moti Nagar, Delhi', 'Ramesh Nagar, Delhi',
  'Rajouri Garden, Delhi', 'Tagore Garden, Delhi', 'Tilak Nagar, Delhi', 'Subhash Nagar, Delhi', 'Tilak Vihar, Delhi',
  'Mundka, Delhi', 'Nangloi, Delhi', 'Sultanpuri, Delhi', 'Mangolpuri, Delhi', 'Rohini, Delhi', 'Shalimar Bagh, Delhi',
  'Ashok Vihar, Delhi', 'Wazirpur, Delhi', 'Adarsh Nagar, Delhi', 'Azadpur, Delhi', 'Model Town, Delhi',
  'Gulabi Bagh, Delhi', 'Sadar Bazar, Delhi', 'Pul Bangash, Delhi', 'Teliwara, Delhi', 'Sabzi Mandi, Delhi',
  'Roshanara Road, Delhi', 'Shakti Nagar, Delhi', 'Rohtas Nagar, Delhi', 'Seelampur, Delhi', 'Gandhi Nagar, Delhi',
  'Shahdara, Delhi', 'Vivek Vihar, Delhi', 'Dilshad Garden, Delhi', 'Geeta Colony, Delhi', 'Laxmi Nagar, Delhi',
  'Yamuna Vihar, Delhi', 'Babarpur, Delhi', 'Gokulpuri, Delhi', 'Maujpur, Delhi', 'Bhajanpura, Delhi',
  'Khajuri Khas, Delhi', 'Mustafabad, Delhi', 'Gokalpuri, Delhi', 'Johri Enclave, Delhi', 'Shahdara, Delhi',
  'Welcome, Delhi', 'Seelampur, Delhi', 'Jaffrabad, Delhi', 'Maujpur, Delhi', 'Gokulpuri, Delhi', 'Babarpur, Delhi',
  'Yamuna Vihar, Delhi', 'Laxmi Nagar, Delhi', 'Geeta Colony, Delhi', 'Dilshad Garden, Delhi', 'Vivek Vihar, Delhi',
  'Shahdara, Delhi', 'Gandhi Nagar, Delhi', 'Seelampur, Delhi', 'Rohtas Nagar, Delhi', 'Shakti Nagar, Delhi',
  'Roshanara Road, Delhi', 'Sabzi Mandi, Delhi', 'Teliwara, Delhi', 'Pul Bangash, Delhi', 'Sadar Bazar, Delhi',
  'Gulabi Bagh, Delhi', 'Model Town, Delhi', 'Azadpur, Delhi', 'Adarsh Nagar, Delhi', 'Wazirpur, Delhi',
  'Ashok Vihar, Delhi', 'Shalimar Bagh, Delhi', 'Rohini, Delhi', 'Mangolpuri, Delhi', 'Sultanpuri, Delhi',
  'Nangloi, Delhi', 'Mundka, Delhi', 'Tilak Vihar, Delhi', 'Subhash Nagar, Delhi', 'Tilak Nagar, Delhi',
  'Tagore Garden, Delhi', 'Rajouri Garden, Delhi', 'Ramesh Nagar, Delhi', 'Moti Nagar, Delhi', 'Kirti Nagar, Delhi',
  'Naraina, Delhi', 'Rajendra Place, Delhi', 'Patel Nagar, Delhi', 'Rajinder Nagar, Delhi', 'Karol Bagh, Delhi',
  'Paharganj, Delhi', 'Sadar Bazar, Delhi', 'Chandni Chowk, Delhi', 'Daryaganj, Delhi', 'Kashmere Gate, Delhi',
  'Hudson Lines, Delhi', 'Kamla Nagar, Delhi', 'Mukherjee Nagar, Delhi', 'Kingsway Camp, Delhi', 'Civil Lines, Delhi',
  'Model Town, Delhi', 'Shastri Nagar, Delhi', 'Gandhi Nagar, Delhi', 'Seelampur, Delhi', 'Shahdara, Delhi',
  'Sundar Nagar, Delhi', 'Defence Colony, Delhi', 'Lajpat Nagar, Delhi', 'Greater Kailash, Delhi', 'Kalkaji, Delhi',
  'Malviya Nagar, Delhi', 'Saket, Delhi', 'Green Park, Delhi', 'Hauz Khas, Delhi', 'Rajouri Garden, Delhi',
  'Janakpuri, Delhi', 'Pitampura, Delhi', 'Rohini, Delhi', 'Dwarka, Delhi', 'Vasant Vihar, Delhi',
  'South Extension, Delhi', 'Mori Gate, Delhi', 'Ambala, Haryana', 'Berhampore, West Bengal', 'Bhiwani, Haryana',
  'Madhyamgram, West Bengal', 'Bhalswa Jahangir Pur, Delhi', 'Bhind, Madhya Pradesh', 'Anand, Gujarat',
  'Amroha, Uttar Pradesh', 'Morena, Madhya Pradesh', 'Nandyal, Andhra Pradesh', 'Khandwa, Madhya Pradesh',
  'Haldia, West Bengal', 'Chapra, Bihar', 'Deoghar, Jharkhand', 'Ongole, Andhra Pradesh', 'Malda, West Bengal',
  'Nangloi Jat, Delhi', 'Hospet, Karnataka', 'Gandhinagar, Gujarat', 'Dindigul, Tamil Nadu', 'Kharagpur, West Bengal',
  'Raurkela Industrial Township, Odisha', 'Burhanpur, Madhya Pradesh', 'Panchkula, Haryana', 'Munger, Bihar',
  'Bidar, Karnataka', 'Pallavaram, Tamil Nadu', 'Bidhan Nagar, West Bengal', 'Yamunanagar, Haryana',
  'Naihati, West Bengal', 'Secunderabad, Telangana', 'Nadiad, Gujarat', 'Singrauli, Madhya Pradesh',
  'Sambhal, Uttar Pradesh', 'Murwara, Madhya Pradesh', 'Uluberia, West Bengal', 'Bulandshahr, Uttar Pradesh',
  'Thanjavur, Tamil Nadu', 'Mango, Jharkhand', 'Karawal Nagar, Delhi', 'Sri Ganganagar, Rajasthan',
  'Nagercoil, Tamil Nadu', 'Katihar, Bihar', 'Vijayanagaram, Andhra Pradesh', 'Haridwar, Uttarakhand',
  'Ramagundam, Telangana', 'Pali, Rajasthan', 'Raichur, Karnataka', 'Mirzapur, Uttar Pradesh', 'Rewa, Madhya Pradesh',
  'Thoothukkudi, Tamil Nadu', 'Sikar, Rajasthan', 'Puducherry, Puducherry', 'Tiruvottiyur, Tamil Nadu',
  'Baranagar, West Bengal', 'Gandhidham, Gujarat', 'New Delhi, Delhi', 'Begusarai, Bihar', 'Bharatpur, Rajasthan',
  'North Dumdum, West Bengal', 'Ambernath, Maharashtra', 'Etawah, Uttar Pradesh', 'Karimnagar, Telangana',
  'Anantapur, Andhra Pradesh', 'Arrah, Bihar', 'Hapur, Uttar Pradesh', 'Ratlam, Madhya Pradesh', 'Imphal, Manipur',
  'Durg, Chhattisgarh', 'Rourkela, Odisha', 'Sagar, Madhya Pradesh', 'Farrukhabad, Uttar Pradesh', 'Sonipat, Haryana',
  'Mau, Uttar Pradesh', 'Satna, Madhya Pradesh'
];

export const JobFilters: React.FC = () => {
  const { filters, updateFilters, clearFilters } = useJobs();
  const { theme } = useTheme();
  const [isExpanded, setIsExpanded] = useState(false);
  const [salaryRange, setSalaryRange] = useState({ min: 0, max: 200000 });
  const [locationInput, setLocationInput] = useState(filters.location || '');
  const [locationSuggestionsVisible, setLocationSuggestionsVisible] = useState(false);
  const [filteredLocations, setFilteredLocations] = useState<string[]>([]);
  const [searchInput, setSearchInput] = useState(filters.search || '');
  const [suggestions, setSuggestions] = useState<{ skills: string[]; jobs: string[]; candidates: string[] }>({ skills: [], jobs: [], candidates: [] });
  const [suggestionsVisible, setSuggestionsVisible] = useState(false);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);

  const jobTypes = [
    { value: 'full-time', label: 'Full-time' },
    { value: 'part-time', label: 'Part-time' },
    { value: 'internship', label: 'Internship' },
    { value: 'contract', label: 'Contract' },
    { value: 'freelance', label: 'Freelance' },
  ];

  const workModes = [
    { value: 'remote', label: 'Remote' },
    { value: 'onsite', label: 'On-site' },
    { value: 'hybrid', label: 'Hybrid' },
  ];

  const experienceLevels = [
    { value: 'fresher', label: 'Fresher' },
    { value: '1-2', label: '1-2 years' },
    { value: '3-5', label: '3-5 years' },
    { value: '5+', label: '5+ years' },
  ];

  const postedWithinOptions = [
    { value: 1, label: 'Last 24 hours' },
    { value: 7, label: 'Last 7 days' },
    { value: 30, label: 'Last 30 days' },
  ];

  const languages = [
    'English', 'Hindi', 'Tamil', 'Telugu', 'Bengali', 'Marathi', 'Gujarati', 'Kannada'
  ];

  const handleJobTypeChange = (type: string) => {
    const currentTypes = filters.jobType || [];
    const newTypes = currentTypes.includes(type as any)
      ? currentTypes.filter(t => t !== type)
      : [...currentTypes, type as any];
    updateFilters({ jobType: newTypes });
  };

  const handleWorkModeChange = (mode: string) => {
    const currentModes = filters.workMode || [];
    const newModes = currentModes.includes(mode as any)
      ? currentModes.filter(m => m !== mode)
      : [...currentModes, mode as any];
    updateFilters({ workMode: newModes });
  };

  const handleExperienceChange = (level: string) => {
    const currentLevels = filters.experience || [];
    const newLevels = currentLevels.includes(level as any)
      ? currentLevels.filter(l => l !== level)
      : [...currentLevels, level as any];
    updateFilters({ experience: newLevels });
  };

  const handleLanguageChange = (language: string) => {
    const currentLanguages = filters.languages || [];
    const newLanguages = currentLanguages.includes(language)
      ? currentLanguages.filter(l => l !== language)
      : [...currentLanguages, language];
    updateFilters({ languages: newLanguages });
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.search) count++;
    if (filters.location) count++;
    if (filters.jobType?.length) count += filters.jobType.length;
    if (filters.workMode?.length) count += filters.workMode.length;
    if (filters.experience?.length) count += filters.experience.length;
    if (filters.postedWithin) count++;
    if (filters.languages?.length) count += filters.languages.length;
    return count;
  };

  const handleLocationChange = (value: string) => {
    setLocationInput(value);
    updateFilters({ location: value });
    if (value.trim()) {
      const filtered = locationSuggestions.filter(city =>
        city.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredLocations(filtered.slice(0, 10));
      setLocationSuggestionsVisible(true);
    } else {
      setFilteredLocations([]);
      setLocationSuggestionsVisible(false);
    }
  };

  const handleLocationSelect = (city: string) => {
    setLocationInput(city);
    updateFilters({ location: city });
    setLocationSuggestionsVisible(false);
    setFilteredLocations([]);
  };

  const handleLocationFocus = () => {
    if (locationInput.trim()) {
      const filtered = locationSuggestions.filter(city =>
        city.toLowerCase().includes(locationInput.toLowerCase())
      );
      setFilteredLocations(filtered.slice(0, 10));
      setLocationSuggestionsVisible(true);
    }
  };

  const handleLocationBlur = () => {
    setTimeout(() => {
      setLocationSuggestionsVisible(false);
    }, 200);
  };

  const fetchSuggestions = async (query: string) => {
    if (!query.trim()) {
      setSuggestions({ skills: [], jobs: [], candidates: [] });
      setSuggestionsVisible(false);
      return;
    }
    setSuggestionsLoading(true);
    const result = await jobService.getSuggestions(query, 5);
    setSuggestions(result);
    setSuggestionsVisible(true);
    setSuggestionsLoading(false);
  };

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchInput(value);
    updateFilters({ search: value });
    fetchSuggestions(value);
  };

  const handleSuggestionClick = (value: string) => {
    setSearchInput(value);
    updateFilters({ search: value });
    setSuggestionsVisible(false);
  };

  const handleSearchInputFocus = () => {
    if (searchInput.trim()) fetchSuggestions(searchInput);
  };

  const handleSearchInputBlur = () => {
    setTimeout(() => setSuggestionsVisible(false), 200);
  };

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <Card padding="sm">
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
          <div className="flex-1 relative">
            <Input
              placeholder="Search jobs, companies, or skills..."
              value={searchInput}
              onChange={handleSearchInputChange}
              onFocus={handleSearchInputFocus}
              onBlur={handleSearchInputBlur}
              icon={<Search className="w-4 h-4" />}
              fullWidth
              autoComplete="off"
            />
            {/* Live Suggestions Dropdown */}
            {suggestionsVisible && (suggestions.skills.length > 0 || suggestions.jobs.length > 0 || suggestions.candidates.length > 0) && (
              <div className={`absolute z-50 w-full rounded-b-lg border-t-0 border shadow-lg top-full left-0 ${
                theme === 'light' 
                  ? 'bg-white border-gray-200 shadow-gray-200' 
                  : 'bg-gray-800 border-gray-600 shadow-gray-900'
              }`} style={{marginTop: 0}}>
                {suggestionsLoading && (
                  <div className="px-4 py-2 text-gray-500 dark:text-gray-400">Loading...</div>
                )}
                {suggestions.skills.length > 0 && (
                  <div>
                    <div className="px-4 py-1 text-xs font-semibold text-blue-500">Skills</div>
                    {suggestions.skills.map((skill, idx) => (
                      <div
                        key={"skill-" + idx}
                        onClick={() => handleSuggestionClick(skill)}
                        className={`px-4 py-2 cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}
                      >
                        {skill}
                      </div>
                    ))}
                  </div>
                )}
                {suggestions.jobs.length > 0 && (
                  <div>
                    <div className="px-4 py-1 text-xs font-semibold text-purple-500">Jobs</div>
                    {suggestions.jobs.map((job, idx) => (
                      <div
                        key={"job-" + idx}
                        onClick={() => handleSuggestionClick(job)}
                        className={`px-4 py-2 cursor-pointer hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}
                      >
                        {job}
                      </div>
                    ))}
                  </div>
                )}
                {suggestions.candidates.length > 0 && (
                  <div>
                    <div className="px-4 py-1 text-xs font-semibold text-green-500">Candidates</div>
                    {suggestions.candidates.map((candidate, idx) => (
                      <div
                        key={"candidate-" + idx}
                        onClick={() => handleSuggestionClick(candidate)}
                        className={`px-4 py-2 cursor-pointer hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}
                      >
                        {candidate}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
          <div className="flex-1 relative">
            <Input
              placeholder="Enter location"
              value={locationInput}
              onChange={(e) => handleLocationChange(e.target.value)}
              onFocus={handleLocationFocus}
              onBlur={handleLocationBlur}
              icon={<MapPin className="w-4 h-4" />}
              fullWidth
              autoComplete="off"
            />
            {/* Location Suggestions Dropdown */}
            {locationSuggestionsVisible && filteredLocations.length > 0 && (
              <div className={`absolute z-50 w-full rounded-b-lg border-t-0 border shadow-lg top-full left-0 ${
                theme === 'light' 
                  ? 'bg-white border-gray-200 shadow-gray-200' 
                  : 'bg-gray-800 border-gray-600 shadow-gray-900'
              }`}
              style={{marginTop: 0}}>
                {filteredLocations.map((city, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleLocationSelect(city)}
                    className={`px-4 py-2 cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors ${
                      theme === 'light' ? 'text-gray-700' : 'text-gray-300'
                    }`}
                  >
                    {city}
                  </div>
                ))}
              </div>
            )}
          </div>
          <Button
            variant="outline"
            onClick={() => setIsExpanded(!isExpanded)}
            icon={<Filter className="w-4 h-4" />}
            className="flex items-center space-x-2"
          >
            <span>Filters</span>
            {getActiveFiltersCount() > 0 && (
              <Badge variant="primary" size="sm">
                {getActiveFiltersCount()}
              </Badge>
            )}
            <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
          </Button>
        </div>
      </Card>

      {/* Expanded Filters */}
      {isExpanded && (
        <Card className="animate-slide-up">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Job Type */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3 flex items-center">
                <Briefcase className="w-4 h-4 mr-2" />
                Job Type
              </h3>
              <div className="space-y-2">
                {jobTypes.map((type) => (
                  <label key={type.value} className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      checked={filters.jobType?.includes(type.value as any) || false}
                      onChange={() => handleJobTypeChange(type.value)}
                    />
                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                      {type.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Work Mode */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3 flex items-center">
                <Monitor className="w-4 h-4 mr-2" />
                Work Mode
              </h3>
              <div className="space-y-2">
                {workModes.map((mode) => (
                  <label key={mode.value} className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      checked={filters.workMode?.includes(mode.value as any) || false}
                      onChange={() => handleWorkModeChange(mode.value)}
                    />
                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                      {mode.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Experience Level */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3 flex items-center">
                <Users className="w-4 h-4 mr-2" />
                Experience
              </h3>
              <div className="space-y-2">
                {experienceLevels.map((level) => (
                  <label key={level.value} className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      checked={filters.experience?.includes(level.value as any) || false}
                      onChange={() => handleExperienceChange(level.value)}
                    />
                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                      {level.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Posted Within */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3 flex items-center">
                <Clock className="w-4 h-4 mr-2" />
                Posted Within
              </h3>
              <div className="space-y-2">
                {postedWithinOptions.map((option) => (
                  <label key={option.value} className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="postedWithin"
                      className="border-gray-300 text-blue-600 focus:ring-blue-500"
                      checked={filters.postedWithin === option.value}
                      onChange={() => updateFilters({ postedWithin: option.value })}
                    />
                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                      {option.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Salary Range */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3 flex items-center">
                <DollarSign className="w-4 h-4 mr-2" />
                Salary Range (Monthly)
              </h3>
              <div className="space-y-3">
                <div className="flex space-x-2">
                  <Input
                    type="number"
                    placeholder="Min"
                    value={salaryRange.min || ''}
                    onChange={(e) => setSalaryRange(prev => ({ ...prev, min: parseInt(e.target.value) || 0 }))}
                  />
                  <Input
                    type="number"
                    placeholder="Max"
                    value={salaryRange.max || ''}
                    onChange={(e) => setSalaryRange(prev => ({ ...prev, max: parseInt(e.target.value) || 0 }))}
                  />
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  fullWidth
                  onClick={() => updateFilters({
                    salaryRange: {
                      min: salaryRange.min,
                      max: salaryRange.max,
                      currency: 'INR',
                      period: 'month'
                    }
                  })}
                >
                  Apply Range
                </Button>
              </div>
            </div>

            {/* Languages */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3 flex items-center">
                <Languages className="w-4 h-4 mr-2" />
                Languages
              </h3>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {languages.map((language) => (
                  <label key={language} className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      checked={filters.languages?.includes(language) || false}
                      onChange={() => handleLanguageChange(language)}
                    />
                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                      {language}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Filter Actions */}
          <div className="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
            <Button
              variant="ghost"
              onClick={clearFilters}
              icon={<X className="w-4 h-4" />}
            >
              Clear All Filters
            </Button>
            <Button
              variant="primary"
              onClick={() => setIsExpanded(false)}
            >
              Apply Filters
            </Button>
          </div>
        </Card>
      )}

      {/* Active Filters Display */}
      {getActiveFiltersCount() > 0 && (
        <div className="flex flex-wrap gap-2">
          {filters.search && (
            <Badge variant="primary" className="flex items-center">
              Search: {filters.search}
              <button
                onClick={() => updateFilters({ search: '' })}
                className="ml-1 hover:bg-white/20 rounded-full p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}
          {filters.location && (
            <Badge variant="primary" className="flex items-center">
              Location: {filters.location}
              <button
                onClick={() => updateFilters({ location: '' })}
                className="ml-1 hover:bg-white/20 rounded-full p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}
          {filters.jobType?.map((type) => (
            <Badge key={type} variant="secondary" className="flex items-center">
              {type.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              <button
                onClick={() => handleJobTypeChange(type)}
                className="ml-1 hover:bg-white/20 rounded-full p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
          {filters.workMode?.map((mode) => (
            <Badge key={mode} variant="success" className="flex items-center">
              {mode.replace(/\b\w/g, l => l.toUpperCase())}
              <button
                onClick={() => handleWorkModeChange(mode)}
                className="ml-1 hover:bg-white/20 rounded-full p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
          {filters.experience?.map((level) => (
            <Badge key={level} variant="warning" className="flex items-center">
              {level} years
              <button
                onClick={() => handleExperienceChange(level)}
                className="ml-1 hover:bg-white/20 rounded-full p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
};