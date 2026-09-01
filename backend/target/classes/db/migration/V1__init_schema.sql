-- PhishShield XAI Postgres Initial Schema

CREATE TABLE IF NOT EXISTS model_versions (
    id UUID PRIMARY KEY,
    repo_id VARCHAR(255) NOT NULL,
    revision VARCHAR(100) NOT NULL,
    checksum VARCHAR(100),
    threshold DOUBLE PRECISION NOT NULL DEFAULT 0.50,
    metrics_json JSONB,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS threat_feed_entries (
    id UUID PRIMARY KEY,
    indicator_type VARCHAR(50) NOT NULL, -- DOMAIN, IP, URL_HASH
    indicator_value VARCHAR(512) NOT NULL,
    threat_type VARCHAR(100) NOT NULL,   -- PHISHING, MALWARE, CREDENTIAL_HARVESTER
    source VARCHAR(100) NOT NULL,        -- INTERNAL, OPENPHISH, PHISHTANK, THREATINTEL
    added_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_threat_indicator ON threat_feed_entries(indicator_type, indicator_value);

CREATE TABLE IF NOT EXISTS analyses (
    id UUID PRIMARY KEY,
    input_type VARCHAR(50) NOT NULL,     -- URL, EMAIL, EML
    mode VARCHAR(50) NOT NULL,           -- QUICK, DEEP
    status VARCHAR(50) NOT NULL,         -- QUEUED, PROCESSING, COMPLETE, FAILED
    normalized_url TEXT,
    risk_score INTEGER NOT NULL DEFAULT 0,
    verdict VARCHAR(50) NOT NULL,        -- LOW_RISK, SUSPICIOUS, HIGH_RISK, CRITICAL
    confidence DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    model_version VARCHAR(255) NOT NULL,
    latency_ms INTEGER,
    recommended_action VARCHAR(100) NOT NULL,
    raw_input TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX IF NOT EXISTS idx_analyses_created_at ON analyses(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_analyses_verdict ON analyses(verdict);
CREATE INDEX IF NOT EXISTS idx_analyses_input_type ON analyses(input_type);

CREATE TABLE IF NOT EXISTS indicators (
    id UUID PRIMARY KEY,
    analysis_id UUID NOT NULL REFERENCES analyses(id) ON DELETE CASCADE,
    code VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL,       -- URL, DOMAIN, TLS, EMAIL, CONTENT, THREAT_INTEL
    severity VARCHAR(50) NOT NULL,       -- INFO, LOW, MEDIUM, HIGH, CRITICAL
    contribution DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    evidence TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_indicators_analysis_id ON indicators(analysis_id);

CREATE TABLE IF NOT EXISTS feedback (
    id UUID PRIMARY KEY,
    analysis_id UUID NOT NULL REFERENCES analyses(id) ON DELETE CASCADE,
    actual_label VARCHAR(50) NOT NULL,   -- PHISHING, LEGITIMATE, UNCERTAIN
    comment TEXT,
    submitted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_feedback_analysis_id ON feedback(analysis_id);

CREATE TABLE IF NOT EXISTS deep_scan_jobs (
    id UUID PRIMARY KEY,
    analysis_id UUID NOT NULL REFERENCES analyses(id) ON DELETE CASCADE,
    status VARCHAR(50) NOT NULL,         -- QUEUED, RUNNING, COMPLETED, FAILED
    target_url TEXT NOT NULL,
    attempts INTEGER NOT NULL DEFAULT 0,
    result_payload JSONB,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_deep_scan_jobs_analysis ON deep_scan_jobs(analysis_id);

-- Seed initial default model version and known threat indicators
INSERT INTO model_versions (id, repo_id, revision, checksum, threshold, metrics_json, active)
VALUES (
    'a0000000-0000-0000-0000-000000000001',
    'pirocheto/phishing-url-detection',
    '44f3b19f705b52532e0aadf3d0d15dd892b8a2fb',
    'model.onnx',
    0.50,
    '{"accuracy": 0.72, "precision": 0.67, "recall": 0.88, "f1": 0.76, "roc_auc": 0.77}',
    TRUE
) ON CONFLICT (id) DO NOTHING;

INSERT INTO threat_feed_entries (id, indicator_type, indicator_value, threat_type, source)
VALUES
    ('b0000000-0000-0000-0000-000000000001', 'DOMAIN', 'paypa1-security-verification.com', 'CREDENTIAL_HARVESTER', 'THREATINTEL_FEED'),
    ('b0000000-0000-0000-0000-000000000002', 'DOMAIN', 'secure-update-paypal.com.account-verify.tk', 'PHISHING', 'OPENPHISH'),
    ('b0000000-0000-0000-0000-000000000003', 'DOMAIN', 'login-steamcommunity.com.trade-offer.ga', 'CREDENTIAL_HARVESTER', 'PHISHTANK')
ON CONFLICT (id) DO NOTHING;
