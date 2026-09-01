package com.phishshield;

import com.phishshield.service.UrlNormalizationService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

public class UrlNormalizationTest {

    private UrlNormalizationService service;

    @BeforeEach
    void setUp() {
        service = new UrlNormalizationService();
    }

    @Test
    void testSchemeAndHostLowercasing() {
        String normalized = service.normalize("HTTP://EXAMPLE.COM/Path");
        assertTrue(normalized.startsWith("http://example.com/Path"));
    }

    @Test
    void testSchemeDefaulting() {
        String normalized = service.normalize("example.com/login");
        assertTrue(normalized.startsWith("http://example.com/login"));
    }

    @Test
    void testQueryParamSorting() {
        String url1 = service.normalize("https://example.com/search?b=2&a=1");
        String url2 = service.normalize("https://example.com/search?a=1&b=2");
        assertEquals(url1, url2);
    }

    @Test
    void testSha256CacheKeyGeneration() {
        String normalized = "http://paypa1-security-verification.com/login";
        String key = service.buildRedisCacheKey(normalized);
        assertNotNull(key);
        assertTrue(key.startsWith("phish:url:"));
        assertEquals(74, key.length()); // "phish:url:" (10) + 64 hex chars
    }
}
