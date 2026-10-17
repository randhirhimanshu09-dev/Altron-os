import React, { useState } from 'react';
import { Camera, RefreshCw, Zap, Sliders, Image as ImageIcon } from 'lucide-react';
import { soundEngine } from '../../services/audioSynth';

export const CameraApp: React.FC = () => {
  const [flash, setFlash] = useState(false);
  const [lens, setLens] = useState<'1x' | '2x' | '0.5x'>('1x');
  const [filterIndex, setFilterIndex] = useState(0);
  const [lastShot, setLastShot] = useState<string | null>(null);
  const [isShutterActive, setIsShutterActive] = useState(false);

  const filters = [
    { name: 'Cyber Blue', class: 'hue-rotate-180 contrast-125' },
    { name: 'Night Vision', class: 'hue-rotate-90 brightness-110 saturate-150' },
    { name: 'Thermal Noir', class: 'grayscale contrast-200' },
    { name: 'Normal', class: '' },
  ];

  const takePhoto = () => {
    soundEngine.playCameraClick();
    setIsShutterActive(true);
    setTimeout(() => setIsShutterActive(false), 150);
    // Create preview thumbnail
    setLastShot(`shot_${Date.now()}`);
  };

  return (
    <div className="relative flex flex-col justify-between h-full bg-black text-white select-none overflow-hidden">
      {/* Viewfinder Flash Overlay */}
      {isShutterActive && (
        <div className="absolute inset-0 z-50 bg-white pointer-events-none transition-opacity duration-150" />
      )}

      {/* Top HUD Controls */}
      <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-b from-black/80 to-transparent z-10">
        <button
          onClick={() => setFlash(!flash)}
          className={`p-2 rounded-full border transition-all ${
            flash ? 'bg-amber-400/20 border-amber-400 text-amber-300' : 'bg-black/40 border-slate-700 text-slate-300'
          }`}
        >
          <Zap className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-1 px-3 py-1 bg-black/60 border border-slate-800 rounded-full text-xs font-mono text-cyan-400">
          <span>ALTRON OPTICS 48MP</span>
        </div>

        <button
          onClick={() => setFilterIndex((filterIndex + 1) % filters.length)}
          className="p-2 rounded-full bg-black/40 border border-slate-700 text-slate-300 hover:text-cyan-400"
          title={`Filter: ${filters[filterIndex].name}`}
        >
          <Sliders className="w-4 h-4" />
        </button>
      </div>

      {/* Viewfinder View with Tactical HUD Crosshairs */}
      <div className={`relative flex-1 flex items-center justify-center m-3 rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden ${filters[filterIndex].class}`}>
        {/* Synthetic Cyber Cityscape background */}
        <div className="absolute inset-0 bg-gradient-to-t from-cyan-950/40 via-slate-900 to-slate-950 opacity-80" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-500/10 via-transparent to-black" />

        {/* Tactical Crosshair Lines */}
        <div className="relative w-40 h-40 border border-dashed border-cyan-400/40 rounded-2xl flex items-center justify-center">
          <div className="w-3 h-3 border-t-2 border-l-2 border-cyan-400 absolute top-2 left-2" />
          <div className="w-3 h-3 border-t-2 border-r-2 border-cyan-400 absolute top-2 right-2" />
          <div className="w-3 h-3 border-b-2 border-l-2 border-cyan-400 absolute bottom-2 left-2" />
          <div className="w-3 h-3 border-b-2 border-r-2 border-cyan-400 absolute bottom-2 right-2" />
          <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping opacity-60" />
          <div className="absolute -bottom-7 text-[10px] font-mono tracking-wider text-cyan-300/80 bg-slate-950/80 px-2 py-0.5 rounded border border-cyan-500/20">
            AUTO-FOCUS LOCK
          </div>
        </div>

        {/* Lens Zoom Switcher */}
        <div className="absolute bottom-4 flex items-center gap-2 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-full border border-slate-800">
          {(['0.5x', '1x', '2x'] as const).map(l => (
            <button
              key={l}
              onClick={() => setLens(l)}
              className={`w-7 h-7 rounded-full text-xs font-mono font-medium flex items-center justify-center transition-all ${
                lens === l ? 'bg-cyan-500 text-black font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              {l}
            </button>
          ))}
        </div>
      </div>

      {/* Shutter Bar */}
      <div className="flex items-center justify-around px-8 py-6 bg-gradient-to-t from-black via-black/90 to-transparent z-10">
        {/* Gallery thumbnail */}
        <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center overflow-hidden">
          {lastShot ? (
            <div className="w-full h-full bg-cyan-700/60 flex items-center justify-center text-[10px] font-mono text-cyan-200">
              IMG_01
            </div>
          ) : (
            <ImageIcon className="w-5 h-5 text-slate-500" />
          )}
        </div>

        {/* Shutter Button */}
        <button
          onClick={takePhoto}
          className="relative flex items-center justify-center w-18 h-18 rounded-full border-4 border-white/80 p-1 active:scale-90 transition-transform"
        >
          <div className="w-full h-full rounded-full bg-white hover:bg-cyan-200 shadow-lg shadow-cyan-500/20" />
        </button>

        {/* Flip Camera */}
        <button
          onClick={() => {
            soundEngine.playAcknowledge();
            setLens(lens === '1x' ? '2x' : '1x');
          }}
          className="p-3 rounded-full bg-slate-800/80 border border-slate-700 text-slate-300 hover:text-cyan-400 active:rotate-180 transition-all duration-300"
        >
          <RefreshCw className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
