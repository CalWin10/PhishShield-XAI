package com.phishshield.dto;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

public class ApiErrorDto {

    private Instant timestamp;
    private int status;
    private String code;
    private String message;
    private List<FieldErrorDto> fieldErrors = new ArrayList<>();
    private String traceId;

    public ApiErrorDto() {
        this.timestamp = Instant.now();
    }

    public ApiErrorDto(int status, String code, String message, String traceId) {
        this.timestamp = Instant.now();
        this.status = status;
        this.code = code;
        this.message = message;
        this.traceId = traceId;
    }

    public Instant getTimestamp() { return timestamp; }
    public void setTimestamp(Instant timestamp) { this.timestamp = timestamp; }

    public int getStatus() { return status; }
    public void setStatus(int status) { this.status = status; }

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public List<FieldErrorDto> getFieldErrors() { return fieldErrors; }
    public void setFieldErrors(List<FieldErrorDto> fieldErrors) { this.fieldErrors = fieldErrors; }

    public String getTraceId() { return traceId; }
    public void setTraceId(String traceId) { this.traceId = traceId; }
}
