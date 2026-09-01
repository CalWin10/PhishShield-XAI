import React from 'react';
import { Zap, Layers, Info, Check } from 'lucide-react';
import { ScanMode } from '@/types';

export interface ScanModeSelectorProps {
  mode: ScanMode;
  onChange: (mode: ScanMode) => void;
  disabled?: boolean;
}

export function ScanModeSelector({ mode, onChange, disabled }: ScanModeSelectorProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold uppercase tracking-wider text-brand-dark/80 flex items-center gap-1.5">
          <span>Analysis Pipeline Mode</span>
        </label>
        <span className="text-[11px] text-brand-dark/60 font-medium">Select evaluation depth</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Quick Mode */}
        <div
          onClick={() => !disabled && onChange('QUICK')}
          className={`relative p-3.5 rounded-xl border cursor-pointer transition-all ${
            mode === 'QUICK'
              ? 'bg-[#ede3d5] border-brand-medium ring-2 ring-brand-medium/30 shadow-xs'
              : 'bg-[#f4ebe1] border-brand-light/40 hover:bg-brand-secondary/30'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-2.5">
              <div className={`p-1.5 rounded-lg ${mode === 'QUICK' ? 'bg-brand-medium text-white' : 'bg-brand-secondary/50 text-brand-dark'}`}>
                <Zap className="h-4 w-4" />
              </div>
              <div>
                <span className="text-sm font-bold text-brand-dark">Quick Scan</span>
                <span className="ml-2 inline-block px-1.5 py-0.2 text-[10px] font-bold bg-amber-200 text-amber-900 rounded">
                  ~300ms
                </span>
              </div>
            </div>
            {mode === 'QUICK' && <Check className="h-4 w-4 text-brand-medium" />}
          </div>
          <p className="mt-2 text-xs text-brand-dark/70 leading-relaxed">
            Immediate real-time heuristic matching, syntactic URL parsing, and fast neural classification.
          </p>
        </div>

        {/* Deep Mode */}
        <div
          onClick={() => !disabled && onChange('DEEP')}
          className={`relative p-3.5 rounded-xl border cursor-pointer transition-all ${
            mode === 'DEEP'
              ? 'bg-[#ede3d5] border-brand-medium ring-2 ring-brand-medium/30 shadow-xs'
              : 'bg-[#f4ebe1] border-brand-light/40 hover:bg-brand-secondary/30'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-2.5">
              <div className={`p-1.5 rounded-lg ${mode === 'DEEP' ? 'bg-brand-medium text-white' : 'bg-brand-secondary/50 text-brand-dark'}`}>
                <Layers className="h-4 w-4" />
              </div>
              <div>
                <span className="text-sm font-bold text-brand-dark">Deep XAI Forensics</span>
                <span className="ml-2 inline-block px-1.5 py-0.2 text-[10px] font-bold bg-brand-medium text-white rounded">
                  Asynchronous
                </span>
              </div>
            </div>
            {mode === 'DEEP' && <Check className="h-4 w-4 text-brand-medium" />}
          </div>
          <p className="mt-2 text-xs text-brand-dark/70 leading-relaxed">
            Multi-stage pipeline with asynchronous polling, sandbox rendering, TLS probing, and full SHAP evidence.
          </p>
        </div>
      </div>
    </div>
  );
}
