import React from 'react';
import { Wifi, Bluetooth, Flashlight, Volume2, Sun, Plane, Smartphone, HelpCircle, Sparkles, Download } from 'lucide-react';
import { PhoneSettings, DeviceSkin } from '../../types';
import { soundEngine } from '../../services/audioSynth';

interface SettingsAppProps {
  settings: PhoneSettings;
  onUpdateSettings: (updates: Partial<PhoneSettings>) => void;
  onOpenSetupGuide: () => void;
}

export const SettingsApp: React.FC<SettingsAppProps> = ({
  settings,
  onUpdateSettings,
  onOpenSetupGuide,
}) => {
  const toggleFlashlight = () => {
    soundEngine.playAcknowledge();
    onUpdateSettings({ flashlight: !settings.flashlight });
  };

  const toggleWifi = () => {
    soundEngine.playAcknowledge();
    onUpdateSettings({ wifi: !settings.wifi });
  };

  const toggleBluetooth = () => {
    soundEngine.playAcknowledge();
    onUpdateSettings({ bluetooth: !settings.bluetooth });
  };

  const toggleAirplane = () => {
    soundEngine.playAcknowledge();
    onUpdateSettings({ airplaneMode: !settings.airplaneMode });
  };

  const setSkin = (skin: DeviceSkin) => {
    soundEngine.playAcknowledge();
    onUpdateSettings({ activeSkin: skin });
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 text-white select-none p-4 overflow-y-auto space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
        <h3 className="font-bold text-sm text-white">ALTRON OS Settings</h3>
        <span className="text-[10px] font-mono text-cyan-400">BUILD 2026.10</span>
      </div>

      {/* Quick Wireless & Hardware Toggles */}
      <div className="grid grid-cols-2 gap-2.5">
        {/* Wi-Fi */}
        <button
          onClick={toggleWifi}
          className={`flex items-center gap-3 p-3 rounded-2xl border transition-all ${
            settings.wifi
              ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300'
              : 'bg-slate-900/60 border-slate-800 text-slate-400'
          }`}
        >
          <Wifi className="w-5 h-5" />
          <div className="text-left">
            <div className="text-xs font-semibold">Wi-Fi 6E</div>
            <div className="text-[10px] font-mono text-slate-400">{settings.wifi ? 'Altron-Mesh-5G' : 'Disconnected'}</div>
          </div>
        </button>

        {/* Bluetooth */}
        <button
          onClick={toggleBluetooth}
          className={`flex items-center gap-3 p-3 rounded-2xl border transition-all ${
            settings.bluetooth
              ? 'bg-blue-500/20 border-blue-500/40 text-blue-300'
              : 'bg-slate-900/60 border-slate-800 text-slate-400'
          }`}
        >
          <Bluetooth className="w-5 h-5" />
          <div className="text-left">
            <div className="text-xs font-semibold">Bluetooth 5.4</div>
            <div className="text-[10px] font-mono text-slate-400">{settings.bluetooth ? 'Connected' : 'Off'}</div>
          </div>
        </button>

        {/* Flashlight */}
        <button
          onClick={toggleFlashlight}
          className={`flex items-center gap-3 p-3 rounded-2xl border transition-all ${
            settings.flashlight
              ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
              : 'bg-slate-900/60 border-slate-800 text-slate-400'
          }`}
        >
          <Flashlight className="w-5 h-5" />
          <div className="text-left">
            <div className="text-xs font-semibold">Flashlight</div>
            <div className="text-[10px] font-mono text-slate-400">{settings.flashlight ? 'Torch ON' : 'Off'}</div>
          </div>
        </button>

        {/* Airplane Mode */}
        <button
          onClick={toggleAirplane}
          className={`flex items-center gap-3 p-3 rounded-2xl border transition-all ${
            settings.airplaneMode
              ? 'bg-red-500/20 border-red-500/40 text-red-300'
              : 'bg-slate-900/60 border-slate-800 text-slate-400'
          }`}
        >
          <Plane className="w-5 h-5" />
          <div className="text-left">
            <div className="text-xs font-semibold">Flight Mode</div>
            <div className="text-[10px] font-mono text-slate-400">{settings.airplaneMode ? 'Active' : 'Disabled'}</div>
          </div>
        </button>
      </div>

      {/* Sliders: Volume & Brightness */}
      <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-4">
        <div>
          <div className="flex items-center justify-between text-xs font-medium mb-1.5 text-slate-300">
            <span className="flex items-center gap-1.5">
              <Volume2 className="w-4 h-4 text-cyan-400" /> System Volume
            </span>
            <span className="font-mono text-cyan-400">{settings.volume}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={settings.volume}
            onChange={e => onUpdateSettings({ volume: Number(e.target.value) })}
            className="w-full accent-cyan-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
          />
        </div>

        <div>
          <div className="flex items-center justify-between text-xs font-medium mb-1.5 text-slate-300">
            <span className="flex items-center gap-1.5">
              <Sun className="w-4 h-4 text-amber-400" /> OLED Brightness
            </span>
            <span className="font-mono text-amber-400">{settings.brightness}%</span>
          </div>
          <input
            type="range"
            min="10"
            max="100"
            value={settings.brightness}
            onChange={e => onUpdateSettings({ brightness: Number(e.target.value) })}
            className="w-full accent-amber-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
          />
        </div>
      </div>

      {/* Operating System UI Style (Skin Switcher: Cyber vs Android vs iOS) */}
      <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-2">
        <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
          <Smartphone className="w-4 h-4" />
          <span>DEVICE INTERFACE / OS SKIN</span>
        </div>
        <div className="grid grid-cols-3 gap-2 pt-1">
          {[
            { id: 'cyber', label: 'Cyber HUD', desc: 'Futuristic' },
            { id: 'android', label: 'Android 15', desc: 'Material You' },
            { id: 'ios', label: 'iOS 18', desc: 'Dynamic Island' },
          ].map(skin => (
            <button
              key={skin.id}
              onClick={() => setSkin(skin.id as DeviceSkin)}
              className={`p-2.5 rounded-xl border text-center transition-all ${
                settings.activeSkin === skin.id
                  ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-md shadow-cyan-500/20'
                  : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <div className="text-xs font-semibold">{skin.label}</div>
              <div className="text-[9px] font-mono text-slate-500 mt-0.5">{skin.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Calling App & Truecaller Linking */}
      <div className="p-4 rounded-2xl bg-slate-900/50 border border-blue-500/30 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-mono text-blue-400">
            <span>DEFAULT CALLING & TRUECALLER LINK</span>
          </div>
          <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
            Active
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {[
            { id: 'truecaller', name: 'Truecaller', desc: 'Spam Shield' },
            { id: 'native', name: 'Native Phone', desc: 'Cellular tel:' },
            { id: 'altron', name: 'ALTRON AI', desc: 'Synthetic Core' },
            { id: 'whatsapp', name: 'WhatsApp', desc: 'Voice Call' },
          ].map(app => (
            <button
              key={app.id}
              onClick={() => onUpdateSettings({ defaultCallApp: app.id as any })}
              className={`p-2 rounded-xl border text-left transition-all ${
                settings.defaultCallApp === app.id
                  ? 'bg-blue-600/30 border-blue-400 text-blue-200'
                  : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="text-xs font-semibold">{app.name}</div>
              <div className="text-[9px] text-slate-500">{app.desc}</div>
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between pt-1 border-t border-slate-800 text-xs">
          <span className="text-slate-300">Auto-Launch Device Phone App</span>
          <button
            onClick={() => onUpdateSettings({ autoLaunchNativeDialer: !settings.autoLaunchNativeDialer })}
            className={`w-10 h-5 rounded-full transition-colors relative ${
              settings.autoLaunchNativeDialer ? 'bg-cyan-500' : 'bg-slate-800'
            }`}
          >
            <div
              className={`w-3.5 h-3.5 rounded-full bg-white absolute top-0.5 transition-transform ${
                settings.autoLaunchNativeDialer ? 'left-5' : 'left-1'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Altron Voice Persona & TTS */}
      <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-3">
        <div className="flex items-center gap-2 text-xs font-mono text-purple-400">
          <Sparkles className="w-4 h-4" />
          <span>ALTRON VOICE SYNTHESIS</span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {(['Cyber', 'Executive', 'Nova'] as const).map(p => (
            <button
              key={p}
              onClick={() => onUpdateSettings({ voicePersona: p })}
              className={`py-2 rounded-xl text-xs font-medium border transition-all ${
                settings.voicePersona === p
                  ? 'bg-purple-500/20 border-purple-500/50 text-purple-300'
                  : 'bg-slate-950/60 border-slate-800 text-slate-400'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Direct APK Download Button */}
      <a
        href="/api/download/altron.apk"
        download="altron-os-v1.0.apk"
        className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-gradient-to-r from-emerald-600/30 to-teal-600/30 hover:from-emerald-600/40 hover:to-teal-600/40 border border-emerald-500/40 text-emerald-300 text-xs font-semibold transition-all shadow-lg shadow-emerald-500/10 cursor-pointer active:scale-98"
      >
        <Download className="w-4 h-4 text-emerald-400" />
        <span>Download ALTRON APK (Direct Android .apk)</span>
      </a>

      {/* Mobile App Install & Setup Guide Button */}
      <button
        onClick={onOpenSetupGuide}
        className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-gradient-to-r from-cyan-600/30 to-blue-600/30 hover:from-cyan-600/40 hover:to-blue-600/40 border border-cyan-500/40 text-cyan-300 text-xs font-semibold transition-all shadow-lg shadow-cyan-500/10 cursor-pointer active:scale-98"
      >
        <Download className="w-4 h-4 text-cyan-400" />
        <span>Install ALTRON App & Quick Settings Guide</span>
      </button>
    </div>
  );
};
