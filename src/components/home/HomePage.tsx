import React, { useState, useEffect } from 'react';
import { ArrowRight, CheckCircle, Sparkles, Linkedin, Instagram, Users, Shield, Globe, TrendingUp, Clock, Award, Star, Building, Briefcase, Heart, Target, ChevronRight, ExternalLink, Rocket, Play, Target as TargetIcon, Sparkles as SparklesIcon, X } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { VideoDemo } from './VideoDemo';
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
      icon: <TargetIcon className="w-7 h-7" />,
      title: 'AI-Powered Job Matching',
      description: 'Our advanced AI analyzes your skills, experience, and preferences to identify optimal job opportunities that align with your career objectives.',
      color: 'from-emerald-500 to-teal-500',
      benefits: ['Intelligent matching algorithms', 'Personalized recommendations', 'Skills-based filtering', 'Career insights'],
      highlight: 'Most Popular',
      cta: 'Try AI Matching'
    },
    {
      icon: <SparklesIcon className="w-7 h-7" />,
      title: 'Professional Resume Builder',
      description: 'Create industry-standard, ATS-optimized resumes with AI assistance, video introductions, and professional templates.',
      color: 'from-emerald-500 to-cyan-500',
      benefits: ['ATS optimization', 'Video introductions', 'Professional templates', 'AI feedback'],
      highlight: 'New Feature',
      cta: 'Build Resume'
    },
    {
      icon: <Globe className="w-7 h-7" />,
      title: 'Comprehensive Job Network',
      description: 'Access opportunities from established companies, including remote, hybrid, and on-site positions across diverse industries.',
      color: 'from-emerald-500 to-teal-500',
      benefits: ['Remote opportunities', 'Diverse positions', 'Established network', 'Professional focus'],
      highlight: 'Trending',
      cta: 'Explore Jobs'
    },
    {
      icon: <Shield className="w-7 h-7" />,
      title: 'Enterprise Security',
      description: 'Your professional data and job search activity are protected with enterprise-grade security and comprehensive privacy controls.',
      color: 'from-emerald-500 to-cyan-500',
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
      color: 'from-emerald-500 to-emerald-600'
    },
    { 
      icon: <Sparkles className="w-5 h-5" />, 
      title: 'Build Resume', 
      description: 'Create your perfect resume', 
      action: onResumeBuilder,
      color: 'from-emerald-500 to-cyan-600'
    },
    { 
      icon: <Heart className="w-5 h-5" />, 
      title: 'Get Matched', 
      description: 'Let AI help find opportunities', 
      action: onGetStarted,
      color: 'from-emerald-500 to-teal-600'
    },
    { 
      icon: <Rocket className="w-5 h-5" />, 
      title: 'Start Journey', 
      description: 'Begin your career search', 
      action: onGetStarted,
      color: 'from-emerald-500 to-emerald-600'
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
    <div className="min-h-screen bg-gray-900">
      {/* AI Fiesta Style Hero Section */}
      <section className="relative overflow-hidden py-12 sm:py-16 md:py-20 lg:py-28 xl:py-36 bg-gray-900 curved-start">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        
        {/* Curved Decorative Elements */}
        <div className="flowing-wave"></div>
        
        {/* Organic Curved Shapes */}
        <div className="organic-curve top-left"></div>
        <div className="organic-curve top-right"></div>
        <div className="organic-curve bottom-left"></div>
        
        {/* Floating Particles */}
        <div className="floating-particle"></div>
        <div className="floating-particle"></div>
        <div className="floating-particle"></div>
        <div className="floating-particle"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Curved Border Accent */}
          <div className="curved-border absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-1"></div>
          
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            
            {/* Left Content - Marketing */}
            <div className="space-y-8 text-left">
              {/* Badge */}
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-amber-900/20 border border-amber-700/30 text-amber-400 text-sm font-medium">
                <Star className="w-4 h-4 mr-2" />
                Built by Industry Experts
              </div>

              {/* Main Headline */}
              <div className="space-y-6" style={{ cursor: 'pointer', userSelect: 'none' }}>
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight text-white interactive-heading" style={{ cursor: 'pointer', userSelect: 'none' }}>
                  World's Most Powerful
                  <span className="block font-black bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
                    Job Platform
                </span>
                  <span className="block text-xl sm:text-2xl md:text-3xl lg:text-4xl text-gray-300">
                    One Subscription
                </span>
              </h1>
              
                <p className="text-lg sm:text-xl md:text-2xl leading-relaxed text-gray-300 max-w-2xl" style={{ cursor: 'pointer', userSelect: 'none' }}>
                  Stop juggling multiple job sites and subscriptions - Munus gives you access to all best-in-class AI-powered job matching, resume building, and career development tools for just $12/month.
              </p>
            </div>
              
              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  variant="primary" 
                  size="xl" 
                  onClick={handleGetStarted}
                  icon={<ArrowRight className="w-5 h-5" />}
                  iconPosition="right"
                  className="btn-get-started border-0 text-white font-bold px-8 py-4 text-lg shadow-2xl transition-all duration-300 hover:scale-105"
                  style={{ cursor: 'pointer', userSelect: 'none', zIndex: 10, position: 'relative' }}
                >
                  Get Started Now
                </Button>
                <Button 
                  variant="outline" 
                  size="xl" 
                  icon={<Play className="w-5 h-5" />}
                  className="border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 hover:border-emerald-400 px-8 py-4 text-lg font-semibold transition-all duration-300"
                  onClick={openVideoModal}
                  style={{ cursor: 'pointer', userSelect: 'none', zIndex: 10, position: 'relative' }}
                >
                  Watch Demo
                </Button>
              </div>
              
              {/* Subtitle */}
              <p className="text-sm text-gray-400">
                Experience smarter & more accurate job matching
              </p>
            </div>
            
                        {/* Right Content - Video Demo */}
            <div className="relative">
              <VideoDemo />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-800/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="secondary" size="lg" className="mb-6 bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
              <Award className="w-4 h-4 mr-2" />
              Why Choose Munus
            </Badge>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Advanced Features for
              <span className="block font-black bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
                Professional Growth
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Experience how our AI-powered platform enhances your job search, 
              career development, and professional networking capabilities.
            </p>
          </div>
          
          {/* Feature Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <Card 
                key={index} 
                hover 
                className="group cursor-pointer transform hover:scale-[1.02] transition-all duration-500 bg-gray-800/50 border border-gray-700/50 backdrop-blur-sm p-8 relative overflow-hidden"
              >
                {/* Highlight Badge */}
                <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold ${
                  feature.highlight === 'Most Popular' ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white' :
                  feature.highlight === 'New Feature' ? 'bg-gradient-to-r from-emerald-500 to-cyan-600 text-white' :
                  feature.highlight === 'Trending' ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white' :
                  'bg-gradient-to-r from-emerald-500 to-cyan-600 text-white'
                }`}>
                  {feature.highlight}
                </div>

                <div className="space-y-6">
                  {/* Header */}
                  <div className="space-y-4">
                    <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl group-hover:scale-110 transition-all duration-500 shadow-xl shadow-emerald-500/25`}>
                  <div className="text-white">
                    {feature.icon}
                  </div>
                </div>
                    
                    <div>
                      <h3 className="text-2xl font-bold mb-3 text-white group-hover:text-emerald-400 transition-colors">
                        {feature.title}
                      </h3>
                      <p className="text-lg leading-relaxed text-gray-300">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                  
                  {/* Benefits Grid */}
                  <div className="grid grid-cols-2 gap-3">
                    {feature.benefits.map((benefit, benefitIndex) => (
                      <div key={benefitIndex} className="flex items-center space-x-3 p-3 rounded-xl bg-gray-700/30 border border-gray-600/30">
                        <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${feature.color}`}></div>
                        <span className="text-sm font-medium text-gray-300">
                          {benefit}
                        </span>
                      </div>
                    ))}
                  </div>
                  
                  {/* CTA */}
                  <div className="pt-6 border-t border-gray-700/50">
                    <Button 
                      variant="primary" 
                      size="lg"
                      className={`w-full group-hover:scale-105 transition-all duration-300 text-lg font-semibold bg-gradient-to-r ${feature.color} hover:shadow-xl hover:shadow-emerald-500/25`}
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
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Actions Section */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Get Started in Minutes
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Choose your path and begin your professional journey with our powerful tools
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {quickActions.map((action, index) => (
              <Card 
                key={index}
                onClick={action.action}
                className="group cursor-pointer hover:scale-105 transition-all duration-300 p-6 text-center bg-gray-800/50 border border-gray-700/50 backdrop-blur-sm"
                hover
              >
                <div className={`w-16 h-16 bg-gradient-to-r ${action.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-lg shadow-emerald-500/25`}>
                  <div className="text-white">
                    {action.icon}
                  </div>
                </div>
                <h4 className="font-semibold text-lg mb-2 text-white">
                  {action.title}
                </h4>
                <p className="text-sm text-gray-400">
                  {action.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gray-800/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index} className="space-y-3">
                <div className="flex items-center justify-center space-x-3">
                  <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/30">
                    <div className="text-emerald-400">
                      {stat.icon}
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-white">
                    {stat.value}
                  </div>
                </div>
                <div className="text-lg font-medium text-gray-300">
                  {stat.label}
                </div>
                <div className="text-sm text-gray-400">
                  {stat.sublabel}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-4xl mx-auto text-center px-4">
          <Card className="p-12 bg-gray-800/50 border border-gray-700/50 backdrop-blur-sm">
            <div className="space-y-8">
              <h3 className="text-4xl font-bold text-white">
                  Ready to Experience the Difference?
                </h3>
              <p className="text-xl text-gray-300">
                  Join ambitious professionals who are building successful careers with Munus
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <Button 
                    variant="primary" 
                    size="xl"
                    onClick={handleGetStarted}
                    icon={<Rocket className="w-6 h-6" />}
                    iconPosition="right"
                    className="btn-get-started border-0 text-white font-bold px-12 py-6 text-xl shadow-2xl transition-all duration-300 hover:scale-105"
                  >
                    Start Free Today
                  </Button>
                  <Button 
                    variant="outline" 
                    size="xl"
                    onClick={openVideoModal}
                    icon={<Play className="w-5 h-5" />}
                    iconPosition="right"
                  className="border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 hover:border-emerald-400 px-12 py-6 text-xl font-semibold transition-all duration-300"
                >
                  Watch Demo
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Video Modal */}
      {showVideoModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="relative bg-gray-900 rounded-2xl p-6 max-w-4xl w-full">
              <button
                onClick={closeVideoModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
              </button>
            <div className="aspect-video bg-gray-800 rounded-xl flex items-center justify-center">
              <div className="text-center">
                <Play className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
                <p className="text-gray-300">Demo video will be displayed here</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};