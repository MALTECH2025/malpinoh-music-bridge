
import React from 'react';

interface MusicWaveProps {
  isPlaying?: boolean;
  className?: string;
}

const MusicWave: React.FC<MusicWaveProps> = ({ isPlaying = false, className = '' }) => {
  return (
    <div className={`music-wave ${className}`} style={{ opacity: isPlaying ? 1 : 0.5 }}>
      <span style={{ animationPlayState: isPlaying ? 'running' : 'paused' }}></span>
      <span style={{ animationPlayState: isPlaying ? 'running' : 'paused' }}></span>
      <span style={{ animationPlayState: isPlaying ? 'running' : 'paused' }}></span>
      <span style={{ animationPlayState: isPlaying ? 'running' : 'paused' }}></span>
      <span style={{ animationPlayState: isPlaying ? 'running' : 'paused' }}></span>
    </div>
  );
};

export default MusicWave;
