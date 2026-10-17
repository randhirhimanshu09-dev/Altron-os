import React, { useState } from 'react';
import { Compass, Navigation, MapPin, Search } from 'lucide-react';
import { soundEngine } from '../../services/audioSynth';

export const MapsApp: React.FC = () => {
  const [destination, setDestination] = useState('Neo Central Core');
  const [isNavigating, setIsNavigating] = useState(false);

  const waypoints = [
    { name: 'Neo Central Core', distance: '2.4 km', time: '6 mins', eta: '10:45 AM' },
    { name: 'Cyber Research Labs', distance: '5.1 km', time: '14 mins', eta: '10:53 AM' },
    { name: 'Home Base Alpha', distance: '8.7 km', time: '22 mins', eta: '11:01 AM' },
    { name: 'Orbital Comm Station', distance: '12.0 km', time: '30 mins', eta: '11:09 AM' },
  ];

  const handleStartNav = (dest: string) => {
    soundEngine.playAcknowledge();
    setDestination(dest);
    setIsNavigating(true);
  };

  return (
    <div className="relative flex flex-col h-full bg-slate-950 text-white select-none overflow-hidden">
      {/* Top Search & Compass Bar */}
      <div className="p-3 bg-slate-900/80 border-b border-slate-800 flex items-center gap-2 z-10">
        <div className="flex-1 flex items-center gap-2 bg-slate-950 px-3 py-2 rounded-xl border border-slate-700">
          <Search className="w-4 h-4 text-cyan-400" />
          <input
            type="text"
            value={destination}
            onChange={e => setDestination(e.target.value)}
            placeholder="Search destination or voice navigate..."
            className="w-full bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none"
          />
        </div>
        <div className="p-2 rounded-xl bg-cyan-950/60 border border-cyan-500/30 text-cyan-400">
          <Compass className="w-4 h-4" />
        </div>
      </div>

      {/* Tactical Radar GPS Map View */}
      <div className="relative flex-1 bg-slate-950 flex items-center justify-center overflow-hidden">
        {/* Vector Grid Lines */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:28px_28px]" />

        {/* Radar Rings */}
        <div className="relative w-64 h-64 rounded-full border border-cyan-500/20 flex items-center justify-center">
          <div className="w-48 h-48 rounded-full border border-cyan-500/25 absolute" />
          <div className="w-32 h-32 rounded-full border border-cyan-500/30 absolute" />
          <div className="w-16 h-16 rounded-full border border-cyan-500/40 absolute flex items-center justify-center">
            {/* User GPS Pin */}
            <div className="relative flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-cyan-400 shadow-md shadow-cyan-400" />
              <div className="w-6 h-6 rounded-full border border-cyan-400 animate-ping absolute" />
            </div>
          </div>

          {/* Sweeping radar scanner line */}
          <div
            className="absolute w-32 h-0.5 bg-gradient-to-r from-cyan-400 to-transparent origin-left left-1/2 animate-spin"
            style={{ animationDuration: '4s' }}
          />

          {/* Tactical Waypoint Pins */}
          <div className="absolute top-10 right-14 flex items-center gap-1 group">
            <div className="p-1 rounded-full bg-emerald-500/20 border border-emerald-400 text-emerald-400">
              <MapPin className="w-3.5 h-3.5" />
            </div>
            <span className="text-[10px] font-mono text-emerald-300 bg-slate-900/80 px-1 rounded">CORE</span>
          </div>

          <div className="absolute bottom-12 left-10 flex items-center gap-1 group">
            <div className="p-1 rounded-full bg-amber-500/20 border border-amber-400 text-amber-400">
              <MapPin className="w-3.5 h-3.5" />
            </div>
            <span className="text-[10px] font-mono text-amber-300 bg-slate-900/80 px-1 rounded">LABS</span>
          </div>
        </div>

        {/* Tactical Elevation & Coordinates */}
        <div className="absolute top-3 left-3 text-[10px] font-mono text-cyan-400/80 bg-slate-900/80 px-2 py-1 rounded border border-slate-800">
          GPS: 37.7749° N, 122.4194° W • ELEV 42M
        </div>

        {/* Live Navigation Guidance Box */}
        {isNavigating && (
          <div className="absolute bottom-3 left-3 right-3 p-3 rounded-2xl bg-slate-900/90 border border-cyan-500/40 backdrop-blur shadow-xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-cyan-500 text-black">
                <Navigation className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <div className="text-xs font-bold text-white">Turn right onto Cybernetic Blvd</div>
                <div className="text-[11px] font-mono text-cyan-400">In 350 meters • ETA 10:45 AM</div>
              </div>
            </div>
            <button
              onClick={() => setIsNavigating(false)}
              className="text-xs px-2.5 py-1 rounded-lg bg-red-500/20 text-red-400 border border-red-500/30"
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      {/* Suggested Waypoints Drawer */}
      {!isNavigating && (
        <div className="p-3 bg-slate-900/90 border-t border-slate-800 max-h-48 overflow-y-auto">
          <div className="text-[11px] font-mono text-slate-400 mb-2 px-1">QUICK ROUTE POINTS</div>
          <div className="grid grid-cols-2 gap-2">
            {waypoints.map((w, i) => (
              <div
                key={i}
                onClick={() => handleStartNav(w.name)}
                className="p-2.5 rounded-xl bg-slate-950 hover:bg-slate-800/80 border border-slate-800 hover:border-cyan-500/30 cursor-pointer transition-all"
              >
                <div className="text-xs font-semibold text-slate-200 truncate">{w.name}</div>
                <div className="text-[10px] font-mono text-cyan-400 mt-0.5">{w.distance} • {w.time}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
