import React, { useState, useEffect } from 'react';
import {
  Phone,
  PhoneCall,
  PhoneOff,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  User,
  Clock,
  Star,
  Delete,
  ShieldCheck,
  ShieldAlert,
  Search,
  ExternalLink,
  MessageCircle,
  Radio,
  Sparkles,
} from 'lucide-react';
import { Contact, ActiveCall, TruecallerData } from '../../types';
import { soundEngine } from '../../services/audioSynth';

interface PhoneAppProps {
  contacts: Contact[];
  activeCall: ActiveCall;
  onStartCall: (contactName: string, number: string, provider?: 'altron' | 'truecaller' | 'native' | 'whatsapp') => void;
  onEndCall: () => void;
  onToggleMute: () => void;
  onToggleSpeaker: () => void;
}

export const PhoneApp: React.FC<PhoneAppProps> = ({
  contacts,
  activeCall,
  onStartCall,
  onEndCall,
  onToggleMute,
  onToggleSpeaker,
}) => {
  const [activeTab, setActiveTab] = useState<'keypad' | 'contacts' | 'truecaller' | 'recents'>('keypad');
  const [dialedNumber, setDialedNumber] = useState('');
  const [selectedProvider, setSelectedProvider] = useState<'altron' | 'truecaller' | 'native' | 'whatsapp'>('truecaller');
  const [truecallerQuery, setTruecallerQuery] = useState('');
  const [searchedTruecaller, setSearchedTruecaller] = useState<TruecallerData | null>(null);

  // Keypad press handler
  const handleDigitPress = (digit: string) => {
    soundEngine.playKeypadTone(digit);
    setDialedNumber(prev => (prev.length < 15 ? prev + digit : prev));
  };

  const handleBackspace = () => {
    setDialedNumber(prev => prev.slice(0, -1));
  };

  const handleCallDialed = (overrideProvider?: 'altron' | 'truecaller' | 'native' | 'whatsapp') => {
    if (!dialedNumber) return;
    const provider = overrideProvider || selectedProvider;
    const match = contacts.find(c => c.number.replace(/\D/g, '') === dialedNumber.replace(/\D/g, ''));
    onStartCall(match ? match.name : dialedNumber, dialedNumber, provider);
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Launch real native phone or Truecaller scheme
  const triggerExternalCall = (number: string, app: 'native' | 'truecaller' | 'whatsapp') => {
    const cleanDigits = number.replace(/\D/g, '');
    if (app === 'native') {
      window.location.href = `tel:${cleanDigits}`;
    } else if (app === 'truecaller') {
      // Truecaller deep-link with standard fallback
      window.location.href = `truecaller://callerid?phone=${cleanDigits}`;
      setTimeout(() => {
        window.location.href = `tel:${cleanDigits}`;
      }, 500);
    } else if (app === 'whatsapp') {
      window.open(`https://wa.me/${cleanDigits}`, '_blank');
    }
  };

  // Mock / Instant Truecaller Lookup Generator
  const runTruecallerLookup = (numOrName: string) => {
    soundEngine.playAcknowledge();
    const clean = numOrName.trim();
    if (!clean) return;

    const matchedContact = contacts.find(
      c => c.name.toLowerCase().includes(clean.toLowerCase()) || c.number.replace(/\D/g, '') === clean.replace(/\D/g, '')
    );

    if (matchedContact) {
      setSearchedTruecaller({
        name: matchedContact.name,
        number: matchedContact.number,
        verified: true,
        spamScore: 0,
        spamReports: 0,
        carrier: 'AT&T / Jio VoLTE 5G',
        badge: 'Verified Personal',
        location: 'California, US',
      });
    } else if (clean.startsWith('911') || clean.includes('emergency')) {
      setSearchedTruecaller({
        name: 'Emergency Dispatch 911',
        number: clean,
        verified: true,
        spamScore: 0,
        spamReports: 0,
        carrier: 'Public Safety Answering Point',
        badge: 'Verified Business',
        location: 'Local Emergency Center',
      });
    } else {
      // Procedural Truecaller resolution
      const isSuspect = clean.endsWith('99') || clean.endsWith('00');
      setSearchedTruecaller({
        name: isSuspect ? 'Telemarketing / Robocaller' : `Caller (${clean.slice(-4)})`,
        number: clean,
        verified: !isSuspect,
        spamScore: isSuspect ? 82 : 4,
        spamReports: isSuspect ? 142 : 0,
        carrier: 'Global Cellular Gateway',
        badge: isSuspect ? 'Spam Alert' : 'Verified Personal',
        location: 'New York, US',
      });
    }
  };

  // IF ACTIVE CALL IS CURRENTLY IN PROGRESS
  if (activeCall.active) {
    return (
      <div className="relative flex flex-col items-center justify-between h-full p-5 bg-gradient-to-b from-slate-950 via-slate-900 to-black text-white select-none">
        {/* Call App Provider Badge */}
        <div className="w-full flex items-center justify-between pt-1">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-[10px] font-mono text-cyan-300">
            <Radio className="w-3 h-3 text-cyan-400 animate-pulse" />
            <span>
              {activeCall.callProvider === 'truecaller'
                ? 'TRUECALLER VERIFIED CALL'
                : activeCall.callProvider === 'whatsapp'
                ? 'WHATSAPP VOICE ROUTE'
                : activeCall.callProvider === 'native'
                ? 'CELLULAR CARRIER DIAL'
                : 'ALTRON SECURE LINK'}
            </span>
          </div>

          <button
            onClick={() => triggerExternalCall(activeCall.phoneNumber, 'native')}
            className="flex items-center gap-1 text-[10px] font-mono text-cyan-400 hover:text-cyan-200 underline"
            title="Dial on phone native cellular dialer"
          >
            <span>Open in Phone</span>
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>

        {/* Contact Info Header */}
        <div className="flex flex-col items-center mt-3 text-center">
          <div className="relative flex items-center justify-center w-20 h-20 mb-3 rounded-full bg-cyan-950/70 border-2 border-cyan-400/50 shadow-xl shadow-cyan-500/20">
            <User className="w-10 h-10 text-cyan-300" />
            {activeCall.status === 'dialing' && (
              <div className="absolute inset-0 rounded-full border border-cyan-400/40 animate-ping opacity-60" />
            )}
          </div>

          <h2 className="text-xl font-bold tracking-tight text-white flex items-center justify-center gap-1.5">
            {activeCall.contactName}
            {activeCall.truecallerInfo?.verified && (
              <span title="Truecaller Verified">
                <ShieldCheck className="w-5 h-5 text-blue-400" />
              </span>
            )}
          </h2>

          <p className="text-xs font-mono text-cyan-400/90 mt-0.5">{activeCall.phoneNumber}</p>

          {/* Truecaller Verified Caller ID pill */}
          <div className="flex items-center gap-1.5 mt-2 px-3 py-1 bg-blue-950/60 border border-blue-500/30 rounded-full text-[10px] font-mono text-blue-300">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
            <span>Truecaller ID: {activeCall.truecallerInfo?.badge || 'Verified Safe (0% Spam)'}</span>
          </div>

          {/* Call Status / Timer */}
          <div className="flex items-center gap-2 mt-2 px-3 py-1 bg-slate-900/80 border border-slate-700/60 rounded-full">
            <div className={`w-2 h-2 rounded-full ${activeCall.status === 'connected' ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400 animate-ping'}`} />
            <span className="text-xs font-mono tracking-wider text-slate-200">
              {activeCall.status === 'dialing' ? 'CONNECTING CALL...' : formatTimer(activeCall.duration)}
            </span>
          </div>
        </div>

        {/* Audio Waveform Visualization */}
        <div className="flex items-center gap-1.5 h-10 px-4 py-2 bg-slate-900/70 border border-cyan-500/20 rounded-2xl w-full max-w-xs justify-center">
          {[35, 70, 50, 95, 60, 85, 40, 90, 65, 45, 80, 55].map((h, i) => (
            <div
              key={i}
              className="w-1.5 bg-gradient-to-t from-cyan-600 to-cyan-300 rounded-full transition-all duration-200"
              style={{
                height: activeCall.status === 'connected'
                  ? `${Math.max(15, h * (0.5 + Math.sin(Date.now() / 180 + i) * 0.5))}%`
                  : '18%',
              }}
            />
          ))}
        </div>

        {/* Live Call Control Actions */}
        <div className="w-full max-w-xs flex flex-col gap-4 mb-2">
          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={onToggleMute}
              className={`flex flex-col items-center justify-center p-2.5 rounded-2xl border transition-all ${
                activeCall.isMuted
                  ? 'bg-red-500/20 border-red-500/40 text-red-400'
                  : 'bg-slate-800/60 border-slate-700/60 text-slate-300 hover:bg-slate-800'
              }`}
            >
              {activeCall.isMuted ? <MicOff className="w-5 h-5 mb-1" /> : <Mic className="w-5 h-5 mb-1" />}
              <span className="text-[10px] font-medium">{activeCall.isMuted ? 'Muted' : 'Mute'}</span>
            </button>

            <button
              onClick={onToggleSpeaker}
              className={`flex flex-col items-center justify-center p-2.5 rounded-2xl border transition-all ${
                activeCall.isSpeaker
                  ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-400'
                  : 'bg-slate-800/60 border-slate-700/60 text-slate-300 hover:bg-slate-800'
              }`}
            >
              {activeCall.isSpeaker ? <Volume2 className="w-5 h-5 mb-1" /> : <VolumeX className="w-5 h-5 mb-1" />}
              <span className="text-[10px] font-medium">{activeCall.isSpeaker ? 'Speaker ON' : 'Speaker'}</span>
            </button>

            <button
              onClick={() => triggerExternalCall(activeCall.phoneNumber, 'truecaller')}
              className="flex flex-col items-center justify-center p-2.5 rounded-2xl border bg-blue-900/30 border-blue-500/40 text-blue-300 hover:bg-blue-900/50 transition-all"
            >
              <ShieldCheck className="w-5 h-5 mb-1 text-blue-400" />
              <span className="text-[10px] font-medium">Truecaller</span>
            </button>
          </div>

          {/* Instant Cellular / Native Phone Launch Button */}
          <button
            onClick={() => triggerExternalCall(activeCall.phoneNumber, 'native')}
            className="flex items-center justify-center gap-2 w-full py-2.5 px-3 rounded-2xl bg-emerald-600/30 hover:bg-emerald-600/40 border border-emerald-500/50 text-emerald-300 text-xs font-semibold transition-all shadow-md active:scale-98"
            title="Dial directly on phone SIM cellular connection"
          >
            <PhoneCall className="w-4 h-4 text-emerald-400" />
            <span>Connect Directly on Phone Dial (tel:)</span>
          </button>

          {/* End Call Button */}
          <button
            onClick={onEndCall}
            className="flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl bg-red-600 hover:bg-red-500 active:scale-98 text-white font-semibold shadow-lg shadow-red-600/30 transition-all"
          >
            <PhoneOff className="w-5 h-5" />
            <span>End Call (or say "Altron hang up")</span>
          </button>
        </div>
      </div>
    );
  }

  // DEFAULT PHONE APP VIEW
  return (
    <div className="flex flex-col h-full bg-slate-950 text-white select-none">
      {/* App Header & Truecaller Status */}
      <div className="flex items-center justify-between px-4 pt-3 pb-2 border-b border-slate-800/80 bg-slate-900/50">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
            <Phone className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <span className="font-semibold tracking-wide text-xs text-white">ALTRON Phone</span>
            <div className="flex items-center gap-1 text-[9px] font-mono text-blue-400">
              <ShieldCheck className="w-3 h-3 text-blue-400" />
              <span>Truecaller Link: Connected</span>
            </div>
          </div>
        </div>

        {/* Quick App Linker (Truecaller / WhatsApp / Cellular) */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setSelectedProvider('truecaller')}
            className={`px-2 py-0.5 rounded-lg text-[10px] font-mono font-medium transition-all ${
              selectedProvider === 'truecaller'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Truecaller
          </button>
          <button
            onClick={() => setSelectedProvider('native')}
            className={`px-2 py-0.5 rounded-lg text-[10px] font-mono font-medium transition-all ${
              selectedProvider === 'native'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Carrier
          </button>
          <button
            onClick={() => setSelectedProvider('whatsapp')}
            className={`px-2 py-0.5 rounded-lg text-[10px] font-mono font-medium transition-all ${
              selectedProvider === 'whatsapp'
                ? 'bg-green-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            WA
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-4 p-1.5 mx-3 mt-2 bg-slate-900/80 border border-slate-800 rounded-xl text-[11px] font-medium">
        <button
          onClick={() => setActiveTab('keypad')}
          className={`py-1.5 rounded-lg transition-all ${
            activeTab === 'keypad'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-semibold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Keypad
        </button>
        <button
          onClick={() => setActiveTab('contacts')}
          className={`py-1.5 rounded-lg transition-all ${
            activeTab === 'contacts'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-semibold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Contacts
        </button>
        <button
          onClick={() => setActiveTab('truecaller')}
          className={`py-1.5 rounded-lg flex items-center justify-center gap-1 transition-all ${
            activeTab === 'truecaller'
              ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30 font-semibold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <ShieldCheck className="w-3 h-3 text-blue-400" />
          <span>Truecaller</span>
        </button>
        <button
          onClick={() => setActiveTab('recents')}
          className={`py-1.5 rounded-lg transition-all ${
            activeTab === 'recents'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-semibold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Recents
        </button>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto px-4 py-2">
        {/* TAB 1: KEYPAD */}
        {activeTab === 'keypad' && (
          <div className="flex flex-col items-center justify-between h-full max-w-xs mx-auto py-1">
            {/* Number Display */}
            <div className="flex items-center justify-between w-full min-h-[44px] px-3 py-1.5 bg-slate-900/50 rounded-xl border border-slate-800">
              <span className="text-xl font-mono tracking-wider font-semibold text-white overflow-x-auto whitespace-nowrap">
                {dialedNumber || <span className="text-slate-500 text-sm">Enter number or speak name</span>}
              </span>
              {dialedNumber && (
                <button onClick={handleBackspace} className="p-1 text-slate-400 hover:text-red-400">
                  <Delete className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Quick Truecaller Preview if number dialed */}
            {dialedNumber.length >= 3 && (
              <div className="w-full mt-1.5 px-3 py-1 rounded-lg bg-blue-950/40 border border-blue-500/30 flex items-center justify-between text-[10px] font-mono">
                <div className="flex items-center gap-1.5 text-blue-300">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                  <span>Truecaller Shield: Verified Clean</span>
                </div>
                <button
                  onClick={() => {
                    setTruecallerQuery(dialedNumber);
                    runTruecallerLookup(dialedNumber);
                    setActiveTab('truecaller');
                  }}
                  className="text-cyan-400 hover:underline"
                >
                  Lookup
                </button>
              </div>
            )}

            {/* Keypad Grid */}
            <div className="grid grid-cols-3 gap-2.5 w-full my-2">
              {[
                { n: '1', l: '' },
                { n: '2', l: 'ABC' },
                { n: '3', l: 'DEF' },
                { n: '4', l: 'GHI' },
                { n: '5', l: 'JKL' },
                { n: '6', l: 'MNO' },
                { n: '7', l: 'PQRS' },
                { n: '8', l: 'TUV' },
                { n: '9', l: 'WXYZ' },
                { n: '*', l: '' },
                { n: '0', l: '+' },
                { n: '#', l: '' },
              ].map(({ n, l }) => (
                <button
                  key={n}
                  onClick={() => handleDigitPress(n)}
                  className="flex flex-col items-center justify-center h-12 rounded-2xl bg-slate-900/70 hover:bg-cyan-950/40 active:scale-95 border border-slate-800 hover:border-cyan-500/40 transition-all text-white"
                >
                  <span className="text-lg font-bold font-mono">{n}</span>
                  {l && <span className="text-[8px] font-mono text-cyan-400/70 tracking-widest">{l}</span>}
                </button>
              ))}
            </div>

            {/* Action Call Buttons: Multi-App Dialing */}
            <div className="w-full flex items-center justify-center gap-3 pb-1">
              {/* Native / Truecaller Quick trigger */}
              <button
                onClick={() => handleCallDialed('truecaller')}
                disabled={!dialedNumber}
                className="flex items-center justify-center gap-2 flex-1 py-3 px-3 rounded-2xl bg-blue-600 hover:bg-blue-500 active:scale-95 disabled:opacity-30 disabled:pointer-events-none text-white text-xs font-semibold shadow-lg shadow-blue-600/20 transition-all"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Truecaller</span>
              </button>

              <button
                onClick={() => handleCallDialed('altron')}
                disabled={!dialedNumber}
                className="flex items-center justify-center w-14 h-14 rounded-full bg-emerald-600 hover:bg-emerald-500 active:scale-95 disabled:opacity-30 disabled:pointer-events-none text-white shadow-lg shadow-emerald-600/30 transition-all"
                title="ALTRON AI Direct Call"
              >
                <PhoneCall className="w-6 h-6" />
              </button>

              <button
                onClick={() => triggerExternalCall(dialedNumber, 'native')}
                disabled={!dialedNumber}
                className="flex items-center justify-center gap-1.5 flex-1 py-3 px-3 rounded-2xl bg-slate-800 hover:bg-slate-700 active:scale-95 disabled:opacity-30 disabled:pointer-events-none text-slate-200 text-xs font-semibold border border-slate-700 transition-all"
                title="Dial on phone dialer"
              >
                <Phone className="w-4 h-4 text-emerald-400" />
                <span>Cellular</span>
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: CONTACTS */}
        {activeTab === 'contacts' && (
          <div className="flex flex-col gap-2 py-1">
            <div className="text-[10px] font-mono text-slate-400 mb-1 px-1 flex items-center justify-between">
              <span>VOICE CALLABLE CONTACTS</span>
              <span className="text-blue-400">TRUECALLER SYNCED</span>
            </div>
            {contacts.map(c => (
              <div
                key={c.id}
                className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/50 hover:bg-slate-800/80 border border-slate-800 hover:border-cyan-500/30 transition-all"
              >
                <div
                  onClick={() => onStartCall(c.name, c.number, selectedProvider)}
                  className="flex items-center gap-3 cursor-pointer flex-1"
                >
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full ${c.avatarColor} text-white font-bold text-xs shadow-md`}>
                    {c.initials}
                  </div>
                  <div>
                    <div className="font-semibold text-xs text-slate-100 flex items-center gap-1.5">
                      {c.name}
                      <span title="Verified Truecaller Profile">
                        <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                      </span>
                      {c.isFavorite && <Star className="w-3 h-3 fill-amber-400 text-amber-400" />}
                    </div>
                    <div className="text-[10px] font-mono text-slate-400">{c.number} • {c.status}</div>
                  </div>
                </div>

                {/* Direct Dial Options */}
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => onStartCall(c.name, c.number, 'truecaller')}
                    className="p-2 rounded-lg bg-blue-500/10 hover:bg-blue-500 text-blue-400 hover:text-white transition-all"
                    title="Call via Truecaller"
                  >
                    <ShieldCheck className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => triggerExternalCall(c.number, 'native')}
                    className="p-2 rounded-lg bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-white transition-all"
                    title="Dial on Device Cellular Phone"
                  >
                    <Phone className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 3: TRUECALLER CALLER ID & SPAM SHIELD */}
        {activeTab === 'truecaller' && (
          <div className="flex flex-col gap-3 py-1">
            {/* Search Header */}
            <div className="p-3 rounded-2xl bg-blue-950/40 border border-blue-500/40 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-blue-300">
                <ShieldCheck className="w-4 h-4 text-blue-400" />
                <span>Truecaller Global Caller ID & Spam Shield</span>
              </div>
              <p className="text-[11px] text-slate-300">
                Identify unknown numbers, verify genuine callers, and block telemarketer spam in real-time.
              </p>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="text"
                  value={truecallerQuery}
                  onChange={e => setTruecallerQuery(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && runTruecallerLookup(truecallerQuery)}
                  placeholder="Enter phone number or name to verify..."
                  className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-400"
                />
                <button
                  onClick={() => runTruecallerLookup(truecallerQuery)}
                  className="px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold transition-all shadow-md shadow-blue-600/30"
                >
                  Verify
                </button>
              </div>
            </div>

            {/* Searched Caller Card */}
            {searchedTruecaller && (
              <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-blue-500/40 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30">
                      {searchedTruecaller.spamScore > 50 ? (
                        <ShieldAlert className="w-5 h-5 text-red-400" />
                      ) : (
                        <ShieldCheck className="w-5 h-5 text-blue-400" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-white flex items-center gap-1.5">
                        {searchedTruecaller.name}
                        {searchedTruecaller.verified && <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />}
                      </h4>
                      <p className="text-xs font-mono text-cyan-300">{searchedTruecaller.number}</p>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                      searchedTruecaller.spamScore > 50
                        ? 'bg-red-500/20 border-red-500/40 text-red-300'
                        : 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                    }`}
                  >
                    {searchedTruecaller.badge}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-slate-300 bg-slate-950 p-2 rounded-xl">
                  <div>
                    <span className="text-slate-500 block text-[9px]">CARRIER / TELCO:</span>
                    <span className="text-slate-200">{searchedTruecaller.carrier}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[9px]">SPAM RISK SCORE:</span>
                    <span className={searchedTruecaller.spamScore > 50 ? 'text-red-400' : 'text-emerald-400'}>
                      {searchedTruecaller.spamScore}% • {searchedTruecaller.spamReports} Reports
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={() => onStartCall(searchedTruecaller.name, searchedTruecaller.number, 'truecaller')}
                    className="flex-1 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md shadow-blue-600/30"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    <span>Call via Truecaller</span>
                  </button>

                  <button
                    onClick={() => triggerExternalCall(searchedTruecaller.number, 'native')}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs border border-slate-700 transition-all"
                    title="Dial on Native Phone"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Quick Truecaller Directory Suggestions */}
            <div className="text-[10px] font-mono text-slate-400 px-1 mt-1">QUICK VERIFIED DIRECTORY</div>
            <div className="grid grid-cols-2 gap-2">
              {[
                { name: 'Sarah Jenkins', role: 'Executive (Verified)', num: '+1 (555) 234-5678' },
                { name: 'Marcus Reed', role: 'Security Ops (Verified)', num: '+1 (555) 876-5432' },
                { name: 'Dr. Elena Rostova', role: 'Quantum Labs (Verified)', num: '+1 (555) 432-1098' },
                { name: 'Emergency 911', role: 'Dispatch (Official)', num: '911' },
              ].map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    setTruecallerQuery(item.num);
                    runTruecallerLookup(item.num);
                  }}
                  className="p-2 rounded-xl bg-slate-900/60 hover:bg-slate-800 border border-slate-800 hover:border-blue-500/30 cursor-pointer transition-all"
                >
                  <div className="text-xs font-semibold text-slate-200 truncate">{item.name}</div>
                  <div className="text-[10px] text-blue-400 mt-0.5">{item.role}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: RECENTS */}
        {activeTab === 'recents' && (
          <div className="flex flex-col gap-2 py-1">
            {[
              { name: 'Sarah Jenkins', number: '+1 (555) 234-5678', time: '10:14 AM', type: 'outgoing', duration: '4m 12s', provider: 'Truecaller' },
              { name: 'Alex Vance', number: '+1 (555) 345-6789', time: 'Yesterday', type: 'incoming', duration: '1m 45s', provider: 'Native VoLTE' },
              { name: 'Marcus Reed', number: '+1 (555) 876-5432', time: 'Oct 14', type: 'missed', duration: '0s', provider: 'Truecaller Shield' },
              { name: 'Dr. Elena Rostova', number: '+1 (555) 432-1098', time: 'Oct 12', type: 'incoming', duration: '8m 20s', provider: 'ALTRON AI' },
            ].map((rec, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/40 hover:bg-slate-800/60 border border-slate-800"
              >
                <div
                  onClick={() => onStartCall(rec.name, rec.number, 'truecaller')}
                  className="flex items-center gap-3 cursor-pointer flex-1"
                >
                  <div className="p-2 rounded-full bg-slate-800 text-cyan-400">
                    <Phone className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="font-medium text-xs text-slate-200 flex items-center gap-1">
                      {rec.name}
                      <ShieldCheck className="w-3 h-3 text-blue-400" />
                    </div>
                    <div className="text-[10px] text-slate-400 flex items-center gap-1.5 font-mono">
                      <span className={rec.type === 'missed' ? 'text-red-400' : 'text-slate-400'}>{rec.type}</span>
                      <span>•</span>
                      <span>{rec.provider}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-slate-500">{rec.time}</span>
                  <button
                    onClick={() => triggerExternalCall(rec.number, 'native')}
                    className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
                    title="Dial on Native Phone"
                  >
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
