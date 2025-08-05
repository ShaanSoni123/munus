import React, { useState, useRef } from 'react';
import { Video, Play, Pause, Upload, Download, Trash2 } from 'lucide-react';
import { Button } from '../../ui/Button';
import { Card } from '../../ui/Card';

interface VideoResumeStepProps {
  videoUrl?: string;
  onVideoChange: (url: string) => void;
}

export const VideoResumeStep: React.FC<VideoResumeStepProps> = ({
  videoUrl,
  onVideoChange,
}) => {
  const [isRecordingVideo, setIsRecordingVideo] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startVideoRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      const chunks: BlobPart[] = [];
      mediaRecorder.ondataavailable = (event) => {
        chunks.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        onVideoChange(url);
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
        if (videoRef.current) {
          videoRef.current.srcObject = null;
        }
      };

      mediaRecorder.start();
      setIsRecordingVideo(true);
      startTimer();
    } catch (error) {
      console.error('Error starting video recording:', error);
    }
  };

  const stopVideoRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
    setIsRecordingVideo(false);
    setRecordingTime(0);
  };



  const startTimer = () => {
    const interval = setInterval(() => {
      setRecordingTime(prev => {
        if (prev >= 30) { // 30 second limit
          if (isRecordingVideo) stopVideoRecording();
          clearInterval(interval);
          return 0;
        }
        return prev + 1;
      });
    }, 1000);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Video Resume
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Stand out with a personal video introduction (30 seconds max)
        </p>
      </div>

      {/* Video Resume Section */}
      <Card>
        <div className="flex items-center space-x-2 mb-4">
          <Video className="w-5 h-5 text-blue-600" />
          <h4 className="text-md font-medium text-gray-900 dark:text-white">
            Video Resume
          </h4>
        </div>

        {isRecordingVideo ? (
          <div className="space-y-4">
            <video
              ref={videoRef}
              autoPlay
              muted
              className="w-full max-w-md mx-auto rounded-lg bg-gray-900"
            />
            <div className="text-center">
              <div className="text-2xl font-mono text-red-600 mb-4">
                {formatTime(recordingTime)} / 0:30
              </div>
              <Button
                variant="danger"
                onClick={stopVideoRecording}
                icon={<Pause className="w-4 h-4" />}
              >
                Stop Recording
              </Button>
            </div>
          </div>
        ) : videoUrl ? (
          <div className="space-y-4">
            <video
              src={videoUrl}
              controls
              className="w-full max-w-md mx-auto rounded-lg"
            />
            <div className="flex justify-center space-x-2">
              <Button
                variant="outline"
                onClick={startVideoRecording}
                icon={<Video className="w-4 h-4" />}
              >
                Re-record
              </Button>
              <Button
                variant="outline"
                onClick={() => onVideoChange('')}
                icon={<Trash2 className="w-4 h-4" />}
              >
                Delete
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <Video className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Record a short video introducing yourself
            </p>
            <div className="flex flex-col sm:flex-row gap-2 justify-center">
              <Button
                variant="primary"
                onClick={startVideoRecording}
                icon={<Video className="w-4 h-4" />}
              >
                Start Recording
              </Button>
              <Button
                variant="outline"
                icon={<Upload className="w-4 h-4" />}
              >
                Upload Video
              </Button>
            </div>
          </div>
        )}
      </Card>



      {/* Tips */}
      <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
        <h4 className="text-md font-medium text-blue-900 dark:text-blue-300 mb-2">
          Video Recording Tips
        </h4>
        <ul className="text-sm text-blue-800 dark:text-blue-400 space-y-1">
          <li>• Keep it concise - you have 30 seconds maximum</li>
          <li>• Speak clearly and at a moderate pace</li>
          <li>• Mention your key skills and what makes you unique</li>
          <li>• Smile and maintain good posture</li>
          <li>• Ensure good lighting and a clean background</li>
          <li>• Test your camera and microphone beforehand</li>
        </ul>
      </Card>
    </div>
  );
};