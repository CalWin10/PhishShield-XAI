import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Download,
  Sparkles,
  AlertCircle,
  RotateCcw,
  ExternalLink,
  ShieldAlert,
  Activity,
  Zap,
  Radio,
  FileCheck,
  CheckCircle2,
} from 'lucide-react';
import { AnalysisResult, EmailScanRequest, ScanMode, UrlScanRequest, ApiError } from '@/types';
import { analysisApi } from '@/api/analysisApi';
import { reportApi } from '@/api/reportApi';
import { SubmissionTabs } from '@/features/scan/SubmissionTabs';
import { RiskSummary } from '@/components/RiskSummary';
import { EvidenceList } from '@/components/EvidenceList';
import { RecommendedActionPanel } from '@/components/RecommendedActionPanel';
import { DeepScanProgress } from '@/components/DeepScanProgress';
import { FeedbackDialog } from '@/components/FeedbackDialog';
import { ApiErrorBanner } from '@/components/ApiErrorBanner';
import { Button } from '@/components/ui/button';
import { useAnalysisPolling } from '@/hooks/useAnalysisPolling';
import { Card } from '@/components/ui/card';
import { formatDate } from '@/lib/utils';
import { AnimatedBackground } from '@/components/AnimatedBackground';
import { BorderGlow } from '@/components/react-bits/BorderGlow';

export function ScanPage() {
  const navigate = useNavigate();
  const [currentResult, setCurrentResult] = useState<AnalysisResult | null>(null);
  const [activeAnalysisId, setActiveAnalysisId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<ApiError | Error | null>(null);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);

  // Polling hook for asynchronous deep scan progression
  const shouldPoll =
    !!activeAnalysisId &&
    (currentResult?.status === 'QUEUED' || currentResult?.status === 'PROCESSING');

  const { pollCount } = useAnalysisPolling(
    shouldPoll ? activeAnalysisId : null,
    {
      enabled: shouldPoll,
      onComplete: (completedResult) => {
        setCurrentResult(completedResult);
      },
      onError: (err) => {
        console.error('Polling error:', err);
        setError(err);
      },
    }
  );

  const handleScanEmail = async (data: EmailScanRequest) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const res = await analysisApi.analyseEmail(data);
      setCurrentResult(res);
      setActiveAnalysisId(res.analysisId);
    } catch (err: any) {
      setError(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleScanUrl = async (data: UrlScanRequest) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const res = await analysisApi.analyseUrl(data);
      setCurrentResult(res);
      setActiveAnalysisId(res.analysisId);
    } catch (err: any) {
      setError(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleScanEml = async (file: File, mode: ScanMode) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const res = await analysisApi.analyseEmailFile(file, mode);
      setCurrentResult(res);
      setActiveAnalysisId(res.analysisId);
    } catch (err: any) {
      setError(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetScan = () => {
    setCurrentResult(null);
    setActiveAnalysisId(null);
    setError(null);
  };

  return (
    <div className="w-full space-y-8 pb-16 relative">
      <AnimatedBackground variant="ghost-fibers" opacity={0.85} />

      {/* Hero Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-brand-light/30 pb-6 relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-[#d6edde] text-[#005a36] border border-[#8ec7a4]">
              LIVE TRIAGE ACTIVE
            </span>
            <span className="text-xs font-mono text-brand-dark/70">
              SOC NODE: CERT-IN-LEAD
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-brand-dark font-flaviotte">
            Phishing Triage & Explainable AI Investigation
          </h1>
          <p className="mt-1.5 text-sm sm:text-base text-brand-dark/80 max-w-4xl leading-relaxed font-subtext font-medium">
            Multi-modal Explainable AI engine evaluating header integrity, domain reputation,
            DKIM/SPF alignment, psychological urgency cues, and adversarial indicators across full-spectrum telemetry.
          </p>
        </div>

        {currentResult && (
          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(`/analyses/${currentResult.analysisId}`)}
              className="gap-1.5 font-semibold bg-white/80 border-brand-light/50 text-brand-dark hover:bg-white"
            >
              <ExternalLink className="h-4 w-4 text-brand-medium" />
              <span>Permalink</span>
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={handleResetScan}
              className="gap-1.5 font-semibold"
            >
              <RotateCcw className="h-4 w-4" />
              <span>New Scan</span>
            </Button>
          </div>
        )}
      </div>

      {/* Error Banner */}
      {error && (
        <div className="relative z-10">
          <ApiErrorBanner
            error={error}
            onDismiss={() => setError(null)}
            isRetrying={isSubmitting}
          />
        </div>
      )}

      {/* Ingestion Console: Wide Layout */}
      {!currentResult && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative z-10">
          {/* Main Ingestion Form (Cursor-responsive) */}
          <div className="lg:col-span-8">
            <SubmissionTabs
              onScanEmail={handleScanEmail}
              onScanUrl={handleScanUrl}
              onScanEml={handleScanEml}
              isLoading={isSubmitting}
            />
          </div>

          {/* Side Telemetry & Threat Swachhta Feed */}
          <div className="lg:col-span-4 space-y-5">
            <BorderGlow glowColor="#A78D78" borderRadius="18px">
              <div className="p-5 rounded-2xl border border-brand-light/40 bg-[#ebe0d1] space-y-4">
                <div className="flex items-center justify-between border-b border-brand-light/30 pb-3">
                  <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4 text-brand-medium" />
                    <h3 className="text-sm font-bold text-brand-dark uppercase tracking-wider font-flaviotte">
                      Active Threat Campaigns
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#f4deda] text-[#842018] border border-[#d99f97]">
                    ACTIVE WAVES
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="p-3 rounded-xl bg-white/70 border border-brand-light/40 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-brand-dark font-flaviotte">SBI YONO APK Dropper</span>
                      <span className="text-[10px] font-mono font-bold text-[#842018] bg-[#f4deda] px-1.5 py-0.5 rounded">98% Risk</span>
                    </div>
                    <p className="text-xs text-brand-dark/80 font-subtext">
                      Fake SMS campaign claiming PAN expiry redirecting to malicious APK downloads.
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-white/70 border border-brand-light/40 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-brand-dark font-flaviotte">ITR Refund Lure AY2026</span>
                      <span className="text-[10px] font-mono font-bold text-[#842018] bg-[#f4deda] px-1.5 py-0.5 rounded">92% Risk</span>
                    </div>
                    <p className="text-xs text-brand-dark/80 font-subtext">
                      Impersonating Income Tax Department with fake netbanking credential harvesting portals.
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-white/70 border border-brand-light/40 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-brand-dark font-flaviotte">EPFO Passbook Spoofing</span>
                      <span className="text-[10px] font-mono font-bold text-[#7a4816] bg-[#f7ebd8] px-1.5 py-0.5 rounded">84% Risk</span>
                    </div>
                    <p className="text-xs text-brand-dark/80 font-subtext">
                      Phishing emails prompting UAN update via lookalike .top domains.
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-brand-light/20 flex items-center justify-between text-xs text-brand-dark/70 font-mono">
                  <span>Feed Sync: Live</span>
                  <span className="text-[#005a36] font-bold flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-[#005a36] animate-ping" />
                    CERT-In Swachhta
                  </span>
                </div>
              </div>
            </BorderGlow>

            {/* Neural XAI Model Specifications */}
            <div className="p-5 rounded-2xl border border-brand-light/40 bg-[#dfd0bd]/80 space-y-2 text-xs">
              <div className="flex items-center gap-2 font-bold text-brand-dark font-flaviotte">
                <Zap className="h-4 w-4 text-brand-medium" />
                <span>Explainable AI Architecture</span>
              </div>
              <p className="text-brand-dark/80 font-subtext leading-relaxed">
                Uses Transformer attention maps and SHAP token attribution to explain exactly why an email, URL, or EML file is malicious without opaque black-box decisions.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Investigation Details View */}
      {currentResult && (
        <div className="space-y-6 relative z-10">
          {/* Deep Scan Progress Stepper (when queued/processing) */}
          {(currentResult.status === 'QUEUED' || currentResult.status === 'PROCESSING') && (
            <DeepScanProgress
              result={currentResult}
              pollCount={pollCount}
            />
          )}

          {/* Results Area */}
          {currentResult.status === 'COMPLETE' && (
            <div className="space-y-6">
              {/* Risk Summary Gauge & Key Metrics */}
              <RiskSummary result={currentResult} />

              {/* Two Column Grid: Evidence Breakdown & Action Protocol */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-7 space-y-6">
                  <EvidenceList indicators={currentResult.indicators} />
                </div>

                <div className="lg:col-span-5 space-y-6">
                  <RecommendedActionPanel
                    result={currentResult}
                    onOpenFeedback={() => setIsFeedbackOpen(true)}
                  />

                  {/* Metadata Snapshot */}
                  {currentResult.submittedMetadata && (
                    <div className="p-5 rounded-2xl border border-brand-light/40 bg-[#ebe0d1] text-xs space-y-2.5">
                      <h4 className="font-bold text-brand-dark uppercase tracking-wider text-xs font-flaviotte">
                        Target Vector Metadata Snapshot
                      </h4>
                      {currentResult.submittedMetadata.from && (
                        <div>
                          <span className="font-semibold text-brand-dark/70">From: </span>
                          <span className="font-mono text-brand-dark break-all bg-white/60 px-2 py-0.5 rounded border border-brand-light/30">
                            {currentResult.submittedMetadata.from}
                          </span>
                        </div>
                      )}
                      {currentResult.submittedMetadata.replyTo && (
                        <div>
                          <span className="font-semibold text-brand-dark/70">Reply-To: </span>
                          <span className="font-mono text-brand-dark break-all bg-white/60 px-2 py-0.5 rounded border border-brand-light/30">
                            {currentResult.submittedMetadata.replyTo}
                          </span>
                        </div>
                      )}
                      {currentResult.submittedMetadata.subject && (
                        <div>
                          <span className="font-semibold text-brand-dark/70">Subject: </span>
                          <span className="text-brand-dark font-medium">
                            {currentResult.submittedMetadata.subject}
                          </span>
                        </div>
                      )}
                      {currentResult.submittedMetadata.url && (
                        <div>
                          <span className="font-semibold text-brand-dark/70">Target URL: </span>
                          <span className="font-mono text-brand-dark break-all bg-white/60 px-2 py-0.5 rounded border border-brand-light/30">
                            {currentResult.submittedMetadata.url}
                          </span>
                        </div>
                      )}
                      {currentResult.submittedMetadata.fileName && (
                        <div>
                          <span className="font-semibold text-brand-dark/70">Uploaded File: </span>
                          <span className="font-mono text-brand-dark bg-white/60 px-2 py-0.5 rounded border border-brand-light/30">
                            {currentResult.submittedMetadata.fileName}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Failed Status Box */}
          {currentResult.status === 'FAILED' && (
            <Card className="border-red-300 bg-red-50 p-6 text-center">
              <AlertCircle className="h-10 w-10 text-red-700 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-red-950 font-flaviotte">Threat Inspection Pipeline Failed</h3>
              <p className="text-sm text-red-900 mt-1 max-w-md mx-auto">
                The analysis worker encountered an unrecoverable decoding error or parser timeout.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={handleResetScan}
                className="mt-4 border-red-300 text-red-900"
              >
                Retry Analysis
              </Button>
            </Card>
          )}

          {/* Feedback Dialog */}
          <FeedbackDialog
            open={isFeedbackOpen}
            onOpenChange={setIsFeedbackOpen}
            analysisId={currentResult.analysisId}
          />
        </div>
      )}
    </div>
  );
}
