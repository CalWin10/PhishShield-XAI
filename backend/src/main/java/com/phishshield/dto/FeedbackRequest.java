package com.phishshield.dto;

import jakarta.validation.constraints.NotBlank;

public class FeedbackRequest {

    @NotBlank(message = "Actual label must not be blank")
    private String actualLabel;

    private String comment;

    public FeedbackRequest() {}

    public String getActualLabel() { return actualLabel; }
    public void setActualLabel(String actualLabel) { this.actualLabel = actualLabel; }

    public String getComment() { return comment; }
    public void setComment(String comment) { this.comment = comment; }
}
