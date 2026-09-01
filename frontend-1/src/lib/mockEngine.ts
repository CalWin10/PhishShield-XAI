import {
  AnalysisResult,
  EmailScanRequest,
  FeedbackLabel,
  HistoryItem,
  HistoryPage,
  Indicator,
  ScanMode,
  UrlScanRequest,
  Verdict,
} from '@/types';

const INITIAL_HISTORY: HistoryItem[] = [
  {
    analysisId: 'ps-892147-xai',
    inputType: 'EMAIL',
    submittedHost: 'support@sbi-yono-kyc-update.xyz',
    riskScore: 95,
    verdict: 'CRITICAL',
    status: 'COMPLETE',
    createdAt: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
  },
  {
    analysisId: 'ps-773129-xai',
    inputType: 'URL',
    submittedHost: 'incometax-efiling-refunds-gov.org/itr/verify',
    riskScore: 92,
    verdict: 'CRITICAL',
    status: 'COMPLETE',
    createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
  },
  {
    analysisId: 'ps-654812-xai',
    inputType: 'EML',
    submittedHost: 'uan-helpdesk@epfindia-services-portal.net',
    riskScore: 84,
    verdict: 'HIGH_RISK',
    status: 'COMPLETE',
    createdAt: new Date(Date.now() - 1000 * 60 * 360).toISOString(),
  },
  {
    analysisId: 'ps-542109-xai',
    inputType: 'EMAIL',
    submittedHost: 'rewards@hdfc-instant-cashback.top',
    riskScore: 78,
    verdict: 'HIGH_RISK',
    status: 'COMPLETE',
    createdAt: new Date(Date.now() - 1000 * 60 * 720).toISOString(),
  },
  {
    analysisId: 'ps-439811-xai',
    inputType: 'URL',
    submittedHost: 'onlinesbi.sbi/sbijava/osbi_login.html',
    riskScore: 3,
    verdict: 'LOW_RISK',
    status: 'COMPLETE',
    createdAt: new Date(Date.now() - 1000 * 60 * 1440).toISOString(),
  },
  {
    analysisId: 'ps-331902-xai',
    inputType: 'EMAIL',
    submittedHost: 'notifications@github.com',
    riskScore: 2,
    verdict: 'LOW_RISK',
    status: 'COMPLETE',
    createdAt: new Date(Date.now() - 1000 * 60 * 2880).toISOString(),
  },
  {
    analysisId: 'ps-220198-xai',
    inputType: 'EML',
    submittedHost: 'hr-payroll-annualbonus-tatacorp.net',
    riskScore: 88,
    verdict: 'CRITICAL',
    status: 'COMPLETE',
    createdAt: new Date(Date.now() - 1000 * 60 * 4320).toISOString(),
  },
];

const INITIAL_ANALYSES: Record<string, AnalysisResult> = {
  'ps-892147-xai': {
    analysisId: 'ps-892147-xai',
    inputType: 'EMAIL',
    mode: 'DEEP',
    status: 'COMPLETE',
    riskScore: 95,
    verdict: 'CRITICAL',
    confidence: 0.98,
    modelVersion: 'phishshield-xai-v3.4-certin',
    latencyMs: 320,
    createdAt: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
    completedAt: new Date(Date.now() - 1000 * 60 * 25 + 4000).toISOString(),
    recommendedAction: 'BLOCK_AND_REPORT',
    submittedMetadata: {
      from: 'State Bank of India YONO Alert <support@sbi-yono-kyc-update.xyz>',
      replyTo: 'kyc-harvest@stealth-drop.ru',
      subject: 'URGENT: Your SBI YONO Account will be suspended in 24 hours. Update PAN & KYC.',
      bodySnippet: 'Dear Customer, your SBI YONO NetBanking account has been flagged for pending mandatory KYC compliance. Submit your Aadhaar/PAN details immediately to avoid immediate debit freeze.',
    },
    indicators: [
      {
        code: 'EML_REPLYTO_MISMATCH',
        category: 'EMAIL',
        severity: 'CRITICAL',
        contribution: 35,
        evidence: 'From domain (sbi-yono-kyc-update.xyz) diverges entirely from Reply-To target (stealth-drop.ru). Characteristic of credential relay operations.',
      },
      {
        code: 'DOM_TYPOSQUAT_BRAND',
        category: 'DOMAIN',
        severity: 'HIGH',
        contribution: 30,
        evidence: 'Domain "sbi-yono-kyc-update.xyz" is 4 days old and impersonates State Bank of India YONO brand identifiers without legitimate RBI or SBI certification.',
      },
      {
        code: 'CONTENT_URGENCY_THREAT',
        category: 'CONTENT',
        severity: 'HIGH',
        contribution: 20,
        evidence: 'High semantic density of coercive psychological urgency ("24 hours", "debit freeze", "mandatory KYC").',
      },
      {
        code: 'TLS_SELF_SIGNED_LE',
        category: 'TLS',
        severity: 'MEDIUM',
        contribution: 10,
        evidence: 'Automated Let\'s Encrypt certificate generated recently with missing corporate Organization Validation (OV/EV).',
      },
    ],
  },
  'ps-773129-xai': {
    analysisId: 'ps-773129-xai',
    inputType: 'URL',
    mode: 'QUICK',
    status: 'COMPLETE',
    riskScore: 92,
    verdict: 'CRITICAL',
    confidence: 0.96,
    modelVersion: 'phishshield-xai-v3.4-certin',
    latencyMs: 280,
    createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    completedAt: new Date(Date.now() - 1000 * 60 * 120 + 280).toISOString(),
    normalizedUrl: 'https://incometax-efiling-refunds-gov.org/itr/verify?ref=AY2026-REFUND',
    recommendedAction: 'BLOCK_AND_REPORT',
    submittedMetadata: {
      url: 'https://incometax-efiling-refunds-gov.org/itr/verify?ref=AY2026-REFUND',
    },
    indicators: [
      {
        code: 'URL_SUBDOMAIN_DECEPTION',
        category: 'URL',
        severity: 'CRITICAL',
        contribution: 40,
        evidence: 'Prepends Income Tax e-Filing brand as domain name on unofficial ".org" TLD instead of legitimate "incometax.gov.in".',
      },
      {
        code: 'DOM_AGE_RECENT',
        category: 'DOMAIN',
        severity: 'HIGH',
        contribution: 30,
        evidence: 'Registered via NameCheap on a known disposable registrar pattern within the past 12 days.',
      },
      {
        code: 'CONTENT_LOGIN_HARVESTER',
        category: 'CONTENT',
        severity: 'HIGH',
        contribution: 22,
        evidence: 'Harvests Bank Account numbers, UPI PINs, and NetBanking passwords directly to an unauthenticated external endpoint.',
      },
    ],
  },
};

// Store in memory (and sync with localStorage if available)
class MockStore {
  private history: HistoryItem[] = INITIAL_HISTORY;
  private analyses: Record<string, AnalysisResult> = INITIAL_ANALYSES;
  private queuedTasks: Map<string, { startTime: number; mode: ScanMode; payload: any }> = new Map();

  constructor() {
    try {
      const storedHistory = localStorage.getItem('phishshield_mock_history');
      if (storedHistory) {
        this.history = JSON.parse(storedHistory);
      }
      const storedAnalyses = localStorage.getItem('phishshield_mock_analyses');
      if (storedAnalyses) {
        this.analyses = { ...INITIAL_ANALYSES, ...JSON.parse(storedAnalyses) };
      }
    } catch {
      // ignore
    }
  }

  private save() {
    try {
      localStorage.setItem('phishshield_mock_history', JSON.stringify(this.history.slice(0, 100)));
      localStorage.setItem('phishshield_mock_analyses', JSON.stringify(this.analyses));
    } catch {
      // ignore
    }
  }

  public getHistory(page = 0, size = 20, verdict?: string, inputType?: string, search?: string): HistoryPage {
    let list = [...this.history];
    if (verdict && verdict !== 'ALL') {
      list = list.filter((i) => i.verdict === verdict);
    }
    if (inputType && inputType !== 'ALL') {
      list = list.filter((i) => i.inputType === inputType);
    }
    if (search && search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (i) =>
          i.submittedHost.toLowerCase().includes(q) ||
          i.analysisId.toLowerCase().includes(q)
      );
    }

    const totalElements = list.length;
    const totalPages = Math.ceil(totalElements / size) || 1;
    const start = page * size;
    const content = list.slice(start, start + size);

    return {
      content,
      page,
      size,
      totalElements,
      totalPages,
    };
  }

  public getAnalysis(id: string): AnalysisResult | null {
    // Check if task is queued/processing and simulate progression
    const queued = this.queuedTasks.get(id);
    if (queued && this.analyses[id]) {
      const elapsed = Date.now() - queued.startTime;
      if (elapsed < 2500) {
        this.analyses[id].status = 'QUEUED';
      } else if (elapsed < 6000) {
        this.analyses[id].status = 'PROCESSING';
      } else {
        this.analyses[id].status = 'COMPLETE';
        this.analyses[id].completedAt = new Date().toISOString();
        this.queuedTasks.delete(id);
        this.save();
      }
    }
    return this.analyses[id] || null;
  }

  public createEmailAnalysis(req: EmailScanRequest): AnalysisResult {
    const analysisId = `ps-${Math.floor(100000 + Math.random() * 900000)}-xai`;
    const createdAt = new Date().toISOString();

    // Analyze content heuristics
    const textToScan = `${req.from} ${req.replyTo || ''} ${req.subject} ${req.body}`.toLowerCase();
    const hasUrgency = /urgent|suspend|immediate|verify|24 hours|action required|restricted|compromised/i.test(textToScan);
    const hasFinancial = /paypal|bank|invoice|wire|payment|crypto|bitcoin|wallet|payroll|direct deposit/i.test(textToScan);
    const hasSuspiciousDomain = /\.xyz|\.top|\.ru|\.work|\.click|\.vip|\.loan|login-|secure-|verify-/i.test(req.from);
    const replyMismatch = req.replyTo && req.replyTo !== req.from;

    let riskScore = 15;
    const indicators: Indicator[] = [];

    if (hasSuspiciousDomain) {
      riskScore += 35;
      indicators.push({
        code: 'DOM_SUSPICIOUS_TLD',
        category: 'DOMAIN',
        severity: 'HIGH',
        contribution: 35,
        evidence: `Sender address contains high-risk TLD or deceptive naming string: "${req.from}".`,
      });
    }

    if (replyMismatch) {
      riskScore += 25;
      indicators.push({
        code: 'EML_REPLYTO_MISMATCH',
        category: 'EMAIL',
        severity: 'CRITICAL',
        contribution: 25,
        evidence: `Reply-To header (${req.replyTo}) does not match From header (${req.from}). High probability of redirecting victim responses.`,
      });
    }

    if (hasUrgency) {
      riskScore += 20;
      indicators.push({
        code: 'CONTENT_COERCIVE_URGENCY',
        category: 'CONTENT',
        severity: 'MEDIUM',
        contribution: 20,
        evidence: 'High semantic density of coercive psychological urgency markers designed to trigger impulsive user actions.',
      });
    }

    if (hasFinancial) {
      riskScore += 15;
      indicators.push({
        code: 'CONTENT_FINANCIAL_BAIT',
        category: 'CONTENT',
        severity: 'MEDIUM',
        contribution: 15,
        evidence: 'Subject or body references financial, invoicing, or credential verification mechanisms.',
      });
    }

    if (indicators.length === 0) {
      riskScore = 8;
      indicators.push({
        code: 'EML_STANDARD_SIGNALS',
        category: 'EMAIL',
        severity: 'INFO',
        contribution: 0,
        evidence: 'Clean email structure, standard message headers, no blacklisted sender heuristics detected.',
      });
    }

    riskScore = Math.min(100, Math.max(0, riskScore));

    let verdict: Verdict = 'LOW_RISK';
    let recommendedAction: any = 'ALLOW_WITH_CAUTION';
    if (riskScore >= 80) {
      verdict = 'CRITICAL';
      recommendedAction = 'BLOCK_AND_REPORT';
    } else if (riskScore >= 60) {
      verdict = 'HIGH_RISK';
      recommendedAction = 'QUARANTINE';
    } else if (riskScore >= 35) {
      verdict = 'SUSPICIOUS';
      recommendedAction = 'INVESTIGATE';
    }

    const isDeep = req.mode === 'DEEP';
    const status = isDeep ? 'QUEUED' : 'COMPLETE';

    const result: AnalysisResult = {
      analysisId,
      inputType: 'EMAIL',
      mode: req.mode,
      status,
      riskScore: isDeep ? null : riskScore,
      verdict: isDeep ? null : verdict,
      confidence: 0.94,
      modelVersion: isDeep ? 'phishshield-xai-v3.4-ensemble' : 'phishshield-xai-v3.4-fast',
      latencyMs: isDeep ? null : Math.floor(250 + Math.random() * 300),
      indicators: isDeep ? [] : indicators,
      recommendedAction: isDeep ? null : recommendedAction,
      createdAt,
      completedAt: isDeep ? null : new Date().toISOString(),
      submittedMetadata: {
        from: req.from,
        replyTo: req.replyTo,
        subject: req.subject,
        bodySnippet: req.body.substring(0, 180),
      },
    };

    if (isDeep) {
      // Store full complete state for after polling finishes
      this.queuedTasks.set(analysisId, {
        startTime: Date.now(),
        mode: req.mode,
        payload: { riskScore, verdict, indicators, recommendedAction },
      });
      // Setup fully populated result that will emerge after polling
      setTimeout(() => {
        if (this.analyses[analysisId]) {
          this.analyses[analysisId].riskScore = riskScore;
          this.analyses[analysisId].verdict = verdict;
          this.analyses[analysisId].indicators = indicators;
          this.analyses[analysisId].recommendedAction = recommendedAction;
          this.analyses[analysisId].latencyMs = 2140;
          this.analyses[analysisId].confidence = 0.98;
          this.save();
        }
      }, 5000);
    }

    this.analyses[analysisId] = result;

    // Add to history
    this.history.unshift({
      analysisId,
      inputType: 'EMAIL',
      submittedHost: req.from,
      riskScore: isDeep ? null : riskScore,
      verdict: isDeep ? null : verdict,
      status,
      createdAt,
    });
    this.save();

    return result;
  }

  public createUrlAnalysis(req: UrlScanRequest): AnalysisResult {
    const analysisId = `ps-${Math.floor(100000 + Math.random() * 900000)}-xai`;
    const createdAt = new Date().toISOString();
    let host = 'unknown-target';
    try {
      host = new URL(req.url).hostname;
    } catch {
      host = req.url.replace(/^https?:\/\//, '').split('/')[0];
    }

    const isSuspicious = /auth|verify|login|update|account|secure|paypal|microsoft|apple|docusign/i.test(req.url) &&
      !/(google\.com|microsoft\.com|apple\.com|paypal\.com|github\.com)$/i.test(host);

    let riskScore = isSuspicious ? 86 : 6;
    const indicators: Indicator[] = [];

    if (isSuspicious) {
      indicators.push({
        code: 'URL_BRAND_IMPERSONATION',
        category: 'URL',
        severity: 'CRITICAL',
        contribution: 45,
        evidence: `URL contains targeted brand keywords on an unaffiliated domain host: "${host}".`,
      });
      indicators.push({
        code: 'DOM_UNKNOWN_REGISTRAR',
        category: 'DOMAIN',
        severity: 'HIGH',
        contribution: 25,
        evidence: 'Domain lacks corporate EV/OV verification and exhibits anomalous DNS routing records.',
      });
      indicators.push({
        code: 'TLS_AUTOMATED_CERT',
        category: 'TLS',
        severity: 'MEDIUM',
        contribution: 16,
        evidence: 'Short-lived DV certificate issued within recent 7 days.',
      });
    } else {
      indicators.push({
        code: 'URL_CLEAN_REPUTATION',
        category: 'URL',
        severity: 'INFO',
        contribution: 0,
        evidence: 'Valid domain reputation, known legitimate hosting infrastructure, and zero active threat intelligence hits.',
      });
    }

    let verdict: Verdict = riskScore >= 70 ? 'CRITICAL' : 'LOW_RISK';
    let recommendedAction: any = riskScore >= 70 ? 'BLOCK_AND_REPORT' : 'ALLOW_WITH_CAUTION';

    const isDeep = req.mode === 'DEEP';
    const status = isDeep ? 'QUEUED' : 'COMPLETE';

    const result: AnalysisResult = {
      analysisId,
      inputType: 'URL',
      mode: req.mode,
      status,
      riskScore: isDeep ? null : riskScore,
      verdict: isDeep ? null : verdict,
      confidence: 0.95,
      modelVersion: isDeep ? 'phishshield-xai-v3.4-ensemble' : 'phishshield-xai-v3.4-fast',
      latencyMs: isDeep ? null : 290,
      indicators: isDeep ? [] : indicators,
      recommendedAction: isDeep ? null : recommendedAction,
      createdAt,
      completedAt: isDeep ? null : new Date().toISOString(),
      normalizedUrl: req.url,
      submittedMetadata: {
        url: req.url,
      },
    };

    if (isDeep) {
      this.queuedTasks.set(analysisId, {
        startTime: Date.now(),
        mode: req.mode,
        payload: { riskScore, verdict, indicators, recommendedAction },
      });
      setTimeout(() => {
        if (this.analyses[analysisId]) {
          this.analyses[analysisId].riskScore = riskScore;
          this.analyses[analysisId].verdict = verdict;
          this.analyses[analysisId].indicators = indicators;
          this.analyses[analysisId].recommendedAction = recommendedAction;
          this.analyses[analysisId].latencyMs = 1850;
          this.analyses[analysisId].confidence = 0.99;
          this.save();
        }
      }, 5000);
    }

    this.analyses[analysisId] = result;
    this.history.unshift({
      analysisId,
      inputType: 'URL',
      submittedHost: host,
      riskScore: isDeep ? null : riskScore,
      verdict: isDeep ? null : verdict,
      status,
      createdAt,
    });
    this.save();

    return result;
  }

  public createEmlAnalysis(file: File, mode: ScanMode): AnalysisResult {
    const analysisId = `ps-${Math.floor(100000 + Math.random() * 900000)}-xai`;
    const createdAt = new Date().toISOString();

    const isSuspicious = /invoice|urgent|verify|threat|payload|phish/i.test(file.name);
    const riskScore = isSuspicious ? 91 : 38;
    const verdict: Verdict = isSuspicious ? 'CRITICAL' : 'SUSPICIOUS';
    const recommendedAction: any = isSuspicious ? 'BLOCK_AND_REPORT' : 'INVESTIGATE';

    const indicators: Indicator[] = isSuspicious
      ? [
          {
            code: 'EML_MALICIOUS_ATTACHMENT_MACRO',
            category: 'CONTENT',
            severity: 'CRITICAL',
            contribution: 45,
            evidence: `MIME parsing discovered obfuscated VBA Macro payload embedded inside file attachment: "${file.name}".`,
          },
          {
            code: 'EML_SPF_DKIM_FAIL',
            category: 'EMAIL',
            severity: 'HIGH',
            contribution: 30,
            evidence: 'DKIM cryptographic signature failed verification. Sender IP is not authorized in published SPF record.',
          },
          {
            code: 'TI_HEURISTIC_HASH_MATCH',
            category: 'THREAT_INTEL',
            severity: 'MEDIUM',
            contribution: 16,
            evidence: 'Extracted attachment SHA256 hash matches known Emotet/Qakbot dropper signature pattern.',
          },
        ]
      : [
          {
            code: 'EML_UNVERIFIED_SENDER',
            category: 'EMAIL',
            severity: 'MEDIUM',
            contribution: 25,
            evidence: 'SPF SoftFail recorded. Sender domain uses neutral SPF policy allowing possible relaying.',
          },
          {
            code: 'CONTENT_UNUSUAL_LINKS',
            category: 'CONTENT',
            severity: 'LOW',
            contribution: 13,
            evidence: 'Contains multiple shortener hyperlinks (bit.ly) obscuring destination endpoints.',
          },
        ];

    const isDeep = mode === 'DEEP';
    const status = isDeep ? 'QUEUED' : 'COMPLETE';

    const result: AnalysisResult = {
      analysisId,
      inputType: 'EML',
      mode,
      status,
      riskScore: isDeep ? null : riskScore,
      verdict: isDeep ? null : verdict,
      confidence: 0.96,
      modelVersion: isDeep ? 'phishshield-xai-v3.4-ensemble' : 'phishshield-xai-v3.4-fast',
      latencyMs: isDeep ? null : 480,
      indicators: isDeep ? [] : indicators,
      recommendedAction: isDeep ? null : recommendedAction,
      createdAt,
      completedAt: isDeep ? null : new Date().toISOString(),
      submittedMetadata: {
        fileName: file.name,
        fileSize: file.size,
      },
    };

    if (isDeep) {
      this.queuedTasks.set(analysisId, {
        startTime: Date.now(),
        mode,
        payload: { riskScore, verdict, indicators, recommendedAction },
      });
      setTimeout(() => {
        if (this.analyses[analysisId]) {
          this.analyses[analysisId].riskScore = riskScore;
          this.analyses[analysisId].verdict = verdict;
          this.analyses[analysisId].indicators = indicators;
          this.analyses[analysisId].recommendedAction = recommendedAction;
          this.analyses[analysisId].latencyMs = 2480;
          this.analyses[analysisId].confidence = 0.97;
          this.save();
        }
      }, 5000);
    }

    this.analyses[analysisId] = result;
    this.history.unshift({
      analysisId,
      inputType: 'EML',
      submittedHost: file.name,
      riskScore: isDeep ? null : riskScore,
      verdict: isDeep ? null : verdict,
      status,
      createdAt,
    });
    this.save();

    return result;
  }

  public recordFeedback(analysisId: string, label: FeedbackLabel, comment?: string) {
    console.log(`[PhishShield Feedback] Recorded for ${analysisId}: ${label}, comment: ${comment || 'N/A'}`);
    return { success: true, timestamp: new Date().toISOString() };
  }

  public generateMockPdfBlob(analysisId: string): Blob {
    const analysis = this.analyses[analysisId];
    const host = analysis?.submittedMetadata?.from || analysis?.submittedMetadata?.url || analysis?.submittedMetadata?.fileName || analysisId;
    const score = analysis?.riskScore ?? 'N/A';
    const verdict = analysis?.verdict ?? 'UNKNOWN';
    const lines = [
      '%PDF-1.4',
      '1 0 obj << /Title (PhishShield XAI Investigation Report) /Author (PhishShield Engine) /Creator (PhishShield Platform) >> endobj',
      '2 0 obj << /Type /Catalog /Pages 3 0 R >> endobj',
      '3 0 obj << /Type /Pages /Kids [4 0 R] /Count 1 >> endobj',
      '4 0 obj << /Type /Page /Parent 3 0 R /MediaBox [0 0 612 792] /Contents 5 0 R /Resources << /Font << /F1 6 0 R >> >> >> endobj',
      '6 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >> endobj',
      '5 0 obj << /Length 380 >> stream',
      'BT',
      '/F1 18 Tf',
      '50 720 Td',
      '(PHISHSHIELD XAI INVESTIGATION REPORT) Tj',
      '/F1 12 Tf',
      '0 -30 Td',
      `Analysis ID: ${analysisId}`,
      '0 -20 Td',
      `Target: ${host}`,
      '0 -20 Td',
      `Risk Score: ${score}/100 - Verdict: ${verdict}`,
      '0 -20 Td',
      `Model Version: ${analysis?.modelVersion || 'phishshield-v3.4'}`,
      '0 -20 Td',
      `Generated At: ${new Date().toISOString()}`,
      '0 -30 Td',
      '(Explainable AI Indicators & Security Recommendations Attached)',
      'ET',
      'endstream',
      'endobj',
      'xref',
      '0 7',
      '0000000000 65535 f ',
      '0000000010 00000 n ',
      '0000000120 00000 n ',
      '0000000177 00000 n ',
      '0000000236 00000 n ',
      '0000000350 00000 n ',
      '0000000780 00000 n ',
      'trailer << /Size 7 /Root 2 0 R /Info 1 0 R >>',
      'startxref',
      '860',
      '%%EOF',
    ];
    return new Blob([lines.join('\n')], { type: 'application/pdf' });
  }
}

export const mockStore = new MockStore();
