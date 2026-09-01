import React from 'react';
import {
  AlertTriangle,
  AlertOctagon,
  Info,
  ShieldAlert,
  HelpCircle,
  ExternalLink,
  Layers,
  Globe,
  Mail,
  Lock,
  FileText,
  Radio,
} from 'lucide-react';
import { Indicator, IndicatorCategory, IndicatorSeverity } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { getSeverityTheme } from '@/lib/utils';

export interface EvidenceListProps {
  indicators: Indicator[];
}

export function EvidenceList({ indicators }: EvidenceListProps) {
  const getCategoryIcon = (category: IndicatorCategory) => {
    switch (category) {
      case 'URL':
        return <ExternalLink className="h-4 w-4 text-brand-medium" />;
      case 'DOMAIN':
        return <Globe className="h-4 w-4 text-brand-medium" />;
      case 'TLS':
        return <Lock className="h-4 w-4 text-brand-medium" />;
      case 'EMAIL':
        return <Mail className="h-4 w-4 text-brand-medium" />;
      case 'CONTENT':
        return <FileText className="h-4 w-4 text-brand-medium" />;
      case 'THREAT_INTEL':
        return <Radio className="h-4 w-4 text-brand-medium" />;
      default:
        return <Layers className="h-4 w-4 text-brand-medium" />;
    }
  };

  const getSeverityBadge = (severity: IndicatorSeverity) => {
    const theme = getSeverityTheme(severity);
    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold border ${theme.badgeClass}`}>
        {theme.label}
      </span>
    );
  };

  if (!indicators || indicators.length === 0) {
    return (
      <Card className="border-brand-light/40 bg-brand-secondary/35">
        <CardHeader>
          <CardTitle className="text-base font-bold text-brand-dark flex items-center gap-2">
            <Layers className="h-4 w-4 text-brand-medium" />
            Explainable AI Evidence & Indicators
          </CardTitle>
          <CardDescription className="text-xs">
            Deconstructed indicators contributing to threat scoring
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-6 text-center text-brand-dark/70 rounded-lg bg-[#f4ebe1] border border-brand-light/30">
            <Info className="h-6 w-6 mx-auto mb-2 text-brand-medium/60" />
            <p className="text-sm font-medium">No adversarial behavioral indicators flagged</p>
            <p className="text-xs text-brand-dark/60 mt-1">
              The target passed all automated heuristic and threat intelligence screening checks.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Sort indicators by contribution impact descending
  const sorted = [...indicators].sort((a, b) => b.contribution - a.contribution);

  return (
    <Card className="border-brand-light/40 bg-brand-secondary/35 shadow-sm">
      <CardHeader className="pb-3 border-b border-brand-light/20 bg-brand-secondary/30">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-bold text-brand-dark flex items-center gap-2">
              <Layers className="h-5 w-5 text-brand-medium" />
              Explainable AI Evidence & Risk Attribution
            </CardTitle>
            <CardDescription className="text-xs text-brand-dark/70 mt-0.5">
              {indicators.length} behavioral and cryptographic signals analyzed with contribution weighting
            </CardDescription>
          </div>
          <Badge variant="secondary" className="font-semibold text-xs border border-brand-light/50">
            {indicators.length} Signals
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pt-4">
        <Accordion type="multiple" defaultValue={sorted.map((_, i) => `item-${i}`)} className="space-y-2">
          {sorted.map((indicator, index) => {
            const val = `item-${index}`;
            return (
              <AccordionItem
                key={indicator.code + index}
                value={val}
                className="rounded-lg border border-brand-light/40 bg-[#f4ebe1] overflow-hidden"
              >
                <AccordionTrigger className="hover:bg-brand-secondary/30 py-3 px-4">
                  <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 text-left">
                    <div className="p-1.5 rounded-md bg-brand-secondary/50">
                      {getCategoryIcon(indicator.category)}
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-brand-dark">
                        {indicator.code}
                      </span>
                      {getSeverityBadge(indicator.severity)}
                    </div>

                    <div className="ml-auto flex items-center gap-2 pr-2">
                      <span className="text-[11px] font-semibold text-brand-dark/60 uppercase tracking-wider">
                        Impact:
                      </span>
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-brand-medium text-white shadow-xs">
                        +{indicator.contribution}%
                      </span>
                    </div>
                  </div>
                </AccordionTrigger>

                <AccordionContent className="bg-white/60 p-4 border-t border-brand-light/30">
                  <div className="space-y-2.5">
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-brand-dark/60 block mb-1">
                        XAI Forensic Evidence
                      </span>
                      <p className="text-sm text-brand-dark leading-relaxed font-sans bg-brand-secondary/20 p-2.5 rounded-md border border-brand-light/30">
                        {indicator.evidence}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs pt-1">
                      <div className="p-2 rounded bg-brand-secondary/30">
                        <span className="text-[10px] text-brand-dark/60 block">Category</span>
                        <span className="font-semibold text-brand-dark">{indicator.category}</span>
                      </div>
                      <div className="p-2 rounded bg-brand-secondary/30">
                        <span className="text-[10px] text-brand-dark/60 block">Severity Level</span>
                        <span className="font-semibold text-brand-dark">{indicator.severity}</span>
                      </div>
                      <div className="p-2 rounded bg-brand-secondary/30 col-span-2 sm:col-span-1">
                        <span className="text-[10px] text-brand-dark/60 block">Contribution Weight</span>
                        <span className="font-semibold text-brand-dark">{indicator.contribution}% to score</span>
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </CardContent>
    </Card>
  );
}
