import React, { useState, useEffect } from 'react';
import { ArrowRight, CheckCircle, Sparkles, Linkedin, Instagram, Users, Shield, Globe, TrendingUp, Clock, Award, Star, Building, Briefcase, Heart, Target, ChevronRight, ExternalLink, Rocket, Play } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { useTheme } from '../../contexts/ThemeContext';
import { track } from '@vercel/analytics';

interface HomePageProps {
  onGetStarted: () => void;
  onSignIn: () => void;
  onFindJobs: () => void;
  onResumeBuilder: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onGetStarted, onSignIn, onFindJobs, onResumeBuilder }) => {
  const { theme } = useTheme();
  const [showVideoModal, setShowVideoModal] = useState(false);

  // Track homepage visit
  useEffect(() => {
    track('homepage_visited', {
      user_type: 'visitor',
      theme: theme
    });
  }, [theme]);

  
  console.log('🏠 HomePage: Rendered with props', { onGetStarted, onSignIn, onFindJobs, onResumeBuilder });

  const features = [
    {
      icon: <Target className="w-7 h-7" />,
      title: 'AI-Powered Job Matching',
      description: 'Our advanced AI analyzes your skills, experience, and preferences to identify optimal job opportunities that align with your career objectives.',
      color: 'from-blue-500 to-cyan-500',
      benefits: ['Intelligent matching algorithms', 'Personalized recommendations', 'Skills-based filtering', 'Career insights'],
      highlight: 'Most Popular',
      cta: 'Try AI Matching'
    },
    {
      icon: <Sparkles className="w-7 h-7" />,
      title: 'Professional Resume Builder',
      description: 'Create industry-standard, ATS-optimized resumes with AI assistance, video introductions, and professional templates.',
      color: 'from-purple-500 to-pink-500',
      benefits: ['ATS optimization', 'Video introductions', 'Professional templates', 'AI feedback'],
      highlight: 'New Feature',
      cta: 'Build Resume'
    },
    {
      icon: <Globe className="w-7 h-7" />,
      title: 'Comprehensive Job Network',
      description: 'Access opportunities from established companies, including remote, hybrid, and on-site positions across diverse industries.',
      color: 'from-green-500 to-teal-500',
      benefits: ['Remote opportunities', 'Diverse positions', 'Established network', 'Professional focus'],
      highlight: 'Trending',
      cta: 'Explore Jobs'
    },
    {
      icon: <Shield className="w-7 h-7" />,
      title: 'Enterprise Security',
      description: 'Your professional data and job search activity are protected with enterprise-grade security and comprehensive privacy controls.',
      color: 'from-orange-500 to-red-500',
      benefits: ['Strong encryption', 'Privacy compliant', 'Secure browsing', 'Data protection'],
      highlight: 'Certified',
      cta: 'Learn More'
    }
  ];

  const stats = [
    { icon: <Users className="w-6 h-6" />, value: 'Growing', label: 'Community', sublabel: 'Join our job seekers' },
    { icon: <Building className="w-6 h-6" />, value: 'Multiple', label: 'Industries', sublabel: 'Opportunities everywhere' },
    { icon: <TrendingUp className="w-6 h-6" />, value: 'AI-Powered', label: 'Matching', sublabel: 'Smart job recommendations' },
    { icon: <Clock className="w-6 h-6" />, value: 'Fast', label: 'Setup', sublabel: 'Get started in minutes' }
  ];

  const quickActions = [
    { 
      icon: <Briefcase className="w-5 h-5" />, 
      title: 'Browse Jobs', 
      description: 'Explore available opportunities', 
      action: onFindJobs,
      color: 'from-blue-500 to-blue-600'
    },
    { 
      icon: <Sparkles className="w-5 h-5" />, 
      title: 'Build Resume', 
      description: 'Create your perfect resume', 
      action: onResumeBuilder,
      color: 'from-purple-500 to-purple-600'
    },
    { 
      icon: <Heart className="w-5 h-5" />, 
      title: 'Get Matched', 
      description: 'Let AI help find opportunities', 
      action: onGetStarted,
      color: 'from-pink-500 to-pink-600'
    },
    { 
      icon: <Rocket className="w-5 h-5" />, 
      title: 'Start Journey', 
      description: 'Begin your career search', 
      action: onGetStarted,
      color: 'from-green-500 to-green-600'
    }
  ];

  const inspirationalContent = [
    {
      title: 'Intelligent Job Matching',
      content: "Experience AI-powered job recommendations that understand your skills, preferences, and career objectives to suggest the most relevant opportunities.",
      icon: '🎯',
      highlight: 'AI-Powered'
    },
    {
      title: 'Career Advancement',
      content: "Build professional resumes with our intelligent builder, receive career guidance, and access tools designed to accelerate your professional development.",
      icon: '📈',
      highlight: 'Career Development'
    },
    {
      title: 'Professional Excellence',
      content: "Join a platform that connects ambitious professionals with established companies, creating valuable career opportunities for career-focused individuals.",
      icon: '🚀',
      highlight: 'Innovation First'
    }
  ];

  const handleGetStarted = () => {
    track('homepage_get_started_clicked', {
      section: 'hero',
      user_type: 'visitor'
    });
    onGetStarted();
  };

  const handleFindJobs = () => {
    track('homepage_find_jobs_clicked', {
      section: 'hero',
      user_type: 'visitor'
    });
    onFindJobs();
  };

  const handleResumeBuilder = () => {
    track('homepage_resume_builder_clicked', {
      section: 'hero',
      user_type: 'visitor'
    });
    onResumeBuilder();
  };

  const handleSignIn = () => {
    track('homepage_sign_in_clicked', {
      section: 'header',
      user_type: 'visitor'
    });
    onSignIn();
  };

  const openVideoModal = () => {
    track('homepage_video_modal_opened', {
      section: 'hero',
      user_type: 'visitor'
    });
    setShowVideoModal(true);
  };

  const closeVideoModal = () => {
    track('homepage_video_modal_closed', {
      section: 'hero',
      user_type: 'visitor'
    });
    setShowVideoModal(false);
  };

  return (
    <div className="min-h-screen">
      {/* Enhanced Hero Section */}
      <section className={`relative overflow-hidden py-12 sm:py-16 md:py-20 lg:py-28 xl:py-36 ${
        theme === 'light' 
          ? 'hero-gradient bg-light-pattern' 
          : 'hero-gradient bg-dark-pattern'
      }`}>
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        

        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-8">

              
            {/* Enhanced Headline */}
            <div className="space-y-4">
              <h1 className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight ${
                theme === 'light' 
                  ? 'text-gray-900' 
                  : 'text-white'
              }`}>
                Discover the Right
                <span className={`block font-black bg-gradient-to-r ${
                  theme === 'light'
                    ? 'from-blue-600 via-purple-600 to-cyan-600'
                    : 'from-blue-400 via-purple-500 to-cyan-400'
                } bg-clip-text text-transparent`}>
                  Opportunity
                </span>
                <span className={`block text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl ${
                  theme === 'light' ? 'text-gray-700' : 'text-gray-200'
                }`}>
                  That Fits You
                </span>
              </h1>
              
              <p className={`text-base sm:text-lg md:text-xl lg:text-2xl leading-relaxed max-w-4xl mx-auto px-4 ${
                theme === 'light' 
                  ? 'text-gray-600' 
                  : 'text-gray-300'
              }`}>
                Connect with opportunities that align with your skills and career goals. 
                Our AI-powered platform helps you find the perfect match for your professional journey.
              </p>
            </div>
              
            {/* Enhanced CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center px-4">
                <Button 
                  variant="primary" 
                  size="xl" 
                  onClick={handleGetStarted}
                  icon={<ArrowRight className="w-5 h-5 sm:w-6 sm:h-6" />}
                  iconPosition="right"
                  className={`shadow-2xl hover-lift text-base sm:text-lg md:text-xl font-bold px-6 sm:px-8 py-3 sm:py-4 w-full sm:w-auto ${
                    theme === 'dark-neon' ? 'neon-glow' : 'soft-shadow'
                  }`}
                >
                  Get Started
                </Button>
                <Button 
                  variant="outline" 
                  size="xl" 
                  icon={<Play className="w-4 h-4 sm:w-5 sm:h-5" />}
                  className="group hover-lift text-base sm:text-lg px-4 sm:px-6 py-3 sm:py-4 w-full sm:w-auto"
                  onClick={openVideoModal}
                >
                  <span className="group-hover:mr-1 transition-all">Watch Demo</span>
                </Button>
              </div>
              
            {/* Enhanced Trust Indicators */}
            <div className="pt-6 space-y-4 px-4">
              <div className={`grid grid-cols-2 sm:flex sm:flex-wrap items-center justify-center gap-3 sm:gap-4 md:gap-8 text-xs sm:text-sm font-medium ${
                theme === 'light' 
                  ? 'text-gray-600' 
                  : 'text-gray-400'
              }`}>
                <div className="flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mr-2" />
                  <span className="text-center">Professional Platform</span>
                </div>
                <div className="flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mr-2" />
                  <span className="text-center">AI-Powered Matching</span>
                </div>
                <div className="flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mr-2" />
                  <span className="text-center">Secure & Private</span>
                </div>
                <div className="flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mr-2" />
                  <span className="text-center">Industry Focused</span>
              </div>
            </div>
            
              {/* Quick Actions */}
              <div className="pt-8 px-4">
                <p className={`text-sm font-medium mb-4 text-center ${
                  theme === 'light' ? 'text-gray-700' : 'text-gray-300'
                }`}>
                  Quick Actions:
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto">
                  {quickActions.map((action, index) => (
                    <Card 
                      key={index}
                      onClick={action.action}
                      className="group cursor-pointer hover:scale-105 transition-all duration-300 p-3 sm:p-4 text-center"
                      hover
                    >
                      <div className={`w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r ${action.color} rounded-xl flex items-center justify-center mx-auto mb-2 sm:mb-3 group-hover:scale-110 transition-transform`}>
                        <div className="text-white">
                          {action.icon}
                        </div>
                    </div>
                      <h4 className={`font-semibold text-xs sm:text-sm mb-1 ${
                        theme === 'light' ? 'text-gray-900' : 'text-white'
                      }`}>
                        {action.title}
                      </h4>
                      <p className={`text-xs ${
                        theme === 'light' ? 'text-gray-600' : 'text-gray-400'
                      }`}>
                        {action.description}
                      </p>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
                    </div>
                  </div>
        
        {/* Live Stats Ticker */}
        <div className={`absolute bottom-0 left-0 right-0 py-3 sm:py-4 ${
          theme === 'light' 
            ? 'bg-white/80 backdrop-blur-sm border-t border-gray-200' 
            : 'bg-gray-900/80 backdrop-blur-sm border-t border-gray-700'
        }`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4 text-center">
              {stats.map((stat, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex items-center justify-center space-x-1 sm:space-x-2">
                    <div className={`p-1.5 sm:p-2 rounded-lg ${
                      theme === 'light' ? 'bg-blue-100' : 'bg-blue-900/30'
                    }`}>
                      <div className={theme === 'light' ? 'text-blue-600' : 'text-blue-400'}>
                        {stat.icon}
                    </div>
                    </div>
                    <div className={`text-lg sm:text-xl md:text-2xl font-bold ${
                      theme === 'light' ? 'text-gray-900' : 'text-white'
                    }`}>
                      {stat.value}
                    </div>
                  </div>
                  <div className={`text-xs sm:text-sm font-medium ${
                    theme === 'light' ? 'text-gray-700' : 'text-gray-300'
                  }`}>
                    {stat.label}
                  </div>
                  <div className={`text-xs ${
                    theme === 'light' ? 'text-gray-500' : 'text-gray-400'
                  }`}>
                    {stat.sublabel}
                  </div>
              </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Features Section */}
      <section className={`py-20 sm:py-24 lg:py-28 ${
        theme === 'light' 
          ? 'section-gradient bg-light-pattern' 
          : 'bg-gradient-to-br from-gray-800 to-gray-900 bg-dark-pattern'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16 lg:mb-20 px-4">
            <Badge variant="secondary" size="lg" gradient className="mb-4 sm:mb-6">
              <Award className="w-4 h-4 mr-2" />
              <span>Why Choose Munus</span>
            </Badge>
            <h2 className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-6 sm:mb-8 leading-tight ${
              theme === 'light' ? 'text-gray-900' : 'text-white'
            }`}>
              Advanced Features for
              <span className={`block font-black bg-gradient-to-r ${
                theme === 'light'
                  ? 'from-purple-600 via-blue-600 to-cyan-600'
                  : 'from-purple-400 via-blue-400 to-cyan-400'
              } bg-clip-text text-transparent`}>
                Professional Growth
              </span>
            </h2>
            <p className={`text-base sm:text-lg md:text-xl lg:text-2xl max-w-4xl mx-auto leading-relaxed ${
              theme === 'light' ? 'text-gray-600' : 'text-gray-300'
            }`}>
              Experience how our AI-powered platform enhances your job search, 
              career development, and professional networking capabilities.
            </p>
          </div>
          
          {/* Enhanced Feature Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 px-4">
            {features.map((feature, index) => (
              <Card 
                key={index} 
                hover 
                className="group cursor-pointer transform hover:scale-[1.02] transition-all duration-500 hover-lift p-6 sm:p-8 lg:p-10 relative overflow-hidden"
                gradient
              >
                {/* Highlight Badge */}
                <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold ${
                  feature.highlight === 'Most Popular' ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white' :
                  feature.highlight === 'New Feature' ? 'bg-gradient-to-r from-green-500 to-green-600 text-white' :
                  feature.highlight === 'Trending' ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white' :
                  'bg-gradient-to-r from-purple-500 to-purple-600 text-white'
                }`}>
                  {feature.highlight}
                </div>

                <div className="space-y-8">
                  {/* Header */}
                  <div className="space-y-4">
                    <div className={`inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br ${feature.color} rounded-3xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-xl ${
                  theme === 'dark-neon' ? 'glow group-hover:neon-glow' : 'soft-shadow'
                }`}>
                  <div className="text-white">
                    {feature.icon}
                  </div>
                </div>
                    
                    <div>
                      <h3 className={`text-xl sm:text-2xl lg:text-3xl font-bold mb-3 group-hover:text-blue-600 dark:group-hover:text-cyan-400 transition-colors ${
                        theme === 'light' ? 'text-gray-900' : 'text-white'
                      }`}>
                        {feature.title}
                      </h3>
                      <p className={`text-base sm:text-lg lg:text-xl leading-relaxed ${
                        theme === 'light' ? 'text-gray-600' : 'text-gray-300'
                      }`}>
                        {feature.description}
                      </p>
                    </div>
                  </div>
                  
                  {/* Enhanced Benefits Grid */}
                  <div className="grid grid-cols-2 gap-3">
                    {feature.benefits.map((benefit, benefitIndex) => (
                      <div key={benefitIndex} className={`flex items-center space-x-3 p-3 rounded-xl transition-all duration-300 group-hover:bg-white/10 ${
                        theme === 'light' ? 'bg-gray-50' : 'bg-gray-800/50'
                      }`}>
                        <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${feature.color}`}></div>
                        <span className={`text-sm font-medium ${
                          theme === 'light' ? 'text-gray-700' : 'text-gray-300'
                        }`}>
                          {benefit}
                        </span>
                      </div>
                    ))}
                  </div>
                  
                  {/* Enhanced CTA */}
                  <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                    <Button 
                      variant="primary" 
                      size="lg"
                      className={`w-full group-hover:scale-105 transition-all duration-300 text-lg font-semibold bg-gradient-to-r ${feature.color} hover:shadow-xl`}
                      onClick={() => {
                        if (feature.cta === 'Build Resume') handleResumeBuilder();
                        else if (feature.cta === 'Explore Jobs') handleFindJobs();
                        else handleGetStarted();
                      }}
                    >
                      {feature.cta}
                      <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </div>

                {/* Decorative Elements */}

              </Card>
            ))}
          </div>

          {/* Feature Comparison CTA */}
          <div className="mt-20 text-center">
            <Card className="p-8 lg:p-12 max-w-4xl mx-auto">
              <div className="space-y-6">
                <h3 className={`text-3xl font-bold ${
                  theme === 'light' ? 'text-gray-900' : 'text-white'
                }`}>
                  Ready to Experience the Difference?
                </h3>
                <p className={`text-xl ${
                  theme === 'light' ? 'text-gray-600' : 'text-gray-300'
                }`}>
                  Join ambitious professionals who are building successful careers with Munus
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <Button 
                    variant="primary" 
                    size="xl"
                    onClick={handleGetStarted}
                    icon={<Rocket className="w-6 h-6" />}
                    iconPosition="right"
                    className="shadow-2xl hover-lift text-xl font-bold px-12 py-6"
                  >
                    Start Free Today
                  </Button>
                  <Button 
                    variant="outline" 
                    size="xl"
                    onClick={openVideoModal}
                    icon={<Play className="w-5 h-5" />}
                    iconPosition="right"
                    className="text-lg px-8 py-6"
                  >
                    See How It Works
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Enhanced Platform Features Section */}
      <section className={`py-20 sm:py-24 lg:py-28 relative ${
        theme === 'light' 
          ? 'bg-gradient-to-br from-blue-50 via-white to-purple-50' 
          : 'bg-gradient-to-br from-gray-900 via-gray-800 to-blue-900'
      }`}>
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <Badge variant="success" size="lg" gradient className="mb-6">
              <Heart className="w-4 h-4 mr-2" />
              <span>Platform Highlights</span>
            </Badge>
            <h2 className={`text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold mb-8 leading-tight ${
              theme === 'light' ? 'text-gray-900' : 'text-white'
            }`}>
              Designed for
              <span className={`block font-black bg-gradient-to-r ${
                theme === 'light'
                  ? 'from-green-600 via-blue-600 to-purple-600'
                  : 'from-green-400 via-blue-400 to-purple-400'
              } bg-clip-text text-transparent`}>
                Career Success
              </span>
            </h2>
            <p className={`text-xl sm:text-2xl lg:text-3xl max-w-4xl mx-auto leading-relaxed ${
              theme === 'light' ? 'text-gray-600' : 'text-gray-300'
            }`}>
              See how Munus enables professionals to advance their careers and connect with relevant opportunities
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            {inspirationalContent.map((content, index) => (
              <Card 
                key={index} 
                className="group hover:scale-105 transition-all duration-500 p-8 text-center relative overflow-hidden"
                hover
              >
                {/* Feature Badge */}
                <div className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                  {content.highlight}
                </div>

                <div className="space-y-6">
                  {/* Icon */}
                  <div className="relative">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto text-4xl group-hover:scale-110 transition-transform duration-500">
                      {content.icon}
                    </div>
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-white" />
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className={`text-2xl font-bold ${
                    theme === 'light' ? 'text-gray-900' : 'text-white'
                  }`}>
                    {content.title}
                  </h3>

                  {/* Content */}
                  <p className={`text-lg lg:text-xl leading-relaxed ${
                    theme === 'light' ? 'text-gray-700' : 'text-gray-300'
                  }`}>
                    {content.content}
                  </p>

                  {/* Action */}
                  <Button 
                    variant="outline" 
                    size="md"
                    onClick={handleGetStarted}
                    className="group-hover:bg-blue-600 group-hover:text-white transition-colors"
                  >
                    Learn More
                    <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>


              </Card>
            ))}
          </div>

          {/* Social Proof CTA */}
          <div className="mt-20 text-center">
            <Card className="p-8 lg:p-12 max-w-4xl mx-auto relative overflow-hidden">
              <div className="relative z-10 space-y-6">
                <div className="flex items-center justify-center space-x-4 mb-4">
                  <div className="flex -space-x-2">
                    {['👨‍💻', '👩‍💼', '👨‍🎨', '👩‍🔬', '👨‍🏫'].map((avatar, i) => (
                      <div key={i} className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-lg border-2 border-white">
                        {avatar}
                      </div>
                    ))}
                  </div>
                  <div className={`text-sm font-medium ${
                    theme === 'light' ? 'text-gray-600' : 'text-gray-400'
                  }`}>
                    Growing community
                  </div>
                </div>
                
                <h3 className={`text-3xl lg:text-4xl font-bold ${
                  theme === 'light' ? 'text-gray-900' : 'text-white'
                }`}>
                  Your Success Story Starts Here
                </h3>
                <p className={`text-xl ${
                  theme === 'light' ? 'text-gray-600' : 'text-gray-300'
                }`}>
                  Join professionals who are building successful careers with Munus. 
                  Your next opportunity is just one click away!
                </p>
                <Button 
                  variant="primary" 
                  size="xl"
                  onClick={handleGetStarted}
                  icon={<Rocket className="w-6 h-6" />}
                  iconPosition="right"
                  className="shadow-2xl hover-lift text-xl font-bold px-12 py-6"
                >
                  Start Your Journey
                </Button>
              </div>
              

            </Card>
          </div>
        </div>
      </section>

      {/* Enhanced Footer Section */}
      <section className={`py-16 sm:py-20 lg:py-24 relative overflow-hidden ${
        theme === 'light' 
          ? 'bg-black' 
          : 'bg-black'
      }`}>
        {/* Background Pattern Overlay */}
        <div className="absolute inset-0 bg-black/20"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            
            {/* Left Column - Company Info */}
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-xl">M</span>
                </div>
                <span className="text-2xl font-bold text-white drop-shadow-sm">Munus</span>
              </div>
              <p className="text-base leading-relaxed text-white font-medium drop-shadow-sm">
                Transform your career with our AI-powered job matching platform. 
                Connect with opportunities that align with your skills and professional goals.
              </p>
              
              {/* Social Media Icons */}
              <div className="flex space-x-4">
                <a href="#" className="w-8 h-8 rounded-full bg-white/20 hover:bg-blue-600 flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-md">
                  <span className="text-white text-sm font-bold">f</span>
                </a>
                <a href="#" className="w-8 h-8 rounded-full bg-white/20 hover:bg-pink-600 flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-md">
                  <span className="text-white text-sm font-bold">📷</span>
                </a>
                <a href="#" className="w-8 h-8 rounded-full bg-white/20 hover:bg-gray-600 flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-md">
                  <span className="text-white text-sm font-bold">𝕏</span>
                </a>
                <a href="#" className="w-8 h-8 rounded-full bg-white/20 hover:bg-blue-700 flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-md">
                  <span className="text-white text-sm font-bold">in</span>
                </a>
                <a href="#" className="w-8 h-8 rounded-full bg-white/20 hover:bg-indigo-600 flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-md">
                  <span className="text-white text-sm font-bold">🎮</span>
                </a>
                <a href="#" className="w-8 h-8 rounded-full bg-white/20 hover:bg-red-600 flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-md">
                  <span className="text-white text-sm font-bold">▶</span>
                </a>
                <a href="#" className="w-8 h-8 rounded-full bg-white/20 hover:bg-green-600 flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-md">
                  <span className="text-white text-sm font-bold">💬</span>
                </a>
                <a href="#" className="w-8 h-8 rounded-full bg-white/20 hover:bg-green-500 flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-md">
                  <span className="text-white text-sm font-bold">LINE</span>
                </a>
              </div>
              
              {/* Navigation Links */}
              <div className="flex space-x-6 text-sm">
                <a href="#" className="text-white font-semibold hover:text-blue-300 transition-colors duration-300 hover:underline">
                  Our Blog
                </a>
                <a href="#" className="text-white font-semibold hover:text-blue-300 transition-colors duration-300 hover:underline">
                  Privacy Policy
                </a>
                <a href="#" className="text-white font-semibold hover:text-blue-300 transition-colors duration-300 hover:underline">
                  Terms of Service
                </a>
              </div>
            </div>
            
            {/* Middle Column - Contact Info */}
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-white drop-shadow-sm">Contact with us:</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-5 h-5 bg-blue-500 rounded-full shadow-sm"></div>
                  <span className="text-sm text-white font-medium">
                    Contact us: <a href="mailto:team@gomunus.com" className="text-blue-300 hover:text-blue-200 hover:underline transition-colors duration-300 font-semibold">team@gomunus.com</a>
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-5 h-5 bg-purple-500 rounded-full shadow-sm"></div>
                  <span className="text-sm text-white font-medium">
                    Phone: <a href="tel:+918849894779" className="text-blue-300 hover:text-blue-200 hover:underline transition-colors duration-300 font-semibold">+91 8849894779</a>
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-5 h-5 bg-green-500 rounded-full shadow-sm"></div>
                  <span className="text-sm text-white font-medium">
                    Phone: <a href="tel:+919825790554" className="text-blue-300 hover:text-blue-200 hover:underline transition-colors duration-300 font-semibold">+91 98257 90554</a>
                  </span>
                </div>
              </div>
            </div>
            
            {/* Right Column - Corporate Address */}
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-white drop-shadow-sm">Corporate Address:</h3>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-5 h-5 bg-red-500 rounded-full mt-1 shadow-sm"></div>
                  <div>
                    <p className="text-sm font-semibold text-white">India: Mumbai</p>
                    <p className="text-sm font-medium text-white">Maharashtra, India</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-5 h-5 bg-yellow-500 rounded-full mt-1 shadow-sm"></div>
                  <div>
                    <p className="text-sm font-semibold text-white">India: Delhi NCR</p>
                    <p className="text-sm font-medium text-white">Noida, Uttar Pradesh</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Bottom Section */}
          <div className="mt-12 pt-8 border-t border-white/30 text-center">
            <p className="text-sm text-white font-medium drop-shadow-sm">
              © 2025 Munus. All rights reserved. | Powered by AI Innovation
            </p>
          </div>
        </div>
      </section>



      {/* Video Modal */}
      {showVideoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-sm">
          <div className={`relative w-full max-w-4xl mx-auto rounded-lg overflow-hidden shadow-2xl ${
            theme === 'light' ? 'bg-white' : 'bg-gray-800'
          }`}>
            {/* Header */}
            <div className={`flex items-center justify-between p-3 sm:p-4 border-b ${
              theme === 'light' ? 'border-gray-200' : 'border-gray-700'
            }`}>
              <h3 className={`text-base sm:text-lg font-semibold ${
                theme === 'light' ? 'text-gray-900' : 'text-white'
              }`}>
                Munus Platform Demo
              </h3>
              <button
                onClick={closeVideoModal}
                className={`p-1.5 sm:p-2 rounded-full transition-colors ${
                  theme === 'light' 
                    ? 'text-gray-500 hover:text-gray-700 hover:bg-gray-100' 
                    : 'text-gray-400 hover:text-white hover:bg-gray-700'
                }`}
                aria-label="Close modal"
              >
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* Video Player */}
            <div className="relative w-full aspect-video">
              <iframe
                src="https://www.youtube.com/embed/R99z6mZvrTE?autoplay=1&rel=0&modestbranding=1"
                title="Munus Platform Demo"
                className="w-full h-full"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
            
            {/* Footer */}
            <div className={`p-3 sm:p-4 border-t ${
              theme === 'light' ? 'border-gray-200' : 'border-gray-700'
            }`}>
              <div className="text-center">
                <p className={`text-xs sm:text-sm ${
                  theme === 'light' ? 'text-gray-600' : 'text-gray-400'
                }`}>
                  Ready to experience Munus for yourself?
                </p>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    closeVideoModal();
                    handleGetStarted();
                  }}
                  className="mt-2 sm:mt-3 text-xs sm:text-sm"
                >
                  Get Started Now
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
      
    </div>
  );
};