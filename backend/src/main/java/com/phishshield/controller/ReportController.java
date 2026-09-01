package com.phishshield.controller;

import com.phishshield.dto.AnalysisResultDto;
import com.phishshield.entity.Analysis;
import com.phishshield.exception.ResourceNotFoundException;
import com.phishshield.repository.AnalysisRepository;
import com.phishshield.service.DeepScanService;
import com.phishshield.service.ReportService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/analyses")
public class ReportController {

    private final AnalysisRepository analysisRepository;
    private final DeepScanService deepScanService;
    private final ReportService reportService;

    public ReportController(AnalysisRepository analysisRepository, DeepScanService deepScanService, ReportService reportService) {
        this.analysisRepository = analysisRepository;
        this.deepScanService = deepScanService;
        this.reportService = reportService;
    }

    @GetMapping("/{id}/report")
    public ResponseEntity<byte[]> downloadReport(@PathVariable("id") UUID id) {
        Analysis analysis = analysisRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Analysis not found with ID: " + id));

        AnalysisResultDto dto = deepScanService.toDto(analysis);
        byte[] pdfBytes = reportService.generatePdfReport(dto);

        String filename = "phishshield-incident-" + id.toString().substring(0, 8) + ".pdf";

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_PDF_VALUE)
                .body(pdfBytes);
    }
}
