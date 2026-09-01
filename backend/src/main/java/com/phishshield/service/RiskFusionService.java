package com.phishshield.service;

import com.phishshield.enums.Verdict;
import org.springframework.stereotype.Service;

@Service
public class RiskFusionService {

    public static class FusedRiskResult {
        private final int riskScore;
        private final Verdict verdict;
        private final double confidence;

        public FusedRiskResult(int riskScore, Verdict verdict, double confidence) {
            this.riskScore = riskScore;
            this.verdict = verdict;
            this.confidence = confidence;
        }

        public int getRiskScore() { return riskScore; }
        public Verdict getVerdict() { return verdict; }
        public double getConfidence() { return confidence; }
    }

    public FusedRiskResult combineUrl(double phishingProbability, double ruleScore, boolean threatFeedMatch) {
        if (threatFeedMatch) {
            return new FusedRiskResult(98, Verdict.CRITICAL, 0.99);
        }

        double mlScore = phishingProbability * 100.0;
        double blended = (0.70 * mlScore) + (0.30 * ruleScore);
        int finalRisk = (int) Math.round(Math.max(0.0, Math.min(100.0, blended)));

        Verdict verdict = calculateVerdict(finalRisk);
        double confidence = calculateConfidence(phishingProbability, ruleScore);

        return new FusedRiskResult(finalRisk, verdict, confidence);
    }

    public FusedRiskResult combineEmail(double urlMlScore, double urlDomainRuleScore, double emailContextScore, boolean threatFeedMatch) {
        if (threatFeedMatch) {
            return new FusedRiskResult(98, Verdict.CRITICAL, 0.99);
        }

        double blended = (0.55 * urlMlScore) + (0.25 * urlDomainRuleScore) + (0.20 * emailContextScore);
        int finalRisk = (int) Math.round(Math.max(0.0, Math.min(100.0, blended)));

        Verdict verdict = calculateVerdict(finalRisk);
        double confidence = calculateConfidence(urlMlScore / 100.0, (urlDomainRuleScore + emailContextScore) / 2.0);

        return new FusedRiskResult(finalRisk, verdict, confidence);
    }

    public Verdict calculateVerdict(int riskScore) {
        if (riskScore <= 29) {
            return Verdict.LOW_RISK;
        } else if (riskScore <= 59) {
            return Verdict.SUSPICIOUS;
        } else if (riskScore <= 79) {
            return Verdict.HIGH_RISK;
        } else {
            return Verdict.CRITICAL;
        }
    }

    private double calculateConfidence(double phishingProbability, double ruleScore) {
        // High confidence when ML and rules agree or when ML probability is near extremes
        double mlCertainty = Math.abs(phishingProbability - 0.50) * 2.0; // 0.0 at 0.5, 1.0 at 0.0 or 1.0
        double baseConfidence = 0.85 + (mlCertainty * 0.13);
        return Math.round(Math.min(0.99, Math.max(0.70, baseConfidence)) * 100.0) / 100.0;
    }
}
