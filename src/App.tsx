import React, { useState, useEffect } from 'react';
import {
  AppId,
  Contact,
  ChatMessage,
  ActiveCall,
  PhoneSettings,
  GeminiCommandResult,
  VoiceLog,
} from './types';
import { MobileFrame } from './components/MobileFrame';
import { PhoneApp } from './components/apps/PhoneApp';
import { MessagesApp } from './components/apps/MessagesApp';
import { CameraApp } from './components/apps/CameraApp';
import { MusicApp } from './components/apps/MusicApp';
import { MapsApp } from './components/apps/MapsApp';
import { SettingsApp } from './components/apps/SettingsApp';
import { DiagnosticsApp } from './components/apps/DiagnosticsApp';
import { VoiceController } from './components/VoiceController';
import { SetupModal } from './components/SetupModal';
import { ShareUrlModal } from './components/ShareUrlModal';
import { ApkDownloadModal } from './components/ApkDownloadModal';
import { soundEngine } from './services/audioSynth';
import { Rocket, Zap, Download } from 'lucide-react';

export default function App() {
  // Mobile OS State
  const [currentApp, setCurrentApp] = useState<AppId>('launcher');
  const [setupModalOpen, setSetupModalOpen] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [apkModalOpen, setApkModalOpen] = useState(false);
  const [recentCommandResult, setRecentCommandResult] = useState<GeminiCommandResult | null>(null);

  // Voice Interaction States
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceLogs, setVoiceLogs] = useState<VoiceLog[]>([]);

  // PWA Install Prompt State & Installation Detection
  const [deferredInstallPrompt, setDeferredInstallPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if running in standalone PWA mode
    const checkStandalone = () => {
      const isStandalone =
        window.matchMedia('(display-mode: standalone)').matches ||
        (navigator as any).standalone === true;
      setIsInstalled(isStandalone);
    };
    checkStandalone();

    const handleBeforeInstall = (e: any) => {
      e.preventDefault();
      setDeferredInstallPrompt(e);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredInstallPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  // Highly reliable install trigger:
  // If native prompt is available -> launches native prompt immediately!
  // If on iOS or iframe or prompt waiting -> opens dedicated install guide with 100% actionable paths
  const handleTriggerInstall = async () => {
    if (deferredInstallPrompt) {
      try {
        deferredInstallPrompt.prompt();
        const choice = await deferredInstallPrompt.userChoice;
        if (choice.outcome === 'accepted') {
          setIsInstalled(true);
          setDeferredInstallPrompt(null);
        }
      } catch (err) {
        console.warn('Install trigger warning:', err);
        setSetupModalOpen(true);
      }
    } else {
      setSetupModalOpen(true);
    }
  };

  // Direct Standalone APK Download Trigger
  const handleDownloadApkDirect = () => {
    soundEngine.playAcknowledge();
    const link = document.createElement('a');
    link.href = '/api/download/altron.apk';
    link.download = 'altron-os-v1.0.apk';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setApkModalOpen(true);
  };

  // Phone Hardware Settings
  const [settings, setSettings] = useState<PhoneSettings>({
    flashlight: false,
    volume: 85,
    brightness: 95,
    wifi: true,
    bluetooth: true,
    airplaneMode: false,
    cellularSignal: 4,
    batteryLevel: 94,
    batteryCharging: true,
    screenLocked: false,
    activeSkin: 'cyber',
    voicePersona: 'Cyber',
    speechRate: 1.05,
    speechPitch: 0.95,
    autoVoiceResponse: true,
    defaultCallApp: 'truecaller',
    truecallerCallerIdEnabled: true,
    autoLaunchNativeDialer: false,
  });

  // Contacts Book
  const [contacts, setContacts] = useState<Contact[]>([
    {
      id: 'c1',
      name: 'Sarah Jenkins',
      number: '+1 (555) 234-5678',
      avatarColor: 'bg-emerald-600',
      status: 'Executive Director',
      initials: 'SJ',
      isFavorite: true,
    },
    {
      id: 'c2',
      name: 'Marcus Reed',
      number: '+1 (555) 876-5432',
      avatarColor: 'bg-blue-600',
      status: 'Lead Security Engineer',
      initials: 'MR',
      isFavorite: true,
    },
    {
      id: 'c3',
      name: 'Dr. Elena Rostova',
      number: '+1 (555) 432-1098',
      avatarColor: 'bg-purple-600',
      status: 'Quantum AI Researcher',
      initials: 'ER',
      isFavorite: false,
    },
    {
      id: 'c4',
      name: 'Alex Vance',
      number: '+1 (555) 345-6789',
      avatarColor: 'bg-amber-600',
      status: 'Autonomous Core Team',
      initials: 'AV',
      isFavorite: true,
    },
  ]);

  // Messages Database
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      contactId: 'c1',
      sender: 'contact',
      text: 'Hey! Are you ready for the autonomous systems review today?',
      timestamp: '10:04 AM',
    },
    {
      id: 'm2',
      contactId: 'c1',
      sender: 'user',
      text: 'Yes Sarah, ALTRON OS is fully compiled and running at 60fps.',
      timestamp: '10:06 AM',
    },
    {
      id: 'm3',
      contactId: 'c2',
      sender: 'contact',
      text: 'Perimeter firewalls and hardware sandbox verified. Zero leaks detected.',
      timestamp: '09:45 AM',
    },
    {
      id: 'm4',
      contactId: 'c4',
      sender: 'contact',
      text: 'Let me know once you are on your way downtown.',
      timestamp: 'Yesterday',
    },
  ]);

  // Active Live Call State
  const [activeCall, setActiveCall] = useState<ActiveCall>({
    active: false,
    contactName: '',
    phoneNumber: '',
    duration: 0,
    status: 'dialing',
    isMuted: false,
    isSpeaker: true,
    callProvider: 'truecaller',
  });

  // Call timer effect
  useEffect(() => {
    let interval: any = null;
    if (activeCall.active && activeCall.status === 'connected') {
      interval = setInterval(() => {
        setActiveCall(prev => ({ ...prev, duration: prev.duration + 1 }));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [activeCall.active, activeCall.status]);

  // Start Voice Call with Truecaller & Native Dialer Linking
  const handleStartCall = (
    contactName: string,
    phoneNumber: string,
    provider: 'altron' | 'truecaller' | 'native' | 'whatsapp' = 'truecaller'
  ) => {
    soundEngine.startRingtone();
    const cleanDigits = phoneNumber.replace(/\D/g, '');

    const truecallerData = {
      name: contactName,
      number: phoneNumber,
      verified: true,
      spamScore: 0,
      spamReports: 0,
      carrier: 'Truecaller Verified 5G / VoLTE',
      badge: 'Verified Personal' as const,
      location: 'Active Mobile Line',
    };

    setActiveCall({
      active: true,
      contactName,
      phoneNumber,
      duration: 0,
      status: 'dialing',
      isMuted: false,
      isSpeaker: true,
      callProvider: provider,
      truecallerInfo: truecallerData,
    });
    setCurrentApp('phone');

    if (provider === 'native' || (settings.autoLaunchNativeDialer && cleanDigits)) {
      window.location.href = `tel:${cleanDigits}`;
    } else if (provider === 'truecaller' && cleanDigits) {
      window.location.href = `truecaller://callerid?phone=${cleanDigits}`;
    } else if (provider === 'whatsapp' && cleanDigits) {
      window.open(`https://wa.me/${cleanDigits}`, '_blank');
    }

    setTimeout(() => {
      setActiveCall(prev => {
        if (prev.active && prev.status === 'dialing') {
          soundEngine.stopRingtone();
          soundEngine.playAcknowledge();

          if ('speechSynthesis' in window && settings.autoVoiceResponse) {
            const greeting = `Hello! This is ${contactName}. I received your call via ALTRON and Truecaller. How can I help you?`;
            const utterance = new SpeechSynthesisUtterance(greeting);
            utterance.rate = 1.0;
            window.speechSynthesis.speak(utterance);
          }

          return { ...prev, status: 'connected' };
        }
        return prev;
      });
    }, 2800);
  };

  // End Voice Call
  const handleEndCall = () => {
    soundEngine.stopRingtone();
    soundEngine.playBoot();
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setActiveCall(prev => ({ ...prev, status: 'ended' }));
    setTimeout(() => {
      setActiveCall({
        active: false,
        contactName: '',
        phoneNumber: '',
        duration: 0,
        status: 'dialing',
        isMuted: false,
        isSpeaker: false,
        callProvider: 'truecaller',
      });
    }, 400);
  };

  // Send message
  const handleSendMessage = (contactId: string, text: string) => {
    const newMsg: ChatMessage = {
      id: `m_${Date.now()}`,
      contactId,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages(prev => [...prev, newMsg]);
  };

  // Read message aloud via TTS
  const handleReadAloud = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = settings.speechRate;
    window.speechSynthesis.speak(utterance);
  };

  // Centralized command result handler:
  // Updates central status and executes actions directly WITHOUT POPUP DIALOGUE BOXES
  const handleCommandResult = (result: GeminiCommandResult, transcript: string) => {
    const { action, actionPayload } = result;

    setRecentCommandResult(result);

    setVoiceLogs(prev => [
      {
        id: `log_${Date.now()}`,
        timestamp: new Date().toLocaleTimeString(),
        transcript,
        response: result.speech,
        actionExecuted: action,
      },
      ...prev.slice(0, 19),
    ]);

    switch (action) {
      case 'CALL': {
        const target = actionPayload?.target || 'Sarah Jenkins';
        const num = actionPayload?.phoneNumber || '+1 (555) 234-5678';
        const provider = actionPayload?.provider || settings.defaultCallApp || 'truecaller';
        handleStartCall(target, num, provider);
        break;
      }
      case 'END_CALL': {
        handleEndCall();
        break;
      }
      case 'TRUECALLER_LOOKUP': {
        setCurrentApp('phone');
        break;
      }
      case 'SEND_MESSAGE': {
        const recipient = actionPayload?.recipient || 'Alex Vance';
        const content = actionPayload?.content || 'On my way';
        const matched = contacts.find(c => c.name.toLowerCase().includes(recipient.toLowerCase())) || contacts[0];
        handleSendMessage(matched.id, content);
        setCurrentApp('messages');
        break;
      }
      case 'READ_MESSAGES': {
        setCurrentApp('messages');
        break;
      }
      case 'TOGGLE_FLASHLIGHT': {
        const enabled = actionPayload?.enabled !== undefined ? actionPayload.enabled : !settings.flashlight;
        setSettings(s => ({ ...s, flashlight: enabled }));
        break;
      }
      case 'SET_VOLUME': {
        const level = Math.max(0, Math.min(100, actionPayload?.level ?? 80));
        setSettings(s => ({ ...s, volume: level }));
        break;
      }
      case 'TOGGLE_WIFI': {
        const enabled = actionPayload?.enabled !== undefined ? actionPayload.enabled : !settings.wifi;
        setSettings(s => ({ ...s, wifi: enabled }));
        break;
      }
      case 'TOGGLE_BLUETOOTH': {
        const enabled = actionPayload?.enabled !== undefined ? actionPayload.enabled : !settings.bluetooth;
        setSettings(s => ({ ...s, bluetooth: enabled }));
        break;
      }
      case 'SET_BRIGHTNESS': {
        const level = Math.max(10, Math.min(100, actionPayload?.level ?? 90));
        setSettings(s => ({ ...s, brightness: level }));
        break;
      }
      case 'OPEN_APP': {
        const appId = (actionPayload?.appId as AppId) || 'launcher';
        setCurrentApp(appId);
        break;
      }
      case 'PLAY_MUSIC': {
        soundEngine.toggleMusic(true);
        break;
      }
      case 'PAUSE_MUSIC': {
        soundEngine.stopMusic();
        break;
      }
      case 'TAKE_PHOTO': {
        setCurrentApp('camera');
        setTimeout(() => soundEngine.playCameraClick(), 800);
        break;
      }
      case 'NAVIGATE': {
        setCurrentApp('maps');
        break;
      }
      case 'DEVICE_DIAGNOSTICS': {
        setCurrentApp('diagnostics');
        break;
      }
      case 'SETUP_GUIDE': {
        setSetupModalOpen(true);
        break;
      }
      case 'DOWNLOAD_APK': {
        handleDownloadApkDirect();
        break;
      }
      default:
        break;
    }
  };

  const handleUpdateSettings = (updates: Partial<PhoneSettings>) => {
    setSettings(prev => ({ ...prev, ...updates }));
  };

  // Central Launch Handler for ALTRON OS (Direct into dashboard with NO popup dialog box)
  const handleLaunchAltronOS = () => {
    soundEngine.playWakeChime();
    if (settings.screenLocked) {
      setSettings(prev => ({ ...prev, screenLocked: false }));
    }
    setCurrentApp('launcher');
    setIsListening(true);
  };

  return (
    <div className="min-h-screen w-full bg-slate-950 font-sans antialiased text-white flex flex-col justify-between">
      
      {/* Top Controls & App Launcher Bar */}
      <div className="w-full max-w-[420px] mx-auto pt-3 px-3 space-y-2 z-30">
        {/* Main "LAUNCH ALTRON OS" Action Button */}
        <button
          onClick={handleLaunchAltronOS}
          className="w-full flex items-center justify-between px-4 py-2.5 rounded-2xl bg-gradient-to-r from-cyan-600 via-teal-500 to-cyan-500 hover:from-cyan-500 hover:to-teal-400 text-white font-bold text-xs tracking-wide shadow-xl shadow-cyan-500/30 border border-cyan-300/40 active:scale-98 transition-all group"
          title="Launch Altron OS Central Dashboard"
        >
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-xl bg-white/20 text-white group-hover:scale-110 transition-transform">
              <Rocket className="w-4 h-4 fill-white" />
            </div>
            <div className="text-left">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-black uppercase tracking-wider">LAUNCH ALTRON OS</span>
                <span className="w-2 h-2 rounded-full bg-emerald-300 animate-ping" />
              </div>
              <p className="text-[10px] text-cyan-100 font-normal">
                Centralized Voice OS Dashboard
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1 text-[10px] font-mono bg-black/35 px-2 py-1 rounded-lg border border-white/20 text-cyan-200">
            <span>START</span>
            <span className="text-emerald-400 font-bold">⚡</span>
          </div>
        </button>

        {/* Secondary Utility Links */}
        <div className="flex items-center justify-between text-xs gap-1.5 flex-wrap">
          <button
            onClick={() => setShareModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/95 hover:bg-slate-800 border border-cyan-500/50 text-cyan-300 font-mono text-[11px] transition-all shadow-lg shadow-cyan-500/15 active:scale-95 cursor-pointer"
            title="Open Published URL (hks.alton) & Mobile QR Code"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-bold text-white">hks.alton</span>
            <span className="text-[10px] text-emerald-400 font-semibold">• Public</span>
          </button>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleDownloadApkDirect}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-emerald-950/90 to-teal-950/90 hover:from-emerald-900 hover:to-teal-900 border border-emerald-500/50 hover:border-emerald-400 text-emerald-300 font-mono text-[11px] transition-all active:scale-95 shadow-md shadow-emerald-500/20 cursor-pointer"
              title="Download Standalone Android APK file (altron-os-v1.0.apk)"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              <span>Download APK 📥</span>
            </button>

            <button
              onClick={handleTriggerInstall}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border font-mono text-[11px] transition-all active:scale-95 shadow-md cursor-pointer ${
                isInstalled
                  ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-300'
                  : deferredInstallPrompt
                  ? 'bg-cyan-950/90 border-cyan-400 text-cyan-200 animate-pulse shadow-cyan-500/20'
                  : 'bg-slate-900/95 hover:bg-slate-800 border-cyan-500/40 hover:border-cyan-400 text-cyan-300 shadow-cyan-500/10'
              }`}
              title="Install ALTRON Standalone App on Phone Home Screen"
            >
              <Download className={`w-3.5 h-3.5 ${isInstalled ? 'text-emerald-400' : 'text-cyan-400'}`} />
              <span>
                {isInstalled ? 'App Installed ✓' : deferredInstallPrompt ? 'Install App ⚡' : 'Install App 📲'}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Mobile Frame Device Shell */}
      <MobileFrame
        currentApp={currentApp}
        setCurrentApp={setCurrentApp}
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
        isListening={isListening}
        isProcessing={isProcessing}
        isSpeaking={isSpeaking}
        activeCallDuration={activeCall.active ? activeCall.duration : undefined}
        isMusicPlaying={soundEngine.getMusicPlayingState()}
        onOpenVoiceTrigger={() => {
          setCurrentApp('launcher');
          setIsListening(true);
        }}
        onOpenSetupGuide={() => setSetupModalOpen(true)}
        onOpenInstall={handleTriggerInstall}
        onOpenApkModal={handleDownloadApkDirect}
        isInstalled={isInstalled}
        onStartCall={handleStartCall}
      >
        {/* Render Application Views */}
        {currentApp === 'phone' && (
          <PhoneApp
            contacts={contacts}
            activeCall={activeCall}
            onStartCall={handleStartCall}
            onEndCall={handleEndCall}
            onToggleMute={() => setActiveCall(c => ({ ...c, isMuted: !c.isMuted }))}
            onToggleSpeaker={() => setActiveCall(c => ({ ...c, isSpeaker: !c.isSpeaker }))}
          />
        )}

        {currentApp === 'messages' && (
          <MessagesApp
            contacts={contacts}
            messages={messages}
            onSendMessage={handleSendMessage}
            onReadAloud={handleReadAloud}
          />
        )}

        {currentApp === 'camera' && <CameraApp />}

        {currentApp === 'music' && <MusicApp />}

        {currentApp === 'maps' && <MapsApp />}

        {currentApp === 'diagnostics' && <DiagnosticsApp settings={settings} />}

        {currentApp === 'settings' && (
          <SettingsApp
            settings={settings}
            onUpdateSettings={handleUpdateSettings}
            onOpenSetupGuide={() => setSetupModalOpen(true)}
          />
        )}

        {currentApp === 'setup' && (
          <div className="p-4 h-full flex flex-col justify-between text-white">
            <div className="space-y-3">
              <h3 className="font-bold text-base text-cyan-300">ALTRON Phone App Setup</h3>
              <p className="text-xs text-slate-300">
                Install ALTRON directly onto your mobile phone and configure the swipe-down Quick Settings tile.
              </p>
              <button
                onClick={handleTriggerInstall}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-teal-500 hover:from-cyan-500 hover:to-teal-400 font-bold text-xs transition-all shadow-lg shadow-cyan-600/30 flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>
                  {isInstalled ? 'ALTRON OS Installed ✓' : deferredInstallPrompt ? 'Install App Directly ⚡' : 'Install ALTRON on Mobile'}
                </span>
              </button>
            </div>
          </div>
        )}

        {/* Central Dashboard Integrated Voice Controller (NO POPUP DIALOGUE BOXES) */}
        {currentApp === 'launcher' && (
          <VoiceController
            onCommandResult={(res, transcript) => {
              handleCommandResult(res, transcript);
            }}
            settings={settings}
            currentContext={{
              currentApp,
              activeCall,
              contacts,
              flashlight: settings.flashlight,
              volume: settings.volume,
              wifi: settings.wifi,
              bluetooth: settings.bluetooth,
              defaultCallApp: settings.defaultCallApp,
            }}
            isListening={isListening}
            setIsListening={setIsListening}
            isProcessing={isProcessing}
            setIsProcessing={setIsProcessing}
            isSpeaking={isSpeaking}
            setIsSpeaking={setIsSpeaking}
            recentCommandResult={recentCommandResult}
          />
        )}
      </MobileFrame>

      {/* Floating Persistent LAUNCH ALTRON OS Action Button */}
      <div className="fixed bottom-4 right-4 z-40">
        <button
          onClick={handleLaunchAltronOS}
          className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-gradient-to-r from-cyan-600 to-teal-500 hover:from-cyan-500 hover:to-teal-400 text-white font-bold text-xs tracking-wider shadow-2xl shadow-cyan-500/50 border border-cyan-300/40 active:scale-95 transition-all group backdrop-blur-md"
          title="Tap to Launch ALTRON OS Dashboard"
        >
          <Rocket className="w-4 h-4 fill-white group-hover:rotate-12 transition-transform" />
          <span>LAUNCH ALTRON OS</span>
        </button>
      </div>

      {/* Step-by-Step Mobile Installation & Quick Settings Tile Modal */}
      <SetupModal
        isOpen={setupModalOpen}
        onClose={() => setSetupModalOpen(false)}
        onLaunchAltronOS={handleLaunchAltronOS}
        deferredInstallPrompt={deferredInstallPrompt}
      />

      {/* Share / Published URL & Phone QR Code Modal */}
      <ShareUrlModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        onLaunchAltronOS={handleLaunchAltronOS}
      />

      {/* Standalone Android APK Download & Source Project Modal */}
      <ApkDownloadModal
        isOpen={apkModalOpen}
        onClose={() => setApkModalOpen(false)}
        onTriggerPwaInstall={handleTriggerInstall}
        deferredInstallPrompt={deferredInstallPrompt}
      />
    </div>
  );
}
