package com.phishshield;

import com.phishshield.enums.Verdict;
import com.phishshield.service.RiskFusionService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

public class RiskFusionBoundaryTest {

    private RiskFusionService riskFusionService;

    @BeforeEach
    void setUp() {
        riskFusionService = new RiskFusionService();
    }

    @Test
    void testLowRiskBoundary() {
        // Score 29 should be LOW_RISK
        assertEquals(Verdict.LOW_RISK, riskFusionService.calculateVerdict(0));
        assertEquals(Verdict.LOW_RISK, riskFusionService.calculateVerdict(29));
    }

    @Test
    void testSuspiciousBoundary() {
        // Score 30 should be SUSPICIOUS, Score 59 should be SUSPICIOUS
        assertEquals(Verdict.SUSPICIOUS, riskFusionService.calculateVerdict(30));
        assertEquals(Verdict.SUSPICIOUS, riskFusionService.calculateVerdict(59));
    }

    @Test
    void testHighRiskBoundary() {
        // Score 60 should be HIGH_RISK, Score 79 should be HIGH_RISK
        assertEquals(Verdict.HIGH_RISK, riskFusionService.calculateVerdict(60));
        assertEquals(Verdict.HIGH_RISK, riskFusionService.calculateVerdict(79));
    }

    @Test
    void testCriticalBoundary() {
        // Score 80 should be CRITICAL, Score 100 should be CRITICAL
        assertEquals(Verdict.CRITICAL, riskFusionService.calculateVerdict(80));
        assertEquals(Verdict.CRITICAL, riskFusionService.calculateVerdict(100));
    }

    @Test
    void testUrlRiskFormulaExact() {
        // ML prob 0.80 -> 80 * 0.70 = 56. Rule score 40 -> 40 * 0.30 = 12. Total = 68 -> HIGH_RISK
        var result = riskFusionService.combineUrl(0.80, 40.0, false);
        assertEquals(68, result.getRiskScore());
        assertEquals(Verdict.HIGH_RISK, result.getVerdict());
    }

    @Test
    void testEmailRiskFormulaExact() {
        // ML: 80 (55% = 44), URL Rule: 40 (25% = 10), Email Rule: 50 (20% = 10). Total = 64 -> HIGH_RISK
        var result = riskFusionService.combineEmail(80.0, 40.0, 50.0, false);
        assertEquals(64, result.getRiskScore());
        assertEquals(Verdict.HIGH_RISK, result.getVerdict());
    }

    @Test
    void testThreatFeedOverride() {
        // Threat feed match hard-overrides to CRITICAL with >=95 score
        var result = riskFusionService.combineUrl(0.10, 0.0, true);
        assertEquals(Verdict.CRITICAL, result.getVerdict());
        assertTrue(result.getRiskScore() >= 95);
    }
}
