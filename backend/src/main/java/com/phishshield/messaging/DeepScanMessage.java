package com.phishshield.messaging;

import java.io.Serializable;
import java.util.UUID;

public class DeepScanMessage implements Serializable {

    private UUID analysisId;
    private String targetUrl;
    private double preliminaryMlProbability;
    private String modelVersion;

    public DeepScanMessage() {}

    public DeepScanMessage(UUID analysisId, String targetUrl, double preliminaryMlProbability, String modelVersion) {
        this.analysisId = analysisId;
        this.targetUrl = targetUrl;
        this.preliminaryMlProbability = preliminaryMlProbability;
        this.modelVersion = modelVersion;
    }

    public UUID getAnalysisId() { return analysisId; }
    public void setAnalysisId(UUID analysisId) { this.analysisId = analysisId; }

    public String getTargetUrl() { return targetUrl; }
    public void setTargetUrl(String targetUrl) { this.targetUrl = targetUrl; }

    public double getPreliminaryMlProbability() { return preliminaryMlProbability; }
    public void setPreliminaryMlProbability(double preliminaryMlProbability) { this.preliminaryMlProbability = preliminaryMlProbability; }

    public String getModelVersion() { return modelVersion; }
    public void setModelVersion(String modelVersion) { this.modelVersion = modelVersion; }
}
