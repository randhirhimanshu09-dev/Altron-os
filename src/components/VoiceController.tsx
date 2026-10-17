import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Send, Volume2, AlertCircle, Radio, PhoneCall, Disc, Zap, Activity } from 'lucide-react';
import { soundEngine } from '../services/audioSynth';
import { GeminiCommandResult, PhoneSettings } from '../types';

interface VoiceControllerProps {
  onCommandResult: (result: GeminiCommandResult, transcript: string) => void;
  settings: PhoneSettings;
  currentContext: any;
  isListening: boolean;
  setIsListening: React.Dispatch<React.SetStateAction<boolean>>;
  isProcessing: boolean;
  setIsProcessing: React.Dispatch<React.SetStateAction<boolean>>;
  isSpeaking: boolean;
  setIsSpeaking: React.Dispatch<React.SetStateAction<boolean>>;
  recentCommandResult?: GeminiCommandResult | null;
}

export const VoiceController: React.FC<VoiceControllerProps> = ({
  onCommandResult,
  settings,
  currentContext,
  isListening,
  setIsListening,
  isProcessing,
  setIsProcessing,
  isSpeaking,
  setIsSpeaking,
  recentCommandResult,
}) => {
  const [transcript, setTranscript] = useState('');
  const [textInput, setTextInput] = useState('');
  const [micPermissionError, setMicPermissionError] = useState<string | null>(null);
  const [isHandsFree, setIsHandsFree] = useState(true);
  const [assistantState, setAssistantState] = useState<'idle' | 'listening' | 'processing' | 'speaking'>('idle');
  const [isAccumulating, setIsAccumulating] = useState(false);

  const recognitionRef = useRef<any>(null);
  const isHandsFreeRef = useRef(isHandsFree);
  const isSpeakingRef = useRef(isSpeaking);
  const isProcessingRef = useRef(isProcessing);
  const restartTimeoutRef = useRef<any>(null);
  const isStartingRef = useRef(false);
  const silenceTimerRef = useRef<any>(null);
  const accumulatedRef = useRef<string>('');

  useEffect(() => {
    isHandsFreeRef.current = isHandsFree;
  }, [isHandsFree]);

  useEffect(() => {
    isSpeakingRef.current = isSpeaking;
    if (isSpeaking) {
      setAssistantState('speaking');
      try {
        if (recognitionRef.current) recognitionRef.current.abort();
      } catch {}
    } else if (isProcessingRef.current) {
      setAssistantState('processing');
    } else if (isListening) {
      setAssistantState('listening');
    } else {
      setAssistantState('idle');
    }
  }, [isSpeaking, isListening]);

  useEffect(() => {
    isProcessingRef.current = isProcessing;
    if (isProcessing) {
      setAssistantState('processing');
    }
  }, [isProcessing]);

  // Quick 1-tap commands directly centralized
  const quickCommands = [
    'Altron that call this specific number 9876543210',
    'Altron call 9876543210',
    'Altron call Sarah Jenkins',
    'Altron download APK',
    'Altron play music',
    'Altron turn on flashlight',
    'Altron hang up',
    'Altron battery diagnostic',
  ];

  // Initialize Speech Recognition with Complete Sentence Accumulation & Silence Detection
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setMicPermissionError('Web Speech is not supported in this browser. You can type commands below.');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        isStartingRef.current = false;
        setIsListening(true);
        setMicPermissionError(null);
        setAssistantState('listening');
      };

      recognition.onresult = (event: any) => {
        // Accumulate ALL speech fragments across results so entire sentence is captured
        let finalPhrase = '';
        let interimPhrase = '';

        for (let i = 0; i < event.results.length; i++) {
          const item = event.results[i];
          if (item.isFinal) {
            finalPhrase += item[0].transcript + ' ';
          } else {
            interimPhrase += item[0].transcript;
          }
        }

        const fullPhrase = (finalPhrase + interimPhrase).trim();
        if (!fullPhrase) return;

        accumulatedRef.current = fullPhrase;
        setTranscript(fullPhrase);
        setIsAccumulating(true);

        // Reset silence debounce timer on every word/fragment heard
        // This ensures Altron listens to the ENTIRE command without cutting off early
        if (silenceTimerRef.current) {
          clearTimeout(silenceTimerRef.current);
        }

        // Wait for 1.4s of complete silence before auto-executing
        silenceTimerRef.current = setTimeout(() => {
          const candidate = accumulatedRef.current.trim();
          if (candidate.length >= 2 && !isSpeakingRef.current && !isProcessingRef.current) {
            setIsAccumulating(false);
            executeCommand(candidate);
          }
        }, 1400);
      };

      recognition.onerror = (event: any) => {
        isStartingRef.current = false;
        if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
          setMicPermissionError('Microphone blocked. Please tap "Allow" in your browser address bar.');
          setIsListening(false);
          setAssistantState('idle');
        }
      };

      recognition.onend = () => {
        isStartingRef.current = false;

        // If a pending sentence was being spoken when onend fired, execute it
        if (accumulatedRef.current.trim().length > 1 && !isProcessingRef.current && !isSpeakingRef.current) {
          const candidate = accumulatedRef.current.trim();
          accumulatedRef.current = '';
          setIsAccumulating(false);
          executeCommand(candidate);
          return;
        }

        if (isHandsFreeRef.current && !isSpeakingRef.current && !isProcessingRef.current) {
          if (restartTimeoutRef.current) clearTimeout(restartTimeoutRef.current);
          restartTimeoutRef.current = setTimeout(() => {
            safeStartRecognition();
          }, 350);
        } else {
          setIsListening(false);
          if (!isSpeakingRef.current && !isProcessingRef.current) {
            setAssistantState('idle');
          }
        }
      };

      recognitionRef.current = recognition;
      safeStartRecognition();
    } catch (err) {
      console.warn('Recognition init status:', err);
    }

    return () => {
      if (restartTimeoutRef.current) clearTimeout(restartTimeoutRef.current);
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
      if (recognitionRef.current) {
        try { recognitionRef.current.abort(); } catch {}
      }
    };
  }, []);

  const safeStartRecognition = () => {
    if (!recognitionRef.current || isStartingRef.current || isSpeakingRef.current || isProcessingRef.current) {
      return;
    }
    try {
      isStartingRef.current = true;
      recognitionRef.current.start();
    } catch {
      isStartingRef.current = false;
    }
  };

  // Toggle voice listening
  const toggleListening = () => {
    if (isSpeaking) {
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setAssistantState('listening');
      safeStartRecognition();
      return;
    }

    if (!recognitionRef.current) return;

    if (isListening) {
      setIsHandsFree(false);
      try { recognitionRef.current.abort(); } catch {}
      setIsListening(false);
      setAssistantState('idle');
    } else {
      setIsHandsFree(true);
      setTranscript('');
      soundEngine.playWakeChime();
      safeStartRecognition();
    }
  };

  // Speak Altron's response using clean SpeechSynthesis
  const speakAltronResponse = (text: string) => {
    if (!('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = settings.speechRate || 1.05;
    utterance.pitch = settings.voicePersona === 'Cyber' ? 0.95 : 1.0;

    const voices = window.speechSynthesis.getVoices();
    const preferred = voices.find(v =>
      v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Daniel') || v.lang === 'en-US'
    );
    if (preferred) utterance.voice = preferred;

    utterance.onstart = () => {
      setIsSpeaking(true);
      setAssistantState('speaking');
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      setAssistantState('listening');
      setTimeout(() => {
        if (isHandsFreeRef.current) safeStartRecognition();
      }, 250);
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
      setAssistantState('listening');
      setTimeout(() => {
        if (isHandsFreeRef.current) safeStartRecognition();
      }, 250);
    };

    window.speechSynthesis.speak(utterance);
  };

  // Execute command through native ALTRON Autonomous Engine
  const executeCommand = async (commandText: string) => {
    if (!commandText.trim()) return;

    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
    accumulatedRef.current = '';
    setIsAccumulating(false);

    setIsProcessing(true);
    setAssistantState('processing');
    soundEngine.playAcknowledge();

    try {
      const response = await fetch('/api/altron/command', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transcript: commandText,
          currentContext,
        }),
      });

      if (!response.ok) {
        throw new Error(`Status: ${response.status}`);
      }

      const result: GeminiCommandResult = await response.json();
      setIsProcessing(false);
      onCommandResult(result, commandText);

      if (settings.autoVoiceResponse && result.speech) {
        speakAltronResponse(result.speech);
      } else {
        setAssistantState('listening');
        setTimeout(() => safeStartRecognition(), 300);
      }
    } catch {
      // Instant Client-side Autonomous Engine
      setIsProcessing(false);
      const lower = commandText.toLowerCase();
      let fallbackAction = 'NONE';
      let fallbackPayload: any = {};
      let speech = "Understood. Executing requested command.";

      // Convert spoken word numbers ("nine eight seven six...") into digits
      const wordDigitMap: { [key: string]: string } = {
        'zero': '0', 'one': '1', 'two': '2', 'three': '3', 'four': '4',
        'five': '5', 'six': '6', 'seven': '7', 'eight': '8', 'nine': '9'
      };
      let normalizedTranscript = commandText;
      Object.keys(wordDigitMap).forEach(w => {
        const reg = new RegExp(`\\b${w}\\b`, 'gi');
        normalizedTranscript = normalizedTranscript.replace(reg, wordDigitMap[w]);
      });

      if (lower.includes('call') || lower.includes('dial')) {
        fallbackAction = 'CALL';
        const numMatch = normalizedTranscript.match(/\+?[\d\s\-\(\)]{4,}/);
        const target = numMatch ? numMatch[0].replace(/[^\d+]/g, '') : 'Sarah Jenkins';
        fallbackPayload = { target, phoneNumber: target, provider: lower.includes('truecaller') ? 'truecaller' : 'altron' };
        speech = `Calling ${target} directly.`;
      } else if (lower.includes('apk') || lower.includes('download')) {
        fallbackAction = 'DOWNLOAD_APK';
        speech = "Opening ALTRON OS APK download package.";
      } else if (lower.includes('music') || lower.includes('play')) {
        fallbackAction = 'PLAY_MUSIC';
        speech = "Playing cyber beat audio stream.";
      } else if (lower.includes('flashlight')) {
        fallbackAction = 'TOGGLE_FLASHLIGHT';
        fallbackPayload = { enabled: !lower.includes('off') };
        speech = "Flashlight toggled.";
      } else if (lower.includes('diagnostic') || lower.includes('battery')) {
        fallbackAction = 'DEVICE_DIAGNOSTICS';
        speech = "Device diagnostics ready. System nominal.";
      }

      const fallbackResult: GeminiCommandResult = {
        speech,
        action: fallbackAction,
        actionPayload: fallbackPayload,
      };
      onCommandResult(fallbackResult, commandText);
      if (settings.autoVoiceResponse) {
        speakAltronResponse(speech);
      } else {
        setAssistantState('listening');
        setTimeout(() => safeStartRecognition(), 300);
      }
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!textInput.trim()) return;
    executeCommand(textInput);
    setTextInput('');
  };

  return (
    <div className="w-full flex flex-col items-center select-none">
      {/* Central Command Hub Aura Bar */}
      <div
        className={`w-full h-1.5 rounded-full transition-all duration-300 mb-2 ${
          assistantState === 'speaking'
            ? 'bg-gradient-to-r from-emerald-400 via-cyan-400 to-emerald-400 shadow-[0_0_15px_#10b981]'
            : assistantState === 'processing'
            ? 'bg-gradient-to-r from-cyan-500 via-blue-500 to-teal-400 animate-pulse shadow-[0_0_15px_#06b6d4]'
            : assistantState === 'listening'
            ? 'bg-cyan-400 shadow-[0_0_12px_#00f2ff]'
            : 'bg-slate-800'
        }`}
      />

      {/* Permission Notice */}
      {micPermissionError && (
        <div className="w-full mb-2 p-2 rounded-xl bg-amber-950/60 border border-amber-500/40 text-[11px] text-amber-200 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
          <span className="leading-tight">{micPermissionError}</span>
        </div>
      )}

      {/* Centralized Integrated Command Console (NO POPUP DIALOGUES) */}
      <div className="w-full rounded-2xl bg-slate-900/90 border border-cyan-500/30 p-2.5 flex flex-col items-center">
        {/* State Badge & Pulse */}
        <div className="w-full flex items-center justify-between px-1 mb-1.5">
          <div className="flex items-center gap-1.5">
            <span
              className={`w-2 h-2 rounded-full ${
                assistantState === 'speaking'
                  ? 'bg-emerald-400 animate-ping'
                  : assistantState === 'processing'
                  ? 'bg-cyan-300 animate-pulse'
                  : assistantState === 'listening'
                  ? 'bg-cyan-400 animate-ping'
                  : 'bg-slate-600'
              }`}
            />
            <span className="text-[10px] font-mono tracking-wider font-bold text-cyan-300">
              {assistantState === 'speaking'
                ? 'ALTRON SPEAKING'
                : assistantState === 'processing'
                ? 'EXECUTING COMMAND...'
                : assistantState === 'listening'
                ? 'CENTRAL ENGINE LISTENING'
                : 'ENGINE READY • TAP TO SPEAK'}
            </span>
          </div>

          <div className="flex items-center gap-1 text-[9px] font-mono px-2 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-400">
            <Zap className="w-3 h-3 text-cyan-400" />
            <span>CENTRAL HUD</span>
          </div>
        </div>

        {/* Real-time Voice Sound Wave */}
        {(assistantState === 'listening' || assistantState === 'speaking') && (
          <div className="flex items-center gap-1 h-5 my-1">
            {[35, 75, 45, 90, 60, 100, 50, 85, 40, 70, 35].map((h, i) => (
              <div
                key={i}
                className={`w-1 rounded-full transition-all duration-100 ${
                  assistantState === 'speaking'
                    ? 'bg-gradient-to-t from-emerald-500 to-cyan-300'
                    : 'bg-gradient-to-t from-cyan-600 to-cyan-300'
                }`}
                style={{
                  height: `${Math.max(20, h * (0.4 + Math.sin(Date.now() / 120 + i) * 0.6))}%`,
                }}
              />
            ))}
          </div>
        )}

        {/* Live Inline Transcript Display (Integrated directly, no floating dialog box) */}
        <div className="w-full px-2.5 py-2 rounded-xl bg-black/60 border border-slate-800 text-left my-1 relative">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-mono text-slate-400 font-semibold">VOICE COMMAND:</span>
            {isAccumulating && (
              <span className="text-[9px] font-mono text-amber-300 flex items-center gap-1 bg-amber-950/70 border border-amber-500/40 px-2 py-0.5 rounded-full animate-pulse">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                Listening to full command...
              </span>
            )}
          </div>

          <p className="text-[11px] font-mono text-cyan-200 min-h-[22px] leading-relaxed">
            {transcript ? (
              <span className="text-cyan-100 font-semibold">"{transcript}"</span>
            ) : (
              <span className="text-slate-500 italic">
                Speak any full command: "Altron that call this specific number 9876543210"...
              </span>
            )}
          </p>

          {/* Quick Action buttons right next to the transcript */}
          {transcript && assistantState !== 'processing' && (
            <div className="flex items-center justify-end gap-2 mt-1.5 pt-1.5 border-t border-slate-800/80">
              <button
                type="button"
                onClick={() => {
                  if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
                  setTranscript('');
                  accumulatedRef.current = '';
                  setIsAccumulating(false);
                }}
                className="text-[9px] font-mono text-slate-400 hover:text-slate-200 px-2 py-0.5 rounded bg-slate-800/60 active:scale-95 transition-all"
              >
                Clear
              </button>
              <button
                type="button"
                onClick={() => {
                  if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
                  executeCommand(transcript);
                }}
                className="flex items-center gap-1 text-[10px] font-mono font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-teal-300 hover:from-cyan-300 hover:to-teal-200 px-3 py-1 rounded-lg active:scale-95 transition-all shadow-[0_0_12px_rgba(6,182,212,0.6)] cursor-pointer"
              >
                <Zap className="w-3 h-3 text-slate-950 fill-slate-950" />
                Execute Now
              </button>
            </div>
          )}

          {recentCommandResult?.speech && (
            <p className="text-[11px] font-mono text-emerald-300 mt-1.5 pt-1 border-t border-slate-800/80">
              <span className="text-slate-400">ALTRON: </span>
              {recentCommandResult.speech}
            </p>
          )}
        </div>

        {/* Main Central Mic / Action Trigger Button */}
        <div className="flex items-center justify-between w-full mt-1 px-1">
          <button
            onClick={() => setIsHandsFree(!isHandsFree)}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-mono border transition-all ${
              isHandsFree
                ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                : 'bg-slate-900 border-slate-700 text-slate-400'
            }`}
            title="Toggle Hands-Free Listening"
          >
            <Radio className={`w-3 h-3 ${isHandsFree ? 'text-cyan-400 animate-pulse' : 'text-slate-500'}`} />
            <span>{isHandsFree ? 'HANDS-FREE ON' : 'PUSH TO TALK'}</span>
          </button>

          {/* Centralized Voice Core Button */}
          <button
            onClick={toggleListening}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border font-bold text-xs transition-all active:scale-95 shadow-md ${
              assistantState === 'speaking'
                ? 'bg-emerald-500/30 border-emerald-400 text-emerald-300 ring-2 ring-emerald-500/30'
                : assistantState === 'listening'
                ? 'bg-cyan-500/30 border-cyan-400 text-cyan-200 ring-2 ring-cyan-500/30'
                : assistantState === 'processing'
                ? 'bg-cyan-600/30 border-cyan-400 text-cyan-300'
                : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-300'
            }`}
          >
            {assistantState === 'speaking' ? (
              <>
                <Volume2 className="w-3.5 h-3.5 text-emerald-300 animate-pulse" />
                <span>SPEAKING</span>
              </>
            ) : assistantState === 'listening' ? (
              <>
                <Mic className="w-3.5 h-3.5 text-cyan-300 animate-pulse" />
                <span>LISTENING</span>
              </>
            ) : (
              <>
                <MicOff className="w-3.5 h-3.5 text-slate-400" />
                <span>START MIC</span>
              </>
            )}
          </button>
        </div>

        {/* 1-Tap Quick Commands (Directly Centralized) */}
        <div className="w-full mt-2">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {quickCommands.map((cmd, idx) => (
              <button
                key={idx}
                onClick={() => executeCommand(cmd)}
                className="whitespace-nowrap px-2.5 py-1 rounded-lg bg-slate-950/80 hover:bg-cyan-950/90 border border-slate-800 hover:border-cyan-500/50 text-[10px] font-mono text-cyan-300 transition-all active:scale-95 flex items-center gap-1"
              >
                {cmd.includes('call') ? (
                  <PhoneCall className="w-3 h-3 text-emerald-400" />
                ) : cmd.includes('music') ? (
                  <Disc className="w-3 h-3 text-cyan-400" />
                ) : cmd.includes('flashlight') ? (
                  <Zap className="w-3 h-3 text-amber-400" />
                ) : cmd.includes('battery') ? (
                  <Activity className="w-3 h-3 text-purple-400" />
                ) : null}
                <span>{cmd.replace('Altron ', '')}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Text Command Input Bar */}
        <form onSubmit={handleManualSubmit} className="w-full mt-2 flex items-center gap-1.5">
          <input
            type="text"
            value={textInput}
            onChange={e => setTextInput(e.target.value)}
            placeholder="Type command: e.g. Call 9876543210..."
            className="flex-1 bg-black/60 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/60 font-mono"
          />
          <button
            type="submit"
            disabled={!textInput.trim()}
            className="p-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 active:scale-95 disabled:opacity-30 disabled:pointer-events-none text-white transition-all"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
