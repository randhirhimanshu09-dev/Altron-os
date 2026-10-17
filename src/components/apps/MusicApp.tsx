import React, { useState, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, Disc, Radio } from 'lucide-react';
import { soundEngine } from '../../services/audioSynth';

export const MusicApp: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(soundEngine.getMusicPlayingState());
  const [trackIndex, setTrackIndex] = useState(0);

  const playlist = [
    { title: 'Neural Synthwave Core', artist: 'ALTRON Autonomous', duration: '3:45' },
    { title: 'Cybernetic Orbital Dreams', artist: 'Gemini Protocol', duration: '4:12' },
    { title: 'Deep Space Frequency', artist: 'Holographic Array', duration: '3:18' },
  ];

  const currentTrack = playlist[trackIndex];

  const togglePlayback = () => {
    const newState = soundEngine.toggleMusic();
    setIsPlaying(newState);
  };

  const nextTrack = () => {
    soundEngine.playAcknowledge();
    setTrackIndex((trackIndex + 1) % playlist.length);
  };

  const prevTrack = () => {
    soundEngine.playAcknowledge();
    setTrackIndex((trackIndex - 1 + playlist.length) % playlist.length);
  };

  useEffect(() => {
    setIsPlaying(soundEngine.getMusicPlayingState());
  }, []);

  return (
    <div className="flex flex-col items-center justify-between h-full p-6 bg-gradient-to-b from-slate-950 via-slate-900 to-black text-white select-none">
      {/* Header */}
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-2">
          <Radio className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-mono tracking-widest text-cyan-300">ALTRON AUDIO BEAT</span>
        </div>
        <div className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-500/30 text-cyan-400">
          HI-RES 96kHz / 24bit
        </div>
      </div>

      {/* Rotating Cyber Vinyl / Core */}
      <div className="relative flex items-center justify-center my-4">
        <div
          className={`relative w-44 h-44 rounded-full border-4 border-cyan-500/30 bg-slate-950 shadow-2xl shadow-cyan-500/20 flex items-center justify-center ${
            isPlaying ? 'animate-spin-slow' : ''
          }`}
          style={{ animationDuration: '6s' }}
        >
          {/* Vinyl Grooves */}
          <div className="w-36 h-36 rounded-full border border-slate-800" />
          <div className="w-28 h-28 rounded-full border border-slate-700 absolute" />
          <div className="w-20 h-20 rounded-full border border-cyan-500/40 absolute flex items-center justify-center bg-cyan-950/40">
            <Disc className="w-8 h-8 text-cyan-400" />
          </div>
        </div>

        {/* Ambient Ring Glow */}
        <div className="absolute inset-0 rounded-full border border-cyan-400/20 pointer-events-none" />
      </div>

      {/* Track Info & Visualizer */}
      <div className="w-full flex flex-col items-center text-center">
        <h3 className="text-lg font-bold text-white tracking-wide">{currentTrack.title}</h3>
        <p className="text-xs font-mono text-cyan-400 mt-1">{currentTrack.artist}</p>

        {/* Audio Visualizer Bars */}
        <div className="flex items-end gap-1.5 h-8 my-4">
          {[30, 80, 50, 95, 65, 40, 85, 60, 90, 75, 45, 100, 70, 50].map((h, i) => (
            <div
              key={i}
              className="w-1.5 bg-gradient-to-t from-cyan-600 to-cyan-300 rounded-full transition-all duration-200"
              style={{
                height: isPlaying ? `${Math.max(15, h * (0.4 + Math.sin(Date.now() / 150 + i) * 0.6))}%` : '15%',
              }}
            />
          ))}
        </div>
      </div>

      {/* Player Controls */}
      <div className="w-full max-w-xs flex flex-col gap-4">
        <div className="flex items-center justify-center gap-6">
          <button
            onClick={prevTrack}
            className="p-3 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-all active:scale-95"
          >
            <SkipBack className="w-6 h-6" />
          </button>

          <button
            onClick={togglePlayback}
            className="flex items-center justify-center w-16 h-16 rounded-full bg-cyan-500 hover:bg-cyan-400 active:scale-95 text-black shadow-lg shadow-cyan-500/40 transition-all"
          >
            {isPlaying ? <Pause className="w-7 h-7 fill-current" /> : <Play className="w-7 h-7 fill-current ml-0.5" />}
          </button>

          <button
            onClick={nextTrack}
            className="p-3 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-all active:scale-95"
          >
            <SkipForward className="w-6 h-6" />
          </button>
        </div>

        <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 px-2">
          <span>01:24</span>
          <span className="text-cyan-400/80">SYNTH ENGINE ONLINE</span>
          <span>{currentTrack.duration}</span>
        </div>
      </div>
    </div>
  );
};
