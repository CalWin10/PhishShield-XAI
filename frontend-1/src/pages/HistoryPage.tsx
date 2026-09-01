import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { History, RefreshCw, FileSpreadsheet } from 'lucide-react';
import { HistoryPage as HistoryPageType, InputType, Verdict } from '@/types';
import { analysisApi } from '@/api/analysisApi';
import { HistoryTable } from '@/features/history/HistoryTable';
import { ApiErrorBanner } from '@/components/ApiErrorBanner';
import { Button } from '@/components/ui/button';
import { AnimatedBackground } from '@/components/AnimatedBackground';

export function HistoryPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Read URL query params
  const pageParam = parseInt(searchParams.get('page') || '0', 10);
  const sizeParam = parseInt(searchParams.get('size') || '20', 10);
  const verdictParam = (searchParams.get('verdict') as Verdict) || 'ALL';
  const inputTypeParam = (searchParams.get('inputType') as InputType) || 'ALL';
  const searchParam = searchParams.get('q') || '';

  const [data, setData] = useState<HistoryPageType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  const fetchHistory = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await analysisApi.getHistory({
        page: pageParam,
        size: sizeParam,
        verdict: verdictParam !== 'ALL' ? verdictParam : undefined,
        inputType: inputTypeParam !== 'ALL' ? inputTypeParam : undefined,
        search: searchParam || undefined,
      });
      setData(res);
    } catch (err: any) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [pageParam, sizeParam, verdictParam, inputTypeParam, searchParam]);

  const updateParam = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (value && value !== 'ALL') {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    // reset to page 0 on filter update
    if (key !== 'page') {
      newParams.set('page', '0');
    }
    setSearchParams(newParams);
  };

  const handleVerdictChange = (v: Verdict | 'ALL') => updateParam('verdict', v);
  const handleInputTypeChange = (t: InputType | 'ALL') => updateParam('inputType', t);
  const handleSearchChange = (q: string) => updateParam('q', q);
  const handlePageChange = (p: number) => updateParam('page', p.toString());

  return (
    <div className="w-full space-y-6 pb-16 relative">
      <AnimatedBackground variant="ghost-fibers" opacity={0.85} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-brand-light/30 pb-6 relative z-10">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-brand-dark flex items-center gap-2.5 font-flaviotte">
            <History className="h-7 w-7 text-brand-medium" />
            Threat Investigation History
          </h1>
          <p className="mt-1 text-sm text-brand-dark/70 max-w-2xl leading-relaxed font-subtext font-medium">
            Forensic audit trail of all email, URL, and EML artifacts ingested for explainable phishing classification.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={fetchHistory}
          disabled={isLoading}
          className="border-brand-medium text-brand-dark hover:bg-brand-secondary/40 font-semibold"
        >
          <RefreshCw className={`h-4 w-4 mr-1.5 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh Log
        </Button>
      </div>

      {/* Error */}
      {error && (
        <div className="relative z-10">
          <ApiErrorBanner error={error} onRetry={fetchHistory} onDismiss={() => setError(null)} />
        </div>
      )}

      {/* History Table */}
      <div className="relative z-10">
        <HistoryTable
          data={data}
          isLoading={isLoading}
          selectedVerdict={verdictParam}
          selectedInputType={inputTypeParam}
          searchQuery={searchParam}
          onVerdictChange={handleVerdictChange}
          onInputTypeChange={handleInputTypeChange}
          onSearchChange={handleSearchChange}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
}
