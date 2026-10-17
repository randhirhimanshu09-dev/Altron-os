import React, { useState, useEffect } from 'react';
import {
  Wifi,
  Battery,
  BatteryCharging,
  Phone,
  MessageSquare,
  Camera,
  Music,
  MapPin,
  Settings,
  Activity,
  HelpCircle,
  Lock,
  Unlock,
  ChevronLeft,
  Circle,
  Home,
  Sliders,
  Sparkles,
  Flashlight,
  Volume2,
  VolumeX,
  Bluetooth,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Edit3,
  Bell,
  CheckCircle2,
  Zap,
  Download,
} from 'lucide-react';
import { AppId, DeviceSkin, PhoneSettings } from '../types';
import { EarthLogo3D } from './EarthLogo3D';
import { soundEngine } from '../services/audioSynth';

interface MobileFrameProps {
  currentApp: AppId;
  setCurrentApp: (app: AppId) => void;
  settings: PhoneSettings;
  onUpdateSettings: (updates: Partial<PhoneSettings>) => void;
  isListening: boolean;
  isProcessing: boolean;
  isSpeaking: boolean;
  activeCallDuration?: number;
  isMusicPlaying?: boolean;
  children: React.ReactNode;
  onOpenVoiceTrigger: () => void;
  onOpenSetupGuide?: () => void;
  onOpenInstall?: () => void;
  onOpenApkModal?: () => void;
  isInstalled?: boolean;
  onStartCall?: (name: string, num: string) => void;
}

export const MobileFrame: React.FC<MobileFrameProps> = ({
  currentApp,
  setCurrentApp,
  settings,
  onUpdateSettings,
  isListening,
  isProcessing,
  isSpeaking,
  activeCallDuration,
  isMusicPlaying,
  children,
  onOpenVoiceTrigger,
  onOpenSetupGuide,
  onOpenInstall,
  onOpenApkModal,
  isInstalled,
  onStartCall,
}) => {
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [isQuickSettingsOpen, setIsQuickSettingsOpen] = useState(false);

  // Update clock every second
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })
      );
      setCurrentDate(
        now.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const appsList = [
    { id: 'phone' as AppId, name: 'Phone', icon: Phone, color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
    { id: 'messages' as AppId, name: 'Messages', icon: MessageSquare, color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
    { id: 'camera' as AppId, name: 'Camera', icon: Camera, color: 'bg-rose-500/20 text-rose-400 border-rose-500/30' },
    { id: 'music' as AppId, name: 'Music', icon: Music, color: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30' },
    { id: 'maps' as AppId, name: 'Maps', icon: MapPin, color: 'bg-amber-500/20 text-amber-400 border-amber-500/30' },
    { id: 'diagnostics' as AppId, name: 'System', icon: Activity, color: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
    { id: 'settings' as AppId, name: 'Settings', icon: Settings, color: 'bg-slate-700/40 text-slate-300 border-slate-600/30' },
    { id: 'setup' as AppId, name: 'Mobile Setup', icon: HelpCircle, color: 'bg-teal-500/20 text-teal-400 border-teal-500/30' },
  ];

  const handleAppLaunch = (appId: AppId) => {
    soundEngine.playAcknowledge();
    setCurrentApp(appId);
  };

  const toggleScreenLock = () => {
    soundEngine.playAcknowledge();
    onUpdateSettings({ screenLocked: !settings.screenLocked });
  };

  const handleQuickLaunchTileClick = () => {
    soundEngine.playAcknowledge();
    setIsQuickSettingsOpen(false);
    setCurrentApp('launcher');
    onOpenVoiceTrigger();
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen w-full bg-slate-950 p-2 sm:p-6 overflow-hidden">
      {/* Background Cyber Ambient Glow */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Screen Brightness & Flashlight Simulator */}
      {settings.flashlight && (
        <div className="fixed inset-0 z-50 bg-white/95 pointer-events-none flex flex-col items-center justify-center text-black">
          <Flashlight className="w-16 h-16 animate-bounce text-amber-500" />
          <span className="text-xl font-bold font-mono tracking-widest mt-4">ALTRON FLASHLIGHT TORCH ACTIVE</span>
          <span className="text-xs font-mono text-slate-700 mt-1">Say "Turn off flashlight" or tap anywhere in settings</span>
        </div>
      )}

      {/* Outer Smartphone Frame Chassis */}
      <div
        className={`relative w-full max-w-[420px] h-[860px] max-h-[96vh] rounded-[48px] p-3 shadow-2xl transition-all duration-300 flex flex-col overflow-hidden ${
          settings.activeSkin === 'cyber'
            ? 'bg-slate-900 border-2 border-cyan-500/40 shadow-cyan-500/20'
            : settings.activeSkin === 'android'
            ? 'bg-[#1e1f22] border-[6px] border-[#2c2d30] shadow-black'
            : 'bg-black border-[5px] border-slate-800 shadow-black'
        }`}
        style={{
          filter: `brightness(${Math.max(50, settings.brightness)}%)`,
        }}
      >
        {/* Hardware Frame Accents */}
        <div className="absolute top-24 -left-4 w-1.5 h-12 bg-slate-700 rounded-l-md" /> {/* Volume Up */}
        <div className="absolute top-40 -left-4 w-1.5 h-12 bg-slate-700 rounded-l-md" /> {/* Volume Down */}
        <div className="absolute top-32 -right-4 w-1.5 h-16 bg-cyan-500/80 rounded-r-md shadow-md shadow-cyan-500/40" /> {/* Power / Altron Action Key */}

        {/* Inner OLED Display Panel */}
        <div className="relative w-full h-full rounded-[38px] bg-black overflow-hidden flex flex-col border border-slate-900">
          
          {/* Status Bar (Interactive: Click/Swipe down to open Android Quick Settings) */}
          <div
            onClick={() => {
              soundEngine.playClick();
              setIsQuickSettingsOpen(!isQuickSettingsOpen);
            }}
            className="relative z-40 flex items-center justify-between px-6 pt-3 pb-1.5 select-none cursor-pointer bg-slate-950/70 hover:bg-slate-900/60 transition-colors group"
            title="Tap or pull down for Android Quick Settings & Notification Shade"
          >
            {/* Clock */}
            <span className="text-xs font-semibold tracking-tight text-white font-mono flex items-center gap-1.5">
              <span>{currentTime.split(' ')[0]}</span>
              <ChevronDown className="w-3 h-3 text-cyan-400 group-hover:translate-y-0.5 transition-transform" />
            </span>

            {/* Dynamic Island / Punch-Hole Notch */}
            {settings.activeSkin === 'ios' ? (
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  if (activeCallDuration !== undefined) setCurrentApp('phone');
                  else if (isMusicPlaying) setCurrentApp('music');
                }}
                className={`flex items-center gap-2 px-3 py-1 rounded-full bg-black border border-slate-800 transition-all cursor-pointer ${
                  activeCallDuration !== undefined || isMusicPlaying
                    ? 'w-36 justify-between border-cyan-500/40'
                    : 'w-24 justify-center'
                }`}
              >
                <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-800" />
                {activeCallDuration !== undefined ? (
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[10px] font-mono text-emerald-400">{activeCallDuration}s</span>
                  </div>
                ) : isMusicPlaying ? (
                  <div className="flex items-center gap-1">
                    <Music className="w-2.5 h-2.5 text-cyan-400 animate-pulse" />
                    <span className="text-[9px] font-mono text-cyan-300">Audio</span>
                  </div>
                ) : null}
              </div>
            ) : settings.activeSkin === 'android' ? (
              /* Android Centered Punch-Hole */
              <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-900/90 border border-slate-800">
                <div className="w-2.5 h-2.5 rounded-full bg-slate-950 border border-slate-700" />
                <span className="text-[9px] font-mono text-cyan-400">QS Tile Ready</span>
              </div>
            ) : (
              /* Cyber HUD Status Badge */
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-cyan-950/60 border border-cyan-500/30">
                <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                <span className="text-[9px] font-mono tracking-widest text-cyan-300">ALTRON OS</span>
              </div>
            )}

            {/* Connectivity Icons */}
            <div className="flex items-center gap-2 text-slate-300">
              <span className="text-[10px] font-mono text-cyan-400 font-bold">5G</span>
              {settings.wifi && <Wifi className="w-3.5 h-3.5 text-slate-200" />}
              <div className="flex items-center gap-1">
                <span className="text-[10px] font-mono text-slate-300">{settings.batteryLevel}%</span>
                {settings.batteryCharging ? (
                  <BatteryCharging className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Battery className="w-4 h-4 text-slate-200" />
                )}
              </div>
            </div>
          </div>

          {/* MAIN SCREEN DISPLAY AREA */}
          <div className="relative flex-1 w-full overflow-hidden flex flex-col">
            
            {/* If Screen is Locked: Render Altron Ambient Lockscreen */}
            {settings.screenLocked ? (
              <div className="flex-1 flex flex-col items-center justify-between p-6 select-none bg-gradient-to-b from-slate-950 via-black to-slate-950 text-white">
                <div className="flex flex-col items-center mt-6 text-center">
                  <Lock className="w-4 h-4 text-cyan-400/80 mb-2" />
                  <span className="text-xs font-mono tracking-widest text-cyan-400/80 uppercase">{currentDate}</span>
                  <h1 className="text-5xl font-extrabold tracking-tight mt-1 text-white font-mono">{currentTime.split(' ')[0]}</h1>
                  <span className="text-xs font-mono text-slate-400 mt-1">SECURED BY ALTRON NEURAL LOCK</span>
                </div>

                {/* Central Rotating Earth Core on Lockscreen */}
                <div className="flex flex-col items-center justify-center my-auto">
                  <EarthLogo3D
                    size="hero"
                    isListening={isListening}
                    isProcessing={isProcessing}
                    isSpeaking={isSpeaking}
                    onClick={onOpenVoiceTrigger}
                  />
                  <div className="text-center mt-2">
                    <span className="text-xs font-mono text-cyan-300 tracking-wider">TAP EARTH OR SAY "HEY ALTRON"</span>
                    <p className="text-[10px] text-slate-400 mt-0.5">Hands-free calling & messaging ready</p>
                  </div>
                </div>

                {/* Main Launch Altron OS Button on Lockscreen */}
                <button
                  onClick={() => {
                    soundEngine.playWakeChime();
                    toggleScreenLock();
                    if (onOpenVoiceTrigger) onOpenVoiceTrigger();
                  }}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-cyan-600 via-teal-500 to-cyan-500 hover:from-cyan-500 hover:to-teal-400 border border-cyan-300/40 text-white font-bold text-xs flex items-center justify-center gap-2.5 shadow-xl shadow-cyan-500/30 active:scale-95 transition-all group"
                >
                  <Zap className="w-4 h-4 fill-white animate-bounce" />
                  <span className="tracking-wider uppercase font-black">LAUNCH ALTRON OS</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-black/40 border border-white/20 text-cyan-200">
                    VOICE ACTIVE
                  </span>
                </button>
              </div>
            ) : currentApp === 'launcher' ? (
              /* ALTRON OS HOME LAUNCHER */
              <div className="flex-1 flex flex-col justify-between p-3.5 text-white overflow-y-auto select-none">
                {/* Header Spec Badge */}
                <div className="flex items-center justify-between px-2 pt-0.5">
                  <div>
                    <h2 className="text-lg font-extrabold tracking-tight bg-gradient-to-r from-white via-cyan-200 to-cyan-400 bg-clip-text text-transparent">
                      ALTRON OS
                    </h2>
                    <p className="text-[10px] font-mono text-cyan-400">VOICE CONTROLLED ARCHITECTURE</p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => {
                        soundEngine.toggleMusic();
                      }}
                      className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl border text-[11px] font-mono transition-all ${
                        isMusicPlaying
                          ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-sm shadow-cyan-500/30'
                          : 'bg-slate-900/90 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                      title="Toggle Cyber Synth Music Playback"
                    >
                      <Music className={`w-3.5 h-3.5 ${isMusicPlaying ? 'text-cyan-400 animate-spin-slow' : 'text-slate-400'}`} />
                      <span>{isMusicPlaying ? 'Beat Playing' : 'Play Beat'}</span>
                    </button>

                    <button
                      onClick={toggleScreenLock}
                      className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white transition-colors"
                      title="Lock Screen"
                    >
                      <Lock className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Hero Centered Dark Theme 3D Rotating Earth Logo */}
                <div className="flex flex-col items-center justify-center my-0.5">
                  <EarthLogo3D
                    size="hero"
                    isListening={isListening}
                    isProcessing={isProcessing}
                    isSpeaking={isSpeaking}
                    onClick={onOpenVoiceTrigger}
                  />
                  <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/80 border border-cyan-500/30 text-[10px] font-mono text-cyan-300">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                    <span>ALTRON SENTIENT CORE • READY</span>
                  </div>
                </div>

                {/* Prominent Main "LAUNCH ALTRON OS" Quick Launch Button */}
                <div className="px-1 my-1">
                  <button
                    onClick={() => {
                      soundEngine.playWakeChime();
                      if (onOpenVoiceTrigger) onOpenVoiceTrigger();
                    }}
                    className="w-full p-3 rounded-2xl bg-gradient-to-r from-cyan-900/90 via-slate-900 to-cyan-950/90 border-2 border-cyan-400 hover:border-cyan-300 flex items-center justify-between text-left transition-all active:scale-98 shadow-lg shadow-cyan-500/20 group"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-xl bg-cyan-500 text-slate-950 font-bold group-hover:scale-105 transition-transform shadow-md shadow-cyan-400/50">
                        <Zap className="w-5 h-5 fill-slate-950" />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-black tracking-wider text-white uppercase">LAUNCH ALTRON OS</span>
                          <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold">
                            ONLINE
                          </span>
                        </div>
                        <p className="text-[10px] text-cyan-200 font-mono">
                          Centralized Voice Engine & Direct Calling Active
                        </p>
                      </div>
                    </div>
                    <Zap className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform shrink-0" />
                  </button>
                </div>

                {/* Download APK & Install ALTRON OS Standalone App Shortcuts */}
                <div className="grid grid-cols-2 gap-2 px-1 mb-1">
                  <button
                    onClick={() => {
                      soundEngine.playClick();
                      if (onOpenApkModal) onOpenApkModal();
                    }}
                    className="py-2 px-2.5 rounded-xl bg-gradient-to-r from-emerald-950/80 via-slate-900 to-teal-950/80 hover:from-emerald-900/90 hover:to-teal-900/90 border border-emerald-500/40 hover:border-emerald-300 flex items-center justify-between text-left transition-all active:scale-98 shadow-md shadow-emerald-500/10 group cursor-pointer"
                    title="Download ALTRON Android APK installer package (.apk)"
                  >
                    <div className="flex items-center gap-1.5 min-w-0">
                      <div className="p-1 rounded-lg bg-emerald-500/20 text-emerald-400 group-hover:bg-emerald-500 group-hover:text-slate-950 transition-colors shrink-0">
                        <Download className="w-3.5 h-3.5" />
                      </div>
                      <div className="truncate">
                        <span className="text-[10px] font-bold text-emerald-300 block leading-tight">
                          Download APK
                        </span>
                        <span className="text-[8px] font-mono text-slate-400 block leading-none">
                          v1.0 • 308 KB
                        </span>
                      </div>
                    </div>
                    <span className="text-xs shrink-0">📥</span>
                  </button>

                  <button
                    onClick={() => {
                      soundEngine.playClick();
                      if (onOpenInstall) onOpenInstall();
                    }}
                    className="py-2 px-2.5 rounded-xl bg-gradient-to-r from-cyan-950/80 via-slate-900 to-teal-950/80 hover:from-cyan-900/90 hover:to-teal-900/90 border border-cyan-500/40 hover:border-cyan-300 flex items-center justify-between text-left transition-all active:scale-98 shadow-md shadow-cyan-500/10 group cursor-pointer"
                    title="Install ALTRON OS directly on your mobile phone"
                  >
                    <div className="flex items-center gap-1.5 min-w-0">
                      <div className="p-1 rounded-lg bg-cyan-500/20 text-cyan-400 group-hover:bg-cyan-500 group-hover:text-slate-950 transition-colors shrink-0">
                        <Download className="w-3.5 h-3.5" />
                      </div>
                      <div className="truncate">
                        <span className="text-[10px] font-bold text-cyan-200 block leading-tight">
                          {isInstalled ? 'App Active' : 'Install App'}
                        </span>
                        <span className="text-[8px] font-mono text-slate-400 block leading-none">
                          {isInstalled ? 'Installed ✓' : 'Home Screen'}
                        </span>
                      </div>
                    </div>
                    <span className="text-xs shrink-0">{isInstalled ? '✓' : '📲'}</span>
                  </button>
                </div>

                {/* App Grid */}
                <div className="grid grid-cols-4 gap-2.5 px-1 my-1">
                  {appsList.map(app => {
                    const IconComponent = app.icon;
                    return (
                      <button
                        key={app.id}
                        onClick={() => handleAppLaunch(app.id)}
                        className="flex flex-col items-center justify-center gap-1.5 p-2 rounded-2xl hover:bg-slate-900/60 transition-all active:scale-95 group"
                      >
                        <div className={`p-2.5 rounded-2xl border ${app.color} group-hover:scale-105 transition-transform shadow-md`}>
                          <IconComponent className="w-5 h-5" />
                        </div>
                        <span className="text-[11px] font-medium text-slate-300 group-hover:text-cyan-300 transition-colors">
                          {app.name}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Bottom Voice Prompt bar */}
                <div className="w-full pt-1">
                  {children}
                </div>
              </div>
            ) : (
              /* ACTIVE IN-APP VIEW */
              <div className="flex-1 flex flex-col overflow-hidden">
                {/* Top Nav Back Bar */}
                <div className="flex items-center justify-between px-3 py-1.5 bg-slate-950/80 border-b border-slate-800/80 z-20">
                  <button
                    onClick={() => {
                      soundEngine.playAcknowledge();
                      setCurrentApp('launcher');
                    }}
                    className="flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-slate-900 text-cyan-400 text-xs font-mono transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Home</span>
                  </button>

                  <span className="text-xs font-bold text-white capitalize">{currentApp}</span>

                  <button
                    onClick={onOpenVoiceTrigger}
                    className="p-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20"
                    title="Altron Voice"
                  >
                    <Sparkles className="w-4 h-4" />
                  </button>
                </div>

                {/* Render active app content */}
                <div className="flex-1 overflow-hidden relative">
                  {children}
                </div>
              </div>
            )}

            {/* ANDROID NOTIFICATION SHADE & QUICK SETTINGS OVERLAY DRAWER */}
            {isQuickSettingsOpen && (
              <div className="absolute inset-0 z-50 bg-slate-950/95 backdrop-blur-xl flex flex-col justify-between p-4 text-white animate-in slide-in-from-top-full duration-300 select-none">
                <div className="space-y-4">
                  {/* Top Bar inside Shade */}
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
                    <div>
                      <div className="text-2xl font-bold font-mono text-white tracking-tight">
                        {currentTime.split(' ')[0]}
                      </div>
                      <div className="text-xs font-mono text-slate-400">
                        {currentDate} • 5G Connected
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          if (onOpenSetupGuide) onOpenSetupGuide();
                        }}
                        className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-cyan-400 border border-slate-800"
                        title="Edit Quick Settings Tiles"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setCurrentApp('settings');
                          setIsQuickSettingsOpen(false);
                        }}
                        className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800"
                        title="Settings"
                      >
                        <Settings className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setIsQuickSettingsOpen(false)}
                        className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
                        title="Close Notification Shade"
                      >
                        <ChevronUp className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Quick Settings Tiles Grid (2 columns x 3 rows) */}
                  <div className="space-y-1.5">
                    <div className="text-[10px] font-mono text-cyan-400 font-semibold px-1">
                      ANDROID QUICK SETTINGS CONTROL TILES
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {/* TILE 1: OFFICIAL ALTRON OS QUICK LAUNCH TILE */}
                      <button
                        onClick={handleQuickLaunchTileClick}
                        className="p-3 rounded-2xl bg-gradient-to-r from-cyan-600/30 to-blue-600/30 border-2 border-cyan-400 flex items-center gap-3 text-left shadow-lg shadow-cyan-500/20 active:scale-95 transition-all group col-span-2"
                      >
                        <div className="w-10 h-10 rounded-xl bg-cyan-500 flex items-center justify-center text-slate-950 font-bold shadow-md shadow-cyan-400/50 group-hover:scale-105 transition-transform">
                          <Zap className="w-5 h-5 fill-slate-950" />
                        </div>
                        <div className="flex-1 truncate">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-white text-xs tracking-wide">ALTRON OS</span>
                            <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-bold">
                              ACTIVE TILE
                            </span>
                          </div>
                          <p className="text-[10px] text-cyan-300 font-mono truncate">
                            Voice Assistant & Phone Controls
                          </p>
                        </div>
                      </button>

                      {/* TILE 2: Wi-Fi */}
                      <button
                        onClick={() => onUpdateSettings({ wifi: !settings.wifi })}
                        className={`p-3 rounded-2xl border flex items-center gap-2.5 transition-all active:scale-95 ${
                          settings.wifi
                            ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                            : 'bg-slate-900 border-slate-800 text-slate-400'
                        }`}
                      >
                        <Wifi className="w-4 h-4" />
                        <div className="text-left">
                          <span className="block text-xs font-semibold">Wi-Fi</span>
                          <span className="block text-[9px] font-mono">{settings.wifi ? 'Connected' : 'Off'}</span>
                        </div>
                      </button>

                      {/* TILE 3: Bluetooth */}
                      <button
                        onClick={() => onUpdateSettings({ bluetooth: !settings.bluetooth })}
                        className={`p-3 rounded-2xl border flex items-center gap-2.5 transition-all active:scale-95 ${
                          settings.bluetooth
                            ? 'bg-blue-500/20 border-blue-400 text-blue-300'
                            : 'bg-slate-900 border-slate-800 text-slate-400'
                        }`}
                      >
                        <Bluetooth className="w-4 h-4" />
                        <div className="text-left">
                          <span className="block text-xs font-semibold">Bluetooth</span>
                          <span className="block text-[9px] font-mono">{settings.bluetooth ? 'On' : 'Off'}</span>
                        </div>
                      </button>

                      {/* TILE 4: Flashlight Torch */}
                      <button
                        onClick={() => onUpdateSettings({ flashlight: !settings.flashlight })}
                        className={`p-3 rounded-2xl border flex items-center gap-2.5 transition-all active:scale-95 ${
                          settings.flashlight
                            ? 'bg-amber-500/30 border-amber-400 text-amber-300 animate-pulse'
                            : 'bg-slate-900 border-slate-800 text-slate-400'
                        }`}
                      >
                        <Flashlight className="w-4 h-4" />
                        <div className="text-left">
                          <span className="block text-xs font-semibold">Flashlight</span>
                          <span className="block text-[9px] font-mono">{settings.flashlight ? 'Torch ON' : 'Off'}</span>
                        </div>
                      </button>

                      {/* TILE 5: Sound Volume */}
                      <button
                        onClick={() => onUpdateSettings({ volume: settings.volume > 0 ? 0 : 85 })}
                        className={`p-3 rounded-2xl border flex items-center gap-2.5 transition-all active:scale-95 ${
                          settings.volume > 0
                            ? 'bg-slate-850 border-slate-700 text-slate-200'
                            : 'bg-rose-500/20 border-rose-400 text-rose-300'
                        }`}
                      >
                        {settings.volume > 0 ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4" />}
                        <div className="text-left">
                          <span className="block text-xs font-semibold">Sound</span>
                          <span className="block text-[9px] font-mono">{settings.volume > 0 ? `${settings.volume}%` : 'Muted'}</span>
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* NOTIFICATION SHADE: PERSISTENT ONGOING NOTIFICATION */}
                  <div className="space-y-1.5 pt-1">
                    <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 px-1">
                      <span>ONGOING NOTIFICATIONS</span>
                      <span className="text-cyan-400">PERSISTENT SHORTCUT</span>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-slate-900 border border-cyan-500/30 space-y-2.5 shadow-lg">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
                            <Zap className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-bold text-white">ALTRON AI OS</span>
                              <span className="text-[9px] font-mono text-slate-400">• Ongoing Service</span>
                            </div>
                            <p className="text-[11px] text-slate-300">
                              Voice assistant & hands-free calling ready
                            </p>
                          </div>
                        </div>
                        <span className="text-[10px] font-mono text-slate-500">now</span>
                      </div>

                      {/* Notification Action Buttons */}
                      <div className="grid grid-cols-3 gap-1.5 pt-1">
                        <button
                          onClick={() => {
                            setIsQuickSettingsOpen(false);
                            onOpenVoiceTrigger();
                          }}
                          className="py-1.5 px-2 rounded-xl bg-cyan-600/30 hover:bg-cyan-600/50 border border-cyan-500/40 text-cyan-300 text-[10px] font-semibold text-center transition-all active:scale-95"
                        >
                          🎤 Voice
                        </button>
                        <button
                          onClick={() => {
                            setIsQuickSettingsOpen(false);
                            setCurrentApp('phone');
                          }}
                          className="py-1.5 px-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-[10px] font-semibold text-center transition-all active:scale-95"
                        >
                          📞 Call
                        </button>
                        <button
                          onClick={() => {
                            setIsQuickSettingsOpen(false);
                            setCurrentApp('launcher');
                          }}
                          className="py-1.5 px-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-cyan-400 text-[10px] font-semibold text-center transition-all active:scale-95"
                        >
                          ⚡ Dashboard
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Shade Bottom Drag Handle to Close */}
                <div
                  onClick={() => setIsQuickSettingsOpen(false)}
                  className="flex flex-col items-center justify-center py-2 cursor-pointer hover:opacity-80"
                >
                  <div className="w-16 h-1 rounded-full bg-slate-600 mb-1" />
                  <span className="text-[10px] font-mono text-slate-400">Swipe or tap to close shade</span>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Device Navigation Bar */}
          <div className="relative z-30 flex items-center justify-around py-2.5 bg-black select-none border-t border-slate-900">
            {settings.activeSkin === 'android' ? (
              /* Android 3-Button or Gesture Bar */
              <div className="flex items-center justify-around w-full px-12">
                <button
                  onClick={() => setCurrentApp('launcher')}
                  className="p-2 text-slate-400 hover:text-white"
                >
                  <Home className="w-4 h-4" />
                </button>
                <div
                  onClick={() => setCurrentApp('launcher')}
                  className="w-24 h-1 bg-slate-600 rounded-full cursor-pointer hover:bg-slate-400"
                />
                <button
                  onClick={toggleScreenLock}
                  className="p-2 text-slate-400 hover:text-white"
                >
                  <Lock className="w-4 h-4" />
                </button>
              </div>
            ) : settings.activeSkin === 'ios' ? (
              /* iOS Home Bar */
              <div
                onClick={() => setCurrentApp('launcher')}
                className="w-32 h-1 bg-slate-600 rounded-full cursor-pointer hover:bg-slate-400 transition-colors"
              />
            ) : (
              /* Cyber HUD Bottom Bar */
              <div className="flex items-center justify-between w-full px-6">
                <button
                  onClick={() => setCurrentApp('launcher')}
                  className="flex items-center gap-1.5 text-[10px] font-mono text-cyan-400/80 hover:text-cyan-300"
                >
                  <Home className="w-3.5 h-3.5" />
                  <span>DASH</span>
                </button>
                <div
                  onClick={() => setCurrentApp('launcher')}
                  className="w-16 h-1 bg-cyan-500/60 rounded-full cursor-pointer shadow-sm shadow-cyan-400"
                />
                <button
                  onClick={() => setCurrentApp('settings')}
                  className="flex items-center gap-1.5 text-[10px] font-mono text-cyan-400/80 hover:text-cyan-300"
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>SYS</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
