package com.phishshield.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.net.IDN;
import java.net.URI;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Arrays;
import java.util.HexFormat;
import java.util.stream.Collectors;

@Service
public class UrlNormalizationService {

    private static final Logger logger = LoggerFactory.getLogger(UrlNormalizationService.class);

    public String normalize(String rawUrl) {
        if (rawUrl == null || rawUrl.trim().isEmpty()) {
            throw new IllegalArgumentException("URL cannot be null or empty");
        }

        String input = rawUrl.trim();

        // If no scheme present, prefix with http://
        if (!input.matches("^[a-zA-Z][a-zA-Z0-9+.-]*://.*")) {
            input = "http://" + input;
        }

        try {
            URI uri = URI.create(input);
            String scheme = uri.getScheme() != null ? uri.getScheme().toLowerCase() : "http";
            String host = uri.getHost();

            if (host == null) {
                // Try simple host extraction if URI parsing failed
                String noScheme = input.substring(input.indexOf("://") + 3);
                int slashIdx = noScheme.indexOf('/');
                host = slashIdx != -1 ? noScheme.substring(0, slashIdx) : noScheme;
            }

            // Convert to punycode for internationalized domain names (IDN)
            String asciiHost = IDN.toASCII(host.toLowerCase());

            int port = uri.getPort();
            String portPart = "";
            if (port != -1 && !((scheme.equals("http") && port == 80) || (scheme.equals("https") && port == 443))) {
                portPart = ":" + port;
            }

            String path = uri.getRawPath();
            if (path == null || path.isEmpty()) {
                path = "/";
            }

            String query = uri.getRawQuery();
            String queryPart = "";
            if (query != null && !query.isEmpty()) {
                // Sort query parameters for canonical representation
                String sortedQuery = Arrays.stream(query.split("&"))
                        .filter(s -> !s.isEmpty())
                        .sorted()
                        .collect(Collectors.joining("&"));
                if (!sortedQuery.isEmpty()) {
                    queryPart = "?" + sortedQuery;
                }
            }

            return scheme + "://" + asciiHost + portPart + path + queryPart;
        } catch (Exception e) {
            logger.warn("Failed standard URI normalization for '{}', applying fallback string sanitization: {}", rawUrl, e.getMessage());
            return input.toLowerCase();
        }
    }

    public String computeSha256(String input) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(input.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(hash);
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("SHA-256 algorithm not available", e);
        }
    }

    public String buildRedisCacheKey(String normalizedUrl) {
        return "phish:url:" + computeSha256(normalizedUrl);
    }
}
