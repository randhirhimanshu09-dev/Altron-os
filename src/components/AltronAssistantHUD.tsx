import React from 'react';
import { X, Sparkles, Check, Phone, MessageSquare, Zap, Activity, Info } from 'lucide-react';
import { DisplayCard } from '../types';

interface AltronAssistantHUDProps {
  card: DisplayCard | null;
  onDismiss: () => void;
  onActionClick?: () => void;
}

export const AltronAssistantHUD: React.FC<AltronAssistantHUDProps> = ({
  card,
  onDismiss,
  onActionClick,
}) => {
  if (!card) return null;

  const getIcon = () => {
    switch (card.type) {
      case 'call':
        return <Phone className="w-4 h-4 text-emerald-400" />;
      case 'message':
        return <MessageSquare className="w-4 h-4 text-cyan-400" />;
      case 'toggle':
        return <Zap className="w-4 h-4 text-amber-400" />;
      case 'diagnostic':
        return <Activity className="w-4 h-4 text-purple-400" />;
      default:
        return <Sparkles className="w-4 h-4 text-cyan-400" />;
    }
  };

  return (
    <div className="absolute top-14 left-4 right-4 z-40 animate-in fade-in slide-in-from-top-4 duration-300">
      <div className="relative p-4 rounded-2xl bg-slate-900/95 border border-cyan-500/40 backdrop-blur-xl shadow-2xl shadow-cyan-500/20 text-white">
        {/* Close Button */}
        <button
          onClick={onDismiss}
          className="absolute top-3 right-3 p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Card Header */}
        <div className="flex items-center gap-2 mb-2 pr-6">
          <div className="p-1.5 rounded-lg bg-cyan-950 border border-cyan-500/30">
            {getIcon()}
          </div>
          <div>
            <h4 className="text-xs font-bold text-white tracking-wide">{card.title}</h4>
            <span className="text-[10px] font-mono text-cyan-400">GEMINI NEURAL ENGINE</span>
          </div>
        </div>

        {/* Card Body */}
        <p className="text-xs text-slate-200 leading-relaxed font-sans">{card.body}</p>

        {/* Action Button if appropriate */}
        {onActionClick && (
          <div className="mt-3 pt-2 border-t border-slate-800 flex justify-end">
            <button
              onClick={onActionClick}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300 text-xs font-medium transition-all"
            >
              <Check className="w-3.5 h-3.5" />
              <span>View Details</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
