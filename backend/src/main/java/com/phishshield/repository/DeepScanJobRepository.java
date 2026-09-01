package com.phishshield.repository;

import com.phishshield.entity.DeepScanJob;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface DeepScanJobRepository extends JpaRepository<DeepScanJob, UUID> {
    Optional<DeepScanJob> findByAnalysisId(UUID analysisId);
}
