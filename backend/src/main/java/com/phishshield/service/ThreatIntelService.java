package com.phishshield.service;

import com.phishshield.entity.ThreatFeedEntry;
import com.phishshield.repository.ThreatFeedEntryRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
public class ThreatIntelService {

    private static final Logger logger = LoggerFactory.getLogger(ThreatIntelService.class);

    private final ThreatFeedEntryRepository repository;
    private final UrlNormalizationService normalizationService;

    // Fast in-memory threat cache/blocklist for high-confidence indicators
    private static final Set<String> HIGH_CONFIDENCE_PHISHING_DOMAINS = Set.of(
            "paypa1-security-verification.com",
            "secure-update-paypal.com.account-verify.tk",
            "login-steamcommunity.com.trade-offer.ga",
            "metamask-io-wallet-validation.xyz",
            "irs-tax-refund-gov-online.net"
    );

    public ThreatIntelService(ThreatFeedEntryRepository repository, UrlNormalizationService normalizationService) {
        this.repository = repository;
        this.normalizationService = normalizationService;
    }

    public Optional<ThreatFeedEntry> checkThreatFeed(String normalizedUrl) {
        try {
            URI uri = URI.create(normalizedUrl);
            String host = uri.getHost() != null ? uri.getHost().toLowerCase() : "";

            if (HIGH_CONFIDENCE_PHISHING_DOMAINS.contains(host)) {
                return Optional.of(new ThreatFeedEntry("DOMAIN", host, "PHISHING_CREDENTIAL_HARVESTER", "ACTIVE_THREAT_FEED"));
            }

            // Check database threat feed by domain
            if (!host.isEmpty()) {
                Optional<ThreatFeedEntry> domainMatch = repository.findByIndicatorTypeAndIndicatorValue("DOMAIN", host);
                if (domainMatch.isPresent()) {
                    return domainMatch;
                }
            }

            // Check database threat feed by SHA-256 URL hash
            String sha256 = normalizationService.computeSha256(normalizedUrl);
            return repository.findByIndicatorTypeAndIndicatorValue("URL_HASH", sha256);

        } catch (Exception e) {
            logger.warn("Threat feed check encountered error for '{}': {}", normalizedUrl, e.getMessage());
            return Optional.empty();
        }
    }
}
