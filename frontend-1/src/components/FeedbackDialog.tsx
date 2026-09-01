import React, { useState } from 'react';
import { MessageSquarePlus, Check, AlertTriangle, ShieldCheck, HelpCircle, CheckCircle2, ShieldAlert, Send } from 'lucide-react';
import { FeedbackLabel } from '@/types';
import { feedbackApi } from '@/api/feedbackApi';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';

export interface FeedbackDialogProps {
  analysisId: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: React.ReactNode;
  onSubmitted?: (label: FeedbackLabel) => void;
}

export function FeedbackDialog({
  analysisId,
  open: controlledOpen,
  onOpenChange: setControlledOpen,
  trigger,
  onSubmitted,
}: FeedbackDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = controlledOpen !== undefined;
  const isOpen = isControlled ? controlledOpen : internalOpen;
  const setIsOpen = (next: boolean) => {
    if (isControlled) {
      setControlledOpen?.(next);
    } else {
      setInternalOpen(next);
    }
  };

  const [label, setLabel] = useState<FeedbackLabel>('PHISHING');
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await feedbackApi.submitFeedback(analysisId, {
        actualLabel: label,
        comment: comment.trim() || undefined,
      });
      setSuccessMessage(res.message || 'Analyst feedback recorded successfully!');
      onSubmitted?.(label);
      setTimeout(() => {
        setIsOpen(false);
        setSuccessMessage(null);
        setComment('');
      }, 1500);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to submit analyst feedback');
    } finally {
      setIsSubmitting(false);
    }
  };

  const options: { label: FeedbackLabel; title: string; desc: string; icon: any }[] = [
    {
      label: 'PHISHING',
      title: 'Confirmed Phishing',
      desc: 'Malicious payload, credential harvest, or impersonation intent confirmed.',
      icon: ShieldAlert,
    },
    {
      label: 'LEGITIMATE',
      title: 'Legitimate / False Positive',
      desc: 'Benign communication from verified domain or internal service.',
      icon: ShieldCheck,
    },
    {
      label: 'UNSURE',
      title: 'Inconclusive / Needs Triage',
      desc: 'Requires further threat actor research or sandbox detonation.',
      icon: HelpCircle,
    },
  ];

  return (
    <>
      {!isControlled && (
        trigger ? (
          <span onClick={() => setIsOpen(true)}>{trigger}</span>
        ) : (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setIsOpen(true)}
            className="gap-1.5 font-semibold text-xs border-brand-medium text-brand-dark hover:bg-brand-secondary/40"
          >
            <MessageSquarePlus className="h-4 w-4 text-brand-medium" />
            <span>Provide SOC Feedback</span>
          </Button>
        )
      )}

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent onClose={() => setIsOpen(false)}>
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-brand-dark flex items-center gap-2">
              <MessageSquarePlus className="h-5 w-5 text-brand-medium" />
              Provide Ground-Truth Analyst Feedback
            </DialogTitle>
            <DialogDescription className="text-xs text-brand-dark/70">
              Analysis ID: <code className="font-mono font-bold text-brand-dark">{analysisId}</code>.
              Your evaluation improves the continuous explainable AI detection pipeline.
            </DialogDescription>
          </DialogHeader>

          {successMessage ? (
            <div className="py-8 text-center space-y-3">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-800">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <h4 className="text-lg font-bold text-brand-dark">Feedback Registered</h4>
              <p className="text-xs text-brand-dark/70">{successMessage}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 pt-1">
              {errorMessage && (
                <div className="p-3 text-xs text-red-900 bg-red-100 border border-red-300 rounded-lg">
                  {errorMessage}
                </div>
              )}

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-brand-dark/80 block">
                  Analyst Ground-Truth Classification
                </label>
                <div className="grid grid-cols-1 gap-2">
                  {options.map((opt) => {
                    const Icon = opt.icon;
                    const isSelected = label === opt.label;
                    return (
                      <button
                        type="button"
                        key={opt.label}
                        onClick={() => setLabel(opt.label)}
                        className={`flex items-start gap-3 p-3 rounded-lg text-left border transition-all cursor-pointer ${
                          isSelected
                            ? 'border-brand-medium bg-[#f6eee4] ring-2 ring-brand-medium/30 shadow-xs'
                            : 'border-brand-light/40 bg-brand-secondary/20 hover:bg-brand-secondary/40'
                        }`}
                      >
                        <div
                          className={`p-1.5 rounded-md mt-0.5 ${
                            isSelected ? 'bg-brand-medium text-white' : 'bg-brand-secondary/60 text-brand-dark'
                          }`}
                        >
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="flex-1">
                          <div className="font-bold text-sm text-brand-dark">{opt.title}</div>
                          <div className="text-xs text-brand-dark/70 mt-0.5">{opt.desc}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-1.5 pt-1">
                <label className="text-xs font-bold uppercase tracking-wider text-brand-dark/80 block">
                  Analyst Triage Notes (Optional)
                </label>
                <Textarea
                  placeholder="E.g., verified via out-of-band phone call; domain was registered 3 days ago..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="min-h-[80px] text-xs bg-white/80"
                />
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsOpen(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary" isLoading={isSubmitting} className="gap-2">
                  <Send className="h-3.5 w-3.5" />
                  Submit Feedback
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
