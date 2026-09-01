package com.phishshield.entity;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "feedback")
public class Feedback {

    @Id
    @Column(columnDefinition = "UUID")
    private UUID id;

    @Column(name = "analysis_id", nullable = false)
    private UUID analysisId;

    @Column(name = "actual_label", nullable = false)
    private String actualLabel;

    @Column(name = "comment", columnDefinition = "TEXT")
    private String comment;

    @Column(name = "submitted_at", nullable = false)
    private Instant submittedAt;

    public Feedback() {
        this.id = UUID.randomUUID();
        this.submittedAt = Instant.now();
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public UUID getAnalysisId() { return analysisId; }
    public void setAnalysisId(UUID analysisId) { this.analysisId = analysisId; }

    public String getActualLabel() { return actualLabel; }
    public void setActualLabel(String actualLabel) { this.actualLabel = actualLabel; }

    public String getComment() { return comment; }
    public void setComment(String comment) { this.comment = comment; }

    public Instant getSubmittedAt() { return submittedAt; }
    public void setSubmittedAt(Instant submittedAt) { this.submittedAt = submittedAt; }
}
