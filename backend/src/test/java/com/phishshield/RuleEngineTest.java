package com.phishshield;

import com.phishshield.dto.IndicatorDto;
import com.phishshield.enums.IndicatorCategory;
import com.phishshield.service.RuleEngineService;
import com.phishshield.service.UrlRuleSignalService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

public class RuleEngineTest {

    private RuleEngineService ruleEngineService;
    private UrlRuleSignalService urlRuleSignalService;

    @BeforeEach
    void setUp() {
        urlRuleSignalService = new UrlRuleSignalService();
        ruleEngineService = new RuleEngineService(urlRuleSignalService);
    }

    @Test
    void testIpHostIndicatorTrigger() {
        String url = "http://192.168.1.100/admin";
        var result = ruleEngineService.evaluateUrl(url);
        boolean hasIpHost = result.getIndicators().stream().anyMatch(i -> "RULE_IP_HOST".equals(i.getCode()));
        assertTrue(hasIpHost, "Should detect IP host indicator");
    }

    @Test
    void testExcessiveSubdomainsIndicatorTrigger() {
        String url = "http://a.b.c.d.evil-domain.com/login";
        var result = ruleEngineService.evaluateUrl(url);
        boolean hasSubdomains = result.getIndicators().stream().anyMatch(i -> "RULE_EXCESSIVE_SUBDOMAINS".equals(i.getCode()));
        assertTrue(hasSubdomains, "Should detect excessive subdomains");
    }

    @Test
    void testBrandTyposquattingIndicatorTrigger() {
        String url = "http://paypa1-security-verification.com/login";
        var result = ruleEngineService.evaluateUrl(url);
        boolean hasTyposquatting = result.getIndicators().stream().anyMatch(i -> "DOMAIN_TYPOSQUATTING".equals(i.getCode()));
        assertTrue(hasTyposquatting, "Should detect brand typosquatting (paypa1)");
    }

    @Test
    void testSuspiciousTldIndicatorTrigger() {
        String url = "http://verify-account.tk/login";
        var result = ruleEngineService.evaluateUrl(url);
        boolean hasSuspiciousTld = result.getIndicators().stream().anyMatch(i -> "DOMAIN_SUSPICIOUS_TLD".equals(i.getCode()));
        assertTrue(hasSuspiciousTld, "Should detect suspicious TLD .tk");
    }

    @Test
    void testPathCredentialKeywordIndicatorTrigger() {
        String url = "http://randomdomain.org/login/verify.php";
        var result = ruleEngineService.evaluateUrl(url);
        boolean hasKeyword = result.getIndicators().stream().anyMatch(i -> "PATH_CREDENTIAL_KEYWORD".equals(i.getCode()));
        assertTrue(hasKeyword, "Should detect credential keyword in path");
    }

    @Test
    void testInsecureSchemeIndicatorTrigger() {
        String url = "http://insecure-site.org/";
        var result = ruleEngineService.evaluateUrl(url);
        boolean hasInsecureScheme = result.getIndicators().stream().anyMatch(i -> "TLS_INSECURE_SCHEME".equals(i.getCode()));
        assertTrue(hasInsecureScheme, "Should detect plain HTTP insecure scheme");
    }

    @Test
    void testNonStandardPortIndicatorTrigger() {
        String url = "http://custom-server.org:8443/auth";
        var result = ruleEngineService.evaluateUrl(url);
        boolean hasPort = result.getIndicators().stream().anyMatch(i -> "URL_NON_STANDARD_PORT".equals(i.getCode()));
        assertTrue(hasPort, "Should detect non-standard port 8443");
    }

    @Test
    void testEstablishedDomainReputationTrigger() {
        String url = "https://www.google.com/search";
        var result = ruleEngineService.evaluateUrl(url);
        boolean hasReputation = result.getIndicators().stream().anyMatch(i -> "DOMAIN_ESTABLISHED_REPUTATION".equals(i.getCode()));
        assertTrue(hasReputation, "Should award trust discount for established domain");
    }

    @Test
    void testEmailHeaderMismatchTrigger() {
        String from = "security@service-paypa1.com";
        String replyTo = "attacker@dropmail.com";
        String subject = "Urgent action required";
        String body = "Please log in.";

        var result = ruleEngineService.evaluateEmail(from, replyTo, subject, body);
        boolean hasMismatch = result.getIndicators().stream().anyMatch(i -> "EMAIL_HEADER_MISMATCH".equals(i.getCode()));
        assertTrue(hasMismatch, "Should detect sender vs reply-to header mismatch");
    }

    @Test
    void testEmailUrgencyKeywordTrigger() {
        String from = "support@service.com";
        String replyTo = "support@service.com";
        String subject = "Account suspended - 24 hours left";
        String body = "Your account is compromised. Immediate action is required.";

        var result = ruleEngineService.evaluateEmail(from, replyTo, subject, body);
        boolean hasUrgency = result.getIndicators().stream().anyMatch(i -> "EMAIL_URGENCY_KEYWORDS".equals(i.getCode()));
        assertTrue(hasUrgency, "Should detect urgency and fear coercion keywords");
    }
}
