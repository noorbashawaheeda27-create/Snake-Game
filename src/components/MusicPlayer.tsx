import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Music } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Track } from '../types';

const TRACKS: Track[] = [
  {
    id: '1',
    title: 'Electric Dreams',
    artist: 'AI Synth Alpha',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    duration: 372,
    coverUrl: 'https://picsum.photos/seed/synth1/400/400',
  },
  {
    id: '2',
    title: 'Neon Horizon',
    artist: 'Beta Beats',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    duration: 425,
    coverUrl: 'https://picsum.photos/seed/synth2/400/400',
  },
  {
    id: '3',
    title: 'Cyber City',
    artist: 'Gamma Groove',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    duration: 310,
    coverUrl: 'https://picsum.photos/seed/synth5/400/400',
  },
];

export const MusicPlayer: React.FC = () => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(() => setIsPlaying(false));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => {
      setProgress((audio.currentTime / audio.duration) * 100);
    };

    const handleEnded = () => {
      skipForward();
    };

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [currentTrackIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const skipForward = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setProgress(0);
  };

  const skipBack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setProgress(0);
  };

  return (
    <div className="glass p-6 rounded-3xl w-full max-w-md flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <motion.div
          key={currentTrack.id}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative w-24 h-24 rounded-2xl overflow-hidden neon-border-magenta"
        >
          <img
            src={currentTrack.coverUrl}
            alt={currentTrack.title}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          {isPlaying && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40">
              <div className="flex gap-1 items-end h-8">
                {[0, 1, 2, 3].map((i) => (
                  <motion.div
                    key={i}
                    animate={{ height: [8, 24, 12, 28, 8] }}
                    transition={{ repeat: Infinity, duration: 1, delay: i * 0.1 }}
                    className="w-1 bg-neon-magenta rounded-full"
                  />
                ))}
              </div>
            </div>
          )}
        </motion.div>

        <div className="flex-1">
          <motion.h3 
            key={currentTrack.title}
            initial={{ y: 5, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-xl font-display font-medium text-white truncate"
          >
            {currentTrack.title}
          </motion.h3>
          <p className="text-neon-magenta/70 text-sm font-mono tracking-wider">{currentTrack.artist}</p>
        </div>
      </div>

      <div className="space-y-2">
        <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-neon-magenta"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ type: 'spring', damping: 20, stiffness: 100 }}
          />
        </div>
        <div className="flex justify-between text-[10px] font-mono text-white/40 uppercase tracking-widest">
            <span>{Math.floor((currentTrack.duration * progress / 100) / 60)}:{(Math.floor((currentTrack.duration * progress / 100) % 60)).toString().padStart(2, '0')}</span>
            <span>{Math.floor(currentTrack.duration / 60)}:{Math.floor(currentTrack.duration % 60).toString().padStart(2, '0')}</span>
        </div>
      </div>

      <div className="flex items-center justify-between mt-2">
        <div className="flex items-center gap-6 mx-auto">
          <button
            onClick={skipBack}
            className="p-2 text-white/60 hover:text-neon-magenta transition-colors hover:scale-110 active:scale-95"
          >
            <SkipBack size={24} />
          </button>
          <button
            onClick={togglePlay}
            className="w-14 h-14 rounded-full bg-neon-magenta flex items-center justify-center text-black shadow-neon-magenta hover:scale-105 active:scale-95 transition-transform"
          >
            {isPlaying ? <Pause fill="black" size={28} /> : <Play fill="black" size={28} className="translate-x-0.5" />}
          </button>
          <button
            onClick={skipForward}
            className="p-2 text-white/60 hover:text-neon-magenta transition-colors hover:scale-110 active:scale-95"
          >
            <SkipForward size={24} />
          </button>
        </div>
      </div>

      <audio
        ref={audioRef}
        src={currentTrack.url}
        key={currentTrack.id}
      />
    </div>
  );
};
