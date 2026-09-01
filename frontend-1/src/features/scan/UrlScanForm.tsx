import React, { useState } from 'react';
import { Globe, ArrowRight, Sparkles } from 'lucide-react';
import { ScanMode, UrlScanRequest } from '@/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScanModeSelector } from './ScanModeSelector';

export interface UrlScanFormProps {
  onSubmit: (data: UrlScanRequest) => void;
  isSubmitting?: boolean;
}

export function UrlScanForm({ onSubmit, isSubmitting = false }: UrlScanFormProps) {
  const [url, setUrl] = useState('');
  const [mode, setMode] = useState<ScanMode>('QUICK');
  const [error, setError] = useState<string | null>(null);

  const validateUrl = (val: string): boolean => {
    if (!val || !val.trim()) {
      setError('Please enter a target URL to analyze.');
      return false;
    }
    const trimmed = val.trim();
    if (!/^https?:\/\//i.test(trimmed)) {
      setError('URL must start with http:// or https://');
      return false;
    }
    try {
      new URL(trimmed);
      setError(null);
      return true;
    } catch {
      setError('Please enter a valid, well-formed URL.');
      return false;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateUrl(url)) return;

    onSubmit({
      url: url.trim(),
      mode,
    });
  };

  const handleSampleClick = (sampleUrl: string) => {
    setUrl(sampleUrl);
    setError(null);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="url-input" className="block text-sm font-bold uppercase tracking-wider text-brand-dark/80 mb-2 font-subtext">
          Target Link or Domain (URL) <span className="text-red-700">*</span>
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-brand-dark/50">
            <Globe className="h-5 w-5" />
          </div>
          <Input
            id="url-input"
            type="text"
            value={url}
            onChange={(e) => {
              setUrl(e.target.value);
              if (error) validateUrl(e.target.value);
            }}
            placeholder="https://incometax-efiling-refunds-gov.org/itr/verify"
            className="pl-11 h-12 text-sm bg-white/80 border-brand-light/50 font-mono"
            error={!!error}
            disabled={isSubmitting}
            autoFocus
          />
        </div>
        {error && <p className="mt-1.5 text-xs font-medium text-red-700">{error}</p>}

        {/* Quick sample chips */}
        <div className="mt-3.5 flex flex-wrap items-center justify-between gap-2.5 p-3.5 rounded-xl bg-[#dfd0bd]/80 border border-brand-light/40 shadow-xs text-xs text-brand-dark">
          <span className="font-bold text-xs uppercase tracking-wider font-subtext">Try Samples:</span>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => handleSampleClick('https://incometax-efiling-refunds-gov.org/itr/verify?ref=AY2026-REFUND')}
              className="px-2.5 py-1.5 rounded-lg bg-[#f4deda] hover:bg-[#ebd0cb] text-[#842018] text-xs font-bold border border-[#d99f97] transition-all cursor-pointer shadow-xs active:scale-95"
            >
              Income Tax Refund Phish
            </button>
            <button
              type="button"
              onClick={() => handleSampleClick('https://sbi-yono-kyc-update.xyz/verify-pan')}
              className="px-2.5 py-1.5 rounded-lg bg-[#f7ebd8] hover:bg-[#eedbc2] text-[#7a4816] text-xs font-bold border border-[#d8b88d] transition-all cursor-pointer shadow-xs active:scale-95"
            >
              SBI YONO KYC Fake Link
            </button>
            <button
              type="button"
              onClick={() => handleSampleClick('https://onlinesbi.sbi/sbijava/osbi_login.html')}
              className="px-2.5 py-1.5 rounded-lg bg-[#d6edde] hover:bg-[#c1e4cb] text-[#005a36] text-xs font-bold border border-[#8ec7a4] transition-all cursor-pointer shadow-xs active:scale-95"
            >
              Legitimate State Bank of India
            </button>
          </div>
        </div>
      </div>

      {/* Mode Selector */}
      <ScanModeSelector mode={mode} onChange={setMode} disabled={isSubmitting} />

      {/* Submit Button */}
      <div className="pt-2">
        <Button
          type="submit"
          variant="primary"
          size="lg"
          isLoading={isSubmitting}
          className="w-full text-base font-bold shadow-md h-12"
        >
          <span>Initiate Threat Analysis</span>
          <ArrowRight className="h-5 w-5 ml-2" />
        </Button>
      </div>
    </form>
  );
}
