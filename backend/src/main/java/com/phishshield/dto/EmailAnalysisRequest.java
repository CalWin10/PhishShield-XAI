package com.phishshield.dto;

import com.phishshield.enums.ScanMode;
import jakarta.validation.constraints.NotBlank;

public class EmailAnalysisRequest {

    private String from;
    private String replyTo;
    private String subject;

    @NotBlank(message = "Email body must not be blank")
    private String body;

    private ScanMode mode = ScanMode.QUICK;

    public EmailAnalysisRequest() {}

    public String getFrom() { return from; }
    public void setFrom(String from) { this.from = from; }

    public String getReplyTo() { return replyTo; }
    public void setReplyTo(String replyTo) { this.replyTo = replyTo; }

    public String getSubject() { return subject; }
    public void setSubject(String subject) { this.subject = subject; }

    public String getBody() { return body; }
    public void setBody(String body) { this.body = body; }

    public ScanMode getMode() { return mode; }
    public void setMode(ScanMode mode) { this.mode = mode != null ? mode : ScanMode.QUICK; }
}
