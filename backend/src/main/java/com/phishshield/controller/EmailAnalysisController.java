package com.phishshield.controller;

import com.phishshield.client.MlServiceClient;
import com.phishshield.dto.AnalysisResultDto;
import com.phishshield.dto.EmailAnalysisRequest;
import com.phishshield.dto.IndicatorDto;
import com.phishshield.dto.MlPredictResponse;
import com.phishshield.entity.Analysis;
import com.phishshield.entity.Indicator;
import com.phishshield.enums.AnalysisStatus;
import com.phishshield.enums.InputType;
import com.phishshield.enums.ScanMode;
import com.phishshield.exception.InvalidRequestException;
import com.phishshield.repository.AnalysisRepository;
import com.phishshield.service.*;
import jakarta.validation.Valid;
import org.apache.james.mime4j.dom.Message;
import org.apache.james.mime4j.dom.MessageBuilder;
import org.apache.james.mime4j.dom.TextBody;
import org.apache.james.mime4j.message.DefaultMessageBuilder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.StringWriter;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/v1/analyses")
public class EmailAnalysisController {

    private static final Logger logger = LoggerFactory.getLogger(EmailAnalysisController.class);

    private final UrlNormalizationService normalizationService;
    private final ThreatIntelService threatIntelService;
    private final RuleEngineService ruleEngineService;
    private final MlServiceClient mlServiceClient;
    private final RiskFusionService riskFusionService;
    private final ExplanationService explanationService;
    private final DeepScanService deepScanService;
    private final AnalysisRepository analysisRepository;

    public EmailAnalysisController(
            UrlNormalizationService normalizationService,
            ThreatIntelService threatIntelService,
            RuleEngineService ruleEngineService,
            MlServiceClient mlServiceClient,
            RiskFusionService riskFusionService,
            ExplanationService explanationService,
            DeepScanService deepScanService,
            AnalysisRepository analysisRepository
    ) {
        this.normalizationService = normalizationService;
        this.threatIntelService = threatIntelService;
        this.ruleEngineService = ruleEngineService;
        this.mlServiceClient = mlServiceClient;
        this.riskFusionService = riskFusionService;
        this.explanationService = explanationService;
        this.deepScanService = deepScanService;
        this.analysisRepository = analysisRepository;
    }

    @PostMapping("/email")
    public ResponseEntity<AnalysisResultDto> analyzeEmail(@Valid @RequestBody EmailAnalysisRequest request) {
        return processEmailAnalysis(request.getFrom(), request.getReplyTo(), request.getSubject(), request.getBody(), request.getMode(), InputType.EMAIL);
    }

    @PostMapping(value = "/email-file", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<AnalysisResultDto> analyzeEmailFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "mode", defaultValue = "QUICK") ScanMode mode
    ) {
        if (file.isEmpty()) {
            throw new InvalidRequestException("Uploaded .eml file is empty");
        }

        try (InputStream is = file.getInputStream()) {
            MessageBuilder builder = new DefaultMessageBuilder();
            Message message = builder.parseMessage(is);

            String from = message.getFrom() != null && !message.getFrom().isEmpty() ? message.getFrom().get(0).toString() : "";
            String replyTo = message.getReplyTo() != null && !message.getReplyTo().isEmpty() ? message.getReplyTo().get(0).toString() : "";
            String subject = message.getSubject() != null ? message.getSubject() : "";

            String body = "";
            if (message.getBody() instanceof TextBody textBody) {
                StringWriter writer = new StringWriter();
                try (InputStreamReader reader = new InputStreamReader(textBody.getInputStream(), StandardCharsets.UTF_8)) {
                    reader.transferTo(writer);
                }
                body = writer.toString();
            } else {
                body = new String(file.getBytes(), StandardCharsets.UTF_8);
            }

            return processEmailAnalysis(from, replyTo, subject, body, mode, InputType.EML);
        } catch (Exception e) {
            logger.warn("Failed to parse .eml file structure, falling back to raw text parsing: {}", e.getMessage());
            try {
                String rawText = new String(file.getBytes(), StandardCharsets.UTF_8);
                return processEmailAnalysis("", "", file.getOriginalFilename(), rawText, mode, InputType.EML);
            } catch (Exception ex) {
                throw new InvalidRequestException("Failed to read .eml file: " + ex.getMessage());
            }
        }
    }

    private ResponseEntity<AnalysisResultDto> processEmailAnalysis(
            String from, String replyTo, String subject, String body, ScanMode mode, InputType inputType
    ) {
        Instant startTime = Instant.now();

        // 1. Extract embedded URLs from email body
        List<String> extractedUrls = ruleEngineService.extractUrlsFromText(body);
        String primaryUrl = extractedUrls.isEmpty() ? null : extractedUrls.get(0);
        String normalizedPrimaryUrl = primaryUrl != null ? normalizationService.normalize(primaryUrl) : null;

        // If Deep Scan requested on an email with URLs
        if (mode == ScanMode.DEEP && normalizedPrimaryUrl != null) {
            MlPredictResponse preliminaryMl = mlServiceClient.predict(normalizedPrimaryUrl);
            AnalysisResultDto queuedResult = deepScanService.enqueueDeepScan(
                    normalizedPrimaryUrl,
                    preliminaryMl.getPhishingProbability(),
                    preliminaryMl.getModelVersion(),
                    inputType
            );
            return ResponseEntity.status(HttpStatus.ACCEPTED).body(queuedResult);
        }

        // 2. Evaluate Email Rule Signals (Header mismatches, urgency triggers)
        RuleEngineService.RuleEvaluationResult emailRules = ruleEngineService.evaluateEmail(from, replyTo, subject, body);

        // 3. Evaluate Embedded URL (if any)
        double urlMlScore = 0.0;
        double urlDomainRuleScore = 0.0;
        String modelVersion = "pirocheto/phishing-url-detection:model.onnx@44f3b19f";
        boolean threatFeedHit = false;
        String threatEvidence = null;
        List<IndicatorDto> combinedRuleIndicators = new ArrayList<>(emailRules.getIndicators());

        if (normalizedPrimaryUrl != null) {
            // Threat feed check
            var threatMatch = threatIntelService.checkThreatFeed(normalizedPrimaryUrl);
            if (threatMatch.isPresent()) {
                threatFeedHit = true;
                threatEvidence = "Embedded link '" + normalizedPrimaryUrl + "' listed in threat feed";
            }

            MlPredictResponse mlResp = mlServiceClient.predict(normalizedPrimaryUrl);
            urlMlScore = mlResp.getPhishingProbability() * 100.0;
            modelVersion = mlResp.getModelVersion();

            RuleEngineService.RuleEvaluationResult urlRules = ruleEngineService.evaluateUrl(normalizedPrimaryUrl);
            urlDomainRuleScore = urlRules.getRuleScore();
            combinedRuleIndicators.addAll(urlRules.getIndicators());
        }

        // 4. Combine Email Risk: 0.55*urlMlScore + 0.25*urlDomainRuleScore + 0.20*emailContextScore
        RiskFusionService.FusedRiskResult fused = riskFusionService.combineEmail(
                urlMlScore,
                urlDomainRuleScore,
                emailRules.getRuleScore(),
                threatFeedHit
        );

        // 5. Synthesize Indicators
        double mlProb = urlMlScore / 100.0;
        List<IndicatorDto> indicators = explanationService.synthesizeIndicators(
                mlProb,
                modelVersion,
                combinedRuleIndicators,
                threatFeedHit,
                threatEvidence
        );

        String action = explanationService.deriveRecommendedAction(fused.getVerdict());
        Instant completedTime = Instant.now();
        int latency = (int) Duration.between(startTime, completedTime).toMillis();

        // 6. Persist to Postgres
        Analysis analysis = new Analysis();
        analysis.setInputType(inputType);
        analysis.setMode(ScanMode.QUICK);
        analysis.setStatus(AnalysisStatus.COMPLETE);
        analysis.setNormalizedUrl(normalizedPrimaryUrl);
        analysis.setRiskScore(fused.getRiskScore());
        analysis.setVerdict(fused.getVerdict());
        analysis.setConfidence(fused.getConfidence());
        analysis.setModelVersion(modelVersion);
        analysis.setLatencyMs(latency);
        analysis.setRecommendedAction(action);
        analysis.setRawInput("Subject: " + (subject != null ? subject : "") + "\nFrom: " + (from != null ? from : ""));
        analysis.setCreatedAt(startTime);
        analysis.setCompletedAt(completedTime);

        for (IndicatorDto indDto : indicators) {
            Indicator ind = new Indicator(indDto.getCode(), indDto.getCategory(), indDto.getSeverity(), indDto.getContribution(), indDto.getEvidence());
            analysis.addIndicator(ind);
        }

        Analysis saved = analysisRepository.save(analysis);
        return ResponseEntity.ok(deepScanService.toDto(saved));
    }
}
