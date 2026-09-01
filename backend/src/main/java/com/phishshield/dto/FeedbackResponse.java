package com.phishshield.dto;

import java.time.Instant;
import java.util.UUID;

public class FeedbackResponse {

    private UUID feedbackId;
    private UUID analysisId;
    private String actualLabel;
    private String comment;
    private Instant submittedAt;

    public FeedbackResponse() {}

    public FeedbackResponse(UUID feedbackId, UUID analysisId, String actualLabel, String comment, Instant submittedAt) {
        this.feedbackId = feedbackId;
        this.analysisId = analysisId;
        this.actualLabel = actualLabel;
        this.comment = comment;
        this.submittedAt = submittedAt;
    }

    public UUID getFeedbackId() { return feedbackId; }
    public void setFeedbackId(UUID feedbackId) { this.feedbackId = feedbackId; }

    public UUID getAnalysisId() { return analysisId; }
    public void setAnalysisId(UUID analysisId) { this.analysisId = analysisId; }

    public String getActualLabel() { return actualLabel; }
    public void setActualLabel(String actualLabel) { this.actualLabel = actualLabel; }

    public String getComment() { return comment; }
    public void setComment(String comment) { this.comment = comment; }

    public Instant getSubmittedAt() { return submittedAt; }
    public void setSubmittedAt(Instant submittedAt) { this.submittedAt = submittedAt; }
}
