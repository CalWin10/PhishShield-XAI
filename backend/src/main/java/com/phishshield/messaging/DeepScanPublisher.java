package com.phishshield.messaging;

import com.phishshield.config.RabbitConfig;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Component;

@Component
public class DeepScanPublisher {

    private static final Logger logger = LoggerFactory.getLogger(DeepScanPublisher.class);

    private final RabbitTemplate rabbitTemplate;

    public DeepScanPublisher(RabbitTemplate rabbitTemplate) {
        this.rabbitTemplate = rabbitTemplate;
    }

    public void publishDeepScanJob(DeepScanMessage message) {
        try {
            logger.info("Publishing Deep Scan job for Analysis ID: {}", message.getAnalysisId());
            rabbitTemplate.convertAndSend(RabbitConfig.EXCHANGE_NAME, RabbitConfig.DEEP_SCAN_ROUTING_KEY, message);
        } catch (Exception e) {
            logger.error("Failed to publish Deep Scan message for analysis {}: {}", message.getAnalysisId(), e.getMessage());
        }
    }
}
