import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ExternalLink,
  Mail,
  Globe,
  UploadCloud,
  Search,
  Filter,
  ShieldCheck,
  AlertTriangle,
  AlertOctagon,
  ShieldAlert,
  HelpCircle,
  LayoutGrid,
  List,
  ChevronRight,
  Clock,
  Fingerprint,
  Grid3X3,
  ArrowUpRight,
} from 'lucide-react';
import { HistoryItem, HistoryPage, InputType, Verdict } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Pagination } from '@/components/ui/pagination';
import { formatDate, getVerdictTheme } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { AnimatedList } from '@/components/react-bits/AnimatedList';
import { BorderGlow } from '@/components/react-bits/BorderGlow';
import { InteractiveBentoGrid, InteractiveBentoCard } from '@/components/InteractiveBentoGrid';

export interface HistoryTableProps {
  data: HistoryPage | null;
  isLoading?: boolean;
  selectedVerdict: Verdict | 'ALL';
  selectedInputType: InputType | 'ALL';
  searchQuery: string;
  onVerdictChange: (v: Verdict | 'ALL') => void;
  onInputTypeChange: (t: InputType | 'ALL') => void;
  onSearchChange: (q: string) => void;
  onPageChange: (page: number) => void;
}

export function HistoryTable({
  data,
  isLoading = false,
  selectedVerdict,
  selectedInputType,
  searchQuery,
  onVerdictChange,
  onInputTypeChange,
  onSearchChange,
  onPageChange,
}: HistoryTableProps) {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<'bento' | 'animated' | 'table'>('bento');

  const getTypeIcon = (type: InputType) => {
    switch (type) {
      case 'URL':
        return <Globe className="h-4 w-4 text-brand-medium" />;
      case 'EMAIL':
        return <Mail className="h-4 w-4 text-brand-medium" />;
      case 'EML':
        return <UploadCloud className="h-4 w-4 text-brand-medium" />;
    }
  };

  const getVerdictBadge = (verdict: Verdict | null) => {
    const meta = getVerdictTheme(verdict);
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold border ${meta.badgeClass}`}
      >
        <span>{meta.label}</span>
      </span>
    );
  };

  const getScoreColor = (score: number | null) => {
    if (score === null) return 'text-brand-dark/70';
    if (score >= 70) return 'text-brand-dark font-extrabold';
    if (score >= 40) return 'text-brand-medium font-bold';
    return 'text-[#005a36] font-bold';
  };

  return (
    <div className="space-y-6">
      {/* Filters Bar */}
      <BorderGlow glowColor="#6E473B" borderRadius="18px">
        <div className="p-4 sm:p-5 rounded-2xl border border-brand-light/40 bg-[#ebe0d1] flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-brand-dark/50">
              <Search className="h-4 w-4" />
            </div>
            <Input
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search by Host, Sender, or Analysis ID..."
              className="pl-9 h-10 text-xs bg-[#f4ebe1] border-brand-light/50 font-subtext"
            />
          </div>

          {/* Filters & View Toggles */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Input Type Selector */}
            <div className="flex items-center space-x-1.5 text-xs">
              <span className="font-bold text-brand-dark/70 uppercase tracking-wider text-[10px]">Type:</span>
              <select
                value={selectedInputType}
                onChange={(e) => onInputTypeChange(e.target.value as InputType | 'ALL')}
                className="h-9 rounded-xl border border-brand-light/50 bg-[#f4ebe1] px-3 py-1 text-xs text-brand-dark font-medium focus:ring-2 focus:ring-brand-medium focus:outline-none cursor-pointer"
              >
                <option value="ALL">All Types</option>
                <option value="EMAIL">Email</option>
                <option value="URL">URL</option>
                <option value="EML">EML File</option>
              </select>
            </div>

            {/* Verdict Selector */}
            <div className="flex items-center space-x-1.5 text-xs">
              <span className="font-bold text-brand-dark/70 uppercase tracking-wider text-[10px]">Verdict:</span>
              <select
                value={selectedVerdict}
                onChange={(e) => onVerdictChange(e.target.value as Verdict | 'ALL')}
                className="h-9 rounded-xl border border-brand-light/50 bg-[#f4ebe1] px-3 py-1 text-xs text-brand-dark font-medium focus:ring-2 focus:ring-brand-medium focus:outline-none cursor-pointer"
              >
                <option value="ALL">All Verdicts</option>
                <option value="CRITICAL">Critical Risk</option>
                <option value="HIGH_RISK">High Risk</option>
                <option value="SUSPICIOUS">Suspicious</option>
                <option value="LOW_RISK">Low Risk</option>
              </select>
            </div>

            {/* View Mode Switcher */}
            <div className="flex items-center border border-brand-light/50 rounded-xl overflow-hidden bg-[#f4ebe1] p-0.5">
              <button
                type="button"
                onClick={() => setViewMode('bento')}
                className={`p-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors ${
                  viewMode === 'bento' ? 'bg-brand-dark text-white shadow-xs' : 'text-brand-dark/70 hover:text-brand-dark'
                }`}
                title="Interactive Bento Grid"
              >
                <Grid3X3 className="h-3.5 w-3.5" />
                <span className="hidden sm:inline text-[11px]">Bento</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('animated')}
                className={`p-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors ${
                  viewMode === 'animated' ? 'bg-brand-dark text-white shadow-xs' : 'text-brand-dark/70 hover:text-brand-dark'
                }`}
                title="Animated Flow View"
              >
                <LayoutGrid className="h-3.5 w-3.5" />
                <span className="hidden sm:inline text-[11px]">Flow</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors ${
                  viewMode === 'table' ? 'bg-brand-dark text-white shadow-xs' : 'text-brand-dark/70 hover:text-brand-dark'
                }`}
                title="Compact Table View"
              >
                <List className="h-3.5 w-3.5" />
                <span className="hidden sm:inline text-[11px]">Table</span>
              </button>
            </div>
          </div>
        </div>
      </BorderGlow>

      {/* Loading or Empty States */}
      {isLoading ? (
        <div className="p-12 text-center rounded-2xl bg-[#ebe0d1] border border-brand-light/30 text-sm text-brand-dark/70 font-subtext animate-pulse">
          Retrieving explainable threat forensic log...
        </div>
      ) : !data || data.content.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-[#ebe0d1] border border-brand-light/30 text-sm text-brand-dark/70 font-subtext">
          No matching incident investigations found in telemetry history.
        </div>
      ) : viewMode === 'bento' ? (
        /* Interactive Bento Grid View */
        <InteractiveBentoGrid cols={3} className="gap-5">
          {data.content.map((item) => (
            <InteractiveBentoCard
              key={item.analysisId}
              variant="light"
              glowColor="#6E473B"
              enableTilt={true}
              enableSpotlight={true}
              tiltIntensity={6}
              onClick={() => navigate(`/analyses/${item.analysisId}`)}
              className="p-5 flex flex-col justify-between cursor-pointer group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-xs px-2.5 py-0.5 rounded-md bg-brand-dark text-[#E1D4C2]">
                    {item.analysisId}
                  </span>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-brand-dark/80">
                    {getTypeIcon(item.inputType)}
                    <span className="uppercase text-[11px] tracking-wider">{item.inputType}</span>
                  </div>
                </div>

                <div>
                  <h4 className="text-base font-bold text-brand-dark group-hover:text-brand-medium transition-colors line-clamp-1 font-flaviotte">
                    {item.submittedHost || 'Direct Telemetry Payload'}
                  </h4>
                  <div className="flex items-center gap-2 mt-1 text-xs text-brand-dark/70 font-subtext">
                    <Clock className="h-3 w-3 text-brand-medium" />
                    <span>{formatDate(item.createdAt)}</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-brand-light/30 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-brand-dark/60 font-bold">
                    Risk:
                  </span>
                  <span className={`text-base font-black font-mono ${getScoreColor(item.riskScore)}`}>
                    {item.riskScore !== null ? `${item.riskScore}%` : '—'}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {getVerdictBadge(item.verdict)}
                  <div className="h-7 w-7 rounded-lg bg-brand-secondary/60 flex items-center justify-center text-brand-dark group-hover:bg-brand-medium group-hover:text-white transition-colors">
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </div>
                </div>
              </div>
            </InteractiveBentoCard>
          ))}
        </InteractiveBentoGrid>
      ) : viewMode === 'animated' ? (
        /* AnimatedList Component Rendering */
        <AnimatedList
          items={data.content}
          keyExtractor={(item) => item.analysisId}
          delay={0.02}
          stagger={0.03}
          renderItem={(item) => (
            <div
              onClick={() => navigate(`/analyses/${item.analysisId}`)}
              className="p-4 sm:p-5 rounded-2xl bg-[#ebe0d1] border border-brand-light/40 hover:border-brand-medium/60 shadow-xs hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                {/* Left: ID, Type & Target */}
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs px-2 py-0.5 rounded bg-brand-dark text-[#E1D4C2]">
                      {item.analysisId}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded bg-brand-secondary/60 text-brand-dark">
                      {getTypeIcon(item.inputType)}
                      <span>{item.inputType}</span>
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-brand-dark/70 bg-brand-secondary/40 px-2 py-0.5 rounded border border-brand-light/30">
                      {item.status}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-brand-dark group-hover:text-brand-medium transition-colors truncate font-flaviotte">
                    {item.submittedHost || 'Direct Telemetry Payload'}
                  </h3>

                  <div className="flex items-center gap-3 text-[11px] text-brand-dark/70 font-subtext">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3 text-brand-medium" />
                      {formatDate(item.createdAt)}
                    </span>
                  </div>
                </div>

                {/* Right: Score Gauge, Verdict & Action */}
                <div className="flex items-center gap-4 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-brand-light/20">
                  <div className="text-right">
                    <div className="text-[10px] font-mono uppercase tracking-wider text-brand-dark/60 font-bold">
                      Risk Score
                    </div>
                    <div className={`text-lg font-black font-mono ${getScoreColor(item.riskScore)}`}>
                      {item.riskScore !== null ? `${item.riskScore}%` : '—'}
                    </div>
                  </div>

                  <div className="min-w-[120px] text-center">
                    {getVerdictBadge(item.verdict)}
                  </div>

                  <div className="h-8 w-8 rounded-xl bg-brand-bg flex items-center justify-center text-brand-dark group-hover:bg-brand-medium group-hover:text-white transition-colors">
                    <ChevronRight className="h-4 w-4" />
                  </div>
                </div>
              </div>
            </div>
          )}
        />
      ) : (
        /* Compact Table Layout fallback */
        <div className="rounded-2xl border border-brand-light/40 overflow-hidden bg-[#ebe0d1]">
          <table className="w-full text-left text-xs font-subtext">
            <thead className="bg-[#dfd0bd] text-brand-dark font-bold border-b border-brand-light/40">
              <tr>
                <th className="p-3.5">Analysis ID</th>
                <th className="p-3.5">Type</th>
                <th className="p-3.5">Target / Sender Host</th>
                <th className="p-3.5 text-center">Score</th>
                <th className="p-3.5">Verdict</th>
                <th className="p-3.5">Timestamp</th>
                <th className="p-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-light/30">
              {data.content.map((item) => (
                <tr
                  key={item.analysisId}
                  onClick={() => navigate(`/analyses/${item.analysisId}`)}
                  className="hover:bg-brand-secondary/40 cursor-pointer transition-colors"
                >
                  <td className="p-3.5 font-mono font-bold">{item.analysisId}</td>
                  <td className="p-3.5">
                    <span className="flex items-center gap-1 font-semibold">
                      {getTypeIcon(item.inputType)} {item.inputType}
                    </span>
                  </td>
                  <td className="p-3.5 font-medium truncate max-w-xs">{item.submittedHost}</td>
                  <td className="p-3.5 text-center font-mono font-bold">{item.riskScore ?? '—'}</td>
                  <td className="p-3.5">{getVerdictBadge(item.verdict)}</td>
                  <td className="p-3.5 text-brand-dark/70">{formatDate(item.createdAt)}</td>
                  <td className="p-3.5 text-right">
                    <ChevronRight className="h-4 w-4 inline text-brand-medium" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination Controls */}
      {data && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-2 text-xs text-brand-dark/70 font-subtext">
          <div>
            Showing <span className="font-bold text-brand-dark">{data.content.length}</span> of{' '}
            <span className="font-bold text-brand-dark">{data.totalElements}</span> recorded investigations
          </div>

          <Pagination
            currentPage={data.page}
            totalPages={data.totalPages}
            onPageChange={onPageChange}
          />
        </div>
      )}
    </div>
  );
}

export default HistoryTable;

