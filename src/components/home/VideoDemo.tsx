import React from 'react';
import { Play } from 'lucide-react';

interface VideoDemoProps {
  className?: string;
}

export const VideoDemo: React.FC<VideoDemoProps> = ({ className = '' }) => {
  const videoId = 'R99z6mZvrTE';
  const embedUrl = `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&color=white`;
  const watchUrl = `https://youtu.be/${videoId}`;
  return (
    <div className={`relative bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 shadow-2xl shadow-emerald-500/10 ${className}`}>
      {/* Video Player Container */}
      <div className="relative aspect-video bg-black rounded-xl overflow-hidden">
        <iframe
          src={embedUrl}
          title="Munus Demo Video"
          className="absolute inset-0 h-full w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          loading="lazy"
        />
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
        
        <div className="flex items-center justify-between text-xs text-gray-400">
          <span>Quality: HD</span>
          <a href={watchUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300">
            <Play className="w-3.5 h-3.5" /> Watch on YouTube
          </a>
        </div>
      </div>
      
      {/* Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 via-teal-500/20 to-cyan-500/20 rounded-2xl blur-3xl -z-10"></div>
    </div>
  );
};
