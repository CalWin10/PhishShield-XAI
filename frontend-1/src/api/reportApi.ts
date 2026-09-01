import { apiClient } from './client';
import { mockStore } from '@/lib/mockEngine';

export const reportApi = {
  /**
   * Download analysis PDF report
   * GET /api/v1/analyses/{analysisId}/report
   */
  async downloadReport(analysisId: string): Promise<{ blob: Blob; filename: string }> {
    let filename = `report-${analysisId}.pdf`;

    try {
      const response = await apiClient.get(`/analyses/${analysisId}/report`, {
        responseType: 'blob',
      });

      // Check Content-Disposition header for custom filename
      const contentDisposition = response.headers['content-disposition'];
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
        if (filenameMatch && filenameMatch[1]) {
          filename = filenameMatch[1].replace(/['"]/g, '');
        }
      }

      const blob = new Blob([response.data], { type: 'application/pdf' });
      return { blob, filename };
    } catch (err: any) {
      console.warn('Backend unavailable for PDF report download, generating client-side report:', err.message);
      const blob = mockStore.generateMockPdfBlob(analysisId);
      return { blob, filename };
    }
  },

  /**
   * Helper to trigger native browser file download
   */
  triggerBlobDownload(blob: Blob, filename: string) {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  },
};
