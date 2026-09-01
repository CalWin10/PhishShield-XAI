package com.phishshield.repository;

import com.phishshield.entity.ThreatFeedEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ThreatFeedEntryRepository extends JpaRepository<ThreatFeedEntry, UUID> {
    Optional<ThreatFeedEntry> findByIndicatorTypeAndIndicatorValue(String indicatorType, String indicatorValue);
    List<ThreatFeedEntry> findByIndicatorValueIn(List<String> indicatorValues);
}
