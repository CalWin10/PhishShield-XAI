import React from 'react';
import { Clock, Cpu, CheckCircle, ShieldAlert, Loader2, Sparkles } from 'lucide-react';
import { AnalysisResult, AnalysisStatus } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { formatDate } from '@/lib/utils';

export interface DeepScanProgressProps {
  result: AnalysisResult;
  pollCount: number;
}

export function DeepScanProgress({ result, pollCount }: DeepScanProgressProps) {
  const { status, createdAt, mode } = result;

  const steps = [
    { key: 'QUEUED', label: 'Queued in Threat Queue', desc: 'Assigned to async worker pool' },
    { key: 'PROCESSING', label: 'Deep Pipeline Analysis', desc: 'Running ensemble neural models & threat intel heuristics' },
    { key: 'COMPLETE', label: 'Completed & Verified', desc: 'Risk attribution & report generated' },
  ];

  let currentStepIndex = 0;
  if (status === 'PROCESSING') currentStepIndex = 1;
  if (status === 'COMPLETE') currentStepIndex = 2;
  if (status === 'FAILED') currentStepIndex = 1;

  const progressPercentage =
    status === 'COMPLETE' ? 100 : status === 'PROCESSING' ? Math.min(85, 35 + pollCount * 12) : 20;

  return (
    <Card className="border-brand-medium/50 bg-[#e7dcce] shadow-md overflow-hidden relative">
      {/* Visual radar scanning beam effect */}
      <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-brand-medium to-transparent radar-beam pointer-events-none" />

      <CardHeader className="pb-3 border-b border-brand-light/30 bg-brand-secondary/40">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <CardTitle className="text-lg font-bold text-brand-dark flex items-center gap-2">
              <Loader2 className="h-5 w-5 text-brand-medium animate-spin" />
              Asynchronous Deep PhishShield Scan
            </CardTitle>
            <CardDescription className="text-xs text-brand-dark/70">
              Multi-vector sandbox emulation & deep neural risk scoring (HTTP 202 Accepted)
            </CardDescription>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono bg-brand-secondary/60 px-2.5 py-1 rounded-md border border-brand-light/40">
            <Clock className="h-3.5 w-3.5 text-brand-medium" />
            <span>Started: {formatDate(createdAt)}</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-6 space-y-6">
        {/* Animated Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-semibold text-brand-dark">
            <span className="flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-brand-medium animate-pulse" />
              Status: <span className="uppercase text-brand-medium">{status}</span>
            </span>
            <span>Est. ~4-6 seconds</span>
          </div>
          <Progress value={progressPercentage} max={100} indicatorColor="bg-brand-medium" className="h-3.5" />
        </div>

        {/* Timeline Stepper */}
        <div className="relative pt-2">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {steps.map((step, idx) => {
              const isPast = idx < currentStepIndex;
              const isCurrent = idx === currentStepIndex && status !== 'FAILED';
              const isFailed = status === 'FAILED' && idx === 1;

              return (
                <div
                  key={step.key}
                  className={`p-4 rounded-xl border transition-all ${
                    isCurrent
                      ? 'border-brand-medium bg-[#f5ede3] shadow-sm ring-2 ring-brand-medium/20'
                      : isPast
                      ? 'border-emerald-300 bg-emerald-50/50'
                      : isFailed
                      ? 'border-red-300 bg-red-50'
                      : 'border-brand-light/30 bg-brand-secondary/20 opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-1.5">
                    <div
                      className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold ${
                        isPast
                          ? 'bg-emerald-700 text-white'
                          : isCurrent
                          ? 'bg-brand-medium text-white ring-2 ring-brand-medium/40'
                          : isFailed
                          ? 'bg-red-700 text-white'
                          : 'bg-brand-secondary text-brand-dark'
                      }`}
                    >
                      {isPast ? <CheckCircle className="h-4 w-4" /> : isCurrent ? <Loader2 className="h-4 w-4 animate-spin" /> : idx + 1}
                    </div>
                    <span className="font-bold text-sm text-brand-dark">{step.label}</span>
                  </div>
                  <p className="text-xs text-brand-dark/70 pl-10 leading-snug">{step.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="p-3.5 rounded-lg bg-brand-secondary/40 border border-brand-light/30 flex items-center justify-between text-xs text-brand-dark/80">
          <div className="flex items-center gap-2">
            <Cpu className="h-4 w-4 text-brand-medium" />
            <span>Polling server endpoint <code className="font-mono bg-brand-secondary/60 px-1 py-0.5 rounded">GET /api/v1/analyses/{result.analysisId}</code></span>
          </div>
          <span className="font-mono text-[11px] font-semibold bg-[#f4ebe1] px-2 py-0.5 rounded border border-brand-light/30">
            Poll #{pollCount}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
