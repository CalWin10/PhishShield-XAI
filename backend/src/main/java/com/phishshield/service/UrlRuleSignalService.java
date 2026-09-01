package com.phishshield.service;

import com.phishshield.dto.IndicatorDto;
import com.phishshield.enums.IndicatorCategory;
import com.phishshield.enums.IndicatorSeverity;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.util.*;
import java.util.regex.Pattern;

@Service
public class UrlRuleSignalService {

    private static final Pattern IP_PATTERN = Pattern.compile("^\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}$");

    private static final Set<String> SUSPICIOUS_TLDS = Set.of(
            "tk", "xyz", "top", "cf", "gq", "ml", "cc", "site", "vip", "space", "club", "work", "ga"
    );

    private static final List<String> HIGH_VALUE_BRANDS = List.of(
            "paypal", "google", "microsoft", "amazon", "apple", "netflix", "facebook", "instagram", "chase", "wellsfargo", "bankofamerica", "coinbase", "binance", "metamask", "dropbox", "dhl", "fedex", "usps"
    );

    private static final List<String> SENSITIVE_PATH_KEYWORDS = List.of(
            "login", "signin", "verify", "verification", "account", "update", "banking", "recovery", "password", "reset", "auth", "token", "kyc", "claim", "billing"
    );

    private static final Set<String> ESTABLISHED_DOMAINS = Set.of(
            "google.com", "github.com", "wikipedia.org", "microsoft.com", "amazon.com", "apple.com", "nytimes.com", "mozilla.org", "netflix.com", "linkedin.com", "reddit.com", "paypal.com", "chase.com", "wellsfargo.com", "dropbox.com", "slack.com", "cloudflare.com", "cnn.com", "bbc.com", "gitlab.com", "bitbucket.org", "duckduckgo.com", "medium.com", "stackoverflow.com"
    );

    public List<IndicatorDto> extractUrlSignals(String normalizedUrl) {
        List<IndicatorDto> indicators = new ArrayList<>();

        try {
            URI uri = URI.create(normalizedUrl);
            String scheme = uri.getScheme() != null ? uri.getScheme().toLowerCase() : "http";
            String host = uri.getHost() != null ? uri.getHost().toLowerCase() : "";
            String path = uri.getPath() != null ? uri.getPath().toLowerCase() : "";
            int port = uri.getPort();

            // 1. Established Domain Check
            String registeredDomain = extractRegisteredDomain(host);
            if (ESTABLISHED_DOMAINS.contains(registeredDomain) || ESTABLISHED_DOMAINS.contains(host)) {
                indicators.add(new IndicatorDto(
                        "DOMAIN_ESTABLISHED_REPUTATION",
                        IndicatorCategory.DOMAIN,
                        IndicatorSeverity.INFO,
                        -30.0,
                        "Target domain '" + registeredDomain + "' is a verified high-reputation domain"
                ));
            }

            // 2. IP Host Check
            if (IP_PATTERN.matcher(host).matches()) {
                indicators.add(new IndicatorDto(
                        "RULE_IP_HOST",
                        IndicatorCategory.URL,
                        IndicatorSeverity.HIGH,
                        25.0,
                        "Target URL uses raw numerical IP address '" + host + "' instead of a registered domain name"
                ));
            }

            // 3. Excessive Subdomains Check
            String[] hostParts = host.split("\\.");
            if (hostParts.length >= 4 && !IP_PATTERN.matcher(host).matches()) {
                indicators.add(new IndicatorDto(
                        "RULE_EXCESSIVE_SUBDOMAINS",
                        IndicatorCategory.DOMAIN,
                        IndicatorSeverity.MEDIUM,
                        15.0,
                        "Domain contains " + hostParts.length + " hierarchical subdomain levels, often used to conceal target infrastructure"
                ));
            }

            // 4. Brand Typosquatting / Homoglyph Check
            if (!ESTABLISHED_DOMAINS.contains(registeredDomain)) {
                for (String brand : HIGH_VALUE_BRANDS) {
                    if (isBrandImpersonation(host, brand)) {
                        indicators.add(new IndicatorDto(
                                "DOMAIN_TYPOSQUATTING",
                                IndicatorCategory.DOMAIN,
                                IndicatorSeverity.HIGH,
                                30.0,
                                "Domain '" + host + "' mimics targeted high-value brand '" + brand + "'"
                        ));
                        break;
                    }
                }
            }

            // 5. Suspicious TLD Check
            String tld = extractTld(host);
            if (SUSPICIOUS_TLDS.contains(tld)) {
                indicators.add(new IndicatorDto(
                        "DOMAIN_SUSPICIOUS_TLD",
                        IndicatorCategory.DOMAIN,
                        IndicatorSeverity.MEDIUM,
                        20.0,
                        "Domain uses high-abuse top-level domain '." + tld + "'"
                ));
            }

            // 6. Sensitive Path Keywords Check
            for (String keyword : SENSITIVE_PATH_KEYWORDS) {
                if (path.contains("/" + keyword) || path.contains("-" + keyword) || path.contains(keyword + ".php") || path.contains(keyword + ".html")) {
                    indicators.add(new IndicatorDto(
                            "PATH_CREDENTIAL_KEYWORD",
                            IndicatorCategory.URL,
                            IndicatorSeverity.MEDIUM,
                            15.0,
                            "URL path contains high-risk authentication/credential keyword '" + keyword + "'"
                    ));
                    break;
                }
            }

            // 7. Abnormal Domain Structure (multiple hyphens)
            long hyphenCount = host.chars().filter(ch -> ch == '-').count();
            if (hyphenCount >= 2) {
                indicators.add(new IndicatorDto(
                        "DOMAIN_ABNORMAL_STRUCTURE",
                        IndicatorCategory.DOMAIN,
                        IndicatorSeverity.LOW,
                        12.0,
                        "Domain contains " + hyphenCount + " hyphens, characteristic of deceptive domain generation algorithms (DGAs)"
                ));
            }

            // 8. Insecure Plain HTTP Scheme
            if ("http".equalsIgnoreCase(scheme)) {
                indicators.add(new IndicatorDto(
                        "TLS_INSECURE_SCHEME",
                        IndicatorCategory.TLS,
                        IndicatorSeverity.MEDIUM,
                        10.0,
                        "URL uses unencrypted plain HTTP transport without TLS certificate protection"
                ));
            }

            // 9. Non-Standard Port
            if (port != -1 && port != 80 && port != 443 && port != 8080) {
                indicators.add(new IndicatorDto(
                        "URL_NON_STANDARD_PORT",
                        IndicatorCategory.URL,
                        IndicatorSeverity.MEDIUM,
                        15.0,
                        "Target URL runs on anomalous non-standard port :" + port
                ));
            }

        } catch (Exception ignored) {}

        return indicators;
    }

    private boolean isBrandImpersonation(String host, String brand) {
        String normalizedHost = host.replace("1", "l").replace("0", "o").replace("-", "");
        if (normalizedHost.contains(brand)) {
            return !host.endsWith("." + brand + ".com") && !host.equals(brand + ".com");
        }
        return false;
    }

    private String extractTld(String host) {
        int idx = host.lastIndexOf('.');
        return idx != -1 && idx < host.length() - 1 ? host.substring(idx + 1).toLowerCase() : "";
    }

    private String extractRegisteredDomain(String host) {
        String[] parts = host.split("\\.");
        if (parts.length >= 2) {
            return parts[parts.length - 2] + "." + parts[parts.length - 1];
        }
        return host;
    }
}
