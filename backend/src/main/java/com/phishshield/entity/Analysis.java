package com.phishshield.entity;

import com.phishshield.enums.AnalysisStatus;
import com.phishshield.enums.InputType;
import com.phishshield.enums.ScanMode;
import com.phishshield.enums.Verdict;
import jakarta.persistence.*;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "analyses")
public class Analysis {

    @Id
    @Column(columnDefinition = "UUID")
    private UUID id;

    @Enumerated(EnumType.STRING)
    @Column(name = "input_type", nullable = false)
    private InputType inputType;

    @Enumerated(EnumType.STRING)
    @Column(name = "mode", nullable = false)
    private ScanMode mode;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private AnalysisStatus status;

    @Column(name = "normalized_url", columnDefinition = "TEXT")
    private String normalizedUrl;

    @Column(name = "risk_score", nullable = false)
    private Integer riskScore;

    @Enumerated(EnumType.STRING)
    @Column(name = "verdict", nullable = false)
    private Verdict verdict;

    @Column(name = "confidence", nullable = false)
    private Double confidence;

    @Column(name = "model_version", nullable = false)
    private String modelVersion;

    @Column(name = "latency_ms")
    private Integer latencyMs;

    @Column(name = "recommended_action", nullable = false)
    private String recommendedAction;

    @Column(name = "raw_input", columnDefinition = "TEXT")
    private String rawInput;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    @Column(name = "completed_at")
    private Instant completedAt;

    @OneToMany(mappedBy = "analysis", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    private List<Indicator> indicators = new ArrayList<>();

    public Analysis() {
        this.id = UUID.randomUUID();
        this.createdAt = Instant.now();
    }

    public void addIndicator(Indicator indicator) {
        indicators.add(indicator);
        indicator.setAnalysis(this);
    }

    // Getters and Setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

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

    public String getRecommendedAction() { return recommendedAction; }
    public void setRecommendedAction(String recommendedAction) { this.recommendedAction = recommendedAction; }

    public String getRawInput() { return rawInput; }
    public void setRawInput(String rawInput) { this.rawInput = rawInput; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }

    public Instant getCompletedAt() { return completedAt; }
    public void setCompletedAt(Instant completedAt) { this.completedAt = completedAt; }

    public List<Indicator> getIndicators() { return indicators; }
    public void setIndicators(List<Indicator> indicators) { this.indicators = indicators; }
}
