package com.phishshield.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.phishshield.enums.IndicatorCategory;
import com.phishshield.enums.IndicatorSeverity;
import jakarta.persistence.*;
import java.util.UUID;

@Entity
@Table(name = "indicators")
public class Indicator {

    @Id
    @Column(columnDefinition = "UUID")
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "analysis_id", nullable = false)
    @JsonIgnore
    private Analysis analysis;

    @Column(name = "code", nullable = false)
    private String code;

    @Enumerated(EnumType.STRING)
    @Column(name = "category", nullable = false)
    private IndicatorCategory category;

    @Enumerated(EnumType.STRING)
    @Column(name = "severity", nullable = false)
    private IndicatorSeverity severity;

    @Column(name = "contribution", nullable = false)
    private Double contribution;

    @Column(name = "evidence", columnDefinition = "TEXT", nullable = false)
    private String evidence;

    public Indicator() {
        this.id = UUID.randomUUID();
    }

    public Indicator(String code, IndicatorCategory category, IndicatorSeverity severity, Double contribution, String evidence) {
        this.id = UUID.randomUUID();
        this.code = code;
        this.category = category;
        this.severity = severity;
        this.contribution = contribution;
        this.evidence = evidence;
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public Analysis getAnalysis() { return analysis; }
    public void setAnalysis(Analysis analysis) { this.analysis = analysis; }

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
