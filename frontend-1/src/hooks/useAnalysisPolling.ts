import { useEffect, useRef, useState, useCallback } from 'react';
import { AnalysisResult, ApiError } from '@/types';
import { analysisApi } from '@/api/analysisApi';

export interface UseAnalysisPollingOptions {
  enabled?: boolean;
  onComplete?: (result: AnalysisResult) => void;
  onError?: (error: ApiError | Error) => void;
  baseIntervalMs?: number;
  maxIntervalMs?: number;
  backoffMultiplier?: number;
}

export function useAnalysisPolling(
  analysisId: string | null | undefined,
  onCompleteOrOptions?: ((result: AnalysisResult) => void) | UseAnalysisPollingOptions
) {
  // Support both functional callback signature useAnalysisPolling(id, onComplete) and options object
  const options: UseAnalysisPollingOptions =
    typeof onCompleteOrOptions === 'function'
      ? { onComplete: onCompleteOrOptions }
      : onCompleteOrOptions || {};

  const {
    enabled = true,
    onComplete,
    onError,
    baseIntervalMs = 2000,
    maxIntervalMs = 5000,
    backoffMultiplier = 1.25,
  } = options;

  const [data, setData] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<ApiError | Error | null>(null);
  const [isPolling, setIsPolling] = useState<boolean>(false);
  const [pollCount, setPollCount] = useState<number>(0);

  const currentIntervalRef = useRef<number>(baseIntervalMs);
  const timeoutIdRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isMountedRef = useRef<boolean>(true);

  // Stable callback references
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  const onErrorRef = useRef(onError);
  onErrorRef.current = onError;

  const stopPolling = useCallback(() => {
    if (timeoutIdRef.current) {
      clearTimeout(timeoutIdRef.current);
      timeoutIdRef.current = null;
    }
    setIsPolling(false);
  }, []);

  const poll = useCallback(async () => {
    if (!analysisId || !isMountedRef.current) return;

    try {
      const result = await analysisApi.getAnalysis(analysisId);
      if (!isMountedRef.current) return;

      setData(result);
      setError(null);
      setPollCount((prev) => prev + 1);

      if (result.status === 'COMPLETE') {
        stopPolling();
        onCompleteRef.current?.(result);
        return;
      }

      if (result.status === 'FAILED') {
        stopPolling();
        const err = new Error('Analysis pipeline execution failed on threat server');
        setError(err);
        onErrorRef.current?.(err);
        return;
      }

      // If QUEUED or PROCESSING, schedule next poll with backoff
      currentIntervalRef.current = Math.min(
        currentIntervalRef.current * backoffMultiplier,
        maxIntervalMs
      );

      timeoutIdRef.current = setTimeout(poll, currentIntervalRef.current);
    } catch (err: any) {
      if (!isMountedRef.current) return;
      console.error('Polling error:', err);
      setError(err);
      onErrorRef.current?.(err);

      // Retry with backoff even on transient network glitch
      currentIntervalRef.current = Math.min(
        currentIntervalRef.current * backoffMultiplier,
        maxIntervalMs
      );
      timeoutIdRef.current = setTimeout(poll, currentIntervalRef.current);
    }
  }, [analysisId, backoffMultiplier, maxIntervalMs, stopPolling]);

  useEffect(() => {
    isMountedRef.current = true;

    if (analysisId && enabled) {
      setIsPolling(true);
      currentIntervalRef.current = baseIntervalMs;
      poll();
    } else {
      stopPolling();
    }

    return () => {
      isMountedRef.current = false;
      stopPolling();
    };
  }, [analysisId, enabled, baseIntervalMs, poll, stopPolling]);

  return {
    data,
    setData,
    error,
    isPolling,
    pollCount,
    stopPolling,
    retryPolling: () => {
      currentIntervalRef.current = baseIntervalMs;
      setIsPolling(true);
      poll();
    },
  };
}
