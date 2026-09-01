package com.phishshield.service;

import com.lowagie.text.*;
import com.lowagie.text.pdf.*;
import com.phishshield.dto.AnalysisResultDto;
import com.phishshield.dto.IndicatorDto;
import org.springframework.stereotype.Service;

import java.awt.Color;
import java.io.ByteArrayOutputStream;
import java.time.format.DateTimeFormatter;

@Service
public class ReportService {

    public byte[] generatePdfReport(AnalysisResultDto result) {
        try (ByteArrayOutputStream baos = new ByteArrayOutputStream()) {
            Document document = new Document(PageSize.A4, 36, 36, 36, 36);
            PdfWriter.getInstance(document, baos);
            document.open();

            // Colors
            Color primaryDark = new Color(15, 23, 42);     // Slate 900
            Color brandAccent = new Color(14, 165, 233);    // Sky 500
            Color textMuted = new Color(100, 116, 139);    // Slate 500
            Color criticalRed = new Color(225, 29, 72);    // Rose 600
            Color highOrange = new Color(234, 88, 12);     // Orange 600
            Color suspiciousYellow = new Color(202, 138, 4); // Amber 600
            Color lowGreen = new Color(22, 163, 74);       // Emerald 600
            Color cardBg = new Color(248, 250, 252);

            // Fonts
            Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 20, primaryDark);
            Font subtitleFont = FontFactory.getFont(FontFactory.HELVETICA, 10, textMuted);
            Font sectionTitleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 13, primaryDark);
            Font boldFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 10, primaryDark);
            Font normalFont = FontFactory.getFont(FontFactory.HELVETICA, 9, primaryDark);
            Font footerFont = FontFactory.getFont(FontFactory.HELVETICA_OBLIQUE, 8, textMuted);

            // 1. Header
            Paragraph title = new Paragraph("PHISHSHIELD XAI", titleFont);
            title.setSpacingAfter(2);
            document.add(title);

            Paragraph subtitle = new Paragraph("Explainable Phishing Incident & Forensic Analysis Report", subtitleFont);
            subtitle.setSpacingAfter(15);
            document.add(subtitle);

            // Divider
            PdfPTable divider = new PdfPTable(1);
            divider.setWidthPercentage(100);
            PdfPCell dividerCell = new PdfPCell();
            dividerCell.setBackgroundColor(brandAccent);
            dividerCell.setFixedHeight(2f);
            dividerCell.setBorder(Rectangle.NO_BORDER);
            divider.addCell(dividerCell);
            divider.setSpacingAfter(15);
            document.add(divider);

            // 2. Executive Summary Banner
            PdfPTable summaryTable = new PdfPTable(4);
            summaryTable.setWidthPercentage(100);
            summaryTable.setWidths(new float[]{25f, 25f, 25f, 25f});
            summaryTable.setSpacingAfter(15);

            Color verdictColor = switch (result.getVerdict()) {
                case CRITICAL -> criticalRed;
                case HIGH_RISK -> highOrange;
                case SUSPICIOUS -> suspiciousYellow;
                case LOW_RISK -> lowGreen;
            };

            Font verdictFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12, verdictColor);
            Font scoreFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 14, verdictColor);

            addCardCell(summaryTable, "RISK SCORE", result.getRiskScore() + " / 100", scoreFont, cardBg);
            addCardCell(summaryTable, "VERDICT", result.getVerdict().name(), verdictFont, cardBg);
            addCardCell(summaryTable, "CONFIDENCE", String.format("%.0f%%", result.getConfidence() * 100), boldFont, cardBg);
            addCardCell(summaryTable, "ACTION", result.getRecommendedAction(), boldFont, cardBg);

            document.add(summaryTable);

            // 3. Metadata Table
            Paragraph metaHeading = new Paragraph("Investigation Metadata", sectionTitleFont);
            metaHeading.setSpacingAfter(8);
            document.add(metaHeading);

            PdfPTable metaTable = new PdfPTable(2);
            metaTable.setWidthPercentage(100);
            metaTable.setWidths(new float[]{30f, 70f});
            metaTable.setSpacingAfter(15);

            addMetaRow(metaTable, "Analysis ID:", result.getAnalysisId().toString(), normalFont, boldFont);
            addMetaRow(metaTable, "Target Input:", result.getNormalizedUrl() != null ? result.getNormalizedUrl() : "Email Payload", normalFont, boldFont);
            addMetaRow(metaTable, "Input Type / Mode:", result.getInputType() + " / " + result.getMode(), normalFont, boldFont);
            addMetaRow(metaTable, "AI/ML Model:", result.getModelVersion(), normalFont, boldFont);
            addMetaRow(metaTable, "Analysis Latency:", result.getLatencyMs() + " ms", normalFont, boldFont);
            addMetaRow(metaTable, "Timestamp:", result.getCreatedAt() != null ? DateTimeFormatter.ISO_INSTANT.format(result.getCreatedAt()) : "N/A", normalFont, boldFont);

            document.add(metaTable);

            // 4. Evidence & Explainability Breakdown
            Paragraph evidenceHeading = new Paragraph("Explainable Evidence Breakdown", sectionTitleFont);
            evidenceHeading.setSpacingAfter(8);
            document.add(evidenceHeading);

            PdfPTable indTable = new PdfPTable(5);
            indTable.setWidthPercentage(100);
            indTable.setWidths(new float[]{22f, 15f, 14f, 12f, 37f});
            indTable.setSpacingAfter(15);

            // Table Header
            String[] headers = {"Indicator Code", "Category", "Severity", "Points", "Evidence Details"};
            for (String h : headers) {
                PdfPCell cell = new PdfPCell(new Phrase(h, FontFactory.getFont(FontFactory.HELVETICA_BOLD, 9, Color.WHITE)));
                cell.setBackgroundColor(primaryDark);
                cell.setPadding(6);
                indTable.addCell(cell);
            }

            for (IndicatorDto ind : result.getIndicators()) {
                PdfPCell cCode = new PdfPCell(new Phrase(ind.getCode(), FontFactory.getFont(FontFactory.COURIER_BOLD, 8, primaryDark)));
                PdfPCell cCat = new PdfPCell(new Phrase(ind.getCategory().name(), normalFont));
                PdfPCell cSev = new PdfPCell(new Phrase(ind.getSeverity().name(), boldFont));
                PdfPCell cPts = new PdfPCell(new Phrase(String.format("%.1f", ind.getContribution()), normalFont));
                PdfPCell cEv = new PdfPCell(new Phrase(ind.getEvidence(), normalFont));

                cCode.setPadding(5);
                cCat.setPadding(5);
                cSev.setPadding(5);
                cPts.setPadding(5);
                cEv.setPadding(5);

                indTable.addCell(cCode);
                indTable.addCell(cCat);
                indTable.addCell(cSev);
                indTable.addCell(cPts);
                indTable.addCell(cEv);
            }

            document.add(indTable);

            // 5. Recommended Analyst Actions
            Paragraph actionHeading = new Paragraph("Incident Response & Mitigation Guidance", sectionTitleFont);
            actionHeading.setSpacingAfter(8);
            document.add(actionHeading);

            Paragraph actionDetails = new Paragraph(
                    "Recommended Strategy: " + result.getRecommendedAction() + "\n\n" +
                    "• In the event of HIGH_RISK or CRITICAL verdicts, immediately enforce DNS/URL block rules across perimeter firewalls and secure web gateways (SWG).\n" +
                    "• Notify recipient mailboxes, initiate mailbox search-and-purge operations, and revoke any active credentials submitted to destination endpoints.\n" +
                    "• For LOW_RISK items, continue routine telemetry logging. (Note: PhishShield never marks items as unconditionally 'Safe').",
                    normalFont
            );
            actionDetails.setSpacingAfter(20);
            document.add(actionDetails);

            // Footer
            Paragraph footer = new Paragraph(
                    "PhishShield XAI Forensic Engine • Generated automatically • Confidential Incident Report",
                    footerFont
            );
            footer.setAlignment(Element.ALIGN_CENTER);
            document.add(footer);

            document.close();
            return baos.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Failed to generate PDF report", e);
        }
    }

    private void addCardCell(PdfPTable table, String header, String value, Font valueFont, Color bg) {
        PdfPCell cell = new PdfPCell();
        cell.setBackgroundColor(bg);
        cell.setPadding(8);
        cell.setBorderColor(new Color(226, 232, 240));

        Paragraph pHeader = new Paragraph(header, FontFactory.getFont(FontFactory.HELVETICA_BOLD, 8, new Color(100, 116, 139)));
        Paragraph pValue = new Paragraph(value, valueFont);
        pValue.setSpacingBefore(3);

        cell.addElement(pHeader);
        cell.addElement(pValue);
        table.addCell(cell);
    }

    private void addMetaRow(PdfPTable table, String label, String value, Font labelFont, Font valueFont) {
        PdfPCell cell1 = new PdfPCell(new Phrase(label, labelFont));
        cell1.setPadding(4);
        cell1.setBorderColor(new Color(226, 232, 240));
        PdfPCell cell2 = new PdfPCell(new Phrase(value, valueFont));
        cell2.setPadding(4);
        cell2.setBorderColor(new Color(226, 232, 240));
        table.addCell(cell1);
        table.addCell(cell2);
    }
}
