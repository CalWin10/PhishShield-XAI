package com.phishshield.dto;

public class MlPredictResponse {
    private Double phishingProbability;
    private String predictedLabel;
    private String modelVersion;
    private String modelType;
    private Double threshold;

    public MlPredictResponse() {}

    public Double getPhishingProbability() { return phishingProbability; }
    public void setPhishingProbability(Double phishingProbability) { this.phishingProbability = phishingProbability; }

    public String getPredictedLabel() { return predictedLabel; }
    public void setPredictedLabel(String predictedLabel) { this.predictedLabel = predictedLabel; }

    public String getModelVersion() { return modelVersion; }
    public void setModelVersion(String modelVersion) { this.modelVersion = modelVersion; }

    public String getModelType() { return modelType; }
    public void setModelType(String modelType) { this.modelType = modelType; }

    public Double getThreshold() { return threshold; }
    public void setThreshold(Double threshold) { this.threshold = threshold; }
}
