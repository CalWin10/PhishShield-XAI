package com.phishshield.dto;

import java.util.ArrayList;
import java.util.List;

public class PaginatedAnalysesDto {

    private List<AnalysisResultDto> items = new ArrayList<>();
    private long totalItems;
    private int totalPages;
    private int currentPage;

    public PaginatedAnalysesDto() {}

    public PaginatedAnalysesDto(List<AnalysisResultDto> items, long totalItems, int totalPages, int currentPage) {
        this.items = items;
        this.totalItems = totalItems;
        this.totalPages = totalPages;
        this.currentPage = currentPage;
    }

    public List<AnalysisResultDto> getItems() { return items; }
    public void setItems(List<AnalysisResultDto> items) { this.items = items; }

    public long getTotalItems() { return totalItems; }
    public void setTotalItems(long totalItems) { this.totalItems = totalItems; }

    public int getTotalPages() { return totalPages; }
    public void setTotalPages(int totalPages) { this.totalPages = totalPages; }

    public int getCurrentPage() { return currentPage; }
    public void setCurrentPage(int currentPage) { this.currentPage = currentPage; }
}
