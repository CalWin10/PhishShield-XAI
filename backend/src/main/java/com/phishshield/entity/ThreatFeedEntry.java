package com.phishshield.entity;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "threat_feed_entries")
public class ThreatFeedEntry {

    @Id
    @Column(columnDefinition = "UUID")
    private UUID id;

    @Column(name = "indicator_type", nullable = false)
    private String indicatorType; // DOMAIN, IP, URL_HASH

    @Column(name = "indicator_value", nullable = false, length = 512)
    private String indicatorValue;

    @Column(name = "threat_type", nullable = false)
    private String threatType;

    @Column(name = "source", nullable = false)
    private String source;

    @Column(name = "added_at", nullable = false)
    private Instant addedAt;

    public ThreatFeedEntry() {
        this.id = UUID.randomUUID();
        this.addedAt = Instant.now();
    }

    public ThreatFeedEntry(String indicatorType, String indicatorValue, String threatType, String source) {
        this.id = UUID.randomUUID();
        this.indicatorType = indicatorType;
        this.indicatorValue = indicatorValue;
        this.threatType = threatType;
        this.source = source;
        this.addedAt = Instant.now();
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getIndicatorType() { return indicatorType; }
    public void setIndicatorType(String indicatorType) { this.indicatorType = indicatorType; }

    public String getIndicatorValue() { return indicatorValue; }
    public void setIndicatorValue(String indicatorValue) { this.indicatorValue = indicatorValue; }

    public String getThreatType() { return threatType; }
    public void setThreatType(String threatType) { this.threatType = threatType; }

    public String getSource() { return source; }
    public void setSource(String source) { this.source = source; }

    public Instant getAddedAt() { return addedAt; }
    public void setAddedAt(Instant addedAt) { this.addedAt = addedAt; }
}
