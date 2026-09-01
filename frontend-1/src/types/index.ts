export type ScanMode = 'QUICK' | 'DEEP';
export type AnalysisStatus = 'QUEUED' | 'PROCESSING' | 'COMPLETE' | 'FAILED';
export type Verdict = 'LOW_RISK' | 'SUSPICIOUS' | 'HIGH_RISK' | 'CRITICAL';
export type InputType = 'URL' | 'EMAIL' | 'EML';
export type IndicatorCategory = 'URL' | 'DOMAIN' | 'TLS' | 'EMAIL' | 'CONTENT' | 'THREAT_INTEL';
export type IndicatorSeverity = 'INFO' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type RecommendedAction = 'ALLOW_WITH_CAUTION' | 'INVESTIGATE' | 'BLOCK_AND_REPORT' | 'QUARANTINE';
export type FeedbackLabel = 'PHISHING' | 'LEGITIMATE' | 'UNSURE';

export interface Indicator {
  code: string;
  category: IndicatorCategory;
  severity: IndicatorSeverity;
  contribution: number;      // 0-100 impact on score
  evidence: string;          // human-readable reason
}

export interface AnalysisResult {
  analysisId: string;
  inputType: InputType;
  mode: ScanMode;
  status: AnalysisStatus;
  riskScore: number | null;      // 0-100, null if not computed
  verdict: Verdict | null;
  confidence: number | null;     // 0-1
  modelVersion: string | null;
  latencyMs: number | null;
  indicators: Indicator[];
  recommendedAction: RecommendedAction | null;
  createdAt: string;             // ISO-8601 UTC
  completedAt: string | null;
  normalizedUrl?: string;        // only for URL inputs
  submittedMetadata?: {
    from?: string;
    replyTo?: string;
    subject?: string;
    bodySnippet?: string;
    fileName?: string;
    fileSize?: number;
    url?: string;
  };
}

export interface ApiError {
  timestamp: string;
  status: number;
  code: string;
  message: string;
  fieldErrors?: Record<string, string>;
  traceId: string;
}

export interface HistoryItem {
  analysisId: string;
  inputType: InputType;
  submittedHost: string;
  riskScore: number | null;
  verdict: Verdict | null;
  status: AnalysisStatus;
  createdAt: string;
}

export interface HistoryPage {
  content: HistoryItem[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface EmailScanRequest {
  from: string;
  replyTo?: string;
  subject: string;
  body: string;
  mode: ScanMode;
}

export interface UrlScanRequest {
  url: string;
  mode: ScanMode;
}

export interface FeedbackRequest {
  actualLabel: FeedbackLabel;
  comment?: string;
}

export interface HistoryFilterParams {
  page?: number;
  size?: number;
  verdict?: Verdict | 'ALL';
  inputType?: InputType | 'ALL';
  search?: string;
}

export interface DashboardStats {
  totalAnalyses: number;
  phishingThreatsBlocked: number;
  avgLatencyMs: number;
  verdictDistribution: {
    LOW_RISK: number;
    SUSPICIOUS: number;
    HIGH_RISK: number;
    CRITICAL: number;
  };
  inputTypeDistribution: {
    URL: number;
    EMAIL: number;
    EML: number;
  };
  recentThreats: HistoryItem[];
  timeline: { date: string; low: number; suspicious: number; high: number; critical: number }[];
}
