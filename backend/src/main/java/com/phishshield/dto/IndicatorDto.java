package com.phishshield.dto;

import com.phishshield.enums.IndicatorCategory;
import com.phishshield.enums.IndicatorSeverity;

public class IndicatorDto {

    private String code;
    private IndicatorCategory category;
    private IndicatorSeverity severity;
    private Double contribution;
    private String evidence;

    public IndicatorDto() {}

    public IndicatorDto(String code, IndicatorCategory category, IndicatorSeverity severity, Double contribution, String evidence) {
        this.code = code;
        this.category = category;
        this.severity = severity;
        this.contribution = contribution;
        this.evidence = evidence;
    }

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }

    public IndicatorCategory getCategory() { return category; }
    public void setCategory(IndicatorCategory category) { this.category = category; }

    public IndicatorSeverity getSeverity() { return severity; }
    public void setSeverity(IndicatorSeverity severity) { this.severity = severity; }

    public Double getContribution() { return contribution; }
    public void setContribution(Double contribution) { this.contribution = contribution; }

    public String getEvidence() { return evidence; }
    public void setEvidence(String evidence) { this.evidence = evidence; }
}
