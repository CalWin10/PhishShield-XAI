package com.phishshield.dto;

import com.phishshield.enums.AnalysisStatus;
import com.phishshield.enums.InputType;
import com.phishshield.enums.ScanMode;
import com.phishshield.enums.Verdict;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

public class AnalysisResultDto {

    private UUID analysisId;
    private InputType inputType;
    private ScanMode mode;
    private AnalysisStatus status;
    private String normalizedUrl;
    private Integer riskScore;
    private Verdict verdict;
    private Double confidence;
    private String modelVersion;
    private Integer latencyMs;
    private List<IndicatorDto> indicators = new ArrayList<>();
    private String recommendedAction;
    private Instant createdAt;
    private Instant completedAt;

    public AnalysisResultDto() {}

    public UUID getAnalysisId() { return analysisId; }
    public void setAnalysisId(UUID analysisId) { this.analysisId = analysisId; }

    public InputType getInputType() { return inputType; }
    public void setInputType(InputType inputType) { this.inputType = inputType; }

    public ScanMode getMode() { return mode; }
    public void setMode(ScanMode mode) { this.mode = mode; }

    public AnalysisStatus getStatus() { return status; }
    public void setStatus(AnalysisStatus status) { this.status = status; }

    public String getNormalizedUrl() { return normalizedUrl; }
    public void setNormalizedUrl(String normalizedUrl) { this.normalizedUrl = normalizedUrl; }

    public Integer getRiskScore() { return riskScore; }
    public void setRiskScore(Integer riskScore) { this.riskScore = riskScore; }

    public Verdict getVerdict() { return verdict; }
    public void setVerdict(Verdict verdict) { this.verdict = verdict; }

    public Double getConfidence() { return confidence; }
    public void setConfidence(Double confidence) { this.confidence = confidence; }

    public String getModelVersion() { return modelVersion; }
    public void setModelVersion(String modelVersion) { this.modelVersion = modelVersion; }

    public Integer getLatencyMs() { return latencyMs; }
    public void setLatencyMs(Integer latencyMs) { this.latencyMs = latencyMs; }

    public List<IndicatorDto> getIndicators() { return indicators; }
    public void setIndicators(List<IndicatorDto> indicators) { this.indicators = indicators; }

    public String getRecommendedAction() { return recommendedAction; }
    public void setRecommendedAction(String recommendedAction) { this.recommendedAction = recommendedAction; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }

    public Instant getCompletedAt() { return completedAt; }
    public void setCompletedAt(Instant completedAt) { this.completedAt = completedAt; }
}
