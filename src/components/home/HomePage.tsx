import React from 'react';
import { ArrowRight, Play, Zap, CheckCircle, Sparkles, Linkedin, Instagram } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { useTheme } from '../../contexts/ThemeContext';

interface HomePageProps {
  onGetStarted: () => void;
  onSignIn: () => void;
  onFindJobs: () => void;
  onResumeBuilder: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onGetStarted, onSignIn, onFindJobs, onResumeBuilder }) => {
  const { theme } = useTheme();
  const [showVideoModal, setShowVideoModal] = React.useState(false);

  const features = [
    {
      icon: <Zap className="w-6 h-6" />,
      title: 'AI-Powered Matching',
      description: 'Our advanced AI matches you with the perfect job opportunities based on your skills and preferences.',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: 'Smart Resume Builder',
      description: 'Create stunning resumes with AI assistance, video introductions, and professional templates.',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: 'Global Opportunities',
      description: 'Access job opportunities from top companies worldwide, all in one place.',
      color: 'from-green-500 to-teal-500'
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: 'Secure & Private',
      description: 'Your data is protected with enterprise-grade security. Apply with confidence.',
      color: 'from-orange-500 to-red-500'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Enhanced Hero Section */}
      <section className={`relative overflow-hidden py-20 lg:py-32 ${
        theme === 'light' 
          ? 'hero-gradient bg-light-pattern' 
          : 'hero-gradient bg-dark-pattern'
      }`}>
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="text-center lg:text-left">
              <Badge variant="primary" size="lg" gradient className="mb-4 sm:mb-6 animate-bounce-gentle">
                <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                <span className="text-xs sm:text-sm">AI-Powered Job Portal</span>
              </Badge>
              
              <h1 className={`text-[1.8rem] sm:text-[2.2rem] lg:text-[3.5rem] font-bold mb-4 sm:mb-6 leading-tight ${
                theme === 'light' 
                  ? 'text-gray-900' 
                  : 'text-white'
              }`}>
                Discover
                <span className={`block font-black animate-pulse-slow ${
                  theme === 'light'
                    ? 'text-blue-800'
                    : 'bg-gradient-to-r from-blue-400 via-purple-500 to-cyan-400 bg-clip-text text-transparent'
                }`}>
                  Opportunities
                </span>
                <span className={theme === 'light' ? 'text-gray-800' : 'text-white'}>
                  That Truly Fit You
                </span>
              </h1>
              
              <p className={`text-base sm:text-lg lg:text-xl mb-6 sm:mb-8 leading-relaxed max-w-2xl mx-auto lg:mx-0 ${
                theme === 'light' 
                  ? 'text-gray-700' 
                  : 'text-gray-300'
              }`}>
                Munus revolutionizes job hunting with AI-powered matching, smart resume building, 
                and personalized career guidance. Join us to find your perfect career match.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6 sm:mb-8">
                <Button 
                  variant="primary" 
                  size="xl" 
                  onClick={onGetStarted}
                  icon={<ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />}
                  iconPosition="right"
                  className={`shadow-2xl hover-lift text-sm sm:text-base ${
                    theme === 'dark-neon' ? 'neon-glow' : 'soft-shadow'
                  }`}
                >
                  Get Started Free
                </Button>
                <Button 
                  variant="outline" 
                  size="xl" 
                  icon={<Play className="w-4 h-4 sm:w-5 sm:h-5" />}
                  className="group hover-lift text-sm sm:text-base"
                  onClick={() => setShowVideoModal(true)}
                >
                  <span className="group-hover:mr-1 transition-all">Watch Demo</span>
                </Button>
              </div>
              
              <div className={`flex flex-col sm:flex-row items-center justify-center lg:justify-start space-y-2 sm:space-y-0 sm:space-x-6 text-xs sm:text-sm ${
                theme === 'light' 
                  ? 'text-gray-600' 
                  : 'text-gray-400'
              }`}>
                <div className="flex items-center">
                  <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 mr-2" />
                  Free to use
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 mr-2" />
                  No spam
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 mr-2" />
                  Instant matching
                </div>
              </div>
            </div>
            
            <div className="relative mt-8 lg:mt-0">
              <div className="relative z-10">
                <Card className={`p-4 sm:p-6 lg:p-8 glass shadow-2xl animate-float ${
                  theme === 'dark-neon' ? 'neon-glow' : 'soft-shadow'
                }`}>
                  <div className="flex items-center space-x-3 sm:space-x-4 mb-4 sm:mb-6">
                    <div className={`w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center ${
                      theme === 'dark-neon' ? 'glow' : 'soft-shadow'
                    }`}>
                      <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                    <div>
                      <h3 className={`font-semibold text-sm sm:text-base ${
                        theme === 'light' ? 'text-gray-900' : 'text-white'
                      }`}>AI Job Match</h3>
                      <p className={`text-xs sm:text-sm ${
                        theme === 'light' ? 'text-gray-600' : 'text-gray-400'
                      }`}>Find your perfect fit</p>
                    </div>
                  </div>
                  <div className="space-y-2 sm:space-y-3">
                    <div className="flex justify-between items-center">
                      <span className={`text-xs sm:text-sm ${
                        theme === 'light' ? 'text-gray-700' : 'text-gray-400'
                      }`}>Start your journey</span>
                      <Badge variant="success" size="sm" gradient>Ready</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className={`text-xs sm:text-sm ${
                        theme === 'light' ? 'text-gray-700' : 'text-gray-400'
                      }`}>Build your profile</span>
                      <Badge variant="primary" size="sm" gradient>Next</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className={`text-xs sm:text-sm ${
                        theme === 'light' ? 'text-gray-700' : 'text-gray-400'
                      }`}>Find opportunities</span>
                      <Badge variant="secondary" size="sm" gradient>Soon</Badge>
                    </div>
                  </div>
                </Card>
              </div>
              
              {/* Enhanced Floating Elements */}
              <div className={`absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full opacity-20 animate-bounce-gentle ${
                theme === 'dark-neon' ? 'glow' : ''
              }`}></div>
              <div className={`absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full opacity-20 animate-float ${
                theme === 'dark-neon' ? 'glow' : ''
              }`}></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className={`py-12 sm:py-16 lg:py-20 ${
        theme === 'light' 
          ? 'section-gradient bg-light-pattern' 
          : 'bg-gradient-to-br from-gray-800 to-gray-900 bg-dark-pattern'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <Badge variant="secondary" size="lg" gradient className="mb-4">
              <span className="text-xs sm:text-sm">Why Choose Munus</span>
            </Badge>
            <h2 className={`text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold mb-4 sm:mb-6 ${
              theme === 'light' ? 'text-gray-900' : 'text-white'
            }`}>
              Powerful Features for
              <span className={`block font-black ${
                theme === 'light'
                  ? 'text-purple-800'
                  : 'bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent'
              }`}>
                Modern Job Seekers
              </span>
            </h2>
            <p className={`text-base sm:text-lg lg:text-xl max-w-3xl mx-auto ${
              theme === 'light' ? 'text-gray-700' : 'text-gray-300'
            }`}>
              Experience the future of job hunting with our cutting-edge AI technology and intuitive design.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <Card 
                key={index} 
                hover 
                className="group cursor-pointer transform hover:scale-105 transition-all duration-300 hover-lift"
                gradient
              >
                <div className={`inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br ${feature.color} rounded-xl mb-6 group-hover:scale-110 transition-transform shadow-lg ${
                  theme === 'dark-neon' ? 'glow group-hover:neon-glow' : 'soft-shadow'
                }`}>
                  <div className="text-white">
                    {feature.icon}
                  </div>
                </div>
                <h3 className={`text-xl font-bold mb-4 group-hover:text-blue-600 dark:group-hover:text-cyan-400 transition-colors ${
                  theme === 'light' ? 'text-gray-900' : 'text-white'
                }`}>
                  {feature.title}
                </h3>
                <p className={`leading-relaxed ${
                  theme === 'light' ? 'text-gray-700' : 'text-gray-300'
                }`}>
                  {feature.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className={`py-12 sm:py-16 lg:py-20 relative overflow-hidden ${
        theme === 'light' 
          ? 'bg-gradient-to-r from-blue-50 via-purple-50 to-cyan-50' 
          : 'bg-gradient-to-r from-blue-700 via-purple-700 to-blue-800'
      }`}>
        <div className={`absolute inset-0 ${
          theme === 'light' ? 'bg-white/50' : 'bg-black/20'
        }`}></div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className={`text-2xl sm:text-3xl lg:text-4xl xl:text-6xl font-bold mb-4 sm:mb-6 ${
            theme === 'light' 
              ? 'text-gray-900 drop-shadow-sm' 
              : 'text-white drop-shadow-lg'
          }`}>
            Ready to Find Your
            <span className="block">Dream Job?</span>
          </h2>
          <p className={`text-base sm:text-lg lg:text-xl mb-6 sm:mb-8 max-w-2xl mx-auto ${
            theme === 'light' 
              ? 'text-gray-700' 
              : 'text-white drop-shadow-md'
          }`}>
            Join Munus today and let our AI-powered platform connect you with opportunities 
            that match your skills and aspirations perfectly.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Button 
              variant="secondary" 
              size="xl"
              onClick={onGetStarted}
              className={`shadow-2xl hover-lift text-sm sm:text-base font-semibold ${
                theme === 'light'
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-white text-blue-700 hover:bg-gray-50'
              }`}
              icon={<ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />}
              iconPosition="right"
            >
              Start Your Journey
            </Button>
            <Button 
              variant="outline" 
              size="xl"
              className={`border-2 hover-lift text-sm sm:text-base font-semibold shadow-lg ${
                theme === 'light'
                  ? 'border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white'
                  : 'border-white text-white hover:bg-white hover:text-blue-700'
              }`}
            >
              Learn More
            </Button>
          </div>
          
          <div className={`mt-6 sm:mt-8 flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-6 text-xs sm:text-sm font-medium ${
            theme === 'light' ? 'text-gray-600' : 'text-white'
          }`}>
            <div className="flex items-center">
              <CheckCircle className={`w-3 h-3 sm:w-4 sm:h-4 mr-2 ${
                theme === 'light' ? 'text-green-600' : 'text-green-300'
              }`} />
              Free forever
            </div>
            <div className="flex items-center">
              <CheckCircle className={`w-3 h-3 sm:w-4 sm:h-4 mr-2 ${
                theme === 'light' ? 'text-green-600' : 'text-green-300'
              }`} />
              No credit card required
            </div>
            <div className="flex items-center">
              <CheckCircle className={`w-3 h-3 sm:w-4 sm:h-4 mr-2 ${
                theme === 'light' ? 'text-green-600' : 'text-green-300'
              }`} />
              Setup in 2 minutes
            </div>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section className={`py-6 sm:py-8 ${
        theme === 'light' 
          ? 'bg-gray-50' 
          : 'bg-gray-900'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between space-y-3 sm:space-y-0">
            <div className="flex items-center space-x-6">
              <h3 className={`text-base sm:text-lg font-medium ${
                theme === 'light' ? 'text-gray-700' : 'text-gray-300'
              }`}>
                About Us
              </h3>
              
              <div className="flex space-x-3">
                <a 
                  href="https://www.linkedin.com/in/shaan-soni/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={`inline-flex items-center justify-center w-7 h-7 transition-colors duration-200 ${
                    theme === 'light'
                      ? 'text-gray-500 hover:text-blue-600'
                      : 'text-gray-400 hover:text-blue-400'
                  }`}
                >
                  <Linkedin className="w-3.5 h-3.5" />
                </a>
                
                <a 
                  href="https://www.instagram.com/shaan.soni_1/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={`inline-flex items-center justify-center w-7 h-7 transition-colors duration-200 ${
                    theme === 'light'
                      ? 'text-gray-500 hover:text-pink-600'
                      : 'text-gray-400 hover:text-pink-400'
                  }`}
                >
                  <Instagram className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
            
            <div className={`text-sm ${
              theme === 'light' ? 'text-gray-500' : 'text-gray-400'
            }`}>
              © 2025 Munus. All rights reserved.
            </div>
          </div>
        </div>
      </section>

      {/* Video Modal */}
      {showVideoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setShowVideoModal(false)}
          ></div>
          
          {/* Modal Content */}
          <div className={`relative w-full max-w-4xl mx-auto rounded-lg overflow-hidden shadow-2xl ${
            theme === 'light' ? 'bg-white' : 'bg-gray-800'
          }`}>
            {/* Header */}
            <div className={`flex items-center justify-between p-4 border-b ${
              theme === 'light' ? 'border-gray-200' : 'border-gray-700'
            }`}>
              <h3 className={`text-lg font-semibold ${
                theme === 'light' ? 'text-gray-900' : 'text-white'
              }`}>
                Munus Platform Demo
              </h3>
              <button
                onClick={() => setShowVideoModal(false)}
                className={`p-2 rounded-full transition-colors ${
                  theme === 'light' 
                    ? 'text-gray-500 hover:text-gray-700 hover:bg-gray-100' 
                    : 'text-gray-400 hover:text-white hover:bg-gray-700'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* Video Player with Enhanced UI */}
            <div className="flex flex-col lg:flex-row">
              {/* Video Player */}
              <div className="relative w-full lg:w-2/3 aspect-video overflow-hidden">
                <video
                  className="w-full h-full object-cover"
                  controls
                  autoPlay
                  muted
                  poster="/videos/demo-poster.jpg"
                  style={{
                    objectPosition: 'center 20%'
                  }}
                >
                  <source src="/videos/demo.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
                
                {/* Video Overlay Elements */}
                <div className="absolute top-4 left-4">
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                    theme === 'light' 
                      ? 'bg-white/90 text-gray-800' 
                      : 'bg-black/70 text-white'
                  }`}>
                    🔴 LIVE Demo
                  </div>
                </div>
                
                <div className="absolute bottom-4 right-4">
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                    theme === 'light' 
                      ? 'bg-green-500 text-white' 
                      : 'bg-green-400 text-gray-900'
                  }`}>
                    HD Quality
                  </div>
                </div>
              </div>
              
              {/* Side Panel */}
              <div className={`w-full lg:w-1/3 p-6 ${
                theme === 'light' ? 'bg-gray-50' : 'bg-gray-700'
              }`}>
                <div className="space-y-6">
                  {/* Features List */}
                  <div>
                    <h4 className={`font-semibold mb-3 ${
                      theme === 'light' ? 'text-gray-900' : 'text-white'
                    }`}>
                      What You'll See:
                    </h4>
                    <div className="space-y-2">
                      {[
                        'AI-Powered Job Matching',
                        'Smart Resume Builder',
                        'Video Resume Creation',
                        'Real-time Notifications',
                        'Employer Dashboard',
                        'Advanced Analytics'
                      ].map((feature, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <div className={`w-2 h-2 rounded-full ${
                            theme === 'light' ? 'bg-green-500' : 'bg-green-400'
                          }`}></div>
                          <span className={`text-sm ${
                            theme === 'light' ? 'text-gray-700' : 'text-gray-300'
                          }`}>
                            {feature}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Quick Stats */}
                  <div className={`p-4 rounded-lg ${
                    theme === 'light' ? 'bg-white shadow-sm' : 'bg-gray-600'
                  }`}>
                    <h4 className={`font-semibold mb-3 ${
                      theme === 'light' ? 'text-gray-900' : 'text-white'
                    }`}>
                      Platform Stats:
                    </h4>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="text-center">
                        <div className={`text-lg font-bold ${
                          theme === 'light' ? 'text-blue-600' : 'text-blue-400'
                        }`}>10K+</div>
                        <div className={`text-xs ${
                          theme === 'light' ? 'text-gray-600' : 'text-gray-400'
                        }`}>Active Users</div>
                      </div>
                      <div className="text-center">
                        <div className={`text-lg font-bold ${
                          theme === 'light' ? 'text-green-600' : 'text-green-400'
                        }`}>95%</div>
                        <div className={`text-xs ${
                          theme === 'light' ? 'text-gray-600' : 'text-gray-400'
                        }`}>Success Rate</div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Call to Action */}
                  <div className={`p-4 rounded-lg ${
                    theme === 'light' 
                      ? 'bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200' 
                      : 'bg-gradient-to-r from-blue-900/50 to-purple-900/50 border border-blue-700'
                  }`}>
                    <h4 className={`font-semibold mb-2 ${
                      theme === 'light' ? 'text-gray-900' : 'text-white'
                    }`}>
                      Ready to Get Started?
                    </h4>
                    <p className={`text-sm mb-3 ${
                      theme === 'light' ? 'text-gray-600' : 'text-gray-300'
                    }`}>
                      Join thousands of users who found their dream jobs with Munus.
                    </p>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => {
                        setShowVideoModal(false);
                        onGetStarted();
                      }}
                      className="w-full"
                    >
                      Start Your Journey
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Footer */}
            <div className={`p-4 border-t ${
              theme === 'light' ? 'border-gray-200' : 'border-gray-700'
            }`}>
              <p className={`text-sm ${
                theme === 'light' ? 'text-gray-600' : 'text-gray-400'
              }`}>
                Watch how Munus revolutionizes job hunting with AI-powered matching and smart resume building.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};