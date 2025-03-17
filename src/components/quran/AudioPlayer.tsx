
import { useState, useEffect, useRef } from 'react';
import Button from '@/components/ui/Button';
import { Play, Pause, X, SkipForward, SkipBack, Volume2, Volume1, VolumeX } from 'lucide-react';

interface AudioPlayerProps {
  audioUrl: string;
  title: string;
  onClose: () => void;
}

const AudioPlayer = ({ audioUrl, title, onClose }: AudioPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [previousVolume, setPreviousVolume] = useState(0.8);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.src = audioUrl;
      audioRef.current.volume = volume;
      
      // Auto play when a new audio is loaded
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(error => {
        console.error('Autoplay prevented:', error);
        setIsPlaying(false);
      });
    }
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, [audioUrl]);
  
  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };
  
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      setProgress(current);
      setDuration(duration);
    }
  };
  
  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newProgress = parseFloat(e.target.value);
    setProgress(newProgress);
    if (audioRef.current) {
      audioRef.current.currentTime = newProgress;
    }
  };
  
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };
  
  const toggleMute = () => {
    if (audioRef.current) {
      if (volume > 0) {
        setPreviousVolume(volume);
        setVolume(0);
        audioRef.current.volume = 0;
      } else {
        setVolume(previousVolume);
        audioRef.current.volume = previousVolume;
      }
    }
  };
  
  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00';
    
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };
  
  const VolumeIcon = () => {
    if (volume === 0) return <VolumeX className="h-4 w-4" />;
    if (volume < 0.5) return <Volume1 className="h-4 w-4" />;
    return <Volume2 className="h-4 w-4" />;
  };

  return (
    <div className="flex items-center justify-between mx-auto max-w-4xl">
      <audio 
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => setIsPlaying(false)}
        hidden
      />
      
      <div className="flex items-center">
        <Button variant="ghost" size="icon" onClick={togglePlay}>
          {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
        </Button>
        <div className="ml-2 text-sm font-medium">{title}</div>
      </div>
      
      <div className="flex-1 mx-4">
        <div className="flex items-center">
          <span className="text-xs text-muted-foreground w-12">{formatTime(progress)}</span>
          <input
            type="range"
            min="0"
            max={duration || 100}
            value={progress}
            onChange={handleProgressChange}
            className="flex-1 h-2 rounded-full accent-primary bg-secondary"
          />
          <span className="text-xs text-muted-foreground w-12 text-right">{formatTime(duration)}</span>
        </div>
      </div>
      
      <div className="flex items-center">
        <div className="hidden sm:flex items-center mr-2">
          <Button variant="ghost" size="icon" onClick={toggleMute}>
            <VolumeIcon />
          </Button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={handleVolumeChange}
            className="w-20 h-2 rounded-full accent-primary bg-secondary"
          />
        </div>
        
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default AudioPlayer;
