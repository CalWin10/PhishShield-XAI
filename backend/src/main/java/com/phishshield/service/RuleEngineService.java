package com.phishshield.service;

import com.phishshield.dto.IndicatorDto;
import com.phishshield.enums.IndicatorCategory;
import com.phishshield.enums.IndicatorSeverity;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class RuleEngineService {

    private static final Pattern URL_EXTRACTION_PATTERN = Pattern.compile("https?://[\\w\\d:#@%/;$()~_?\\+-=\\\\.&]+", Pattern.CASE_INSENSITIVE);

    private static final List<String> URGENCY_TRIGGERS = List.of(
            "urgent", "suspend", "suspended", "immediate", "terminate", "unauthorized", "compromised",
            "action required", "24 hours", "locked", "expire", "critical security"
    );

    private final UrlRuleSignalService urlRuleSignalService;

    public RuleEngineService(UrlRuleSignalService urlRuleSignalService) {
        this.urlRuleSignalService = urlRuleSignalService;
    }

    public static class RuleEvaluationResult {
        private final double ruleScore;
        private final List<IndicatorDto> indicators;

        public RuleEvaluationResult(double ruleScore, List<IndicatorDto> indicators) {
            this.ruleScore = ruleScore;
            this.indicators = indicators;
        }

        public double getRuleScore() { return ruleScore; }
        public List<IndicatorDto> getIndicators() { return indicators; }
    }

    public RuleEvaluationResult evaluateUrl(String normalizedUrl) {
        List<IndicatorDto> indicators = urlRuleSignalService.extractUrlSignals(normalizedUrl);

        double totalScore = 0.0;
        for (IndicatorDto ind : indicators) {
            totalScore += ind.getContribution();
        }

        // Clamp rule score between 0 and 100
        double clampedScore = Math.max(0.0, Math.min(100.0, totalScore));
        return new RuleEvaluationResult(clampedScore, indicators);
    }

    public RuleEvaluationResult evaluateEmail(String from, String replyTo, String subject, String body) {
        List<IndicatorDto> indicators = new ArrayList<>();
        double emailScore = 0.0;

        // 1. Header Mismatch Check (From domain vs Reply-To domain)
        if (from != null && replyTo != null && !from.trim().isEmpty() && !replyTo.trim().isEmpty()) {
            String fromDomain = extractEmailDomain(from);
            String replyToDomain = extractEmailDomain(replyTo);

            if (!fromDomain.isEmpty() && !replyToDomain.isEmpty() && !fromDomain.equalsIgnoreCase(replyToDomain)) {
                IndicatorDto mismatch = new IndicatorDto(
                        "EMAIL_HEADER_MISMATCH",
                        IndicatorCategory.EMAIL,
                        IndicatorSeverity.HIGH,
                        30.0,
                        "Sender domain '" + fromDomain + "' does not match Reply-To domain '" + replyToDomain + "'"
                );
                indicators.add(mismatch);
                emailScore += 30.0;
            }
        }

        // 2. Urgency and Coercion Keyword Detection in Subject and Body
        String combinedText = ((subject != null ? subject : "") + " " + (body != null ? body : "")).toLowerCase();
        List<String> matchedTriggers = new ArrayList<>();
        for (String trigger : URGENCY_TRIGGERS) {
            if (combinedText.contains(trigger)) {
                matchedTriggers.add(trigger);
            }
        }

        if (!matchedTriggers.isEmpty()) {
            IndicatorDto urgencyInd = new IndicatorDto(
                    "EMAIL_URGENCY_KEYWORDS",
                    IndicatorCategory.EMAIL,
                    IndicatorSeverity.MEDIUM,
                    20.0,
                    "Psychological coercion and urgency triggers detected: " + String.join(", ", matchedTriggers)
            );
            indicators.add(urgencyInd);
            emailScore += 20.0;
        }

        double clampedScore = Math.max(0.0, Math.min(100.0, emailScore));
        return new RuleEvaluationResult(clampedScore, indicators);
    }

    public List<String> extractUrlsFromText(String text) {
        List<String> urls = new ArrayList<>();
        if (text == null || text.trim().isEmpty()) {
            return urls;
        }
        Matcher matcher = URL_EXTRACTION_PATTERN.matcher(text);
        while (matcher.find()) {
            urls.add(matcher.group());
        }
        return urls;
    }

    private String extractEmailDomain(String email) {
        int atIdx = email.lastIndexOf('@');
        if (atIdx != -1 && atIdx < email.length() - 1) {
            String domainPart = email.substring(atIdx + 1).trim();
            if (domainPart.endsWith(">")) {
                domainPart = domainPart.substring(0, domainPart.length() - 1);
            }
            return domainPart.toLowerCase();
        }
        return "";
    }
}
