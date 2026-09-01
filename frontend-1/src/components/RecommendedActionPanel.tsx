import React from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  ShieldX,
  AlertTriangle,
  Flame,
  CheckCircle2,
  FileCheck,
  Download,
  Share2,
} from 'lucide-react';
import { AnalysisResult, RecommendedAction } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getActionExplanation } from '@/lib/utils';
import { reportApi } from '@/api/reportApi';

export interface RecommendedActionPanelProps {
  result: AnalysisResult;
  onOpenFeedback?: () => void;
}

export function RecommendedActionPanel({ result, onOpenFeedback }: RecommendedActionPanelProps) {
  const [isDownloading, setIsDownloading] = React.useState(false);
  const [downloadSuccess, setDownloadSuccess] = React.useState(false);

  const { recommendedAction, status, analysisId, verdict } = result;
  const actionMeta = getActionExplanation(recommendedAction);

  const handleDownloadReport = async () => {
    if (status !== 'COMPLETE') return;
    try {
      setIsDownloading(true);
      const { blob, filename } = await reportApi.downloadReport(analysisId);
      reportApi.triggerBlobDownload(blob, filename);
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to download report:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  const getActionIcon = (action: RecommendedAction | null) => {
    switch (action) {
      case 'BLOCK_AND_REPORT':
        return <ShieldX className="h-6 w-6 text-red-700" />;
      case 'QUARANTINE':
        return <Flame className="h-6 w-6 text-orange-700" />;
      case 'INVESTIGATE':
        return <AlertTriangle className="h-6 w-6 text-amber-700" />;
      case 'ALLOW_WITH_CAUTION':
        return <ShieldCheck className="h-6 w-6 text-[#005a36]" />;
      default:
        return <ShieldAlert className="h-6 w-6 text-brand-medium" />;
    }
  };

  const getCardBorder = (action: RecommendedAction | null) => {
    switch (action) {
      case 'BLOCK_AND_REPORT':
        return 'border-red-400 bg-red-50/50';
      case 'QUARANTINE':
        return 'border-orange-400 bg-orange-50/50';
      case 'INVESTIGATE':
        return 'border-amber-400 bg-amber-50/50';
      case 'ALLOW_WITH_CAUTION':
        return 'border-[#8ec7a4] bg-[#d6edde]/50';
      default:
        return 'border-brand-light/40 bg-brand-secondary/30';
    }
  };

  return (
    <Card className={`shadow-sm border ${getCardBorder(recommendedAction)}`}>
      <CardHeader className="pb-3 border-b border-brand-light/20 bg-brand-secondary/20">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-bold text-brand-dark flex items-center gap-2">
            {getActionIcon(recommendedAction)}
            Prescribed Incident Response Action
          </CardTitle>
          <span className="text-xs font-mono font-semibold text-brand-dark/70">
            SOAR Protocol
          </span>
        </div>
      </CardHeader>

      <CardContent className="pt-4 space-y-4">
        {/* Recommended Action Detail */}
        <div className="p-4 rounded-xl bg-white/70 border border-brand-light/30 shadow-xs">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-brand-secondary/40 shrink-0 mt-0.5">
              {getActionIcon(recommendedAction)}
            </div>
            <div>
              <h4 className="text-base font-bold text-brand-dark tracking-tight">
                {actionMeta.title}
              </h4>
              <p className="mt-1 text-sm text-brand-dark/85 leading-relaxed">
                {actionMeta.desc}
              </p>
            </div>
          </div>
        </div>

        {/* Action Controls & Report Download */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <div className="flex flex-wrap items-center gap-2">
            <Button
              type="button"
              variant="primary"
              size="md"
              onClick={handleDownloadReport}
              disabled={status !== 'COMPLETE' || isDownloading}
              isLoading={isDownloading}
              className="gap-2 font-semibold"
            >
              {downloadSuccess ? (
                <>
                  <CheckCircle2 className="h-4 w-4 text-emerald-300" />
                  Report Downloaded!
                </>
              ) : (
                <>
                  <Download className="h-4 w-4" />
                  Download Forensic Report (.PDF)
                </>
              )}
            </Button>

            {onOpenFeedback && (
              <Button
                type="button"
                variant="outline"
                size="md"
                onClick={onOpenFeedback}
                className="gap-2"
              >
                <FileCheck className="h-4 w-4 text-brand-medium" />
                Analyst Feedback
              </Button>
            )}
          </div>

          <div className="text-xs text-brand-dark/60 font-medium">
            {status === 'COMPLETE' ? (
              <span className="text-emerald-800 font-semibold flex items-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5 inline text-emerald-700" /> Complete forensic artifact ready
              </span>
            ) : (
              <span>Report enabled upon scan completion</span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
