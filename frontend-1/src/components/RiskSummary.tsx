import React from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  AlertOctagon,
  Cpu,
  Clock,
  Gauge,
  Percent,
  HelpCircle,
} from 'lucide-react';
import { AnalysisResult } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Counter } from '@/components/react-bits/Counter';
import { DecryptedText } from '@/components/react-bits/DecryptedText';
import { BorderGlow } from '@/components/react-bits/BorderGlow';
import { getVerdictTheme } from '@/lib/utils';

export interface RiskSummaryProps {
  result: AnalysisResult;
}

export function RiskSummary({ result }: RiskSummaryProps) {
  const { riskScore, verdict, confidence, latencyMs, modelVersion, mode } = result;
  const verdictMeta = getVerdictTheme(verdict);

  const getVerdictIcon = (v: string | null | undefined) => {
    switch (v) {
      case 'CRITICAL':
        return <AlertOctagon className="h-6 w-6 text-red-700" />;
      case 'HIGH_RISK':
        return <AlertTriangle className="h-6 w-6 text-amber-700" />;
      case 'SUSPICIOUS':
        return <ShieldAlert className="h-6 w-6 text-yellow-700" />;
      case 'LOW_RISK':
        return <ShieldCheck className="h-6 w-6 text-emerald-700" />;
      default:
        return <HelpCircle className="h-6 w-6 text-stone-600" />;
    }
  };

  const getRiskColor = (score: number | null) => {
    if (score === null) return 'bg-stone-400';
    if (score >= 70) return 'bg-red-700';
    if (score >= 40) return 'bg-amber-600';
    return 'bg-emerald-600';
  };

  const getRiskTextColor = (score: number | null) => {
    if (score === null) return '#78716c';
    if (score >= 70) return '#7f1d1d';
    if (score >= 40) return '#78350f';
    return '#065f46';
  };

  const confidencePercent = confidence !== null ? Math.round(confidence * 100) : null;

  return (
    <BorderGlow glowColor="#6E473B" borderRadius="20px">
      <Card className="border-brand-light/40 bg-[#ebe0d1] shadow-sm overflow-hidden rounded-2xl">
        <CardHeader className="pb-4 border-b border-brand-light/30 bg-[#dfd0bd]">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <CardTitle className="text-xl font-bold text-brand-dark">Threat Evaluation Summary</CardTitle>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-brand-medium/20 text-brand-dark border border-brand-medium/30">
                  {mode} SCAN
                </span>
              </div>
              <CardDescription className="text-brand-dark/80 text-xs mt-1 font-subtext">
                Deterministic & machine-learning risk inference synthesis
              </CardDescription>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-brand-dark/70 font-subtext">Verdict:</span>
              <div
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-bold ${verdictMeta.badgeClass}`}
              >
                {getVerdictIcon(verdict)}
                <DecryptedText
                  text={verdictMeta.label}
                  speed={35}
                  maxIterations={8}
                  animateOn="mount"
                  className="font-bold"
                />
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-6 space-y-6">
          {/* Risk Score Gauge with React Bits Counter */}
          <div className="p-5 rounded-xl bg-[#ede3d5] border border-brand-light/40 shadow-inner">
            <div className="flex items-end justify-between mb-2.5">
              <div>
                <span className="text-xs uppercase tracking-wider font-bold text-brand-dark/70 flex items-center gap-1.5">
                  <Gauge className="h-4 w-4 text-brand-medium" />
                  Aggregated Threat Index
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  {riskScore !== null ? (
                    <Counter
                      value={riskScore}
                      fontSize={38}
                      textColor={getRiskTextColor(riskScore)}
                      fontWeight={900}
                      gap={2}
                      padding={2}
                    />
                  ) : (
                    <span className="text-4xl font-extrabold text-stone-500">—</span>
                  )}
                  <span className="text-base font-semibold text-brand-dark/60">/ 100</span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs font-bold text-brand-dark/90 font-subtext">
                  {riskScore !== null
                    ? riskScore >= 70
                      ? 'High Severity Threat Detected'
                      : riskScore >= 40
                      ? 'Elevated Suspicion Markers'
                      : 'Within Normal Safe Thresholds'
                    : 'Computing score...'}
                </span>
                <p className="text-[11px] text-brand-dark/70 mt-0.5 font-subtext">
                  Threshold: &lt;40 Safe | 40-69 Suspicious | &ge;70 Critical
                </p>
              </div>
            </div>

            {/* Accessible Progress Bar */}
            <div className="space-y-1">
              <Progress
                value={riskScore ?? 0}
                max={100}
                indicatorColor={getRiskColor(riskScore)}
                className="h-4 bg-brand-secondary/80"
              />
              <div className="flex justify-between text-[10px] font-semibold text-brand-dark/70 px-0.5 font-subtext">
                <span>0 (Legitimate)</span>
                <span>40 (Suspicious)</span>
                <span>70 (High Risk)</span>
                <span>100 (Critical Malicious)</span>
              </div>
            </div>
          </div>

          {/* Model Metrics Bento Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Confidence */}
            <div className="p-3.5 rounded-xl border border-brand-light/40 bg-[#f4ebe1] flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-brand-secondary/40 text-brand-medium">
                <Percent className="h-4 w-4" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-brand-dark/70 uppercase tracking-wider">AI Confidence</p>
                <div className="text-base font-bold text-brand-dark flex items-baseline">
                  {confidencePercent !== null ? (
                    <>
                      <Counter
                        value={confidencePercent}
                        fontSize={18}
                        textColor="#291C0E"
                        fontWeight={700}
                        gap={1}
                      />
                      <span className="text-xs ml-0.5 font-bold">%</span>
                    </>
                  ) : (
                    'N/A'
                  )}
                </div>
              </div>
            </div>

            {/* Latency */}
            <div className="p-3.5 rounded-xl border border-brand-light/40 bg-[#f4ebe1] flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-brand-secondary/40 text-brand-medium">
                <Clock className="h-4 w-4" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-brand-dark/70 uppercase tracking-wider">Inference Latency</p>
                <p className="text-base font-bold text-brand-dark font-mono">
                  {latencyMs !== null ? `${latencyMs} ms` : '—'}
                </p>
              </div>
            </div>

            {/* Model Version */}
            <div className="p-3.5 rounded-xl border border-brand-light/40 bg-[#f4ebe1] flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-brand-secondary/40 text-brand-medium">
                <Cpu className="h-4 w-4" />
              </div>
              <div className="truncate">
                <p className="text-[11px] font-bold text-brand-dark/70 uppercase tracking-wider">XAI Pipeline</p>
                <p className="text-xs font-bold text-brand-dark font-mono truncate" title={modelVersion || 'phishshield-v3.4'}>
                  {modelVersion || 'phishshield-v3.4'}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </BorderGlow>
  );
}

export default RiskSummary;
