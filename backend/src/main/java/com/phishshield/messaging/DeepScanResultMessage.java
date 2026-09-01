package com.phishshield.messaging;

import com.phishshield.dto.IndicatorDto;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

public class DeepScanResultMessage implements Serializable {

    private UUID analysisId;
    private String status; // COMPLETE, FAILED
    private String finalDestinationUrl;
    private int redirectHops;
    private boolean ssrfBlocked;
    private List<IndicatorDto> enrichedIndicators = new ArrayList<>();
    private String errorMessage;

    public DeepScanResultMessage() {}

    public UUID getAnalysisId() { return analysisId; }
    public void setAnalysisId(UUID analysisId) { this.analysisId = analysisId; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getFinalDestinationUrl() { return finalDestinationUrl; }
    public void setFinalDestinationUrl(String finalDestinationUrl) { this.finalDestinationUrl = finalDestinationUrl; }

    public int getRedirectHops() { return redirectHops; }
    public void setRedirectHops(int redirectHops) { this.redirectHops = redirectHops; }

    public boolean isSsrfBlocked() { return ssrfBlocked; }
    public void setSsrfBlocked(boolean ssrfBlocked) { this.ssrfBlocked = ssrfBlocked; }

    public List<IndicatorDto> getEnrichedIndicators() { return enrichedIndicators; }
    public void setEnrichedIndicators(List<IndicatorDto> enrichedIndicators) { this.enrichedIndicators = enrichedIndicators; }

    public String getErrorMessage() { return errorMessage; }
    public void setErrorMessage(String errorMessage) { this.errorMessage = errorMessage; }
}
