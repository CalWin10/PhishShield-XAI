import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return '—';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    }).format(date);
  } catch {
    return dateString;
  }
}

export function getVerdictTheme(verdict: string | null | undefined) {
  switch (verdict) {
    case 'CRITICAL':
      return {
        label: 'Critical Risk',
        badgeClass: 'bg-[#f4deda] text-[#842018] border-[#d99f97] font-bold shadow-xs',
        cardBg: 'bg-[#faeee9] border-[#d99f97]',
        textClass: 'text-[#842018]',
        bgClass: 'bg-[#991b1b]',
        strokeClass: '#991b1b',
        iconName: 'AlertOctagon',
      };
    case 'HIGH_RISK':
      return {
        label: 'High Risk',
        badgeClass: 'bg-[#f7ebd8] text-[#7a4816] border-[#d8b88d] font-bold shadow-xs',
        cardBg: 'bg-[#fbf4e8] border-[#d8b88d]',
        textClass: 'text-[#7a4816]',
        bgClass: 'bg-[#b45309]',
        strokeClass: '#b45309',
        iconName: 'AlertTriangle',
      };
    case 'SUSPICIOUS':
      return {
        label: 'Suspicious',
        badgeClass: 'bg-[#fbf3db] text-[#854d0e] border-[#e2cca4] font-bold shadow-xs',
        cardBg: 'bg-[#fcf7e7] border-[#e2cca4]',
        textClass: 'text-[#854d0e]',
        bgClass: 'bg-[#ca8a04]',
        strokeClass: '#ca8a04',
        iconName: 'ShieldAlert',
      };
    case 'LOW_RISK':
      return {
        label: 'Low Risk / Legitimate',
        badgeClass: 'bg-[#d6edde] text-[#005a36] border-[#8ec7a4] font-bold shadow-xs',
        cardBg: 'bg-[#ebf7f0] border-[#8ec7a4]',
        textClass: 'text-[#005a36]',
        bgClass: 'bg-[#006A4E]',
        strokeClass: '#006A4E',
        iconName: 'ShieldCheck',
      };
    default:
      return {
        label: 'Pending Assessment',
        badgeClass: 'bg-stone-200 text-stone-700 border-stone-300 font-bold shadow-xs',
        cardBg: 'bg-stone-50 border-stone-200',
        textClass: 'text-stone-700',
        bgClass: 'bg-stone-500',
        strokeClass: '#78716c',
        iconName: 'HelpCircle',
      };
  }
}

export function getSeverityTheme(severity: string) {
  switch (severity) {
    case 'CRITICAL':
      return {
        label: 'Critical',
        badgeClass: 'bg-[#f4deda] text-[#842018] border-[#d99f97] font-bold',
      };
    case 'HIGH':
      return {
        label: 'High',
        badgeClass: 'bg-[#f7ebd8] text-[#7a4816] border-[#d8b88d] font-bold',
      };
    case 'MEDIUM':
      return {
        label: 'Medium',
        badgeClass: 'bg-[#fbf3db] text-[#854d0e] border-[#e2cca4] font-bold',
      };
    case 'LOW':
      return {
        label: 'Low',
        badgeClass: 'bg-[#d6edde] text-[#005a36] border-[#8ec7a4] font-bold',
      };
    case 'INFO':
    default:
      return {
        label: 'Info',
        badgeClass: 'bg-[#ede3d5] text-[#58382E] border-brand-light/40 font-semibold',
      };
  }
}

export function getActionExplanation(action: string | null | undefined): { title: string; desc: string; variant: 'destructive' | 'warning' | 'caution' | 'success' | 'default' } {
  switch (action) {
    case 'BLOCK_AND_REPORT':
      return {
        title: 'Block and Report to SOC',
        desc: 'Immediate perimeter block recommended. Domain/sender exhibits severe malicious indicators with active weaponized payloads or credential harvesting.',
        variant: 'destructive',
      };
    case 'QUARANTINE':
      return {
        title: 'Quarantine Message Immediately',
        desc: 'Isolate this communication from user inboxes. High probability of phishing or credential theft tactics detected.',
        variant: 'destructive',
      };
    case 'INVESTIGATE':
      return {
        title: 'Perform In-Depth SOC Triage',
        desc: 'Anomalies detected in headers or domain age. Manual verification of sender authenticity and link redirection is advised before releasing.',
        variant: 'warning',
      };
    case 'ALLOW_WITH_CAUTION':
      return {
        title: 'Safe to Proceed with Standard Caution',
        desc: 'No known threat intelligence hits or malicious behavioral markers identified. Standard organizational security hygiene applies.',
        variant: 'success',
      };
    default:
      return {
        title: 'Analysis in Progress',
        desc: 'Evaluating threat vectors, telemetry signals, and behavioral heuristics...',
        variant: 'default',
      };
  }
}
