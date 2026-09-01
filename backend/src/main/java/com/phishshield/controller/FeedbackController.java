package com.phishshield.controller;

import com.phishshield.dto.FeedbackRequest;
import com.phishshield.dto.FeedbackResponse;
import com.phishshield.entity.Feedback;
import com.phishshield.exception.InvalidRequestException;
import com.phishshield.exception.ResourceNotFoundException;
import com.phishshield.repository.AnalysisRepository;
import com.phishshield.repository.FeedbackRepository;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Set;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/analyses")
public class FeedbackController {

    private static final Set<String> VALID_LABELS = Set.of("PHISHING", "LEGITIMATE", "UNCERTAIN");

    private final AnalysisRepository analysisRepository;
    private final FeedbackRepository feedbackRepository;

    public FeedbackController(AnalysisRepository analysisRepository, FeedbackRepository feedbackRepository) {
        this.analysisRepository = analysisRepository;
        this.feedbackRepository = feedbackRepository;
    }

    @PostMapping("/{id}/feedback")
    public ResponseEntity<FeedbackResponse> submitFeedback(
            @PathVariable("id") UUID id,
            @Valid @RequestBody FeedbackRequest request
    ) {
        if (!analysisRepository.existsById(id)) {
            throw new ResourceNotFoundException("Analysis not found with ID: " + id);
        }

        String label = request.getActualLabel() != null ? request.getActualLabel().toUpperCase() : "";
        if (!VALID_LABELS.contains(label)) {
            throw new InvalidRequestException("Invalid actualLabel. Must be one of: PHISHING, LEGITIMATE, UNCERTAIN");
        }

        Feedback feedback = new Feedback();
        feedback.setAnalysisId(id);
        feedback.setActualLabel(label);
        feedback.setComment(request.getComment());

        Feedback saved = feedbackRepository.save(feedback);

        FeedbackResponse response = new FeedbackResponse(
                saved.getId(),
                saved.getAnalysisId(),
                saved.getActualLabel(),
                saved.getComment(),
                saved.getSubmittedAt()
        );

        return ResponseEntity.ok(response);
    }
}
