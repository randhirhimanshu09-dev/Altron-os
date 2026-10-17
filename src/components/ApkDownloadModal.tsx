import React, { useState } from 'react';
import {
  X,
  Download,
  CheckCircle2,
  Smartphone,
  ShieldCheck,
  AlertTriangle,
  ExternalLink,
  Copy,
  Check,
  Package,
  Layers,
  Sparkles,
  Zap,
  FolderDown,
  ArrowRight
} from 'lucide-react';
import { soundEngine } from '../services/audioSynth';

interface ApkDownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTriggerPwaInstall?: () => void;
  deferredInstallPrompt?: any;
}

export const ApkDownloadModal: React.FC<ApkDownloadModalProps> = ({
  isOpen,
  onClose,
  onTriggerPwaInstall,
  deferredInstallPrompt,
}) => {
  const [downloadStarted, setDownloadStarted] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [activeTab, setActiveTab] = useState<'apk' | 'guide' | 'developer'>('apk');

  if (!isOpen) return null;

  const apkUrl = `${window.location.origin}/api/download/altron.apk`;
  const projectZipUrl = `${window.location.origin}/api/download/altron-project.zip`;

  const handleDownloadApk = () => {
    soundEngine.playAcknowledge();
    setDownloadStarted(true);
    
    // Direct link trigger for browser download
    const link = document.createElement('a');
    link.href = '/api/download/altron.apk';
    link.download = 'altron-os-v1.0.apk';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => {
      setDownloadStarted(false);
    }, 6000);
  };

  const handleDownloadProjectZip = () => {
    soundEngine.playBoot();
    const link = document.createElement('a');
    link.href = '/api/download/altron-project.zip';
    link.download = 'altron-android-project.zip';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const copyApkDownloadLink = () => {
    navigator.clipboard.writeText(apkUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-xl max-h-[92vh] flex flex-col bg-slate-950 border border-cyan-500/50 rounded-2xl shadow-[0_0_50px_rgba(6,182,212,0.3)] overflow-hidden text-slate-100 font-sans">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-cyan-500/30 bg-slate-900/90">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-emerald-500 flex items-center justify-center shadow-md shadow-cyan-500/30">
              <Package className="w-4 h-4 text-slate-950 font-bold" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-mono font-bold text-base text-cyan-300 tracking-wide">
                  DOWNLOAD ALTRON APK
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-950 border border-cyan-500/40 text-cyan-400">
                  Android APK v1.0
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono">
                Standalone Native Android Package for Mobile
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center border-b border-slate-800 bg-slate-900/50 px-4 pt-2 gap-2">
          <button
            onClick={() => setActiveTab('apk')}
            className={`pb-2.5 px-3 text-xs font-mono font-bold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'apk'
                ? 'border-cyan-400 text-cyan-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Download className="w-3.5 h-3.5" />
            APK Package
          </button>
          <button
            onClick={() => setActiveTab('guide')}
            className={`pb-2.5 px-3 text-xs font-mono font-bold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'guide'
                ? 'border-cyan-400 text-cyan-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            Install Steps
          </button>
          <button
            onClick={() => setActiveTab('developer')}
            className={`pb-2.5 px-3 text-xs font-mono font-bold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'developer'
                ? 'border-cyan-400 text-cyan-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            Source Project
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4 max-h-[calc(92vh-130px)]">
          {activeTab === 'apk' && (
            <div className="space-y-4">
              {/* Main Download Card */}
              <div className="p-4 rounded-xl bg-gradient-to-br from-slate-900 via-slate-900 to-cyan-950/40 border border-cyan-500/40 flex flex-col items-center text-center relative overflow-hidden">
                <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-400/40 flex items-center justify-center mb-3 shadow-[0_0_25px_rgba(6,182,212,0.3)]">
                  <Download className="w-8 h-8 text-cyan-400 animate-bounce" />
                </div>

                <h4 className="text-lg font-bold font-mono text-white mb-1">
                  altron-os-v1.0.apk
                </h4>
                <p className="text-xs text-slate-300 max-w-md mb-3">
                  Autonomous voice-controlled operating system. Hands-free calling with Truecaller verification, music streaming, camera, and device control.
                </p>

                {/* Package Spec Pills */}
                <div className="flex flex-wrap items-center justify-center gap-2 mb-4 text-[11px] font-mono">
                  <span className="px-2.5 py-1 rounded-md bg-black/60 border border-slate-700 text-slate-300">
                    📦 Size: ~308 KB
                  </span>
                  <span className="px-2.5 py-1 rounded-md bg-black/60 border border-slate-700 text-cyan-300">
                    ID: com.altron.os
                  </span>
                  <span className="px-2.5 py-1 rounded-md bg-black/60 border border-emerald-500/40 text-emerald-300 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" />
                    Verified Safe
                  </span>
                  <span className="px-2.5 py-1 rounded-md bg-black/60 border border-slate-700 text-slate-300">
                    Android 5.0+ (API 21-34)
                  </span>
                </div>

                {/* Big Direct Download Button */}
                <button
                  onClick={handleDownloadApk}
                  className="w-full sm:w-auto px-8 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-400 hover:from-cyan-400 hover:to-teal-300 text-slate-950 font-mono font-bold text-sm tracking-wide shadow-[0_0_25px_rgba(6,182,212,0.5)] active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  <Download className="w-5 h-5 text-slate-950" />
                  <span>DOWNLOAD ALTRON APK NOW</span>
                </button>

                {downloadStarted && (
                  <div className="mt-3 text-xs font-mono text-emerald-300 flex items-center gap-1.5 animate-pulse">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Download started! Check your phone's notification shade or Downloads folder.</span>
                  </div>
                )}
              </div>

              {/* Direct Link & Copy */}
              <div className="p-3 rounded-xl bg-black/60 border border-slate-800 flex items-center justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <span className="text-[10px] font-mono text-slate-400 block mb-0.5">DIRECT APK LINK:</span>
                  <span className="text-xs font-mono text-cyan-300 truncate block">
                    {apkUrl}
                  </span>
                </div>
                <button
                  onClick={copyApkDownloadLink}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-mono text-slate-200 flex items-center gap-1 shrink-0 active:scale-95 transition-all"
                >
                  {copiedLink ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Copy Link</span>
                    </>
                  )}
                </button>
              </div>

              {/* Instant WebAPK Alternative */}
              {deferredInstallPrompt && (
                <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Zap className="w-5 h-5 text-emerald-400" />
                    <div>
                      <p className="text-xs font-bold text-emerald-200">1-Tap WebAPK Install Available</p>
                      <p className="text-[11px] text-emerald-300/80">Installs directly via Android Play Store WebAPK engine</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      if (onTriggerPwaInstall) onTriggerPwaInstall();
                      onClose();
                    }}
                    className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-mono font-bold active:scale-95 transition-all"
                  >
                    1-Tap Install
                  </button>
                </div>
              )}

              {/* Quick 3-Step Summary */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-left">
                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="text-xs font-mono font-bold text-cyan-400 block mb-1">1. DOWNLOAD</span>
                  <p className="text-[11px] text-slate-400">Save `altron-os-v1.0.apk` to your phone.</p>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="text-xs font-mono font-bold text-cyan-400 block mb-1">2. OPEN APK</span>
                  <p className="text-[11px] text-slate-400">Tap notification or file in Downloads folder.</p>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="text-xs font-mono font-bold text-cyan-400 block mb-1">3. ALLOW & INSTALL</span>
                  <p className="text-[11px] text-slate-400">Toggle "Allow from this source" & tap Install.</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'guide' && (
            <div className="space-y-3 text-left">
              <h4 className="text-xs font-mono font-bold text-cyan-300 uppercase tracking-wider">
                Step-by-Step Android APK Installation Instructions
              </h4>

              <div className="space-y-2.5 text-xs">
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 font-bold font-mono flex items-center justify-center shrink-0">
                    1
                  </div>
                  <div>
                    <p className="font-semibold text-white">Download the APK file</p>
                    <p className="text-slate-400 mt-0.5 text-[11px]">
                      Tap the "DOWNLOAD ALTRON APK NOW" button on the first tab. Your browser will prompt: <span className="text-cyan-300 font-mono">"File might be harmful. Do you want to download altron-os-v1.0.apk anyway?"</span>
                    </p>
                    <p className="text-emerald-400 text-[11px] mt-0.5">
                      ✓ Tap <strong>"Download anyway"</strong>.
                    </p>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 font-bold font-mono flex items-center justify-center shrink-0">
                    2
                  </div>
                  <div>
                    <p className="font-semibold text-white">Open the downloaded APK</p>
                    <p className="text-slate-400 mt-0.5 text-[11px]">
                      Swipe down from top of your screen to open the Android Notification shade, or open your phone's <strong>Files</strong> / <strong>Downloads</strong> app and tap <strong>altron-os-v1.0.apk</strong>.
                    </p>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 font-bold font-mono flex items-center justify-center shrink-0">
                    3
                  </div>
                  <div>
                    <p className="font-semibold text-white">Enable "Allow from this source" (If prompted)</p>
                    <p className="text-slate-400 mt-0.5 text-[11px]">
                      Android will display: <em>"For your security, your phone is not allowed to install unknown apps from this source."</em>
                    </p>
                    <p className="text-cyan-300 text-[11px] mt-1 font-mono">
                      Tap Settings → Switch ON "Allow from this source" → Tap Back.
                    </p>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 font-bold font-mono flex items-center justify-center shrink-0">
                    4
                  </div>
                  <div>
                    <p className="font-semibold text-emerald-300">Tap "Install" and Launch ALTRON</p>
                    <p className="text-slate-400 mt-0.5 text-[11px]">
                      Tap <strong>"Install"</strong>. Once installation completes, tap <strong>"Open"</strong>. ALTRON OS icon will appear on your phone's home screen!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'developer' && (
            <div className="space-y-3 text-left">
              <h4 className="text-xs font-mono font-bold text-cyan-300 uppercase tracking-wider">
                Android Studio Native Source Project
              </h4>
              <p className="text-xs text-slate-300">
                You can also download the complete Android Studio Kotlin/Gradle project to build your own custom-signed release APK with your own keystore or publish to Google Play.
              </p>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-cyan-300 font-bold">altron-android-project.zip</span>
                  <button
                    onClick={handleDownloadProjectZip}
                    className="px-3 py-1 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono text-xs font-bold flex items-center gap-1 active:scale-95 transition-all"
                  >
                    <FolderDown className="w-3.5 h-3.5" />
                    Download Zip
                  </button>
                </div>
                <p className="text-[11px] text-slate-400 font-mono">
                  Includes: AndroidManifest.xml, MainActivity.kt, Gradle build scripts, app icons, and WebApp container.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-black/60 border border-slate-800 font-mono text-[11px] text-slate-400 space-y-1">
                <span className="text-cyan-400 block font-bold">Build Command:</span>
                <code>$ unzip altron-android-project.zip</code><br />
                <code>$ ./gradlew assembleRelease</code><br />
                <span className="text-emerald-400 block mt-1">Output: app/build/outputs/apk/release/app-release.apk</span>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-900 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 font-mono">
          <span className="flex items-center gap-1 text-cyan-400">
            <Sparkles className="w-3.5 h-3.5" />
            Centralized ALTRON Engine
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
