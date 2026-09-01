package com.phishshield.exception;

import com.phishshield.dto.ApiErrorDto;
import com.phishshield.dto.FieldErrorDto;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ApiErrorDto> handleResourceNotFound(ResourceNotFoundException ex) {
        String traceId = "trace-" + UUID.randomUUID().toString().substring(0, 8);
        ApiErrorDto error = new ApiErrorDto(HttpStatus.NOT_FOUND.value(), "RESOURCE_NOT_FOUND", ex.getMessage(), traceId);
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
    }

    @ExceptionHandler(InvalidRequestException.class)
    public ResponseEntity<ApiErrorDto> handleInvalidRequest(InvalidRequestException ex) {
        String traceId = "trace-" + UUID.randomUUID().toString().substring(0, 8);
        ApiErrorDto error = new ApiErrorDto(HttpStatus.BAD_REQUEST.value(), "INVALID_REQUEST_PAYLOAD", ex.getMessage(), traceId);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiErrorDto> handleValidationErrors(MethodArgumentNotValidException ex) {
        String traceId = "trace-" + UUID.randomUUID().toString().substring(0, 8);
        ApiErrorDto error = new ApiErrorDto(HttpStatus.BAD_REQUEST.value(), "VALIDATION_FAILED", "Request payload failed validation constraints", traceId);

        List<FieldErrorDto> fieldErrors = new ArrayList<>();
        for (FieldError fe : ex.getBindingResult().getFieldErrors()) {
            fieldErrors.add(new FieldErrorDto(fe.getField(), fe.getDefaultMessage()));
        }
        error.setFieldErrors(fieldErrors);

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiErrorDto> handleGeneralException(Exception ex) {
        String traceId = "trace-" + UUID.randomUUID().toString().substring(0, 8);
        logger.error("Unhandled exception [{}]: {}", traceId, ex.getMessage(), ex);
        ApiErrorDto error = new ApiErrorDto(HttpStatus.INTERNAL_SERVER_ERROR.value(), "INTERNAL_SERVER_ERROR", "An unexpected error occurred processing your request.", traceId);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
    }
}
