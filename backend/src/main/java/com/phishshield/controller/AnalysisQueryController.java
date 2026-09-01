package com.phishshield.controller;

import com.phishshield.dto.AnalysisResultDto;
import com.phishshield.dto.PaginatedAnalysesDto;
import com.phishshield.entity.Analysis;
import com.phishshield.enums.InputType;
import com.phishshield.enums.Verdict;
import com.phishshield.exception.ResourceNotFoundException;
import com.phishshield.repository.AnalysisRepository;
import com.phishshield.service.DeepScanService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/analyses")
public class AnalysisQueryController {

    private final AnalysisRepository analysisRepository;
    private final DeepScanService deepScanService;

    public AnalysisQueryController(AnalysisRepository analysisRepository, DeepScanService deepScanService) {
        this.analysisRepository = analysisRepository;
        this.deepScanService = deepScanService;
    }

    @GetMapping("/{id}")
    public ResponseEntity<AnalysisResultDto> getAnalysisById(@PathVariable("id") UUID id) {
        Analysis analysis = analysisRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Analysis not found with ID: " + id));
        return ResponseEntity.ok(deepScanService.toDto(analysis));
    }

    @GetMapping
    public ResponseEntity<PaginatedAnalysesDto> listAnalyses(
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "10") int size,
            @RequestParam(name = "verdict", required = false) Verdict verdict,
            @RequestParam(name = "inputType", required = false) InputType inputType
    ) {
        Pageable pageable = PageRequest.of(Math.max(0, page), Math.min(100, Math.max(1, size)), Sort.by("createdAt").descending());
        Page<Analysis> pageResult = analysisRepository.findByFilters(verdict, inputType, pageable);

        List<AnalysisResultDto> dtos = pageResult.getContent().stream()
                .map(deepScanService::toDto)
                .toList();

        PaginatedAnalysesDto response = new PaginatedAnalysesDto(
                dtos,
                pageResult.getTotalElements(),
                pageResult.getTotalPages(),
                pageResult.getNumber()
        );

        return ResponseEntity.ok(response);
    }
}
