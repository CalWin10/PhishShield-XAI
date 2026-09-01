package com.phishshield.service;

import com.phishshield.dto.IndicatorDto;
import com.phishshield.enums.IndicatorCategory;
import com.phishshield.enums.IndicatorSeverity;
import com.phishshield.enums.Verdict;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

@Service
public class ExplanationService {

    public List<IndicatorDto> synthesizeIndicators(
            double phishingProbability,
            String modelVersion,
            List<IndicatorDto> ruleIndicators,
            boolean threatFeedMatch,
            String threatFeedEvidence
    ) {
        List<IndicatorDto> all = new ArrayList<>();

        // 1. Threat Feed Indicator if matched
        if (threatFeedMatch) {
            all.add(new IndicatorDto(
                    "THREAT_FEED_MATCH",
                    IndicatorCategory.THREAT_INTEL,
                    IndicatorSeverity.CRITICAL,
                    95.0,
                    threatFeedEvidence != null ? threatFeedEvidence : "Target domain/URL is listed in active verified phishing intelligence feeds"
            ));
        }

        // 2. Exact Single ML Indicator (No fabricated sub-features)
        String mlEvidence = String.format(Locale.US, "pirocheto/phishing-url-detection scored this URL %.4f probability of phishing", phishingProbability);
        IndicatorSeverity mlSeverity;
        String mlCode;
        double mlContribution = phishingProbability * 70.0;

        if (phishingProbability >= 0.80) {
            mlSeverity = IndicatorSeverity.CRITICAL;
            mlCode = "ML_PREDICTION_PHISHING_CRITICAL";
        } else if (phishingProbability >= 0.50) {
            mlSeverity = IndicatorSeverity.HIGH;
            mlCode = "ML_PREDICTION_PHISHING";
        } else if (phishingProbability >= 0.25) {
            mlSeverity = IndicatorSeverity.MEDIUM;
            mlCode = "ML_PREDICTION_SUSPICIOUS";
        } else {
            mlSeverity = IndicatorSeverity.LOW;
            mlCode = "ML_PREDICTION_LEGITIMATE";
        }

        all.add(new IndicatorDto(
                mlCode,
                IndicatorCategory.URL,
                mlSeverity,
                Math.round(mlContribution * 10.0) / 10.0,
                mlEvidence
        ));

        // 3. Rule Engine Indicators
        if (ruleIndicators != null) {
            all.addAll(ruleIndicators);
        }

        // 4. Guarantee rule: Never show a score without at least one evidence indicator
        if (all.isEmpty()) {
            all.add(new IndicatorDto(
                    "HEURISTIC_BASELINE_EVALUATION",
                    IndicatorCategory.URL,
                    IndicatorSeverity.INFO,
                    5.0,
                    "Automated structural and syntactic baseline inspection completed with no active threat flags"
            ));
        }

        return all;
    }

    public String deriveRecommendedAction(Verdict verdict) {
        return switch (verdict) {
            case CRITICAL -> "BLOCK_AND_QUARANTINE";
            case HIGH_RISK -> "BLOCK_AND_ISOLATE";
            case SUSPICIOUS -> "WARN_USER_AND_MONITOR";
            case LOW_RISK -> "ALLOW";
        };
    }
}
