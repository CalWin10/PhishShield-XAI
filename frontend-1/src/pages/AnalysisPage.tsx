import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Copy,
  Check,
  RotateCcw,
  Clock,
  Shield,
  Loader2,
  AlertCircle,
  FileCheck,
} from 'lucide-react';
import { AnalysisResult, ApiError } from '@/types';
import { analysisApi } from '@/api/analysisApi';
import { useAnalysisPolling } from '@/hooks/useAnalysisPolling';
import { RiskSummary } from '@/components/RiskSummary';
import { EvidenceList } from '@/components/EvidenceList';
import { RecommendedActionPanel } from '@/components/RecommendedActionPanel';
import { DeepScanProgress } from '@/components/DeepScanProgress';
import { FeedbackDialog } from '@/components/FeedbackDialog';
import { ApiErrorBanner } from '@/components/ApiErrorBanner';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { AnimatedBackground } from '@/components/AnimatedBackground';

export function AnalysisPage() {
  const { analysisId } = useParams<{ analysisId: string }>();
  const navigate = useNavigate();

  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<ApiError | Error | null>(null);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  // Initial fetch
  const fetchAnalysis = async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await analysisApi.getAnalysis(id);
      setResult(data);
    } catch (err: any) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (analysisId) {
      fetchAnalysis(analysisId);
    }
  }, [analysisId]);

  // Polling setup if the task is still running
  const isPollingRequired =
    !!analysisId && (result?.status === 'QUEUED' || result?.status === 'PROCESSING');

  const { pollCount } = useAnalysisPolling(
    isPollingRequired ? analysisId : null,
    {
      enabled: isPollingRequired,
      onComplete: (completed) => {
        setResult(completed);
      },
      onError: (err) => {
        setError(err);
      },
    }
  );

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  if (isLoading && !result) {
    return (
      <div className="py-24 text-center space-y-4">
        <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-brand-medium border-t-transparent" />
        <h3 className="text-lg font-bold text-brand-dark">Retrieving Forensic Dossier...</h3>
        <p className="text-xs text-brand-dark/70 font-mono">Analysis ID: {analysisId}</p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6 pb-16 relative">
      <AnimatedBackground variant="ghost-fibers" opacity={0.85} />

      {/* Navigation & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-brand-light/30 pb-4 relative z-10">
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => navigate(-1)}
            className="gap-1 text-xs"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-brand-dark flex items-center gap-2 font-flaviotte">
              <span>Incident Investigation</span>
              <span className="font-mono text-xs px-2 py-0.5 rounded bg-brand-secondary/60 text-brand-dark border border-brand-light/40">
                {analysisId}
              </span>
            </h1>
          </div>
        </div>

        {result && (
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleCopyLink}
              className="gap-1.5 text-xs"
            >
              {copiedLink ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-700" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  <span>Copy Link</span>
                </>
              )}
            </Button>
            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={() => navigate('/')}
              className="gap-1.5 text-xs"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>New Scan</span>
            </Button>
          </div>
        )}
      </div>

      {/* Error state */}
      {error && (
        <div className="relative z-10">
          <ApiErrorBanner
            error={error}
            onDismiss={() => setError(null)}
            onRetry={() => analysisId && fetchAnalysis(analysisId)}
          />
        </div>
      )}

      {/* Deep scan progress bar if currently running */}
      {result && (result.status === 'QUEUED' || result.status === 'PROCESSING') && (
        <div className="relative z-10">
          <DeepScanProgress result={result} pollCount={pollCount} />
        </div>
      )}

      {/* Target Metadata Panel */}
      {result && (
        <div className="p-4 rounded-xl border border-brand-light/40 bg-[#ede3d5]/80 shadow-xs relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div>
              <span className="font-bold text-brand-dark/60 uppercase tracking-wider text-[10px]">
                Target Vector / Origin
              </span>
              <p className="font-mono font-bold text-brand-dark mt-0.5 break-all">
                {result.submittedMetadata?.from ||
                  result.submittedMetadata?.url ||
                  result.submittedMetadata?.fileName ||
                  result.normalizedUrl ||
                  'N/A'}
              </p>
            </div>

            <div>
              <span className="font-bold text-brand-dark/60 uppercase tracking-wider text-[10px]">
                Analysis Pipeline
              </span>
              <p className="font-semibold text-brand-dark mt-0.5">
                {result.mode} Mode ({result.modelVersion || 'Neural v2.4'})
              </p>
            </div>

            <div>
              <span className="font-bold text-brand-dark/60 uppercase tracking-wider text-[10px]">
                Investigation State
              </span>
              <p className="font-bold uppercase tracking-wider text-brand-dark mt-0.5">
                {result.status}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Main Results View */}
      {result && result.status === 'COMPLETE' && (
        <div className="space-y-6">
          <RiskSummary result={result} />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Evidence & Indicators */}
            <div className="lg:col-span-7 space-y-6">
              <EvidenceList indicators={result.indicators} />
            </div>

            {/* Right: SOAR Actions & Target Data */}
            <div className="lg:col-span-5 space-y-6">
              <RecommendedActionPanel
                result={result}
                onOpenFeedback={() => setIsFeedbackOpen(true)}
              />

              {/* Submitted vector information */}
              {result.submittedMetadata && (
                <div className="p-4 rounded-xl border border-brand-light/30 bg-[#ece2d5] text-xs space-y-2">
                  <h4 className="font-bold text-brand-dark uppercase tracking-wider text-[11px]">
                    Payload Context & Ingestion Metadata
                  </h4>
                  {result.submittedMetadata.from && (
                    <div>
                      <span className="font-semibold text-brand-dark/70">From: </span>
                      <span className="font-mono text-brand-dark break-all">{result.submittedMetadata.from}</span>
                    </div>
                  )}
                  {result.submittedMetadata.replyTo && (
                    <div>
                      <span className="font-semibold text-brand-dark/70">Reply-To: </span>
                      <span className="font-mono text-brand-dark break-all">{result.submittedMetadata.replyTo}</span>
                    </div>
                  )}
                  {result.submittedMetadata.subject && (
                    <div>
                      <span className="font-semibold text-brand-dark/70">Subject: </span>
                      <span className="text-brand-dark font-medium">{result.submittedMetadata.subject}</span>
                    </div>
                  )}
                  {result.submittedMetadata.url && (
                    <div>
                      <span className="font-semibold text-brand-dark/70">Target URL: </span>
                      <span className="font-mono text-brand-dark break-all">{result.submittedMetadata.url}</span>
                    </div>
                  )}
                  {result.submittedMetadata.fileName && (
                    <div>
                      <span className="font-semibold text-brand-dark/70">Source File: </span>
                      <span className="font-mono text-brand-dark">{result.submittedMetadata.fileName}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <FeedbackDialog
            open={isFeedbackOpen}
            onOpenChange={setIsFeedbackOpen}
            analysisId={result.analysisId}
          />
        </div>
      )}
    </div>
  );
}
