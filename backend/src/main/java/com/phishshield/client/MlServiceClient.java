package com.phishshield.client;

import com.phishshield.dto.MlPredictRequest;
import com.phishshield.dto.MlPredictResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.time.Duration;

@Component
public class MlServiceClient {

    private static final Logger logger = LoggerFactory.getLogger(MlServiceClient.class);

    private final RestTemplate restTemplate;
    private final String mlServiceUrl;

    public MlServiceClient(
            RestTemplateBuilder restTemplateBuilder,
            @Value("${ml.service.url:http://localhost:8001}") String mlServiceUrl,
            @Value("${ml.service.connect-timeout-ms:3000}") int connectTimeout,
            @Value("${ml.service.read-timeout-ms:5000}") int readTimeout
    ) {
        this.mlServiceUrl = mlServiceUrl;
        this.restTemplate = restTemplateBuilder
                .setConnectTimeout(Duration.ofMillis(connectTimeout))
                .setReadTimeout(Duration.ofMillis(readTimeout))
                .build();
    }

    public MlPredictResponse predict(String rawNormalizedUrl) {
        String endpoint = mlServiceUrl + "/internal/v1/predict/url";
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<MlPredictRequest> request = new HttpEntity<>(new MlPredictRequest(rawNormalizedUrl), headers);

        try {
            logger.debug("Calling ML service at {} for URL: {}", endpoint, rawNormalizedUrl);
            ResponseEntity<MlPredictResponse> response = restTemplate.postForEntity(endpoint, request, MlPredictResponse.class);
            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                return response.getBody();
            }
        } catch (Exception e) {
            logger.warn("ML Service call failed for URL {}: {}. Using graceful fallback estimate.", rawNormalizedUrl, e.getMessage());
        }

        // Safe graceful fallback
        MlPredictResponse fallback = new MlPredictResponse();
        fallback.setPhishingProbability(0.50);
        fallback.setPredictedLabel("UNCERTAIN");
        fallback.setModelVersion("pirocheto/phishing-url-detection:model.onnx@fallback");
        fallback.setModelType("LinearSVM-Fallback");
        fallback.setThreshold(0.50);
        return fallback;
    }
}
