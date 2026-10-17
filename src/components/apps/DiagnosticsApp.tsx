import React from 'react';
import { Cpu, HardDrive, BatteryCharging, Zap, ShieldCheck, Activity } from 'lucide-react';
import { PhoneSettings } from '../../types';

interface DiagnosticsAppProps {
  settings: PhoneSettings;
}

export const DiagnosticsApp: React.FC<DiagnosticsAppProps> = ({ settings }) => {
  return (
    <div className="flex flex-col h-full bg-slate-950 text-white select-none p-4 overflow-y-auto space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-cyan-400" />
          <h3 className="font-bold text-sm text-white">ALTRON Core Diagnostics</h3>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
          ALL SYSTEMS NOMINAL
        </span>
      </div>

      {/* Hardware Metrics Cards */}
      <div className="grid grid-cols-2 gap-3">
        {/* CPU */}
        <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-mono">CPU LOAD</span>
            <Cpu className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-xl font-bold font-mono text-cyan-300">18.4%</div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
            <div className="bg-cyan-400 h-full w-[18%]" />
          </div>
          <span className="text-[10px] text-slate-500 mt-1 block">8 Cores • 3.2 GHz Neural Engine</span>
        </div>

        {/* RAM */}
        <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-mono">MEMORY RAM</span>
            <HardDrive className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-xl font-bold font-mono text-purple-300">4.2 / 12 GB</div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
            <div className="bg-purple-400 h-full w-[35%]" />
          </div>
          <span className="text-[10px] text-slate-500 mt-1 block">LPDDR5X Fast Cache</span>
        </div>

        {/* Battery */}
        <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-mono">POWER CELL</span>
            <BatteryCharging className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl font-bold font-mono text-emerald-300">{settings.batteryLevel}%</div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
            <div className="bg-emerald-400 h-full" style={{ width: `${settings.batteryLevel}%` }} />
          </div>
          <span className="text-[10px] text-slate-500 mt-1 block">Health 99% • 38.2°C Nominal</span>
        </div>

        {/* Neural AI Latency */}
        <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-mono">GEMINI LATENCY</span>
            <Zap className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-xl font-bold font-mono text-amber-300">48 ms</div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
            <div className="bg-amber-400 h-full w-[24%]" />
          </div>
          <span className="text-[10px] text-slate-500 mt-1 block">Gemini 3.8 Flash Direct Link</span>
        </div>
      </div>

      {/* Security & Enclave */}
      <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-2">
        <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono">
          <ShieldCheck className="w-4 h-4" />
          <span>HARDWARE SECURITY ENCLAVE</span>
        </div>
        <div className="text-xs text-slate-300 leading-relaxed">
          ALTRON operates inside an isolated cryptographic hardware container. Voice synthesis, contacts processing, and calls are end-to-end encrypted with zero external data telemetry.
        </div>
        <div className="grid grid-cols-2 gap-2 pt-2 text-[11px] font-mono text-slate-400">
          <div className="flex justify-between p-2 rounded-lg bg-slate-950">
            <span>Kernel:</span>
            <span className="text-cyan-400">Altron-RT 4.19</span>
          </div>
          <div className="flex justify-between p-2 rounded-lg bg-slate-950">
            <span>Sandboxing:</span>
            <span className="text-emerald-400">Enforced</span>
          </div>
        </div>
      </div>
    </div>
  );
};
