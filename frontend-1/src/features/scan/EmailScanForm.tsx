import React, { useState } from 'react';
import { Mail, ArrowRight, User, CornerDownRight, FileText } from 'lucide-react';
import { EmailScanRequest, ScanMode } from '@/types';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { ScanModeSelector } from './ScanModeSelector';

export interface EmailScanFormProps {
  onSubmit: (data: EmailScanRequest) => void;
  isSubmitting?: boolean;
}

interface FormErrors {
  from?: string;
  subject?: string;
  body?: string;
}

export function EmailScanForm({ onSubmit, isSubmitting = false }: EmailScanFormProps) {
  const [from, setFrom] = useState('');
  const [replyTo, setReplyTo] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [mode, setMode] = useState<ScanMode>('QUICK');
  const [errors, setErrors] = useState<FormErrors>({});

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!from.trim()) {
      newErrors.from = 'From sender address is required (e.g., alert@service.com)';
    }

    if (!subject.trim()) {
      newErrors.subject = 'Email subject line is required';
    }

    if (!body.trim()) {
      newErrors.body = 'Email body text or headers are required for analysis';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    onSubmit({
      from: from.trim(),
      replyTo: replyTo.trim() ? replyTo.trim() : undefined,
      subject: subject.trim(),
      body: body.trim(),
      mode,
    });
  };

  const loadSamplePhish = () => {
    setFrom('State Bank of India Alert <support@sbi-yono-kyc-update.xyz>');
    setReplyTo('kyc-collector@stealth-drop.ru');
    setSubject('URGENT: Your SBI YONO Account will be suspended in 24 hours. Update PAN & KYC.');
    setBody(`Dear Customer,

Your SBI YONO NetBanking account has been flagged for pending mandatory KYC compliance.

Failure to complete verification within 24 hours will result in immediate debit freeze on all linked bank accounts & UPI handles.

Please click the secure portal below to submit your PAN & Aadhaar details immediately:
https://sbi-yono-kyc-update.xyz/verify-pan?ref=SBI-IN-88910

Regards,
SBI Cyber Security & Fraud Prevention Cell`);
    setErrors({});
  };

  const loadSampleLegit = () => {
    setFrom('GitHub Security <notifications@github.com>');
    setReplyTo('notifications@github.com');
    setSubject('[GitHub] A personal access token has expired');
    setBody(`Hi @mihil-shanthanivash,

Your personal access token "CI-Deploy-Key" expired on August 30, 2026.

You can generate a new token in your account settings under Developer Settings > Personal access tokens.

Thank you,
The GitHub Team`);
    setErrors({});
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Sample Quick Load Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl bg-[#dfd0bd]/80 border border-brand-light/40 shadow-xs text-sm">
        <span className="font-bold text-brand-dark flex items-center gap-1.5 font-subtext">
          <FileText className="h-4 w-4 text-brand-medium" />
          <span>Forensic Testing Samples:</span>
        </span>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={loadSamplePhish}
            className="px-3 py-1.5 rounded-lg bg-[#f4deda] hover:bg-[#ebd0cb] text-[#842018] font-bold border border-[#d99f97] transition-all text-xs cursor-pointer shadow-xs active:scale-95"
          >
            Load SBI KYC Scam
          </button>
          <button
            type="button"
            onClick={loadSampleLegit}
            className="px-3 py-1.5 rounded-lg bg-[#d6edde] hover:bg-[#c1e4cb] text-[#005a36] font-bold border border-[#8ec7a4] transition-all text-xs cursor-pointer shadow-xs active:scale-95"
          >
            Load Legitimate Sample
          </button>
        </div>
      </div>

      {/* From & ReplyTo Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="from-input" className="block text-sm font-bold uppercase tracking-wider text-brand-dark/80 mb-1.5 font-subtext">
            Sender Address (From) <span className="text-red-700">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-brand-dark/50">
              <User className="h-4 w-4" />
            </div>
            <Input
              id="from-input"
              value={from}
              onChange={(e) => {
                setFrom(e.target.value);
                if (errors.from) setErrors((prev) => ({ ...prev, from: undefined }));
              }}
              placeholder="support@sbi-kyc-alert.in"
              className="pl-10 h-11 text-sm bg-white/80 border-brand-light/50"
              error={!!errors.from}
              disabled={isSubmitting}
            />
          </div>
          {errors.from && <p className="mt-1 text-xs text-red-700 font-medium">{errors.from}</p>}
        </div>

        <div>
          <label htmlFor="replyto-input" className="block text-sm font-bold uppercase tracking-wider text-brand-dark/80 mb-1.5 font-subtext">
            Reply-To Header (Optional)
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-brand-dark/50">
              <CornerDownRight className="h-4 w-4" />
            </div>
            <Input
              id="replyto-input"
              value={replyTo}
              onChange={(e) => setReplyTo(e.target.value)}
              placeholder="stealth-relay@foreign-domain.com"
              className="pl-10 h-11 text-sm bg-white/80 border-brand-light/50"
              disabled={isSubmitting}
            />
          </div>
          <p className="mt-1 text-xs text-brand-dark/60 font-subtext">Detects Return-Path & Reply-To divergency.</p>
        </div>
      </div>

      {/* Subject Line */}
      <div>
        <label htmlFor="subject-input" className="block text-sm font-bold uppercase tracking-wider text-brand-dark/80 mb-1.5 font-subtext">
          Email Subject Line <span className="text-red-700">*</span>
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-brand-dark/50">
            <Mail className="h-4 w-4" />
          </div>
          <Input
            id="subject-input"
            value={subject}
            onChange={(e) => {
              setSubject(e.target.value);
              if (errors.subject) setErrors((prev) => ({ ...prev, subject: undefined }));
            }}
            placeholder="URGENT: Update your NetBanking KYC in 24 hours"
            className="pl-10 h-11 text-sm bg-white/80 border-brand-light/50"
            error={!!errors.subject}
            disabled={isSubmitting}
          />
        </div>
        {errors.subject && <p className="mt-1 text-xs text-red-700 font-medium">{errors.subject}</p>}
      </div>

      {/* Body Textarea */}
      <div>
        <label htmlFor="body-input" className="block text-sm font-bold uppercase tracking-wider text-brand-dark/80 mb-1.5 font-subtext">
          Email Body Content or Raw Headers <span className="text-red-700">*</span>
        </label>
        <Textarea
          id="body-input"
          value={body}
          onChange={(e) => {
            setBody(e.target.value);
            if (errors.body) setErrors((prev) => ({ ...prev, body: undefined }));
          }}
          placeholder="Paste raw email message text, URLs, or headers here..."
          className="min-h-[140px] text-sm bg-white/80 border-brand-light/50 font-mono"
          error={!!errors.body}
          disabled={isSubmitting}
        />
        {errors.body && <p className="mt-1 text-xs text-red-700 font-medium">{errors.body}</p>}
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
          <span>Analyze Email Content</span>
          <ArrowRight className="h-5 w-5 ml-2" />
        </Button>
      </div>
    </form>
  );
}
