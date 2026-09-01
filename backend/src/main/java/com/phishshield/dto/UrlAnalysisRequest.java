package com.phishshield.dto;

import com.phishshield.enums.ScanMode;
import jakarta.validation.constraints.NotBlank;

public class UrlAnalysisRequest {

    @NotBlank(message = "URL must not be blank")
    private String url;

    private ScanMode mode = ScanMode.QUICK;

    public UrlAnalysisRequest() {}

    public UrlAnalysisRequest(String url, ScanMode mode) {
        this.url = url;
        this.mode = mode != null ? mode : ScanMode.QUICK;
    }

    public String getUrl() { return url; }
    public void setUrl(String url) { this.url = url; }

    public ScanMode getMode() { return mode; }
    public void setMode(ScanMode mode) { this.mode = mode; }
}
