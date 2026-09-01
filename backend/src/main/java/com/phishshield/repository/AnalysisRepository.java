package com.phishshield.repository;

import com.phishshield.entity.Analysis;
import com.phishshield.enums.InputType;
import com.phishshield.enums.Verdict;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface AnalysisRepository extends JpaRepository<Analysis, UUID> {

    @Query("SELECT a FROM Analysis a WHERE " +
           "(:verdict IS NULL OR a.verdict = :verdict) AND " +
           "(:inputType IS NULL OR a.inputType = :inputType) " +
           "ORDER BY a.createdAt DESC")
    Page<Analysis> findByFilters(
            @Param("verdict") Verdict verdict,
            @Param("inputType") InputType inputType,
            Pageable pageable
    );
}
