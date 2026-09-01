package com.phishshield.messaging;

import com.phishshield.config.RabbitConfig;
import com.phishshield.service.DeepScanService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Component
public class DeepScanConsumer {

    private static final Logger logger = LoggerFactory.getLogger(DeepScanConsumer.class);

    private final DeepScanService deepScanService;

    public DeepScanConsumer(DeepScanService deepScanService) {
        this.deepScanService = deepScanService;
    }

    @RabbitListener(queues = RabbitConfig.DEEP_SCAN_RESULTS_QUEUE)
    public void receiveDeepScanResult(DeepScanResultMessage result) {
        try {
            logger.info("Received Deep Scan enrichment result for Analysis ID: {}", result.getAnalysisId());
            deepScanService.processDeepScanResult(result);
        } catch (Exception e) {
            logger.error("Error processing Deep Scan result message: {}", e.getMessage(), e);
        }
    }
}
