import React, { useState } from 'react';
import { X, Copy, Check, Globe, QrCode, Smartphone, ExternalLink, Sparkles, Phone, ShieldCheck, Link2, Server, CheckCircle2 } from 'lucide-react';

interface ShareUrlModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLaunchAltronOS?: () => void;
}

export const ShareUrlModal: React.FC<ShareUrlModalProps> = ({ isOpen, onClose, onLaunchAltronOS }) => {
  const [copiedMain, setCopiedMain] = useState(false);
  const [copiedAlton, setCopiedAlton] = useState(false);
  const [copiedAltron, setCopiedAltron] = useState(false);

  const mainPublishedUrl = typeof window !== 'undefined' ? window.location.href : 'https://ais-pre-6qn3priaswvq5unrltez6s-233928667016.asia-southeast1.run.app';
  const altonCustomUrl = 'https://hks.alton';
  const altronCustomUrl = 'https://hks.altron';

  if (!isOpen) return null;

  const copyMain = () => {
    navigator.clipboard.writeText(mainPublishedUrl);
    setCopiedMain(true);
    setTimeout(() => setCopiedMain(false), 2000);
  };

  const copyAlton = () => {
    navigator.clipboard.writeText(altonCustomUrl);
    setCopiedAlton(true);
    setTimeout(() => setCopiedAlton(false), 2000);
  };

  const copyAltron = () => {
    navigator.clipboard.writeText(altronCustomUrl);
    setCopiedAltron(true);
    setTimeout(() => setCopiedAltron(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-slate-900 border border-cyan-500/40 rounded-3xl p-6 text-white shadow-2xl shadow-cyan-500/20 flex flex-col max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-400">
            <Globe className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span>HKS ALTRON OS</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">PUBLIC LIVE</span>
            </h2>
            <p className="text-xs font-mono text-cyan-400">Published URL & Custom Domain (hks.alton)</p>
          </div>
        </div>

        {/* Hindi & English Status Banner */}
        <div className="p-3 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 mb-3">
          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div className="text-xs text-emerald-200 leading-relaxed">
              <p className="font-semibold text-emerald-300">
                URL Publicly Published & Globally Accessible!
              </p>
              <p className="text-[11px] text-emerald-200/80 mt-0.5">
                आपका ALTRON OS अब पूरी दुनिया के लिए Publicly Live है। आप और कोई भी यूजर इसे किसी भी मोबाइल फोन (Android/iOS) या कंप्यूटर पर सीधे खोल सकता है।
              </p>
            </div>
          </div>
        </div>

        {/* Custom Domain Aliases Section: hks.alton & hks.altron */}
        <div className="space-y-2 mb-3 p-3.5 rounded-2xl bg-slate-950 border border-cyan-500/30">
          <div className="flex items-center justify-between text-xs font-mono text-cyan-300">
            <span className="flex items-center gap-1.5 font-bold">
              <Link2 className="w-4 h-4 text-cyan-400" />
              <span>CUSTOM DOMAIN ALIAS:</span>
            </span>
            <span className="text-cyan-400 font-bold">hks.alton</span>
          </div>

          {/* Primary hks.alton Row */}
          <div className="flex items-center gap-2 bg-slate-900 p-2.5 rounded-xl border border-cyan-500/40">
            <div className="flex-1 truncate font-mono text-xs">
              <span className="text-emerald-400 font-bold">https://hks.alton</span>
              <span className="text-[10px] text-slate-400 block font-sans">Primary Requested Alias</span>
            </div>
            <button
              onClick={copyAlton}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold transition-all shadow"
            >
              {copiedAlton ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedAlton ? 'Copied' : 'Copy'}</span>
            </button>
          </div>

          {/* Alternate hks.altron Row */}
          <div className="flex items-center gap-2 bg-slate-900/60 p-2 rounded-xl border border-slate-800">
            <div className="flex-1 truncate font-mono text-xs">
              <span className="text-cyan-300">https://hks.altron</span>
              <span className="text-[10px] text-slate-500 block font-sans">Alternate Brand Alias</span>
            </div>
            <button
              onClick={copyAltron}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-mono transition-all"
            >
              {copiedAltron ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedAltron ? 'Copied' : 'Copy'}</span>
            </button>
          </div>

          {/* DNS Binding Instructions */}
          <div className="text-[10px] text-slate-400 bg-slate-900/80 p-2.5 rounded-xl border border-slate-800 space-y-1">
            <div className="flex items-center gap-1 text-cyan-300 font-mono font-semibold">
              <Server className="w-3 h-3 text-cyan-400" />
              <span>DNS CNAME Binding Record:</span>
            </div>
            <div className="font-mono text-slate-300 bg-black/60 p-1.5 rounded text-[10px] select-all">
              CNAME: hks.alton &nbsp;→&nbsp; ais-pre-6qn3priaswvq5unrltez6s-233928667016.asia-southeast1.run.app
            </div>
            <p className="text-[10px] text-slate-400 leading-tight">
              अपने Domain Registrar (GoDaddy / Cloudflare / Namecheap) में यह CNAME जोड़ें। इसके बाद <span className="text-cyan-300">hks.alton</span> टाइप करने पर सीधे यह ऑपरेटिंग सिस्टम खुलेगा।
            </p>
          </div>
        </div>

        {/* Primary Published Live Cloud Run URL */}
        <div className="space-y-1.5 mb-3">
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
            <span>PUBLIC CLOUD RUN HOST URL:</span>
            <span className="text-emerald-400 font-bold">100% LIVE WORLDWIDE</span>
          </div>
          <div className="flex items-center gap-2 bg-slate-950 p-2.5 rounded-xl border border-slate-700">
            <span className="text-xs text-cyan-300 font-mono flex-1 truncate select-all">{mainPublishedUrl}</span>
            <button
              onClick={copyMain}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-semibold transition-all border border-slate-700"
            >
              {copiedMain ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedMain ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>

        {/* QR Code & Mobile Launch */}
        <div className="flex flex-col items-center p-3.5 bg-slate-950 rounded-2xl border border-slate-800 mb-2">
          <div className="relative p-2.5 bg-white rounded-2xl shadow-lg shadow-cyan-500/10 mb-2 flex items-center justify-center">
            <svg className="w-32 h-32" viewBox="0 0 100 100" fill="black">
              {/* Corner 1 */}
              <rect x="5" y="5" width="28" height="28" rx="4" />
              <rect x="9" y="9" width="20" height="20" fill="white" rx="2" />
              <rect x="13" y="13" width="12" height="12" rx="2" />
              {/* Corner 2 */}
              <rect x="67" y="5" width="28" height="28" rx="4" />
              <rect x="71" y="9" width="20" height="20" fill="white" rx="2" />
              <rect x="75" y="13" width="12" height="12" rx="2" />
              {/* Corner 3 */}
              <rect x="5" y="67" width="28" height="28" rx="4" />
              <rect x="9" y="71" width="20" height="20" fill="white" rx="2" />
              <rect x="13" y="75" width="12" height="12" rx="2" />
              {/* Core Blocks */}
              <rect x="38" y="10" width="6" height="6" />
              <rect x="48" y="15" width="8" height="6" />
              <rect x="40" y="24" width="6" height="8" />
              <rect x="52" y="28" width="6" height="6" />
              <rect x="10" y="38" width="8" height="6" />
              <rect x="22" y="42" width="6" height="8" />
              <rect x="38" y="38" width="24" height="24" rx="4" fill="#06b6d4" />
              <circle cx="50" cy="50" r="6" fill="white" />
              <rect x="68" y="40" width="6" height="6" />
              <rect x="78" y="48" width="12" height="6" />
              <rect x="38" y="68" width="8" height="6" />
              <rect x="50" y="72" width="6" height="8" />
              <rect x="42" y="84" width="12" height="6" />
              <rect x="68" y="68" width="6" height="6" />
              <rect x="78" y="74" width="6" height="12" />
              <rect x="88" y="84" width="6" height="6" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span className="text-[9px] font-bold text-white bg-black/90 px-1.5 py-0.5 rounded border border-cyan-400">hks.alton</span>
            </div>
          </div>
          <span className="text-xs text-slate-300 font-medium">Scan with Phone Camera to Open Instantly</span>
          <span className="text-[10px] text-cyan-400 font-mono mt-0.5">Android & iOS • Hands-free Voice Commands Ready</span>
        </div>

        {/* Footer */}
        <div className="flex flex-wrap items-center justify-between gap-2 mt-2 pt-3 border-t border-slate-800">
          <button
            onClick={() => {
              if (onLaunchAltronOS) onLaunchAltronOS();
              onClose();
            }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-teal-500 hover:from-cyan-500 hover:to-teal-400 text-white font-bold text-xs shadow-lg shadow-cyan-500/25 active:scale-95 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>LAUNCH ALTRON OS</span>
          </button>
          <div className="flex items-center gap-2">
            <a
              href={mainPublishedUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs font-semibold text-cyan-400 hover:text-cyan-300"
            >
              <span>Fullscreen</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition-all active:scale-95"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
