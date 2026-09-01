package com.phishshield.service;

import com.phishshield.dto.AnalysisResultDto;
import com.phishshield.dto.IndicatorDto;
import com.phishshield.entity.Analysis;
import com.phishshield.entity.DeepScanJob;
import com.phishshield.entity.Indicator;
import com.phishshield.enums.AnalysisStatus;
import com.phishshield.enums.InputType;
import com.phishshield.enums.ScanMode;
import com.phishshield.enums.Verdict;
import com.phishshield.messaging.DeepScanMessage;
import com.phishshield.messaging.DeepScanPublisher;
import com.phishshield.messaging.DeepScanResultMessage;
import com.phishshield.repository.AnalysisRepository;
import com.phishshield.repository.DeepScanJobRepository;
import com.phishshield.repository.IndicatorRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Service
public class DeepScanService {

    private static final Logger logger = LoggerFactory.getLogger(DeepScanService.class);

    private final AnalysisRepository analysisRepository;
    private final IndicatorRepository indicatorRepository;
    private final DeepScanJobRepository deepScanJobRepository;
    private final DeepScanPublisher deepScanPublisher;
    private final RiskFusionService riskFusionService;
    private final ExplanationService explanationService;

    public DeepScanService(
            AnalysisRepository analysisRepository,
            IndicatorRepository indicatorRepository,
            DeepScanJobRepository deepScanJobRepository,
            DeepScanPublisher deepScanPublisher,
            RiskFusionService riskFusionService,
            ExplanationService explanationService
    ) {
        this.analysisRepository = analysisRepository;
        this.indicatorRepository = indicatorRepository;
        this.deepScanJobRepository = deepScanJobRepository;
        this.deepScanPublisher = deepScanPublisher;
        this.riskFusionService = riskFusionService;
        this.explanationService = explanationService;
    }

    @Transactional
    public AnalysisResultDto enqueueDeepScan(String normalizedUrl, double preliminaryMlProb, String modelVersion, InputType inputType) {
        Analysis analysis = new Analysis();
        analysis.setInputType(inputType);
        analysis.setMode(ScanMode.DEEP);
        analysis.setStatus(AnalysisStatus.QUEUED);
        analysis.setNormalizedUrl(normalizedUrl);
        analysis.setRiskScore(0);
        analysis.setVerdict(Verdict.LOW_RISK);
        analysis.setConfidence(0.0);
        analysis.setModelVersion(modelVersion);
        analysis.setLatencyMs(10);
        analysis.setRecommendedAction("AWAIT_DEEP_INSPECTION");
        analysis.setRawInput(normalizedUrl);

        Indicator queuedInd = new Indicator(
                "DEEP_SCAN_ENQUEUED",
                com.phishshield.enums.IndicatorCategory.URL,
                com.phishshield.enums.IndicatorSeverity.INFO,
                0.0,
                "Deep scan task dispatched to isolated sandboxed inspection worker queue"
        );
        analysis.addIndicator(queuedInd);

        Analysis saved = analysisRepository.save(analysis);

        // Record deep scan job
        DeepScanJob job = new DeepScanJob();
        job.setAnalysisId(saved.getId());
        job.setTargetUrl(normalizedUrl);
        job.setStatus("QUEUED");
        deepScanJobRepository.save(job);

        // Publish to RabbitMQ
        deepScanPublisher.publishDeepScanJob(new DeepScanMessage(
                saved.getId(),
                normalizedUrl,
                preliminaryMlProb,
                modelVersion
        ));

        return toDto(saved);
    }

    @Transactional
    public void processDeepScanResult(DeepScanResultMessage result) {
        logger.info("Processing Deep Scan result for Analysis ID: {}", result.getAnalysisId());
        Analysis analysis = analysisRepository.findById(result.getAnalysisId()).orElse(null);
        if (analysis == null) {
            logger.warn("Analysis not found for Deep Scan result ID: {}", result.getAnalysisId());
            return;
        }

        Instant completedAt = Instant.now();
        int latency = (int) Duration.between(analysis.getCreatedAt(), completedAt).toMillis();

        if ("FAILED".equalsIgnoreCase(result.getStatus())) {
            analysis.setStatus(AnalysisStatus.FAILED);
            analysis.setCompletedAt(completedAt);
            analysis.setLatencyMs(latency);
            analysisRepository.save(analysis);
            return;
        }

        // Add enriched indicators
        double enrichedRuleScore = 0.0;
        for (IndicatorDto dto : result.getEnrichedIndicators()) {
            Indicator ind = new Indicator(dto.getCode(), dto.getCategory(), dto.getSeverity(), dto.getContribution(), dto.getEvidence());
            analysis.addIndicator(ind);
            enrichedRuleScore += dto.getContribution();
        }

        // Extract ML probability from existing ML indicator or fallback
        double mlProb = 0.50;
        for (Indicator ind : analysis.getIndicators()) {
            if (ind.getCode().startsWith("ML_PREDICTION")) {
                mlProb = ind.getContribution() / 70.0;
                break;
            }
        }

        RiskFusionService.FusedRiskResult fused = riskFusionService.combineUrl(mlProb, Math.min(100.0, enrichedRuleScore), result.isSsrfBlocked());

        analysis.setStatus(AnalysisStatus.COMPLETE);
        analysis.setRiskScore(fused.getRiskScore());
        analysis.setVerdict(fused.getVerdict());
        analysis.setConfidence(fused.getConfidence());
        analysis.setRecommendedAction(explanationService.deriveRecommendedAction(fused.getVerdict()));
        analysis.setCompletedAt(completedAt);
        analysis.setLatencyMs(latency);

        analysisRepository.save(analysis);

        // Update Job table
        deepScanJobRepository.findByAnalysisId(analysis.getId()).ifPresent(j -> {
            j.setStatus("COMPLETED");
            j.setUpdatedAt(Instant.now());
            deepScanJobRepository.save(j);
        });
    }

    public AnalysisResultDto toDto(Analysis a) {
        AnalysisResultDto dto = new AnalysisResultDto();
        dto.setAnalysisId(a.getId());
        dto.setInputType(a.getInputType());
        dto.setMode(a.getMode());
        dto.setStatus(a.getStatus());
        dto.setNormalizedUrl(a.getNormalizedUrl());
        dto.setRiskScore(a.getRiskScore());
        dto.setVerdict(a.getVerdict());
        dto.setConfidence(a.getConfidence());
        dto.setModelVersion(a.getModelVersion());
        dto.setLatencyMs(a.getLatencyMs());
        dto.setRecommendedAction(a.getRecommendedAction());
        dto.setCreatedAt(a.getCreatedAt());
        dto.setCompletedAt(a.getCompletedAt());

        List<IndicatorDto> indicatorDtos = a.getIndicators().stream()
                .map(i -> new IndicatorDto(i.getCode(), i.getCategory(), i.getSeverity(), i.getContribution(), i.getEvidence()))
                .toList();
        dto.setIndicators(indicatorDtos);
        return dto;
    }
}
