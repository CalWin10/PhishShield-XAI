package com.phishshield.dto;

public class MlPredictRequest {
    private String url;

    public MlPredictRequest() {}

    public MlPredictRequest(String url) {
        this.url = url;
    }

    public String getUrl() { return url; }
    public void setUrl(String url) { this.url = url; }
}
