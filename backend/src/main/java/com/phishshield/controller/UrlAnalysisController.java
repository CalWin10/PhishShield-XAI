package com.phishshield.controller;

import com.phishshield.client.MlServiceClient;
import com.phishshield.dto.AnalysisResultDto;
import com.phishshield.dto.IndicatorDto;
import com.phishshield.dto.MlPredictResponse;
import com.phishshield.dto.UrlAnalysisRequest;
import com.phishshield.entity.Analysis;
import com.phishshield.entity.Indicator;
import com.phishshield.entity.ThreatFeedEntry;
import com.phishshield.enums.AnalysisStatus;
import com.phishshield.enums.InputType;
import com.phishshield.enums.ScanMode;
import com.phishshield.repository.AnalysisRepository;
import com.phishshield.service.*;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Duration;
import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.TimeUnit;

@RestController
@RequestMapping("/api/v1/analyses")
public class UrlAnalysisController {

    private static final Logger logger = LoggerFactory.getLogger(UrlAnalysisController.class);

    private final UrlNormalizationService normalizationService;
    private final ThreatIntelService threatIntelService;
    private final RuleEngineService ruleEngineService;
    private final MlServiceClient mlServiceClient;
    private final RiskFusionService riskFusionService;
    private final ExplanationService explanationService;
    private final DeepScanService deepScanService;
    private final AnalysisRepository analysisRepository;
    private final RedisTemplate<String, Object> redisTemplate;

    public UrlAnalysisController(
            UrlNormalizationService normalizationService,
            ThreatIntelService threatIntelService,
            RuleEngineService ruleEngineService,
            MlServiceClient mlServiceClient,
            RiskFusionService riskFusionService,
            ExplanationService explanationService,
            DeepScanService deepScanService,
            AnalysisRepository analysisRepository,
            RedisTemplate<String, Object> redisTemplate
    ) {
        this.normalizationService = normalizationService;
        this.threatIntelService = threatIntelService;
        this.ruleEngineService = ruleEngineService;
        this.mlServiceClient = mlServiceClient;
        this.riskFusionService = riskFusionService;
        this.explanationService = explanationService;
        this.deepScanService = deepScanService;
        this.analysisRepository = analysisRepository;
        this.redisTemplate = redisTemplate;
    }

    @PostMapping("/url")
    public ResponseEntity<AnalysisResultDto> analyzeUrl(@Valid @RequestBody UrlAnalysisRequest request) {
        Instant startTime = Instant.now();
        String normalizedUrl = normalizationService.normalize(request.getUrl());

        // Handle Deep Scan
        if (request.getMode() == ScanMode.DEEP) {
            MlPredictResponse preliminaryMl = mlServiceClient.predict(normalizedUrl);
            AnalysisResultDto queuedResult = deepScanService.enqueueDeepScan(
                    normalizedUrl,
                    preliminaryMl.getPhishingProbability(),
                    preliminaryMl.getModelVersion(),
                    InputType.URL
            );
            return ResponseEntity.status(HttpStatus.ACCEPTED).body(queuedResult);
        }

        // Quick Scan: Check Redis Cache
        String cacheKey = normalizationService.buildRedisCacheKey(normalizedUrl);
        try {
            AnalysisResultDto cached = (AnalysisResultDto) redisTemplate.opsForValue().get(cacheKey);
            if (cached != null) {
                logger.info("Redis cache hit for URL hash: {}", cacheKey);
                return ResponseEntity.ok(cached);
            }
        } catch (Exception e) {
            logger.warn("Redis cache read failed: {}", e.getMessage());
        }

        // 1. Check local threat feed
        Optional<ThreatFeedEntry> threatMatch = threatIntelService.checkThreatFeed(normalizedUrl);
        boolean isThreatFeedHit = threatMatch.isPresent();
        String threatEvidence = threatMatch.map(t -> "Verified match in " + t.getSource() + " threat feed (" + t.getThreatType() + ")").orElse(null);

        // 2. Parallel ML prediction and Rule evaluation
        CompletableFuture<MlPredictResponse> mlFuture = CompletableFuture.supplyAsync(() ->
                mlServiceClient.predict(normalizedUrl)
        );

        CompletableFuture<RuleEngineService.RuleEvaluationResult> ruleFuture = CompletableFuture.supplyAsync(() ->
                ruleEngineService.evaluateUrl(normalizedUrl)
        );

        MlPredictResponse mlResponse;
        RuleEngineService.RuleEvaluationResult ruleResult;
        try {
            mlResponse = mlFuture.get(4, TimeUnit.SECONDS);
            ruleResult = ruleFuture.get(2, TimeUnit.SECONDS);
        } catch (Exception e) {
            logger.warn("Parallel execution timeout or error: {}. Using fallback results.", e.getMessage());
            mlResponse = mlServiceClient.predict(normalizedUrl);
            ruleResult = ruleEngineService.evaluateUrl(normalizedUrl);
        }

        // 3. Risk Fusion
        RiskFusionService.FusedRiskResult fused = riskFusionService.combineUrl(
                mlResponse.getPhishingProbability(),
                ruleResult.getRuleScore(),
                isThreatFeedHit
        );

        // 4. Synthesize Indicators & Action
        List<IndicatorDto> indicators = explanationService.synthesizeIndicators(
                mlResponse.getPhishingProbability(),
                mlResponse.getModelVersion(),
                ruleResult.getIndicators(),
                isThreatFeedHit,
                threatEvidence
        );

        String action = explanationService.deriveRecommendedAction(fused.getVerdict());
        Instant completedTime = Instant.now();
        int latency = (int) Duration.between(startTime, completedTime).toMillis();

        // 5. Persist to Postgres
        Analysis analysis = new Analysis();
        analysis.setInputType(InputType.URL);
        analysis.setMode(ScanMode.QUICK);
        analysis.setStatus(AnalysisStatus.COMPLETE);
        analysis.setNormalizedUrl(normalizedUrl);
        analysis.setRiskScore(fused.getRiskScore());
        analysis.setVerdict(fused.getVerdict());
        analysis.setConfidence(fused.getConfidence());
        analysis.setModelVersion(mlResponse.getModelVersion());
        analysis.setLatencyMs(latency);
        analysis.setRecommendedAction(action);
        analysis.setRawInput(request.getUrl());
        analysis.setCreatedAt(startTime);
        analysis.setCompletedAt(completedTime);

        for (IndicatorDto indDto : indicators) {
            Indicator ind = new Indicator(indDto.getCode(), indDto.getCategory(), indDto.getSeverity(), indDto.getContribution(), indDto.getEvidence());
            analysis.addIndicator(ind);
        }

        Analysis saved = analysisRepository.save(analysis);
        AnalysisResultDto responseDto = deepScanService.toDto(saved);

        // 6. Cache in Redis (TTL: 1 hour)
        try {
            redisTemplate.opsForValue().set(cacheKey, responseDto, Duration.ofHours(1));
        } catch (Exception e) {
            logger.warn("Redis cache write failed: {}", e.getMessage());
        }

        return ResponseEntity.ok(responseDto);
    }
}
