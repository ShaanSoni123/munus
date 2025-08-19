import React from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize2, Settings } from 'lucide-react';

interface VideoDemoProps {
  className?: string;
}

export const VideoDemo: React.FC<VideoDemoProps> = ({ className = '' }) => {
  return (
    <div className={`relative bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 shadow-2xl shadow-emerald-500/10 ${className}`}>
      {/* Video Player Container */}
      <div className="relative aspect-video bg-gray-900 rounded-xl overflow-hidden">
        {/* Video Placeholder */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
          <div className="text-center">
            <div className="w-20 h-20 bg-emerald-500/20 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <Play className="w-10 h-10 text-emerald-400" />
            </div>
            <p className="text-gray-300 text-lg font-medium">Demo Video</p>
            <p className="text-gray-400 text-sm mt-2">Your video content will appear here</p>
          </div>
        </div>
        
        {/* Video Controls Overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button className="p-2 text-white hover:text-emerald-400 transition-colors">
                <Play className="w-5 h-5" />
              </button>
              <button className="p-2 text-white hover:text-emerald-400 transition-colors">
                <Pause className="w-5 h-5" />
              </button>
              <button className="p-2 text-white hover:text-emerald-400 transition-colors">
                <Volume2 className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex items-center space-x-2">
              <button className="p-2 text-white hover:text-emerald-400 transition-colors">
                <Settings className="w-4 h-4" />
              </button>
              <button className="p-2 text-white hover:text-emerald-400 transition-colors">
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="absolute bottom-16 left-4 right-4">
          <div className="w-full bg-gray-700/50 rounded-full h-1">
            <div className="bg-emerald-500 h-1 rounded-full w-1/3"></div>
          </div>
        </div>
      </div>
      
      {/* Video Info */}
      <div className="mt-4 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">Munus Platform Demo</h3>
          <span className="text-sm text-emerald-400 bg-emerald-500/20 px-2 py-1 rounded-full">Live Demo</span>
        </div>
        
        <p className="text-gray-300 text-sm leading-relaxed">
          Watch how our AI-powered job matching platform helps you find the perfect opportunities and build professional resumes.
        </p>
        
        <div className="flex items-center space-x-4 text-xs text-gray-400">
          <span>Duration: 2:45</span>
          <span>Views: 1.2K</span>
          <span>Quality: HD</span>
        </div>
      </div>
      
      {/* Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 via-teal-500/20 to-cyan-500/20 rounded-2xl blur-3xl -z-10"></div>
    </div>
  );
};
