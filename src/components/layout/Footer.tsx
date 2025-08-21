import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { Heart, Mail, Github, Linkedin, Twitter, Instagram } from 'lucide-react';

interface FooterProps {
  // Footer component no longer needs navigation props
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { theme } = useTheme();



  return (
    <footer className={`mt-auto border-t ${
      theme === 'light' 
        ? 'border-gray-200 bg-white' 
        : 'border-gray-700 bg-gray-900'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">M</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Munus
              </span>
            </div>
            <p className={`text-sm ${
              theme === 'light' ? 'text-gray-600' : 'text-gray-400'
            } mb-4 max-w-md`}>
              Connecting talented professionals with innovative companies through AI-powered job matching and comprehensive career development tools.
            </p>
            <div className="flex space-x-4">
              <a href="mailto:team@gomunus.com" className={`p-2 rounded-lg ${
                theme === 'light' 
                  ? 'text-gray-600 hover:text-blue-600 hover:bg-blue-50' 
                  : 'text-gray-400 hover:text-blue-400 hover:bg-blue-900/20'
              } transition-colors`}>
                <Mail className="w-5 h-5" />
              </a>
              <a href="#" className={`p-2 rounded-lg ${
                theme === 'light' 
                  ? 'text-gray-600 hover:text-blue-600 hover:bg-blue-50' 
                  : 'text-gray-400 hover:text-blue-400 hover:bg-blue-900/20'
              } transition-colors`}>
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className={`p-2 rounded-lg ${
                theme === 'light' 
                  ? 'text-gray-600 hover:text-blue-600 hover:bg-blue-50' 
                  : 'text-gray-400 hover:text-blue-400 hover:bg-blue-900/20'
              } transition-colors`}>
                <Twitter className="w-5 h-5" />
              </a>
              <a href="https://github.com/GoMunus" target="_blank" rel="noopener noreferrer" className={`p-2 rounded-lg ${
                theme === 'light' 
                  ? 'text-gray-600 hover:text-blue-600 hover:bg-blue-50' 
                  : 'text-gray-400 hover:text-blue-400 hover:bg-blue-900/20'
              } transition-colors`}>
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className={`p-2 rounded-lg ${
                theme === 'light' 
                  ? 'text-gray-600 hover:text-blue-600 hover:bg-blue-50' 
                  : 'text-gray-400 hover:text-blue-400 hover:bg-blue-900/20'
              } transition-colors`}>
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className={`font-semibold mb-4 ${
              theme === 'light' ? 'text-gray-900' : 'text-white'
            }`}>
              Quick Links
            </h3>
            <ul className="space-y-2">
                            <li>
                <a
                  href="https://gomunus.com/privacypolicy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`text-sm ${
                    theme === 'light' 
                      ? 'text-gray-600 hover:text-blue-600' 
                      : 'text-gray-400 hover:text-blue-400'
                  } transition-colors`}
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="https://gomunus.com/termsofservice"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`text-sm ${
                    theme === 'light' 
                      ? 'text-gray-600 hover:text-blue-600' 
                      : 'text-gray-400 hover:text-blue-400'
                } transition-colors`}
                >
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className={`text-sm ${
                  theme === 'light' 
                    ? 'text-gray-600 hover:text-blue-600' 
                    : 'text-gray-400 hover:text-blue-400'
                } transition-colors`}>
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className={`text-sm ${
                  theme === 'light' 
                    ? 'text-gray-600 hover:text-blue-600' 
                    : 'text-gray-400 hover:text-blue-400'
                } transition-colors`}>
                  Contact Support
                </a>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className={`font-semibold mb-4 ${
              theme === 'light' ? 'text-gray-900' : 'text-white'
            }`}>
              Company
            </h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className={`text-sm ${
                  theme === 'light' 
                    ? 'text-gray-600 hover:text-blue-600' 
                    : 'text-gray-400 hover:text-blue-400'
                } transition-colors`}>
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className={`text-sm ${
                  theme === 'light' 
                    ? 'text-gray-600 hover:text-blue-600' 
                    : 'text-gray-400 hover:text-blue-400'
                } transition-colors`}>
                  Careers
                </a>
              </li>
              <li>
                <a href="#" className={`text-sm ${
                  theme === 'light' 
                    ? 'text-gray-600 hover:text-blue-600' 
                    : 'text-gray-400 hover:text-blue-400'
                } transition-colors`}>
                  Press
                </a>
              </li>
              <li>
                <a href="#" className={`text-sm ${
                  theme === 'light' 
                    ? 'text-gray-600 hover:text-blue-600' 
                    : 'text-gray-400 hover:text-blue-400'
                } transition-colors`}>
                  Blog
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className={`border-t ${
          theme === 'light' ? 'border-gray-200' : 'border-gray-700'
        } mt-8 pt-8 flex flex-col md:flex-row justify-between items-center`}>
          <p className={`text-sm ${
            theme === 'light' ? 'text-gray-500' : 'text-gray-400'
          } mb-4 md:mb-0`}>
            © 2024 Munus Technologies Pvt. Ltd. All rights reserved.
          </p>
          <p className={`text-sm ${
            theme === 'light' ? 'text-gray-500' : 'text-gray-400'
          } flex items-center`}>
            Made with <Heart className="w-4 h-4 mx-1 text-red-500" /> in India
          </p>
        </div>
      </div>
    </footer>
  );
};
