import React, { useState, useEffect } from 'react';
import {
  X,
  Smartphone,
  Apple,
  CheckCircle2,
  Mic,
  Zap,
  Shield,
  Sliders,
  Bell,
  Code,
  Copy,
  Check,
  Download,
  Share2,
  ExternalLink,
  PlusSquare,
  MoreVertical,
  QrCode,
  AlertCircle,
  Sparkles,
} from 'lucide-react';

interface SetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLaunchAltronOS?: () => void;
  deferredInstallPrompt?: any;
}

export const SetupModal: React.FC<SetupModalProps> = ({
  isOpen,
  onClose,
  onLaunchAltronOS,
  deferredInstallPrompt,
}) => {
  const [platform, setPlatform] = useState<'install' | 'android' | 'ios' | 'quicksettings' | 'commands'>('install');
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [notifStatus, setNotifStatus] = useState<string | null>(null);
  const [installStatus, setInstallStatus] = useState<'idle' | 'prompting' | 'installed' | 'dismissed' | 'manual' | 'error'>('idle');

  // Device & Environment Detection
  const [isStandalone, setIsStandalone] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);
  const [isInIframe, setIsInIframe] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const standalone = window.matchMedia('(display-mode: standalone)').matches || (navigator as any).standalone === true;
      setIsStandalone(standalone);

      const ua = navigator.userAgent || '';
      const iosCheck = /iPad|iPhone|iPod/.test(ua) && !(window as any).MSStream;
      const androidCheck = /Android/i.test(ua);
      setIsIOS(iosCheck);
      setIsAndroid(androidCheck);

      try {
        setIsInIframe(window.self !== window.top);
      } catch {
        setIsInIframe(true);
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const currentUrl = typeof window !== 'undefined' ? window.location.href : 'https://ais-pre-6qn3priaswvq5unrltez6s-233928667016.asia-southeast1.run.app';

  const copyAppUrl = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2500);
  };

  const handleInstallClick = async () => {
    if (deferredInstallPrompt) {
      try {
        setInstallStatus('prompting');
        deferredInstallPrompt.prompt();
        const choice = await deferredInstallPrompt.userChoice;
        if (choice.outcome === 'accepted') {
          setInstallStatus('installed');
        } else {
          setInstallStatus('dismissed');
        }
      } catch (e) {
        console.warn('Install prompt error:', e);
        setInstallStatus('error');
      }
    } else {
      // If native deferred prompt is not ready (e.g. on iOS Safari, or in preview iframe, or Chrome waiting)
      setInstallStatus('manual');
      if (isIOS) {
        setPlatform('ios');
      } else if (isAndroid) {
        setPlatform('android');
      }
    }
  };

  const openFullscreenInNewTab = () => {
    window.open(currentUrl, '_blank');
  };

  const testNotificationShortcut = async () => {
    if (!('Notification' in window)) {
      setNotifStatus('unsupported');
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        new Notification('⚡ ALTRON OS • Central Quick Launch', {
          body: 'Tap to instantly open your centralized voice-controlled phone dashboard.',
          icon: '/icon-192.png',
          tag: 'altron-qs-shortcut',
        });
        setNotifStatus('granted');
      } else {
        setNotifStatus('denied');
      }
    } catch {
      setNotifStatus('denied');
    }
  };

  const tileServiceCode = `// AltronTileService.kt (Native Android TileService API)
class AltronTileService : TileService() {
    override fun onStartListening() {
        super.onStartListening()
        qsTile?.apply {
            state = Tile.STATE_ACTIVE
            label = "ALTRON OS"
            subtitle = "Central Voice & Controls"
            updateTile()
        }
    }

    override fun onClick() {
        super.onClick()
        val intent = Intent(this, MainActivity::class.java).apply {
            flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_SINGLE_TOP
            putExtra("ACTIVATE_VOICE", true)
        }
        if (isLocked) {
            unlockAndRun { startActivityAndCollapse(intent) }
        } else {
            startActivityAndCollapse(intent)
        }
    }
}`;

  const copyCode = () => {
    navigator.clipboard.writeText(tileServiceCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-xl bg-slate-900 border border-cyan-500/40 rounded-3xl p-5 sm:p-6 text-white shadow-2xl shadow-cyan-500/20 max-h-[92vh] flex flex-col">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white transition-all active:scale-95"
          title="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2.5 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-400">
            <Download className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold tracking-tight text-white flex items-center gap-2">
              <span>Install ALTRON OS on Phone</span>
              {isStandalone ? (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">
                  INSTALLED ✓
                </span>
              ) : deferredInstallPrompt ? (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-bold animate-pulse">
                  1-TAP READY
                </span>
              ) : (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  PWA COMPLIANT
                </span>
              )}
            </h2>
            <p className="text-xs font-mono text-cyan-400">Reliable step-by-step phone app installation & Quick Settings Tile</p>
          </div>
        </div>

        {/* Platform Selector Tabs */}
        <div className="grid grid-cols-5 gap-1 p-1 bg-slate-950 rounded-2xl border border-slate-800 mb-3 text-[11px] font-medium">
          <button
            onClick={() => setPlatform('install')}
            className={`flex items-center justify-center gap-1 py-1.5 px-1 rounded-xl transition-all ${
              platform === 'install'
                ? 'bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Download className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span className="truncate">Install App</span>
          </button>

          <button
            onClick={() => setPlatform('android')}
            className={`flex items-center justify-center gap-1 py-1.5 px-1 rounded-xl transition-all ${
              platform === 'android'
                ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="truncate">Android</span>
          </button>

          <button
            onClick={() => setPlatform('ios')}
            className={`flex items-center justify-center gap-1 py-1.5 px-1 rounded-xl transition-all ${
              platform === 'ios'
                ? 'bg-blue-500/20 border border-blue-500/40 text-blue-300 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Apple className="w-3.5 h-3.5 text-blue-400 shrink-0" />
            <span className="truncate">iPhone</span>
          </button>

          <button
            onClick={() => setPlatform('quicksettings')}
            className={`flex items-center justify-center gap-1 py-1.5 px-1 rounded-xl transition-all ${
              platform === 'quicksettings'
                ? 'bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sliders className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span className="truncate">Quick Tile</span>
          </button>

          <button
            onClick={() => setPlatform('commands')}
            className={`flex items-center justify-center gap-1 py-1.5 px-1 rounded-xl transition-all ${
              platform === 'commands'
                ? 'bg-purple-500/20 border border-purple-500/40 text-purple-300 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Mic className="w-3.5 h-3.5 text-purple-400 shrink-0" />
            <span className="truncate">Commands</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1 text-sm text-slate-300">
          
          {/* STEP BY STEP INSTALL APP TAB */}
          {platform === 'install' && (
            <div className="space-y-3">
              {/* Standalone Success State */}
              {isStandalone && (
                <div className="p-3.5 rounded-2xl bg-emerald-950/70 border border-emerald-500/50 text-emerald-200 flex items-center gap-3">
                  <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
                  <div className="text-xs">
                    <p className="font-bold text-white">ALTRON OS is Already Installed!</p>
                    <p className="text-emerald-300/90 mt-0.5">
                      You are running ALTRON in native standalone app mode on this device.
                    </p>
                  </div>
                </div>
              )}

              {/* Primary Interactive Install Card */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-cyan-950/80 via-slate-900 to-teal-950/70 border-2 border-cyan-400/60 shadow-xl shadow-cyan-500/20 space-y-3">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-2xl bg-cyan-500 text-slate-950 font-black shadow-lg shadow-cyan-400/40 shrink-0">
                      <Download className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-black text-sm text-white flex items-center gap-1.5">
                        <span>Install ALTRON Standalone App</span>
                        {deferredInstallPrompt && (
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                        )}
                      </h3>
                      <p className="text-xs text-cyan-200 mt-0.5">
                        Installs directly onto your phone home screen with custom icon and no browser address bar.
                      </p>
                    </div>
                  </div>

                  {/* Primary Trigger Button */}
                  <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto shrink-0">
                    <button
                      onClick={handleInstallClick}
                      disabled={installStatus === 'prompting'}
                      className="px-4 py-3 rounded-xl bg-gradient-to-r from-cyan-400 via-teal-400 to-cyan-300 hover:from-cyan-300 hover:to-teal-200 active:scale-95 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-cyan-400/40 transition-all cursor-pointer"
                    >
                      <Download className="w-4 h-4 fill-slate-950" />
                      <span>
                        {deferredInstallPrompt
                          ? 'INSTALL (1-TAP)'
                          : isIOS
                          ? 'INSTALL ON IPHONE'
                          : isAndroid
                          ? '1-TAP WEB INSTALL'
                          : '1-TAP WEB INSTALL'}
                      </span>
                    </button>

                    <a
                      href="/api/download/altron.apk"
                      download="altron-os-v1.0.apk"
                      className="px-4 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/30 transition-all cursor-pointer"
                    >
                      <Download className="w-4 h-4 fill-slate-950" />
                      <span>DOWNLOAD APK (v1.0)</span>
                    </a>
                  </div>
                </div>

                {/* State Feedbacks */}
                {installStatus === 'installed' && (
                  <div className="p-3 rounded-xl bg-emerald-950 border border-emerald-500/50 text-emerald-300 text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>🎉 ALTRON OS successfully installed to your Home Screen! Tap its icon to launch anytime full-screen.</span>
                  </div>
                )}

                {installStatus === 'dismissed' && (
                  <div className="p-3 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Install prompt was closed. You can tap the button anytime to trigger installation again.</span>
                  </div>
                )}

                {installStatus === 'manual' && (
                  <div className="p-3 rounded-xl bg-cyan-950/70 border border-cyan-500/40 text-cyan-200 text-xs space-y-1">
                    <p className="font-semibold text-white flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{isIOS ? 'iPhone Safari Quick Step:' : 'Android Quick Step:'}</span>
                    </p>
                    <p className="text-slate-300">
                      {isIOS
                        ? 'Tap the Share icon [□↑] at the bottom of Safari, then tap "Add to Home Screen".'
                        : 'Tap Chrome menu (⋮) top right, then select "Install app" or "Add to Home screen".'}
                    </p>
                  </div>
                )}
              </div>

              {/* Iframe Warning & Direct Fullscreen Link (Critical for AI Studio Preview iframe) */}
              {isInIframe && (
                <div className="p-3.5 rounded-2xl bg-amber-950/40 border border-amber-500/40 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                  <div className="flex items-start gap-2.5">
                    <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-amber-300">Testing inside Preview Frame?</span>
                      <p className="text-slate-300 text-[11px] mt-0.5">
                        Browsers forbid PWA install dialogs inside preview iframes. Open directly in a new tab or on your mobile browser for 100% reliable 1-tap installation.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={openFullscreenInNewTab}
                    className="w-full sm:w-auto px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shrink-0 transition-all active:scale-95 shadow"
                  >
                    <span>Open in New Tab</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* Direct Link & QR Code Utility */}
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2.5">
                <div className="flex items-center justify-between text-xs font-mono text-cyan-300">
                  <span className="flex items-center gap-1.5 font-bold">
                    <Smartphone className="w-4 h-4 text-cyan-400" />
                    <span>PUBLIC APP URL (FOR MOBILE BROWSER):</span>
                  </span>
                  <span className="text-[10px] text-emerald-400 font-bold">LIVE PUBLIC</span>
                </div>

                <div className="flex items-center gap-2 bg-slate-900 p-2.5 rounded-xl border border-slate-700">
                  <input
                    type="text"
                    readOnly
                    value={currentUrl}
                    className="flex-1 bg-transparent text-xs text-cyan-300 font-mono focus:outline-none select-all truncate"
                  />
                  <button
                    onClick={copyAppUrl}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 active:scale-95 text-white text-xs font-bold transition-all shrink-0 shadow"
                  >
                    {copiedUrl ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedUrl ? 'Copied!' : 'Copy Link'}</span>
                  </button>
                </div>
              </div>

              {/* Step by step for Android & iPhone side-by-side */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                {/* Android Steps */}
                <div className={`p-3.5 rounded-2xl bg-slate-950/90 border transition-all space-y-2.5 ${
                  isAndroid ? 'border-emerald-500 shadow-md shadow-emerald-500/20' : 'border-emerald-500/30'
                }`}>
                  <div className="flex items-center justify-between text-emerald-400 font-bold text-xs">
                    <div className="flex items-center gap-1.5">
                      <Smartphone className="w-4 h-4" />
                      <span>FOR ANDROID (Chrome / Samsung)</span>
                    </div>
                    {isAndroid && (
                      <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300">
                        DETECTED
                      </span>
                    )}
                  </div>
                  
                  <div className="space-y-2 text-xs">
                    <div className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center justify-center text-[10px] font-mono shrink-0 mt-0.5">1</span>
                      <p>Open this page in <strong>Google Chrome</strong> or <strong>Samsung Internet</strong> on your phone.</p>
                    </div>

                    <div className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center justify-center text-[10px] font-mono shrink-0 mt-0.5">2</span>
                      <p>Tap the <strong>three dots (⋮)</strong> in the top-right corner of Chrome.</p>
                    </div>

                    <div className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center justify-center text-[10px] font-mono shrink-0 mt-0.5">3</span>
                      <p>Tap <strong>"Install app"</strong> or <strong>"Add to Home screen"</strong>.</p>
                    </div>

                    <div className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center justify-center text-[10px] font-mono shrink-0 mt-0.5">4</span>
                      <p>Tap <strong>"Install"</strong>. The ALTRON icon appears in your phone app drawer and home screen!</p>
                    </div>
                  </div>
                </div>

                {/* iPhone / iOS Steps */}
                <div className={`p-3.5 rounded-2xl bg-slate-950/90 border transition-all space-y-2.5 ${
                  isIOS ? 'border-blue-500 shadow-md shadow-blue-500/20' : 'border-blue-500/30'
                }`}>
                  <div className="flex items-center justify-between text-blue-400 font-bold text-xs">
                    <div className="flex items-center gap-1.5">
                      <Apple className="w-4 h-4" />
                      <span>FOR IPHONE (Safari)</span>
                    </div>
                    {isIOS && (
                      <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-blue-500/20 text-blue-300">
                        DETECTED
                      </span>
                    )}
                  </div>
                  
                  <div className="space-y-2 text-xs">
                    <div className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/40 flex items-center justify-center text-[10px] font-mono shrink-0 mt-0.5">1</span>
                      <p>Open this page in <strong>Safari</strong> on your iPhone.</p>
                    </div>

                    <div className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/40 flex items-center justify-center text-[10px] font-mono shrink-0 mt-0.5">2</span>
                      <p>Tap the <strong>Share button (□↑)</strong> at the bottom center of Safari.</p>
                    </div>

                    <div className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/40 flex items-center justify-center text-[10px] font-mono shrink-0 mt-0.5">3</span>
                      <p>Scroll down the share sheet and tap <strong>"Add to Home Screen"</strong>.</p>
                    </div>

                    <div className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/40 flex items-center justify-center text-[10px] font-mono shrink-0 mt-0.5">4</span>
                      <p>Tap <strong>"Add"</strong> in the top right. ALTRON will open standalone with no browser address bars!</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ANDROID TAB */}
          {platform === 'android' && (
            <div className="space-y-3">
              <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-emerald-500/40 space-y-2">
                <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>STEP 1: Install to Home Screen</span>
                </div>
                <p className="text-xs text-slate-300">
                  Open Chrome, tap the <strong>3 dots (⋮)</strong> at top-right, and select <strong>"Add to Home screen"</strong> or <strong>"Install app"</strong>. ALTRON will install directly as a standalone full-screen OS.
                </p>
                <button
                  onClick={handleInstallClick}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all mt-1"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{deferredInstallPrompt ? 'Launch Install Prompt' : 'Copy Chrome Install Link'}</span>
                </button>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>STEP 2: Set as Default Digital Assistant</span>
                </div>
                <p className="text-xs text-slate-300">
                  Go to phone <strong>Settings → Apps → Default apps → Digital assistant app</strong>. Choose ALTRON to enable long-press home button or corner swipe voice activation.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>STEP 3: Grant Microphone Permission</span>
                </div>
                <p className="text-xs text-slate-300">
                  Tap <strong>"Allow"</strong> when prompted for microphone access for hands-free voice recognition.
                </p>
              </div>
            </div>
          )}

          {/* IOS TAB */}
          {platform === 'ios' && (
            <div className="space-y-3">
              <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-blue-500/40 space-y-2">
                <div className="flex items-center gap-2 text-blue-400 font-semibold text-xs">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>STEP 1: Add to iPhone Home Screen</span>
                </div>
                <p className="text-xs text-slate-300">
                  Open in Safari on iPhone, tap <strong>Share (□↑)</strong> at the bottom bar, and select <strong>"Add to Home Screen"</strong>. Launches in full-screen standalone mode without Safari address bars.
                </p>
                <button
                  onClick={copyAppUrl}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all mt-1"
                >
                  {copiedUrl ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedUrl ? 'Copied Safari Link!' : 'Copy Safari Link'}</span>
                </button>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-blue-400 font-semibold text-xs">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>STEP 2: Siri Voice Shortcut</span>
                </div>
                <p className="text-xs text-slate-300">
                  Open the <strong>Shortcuts</strong> app on iOS → Create new shortcut: "Open ALTRON". Say <em>"Hey Siri, Open ALTRON"</em> anytime hands-free.
                </p>
              </div>
            </div>
          )}

          {/* QUICK SETTINGS TILE TAB */}
          {platform === 'quicksettings' && (
            <div className="space-y-3">
              <div className="p-3.5 rounded-2xl bg-slate-950/90 border border-cyan-500/40 space-y-2">
                <div className="text-xs font-mono text-cyan-300 font-semibold flex items-center justify-between">
                  <span>SWIPE-DOWN QUICK SETTINGS TILE:</span>
                  <span className="text-[10px] text-slate-400">Android 7.0 - 15</span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 flex items-center justify-center text-[10px] font-mono shrink-0 mt-0.5">1</span>
                    <p>Swipe down twice from the top of your phone screen to reveal the full Quick Settings grid.</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 flex items-center justify-center text-[10px] font-mono shrink-0 mt-0.5">2</span>
                    <p>Tap the <strong>Edit (✏️ / Pencil)</strong> button or <strong>(⋮) → Edit buttons</strong>.</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 flex items-center justify-center text-[10px] font-mono shrink-0 mt-0.5">3</span>
                    <p>Find the <strong>"ALTRON OS"</strong> tile at the bottom and drag it into your active top tiles.</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center justify-center text-[10px] font-mono shrink-0 mt-0.5">✓</span>
                    <p>Whenever you swipe down anywhere on your phone, tap ALTRON to jump into the central command dashboard.</p>
                  </div>
                </div>
              </div>

              {/* Notification Shortcut Tester */}
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-cyan-500/30 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-semibold text-white">
                    <Bell className="w-4 h-4 text-cyan-400" />
                    <span>Notification Shade Shortcut Test</span>
                  </div>
                  {notifStatus === 'granted' && (
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded border border-emerald-500/30">
                      ACTIVE
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-400">
                  Sends a quick launch notification to your shade. Tapping it opens this exact central ALTRON dashboard.
                </p>
                <button
                  onClick={testNotificationShortcut}
                  className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-98 border border-cyan-500/40 text-cyan-300 font-semibold text-xs flex items-center justify-center gap-2 transition-all"
                >
                  <Bell className="w-3.5 h-3.5" />
                  <span>Send Notification Shortcut</span>
                </button>
              </div>

              {/* TileService Code Reference */}
              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-slate-300 flex items-center gap-1.5">
                    <Code className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Native TileService API Code</span>
                  </span>
                  <button
                    onClick={copyCode}
                    className="flex items-center gap-1 text-[11px] text-cyan-400 hover:text-cyan-300 font-mono"
                  >
                    {copiedCode ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedCode ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <pre className="text-[10px] font-mono bg-black/70 p-2.5 rounded-xl border border-slate-800 text-slate-300 overflow-x-auto select-all">
                  {tileServiceCode}
                </pre>
              </div>
            </div>
          )}

          {/* COMMANDS TAB */}
          {platform === 'commands' && (
            <div className="space-y-2">
              <div className="text-xs font-mono text-purple-400 mb-1">CENTRALIZED VOICE COMMANDS:</div>
              {[
                { cmd: '"Call 9876543210"', desc: 'Dials specific number directly with Truecaller Verified caller ID' },
                { cmd: '"Altron that call this specific number 9876543210"', desc: 'Immediate direct dialing command' },
                { cmd: '"Call Sarah Jenkins"', desc: 'Dials contact from address book' },
                { cmd: '"Play music"', desc: 'Starts synthwave cyber beat stream' },
                { cmd: '"Turn on flashlight" / "Turn off flashlight"', desc: 'Toggles device torch' },
                { cmd: '"Set volume to 85%"', desc: 'Adjusts hardware audio slider' },
                { cmd: '"Send message to Alex saying I am on the way"', desc: 'Sends instant SMS text' },
                { cmd: '"Open Camera"', desc: 'Launches viewfinder and photo tools' },
                { cmd: '"Check system diagnostic"', desc: 'Displays CPU, RAM, battery & power metrics' },
                { cmd: '"What time is it?"', desc: 'Centralized native time & clock feedback' },
              ].map((item, idx) => (
                <div key={idx} className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex flex-col">
                  <span className="font-mono text-cyan-300 text-xs font-semibold">{item.cmd}</span>
                  <span className="text-[11px] text-slate-400 mt-0.5">{item.desc}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-3 pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 text-[11px] font-mono text-cyan-400">
            <Shield className="w-4 h-4" />
            <span>ALTRON OS • Centralized Native Engine</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (onLaunchAltronOS) onLaunchAltronOS();
                onClose();
              }}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-600 via-teal-500 to-cyan-500 hover:from-cyan-500 hover:to-teal-400 active:scale-95 text-white font-bold text-xs shadow-lg shadow-cyan-500/25 flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5 fill-white" />
              <span>LAUNCH ALTRON OS NOW</span>
            </button>
            <button
              onClick={onClose}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-300 font-semibold text-xs transition-all cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
