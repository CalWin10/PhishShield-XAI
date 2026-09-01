import React from 'react';
import { AlertCircle, RefreshCw, X, ShieldAlert } from 'lucide-react';
import { ApiError } from '@/types';
import { Button } from '@/components/ui/button';

export interface ApiErrorBannerProps {
  error: ApiError | Error | string | null;
  onRetry?: () => void;
  onDismiss?: () => void;
  isRetrying?: boolean;
}

export function ApiErrorBanner({ error, onRetry, onDismiss, isRetrying = false }: ApiErrorBannerProps) {
  if (!error) return null;

  let message = 'An unknown error occurred during analysis.';
  let traceId: string | null = null;
  let code: string | null = null;
  let fieldErrors: Record<string, string> | undefined;

  if (typeof error === 'string') {
    message = error;
  } else if ('traceId' in error) {
    message = error.message;
    traceId = error.traceId;
    code = error.code;
    fieldErrors = error.fieldErrors;
  } else if (error instanceof Error) {
    message = error.message;
  }

  return (
    <div
      role="alert"
      className="w-full rounded-xl border border-red-300 bg-red-50/90 p-4 text-red-950 shadow-sm animate-in fade-in duration-200"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="p-1.5 rounded-lg bg-red-100 text-red-700 mt-0.5 shrink-0">
            <AlertCircle className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-semibold text-sm text-red-950">Investigation Service Alert</h4>
              {code && (
                <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-red-200/80 text-red-900 rounded">
                  {code}
                </span>
              )}
            </div>
            <p className="mt-1 text-sm text-red-900 leading-relaxed">{message}</p>

            {fieldErrors && Object.keys(fieldErrors).length > 0 && (
              <div className="mt-2 space-y-1 text-xs text-red-800">
                {Object.entries(fieldErrors).map(([field, err]) => (
                  <div key={field} className="flex items-center gap-1.5">
                    <span className="font-semibold text-red-900">{field}:</span>
                    <span>{err}</span>
                  </div>
                ))}
              </div>
            )}

            {traceId && (
              <div className="mt-2 flex items-center gap-2 text-[11px] font-mono text-red-800/80">
                <span>Trace ID:</span>
                <code className="bg-red-200/60 px-1.5 py-0.5 rounded text-red-950 select-all font-semibold">
                  {traceId}
                </code>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {onRetry && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onRetry}
              disabled={isRetrying}
              className="border-red-400 text-red-900 hover:bg-red-100 bg-white/70 h-8"
            >
              <RefreshCw className={`h-3.5 w-3.5 mr-1.5 ${isRetrying ? 'animate-spin' : ''}`} />
              {isRetrying ? 'Retrying...' : 'Retry'}
            </Button>
          )}
          {onDismiss && (
            <button
              type="button"
              onClick={onDismiss}
              className="p-1 text-red-700 hover:text-red-900 rounded-md hover:bg-red-100"
              aria-label="Dismiss error"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
